## Slice
S4: Projects and images (S3 bucket)

## Summary
Owners can now manage a portfolio: `/[locale]/dashboard/site/projects` lists project cards (cover, localized title with a display-only fallback, Featured badge, Edit, Delete), `.../projects/new` and `.../projects/[id]/edit` render the AR/EN form with a featured toggle, metadata and uploaders, and deleting goes through an accessible confirm dialog. Photos are uploaded from the computer with a presigned S3 `PUT` (`POST /api/uploads/presign` -> `ImageUploader` with progress, retry, preview and remove); keys are stored (`sites/{siteId}/{kind}/{uuid}.{ext}`), never full URLs, and every save verifies new keys with `HeadObject` before persisting. The logo URL text field in the content editor was replaced by the same uploader, and `profile.logoKey` is mapped to the renderer's logo field in `toRenderData`. Projects are wired into the draft preview: the projects list page and project details by slug. Deleting a project removes keys that are no longer referenced (best effort, skipping anything inside `site.published`), and deleting a site removes its projects and image objects (`04-API-CONTRACT.md`'s cascade rule).

Commits: `ce19674` (image pipeline + presign), `b276fde` (schema/repository/service), `2ce4ba1` (API routes), `5d605db` (pages/upload UI/messages), `58be1f4` (editor logo + preview wiring). 49 files, +3551/-58.

