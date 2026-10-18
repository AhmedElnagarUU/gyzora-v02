## Slice
S0: Foundations

## Summary
Structural foundation only — no new user features. The app now has a single root layout at
`src/app/[locale]/layout.tsx` that sets `<html lang dir>`, local fonts (Latin + Arabic with an
RTL font switch), centralised env access, localised 404/error/loading UI, shared API helpers, a
unique index on `sites.ownerUserId` with race-safe site creation, and a shared language switcher
wired onto landing, sign-in and sign-up. `npm run test` now runs the existing suites plus an
i18n key-parity test and a concurrency integration test. `lucide-react` is installed and approved
but unused until later slices.

## Acceptance checklist (evidence required for each)
- [x] A1 `/en` and `/ar` root element is `lang="en" dir="ltr"` / `lang="ar" dir="rtl"` — evidence: curl → `<html lang="en" dir="ltr" class="sanslatin_… sansarabic_… h-full antialiased">` and `<html lang="ar" dir="rtl" class="…">`.
- [x] A2 build passes with no Google Fonts network; no `next/font/google` — evidence: `npm run build` ✓; `fonts.googleapis.com` refs = 0, `fonts.gstatic.com` refs = 0; only `/_next/static/media/Geist_VariableFont_wght-*.ttf`; CSS has 6 `IBMPlexSansArabic` `@font-face` entries and the `[dir="rtl"] body` font rule.
- [x] A3 unknown URL under `/en/x` and `/ar/x` shows the localised 404 with a home link — evidence: both `404`; EN response carries `h1 "Page not found"` + `"Back to home"` → `href="/en"`; AR carries `الصفحة غير موجودة` + `العودة إلى الصفحة الرئيسية` → `href="/ar"`; `robots noindex` present.
- [ ] A4 language switcher on landing, sign-in, sign-up, keeping path + query — **UNVERIFIED (needs owner, no browser here)**. Partially checked: the switch control renders on all three pages in both locales (`shared/ui/language-switcher.tsx` reference present, `dir` correct). See "UNVERIFIED items" for steps.
- [x] A5 unique index on `sites.ownerUserId` + concurrency test — evidence (index): `[{"v":2,"key":{"_id":1},"name":"_id_"},{"v":2,"key":{"ownerUserId":1},"name":"ownerUserId_unique","unique":true}]`; duplicate owner groups = 0. Concurrency test file exists but **UNVERIFIED** (no `MONGODB_TEST_URL`).
- [x] A6 `POST /api/sites` unauthenticated → 401 envelope; invalid body → 400 with `fields` — evidence: `401 {"error":{"code":"UNAUTHENTICATED"}}`; with a session: `400 {"error":{"code":"VALIDATION_FAILED","fields":{"companyName":"too_small","category":"too_small","templateId":"custom"}}}`; valid body → `201 {"data":{"siteId":"…","status":"draft"}}`; repeat → `409 {"error":{"code":"SITE_ALREADY_EXISTS"}}`.
- [x] A7 no `process.env` outside `shared/config/env.ts`; no hardcoded strings left — evidence: grep for `process.env` under `src/` returns only `src/shared/config/env.ts` (+ the sanctioned `NODE_ENV`/`MONGODB_TEST_URL` reads in the integration test); grep for literal `aria-label="…"`, `title="…"`, `placeholder="…"`, `alt="…"` returns no matches; preview titles resolve through translations (`Editorial Atelier — Home | Gyzora Live Preview` / `Editorial Atelier — الرئيسية | معاينة قالب جيزورا المباشرة`). See "Observations" for the scope decision (audit §9 was never supplied).
- [x] A8 unknown project id → 404 — evidence: `/en/templates/atelier/projects/nope` → `404`, `/ar/templates/atelier/projects/nope` → `404`.
- [x] A9 lint, tsc, `npm run test`, build — evidence: `npm run lint` ✓; `npx tsc --noEmit` ✓; `npm run test` 11 pass / 1 skipped (integration, needs `MONGODB_TEST_URL`); `npm run build` ✓.

## Click-paths (EN and AR)
| Path | EN | AR | Notes |
|---|---|---|---|
| `/{locale}` landing | [x] loads 200, switcher present | [x] loads 200, `dir=rtl`, switcher present | visual check not done (no browser) |
| `/{locale}/auth/sign-in` | [x] 200, `AuthShell` (brand + switcher + form) | [x] 200, RTL | visual check not done |
| `/{locale}/auth/sign-up` | [x] 200, `AuthShell` | [x] 200, RTL | visual check not done |
| `/{locale}/does-not-exist` | [x] 404 localised + home link | [x] 404 localised + home link | via curl |
| `/{locale}/templates/{id}` | [x] 200 translated title | [x] 200 translated title | |
| `/{locale}/templates/{id}/projects/nope` | [x] 404 | [x] 404 | |

## Commands
```
npm run lint: pass
npx tsc --noEmit: pass
npm run test: 11 pass, 1 skipped (concurrency test needs MONGODB_TEST_URL)
npm run build: pass (Next.js 16.4.0, Turbopack)
```

