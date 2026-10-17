# S7: Google sign-in

## Goal and user story
As a visitor I click "Continue with Google" on sign-in or sign-up and land on my dashboard.

## Depends on / prerequisites
S0 merged. Owner: Google OAuth client and env (07 C).

## Read first
Better Auth docs for the installed version: social providers (Google), `authClient.signIn.social`, account linking options, error callback behaviour. Verify option names in `node_modules/better-auth` types. D-07.

## Files
Modify: `src/features/auth/lib/auth.ts`, `src/shared/config/env.ts` (`getGoogleEnv()` optional), sign-in and sign-up pages/forms, messages, `.env.example`.
Create: `src/features/auth/components/google-button.tsx` (inline Google "G" SVG; lucide has no brand icons), `src/features/auth/lib/auth-error.ts` (+ test).

## Tasks
1. Configure `socialProviders.google` only when both env vars exist. Account linking: DISABLED (D-07) unless the docs show a safe option that does not link to unverified password accounts; state the exact setting you chose in the PR.
2. Pages pass `googleEnabled` (server-side boolean, never the secrets) to the forms; the button and the "or" divider render only when true.
3. Button: `authClient.signIn.social({ provider: 'google', callbackURL: '/{locale}/dashboard', errorCallbackURL: '/{locale}/auth/sign-in?error=oauth' })` (verify the exact parameter names in the installed types). Loading state, disabled while pending, translated label.
4. `auth-error.ts` maps the `error` query value to a translated generic message (`auth.errors.oauth`, `auth.errors.accountExists`); unknown values -> generic. Render with `role="alert"`.
5. Messages EN+AR. Document redirect URI `${BETTER_AUTH_URL}/api/auth/callback/google` in `.env.example` comments.

## Acceptance
- CP-9 passes in EN and AR (real Google account): new user lands on `/{locale}/dashboard` with a server-recognized session; second sign-in works.
- With Google env vars removed the button is not rendered and the app builds and runs.
- A Google account whose email matches an existing PASSWORD account does not sign in to that account (shows the translated "account exists" message) - show the evidence.
- Cancelling at Google returns to sign-in with a translated generic error.
- lint, tsc, test, build pass.

## Do NOT
Add other providers, add email verification, expose client secret to the browser, replace email/password.