## Acceptance checklist (evidence required for each)
- [x] CP-3 and CP-4 pass in EN and AR with real uploads to the bucket; images load in the list and in the preview - evidence: CP-3 over HTTP against the running app with a temporary reverted `session.ts` stub, real presigned uploads of one cover and three gallery PNGs: 17/17 PASS. The dashboard list shows the cover URL; `/en|/ar/dashboard/site/preview/projects` show the localized title + cover; `/en|/ar/.../projects/<slug>` show the title + all four object keys; `DELETE /api/projects/<id>` -> 204, all four public URLs -> 404, list and preview empty again. The earlier API sweep also verified a project created with EN + AR content, PATCH adding a gallery image, and a foreign-site key -> 400 `UPLOAD_REJECTED`. Actual browser paint and the file-picker flow are UNVERIFIED (no browser here) - see UNVERIFIED 1.
- [x] Uploading a 6 MB file or a `.gif`/`.svg` is rejected client-side AND server-side - evidence: server side 14/14 PASS: 6 MB -> 400 `{"error":{"code":"UPLOAD_REJECTED","fields":{"size":"too_big"}}}`, `image/gif`, `image/svg+xml` and `application/pdf` -> 400 with `fields.contentType = "invalid_format"`; `kind:"receipt"` -> 400 (S9 owns receipts). Client side: `image-uploader.tsx` checks `isAllowedType(file.type)` and `file.size > MAX_IMAGE_BYTES` before requesting a presign and renders `common.imageUploader.invalidType` / `tooLarge`; `accept` is `image/jpeg,image/png,image/webp` and the hidden input has no other types. The browser triggers are UNVERIFIED.
- [x] Sending a `key` that belongs to another site in a save payload -> `UPLOAD_REJECTED` - evidence: `PATCH /api/projects/<id>` with `sites/000000000000000000000000/cover/...` -> 400 `{"error":{"code":"UPLOAD_REJECTED",...}}` and the stored project unchanged (PASS in the API sweep). Also unit-tested (`verify-upload.test.mjs`: not your prefix and malformed keys are rejected before any bucket call).
- [x] User B calling `/api/projects/{A's id}` GET/PATCH/DELETE -> 404 envelope - evidence: fresh-process run against the real dev DB with two throwaway owners: GET, PATCH and DELETE as owner B all raise `NOT_FOUND`/404 and owner A's project is unchanged (4/4 PASS); the routes use the shared `withSession` + error mapper that S1/S2 already render as `{error:{code,message,fields?}}`. The HTTP-level assertion is in the skipped integration test. Two real browser accounts are UNVERIFIED.
- [x] Deleting a project removes its objects from the bucket (when not in a published snapshot) - evidence: after `DELETE /api/projects/<id>` the public URL of the cover and of all three gallery images returns 404 (the CP-3 run printed all four as gone); the earlier sweep did the same for a single cover. Deletion is best-effort by design (failures are logged, the row is still deleted). The "published snapshot" exception is unit-tested with a fake snapshot, not against a real S5 snapshot (S5 does not exist yet).
- [ ] Project with no cover, no gallery, only Arabic title renders correctly in preview (both locales) - evidence: an Arabic-only project on an Arabic-only site is accepted (`project-<rand>` slug), renders on `/ar/dashboard/site/preview/projects` and on the AR details page, and the EN details page resolves 200 without images. The **EN projects page omits it**, because the existing renderer rule (`getVisibleProjects` in `templates/render/localized.ts`, tested by S2's "projects without a title in the active locale are omitted") hides projects with no title in the active language, and S2 forbids cross-language fallback in the renderer. Marked unverified pending the owner's decision - see Q1.
- [x] lint, tsc, test, build pass - evidence: see Commands.

## Click-paths (EN and AR)
| Path | EN | AR | Notes |
|---|---|---|---|
| `/dashboard` | 200 - sidebar "Projects" + overview "Manage projects", both `href="/en/dashboard/site/projects"` | 200 - "المشاريع", "إدارة المشاريع", `href="/ar/dashboard/site/projects"` | temporary reverted stub; no real sign-in here |
| `/dashboard/site/projects` | 200 - project cards with cover, title, Featured, Edit/Delete; empty state "No projects yet" + "Add your first project" | 200 - `dir="rtl"` + Arabic labels/values | card cover = public object URL |
| `/dashboard/site/projects/new` | 200 - "New project", AR/EN tabs, cover + gallery uploaders, facts, featured toggle, "Save project" | 200 - "مشروع جديد", "حفظ المشروع" | server-rendered shell only; client interactions UNVERIFIED |
| `/dashboard/site/projects/<id>/edit` | 200 - the form is populated with the stored EN + AR values | 200 - same with AR values | PASS in the API sweep |
| save a project | 201 (create) / 200 (edit); revision of the site increments through `touchDraft` | same | API sweep |
| delete a project | 204 -> list/preview empty, objects 404 | same | confirm dialog itself UNVERIFIED |
| `/dashboard/site/edit` (logo) | 200 - "Company logo" + `Upload image` in place of the URL input | 200 - "شعار الشركة" + "رفع صورة" | key persists; preview mapping verified in a fresh process |
| `/dashboard/site/preview/projects` | 200 - projects page with cover + title | 200 - Arabic title | CP-3 evidence |
| `/dashboard/site/preview/projects/<slug>` | 200 - cover + gallery + facts | 200 - Arabic title, alts | CP-3 evidence |
| `/dashboard/site/projects` signed out | 307 -> `/en/auth/sign-in` | 307 -> `/ar/auth/sign-in` | real HTTP, no stub; `/api/projects` -> 401 |

## Commands
Run twice: (a) on a detached worktree of this branch only, (b) on the live working tree, which is this branch **plus the owner's uncommitted template refactor** (the tree used for the browser-less HTTP checks).
```
(a) branch-only worktree
npx tsc --noEmit: pass (exit 0)
npx eslint src: pass (0 errors, 0 warnings)
npm run test: 82 tests, 72 pass, 10 skipped, 0 fail
npx next build --webpack: pass; 21 static pages; route table lists ƒ /api/projects, ƒ /api/projects/[id], ƒ /api/uploads/presign, ƒ /[locale]/dashboard/site/projects, .../new and .../[id]/edit

(b) working tree
npx tsc --noEmit: pass (exit 0)
npx eslint src: pass (0 errors, 2 warnings, both in the owner's uncommitted template files: unused locale in patterns/introduction.tsx, unused NAVIGATION_PAGE_IDS in render/TemplateRenderer.tsx)
npm run test: 82 tests, 72 pass, 10 skipped, 0 fail
npm run build (Turbopack): pass; same route table
```
The default Turbopack build cannot run in a worktree that shares `node_modules` through a junction ("Symlink node_modules could not be resolved"), so (a) used `--webpack`; the default Turbopack build passed on the working tree. The 10 skips are the 6 site + 4 project integration tests (`MONGODB_TEST_URL` unset). The S4 commits do not touch the owner's template files.

API/HTML verification, temporary and reverted (`session.ts` restored with `git checkout --`, `git status` clean of stubs; every site/project created during verification was deleted, dev `sites`/`projects` collections are back to 0/0):
- CP-3 script: **17/17 PASS** (real bucket uploads, EN + AR list/preview/details, delete, object 404s).
- Main sweep: **29/30 PASS**; the single failure ("preview home renders the uploaded logo URL") was caused by the long-running dev server's cached Mongoose `Site` model (added `logoKey` after the model was registered), not by code - a fresh process then passed 6/6 (presigned PUT, persisted `logoKey`, public URL mapping, public GET 200, site delete removes the object).
- Limits/edge sweep: **14/14 PASS** (6 MB, gif, svg, pdf, receipt, Arabic-only project + render, `NO_SITE` 409, cleanup).
- Logo fresh-process run: **6/6 PASS**.
- Two-owner isolation run: **4/4 PASS**.
- Entry points/links run: **7/7 PASS**.
- Bucket hygiene: 9 orphan objects from previously deleted sites/verification runs were removed; no `sites/` object remains without a live site.

## Deviations from the slice (files outside the list, spec changes) and why
1. **`logoKey` instead of only `logoUrl`.** Task 11 says "store `logoKey`", so `SiteProfile` gained `logoKey`, the Mongoose profile schema was extended (`model.ts`), `updateSiteSchema` accepts `logoKey` (300 chars, `sites/<id>/logo/<uuid>.{jpg,png,webp}` pattern, new `siteSetup.validation.logoKeyInvalid`), and `applyEdit` keeps it. Saving a logo clears the legacy `logoUrl`; `toRenderData` maps the key to the public URL at render time (`withPublicLogo`). The S1 create wizard keeps its `logoUrl` text field - the slice only replaces the editor's input.
2. **Site delete cascade** in `sites/service.ts`: `deleteProjectsForSite(site)` + logo object deletion. `04-API-CONTRACT.md` (line 58) assigns the projects/uploads cascade to S4/S5 and S5 is not implemented yet; without it, deleting a site silently leaves projects and objects behind. The slice's file list only says "modify `service.ts` if needed" for the logo.
3. **Logo keys are verified and replaced keys are deleted** (`verifyUploadedKey`, snapshot-aware) exactly like project images. This is the Task 7 rule applied to Task 11's logo save; the alternative (trust the key) would make `UPLOAD_REJECTED` inconsistent between the two features.
4. **`withSession` is now generic** over the route context (`<RouteContext = unknown>`) and passes it to the handler, which `[id]` routes need for `params`. Existing callers are unchanged (default type parameter).
5. **`normalizeText` moved to `src/shared/text/normalize.ts`** and is imported by both the sites and projects schemas (sites re-exports it, so S1/S3 imports keep working). Pure modules use relative `.ts` imports so `node --experimental-strip-types` runs them without alias hooks.
6. **Snapshot typing:** `snapshotImageKeys(published: unknown)` in `images/delete-keys.ts` (it reads `imageKeys` when S5 stores them, plus every project cover/gallery key). `PublishedSnapshot` belongs to S5; using `unknown` now avoids inventing S5's shape. `SiteDocument.published` stays loosely typed the same way.
7. **`areaSqm`/`year` handling:** stored as numbers, rendered by `toRenderProject` as localized strings with `Intl.NumberFormat` and a hard-coded `m²`/`م²` unit. A unit message key was not added because the unit is not user-editable and the renderer contract takes a string; flagged as an observation.
8. **Project slug:** generated once from the English title (lowercase, latin, max length) or `project-<rand>` when ENGLISH is empty, unique per site with a retry on the unique index, and **immutable after create** (editing the title keeps the URL). Details routes use the slug, like the preview page.
9. **Project repository/model co-located:** the slice lists `types.ts`, `repository.ts`, `service.ts` only, so the Mongoose schema and indexes live in `repository.ts` rather than a new `model.ts` (the sites feature has one, but adding a file outside the slice's list for symmetry would be churn). Indexes are still registered in `indexes.ts` as the slice asks.
10. **Project form reuses S3's `LanguageTabs`/`LocalizedField`** from `sites/components/editor` instead of duplicating them (see Observations 2).
11. **`ImageUploader` messages live under `common.imageUploader`**, because the same component is used by projects and by the site editor's logo; a `projects.*` namespace would have been wrong for the logo.
12. **Tests beyond the slice's list:** `verify-upload.test.mjs` (ownership/type/size checks) and `projects.integration.test.mjs` (Task 12's integration cases: isolation, foreign key, featured limit, snapshot protection). Both are registered in `package.json`'s `test` script.
13. **`project-list.tsx`** is in the slice's file list; `delete-project-dialog.tsx` uses the new shared `confirm-dialog.tsx` (focus trap, Esc, loading state) so future delete flows (e.g. site delete) can reuse it.

## New dependencies / env vars / routes (must match docs/plan; `.env.example` updated?)
- New dependencies: `@aws-sdk/client-s3` and `@aws-sdk/s3-request-presigner` (both approved by `CODE_RULES.md` §4 and `02-ARCHITECTURE.md` §1; no other new package).
- No new env var: `.env.example` already lists `S3_BUCKET`, `S3_REGION`, `S3_ACCESS_KEY_ID`, `S3_SECRET_ACCESS_KEY`, `S3_PUBLIC_BASE_URL`, `S3_ENDPOINT`, `S3_FORCE_PATH_STYLE`. They are read only through `getS3Env()` in `src/shared/config/env.ts`; nothing is exposed to the browser.
- Routes are exactly `04-API-CONTRACT.md`'s: `POST /api/uploads/presign` -> `{data:{uploadUrl,key,headers}}` (5-minute signed `PUT` with `ContentType` signed), `GET/POST /api/projects`, `GET/PATCH/DELETE /api/projects/[id]` (204 on delete). `kind:"receipt"` is accepted by the schema but answered with `UPLOAD_REJECTED` until S9.
- No change to `04-API-CONTRACT.md` or `.env.example`; `03-DATA-MODEL.md`'s project shape matches the implementation.

## UNVERIFIED items (what, why, exact manual steps for the owner)
1. Real browser CP-3 + CP-4 (file picker, progress, CORS, retry). Steps: sign in -> Projects -> "Add project" -> fill EN and AR tabs -> "Upload image" for the cover -> add 3 gallery images (watch the progress %) -> Save -> the card appears -> Preview -> Projects and the details page show all 4 photos -> repeat in the AR UI -> Delete -> confirm -> the project disappears from list and preview. Requires the bucket CORS to allow `PUT` from the app origin (Node uploads passed, but a browser preflight was not exercised).
2. Visual/RTL/responsive/keyboard: 375px layout of the form with 12 gallery tiles, Arabic `dir="rtl"` alignment of uploaders and the confirm dialog, tab order, visible focus rings, Esc closes the dialog, `aria-live` announces upload progress/errors.
3. Broken-image fallback: existing `TemplateImageFrame` handling is client-side. Steps: save a project, then rename one gallery `key` inside MongoDB to a non-existent object and reload the preview - the frame should fall back without layout breakage.
4. Logo in the preview: restart `next dev` once (Mongoose caches `Site` in memory, so a model change is not picked up by HMR), open the editor, upload a logo, Save, then open Preview - the header shows it. The upload/persist/render-data/public-URL chain itself passed 6/6 in a fresh process.
5. Integration tests: the 4 project tests (isolation, foreign key, featured limit, snapshot protection) and the 6 site tests need `MONGODB_TEST_URL=<test-db> npm run test`.
6. Two real accounts in a browser (API/service isolation is verified), and the dashboard pages with a real sign-in (a temporary stub was used).
7. Client-side rejection of 6 MB/gif/svg in the browser (server-side is proven).
8. The real bucket listing for the post-delete state: I verified the objects with public `GET` -> 404 rather than a `ListObjectsV2` snapshot.

## Arabic wording for owner review
Uploader (`common.imageUploader`): رفع صورة / استبدال الصورة / إزالة / لا توجد صورة / معاينة الصورة المختارة / JPEG أو PNG أو WebP، بحد أقصى 5 ميجابايت. / جارٍ الرفع… {percent}% / إعادة المحاولة / اختر صورة JPEG أو PNG أو WebP. / يجب ألا تتجاوز الصورة 5 ميجابايت. / فشل الرفع. تحقق من الاتصال وحاول مرة أخرى.
Errors and navigation: أنشئ موقعك أولاً قبل إضافة المشاريع. / تعذر قبول هذا الملف. اختر صورة JPEG أو PNG أو WebP بحد أقصى 5 ميجابايت. / المشاريع / إدارة المشاريع / شعار الشركة / أعد رفع الشعار.
Projects: أعمالنا، المشاريع، اعرض أعمالك المنجزة مع الصور والتفاصيل.، إضافة مشروع، لا توجد مشاريع بعد، أضف مشروعك الأول لعرض أعمالك على موقعك.، أضف مشروعك الأول، لا توجد صورة غلاف، مميز، تعديل، حذف.
Form: العودة إلى المشاريع، مشروع جديد، أضف الصور والتفاصيل ثم احفظ لتظهر في المعاينة.، تعديل المشروع، حفظ المشروع، جارٍ الحفظ…، إلغاء، إضافة صورة إلى المعرض، إزالة الصورة، {count} من {max} صور في المعرض، تظهر المشاريع المميزة أولاً. يمكنك تمييز 6 مشاريع كحد أقصى.، تفاصيل المشروع، صورة الغلاف، المعرض، معلومات المشروع، مشروع مميز، العنوان، الفئة، الموقع، الوصف، وصف الصورة (النص البديل)، السنة، المساحة (م²)، العميل، اعرض هذا المشروع أولاً.
Delete/validation: حذف المشروع؟، سيُحذف «{title}» من موقعك. لا يمكن التراجع عن ذلك.، حذف المشروع، الإبقاء على المشروع، جارٍ الحذف…، تعذر حذف المشروع. حاول مرة أخرى.، هذه القيمة طويلة جداً.، أعد رفع هذه الصورة.، أدخل سنة بين 1900 و2100.، أدخل مساحة أكبر من صفر.، يمكنك إضافة 12 صورة كحد أقصى في المعرض.، أضف عنواناً بلغة واحدة على الأقل من لغات موقعك.، يمكنك تمييز 6 مشاريع كحد أقصى. أزل التمييز عن مشروع آخر أولاً.، تعذر قبول هذه الصورة. أعد رفعها.، هذه القيمة غير صالحة.، تعذر حفظ المشروع. حاول مرة أخرى.

## Observations (not fixed here)
1. **Acceptance vs renderer rule** for an Arabic-only project in the EN preview - see Q1. I kept the existing, tested renderer behaviour rather than adding a cross-language fallback that S2 explicitly forbids.
2. **Cross-feature imports:** the project form imports `LanguageTabs`/`LocalizedField` from the sites editor. They are presentational and stable, but a move to `src/shared/ui` would be the cleaner home once S4 is accepted (touching S3 files now would churn its review).
3. **Mongoose models are cached across HMR** (`model.ts` returns `mongoose.models.Site ?? mongoose.model(...)`) - any schema change needs a dev-server restart. This is why the logo check failed against the long-running server and why the manual check in UNVERIFIED 4 needs a restart.
4. **`new: true` in the S1 site repository** logs a Mongoose deprecation warning (`returnDocument: 'after'`); not touched here.
5. **Abandoned uploads:** a photo uploaded but never saved (or a save that fails after upload) stays in the bucket; there is no cleanup job yet. S5/S10 should add one (e.g. delete keys not referenced by draft or snapshot). The 9 orphans from earlier deleted sites were removed during this verification.
6. **Legacy `logoUrl`:** the create wizard still accepts a URL text field and the DB can hold both `logoUrl` and `logoKey`. When S5 freezes a published snapshot it must decide whether the snapshot stores the key or the resolved URL (Q2).
7. **`withSession` generic:** additive, but it is a shared file; every new `[id]` route should pass its context type explicitly.
8. **Checks were run on the working tree that also contains the owner's in-progress template refactor** (`types.ts`, `catalog.ts`, `sample-data.ts`, `TemplateRenderer.tsx`, `TemplateImageFrame.tsx`, new `compositions/`, `patterns/`, `themes/`, `globals.css`, untracked `website/`). None of those files are in the S4 commits, and `git status` still shows them untouched.
9. **`IMPORTANT`:** my verification wrote to the dev DB and the real bucket; all created sites/projects were deleted and every uploaded object removed (dev DB now `sites` 0 / `projects` 0, no orphan `sites/` objects).

## Risk / rollback
Risk is contained to the sites/projects/images features: new collections/indexes only (`projects`), additive `profile.logoKey`, no migration, and all S3 access goes through the new `images` module. Rollback = revert the merge commit; rows in `projects` would remain but are ignored by every earlier code path, and objects uploaded by real usage would stay in the bucket (rollback does not delete them).
