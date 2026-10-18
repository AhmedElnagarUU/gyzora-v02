# S1: Dashboard shell and create-site flow (end to end)

## Goal and user story
As a signed-in customer I land on a dashboard, click "Create your site", enter my business name and category, see all five templates with a real preview, select one, and end up on my dashboard with my site listed. One site per user.

## Depends on
S0 merged. Owner: wiped dev `sites` collection (07 H), test DB (07 G).

## Read first
`docs/plan/01-JOURNEY-MAP.md`; `03-DATA-MODEL.md` (sites); `src/features/sites/*`; `src/features/templates/{catalog.ts,types.ts,sample-data.ts}` and `components/*`; `src/app/[locale]/dashboard/**`; `src/app/[locale]/templates/**`; `src/app/api/sites/route.ts`; `docs/template-design/README.md`.

## In scope / out of scope
In: shell + nav, overview, create flow, gallery fixes, site document redefinition, slug, localized
template names, edit business details + delete the site (owner-requested 2026-10-18; part of S3's
editor pulled forward onto S3's route).
Out: preview of my own site (S2), the bilingual content editor (S3), publishing.

## Files
Create: `src/features/dashboard/components/{dashboard-shell,sidebar,user-menu}.tsx`, `src/features/sites/{service.ts,slug.ts,slug.test.mjs}`, `src/features/sites/components/{site-overview-card,site-profile-fields,edit-site-form,delete-site-button}.tsx`, `src/features/sites/{model.ts,site-data.ts,site-data.test.mjs,field-errors.ts,field-errors.test.mjs}`, `src/features/sites/schemas/update-site-schema.ts` (+ test), `src/features/sites/create-site.integration.test.mjs`, `src/app/[locale]/dashboard/site/edit/page.tsx`, `src/app/api/sites/me/route.ts`.
Modify: `src/features/sites/{types/site.ts,repository.ts,create-site.ts (becomes service.ts),templates.ts (delete)}`, schemas, `dashboard/layout.tsx`, `dashboard/page.tsx`, `site-create/page.tsx`, `site-create/templates/page.tsx`, `template-gallery.tsx`, `create-site-form.tsx`, `template-preview-bar.tsx`, `template-preview-shell.tsx`, `catalog.ts` (localized names/summaries), `globals.css` (undefined gallery/preview classes), `messages/*.json`, `src/shared/db/{indexes.ts (slug unique),mongodb.ts (duplicateKeyPattern)}`, `src/features/templates/types.ts` (export `SiteData`/`StoredSiteData` if missing), `src/app/[locale]/templates/[templateId]/[[...slug]]/page.tsx` (session-aware CTA → `force-dynamic`), `package.json` (test script).

## Tasks
1. Site document per `03-DATA-MODEL.md`: `ownerUserId, templateId, slug, slugLocked:false, status:'draft', unpublishReason:null, data, revision:0, draftUpdatedAt, published:null, trialStartedAt:null, billing:{manualProUntil:null, polar:null}, createdAt, updatedAt`. Remove `profile`, `content`, `buildTemplateContent`. Build `data` from the wizard input in the `SiteData` shape (explicit `en`/`ar`; use the existing wizard fields and mapping; deduplicate the repeated `getLocale/localizedValue/splitLines/profile mapping` helpers into one place — `site-data.ts`). Write through `src/features/sites/model.ts` (Mongoose schema/model, `timestamps`, no `versionKey`, `_id:false` on nested/localized subdocs, `published` Mixed) — `CODE_RULES.md` data-access rule added by the owner 2026-10-18.
2. `slug.ts` (pure + tested): lowercase, keep `a-z0-9`, collapse others to `-`, trim `-`, 3-40 chars; if the result is shorter than 3 (e.g. Arabic-only names) use `site-<6 random a-z0-9>`; reserved words (`admin, api, auth, dashboard, templates, s, www, app, en, ar, login, signup, static`) get a suffix. Uniqueness: try `base`, `base-2`, `base-3`...; the unique index is the authority: on 11000 retry up to 5 times, then fail with `INTERNAL`.
3. `service.createSiteForOwner(ownerUserId, input)`; route handler `POST /api/sites` via `withSession` (body zod `.strict()`, catalog-validated `templateId`; response per 04). `GET /api/sites/me` (own site or NOT_FOUND). Also `PATCH /api/sites/me` (`{revision, data:{profile}}`, strict; revision-filtered write → `STALE_REVISION`, no site → `NOT_FOUND`) and `DELETE /api/sites/me` (204, `NOT_FOUND`) — see task 13.
4. Dashboard shell (see 01): header, sidebar (only "Overview" now), user menu with Sign out, language switcher, mobile drawer, keyboard accessible. `dashboard/layout.tsx` keeps the server guard then wraps in the shell.
5. Overview page (server component): no site -> empty state with CTA "Create your site" linking to `/{locale}/dashboard/site-create`; site -> `SiteOverviewCard` (business name in current locale with fallback to the other ONLY for this display, localized template name, status badge "Draft", created date) plus "Edit details" → `/{locale}/dashboard/site/edit` and "Delete website" (task 13). After creation redirect here with `?created=1` and show a success message; after deletion `?deleted=1`.
6. Create step 1 (`site-create`): server guard - if a site exists redirect to `/dashboard`. Add "Back to dashboard" link. Keep fields as they are (name + category required; other profile fields optional, collapsible). Keep sessionStorage draft.
7. Gallery (`templates`): same guard. If there is no wizard draft, redirect to step 1. Five cards with REAL styling (fix the undefined CSS classes): thumbnail (CSS mini-layout or first illustrative image of the template), localized name + summary (add real Arabic names/summaries to `catalog.ts`; Arabic wording flagged for owner review), buttons: "Preview" (opens `/{locale}/templates/{id}?name=...&category=...` in a new tab, `rel="noopener"`) and "Select this template". Remove the dead `?preview=` branch. Support `?highlight={id}`: that card is visually highlighted and its Select button focused (no side effects on GET).
8. Select: POST `/api/sites` with draft + `templateId`; button shows loading and all selects are disabled while pending; success -> clear draft, `router.replace('/{locale}/dashboard?created=1')`; 409 -> message + link to dashboard; 400 -> back to step 1 with field errors; other -> generic retry message.
9. Template sample preview: bar's "Use this template" link goes to `/{locale}/dashboard/site-create/templates?highlight={id}` (for signed-out visitors it goes to sign-up). `name`/`category` query params: max 80 chars, rendered as plain text, applied to the sample's company name/category for display only, never persisted (D-14). "Sample" label stays visible.
10. Messages (EN+AR): `dashboard.*`, `siteSetup.*` additions, `errors.*`.
11. Tests (`npm run test`): slug unit tests (Arabic-only, reserved, length, collisions via injected `exists`), wizard->SiteData mapping unit test, `?fields=` parser tests, update-schema tests, edit-merge tests (editing one locale never rewrites the other), integration (if test DB): one site per user, concurrent creation, unique slug under concurrent creation with the same name.
12. STATUS + PR.
13. Edit + delete (owner-requested 2026-10-18, not in the original slice): `/dashboard/site/edit` (server guard, load own site, redirect when there is none) reusing the wizard's field markup via `site-profile-fields.tsx`; save through `PATCH /api/sites/me` with the full merged profile for the viewed locale only (empty clears that locale's slot, list items merge index-wise, the other locale is never rewritten) and `STALE_REVISION` handled with a reload action; "Delete website" with an inline confirm calling `DELETE /api/sites/me` then `router.replace('/{locale}/dashboard?deleted=1')`. No cascade (nothing references a site yet). The full bilingual editor (language tabs, stable item ids, reordering, uploads) stays in S3 on the same route and endpoint.

