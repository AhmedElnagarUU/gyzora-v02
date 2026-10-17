# 02 - Architecture

Source of truth for structure, packages and patterns. If a slice conflicts with this file, STOP and ask.

## 1. Packages
| Package | Status | Added in |
|---|---|---|
| next 16.4.0, react 19.3.0, better-auth ^1.7.7, next-intl ^4.14.9, mongoose ^9.11.2 (raw driver collections), zod ^4.6.7, tailwindcss ^4 | installed - do not change versions | - |
| lucide-react | add (PRD requires it; add to CODE_RULES section 4) | S0 |
| @aws-sdk/client-s3, @aws-sdk/s3-request-presigner | add (already approved in CODE_RULES) | S4 |
| @polar-sh/sdk | add (already approved) | S8 |
| Tests | Node built-in `node:test` only | - |
| ANYTHING ELSE | forbidden without owner approval (write the request in the PR) | - |

No Server Actions. No ORM models. No state libraries. No CSS-in-JS. No form libraries (plain React state + zod).

## 2. Folder structure (target)
```
src/
  app/
    [locale]/layout.tsx            ROOT layout: <html lang dir>, fonts, NextIntlClientProvider
    [locale]/(marketing)/...       landing
    [locale]/auth/...              sign-in, sign-up
    [locale]/dashboard/...         user area (layout = server guard + DashboardShell)
    [locale]/admin/...             owner area (layout = requireAdmin)
    [locale]/s/[siteSlug]/[[...path]]/page.tsx   public published site
    [locale]/templates/...         public sample previews
    api/...                        route handlers (thin)
  features/
    auth/        lib (auth.ts, auth-client.ts, session.ts, require-admin.ts), components, schemas
    dashboard/   components (shell, sidebar, banners)
    sites/       service.ts, repository.ts, schemas/, slug.ts, components/
    templates/   catalog, renderer, sample-data (existing, immutable)
    projects/    service.ts, repository.ts, schemas/, components/
    images/      s3-client.ts, keys.ts, presign-service.ts, public-url.ts, components/image-uploader.tsx
    publishing/  snapshot.ts, validate-publishable.ts, service.ts, repository.ts
    billing/     entitlement.ts (pure), polar.ts, webhook.ts, wallet/, components/
    admin/       service.ts, audit.ts, components/
    feedback/    service.ts, schemas, components/
    landing/     (existing)
  shared/
    config/env.ts        the ONLY place that reads process.env
    db/mongodb.ts, indexes.ts
    http/api-response.ts, with-session.ts, with-admin.ts, rate-limit.ts
    ui/                  only components used by 2+ features (language-switcher, toast, confirm-dialog, ...)
  i18n/, messages/en.json, messages/ar.json
scripts/                 one-off node scripts (grant-admin, dev helpers)
```
Rules: feature code may import from `shared/` and from another feature's public files (service/types) but never another feature's `repository.ts`. Max ~250 lines per file; split by responsibility.

## 3. Layering (strict)
`route handler (parse + auth + map errors)` -> `service (business rules, ownership, orchestration)` -> `repository (the only code touching Mongo collections)`.
- Handlers contain no business logic and no DB calls.
- Services take plain inputs (already zod-parsed) and return typed results or throw typed errors (`AppError(code, status, fields?)`).
- Pure logic (entitlement, slug, snapshot build, validation, key parsing) lives in its own file with NO imports of `next/*`, DB or `@/` aliases (so `node:test` can import it; mirror how `catalog.test.mjs` imports things).

## 4. API handler skeleton
```ts
// src/app/api/<thing>/route.ts
export const POST = withSession(async ({ session, req }) => {
  const input = createThingSchema.parse(await readJson(req));   // zod -> VALIDATION_FAILED with fields
  const result = await thingService.create(session.user.id, input); // owner comes from session ONLY
  return ok(result, 201);
});
```
- `withSession` / `withAdmin` / `withCron` (shared/http) do auth, catch `AppError`/`ZodError`/unknown, and return the unified envelope (see 04). Unknown errors -> log server-side, return `INTERNAL` with no details.
- Resource lookups are always ownership-scoped: `findSiteByOwnerId(session.user.id)`, `findProject({ _id, siteId: site._id })`. Invalid ObjectId -> NOT_FOUND.

