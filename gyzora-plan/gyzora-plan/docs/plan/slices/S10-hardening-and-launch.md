# S10: Hardening and launch

## Goal
Make the MVP safe to launch and prove it against the PRD acceptance criteria. No new user features.

## Depends on / prerequisites
All slices merged. Owner: production accounts/keys (Polar production, bucket, Google prod redirect URI, scheduler).

## Read first
Everything in `docs/plan`, the PRD (FR-13, FR-15, PA-01..PA-10), `CODE_RULES.md`, Next.js docs on `headers()` config.

## Files
Create: `docs/DEPLOYMENT.md`, `docs/KNOWN-LIMITATIONS.md`, `docs/PA-MATRIX.md`, `src/app/api/route-manifest.test.mjs`.
Modify: `next.config.ts` (security headers), API routes that still lack limits, any file with leftover dead code, `.env.example`, `docs/plan/STATUS.md`.

## Tasks
1. Route-manifest test: enumerate every `src/app/api/**/route.ts`; each exported handler must be wrapped by `withSession`, `withAdmin` or `withCron`, or the route must be in an explicit allowlist (`auth/[...all]`, `webhooks/polar`). The test fails for any new unprotected route.
2. Rate limits (S6 limiter): presign 60/hour/user, project writes 120/hour/user, site saves 300/hour/user, wallet requests 5/day/user, checkout 5/hour/user, feedback 5/hour/user. Confirm Better Auth's built-in rate limiting is enabled in production per its docs and state the setting.
3. Security headers via `next.config.ts` `headers()`: `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, `X-Frame-Options: SAMEORIGIN`, `Permissions-Policy` minimal. No CSP unless tested (list it under known limitations).
4. Audit pass: grep for `process.env` outside `env.ts`, `any`, `@ts-ignore`, `use server`, hardcoded strings, directional CSS, `console.log` of sensitive data, unused env vars, dead code and unused message keys. Fix or list.
5. Ownership/isolation audit: for every API route write one line in `docs/PA-MATRIX.md`: auth, validation, ownership query, tested by (file). Anything untested gets a test now.
6. `docs/DEPLOYMENT.md`: env table (name, required, where used, example), S3 bucket policy/CORS, Google redirect URIs, Polar production setup + webhook URL, cron schedule, build/start commands, `MONGODB` backup (`mongodump` before deploy) and rollback (previous build + restore), health check steps, first-admin step.
7. `docs/KNOWN-LIMITATIONS.md`: honest list (no email verification/password reset, Google linking disabled, wallet payments manual, no CSP, no Playwright, no project reordering, IP-based country detection, etc.).
8. `docs/PA-MATRIX.md`: PA-01..PA-10 each `verified (evidence)` or `UNVERIFIED (why, what the owner must do)`. Run CP-1..CP-10 in EN and AR on a production-like build (`npm run build && npm start`) and record results.
9. Optional (needs owner answer to D-10): propose Playwright for CP-1, CP-5 only; do not install without approval.

## Acceptance
- Route-manifest test passes; deliberately adding an unprotected route makes it fail (show once, then revert).
- All rate limits return `RATE_LIMITED` when exceeded (show one example per limit or a test).
- Response headers present (show `curl -I`).
- `npm run lint`, `npx tsc --noEmit`, `npm run test` (including integration with `MONGODB_TEST_URL`), `npm run build` pass; production-mode manual run of all CPs recorded.
- PA matrix complete with no silently waived item.
- No secrets in the repo (`git log -p` grep for key patterns summarized) and `.env` untracked.

## Do NOT
Add features, change the data model, add dependencies, mark anything verified without evidence.
