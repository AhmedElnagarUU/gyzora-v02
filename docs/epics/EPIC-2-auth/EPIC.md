# Epic 2: Authentication Reimplementation

**Goal:** Reimplement and verify Gyzora email/password authentication using the existing Better Auth dependency and MongoDB setup. The current sign-out is reported broken, and the app has no `authClient`; treat the current auth UI integration as untrusted until rebuilt and tested. Preserve Better Auth and the existing database rather than replacing either. Covers PRD FR-01 and protected-session behavior.

**Scope:**
- A verified Better Auth server configuration and Next.js catch-all API route
- A shared Better Auth React client for client-side email signup, sign-in, sign-out, and session-aware UI where needed
- Server-validated sessions in server components/routes using request headers
- Working signup/sign-in/sign-out, cookie/session lifecycle, and protected dashboard redirect
- Bilingual AR/EN labels/messages, RTL/LTR layout, loading and safe error states
- Generic invalid-credential feedback without account-existence leakage

**Out of scope:** password reset, social login, email verification, roles, Site dashboard content, Site creation.

## Required integration shape

Use the installed Better Auth version and its official API; do not add a competing custom auth API.

```
src/
  app/
    api/
      auth/
        [...all]/route.ts   # toNextJsHandler(auth)
    [locale]/
      auth/
        sign-in/
          page.tsx
        sign-up/
          page.tsx
      dashboard/
  features/auth/
    lib/auth.ts             # Better Auth server configuration
    lib/auth-client.ts      # createAuthClient from better-auth/react
    lib/session.ts          # server-side session helper using headers()
    components/             # forms and sign-out button using the client
```

The `nextCookies()` plugin must be last in the plugin array when used. Keep the existing feature-based structure and no-Server-Actions rule. Use `authClient.signUp.email`, `authClient.signIn.email`, and `authClient.signOut` for client flows. Use `auth.api.getSession({headers: await headers()})` for server-validated session reads. Do not manually reproduce Better Auth endpoints with ad hoc fetch calls unless a documented, tested requirement justifies it.

## Official references

- [Better Auth Next.js integration](https://www.better-auth.com/docs/integrations/next)
- [Better Auth email and password](https://www.better-auth.com/docs/authentication/email-password)
- [Better Auth session management](https://www.better-auth.com/docs/concepts/session-management)
- [Better Auth installation](https://www.better-auth.com/docs/installation)

## Milestones

1. [M2.0 Better Auth foundation and client](./M2.0-auth-foundation.md)
2. [M2.1 Signup](./M2.1-signup.md)
3. [M2.2 Sign in](./M2.2-signin.md)
4. [M2.3 Sign out and route protection](./M2.3-signout-protect.md)
5. [M2.4 Auth UI states and bilingual](./M2.4-auth-ui-bilingual.md)