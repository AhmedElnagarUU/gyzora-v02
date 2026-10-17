# S0: Foundations

## Goal
Fix the structural problems found in the audit so every later slice builds on solid ground. No new user features.

## Depends on / prerequisites
Owner: font files in `src/app/fonts/` (07 A). If missing: STOP and ask.

## Read first
`CODE_RULES.md` sections 4, 6, 7; `src/app/layout.tsx`; `src/app/[locale]/layout.tsx`; `src/proxy.ts`; `src/i18n/*`; `src/shared/db/mongodb.ts`; `src/features/auth/lib/auth.ts`; `src/features/sites/{repository,create-site}.ts`; next-intl docs for root layouts, `not-found`, and `proxy`; `node_modules/next/dist/docs/` (proxy, fonts, not-found, error).

## In scope
lang/dir on `<html>`, local fonts, lucide-react, central env, API helpers, unique index + safe create, 404/error/loading pages, language switcher on auth pages, hardcoded-string fixes, i18n parity test, unknown-project 404, `npm run test`.
## Out of scope
Dashboard UI, site creation UI, any new feature.

## Files
Create: `src/shared/config/env.ts`, `src/shared/db/indexes.ts`, `src/shared/http/api-response.ts`, `src/shared/http/with-session.ts`, `src/shared/http/app-error.ts`, `src/shared/ui/language-switcher.tsx`, `src/features/auth/components/auth-shell.tsx`, `src/app/[locale]/not-found.tsx`, `src/app/[locale]/error.tsx`, `src/app/[locale]/loading.tsx`, `src/app/fonts/*` (owner), `src/messages/messages.test.mjs`, `.env.example`.
Modify: `package.json`, `src/app/[locale]/layout.tsx`, `src/app/layout.tsx` (remove) and `src/app/page.tsx` (remove only if the proxy already redirects `/`), `src/shared/db/mongodb.ts`, `src/features/auth/lib/auth.ts`, `src/features/sites/repository.ts`, `src/features/sites/create-site.ts`, `src/app/api/sites/route.ts`, landing `language-switcher.tsx` (move), auth pages, template preview page + bar + `TemplateSections.tsx` (hardcoded strings), `CODE_RULES.md` (approved packages), `src/messages/*.json`.

## Tasks
1. Branch `slice/S0-foundations`.
2. `npm install lucide-react`; add it to the approved list in `CODE_RULES.md` section 4. Replace nothing yet (later slices use it).
3. `src/shared/config/env.ts`: lazy zod getters (`getDbEnv` -> `MONGODB_URL`; `getAuthEnv` -> `BETTER_AUTH_SECRET`, `BETTER_AUTH_URL` default `http://localhost:3000`). Errors name the variable, never the value. Replace direct `process.env` reads in `mongodb.ts` and `auth.ts`. Add `.env.example` from the pack; make sure `.gitignore` ignores `.env` but not `.env.example`. Do not open or print `.env` values (names only).
4. Root layout: make `[locale]/layout.tsx` the root layout: `<html lang={locale} dir={locale === 'ar' ? 'rtl' : 'ltr'}>` + `<body>`, `setRequestLocale`, `NextIntlClientProvider`. Delete `src/app/layout.tsx`. First confirm `src/proxy.ts` redirects `/` to `/{locale}` (matcher includes `/`); only then delete `src/app/page.tsx`. Follow next-intl docs; verify the document element in the browser/HTML.
5. Fonts: `next/font/local` in the locale layout with the owner's files (Latin + Arabic), expose CSS variables, Arabic font used when `dir=rtl`. Remove `next/font/google`. `npm run build` must pass with no network.
6. `[locale]/not-found.tsx` (translated, link home), `error.tsx` (client, translated, retry button, no error text shown), `loading.tsx`. Follow next-intl docs for unmatched routes (catch-all route calling `notFound()`) so unknown URLs under `/en/...` render the localized page. Keys under `common.*`.
7. API helpers: `AppError(code, status, fields?)`, `ok(data, status=200)`, `fail(error)`, `withSession(handler)` (validates session with `getSession()`, returns `UNAUTHENTICATED`, catches `AppError`/`ZodError`/unknown per 04). Codes list from 04. Use zod 4 error shape correctly (verify in zod docs) to build `fields`.
8. `src/shared/db/indexes.ts` `ensureIndexes()`: create unique index `sites.ownerUserId`. Call it once (memoized promise) from `getDatabase()`. On duplicate-key failure throw an explicit error message telling the owner to clean duplicates.
9. Safe create: in `repository.createSite` catch Mongo error code 11000 and throw `AppError('SITE_ALREADY_EXISTS', 409)`; remove the check-then-insert in `create-site.ts` (keep a cheap pre-check only for nicer UX if you want, but the index is the authority). Update `/api/sites` to use `withSession` and to return 400 with `fields` and 409 properly.
10. Language switcher: move to `src/shared/ui/language-switcher.tsx` (used by landing, auth, dashboard, templates). Behaviour: switch locale keeping pathname AND search params (and hash). Use `AuthShell` (brand link + switcher + centered content) on sign-in/sign-up pages.
11. Fix hardcoded strings: template preview page metadata (use `getTranslations` + `generateMetadata`), aria-labels in `template-preview-bar.tsx` and `TemplateSections.tsx`, `'Home'` label. Add keys to both message files.
12. Template preview route: unknown project id -> `notFound()` (currently falls back to project[0]).
13. `src/messages/messages.test.mjs`: fails if `en.json` and `ar.json` key sets differ. `package.json`: `"test": "node --disable-warning=MODULE_TYPELESS_PACKAGE_JSON --experimental-strip-types --test <all existing test files + messages.test.mjs>"` (keep `test:templates` working).
14. Integration test (skips if `MONGODB_TEST_URL` unset): two concurrent `createSite` for the same owner -> exactly one succeeds, the other throws `SITE_ALREADY_EXISTS`. (Needs a way to point the DB at the test URL; implement via an optional parameter or `getDbEnv` reading `MONGODB_TEST_URL` only when `NODE_ENV==='test'`; keep it small.)
15. `docs/plan/STATUS.md`, PR.

## Acceptance
- A1 `/en` and `/ar` HTML root element is `lang="en" dir="ltr"` / `lang="ar" dir="rtl"` (show `curl` output or DevTools).
- A2 `npm run build` passes with NO network access to Google Fonts; no `next/font/google` left.
- A3 Unknown URL under `/en/x` and `/ar/x` shows the localized 404 with a link home.
- A4 Language switcher works on landing, sign-in and sign-up; switching keeps path and query string.
- A5 `sites` has a unique index on `ownerUserId` (show `getIndexes()` output) and the concurrency test passes (or is UNVERIFIED with reason).
- A6 `POST /api/sites` unauthenticated -> 401 envelope; invalid body -> 400 with `fields`.
- A7 No `process.env` outside `shared/config/env.ts` (show grep). No hardcoded strings from audit section 9 remain (show grep).
- A8 Unknown project id in template preview -> 404.
- A9 lint, tsc, `npm run test`, build pass.

## Do NOT
Change Better Auth behaviour, redesign pages, add packages other than lucide-react, touch the template catalog/renderer beyond the strings and 404 fix.
