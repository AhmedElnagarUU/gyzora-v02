# Epic 2 Status

| Milestone | Status | Owner/Role | Notes |
|---|---|---|---|
| M2.1 Signup | in progress | Backend/Auth Dev | Form and Better Auth API wiring are implemented; database-backed signup is unverified |
| M2.2 Sign in | in progress | Backend/Auth Dev | Form and Better Auth API wiring are implemented; invalid-credential behavior is unverified |
| M2.3 Sign out and route protection | in progress | Backend/Auth Dev | Sign-out button and server-validated dashboard guard are implemented; session lifecycle is unverified |
| M2.4 Auth UI states and bilingual | in progress | Frontend Dev | Bilingual forms and translated loading/success/error UI implemented; locale rendering check pending |

**Open questions:** End-to-end auth verification is blocked in this environment: MongoDB Atlas hostname resolution timed out (`querySrv ETIMEOUT`). Retry after database network/DNS access is available.
**Assumptions:** Use Better Auth with the project's configured MongoDB connection.