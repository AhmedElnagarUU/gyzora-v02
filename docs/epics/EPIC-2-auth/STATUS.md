# Epic 2 Status

| Milestone | Status | Owner/Role | Notes |
|---|---|---|---|
| M2.0 Better Auth foundation and client | done | Backend/Auth Dev | Better Auth 1.7.7 handler/client/session integration verified against MongoDB; lint, typecheck, and build pass |
| M2.1 Signup | done | Backend/Auth Dev | EN/AR account and session creation verified; duplicate and server-invalid signup rejected safely; test records cleaned |
| M2.2 Sign in | done | Backend/Auth Dev | EN/AR server-recognized sign-in verified; incorrect credentials return generic feedback |
| M2.3 Sign out and route protection | done | Backend/Auth Dev | EN/AR signout invalidates sessions and dashboard redirects; simulated failures stay on dashboard with translated error |
| M2.4 Auth UI states and bilingual | done | Frontend Dev | EN/AR labels, feedback, loading states, redirects, and RTL verified |

**Open questions:** None. MongoDB connectivity and runtime signup, sign-in, sign-out, cookie/session, and protected-route behavior were verified against the configured database.
**Assumptions:** Preserve Better Auth, its existing MongoDB adapter/database, locale routing, and server-side session guard. Treat current auth UI calls as needing replacement unless implementation testing demonstrates a specific piece is correct.