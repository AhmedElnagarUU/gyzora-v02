# S4: Projects and images (S3 bucket)

## Goal and user story
As a decor/real-estate company I manage my portfolio: add projects with a cover and gallery photos uploaded from my computer, edit them, delete them, and see them in my preview. I can also upload my logo.

## Depends on / prerequisites
S3 merged. Owner: bucket, CORS, public prefix, env (07 B).

## Read first
`02-ARCHITECTURE.md` section 8; `03-DATA-MODEL.md` (projects); `04-API-CONTRACT.md`; AWS SDK v3 docs for `S3Client`, `PutObjectCommand`, `HeadObjectCommand`, `DeleteObjectsCommand`, `getSignedUrl`; renderer project types and `TemplateImageFrame.tsx`; `sample-data.ts` projects.

## Files
Create: `src/features/images/{s3-client,keys,presign-service,public-url,verify-upload,delete-keys}.ts` (+ `keys.test.mjs`), `src/features/images/components/image-uploader.tsx`, `src/app/api/uploads/presign/route.ts`, `src/features/projects/{types,repository,service}.ts`, `src/features/projects/schemas/project-schema.ts` (+ test), `src/features/projects/to-render-project.ts` (+ test), `src/app/api/projects/route.ts`, `src/app/api/projects/[id]/route.ts`, pages `dashboard/site/projects/{page.tsx,new/page.tsx,[id]/edit/page.tsx}`, `src/features/projects/components/{project-list,project-card,project-form,delete-project-dialog}.tsx`, `src/shared/ui/confirm-dialog.tsx`.
Modify: `package.json` (+2 AWS packages), `env.ts` (`getS3Env`), `indexes.ts`, `to-render-data.ts`/preview pages (pass projects), editor (logo uploader replaces logo URL input), `sidebar.tsx`, messages, `.env.example`.

## Tasks
1. Install `@aws-sdk/client-s3` and `@aws-sdk/s3-request-presigner`. `getS3Env()` (bucket, region, keys, public base URL, optional endpoint/path-style).
2. `keys.ts` (pure): `buildKey(siteId, kind, ext)`, `parseKey(key)`, `isKeyOwnedBySite(key, siteId)`, extension from content type (jpeg/png/webp only). Keys look like `sites/{siteId}/{kind}/{uuid}.{ext}`.
3. `POST /api/uploads/presign`: session; owner site required (except kind `receipt`, S9); validate kind, contentType in allowed list, size <= 5 MB; return presigned PUT URL (short expiry, e.g. 5 min, ContentType signed) and the key. Rate limit placeholder comes in S6/S10.
4. `verifyUploadedKey(key, siteId)`: ownership prefix check + `HeadObject` (exists, content-type allowed, `ContentLength <= 5MB`); on failure `UPLOAD_REJECTED`. Called by project and site saves for every key that is new in the payload. If the object is oversize/wrong type, delete it.
5. `ImageUploader` component: pick file (accept jpeg/png/webp), client-side type/size pre-check, request presign, upload with `XMLHttpRequest` to show progress, preview thumbnail, remove button, translated errors, retry. Returns the key through `onChange`. Accessible (button, label, `aria-live` status).
6. Projects schema (`.strict()`): title/description/category/location `Localized` (title required in at least one ACTIVE site locale), `coverImage {key, alt}` optional, `gallery` max 12, `metadata` (`year` 1900-2100, `areaSqm` positive, `client` text), `featured` boolean (max 6 featured per site: enforce in service). Alt text per locale optional; if empty the renderer falls back to the project title.
7. Repository/service: every function takes `siteId` from the session's site (`findSiteByOwnerId`), every query `{_id, siteId}`; invalid ObjectId -> NOT_FOUND; slug generation (reuse slug util, `project-<rand>` for Arabic-only titles, unique per site via index + retry); each write calls `touchDraft(siteId)`; delete/update remove S3 keys that are no longer referenced, EXCEPT keys present in `site.published` (best effort, log failures).
8. API routes per 04 (`withSession`). List returns `featured desc, createdAt desc`.
9. Pages: list (cards with cover, localized title with fallback for display only, Edit, Delete; empty state "Add your first project"; loading/error states), new/edit form (AR/EN tabs like S3 editor, uploaders for cover and gallery, featured toggle, metadata fields, Save/Cancel, field errors), delete via accessible confirm dialog (focus trap, Esc closes, confirm button loading).
10. Wire projects into `toRenderData` and the preview pages (Projects list page + Project Details by slug). Add "Projects" to sidebar, "Manage projects" to overview.
11. Logo: editor Company section uses `ImageUploader kind="logo"`; store `logoKey` (map to the renderer's logo field via `getPublicImageUrl` in `toRenderData`; renderer already handles a missing logo).
12. Tests: key parsing/ownership, project schema, `toRenderProject`, integration (test DB): user B cannot read/update/delete user A's project (all return NOT_FOUND), a key under another site's prefix is rejected, featured limit, delete does not remove keys referenced by a snapshot (use a fake `site.published`). S3 calls are behind small functions that tests replace with fakes (no real bucket in tests).

## Acceptance
- CP-3 and CP-4 pass in EN and AR with real uploads to the bucket; images load in the list and in the preview; broken image URLs fall back gracefully (rename a key in the DB to test).
- Uploading a 6 MB file or a `.gif`/`.svg` is rejected client-side AND server-side (show response).
- Sending a `key` that belongs to another site in a save payload -> `UPLOAD_REJECTED`.
- User B calling `/api/projects/{A's id}` GET/PATCH/DELETE -> 404 envelope.
- Deleting a project removes its objects from the bucket (show listing) when not in a published snapshot.
- Project with no cover, no gallery, only Arabic title renders correctly in preview (both locales).
- lint, tsc, test, build pass.

## Do NOT
Store full URLs, expose AWS keys to the browser, accept `siteId` from the client, add image processing/resizing, add Pexels, build manual reordering.
