## Slice
S3: Content editor

## Summary
The owner now edits company details, about copy, contact details, services, features and active website languages on `/[locale]/dashboard/site/edit`, in Arabic and English, through two language tabs that are independent of the UI locale. The S1 business-details form was replaced by a tabbed editor (`components/editor/{editor-form,language-tabs,localized-field,repeatable-list,save-bar}.tsx`); lists get stable client-side ids (`crypto.randomUUID()`) with add/remove/move up/move down; every save is a partial edit (`{revision, data}`) that the server merges into the stored draft with `applyEdit` (pure) and the S1 `{ownerUserId, revision}` filter, so one locale can never overwrite the other. `PATCH /api/sites/me` now also returns `revision` in the site view so the next save from the same page is not stale, an empty edit is rejected, and `touchDraft(siteId)` is ready for S4's project writes. Sidebar gained "Content" and the overview card action is now "Edit content".

## Acceptance checklist (evidence required for each)
- [x] CP-2 passes in EN and AR. Reload shows saved values; switching tabs and saving without changes leaves the document unchanged (show diff) - evidence: `Overview -> Content` is a real link in both locales (`href="/en/dashboard/site/edit"`, `href="/ar/dashboard/site/edit"`). With a temporary reverted in-memory repository stub I ran CP-2 over HTTP: PATCH `{revision: 3, data: {profile: {companyName: {ar: "كراون وستون العقارية <stamp>"}}}}` -> 200, response revision 4 and the stored document deep-equals the seed with only that Arabic value changed; `GET /api/sites/me` and both editor pages then render the saved value (EN tab shows the EN value in the input, AR page shows the AR value). "Save with no changes" is impossible to send: the client computes the payload with `buildEdit(draft, baseline)`, shows "You have not changed anything yet." and issues no request; `buildEdit(draft, draft)` is `{}` (unit test) and the API rejects an empty edit (`{"data":"custom"}`) - the document and revision are byte-identical in the diff. The browser click-through itself is UNVERIFIED (no browser here) - steps below.
- [x] Editing Arabic fields never changes English fields (show before/after documents) - evidence: `apply-edit.test.mjs` deep-equals the whole English projection before/after an Arabic-only edit, and separately asserts `applyEdit(stored, {})` is deep-equal to `stored`. Over HTTP, the Arabic-save response and the stored document are byte-identical to `JSON.parse(JSON.stringify(before.data))` with `.profile.companyName.ar` replaced (the run printed PASS for "the Arabic edit is merged and every English value is unchanged" and "English stays exactly as stored" with `"en":"Crown & Stone"` retained).
- [x] Two tabs: save in tab A, then save in tab B -> B gets STALE_REVISION message - evidence: a second PATCH with the original revision returns 409 `STALE_REVISION` and the stored document is unchanged (PASS "a save with an old revision is rejected" / "the stale save changed nothing"); the editor turns 409 into the stale alert plus a "Reload the page" action (`save-bar.tsx` + `errors.STALE_REVISION`). The two real browser tabs check is UNVERIFIED.
- [x] Invalid input shows translated field errors, nothing saved - evidence: oversized description -> 400 `{"data.profile.description.en":"too_big"}`; invalid email -> `{"data.profile.contact.email":"invalid_format"}`; nonsense phone -> `invalid_format`; `ftp://`/"javascript:" logo -> `invalid_format`; `languagePreferences: []` -> `too_small`; a name/category empty in both locales -> 400 `{"profile.companyName":"siteSetup.validation.companyNameMin","profile.category":"siteSetup.validation.categoryMin"}` (the merged check, so a clear in one locale is still valid while the other locale has text - unit-tested); `ownerUserId`, `siteId` and a client-supplied list item `id` -> 400 `unrecognized_keys`. After the whole invalid batch the document and revision are unchanged (PASS "no invalid save changed the document or the revision"). The client maps both shapes: `siteSetup.*` codes through `siteSetup`, zod codes through `errors.field.*`. Field-level rendering in the browser is UNVERIFIED (logic is exercised by unit tests + the editor renders the values it is given).
- [x] Preview reflects saved edits - evidence: after the saves above, `/ar/dashboard/site/preview` (200) contains the saved Arabic company name; `/en/dashboard/site/preview` is 200 with `noindex`. A fresh preview tab reads the draft at request time, so the save bar's dirty-guarded Preview link never shows stale content.
- [x] Another user's `PATCH /api/sites/me` cannot affect my site; body containing `ownerUserId`/`siteId`/unknown keys -> 400 - evidence: the route only uses the session user id (`updateSiteForOwner(session.user.id, ...)`) and the repository filters on `{ownerUserId, revision}`; bodies carrying `ownerUserId`/`siteId` are rejected 400 by the strict schema. The two-account integration test (test DB) now asserts owner B's site and revision are untouched after owner A's save, and that each owner only ever writes their own site; it stays skipped while `MONGODB_TEST_URL` is unset. Two real accounts in the browser is UNVERIFIED.
- [x] lint, tsc, test, build pass - evidence: see Commands.

