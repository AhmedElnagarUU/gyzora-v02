# S8: Polar billing and trial enforcement

## Goal and user story
As a customer whose free period is ending I subscribe monthly and my site stays published; if I stop paying, my site is unpublished after the grace period, but I keep my data and can subscribe again.

## Depends on / prerequisites
S5, S6 merged. Owner: Polar sandbox product/token/webhook and a daily scheduler (07 D).

## Read first
Polar official docs: checkout sessions, customer portal sessions, webhooks (signature validation helper in the SDK), subscription lifecycle and statuses, sandbox. Verify method names in `node_modules/@polar-sh/sdk` types. `features/billing/entitlement.ts`; `03-DATA-MODEL.md` (PolarState); D-05, D-06, D-11.

## Files
Create: `src/features/billing/{polar,webhook,apply-polar-event,service}.ts` (+ `apply-polar-event.test.mjs`), `src/app/api/billing/{status,checkout,portal}/route.ts`, `src/app/api/webhooks/polar/route.ts`, `src/app/api/cron/entitlements/route.ts`, `src/shared/http/with-cron.ts`, `src/features/billing/components/{billing-panel,checkout-return-poller}.tsx`, `src/app/[locale]/dashboard/billing/page.tsx`, `scripts/dev-set-trial-start.mjs` (refuses to run when `NODE_ENV=production`).
Modify: `package.json` (+ `@polar-sh/sdk`), `env.ts` (`getPolarEnv`, `getCronEnv`), `entitlement-banner.tsx` (links to Billing), sidebar ("Billing"), messages, `.env.example`.

## Tasks
1. Install `@polar-sh/sdk`. `polar.ts`: lazy client using `POLAR_SERVER` (sandbox | production) and `POLAR_ACCESS_TOKEN`.
2. `POST /api/billing/checkout`: needs an own site (`NO_SITE`); rate limit 5/hour/user (use S6 limiter); create a Polar checkout for `POLAR_PRODUCT_ID` with the customer identified by our user id (external customer id / metadata, per docs), success URL `/{locale}/dashboard/billing?checkout=return`; return `{url}`.
3. `POST /api/billing/portal`: customer portal session for the stored customer; `NOT_FOUND` if none.
4. Webhook `POST /api/webhooks/polar`: read the RAW body, validate signature with the SDK helper and `POLAR_WEBHOOK_SECRET`; invalid -> 400 with no detail. Handle subscription created/updated/active/canceled/uncanceled/revoked/past_due events (names per docs). Map the event to the site via the external customer id/metadata; unknown user -> 200 no-op (log). `applyPolarEvent(site.billing.polar, event)` is PURE and returns the new `PolarState`: ignore events older than `providerUpdatedAt`; `active` -> status active + `currentPeriodEnd`; cancel-at-period-end -> `cancelAtPeriodEnd=true` and still active until `currentPeriodEnd`; `past_due` -> set `pastDueSince` once; `revoked`/ended -> status `ended`; recovery clears `pastDueSince`. Persist with `$set billing.polar`. Processing error -> 500 so Polar retries. Webhook is the ONLY writer of Polar state.
5. `GET /api/billing/status`: entitlement + readable subscription info (no tokens).
6. Billing page: shows state (trial days left / active until / canceled-ends-on / grace until / expired), price label from `BILLING_PRICE_LABEL`, buttons: Subscribe (checkout redirect), Manage subscription (portal). On return from checkout show "Processing payment..." and poll `/api/billing/status` every 3 s for up to 30 s until active; then success, else "this can take a minute, refresh later". Never trust the query param.
7. Cron `POST /api/cron/entitlements` guarded by `withCron` (`Authorization: Bearer CRON_SECRET`, constant-time compare): for every `status:'published'` site whose entitlement `canServe` is false, set `status:'unpublished'` and `unpublishReason` = `trial_expired` | `subscription_ended` | `payment_failed`; return the count. Idempotent.
8. Banners: trial ending (<= 3 days), expired (site unpublished: "Your site is offline. Subscribe to publish again."), grace ("Payment failed, site stays online until <date>"). All link to Billing.
9. `scripts/dev-set-trial-start.mjs <email> <daysAgo>` to simulate expiry in dev.
10. Tests: `applyPolarEvent` (ordering, cancel-at-period-end, past_due -> grace -> expired, recovery, revoked), signature failure -> 400, cron unpublishes expired but not trialing/active/grace/manual-Pro sites (integration), `withCron` rejects missing/wrong secret.

## Acceptance
- CP-6 passes in EN and AR (use the dev script to expire a trial).
- Sandbox purchase: after paying, Billing shows active within ~30 s and publish works; cancel in the portal -> still active until period end.
- Replaying the same webhook twice or out of order does not corrupt state (show states).
- Wrong signature -> 400, no data change. Cron without the secret -> 401.
- An expired site: public URL 404 immediately (S5 check), cron marks it unpublished, editor/projects still work, Publish returns `ENTITLEMENT_REQUIRED`.
- No Polar token/secret in any client bundle or response.
- lint, tsc, test, build pass.

## Do NOT
Trust the checkout return URL, write Polar state from anywhere except the webhook, add other gateways, auto-republish after payment.
