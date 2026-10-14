# Epic 7: Production Readiness and Launch Sign-off

**Goal:** Confirm the MVP is production-ready by validating the end-to-end critical path, build quality, operational readiness, and user-facing stability under the PRD's acceptance criteria. This is the final gate before launch and is intentionally narrow to MVP requirements.

**Scope:**
- Final end-to-end QA of registration, dashboard, site creation, editing, projects, preview, and publish
- Production build verification and environment validation
- Documentation of deployment prerequisites, limitations, and rollback readiness
- Launch sign-off checklist and outstanding risks

**Out of scope:** post-MVP improvements, analytics platform, team roles, payments, custom domains, broader marketing features.

## User stories
- As a release manager, I want a final QA gate for the full MVP flow, so that launch is based on real evidence.
- As a product owner, I want any blocker or unverified item flagged before release, so that nothing is silently waived.
- As an engineer, I want a final production checklist, so that environment and rollback readiness are explicit.

## Acceptance criteria
- [ ] The critical user journey passes end-to-end in both locales where applicable.
- [ ] The production build and key validations pass with no critical issue unresolved.
- [ ] All PRD acceptance criteria are either validated or explicitly reported as blocked/unverified.
- [ ] Launch checklist and known limitations are documented before sign-off.

## Technical notes
- This epic does not add new product scope; it validates the complete MVP path.
- Any missing, blocked, or uncertain item must be surfaced explicitly rather than silently waived.
- Keep the launch gate simple and evidence-based; do not broaden the release beyond the approved MVP.

## Dependencies
- Must happen after: [EPIC-6 Security, Persistence, and Launch Hardening](../EPIC-6-security-persistence/EPIC.md)
- This is the final release gating epic.

## Priority & size
- Priority: P0
- Size: M

## Definition of Done
- Full MVP path passes QA and build verification, or all remaining blockers are documented and accepted.
- Launch readiness checklist is complete and signed off.

## Milestones
1. [M7.1 QA walkthrough and critical path verification](./M7.1-qa-walkthrough.md)
2. [M7.2 Production build and deployment verification](./M7.2-production-build.md)
3. [M7.3 Launch sign-off and known limitations](./M7.3-launch-signoff.md)
