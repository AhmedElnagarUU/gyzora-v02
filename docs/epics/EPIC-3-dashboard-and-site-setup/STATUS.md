# Epic 3 Status

| Milestone | Status | Owner/Role | Notes |
|---|---|---|---|
| M3.1 Dashboard and route guard | blocked | Backend/Auth Dev | Server-side session redirect verified by inspection; runtime auth check blocked by MongoDB Atlas `querySrv ETIMEOUT`; empty/active states await supported templates and Site creation |
| M3.2 Site creation flow | blocked | Backend/Auth Dev | Site type and owner-scoped MongoDB repository added; five template designs/IDs are documented, but the engine catalog is not implemented; persistence/auth runtime also unverified |
| M3.3 Duplicate protection and status handling | todo | QA Lead | Concurrency checks, dashboard status, guardrails |

**Open questions:** Implement the five designs and supported IDs from `docs/template-design/README.md` through the separate template-engine session before enabling Site creation. Runtime persistence/auth verification requires restored MongoDB Atlas DNS/network access. **Assumptions:** Follow current schema and auth patterns; keep one-site-per-user enforcement server-side as the source of truth.
