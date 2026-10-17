# S5: Publish, public site, and trial rule

## Goal and user story
As a customer I publish my site and get a public link that works for anyone. I keep editing safely: visitors see my last published version until I publish again. My free publish period is 10 days from my first publish.

## Depends on
S4 merged.

## Read first
`02-ARCHITECTURE.md` sections 7, 9; `03-DATA-MODEL.md` (PublishedSnapshot, billing); `04-API-CONTRACT.md`; `docs/template-engine/README.md` (publication section); template renderer `published` mode.

## Files
Create: `src/features/billing/entitlement.ts` (+ `entitlement.test.mjs`), `src/features/publishing/{snapshot,validate-publishable,service,repository}.ts` (+ tests), `src/app/api/publish/route.ts`, `src/app/api/publish/status/route.ts`, `src/app/api/unpublish/route.ts`, `src/app/api/sites/me/slug/route.ts`, `src/app/[locale]/dashboard/site/publish/page.tsx`, `src/features/publishing/components/{publish-panel,publish-checklist,slug-form,trial-badge}.tsx`, `src/app/[locale]/s/[siteSlug]/[[...path]]/page.tsx`, `src/features/dashboard/components/entitlement-banner.tsx`.
Modify: `env.ts` (`getBillingEnv`: `TRIAL_DAYS` default 10, `GRACE_DAYS` default 2), `indexes.ts` (`sites.status`), overview card, sidebar, messages, `.env.example`.

## Tasks
1. `getPublishEntitlement(site, now)` pure. Returns `{state, canPublish, canServe, trialEndsAt, graceEndsAt, daysLeft}` where `state` is one of `trial_available` (never published), `trialing`, `active_manual`, `active_polar`, `grace`, `expired`. Rules in order: manual Pro (`billing.manualProUntil > now`) -> `active_manual`; Polar `active`, or `canceled` with `currentPeriodEnd > now` -> `active_polar`; Polar `past_due` and `now < pastDueSince + GRACE_DAYS` -> `grace`; `trialStartedAt` null -> `trial_available`; `now < trialStartedAt + TRIAL_DAYS` -> `trialing`; else `expired`. `canPublish`/`canServe` true for all but `expired`. Table-driven tests for every branch and boundary.
2. `validate-publishable(site, projects)` pure: for every ACTIVE locale require company name, category, description; contact needs email or phone; at least one service with a title in each active locale. Returns issues `[{path, code, fixHref}]` (fix links point to the editor or project edit page). No projects = warning only.
3. `buildSnapshot(site, projects)` pure: complete values (data, projects as `ProjectSnapshot` with slug as id, locales, templateId, slug, imageKeys, publishedAt, sourceRevision). Test: snapshot is deep-copied (mutating the site afterwards does not change it).
4. Publish service: load OWN site, check entitlement (`ENTITLEMENT_REQUIRED` 402), validate (`NOT_PUBLISHABLE` 422), build snapshot, then ONE atomic update using an aggregation-pipeline update: `$set { published: snapshot, status: 'published', unpublishReason: null, slugLocked: true, trialStartedAt: { $ifNull: ['$trialStartedAt', now] }, updatedAt: now }` filtered by `{_id, ownerUserId}`. If it throws or matches 0, return an error (never success). Afterwards, best-effort delete S3 keys that were in the old snapshot and are in neither the new snapshot nor any current draft project/logo.
5. Unpublish service: `status: 'unpublished'`, `unpublishReason: 'manual'`, keep `published` and `trialStartedAt`. Re-publishing later is allowed (trial clock keeps running).
6. `PATCH /api/sites/me/slug`: only when `slugLocked` is false; same rules as the generator; unique index conflict -> `SLUG_TAKEN`.
7. Public route `/{locale}/s/{siteSlug}/[[...path]]`: load by slug with projection of `status`, `published`, `trialStartedAt`, `billing`; serve ONLY if `status==='published'`, `published` exists and `canServe`; otherwise `notFound()` (same response for missing/unpublished/expired: no leaks). Locale not in `published.locales` -> redirect to its first locale. Resolve page/project from the snapshot only (unknown project -> 404). Render `TemplateRenderer mode="published"` with snapshot data, `hrefForPage` under `/{locale}/s/{slug}`. Metadata (title/description from snapshot, localized), `dynamic = 'force-dynamic'` (no caching until measured). Visitors get the language switcher only for published locales.
8. Publish page: status, entitlement badge ("Free trial: N days left"), checklist of issues with fix links, slug form (disabled with explanation once locked, shows full public URL), Publish/Update button (label depends on status), Unpublish with confirm dialog, public URL with Copy and "Open in new tab", "You have unpublished changes" indicator (`draftUpdatedAt > published.publishedAt`), last published time. Before the first publish show clearly "10 days free from your first publish".
9. Dashboard: overview card gets Publish status, public link, Edit/Preview/Publish buttons; `EntitlementBanner` for `trialing` with <= 3 days, `expired`, `grace` (links to Billing only after S8: until then show text without a link).
10. Add "Publish" to the sidebar. Messages EN+AR.
11. Tests: entitlement (all branches), validation, snapshot immutability, service with injected repository: failing update -> old snapshot intact and error returned; integration: editing draft after publish does not change `published`; public lookup by slug returns nothing for draft/unpublished; user B cannot publish/unpublish A's site (they only ever act on their own); `trialStartedAt` set once across two publishes.

## Acceptance
- CP-5 passes in EN and AR (public link opened in a private window).
- After publishing, edit content and add a project: public site unchanged; "unpublished changes" shows; Publish again: public updated.
- Unpublish -> public URL is 404; Publish again works; `trialStartedAt` unchanged (show document).
- Simulated DB failure during publish -> error shown and previous public version still served.
- Missing required Arabic fields while Arabic is active -> checklist blocks publish with fix links; with Arabic inactive it does not.
- Slug editable before first publish, locked after.
- Public pages work in EN/AR, mobile, with RTL; unknown path/project -> 404.
- lint, tsc, test, build pass.

## Do NOT
Read the draft in the public route, cache public pages, trigger billing/Polar here, expose why a site is unavailable to visitors.