## Deviations from the slice (files outside the list, spec changes) and why
1. **`src/app/[locale]/loading.tsx` → `src/app/[locale]/dashboard/loading.tsx`** (owner-approved). Task 6 names the file at `[locale]`, but Next 16 fixes the response status at `200` as soon as a `loading.tsx` Suspense fallback renders ("Calling `notFound()` … before this point preserves its 404 status" — `node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/loading.md`). Verified empirically: with the file at `[locale]` both A3 and A8 returned `200`; after moving it they return `404`. The loading UI is kept for the DB-backed dashboard area.
2. **`src/app/[locale]/[...rest]/page.tsx`** — required by task 6 ("catch-all route calling `notFound()`") but not named in the slice's Files list.
3. **`src/features/sites/create-site.integration.test.mjs`** — task 14 requires the test; the Files list omitted it. It registers a ~20-line `@/`-alias + extensionless-`.ts` resolve hook with `module.registerHooks()` because Node cannot resolve tsconfig `paths` (verified: `ERR_MODULE_NOT_FOUND`); the hook is limited to files under `src/` that exist, so it does not affect `node_modules`.
4. **`src/shared/http/app-error.ts`** — written without TypeScript parameter properties. `--experimental-strip-types` (the runner prescribed by task 13) rejects them (`ERR_UNSUPPORTED_TYPESCRIPT_SYNTAX`), and the integration test imports `AppError`. Same public shape.
5. **`.github/pull_request_template.md`** — installed from the plan pack (`repo-root-files/`); it did not exist at the repo root.

## New dependencies / env vars / routes (must match docs/plan; `.env.example` updated?)
- Dependency: `lucide-react` (approved list updated in `CODE_RULES.md` §4). Not used yet.
- Env: `.env.example` added from the pack; `.gitignore` now keeps `.env*` ignored but allows `!.env.example`.
- Routes: `/` removed (proxy already redirects `/` → `/{locale}`); `/[locale]/[...rest]` added. `/[locale]/loading.tsx` relocated (see Deviations).

## UNVERIFIED items (what, why, exact manual steps for the owner)
1. **A4 click-through** (no browser available in this environment). Steps: (EN) open `/en`, click the language button top-right → expect `/ar` with RTL; open `/en/templates/atelier?x=1#hero`, click the switcher → expect `/ar/templates/atelier?x=1#hero` (path, query and hash kept); repeat on `/en/auth/sign-in` and `/en/auth/sign-up`. Then repeat starting from `/ar` (button label reads "English").
2. **A5 concurrency test** — skipped because `MONGODB_TEST_URL` is not set. Set it to a **separate** database (07 G) and run `npm run test`; expect 11 pass + 1 pass for "concurrent site creation for the same owner creates exactly one site". Without a test DB the file prints `SKIPPED: MONGODB_TEST_URL not set`.

## Arabic wording for owner review
- `common.notFound`: `الصفحة غير موجودة` / `الصفحة التي تبحث عنها غير موجودة أو تم نقلها.` / `العودة إلى الصفحة الرئيسية`
- `common.error`: `حدث خطأ ما` / `تعذّر تحميل هذه الصفحة. يرجى المحاولة مرة أخرى.` / `إعادة المحاولة`
- `common.loading.label`: `جارٍ التحميل...`
- `common.brand`: `Gyzora` / `الصفحة الرئيسية لجيزورا`
- `common.language`: `التبديل إلى العربية` / `التبديل إلى الإنجليزية` / `إنجليزي` / `عربي` (moved verbatim from `landing.language`)
- `landing.nav.keyHighlights`: `أبرز المزايا`
- `templatePreview.navLabel`: `صفحات القالب`; `templatePreview.viewportLabel`: `عرض متجاوب`; `templatePreview.language`: `الإنجليزية` / `العربية`
- `templatePreview.metadata.title`: `{template} — {page} | معاينة قالب جيزورا المباشرة`; `description`: `معاينة تفاعلية مباشرة لقالب {template} على جيزورا.`

## Observations (not fixed here)
- **Dev database incident during verification (needs owner attention).** While removing my own throwaway test rows I filtered by `user.id`, but better-auth stores `_id` (no `id` field), so the filter matched every document: all 3 `user` documents in the dev DB were deleted — 2 accounts created 2026‑10‑14 (owner's) and my throwaway account. The `account` (password hashes) and `session` documents survived; I then deleted only my own test artifacts (site, account, sessions). Emails/names are not recoverable from the remaining data, so those two accounts can no longer sign in. Their `_id`s are known (`6acf841e399bc897e583c139`, `6acf958e399bc897e583c143`), so the `user` documents can be recreated with the original `_id` if the owner supplies email/name — the surviving password hashes and sessions would then work again. Nothing else in the DB was touched.
- Audit "section 9" (referenced by A7) does not exist anywhere in the repo or the plan pack. Owner confirmed to proceed; the hardcoded-string scope was taken from task 11 (preview metadata, `template-preview-bar.tsx`, `TemplateSections.tsx`, `'Home'` label) plus a grep sweep of the files this slice touches.
- `TemplateRenderer`/`TemplateSections` reuse the `landing.nav` namespace for site-section labels (pre-existing pattern); `keyHighlights` was added there to stay consistent.
- The landing header still hardcodes the brand mark `G`/`Gyzora` (out of the slice's file list). The preview bar and `AuthShell` now use `common.brand.name`.
- `createSiteSchema` is not `.strict()` (architecture §10 asks for strict bodies); left as-is because the schema is not in the slice's file list and the create-site form depends on it.
- Next 16 delivers `notFound()` responses as an `__next_error__` shell with the localised boundary in the RSC payload (client-rendered) rather than server-rendered markup; `noindex` is included.
- The plan pack copy `gyzora-plan/gyzora-plan/repo-root-files/.env.example` remains untracked (owner's file, not committed by me).

## Risk / rollback
- Low code risk: no feature changes; later slices build on these helpers.
- The `sites.ownerUserId` unique index is created on first DB use. If duplicates already existed, `ensureIndexes()` throws with an explicit message telling the owner to remove duplicates (07 H). The dev DB had none.
- Rollback: revert this branch; the app returns to two layouts and the old font setup. Note the dev-DB `user` documents described above are not recoverable by rollback.
