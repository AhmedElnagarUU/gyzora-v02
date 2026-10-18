## Slice
S1: Dashboard shell and create-site flow (end to end)

Merged to `main` by fast-forward on 2026-10-18 (owner-approved). The plan was updated to mirror the
shipped API: `04-API-CONTRACT.md` gained `DELETE /api/sites/me` and the S1 scope on `PATCH
/api/sites/me` (and `POST /api/sites` now documents `companyName`, not `businessName`); the S1
slice documents tasks 1/3/5/11/13 as built; the S3 slice was rewritten from "create these files"
to "extend what S1 shipped".

## Summary
A signed-in user now lands on a dashboard shell (header, sidebar with "Overview", user menu,
language switcher, mobile drawer), sees either an empty state with "Create your site" or their
site card, walks the create flow (business name + category → five styled templates with localized
names → select), and ends up back on the dashboard with the site listed and a success message.
One site per user is enforced by the `sites.ownerUserId` unique index. The `sites` document is
redefined per `03-DATA-MODEL.md` (`ownerUserId, templateId, slug, slugLocked, status,
unpublishReason, data, revision, draftUpdatedAt, published, trialStartedAt, billing`); the legacy
`profile`/`content`/`buildTemplateContent` fields are gone. Slugs are generated and race-safe
(`slug_unique`). Template names/summaries are localized in the catalog and rendered on the
gallery, the overview card and the preview bar.

**Owner-requested additions in this branch (beyond the slice):**
1. **Write through a Mongoose model** — `CODE_RULES.md` gained a data-access rule mid-slice
   (2026-10-18); the owner chose "Refactor S1 now". `src/features/sites/model.ts` holds the
   schema/model, `repository.ts` writes through it (commit `6280060`).
2. **Edit + delete the site from the dashboard** — the owner reported that after creating a site
   there was no way to change or delete it. The overview card now has "Edit details"
   (`/dashboard/site/edit`, the route S3 reserves for its editor) and "Delete website" with an
   inline confirm (commit `27a4978`). This deliberately pulls a slice of S3 forward; see
   "Deviations" 11–13 and "Questions for the owner".

## Acceptance checklist (evidence required for each)
- [ ] CP-1 create flow EN and AR, ≤7 clicks — **UNVERIFIED (needs owner, no browser/session here)**.
  Code path verified: `dashboard` empty state → `site-create` (guard redirects to `/dashboard`
  when a site exists) → `site-create/templates` (guard redirects to step 1 without a draft) →
  `POST /api/sites` → `router.replace('/{locale}/dashboard?created=1')`. Observed evidence: the
  owner's own run created a site (a `sites` doc with the new S1 shape was read back on
  2026-10-18 14:38, before the model refactor). Steps in "UNVERIFIED items" 1.
- [x] Overview with a site has no "Create" CTA; typing `/dashboard/site-create` redirects to
  `/dashboard` — evidence (code): `dashboard/page.tsx` renders `SiteOverviewCard` when a site
  exists and the CTA only in the `site:` else-branch; `site-create/page.tsx` redirects when a
  site exists. Signed-in runtime behaviour is covered by the same code path as CP-1 (UNVERIFIED,
  no session).
- [x] Every dashboard page has the shell; sidebar has `aria-current` and keyboard support;
  mobile drawer at 375px — evidence (code): all four dashboard pages
  (`dashboard`, `site-create`, `site-create/templates`, `site/edit`) render inside
  `dashboard/layout.tsx` → `DashboardShell`; `sidebar.tsx` sets `aria-current="page"` on the
  active item, the drawer is a labelled `<dialog>`-free disclosure with a 44px target and
  `focus-visible` rings. Visual/keyboard check at 375px: **UNVERIFIED (no browser)**.
- [x] Gallery cards show Arabic names in `/ar`; preview opens in a new tab; "Use this template"
  lands on the highlighted card; no unstyled elements — evidence: `catalog.test.mjs` asserts every
  template has explicit `name`/`summary` in both locales and that `name.ar !== name.en` →
  `npm run test` ✓; the preview bar link is
  `/{locale}/dashboard/site-create/templates?highlight={id}` (and sign-up for signed-out
  visitors); `/ar/templates/atelier` → `200`. The undefined CSS classes named in the slice were
  replaced by real Tailwind styling (no `gallery-*`/`preview-*` dead classes remain: 0 matches in
  `globals.css` or the components).
