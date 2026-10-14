# Epic 6: Security, Persistence, and Launch Hardening

**Goal:** Harden the MVP for production by enforcing server-side ownership checks, validating persistence and security assumptions, and covering deployment, environment, and operational readiness without adding unapproved services. This covers FR-12, FR-13, FR-15, and the production readiness constraints.

**Scope:**
- Security review of protected operations and ownership-aware queries
- MongoDB schema and index protections
- Validation, error-handling, and secret handling
- Rate limiting, input validation, and OWASP basics at the app boundary
- Test coverage for critical site, project, and publish flows
- Deployment prerequisites, environment config, rollback, and launch checklist

**Out of scope:** non-MVP expansion, billing, custom domains, team roles, analytics, advanced product features.

## User stories
- As a product owner, I want all protected operations to validate the server-side session and ownership before mutation, so that tenant isolation remains safe.
- As an engineer, I want regression tests around ownership, creation rules, and publishing, so that critical bugs do not regress.
- As a release manager, I want documented deployment conditions and operational checks, so that launch is repeatable and safe.
- As a maintainer, I want secure environment and secret handling, so that production data and credentials remain protected.

## Acceptance criteria
- [ ] Protected create/edit/delete/publish operations verify session and ownership server-side.
- [ ] All critical rules are covered by regression tests and build verification.
- [ ] Environment variables and secrets are documented and not committed.
- [ ] Deployment and rollback prerequisites are documented for launch readiness.
- [ ] Known limitations and production risks are communicated clearly.

## Technical notes
- Follow KISS and existing project architecture; do not add new dependencies or services unless explicitly approved.
- Keep security checks at the route boundary and data access layer; never trust client-supplied IDs or owner values.
- Validate the MongoDB uniqueness and publication model under concurrency to reduce production risk.
- Treat build passing as necessary but not sufficient; launch readiness requires manual checks and documentation.

## Dependencies
- Must happen after: [EPIC-5 Projects and Publishing](../EPIC-5-projects-and-publishing/EPIC.md)
- Blocks: launch and sign-off

## Priority & size
- Priority: P0
- Size: L

## Definition of Done
- Critical security and persistence assumptions are covered by tests and pass review.
- Deployment prerequisites and rollback notes are documented.
- The MVP is deemed production-ready according to the PRD acceptance criteria.

## Milestones
1. [M6.1 Security and validation hardening](./M6.1-security-validation.md)
2. [M6.2 Persistence and regression tests](./M6.2-persistence-tests.md)
3. [M6.3 Deployment and production checklist](./M6.3-deployment-checklist.md)
