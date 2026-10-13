# Epic 2: Authentication

**Goal:** Implement signup, sign in, and sign out flows using the existing authentication system (do not replace it). FR-01.

**Scope:**
- Signup, sign in, sign out
- Server-side validation, session handling
- Protected dashboard route redirects unauthenticated users
- Bilingual AR/EN labels/messages, RTL layout
- Loading/success/error states
- Invalid credentials handled without leaking sensitive info

**Out of scope:** password reset, social login, email verification, roles, dashboard content itself, Site creation.

## Proposed folder/file structure

This epic uses **better-auth** (library). First step is to install/configure better-auth in the project if not already present, following CODE_RULES. Also follows feature-based structure.

```
src/
  app/
    api/
      auth/
        [...all]/route.ts   # better-auth catch-all route
    [locale]/
      auth/
        sign-in/
          page.tsx
        sign-up/
          page.tsx
      dashboard/
        layout.tsx          # optional protection wrapper if needed
        page.tsx            # protected dashboard
  features/
    auth/
      components/
        sign-in-form.tsx
        sign-up-form.tsx
        sign-out-button.tsx
      lib/
        auth.ts             # better-auth server config
        auth-client.ts      # better-auth client
      schemas/
        sign-in-schema.ts
        sign-up-schema.ts
      types.ts
  middleware.ts             # route protection (server-validated)
  messages/
    en.json
    ar.json
```

> Note: Inspect existing auth setup first (delegate to Backend/Auth Dev). Do not duplicate or replace existing auth; extend to add UI flows if missing. better-auth is approved. No Server Actions.

## Milestones

1. [M2.1 Signup](./M2.1-signup.md)
2. [M2.2 Sign in](./M2.2-signin.md)
3. [M2.3 Sign out and route protection](./M2.3-signout-protect.md)
4. [M2.4 Auth UI states and bilingual](./M2.4-auth-ui-bilingual.md)