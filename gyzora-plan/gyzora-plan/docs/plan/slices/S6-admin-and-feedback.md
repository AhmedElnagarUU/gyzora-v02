# S6: Owner admin dashboard and feedback

## Goal and user story
As the product owner I see all users, upgrade a user to Pro manually, unpublish or delete users, and read feedback. As a customer I can send feedback from anywhere in my dashboard.

## Depends on
S5 merged.

## Read first
Better Auth docs for the installed version: admin plugin (roles, `adminClient`, user listing/removal/ban APIs) and additional user fields. Verify exact API names in `node_modules/better-auth` types before use. `03-DATA-MODEL.md` (feedback, auditLog, rateLimits); D-08.

## Files
Create: `src/features/auth/lib/require-admin.ts`, `src/shared/http/with-admin.ts`, `src/shared/http/rate-limit.ts` (+ test), `src/features/admin/{service,audit,delete-user-cascade}.ts` (+ tests), `src/features/feedback/{service,repository,schemas}.ts` + `components/feedback-dialog.tsx`, `scripts/grant-admin.mjs`, API routes listed in 04 for admin users/feedback and `POST /api/feedback`, pages `app/[locale]/admin/{layout,page}.tsx`, `admin/users/{page,[id]/page}.tsx`, `admin/feedback/page.tsx`, admin components.
Modify: `auth.ts` (+ role support), `indexes.ts`, user menu (Admin link for admins), dashboard shell (feedback button), `package.json` (`admin:grant`), messages, `.env.example`.

## Tasks
1. Role support per Better Auth docs (prefer its admin plugin; if it cannot work with the Mongo adapter or installed version, use an additional user field `role` instead and document why in the PR). Default role `user`.
2. `scripts/grant-admin.mjs <email>`: sets role `admin` for that existing user (reads `MONGODB_URL` via `node --env-file=.env`); prints result, never secrets. `package.json`: `"admin:grant": "node --env-file=.env scripts/grant-admin.mjs"`.
3. `requireAdmin()` + `withAdmin`: server session AND role check. Admin pages: non-admin gets `notFound()` (404); admin APIs: `FORBIDDEN`. `admin/layout.tsx` guards the whole subtree; every admin API ALSO checks (never rely on the layout).
4. `rate-limit.ts`: `checkRateLimit(key, limit, windowSeconds)` using `rateLimits` collection with TTL (atomic `findOneAndUpdate` upsert + `$inc`); throws `RATE_LIMITED`. Unit-test the window logic with an injected clock/store.
5. Feedback: dialog opened by a button in the dashboard shell (lucide `MessageSquare`): type select, message (10-2000), "You may contact me" checkbox (default on); email and path come from session/`usePathname` on the SERVER side (not trusted from the form beyond `path` text, length-limited). Limit 5 per hour per user. Success message; accessible dialog.
6. Admin pages: Overview (counts: users, published sites, trialing, trials ending in 3 days, new feedback), Users (search by email/name, 20 per page, columns: name, email, joined, site status, plan state), User detail (profile, site summary + public link, entitlement state, actions below), Feedback (filter by status, mark reviewed, delete).
7. Admin actions with confirm dialogs and audit entries: grant Pro `days` (default 30; sets `billing.manualProUntil = max(now, current) + days`), revoke Pro, unpublish site (`unpublishReason:'admin'`), delete user.
8. `deleteUserCascade(userId)`: refuse self and other admins; collect all S3 keys (logo, project images, snapshot keys); delete projects, site, feedback.userId -> null; delete S3 objects (best effort); finally delete the auth user via Better Auth (sessions/accounts). Idempotent, safe to re-run after partial failure. Requires typed `confirmEmail` equal to the user's email.
9. Tests: require-admin matrix (anonymous/user/admin), integration: every `/api/admin/*` handler rejects non-admins (loop over the list), grant Pro math, cascade removes everything for the user and nothing for others, feedback rate limit (6th request -> RATE_LIMITED).

## Acceptance
- CP-7 and CP-10 pass in EN and AR.
- Non-admin visiting `/en/admin` -> 404; calling any admin API -> 403 (show list of calls and statuses).
- Granting Pro to a user whose trial expired makes `getPublishEntitlement` return `active_manual` (show dashboard of that user).
- Deleting a test user leaves no site/projects/sessions/objects for them and does not touch another user's data (show counts before/after).
- Admin cannot delete themselves or another admin.
- Feedback 6th submission in an hour is rejected with a translated message.
- lint, tsc, test, build pass.

## Do NOT
Create an email allowlist for admins, add admin features not listed, trust the client for the email shown on feedback, expose password hashes or tokens in any admin response.
