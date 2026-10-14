# Epic 3 Status

| Milestone | Status | Owner/Role | Notes |
|---|---|---|---|
| M3.1 Dashboard and route guard | blocked | Backend/Auth Dev | Server-side session redirect verified by inspection; runtime auth check remains blocked by MongoDB Atlas `querySrv ETIMEOUT`; dashboard Site-state logic still awaits live Site persistence |
| M3.2 Site creation flow | in progress | Backend/Auth Dev | Site schema, validation, template seeding, and draft creation route are implemented; live MongoDB runtime verification is still blocked by the Atlas DNS timeout |
| M3.3 Duplicate protection and status handling | todo | QA Lead | Concurrency checks, dashboard status, guardrails |

**Open questions:** Live database-backed creation and auth verification require restored MongoDB Atlas DNS/network access. M3.1 still needs real Site persistence and dashboard states before it can show empty/active states safely. **Assumptions:** Follow current schema and auth patterns; keep one-site-per-user enforcement server-side as the source of truth.