## Acceptance
- CP-1 passes in EN and AR (<= 7 clicks after sign-up), ending on Overview showing the site.
- Overview of a user with a site has no "Create" CTA; typing `/dashboard/site-create` redirects to `/dashboard`.
- Every dashboard page has the shell; sidebar has aria-current and works by keyboard; mobile drawer works at 375px.
- Gallery cards show Arabic names in `/ar`; preview opens in a new tab; "Use this template" lands on the highlighted card; no console errors; no unstyled elements.
- Preview never writes to the DB (show DB count before/after).
- API: all 5 template ids create a site for 5 different test users; unsupported id -> 400; second creation -> 409; two parallel requests -> one 201 + one 409.
- Persisted doc contains `templateId` and `data` and no template content (show the document with secrets removed).
- Edit details: saving in `/en` changes only the `en` values (the `ar` values stay byte-identical, same for `/ar`); a save from a second tab with a stale revision returns `STALE_REVISION`; reloading shows the saved values.
- Delete: after confirming, the dashboard shows the empty state and a new site can be created (the `ownerUserId` unique index no longer blocks).
- lint, tsc, test, build pass.

## Do NOT
Add links to pages that do not exist yet (preview of my own site S2, publishing S5), add an editor beyond the business-details form (the bilingual content editor is S3), store template content in the site, accept `ownerUserId` from the client, keep `profile`/`content`.
