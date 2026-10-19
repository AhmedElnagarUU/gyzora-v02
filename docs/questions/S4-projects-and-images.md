# S4 questions for the owner

## Q1 (needs an answer) - an Arabic-only project is hidden in the English preview

Acceptance says: "Project with no cover, no gallery, only Arabic title renders correctly in preview (both locales)". The renderer's existing rule (S2, `getVisibleProjects` in `templates/render/localized.ts`, covered by S2's test "projects without a title in the active locale are omitted") filters out projects that have no title in the language being previewed, and S2 deliberately forbids cross-language fallback in the renderer.

Result today: the project renders on the AR projects page and AR details page (verified), and the EN details page resolves 200, but the **EN projects page omits it**. The dashboard list does show it on both UI locales (it falls back for display only, as Task 9 says).

Please confirm one of:
1. Keep the strict rule: a project without an EN title is not shown on the EN site. (My assumption; no code change.)
2. Add a same-record fallback **in the renderer** (show the AR title on the EN site). This would change S2's contract and its test.
3. Require a title in every active language when saving a project (changes the validation rule from "at least one active language").

## Q2 (needs an answer before S5) - `logoKey`, the legacy `logoUrl` and the published snapshot

Task 11 says "store `logoKey`; map it to the renderer's logo field via `getPublicImageUrl` in `toRenderData`". I added `profile.logoKey` to `SiteProfile`/the Mongoose schema/`updateSiteSchema`/`applyEdit`, map it at render time, and clear the legacy `logoUrl` when a logo is uploaded. The S1 create wizard still writes `logoUrl` from its text field (S4 only replaces the editor's input).

Consequences to confirm:
- Both fields can exist on an old document; the renderer prefers `logoKey` and falls back to `logoUrl`. Is that the intended migration story?
- When S5 freezes `site.published`, should the snapshot store the **key** (and resolve at render time, so the URL can change with the bucket/CDN config) or the **resolved URL**? My delete protection currently treats a key inside the snapshot as protected by reading `imageKeys` (if present) plus project covers/galleries.
- Should the create wizard's logo URL field become an uploader too, or stay as-is until S5?

## Q3 (needs an answer) - `kind: "receipt"` in the presign contract

`04-API-CONTRACT.md` lists `receipt` among the presign kinds, but receipts belong to S9 and the S4 slice says "owner site required (except kind `receipt`, S9)". S4 validates the field then answers `400 UPLOAD_REJECTED` with `fields.kind = "invalid_format"`, so no key is ever issued for a receipt. Confirm that S9 will extend the route (and which site rule applies: receipts may exist without a site?), or that S4 should issue receipt uploads now.

## Q4 (approve or replace) - the new Arabic strings

All of these are new keys in `src/messages/ar.json` (the English catalog has the same keys); they are listed in the PR under "Arabic wording for owner review". Highlights:
- `common.imageUploader`: رفع صورة / استبدال الصورة / إزالة / لا توجد صورة / معاينة الصورة المختارة / jpeg-or-png hint / جارٍ الرفع… {percent}% / إعادة المحاولة / invalid type / too large / failed.
- Navigation + errors: المشاريع، إدارة المشاريع، شعار الشركة، أنشئ موقعك أولاً قبل إضافة المشاريع.، تعذر قبول هذا الملف...
- `projects.*`: أعمالنا، المشاريع، تفاصيل المشروع، صورة الغلاف، المعرض، معلومات المشروع، مشروع مميز، مميز، لا توجد صورة غلاف، حذف المشروع؟، ... plus the form/validation strings.

Two conventions I chose: `م²` for the area unit, and «{title}» with French quotes inside the delete sentence. Replace anything that reads wrong to you and I will update both catalogs (the parity test only checks keys, not wording).

## Q5 (FYI, decision for S5/S10) - abandoned uploads are not cleaned up

A photo that is uploaded but never saved (or whose save fails after the upload) stays in the bucket. S4 deletes replaced/unreferenced keys on save and project/site delete, but there is no janitor for never-saved keys. S5/S10 should add one (for example: list `sites/{siteId}/{kind}/`, delete keys that are neither in the draft nor in `site.published`). I removed 9 orphans from previously deleted sites during verification.

## Q6 (owner prerequisite, partially verified) - bucket CORS for browser uploads

From this machine (Node, no browser) I verified against the real bucket: presigned `PUT` 200, `HeadObject` with `image/png` and the right `ContentLength`, public `GET` 200, `DELETE` 204. A browser `PUT` needs a CORS preflight for the app origin; that preflight was not exercised. Please confirm the bucket's CORS allows `PUT` (and `HEAD`) from the dev and production origins. If it does not, the uploader shows `common.imageUploader.failed` on the first real upload.

## Q7 (note, no answer needed) - restart `next dev` after this branch lands

`model.ts` caches the model with `mongoose.models.Site ?? mongoose.model(...)`. A running dev server keeps the old schema after adding `logoKey`, so the logo save returns 200 but the field is stripped. Stop and start `next dev` once, then the logo persists and appears in the preview. This is an environment fact, not a code bug (a fresh process passed all 6 logo checks).

## Still open from earlier slices
- **S3-Q1**: `docs/template-engine/README.md` still does not exist (S4's "Read first" references AWS SDK docs and the renderer; the field limits came from the slice text).
- **S3-Q2**: the "item description 300" limit still has no DTO field. S4's project description uses 600 and the metadata/client fields 120; the S3 reading (300 = the project item description) looks wrong now - please clarify or drop it.
- **S3-Q3**: item ids are still editor-only (unchanged in S4).
- **S3-Q4**: the S3 Arabic strings still need your approval.
- **S3-Q5**: the two field-error transports still coexist (unchanged in S4; the project form maps both).
- **S2-Q1**: unknown draft-preview URLs render the not-found UI with HTTP 200 (the dashboard shell streams first) - still pending.
- **S2-Q3**: the sample route's language switch still drops the project id.
- **S0**: the two deleted dev `user` documents still need a name/email or a re-registration to sign in locally.