- [x] Preview never writes to the DB (count before/after) — evidence (2026-10-18): `sites`
  count `1 → 1` across `/en/templates/atelier`, `/ar/templates/atelier` (signed-out) and
  `?name=&category=` fetches; preview pages only read the catalog.
- [ ] API: 5 template ids create for 5 users; unsupported id → 400; second creation → 409; two
  parallel requests → one 201 + one 409 — **UNVERIFIED (no `MONGODB_TEST_URL`)**; the three tests
  exist in `create-site.integration.test.mjs` (one site per user, concurrent creation, same-name
  unique slug) and are reported as skipped. Unauthenticated/validation evidence below.
- [ ] Persisted doc contains `templateId` and `data`, and no template content — partially verified
  by reading the owner's real doc (2026-10-18, before the model refactor): `data.profile` only, no
  `profile`/`content`/`buildTemplateContent`/`pageCopy`/`projects` keys, `status: 'draft'`,
  `revision: 0`, `slugLocked: false`, `published: null`. The `sites` collection is empty as of the
  end of this session (see "Observations"), so re-verification needs one more create click.
- [x] lint, tsc, test, build pass — see "Commands".

## HTTP evidence (dev server :3000, 2026-10-18, signed out)
```
/en/dashboard -> 307 /en/auth/sign-in            /ar/dashboard -> 307 /ar/auth/sign-in
/en/dashboard/site-create -> 307 sign-in         /ar/dashboard/site-create -> 307 sign-in
/en/dashboard/site-create/templates -> 307       /ar/dashboard/site-create/templates -> 307
/en/dashboard/site/edit -> 307 sign-in           /ar/dashboard/site/edit -> 307 sign-in
/en/templates/atelier -> 200                     /ar/templates/atelier -> 200
/en/templates/nope -> 404
/en/templates/atelier?name=<b>Bold</b>&category=Test -> 200 (rendered as escaped text)
POST   /api/sites       (no session) -> 401 {"error":{"code":"UNAUTHENTICATED"}}
GET    /api/sites/me    (no session) -> 401
PATCH  /api/sites/me    (no session) -> 401
DELETE /api/sites/me    (no session) -> 401
```
Earlier in the same session (signed-out preview): the CTA `href` points at sign-up, the bar shows
the catalog name per locale (no English name on `/ar`), the "Sample" badge stays visible, and
`?name=` (80 chars present, 81 absent) is display-only. Dev-DB indexes read back as
`_id_`, `ownerUserId_unique` (unique), `slug_unique` (unique).

## Commands
```
npm run lint: pass
npx tsc --noEmit: pass
npm run test: 31 pass, 2 skipped (integration tests need MONGODB_TEST_URL)
npm run build: pass (Next.js 16.4.0, Turbopack) — routes include /[locale]/dashboard/site/edit
```

## Deviations from the slice (files outside the list, spec changes) and why
1. **`src/features/sites/site-data.ts` (+ `site-data.test.mjs`)** — Task 1 explicitly asks to
   "deduplicate the repeated `getLocale/localizedValue/splitLines/profile mapping` helpers into one
   place"; this is that place (`localizedValue`, `splitLines`, `siteProfileFromValues`,
   `siteDataFromValues`, `getDisplayValue`, `toSiteLocale`).
2. **`src/features/sites/field-errors.ts` (+ test)** — Task 8's "400 → back to step 1 with field
   errors" needs a `?fields=name:code,...` parser/serializer; pure + sanitized (max 10 entries,
   `[A-Za-z0-9_.[\]]+` allow-list) so a hand-edited URL cannot inject messages.
3. **`src/features/sites/model.ts`** — owner-approved (see Summary 1).
4. **`src/features/sites/schemas/update-site-schema.ts` (+ test)** — the PATCH body contract
   (owner-requested edit feature).
