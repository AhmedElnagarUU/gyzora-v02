# S3: Content editor

## Goal and user story
As a customer I edit my company info, contact details, about text, services and features separately for Arabic and English, save, and see the result in Preview. Switching language tabs never changes my text.

## Depends on
S2 merged.

## Read first
`03-DATA-MODEL.md`; `04-API-CONTRACT.md` (PATCH /api/sites/me); `SiteData` type and `sample-data.ts` (field names are the contract); `docs/template-engine/README.md` (field validation).

## Files
Create: `src/features/sites/apply-edit.ts` (+ test), `src/features/sites/components/editor/{editor-form,language-tabs,localized-field,repeatable-list,save-bar}.tsx`.
Modify: `src/features/sites/schemas/update-site-schema.ts` (S1 shipped a profile-only strict schema; extend it to partial per-section, per-locale values), `src/app/api/sites/me/route.ts` (S1 added PATCH/DELETE), `src/app/[locale]/dashboard/site/edit/page.tsx` (S1 shipped a business-details form on this route; replace it with the tabbed editor), `src/features/sites/{repository.ts,service.ts}` (`updateDraft` with revision filter, `touchDraft`), `sidebar.tsx`, `site-overview-card.tsx` (S1 added "Edit details"; rename to "Edit content"), messages.

Note: S1 pulled a profile-only slice of this task forward (business details, one locale per save, `PATCH /api/sites/me`, `/dashboard/site/edit`, `models.ts`). The pieces that remain here are the bilingual tabbed editor, stable item ids and reordering, the stricter per-field limits, `apply-edit`, `touchDraft` and the Preview hand-off.

## Tasks
1. Editable sections (all fields from the existing `SiteData`; verify names in `sample-data.ts`): Company (name, category, description), About/story, Contact (email, phone, address, working hours), Services (list), Features (list), Active languages (en, ar, or both; at least one). Every item in a list needs a stable `id` (`crypto.randomUUID()`); add it to the type if missing.
2. Limits: text fields max lengths (name 80, category 80, description 600, about 4000, item title 80, item description 300, address 200), services max 12, features max 8. Plain text only (no HTML, trim, normalise newlines). URLs http(s) only. Email/phone lenient formats.
3. `update-site-schema`: zod `.strict()`, partial per section, per-locale values; messages as codes. `apply-edit` (pure): merges a validated partial into `StoredSiteData` touching ONLY the provided keys of the provided locale values; never copies between locales.
4. `PATCH /api/sites/me` body `{revision, data}`. Repository update filter `{ownerUserId, revision}` + `$set data`, `$inc revision`, `draftUpdatedAt/updatedAt = now`; 0 matched -> `STALE_REVISION`. Returns the new site. `touchDraft(siteId)` helper (used by S4 for project writes).
5. Editor page: server loads own site (redirect to dashboard if none); client form with language tabs "العربية | English" that are independent of the UI locale; each tab shows its own fields and a "missing" badge for empty required fields; list editors with add/remove/move up/down; Save button with loading, success message, error message; field errors from `fields`; `beforeunload` warning while dirty; "Preview" button opens the saved preview in a new tab (tooltip/hint "save first" when dirty). Handle `STALE_REVISION` with a clear message and a reload action.
6. Add "Content" to the sidebar and "Edit content" to the overview card.
7. Tests: `apply-edit` locale isolation (editing ar leaves en identical, deep-equal), schema rejects unknown keys and oversized text, integration (test DB): stale revision rejected, other user cannot update my site (their PATCH only touches their own).

## Acceptance
- CP-2 passes in EN and AR. Reload shows saved values; switching tabs and saving without changes leaves the document unchanged (show diff).
- Editing Arabic fields never changes English fields (show before/after documents).
- Two tabs: save in tab A, then save in tab B -> B gets STALE_REVISION message.
- Invalid input shows translated field errors, nothing saved.
- Preview reflects saved edits.
- Another user's `PATCH /api/sites/me` cannot affect my site; body containing `ownerUserId`/`siteId`/unknown keys -> 400.
- lint, tsc, test, build pass.

## Do NOT
Allow HTML, accept ids from the client, auto-translate, add image/logo upload (S4), add project editing (S4).