## Click-paths (EN and AR)
| Path | EN | AR | Notes |
|---|---|---|---|
| `/dashboard` | 200 - sidebar "Content" + card "Edit content", both `href="/en/dashboard/site/edit"` | 200 - "المحتوى", "تعديل المحتوى", `href="/ar/dashboard/site/edit"` | temporary reverted stub (no session/browser here) |
| `/dashboard/site/edit` | 200 - tabs "العربية / English", sections Company/About/Contact/Services/Features/Website languages, counters (e.g. `13/80`, `2 of 12`), "Save changes" + "Preview" | 200 - `dir="rtl"`, headings "بيانات الشركة" ... "لغات الموقع", "حفظ التغييرات" | same page HTML; the AR tab shows AR values, the EN tab shows EN values as input attributes |
| language tab switch | no request, no text change (client state only) | same | `aria-pressed` toggle group; switching never writes to the payload (`buildEdit` is unchanged) |
| Save (changed) | 200 -> success message, revision +1 | same | PATCH `{revision, data}` evidence above |
| Save (no changes) | "You have not changed anything yet.", no request | same | acceptance "document unchanged" |
| Save (stale tab) | 409 -> STALE_REVISION alert + "Reload the page" | same | acceptance |
| Save (invalid field) | 400 -> translated message under the field | same | acceptance |
| Preview (clean) | opens `/dashboard/site/preview` in a new tab | same | acceptance |
| Preview (dirty) | hint "Save your changes before previewing." and the link does not navigate | same | acceptance |
| `/dashboard/site/edit` signed out | 307 -> `/{locale}/auth/sign-in` | same | real HTTP, no stub |
| `/dashboard/site/edit` without a site | 307 -> `/{locale}/dashboard` | same | code path `if (!site) redirect(...)`; not re-run with the stub (the stub site exists) |

## Commands
```
npx tsc --noEmit: pass (exit 0)
npm run lint: pass (eslint src, no output)
npm run test: 60 tests, 54 pass, 6 skipped, 0 fail (6 skipped = 2 create-site + 4 update-site integration tests, `MONGODB_TEST_URL` unset)
npm run build: pass; 17 pages generated; route table still lists ƒ /[locale]/dashboard/site/edit
```
API/HTML verification (temporary reverted stubs, dev DB untouched): `repository.ts` replaced by an in-memory store seeded with one site (revision 3) and `session.ts` by a fixed session, then 39 HTTP/API assertions - **39 PASS, 0 FAIL**; both files were restored with `git checkout --` and `git status --porcelain` is clean of stubs.