## 5. Environment
- `shared/config/env.ts` exposes lazy getters per group (`getDbEnv()`, `getAuthEnv()`, `getS3Env()`, `getPolarEnv()`, `getBillingEnv()`, `getWalletEnv()`, `getCronEnv()`). Each validates with zod on first call and throws a clear error naming the missing variable (never the value). Do NOT validate at import time (the build must work without secrets).
- Any new variable: add to `env.ts`, `.env.example` (with comment), and `docs/DEPLOYMENT.md` (S10). Public (`NEXT_PUBLIC_*`) only when truly needed in the browser.

## 6. i18n and RTL
- Root layout is `[locale]/layout.tsx` and renders `<html lang={locale} dir={locale==='ar'?'rtl':'ltr'}>`.
- All UI text from `messages/{en,ar}.json`, namespaced: `common, errors, auth, landing, dashboard, siteSetup, templatePreview, editor, projects, publish, billing, admin, feedback`. Both files must always have identical keys (test enforces).
- API errors are CODES; the UI maps `errors.<CODE>` and `errors.field.<code>`. Never show raw server text.
- Logical CSS only (`ms-`, `me-`, `ps-`, `pe-`, `text-start`, `start-`, `end-`, `border-s`). Never `ml/mr/pl/pr/left/right/text-left/text-right` for layout. Icons that imply direction get `rtl:rotate-180`.
- Customer content is explicit `{ en, ar }`. Locale switching never copies text. Missing optional text => hide the field/section. Required missing => blocks publish (see publishing).

## 7. Rendering modes
`TemplateRenderer` modes: `sample` (templates demo), `draft` (S2: Site.data + projects from DB), `published` (S5: snapshot only). The renderer receives data and a `hrefForPage` builder from its caller; it never fetches.
Base paths: sample `/{locale}/templates/{id}`, draft `/{locale}/dashboard/site/preview`, published `/{locale}/s/{slug}`.

## 8. Images (S3 bucket)
- Upload: browser -> `POST /api/uploads/presign` -> presigned PUT URL -> browser PUTs file to bucket -> client sends the returned `key` inside the project/site save payload.
- Server never trusts a key: on save it must (a) match `sites/{ownSiteId}/...` (or `receipts/{ownUserId}/...`), and (b) exist in the bucket (HeadObject) with allowed content-type and size <= limit; otherwise `UPLOAD_REJECTED`.
- Keys: `sites/{siteId}/{kind}/{uuid}.{ext}` (kind = logo | cover | gallery). Receipts (S9): `receipts/{userId}/{uuid}.{ext}` and are PRIVATE (presigned GET only).
- DB stores keys only. `getPublicImageUrl(key)` builds URL from `S3_PUBLIC_BASE_URL`.
- Allowed types: jpeg, png, webp. Max 5 MB. Gallery max 12 per project.
- Deletion: when a project/image is removed, delete only keys NOT referenced by the published snapshot (the public site must not break). On each successful publish, best-effort delete keys that were in the old snapshot, are not in the new one and are not in any draft. Failures are logged, never block the user.
- Illustrative template images stay separate from customer images (existing behaviour). Pexels is NOT part of this plan (see 06).

## 9. Publishing and entitlement
- Publish = build a complete value snapshot (site data + projects + templateId + slug + locales + imageKeys) and replace `site.published` in ONE atomic `updateOne`. Failure leaves the old snapshot and returns an error. Public route reads only `site.published`.
- `getPublishEntitlement(site, now)` (pure, `features/billing/entitlement.ts`) is the single source of truth. Nobody else computes trial days.
- Trial: starts at FIRST successful publish (`trialStartedAt`), 10 days, never reset. After that a site stays published only with active Polar subscription, active manual Pro, or inside the 2-day grace after a failed payment.
- Enforcement points: publish API, public route (checked at request time), daily cron unpublish, dashboard banners.

## 10. Security checklist (every endpoint)
session validated server-side; admin endpoints use `withAdmin`; zod `.strict()` on bodies; ownership-scoped queries; no client-supplied ids for ownership; generic error messages; no secrets in responses or logs; webhooks verify signatures; uploads validated server-side; rate-limited where listed (S6/S10).

## 11. Testing strategy
- Unit (node:test): pure modules (entitlement, slug, snapshot, validation, key ownership, i18n parity, route manifest).
- Integration: run against `MONGODB_TEST_URL` (separate DB, never the dev DB). If the variable is missing the suite prints `SKIPPED: MONGODB_TEST_URL not set` and the PR must list it as UNVERIFIED.
- UI: manual click-paths (01) recorded in the PR for EN and AR. Browser automation is not installed; adding Playwright needs owner approval (06, D-10).
- `npm run test` runs everything (S0 creates the script).