5. **`src/features/sites/components/site-profile-fields.tsx`** — the wizard's field markup moved
   verbatim out of `create-site-form.tsx` so the edit form can reuse it without duplicating 150
   lines and without pushing either file over the file-size rule. The create flow's logic (draft,
   validation, navigation) is unchanged; the only behavioural difference is a shared
   `disabled`/`notice` prop.
6. **`src/features/sites/components/{edit-site-form,delete-site-button}.tsx`** and
   **`src/app/[locale]/dashboard/site/edit/page.tsx`** — the owner-requested edit/delete UI.
7. **`duplicateKeyPattern()` in `src/shared/db/mongodb.ts`** — the `sites.ownerUserId` unique
   index and the `slug_unique` index both throw 11000; the service must tell them apart
   (`ownerUserId` → 409 `SITE_ALREADY_EXISTS`, `slug` → retry up to 5 rounds). `isDuplicateKeyError`
   alone is not enough.
8. **`createSiteSchema` is now `.strict()`** (04: "strict; unknown keys rejected"). The client
   `siteSetupSchema` was left as-is; the wizard draft carries extra local keys the server strip
   path must not see. The zod field messages are translation keys and the API only returns issue
   codes, so nothing user-visible changed.
9. **`src/app/[locale]/templates/[templateId]/[[...slug]]/page.tsx` is `force-dynamic`** — Task 9
   needs the session to decide whether "Use this template" goes to the create flow or sign-up;
   the page can no longer be prerendered.
10. **Dead message keys removed** — `siteSetup.preview.title`, `siteSetup.actions.backToGallery`,
    `siteSetup.errors.{previewBlocked,noDraft,invalidDraft,siteExists,createFailed}`,
    `templatePreview.templates` (the bar now reads the catalog). Key parity EN/AR is asserted by
    `messages.test.mjs` ✓.
11. **`PATCH /api/sites/me` (contract-defined, S3)** — implemented now instead of in S3, because
    the owner asked for editing. Payload is the same shape the contract names
    (`{revision, data: {profile}}`, strict, unknown keys rejected), revision-filtered write with
    `STALE_REVISION` on a lost race and `NOT_FOUND` when the user has no site.
12. **`DELETE /api/sites/me` — a contract addition.** The owner asked for "delete the website";
    `04-API-CONTRACT.md` had no user-side delete row (only S6 admin delete). The path mirrors the
    existing `PATCH /api/sites/me` and returns 204, as the contract's other deletes do.
    **Owner-approved and now in the plan:** the row was added to `04-API-CONTRACT.md` and to this
    slice (task 13), so the code no longer invents a path. There is no cascade today: projects
    (S4) and published snapshots (S5) do not exist yet, so deleting removes the site document
    only; the contract note records that those slices add the cascade.
13. **Edit scope** — the edit page covers the whole wizard field set (name, category, description,
    logo, contact, services, features, languages) for **the locale being viewed**. It is not the
    S3 bilingual editor (no language tabs, no per-item ids/reordering, no uploads, no preview).
    Lists are merged index-wise and only the viewed locale's slots are written, so editing Arabic
    never rewrites English (`site-data.test.mjs` asserts this); removing a line clears that locale's
    slot rather than dropping the item, which is why S3's list editor with stable ids is still
    needed. The server mirrors the create schema's limits (no tighter per-field caps), so anything
    a user could store at creation can be saved again.

## New dependencies / env vars / routes (must match docs/plan; `.env.example` updated?)
- No new dependencies, no new env vars.
- Routes added: `/[locale]/dashboard/site/edit` (page), `PATCH /api/sites/me`,
  `DELETE /api/sites/me` (see Deviations 12).
- `package.json` `test` script lists the new test files
  (`field-errors.test.mjs`, `schemas/update-site-schema.test.mjs`).

## UNVERIFIED items (what, why, exact manual steps for the owner)
1. **CP-1 click-through, and the new model write path** (no browser/session here). Sign in, click
   "Create your site", fill name + category, continue, open a live preview, come back, select a
   template → expect `/dashboard?created=1` with the site card. This also exercises
   `model.ts` (`create`), the unique index and `slug_unique`. Then sign out and repeat in `/ar`.