## Deviations from the slice (files outside the list, spec changes) and why
1. `src/features/sites/update-site.integration.test.mjs` (new file, not in the slice's list) + one line in `package.json`'s `test` script: Task 7 asks for integration tests; the existing file is `create-site.integration.test.mjs`, so a sibling file keeps the create tests untouched.
2. `src/features/sites/schemas/update-site-schema.test.mjs` was rewritten (it was in the test script since S1): the S1 test asserted "an update carries the full profile", which is exactly what S3 removes. It now covers partial per-section/per-locale acceptance, the limits, leniency, normalisation and unknown-key rejection.
3. `src/features/sites/components/edit-site-form.tsx` was deleted (S1's form is unreferenced once the route renders the editor - "replace it with the tabbed editor"). `site-profile-fields.tsx` was kept: the create wizard still uses it. `site-data.ts` keeps `siteSetupValuesFromProfile`/`mergeProfileEdit` (used only by tests now) - candidate cleanup once S3 is verified; deleting them would churn tests outside the slice.
4. `src/features/sites/model.ts` was **not** touched: list-item ids are editor-only. Task 1 says "add it to the type if missing", but the same slice's "Do NOT" says "accept ids from the client" and `03-DATA-MODEL.md`/`sample-data.ts` define `services`/`features` as plain `LocalizedValue[]`. Persisting ids would have needed the Mongoose schema (not in the file list) and would have put client ids on the wire, so the editor keeps `{id, en, ar}` locally, sends the whole ordered array without ids, and reordering is saved as the new order. `updateSiteSchema` rejects any client `id` (tested).
5. `src/features/sites/components/site-overview-card.tsx` needed no edit: "Edit content" is the value of `dashboard.overview.editAction`, which the card already renders.
6. `src/app/api/sites/me/route.ts` needed no edit either: the parsed edit already flows into `updateSiteForOwner`, so only the service/schema changed shape. `SiteView` gained `revision` (`service.ts`) because the response is the only way the page can learn the new revision for a consecutive save.
7. `apply-edit.ts` also owns the pure draft mapping (`toEditorDraft`, `buildEdit`, `normalizeDraft`) so the editor components stay presentational and the whole edit model is covered by one unit test file, instead of adding another module outside the slice's list.
8. The editor's list items carry no separate "item description": S3's editable lists (services, features) are single-value items in `SiteData` (`{en, ar}`). The slice's "item description 300" belongs to S4's project items; the item limit used here is 80.
9. Tabs are implemented as an accessible toggle group (`role="group"` + `aria-pressed`) rather than a full ARIA tab widget, which would need roving arrow-key focus for the same two buttons. File name kept (`language-tabs.tsx`).
10. `messages/en.json` + `ar.json` also carry the two Task-6 labels (`dashboard.nav.content`, `dashboard.overview.editAction`) in the same commit as the editor, because the message catalogs cannot be split per task cleanly.

## New dependencies / env vars / routes (must match docs/plan; `.env.example` updated?)
- No new dependency, no new env var, no new route, `.env.example` unchanged.
- `PATCH /api/sites/me` keeps its documented shape; the response's `data.site` now also contains `revision` (additive, same as `04-API-CONTRACT.md`'s `Site` view + revision). Limits/validation codes are the docs' `SiteData` fields; `docs/plan/04-API-CONTRACT.md` needs no edit.

## UNVERIFIED items (what, why, exact manual steps for the owner)
1. Real signed-in browser CP-2 in EN and AR (no browser/session here, and I will not write to the dev DB). Steps: sign in -> Overview -> "Content" -> on the العربية tab change the company name -> Save -> success message; switch to English (the Arabic text is unchanged) -> change the category -> Save; reload the page -> both values persist; open Preview (new tab) -> the preview shows both edits.
2. "Save with no changes": press Save without editing -> "You have not changed anything yet." appears and the dev DB document is byte-identical (no revision bump). Verify with `db.sites.findOne({ownerUserId})` before/after.
3. Two browser tabs: save in tab A, then Save in tab B -> B shows the `STALE_REVISION` message and "Reload the page". (API-level 409 is verified.)
4. Visual/RTL/keyboard checks: tab order runs language tabs -> fields -> list move/remove buttons -> Save/Preview; focus rings visible; sticky save bar; no horizontal scroll at 375px; long lists (12 services) look right; the "Missing" badge disappears after filling a required field in the other locale.
5. The 6 integration tests (stale revision, other-owner isolation, merged required check, partial save) need `MONGODB_TEST_URL`; they are skipped locally. Run `MONGODB_TEST_URL=<test-db> npm run test`.
6. Preview for a site whose template has no about page: the About fields are still editable (data contract, not template-driven) - cosmetic question, see Observations.

## Arabic wording for owner review
- `dashboard.nav.content`: "المحتوى"; `dashboard.overview.editAction`: "تعديل المحتوى"
- `siteSetup.edit.title`: "محتوى الموقع"; `siteSetup.edit.description`: "اكتب محتوى موقعك بالعربية والإنجليزية. تُحفظ كل لغة على حدة، ولا يغيّر تبديل لسان اللغة نصّك."
- `siteSetup.editor.languageLabel`: "لغة المحتوى"; `missing`: "ناقص"; `optional`: "اختياري"
- `siteSetup.editor.sections.*`: "بيانات الشركة"، "نبذة عن نشاطك"، "بيانات التواصل"، "الخدمات"، "المزايا"، "لغات الموقع"
- `siteSetup.editor.fields.*`: "مقدمة صفحة من نحن"، "قصتك"، "ساعات العمل"
- `siteSetup.editor.actions.*`: "إضافة عنصر"، "إزالة"، "تحريك لأعلى"، "تحريك لأسفل"، "معاينة"
- `siteSetup.editor.*`: "لا توجد عناصر بعد. أضف العنصر الأول."، "لقد وصلت إلى الحد الأقصى وهو {max} عناصر."، "أبقِ لغة واحدة على الأقل."، "لم تُجرِ أي تعديل بعد."، "احفظ تعديلاتك قبل المعاينة."، "{count} من {max}"، "العنصر {number}"
- `siteSetup.validation.*` (new): "أدخل رقم هاتف صالحًا."، "هذا النص طويل جدًا."، "عدد العناصر يتجاوز ما تسمح به هذه الخانة."، "أبقِ لغة واحدة على الأقل."، "هذه القيمة غير صالحة."، "لا يوجد ما يمكن حفظه."
- Tab labels are endonyms and identical in both catalogs: "English" / "العربية".

## Observations (not fixed here)
1. Field-error transport has two shapes: the route's `zodFields` reports zod's `code` (`too_big`, `invalid_format`, `custom`, ...) while the merged-required check reports a message key (`siteSetup.validation.companyNameMin`). The editor maps both (zod codes through the existing `errors.field.*`, message keys through `siteSetup.*`), so the *server* text for an over-long field is the generic "This value is too long."; the specific wording ("Enter a valid email address.") comes from the identical client-side schema check that runs first. Unifying the transport would touch S1's shared `zodFields`.
2. `MESSAGE_PREFIX`/`field.` mapping lives in `editor-form.tsx`; the create wizard has its own copy. A shared mapper is a candidate when S4 adds another editor.
3. `site-data.ts`'s `siteSetupValuesFromProfile`/`mergeProfileEdit` are now production-dead (kept for their tests). Remove them and their tests in a small cleanup commit once the owner confirms S3 in the browser.
4. An empty `data` object is now a 400 (`custom`): the API cannot be used to bump the revision without changing anything, which makes the "save without changes" acceptance hold at the API level too.
5. `SiteView.revision` is additive; the S2 preview page ignores it.
6. No editor field for `logoUrl` upload (S3's "Do NOT": image upload is S4) - the URL text field stays, as in S1.

## Risk / rollback
Risk is contained to the sites feature: the schema now accepts partial edits (the S1 full-profile shape is a superset of it, so S1 clients keep working), the service reads before writing, and the repository filter is unchanged. No DB migration: `data` keeps its shape, and list ids are never stored. Rollback = revert the merge commit; the only persisted difference since S2 is whatever the owner saved through the editor (revisions only).