2. **Edit** — on the site card click "Edit details": change the company name, save → expect
   "Your changes have been saved."; reload the page and confirm the value; switch to the other
   locale and confirm the other locale's values were untouched; open the same page in two tabs,
   save in tab A, then save in tab B → expect `STALE_REVISION` + "Reload the page".
3. **Delete** — click "Delete website" → confirm inline ("Yes, delete it") → expect
   `/dashboard?deleted=1` with "Your website has been deleted." and the empty state; then create
   again (expect it to work, i.e. the unique `ownerUserId` index no longer blocks).
4. **Integration tests** — set `MONGODB_TEST_URL` to a separate database (07 G) and run
   `npm run test`; expect 33 pass / 0 skipped.
5. **Visual/RTL checks** — gallery cards and the new edit/delete buttons at 375px and in `/ar`
   (RTL), keyboard tab order, `?highlight={id}` focus ring.

## Arabic wording for owner review
- `dashboard.overview.editAction`: `تعديل البيانات`; `dashboard.overview.deleted`: `تم حذف موقعك.`
- `siteSetup.edit.*`: `تعديل موقعك` / `بيانات النشاط` / `حدّث معلومات شركتك. تُطبَّق التغييرات على
  اللغة التي تستعرضها الآن.` / `حفظ التغييرات` / `جارٍ الحفظ...` / `تم حفظ تغييراتك.` /
  `إعادة تحميل الصفحة` / `حذف الموقع` / `جارٍ الحذف...` / `هل تريد حذف هذا الموقع؟` /
  `سيتم حذف موقعك ومحتواه، ويمكنك إنشاء موقع جديد بعد ذلك.` / `نعم، احذفه` / `الاحتفاظ به`
- `errors.STALE_REVISION`: `تم تعديل المسوّدة في نافذة أخرى. أعد تحميل الصفحة لعرض أحدث نسخة.`
- Catalog names/summaries added in Task 7 (`أتيلييه التحرير`, `البناء العصري`, `العقارات الحضرية`,
  `الهدوء الداخلي`, `استوديو الحرفية` + summaries) — still open for review.

## Observations (not fixed here)
- **The dev `sites` collection is now empty.** It held one draft at the start of this session
  (the owner's `solo`/`atelier` document) and reads back as 0 documents now. Every DB access in
  this session was read-only (counts, `findOne`, `validateSync`), and the only delete path in the
  code requires an authenticated session, so this was either the owner or an earlier manual wipe
  of the dev DB. No action taken; noted so the acceptance evidence above can be reproduced.
- `docs/template-design/README.md` is in the slice's "Read first" list but does not exist in the
  repo or in `gyzora-plan/`. The template-internals rules were taken from
  `docs/template-engine/` and the existing components instead.
- The S0 incident is still open: the dev DB `user` documents deleted during S0 cleanup can be
  recreated against the surviving `_id`s (`6acf841e399bc897e583c139`, `6acf958e399bc897e583c143`)
  if the owner supplies the original email/name.
- `Services`/`Features` list editing with stable item ids, reordering and per-item validation
  remains S3 work (see Deviations 13).
- Unrelated owner WIP left untouched and uncommitted: `CODE_RULES.md` (the model rule) and
  `gyzora-plan/gyzora-plan/docs/plan/prompts/START-SLICE.md`. Per `AGENTS.md` the `CODE_RULES.md`
  change should be committed with the owner's next commit.

## Risk / rollback
- The riskiest change is the model refactor: sites are now written by Mongoose (`strict` schema,
  `versionKey: false`, `timestamps: true`, `_id: false` on nested/localized subdocs) instead of the
  raw driver. Verified in-memory (`validateSync` accepts the exact document the service builds,
  list items have no `_id`, `published: null` is `Mixed`) and by a read-only query against the dev
  DB; the write path itself needs one owner click (UNVERIFIED 1). A schema mistake would surface
  immediately as a create/PATCH failure with a mongoose error in the server log, not as corrupt
  data.
- Edit/delete are additive UI + handlers; `DELETE` has no cascade by design (nothing to cascade
  yet).
- Rollback: revert this branch. `sites` documents written by the model are byte-compatible with
  the previous driver writes (same field names, `_id`, no `__v`), so no data migration is needed.
