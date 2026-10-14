# Epic 5: Projects and Publishing

**Goal:** Add project portfolio CRUD and a safe publish flow so a customer can manage a complete Site, preview it, and publish a validated version while preserving the last successful public version until the next publish succeeds. This covers FR-07, FR-09, FR-11, FR-12, FR-13, FR-14, and the publication model requirements.

**Scope:**
- Project CRUD: add, edit, delete, and list by Site
- Project validation for titles, descriptions, categories, metadata, cover image, gallery, and localized fields
- Preview and publish actions for draft Site state
- Atomic or safely sequenced publication model that preserves the last successful public version
- Ownership-checked server-side queries and delete actions
- Graceful handling for unpublished, missing, or deleted Sites

**Out of scope:** ecommerce, multi-site management, custom domains, advanced analytics, team roles.

## User stories
- As a customer, I want to manage a portfolio of projects under my Site, so that I can present completed work professionally.
- As a customer, I want to preview my Site before publishing, so that I can detect issues before making it public.
- As a customer, I want a safe publish flow, so that visitors only see a successful public version and older content stays live if publication fails.
- As a product owner, I want ownership checks on every project and publish operation, so that cross-tenant data exposure is impossible.

## Acceptance criteria
- [ ] Customers can create, edit, and delete projects scoped to their own Site.
- [ ] Deleting or updating a project is denied for other users and for invalid ownership.
- [ ] Preview shows the current draft or selected state without publishing.
- [ ] Published Site content remains available while a new publish is in progress or fails.
- [ ] Unpublished, deleted, or missing Sites are handled gracefully and never leak content.
- [ ] Publish uses the simplest reliable model documented in code and validated by QA.

## Technical notes
- Apply the simplest reliable draft/published model that matches the current codebase; do not widen scope into custom domains or complex versioning.
- Enforce per-Site ownership checks on all project and publish endpoints; never trust a client-supplied `userId`.
- Store publication metadata explicitly so the public site renders only the last successful published snapshot.
- Keep the public route stable and tenant-safe under the existing routing model.

## Dependencies
- Must happen after: [EPIC-4 Template and Site Editor](../EPIC-4-template-editor/EPIC.md)
- Blocks: [EPIC-6 Security, Persistence, and Launch Hardening](../EPIC-6-security-persistence/EPIC.md)

## Priority & size
- Priority: P0
- Size: L

## Definition of Done
- Project CRUD works per Site and passes ownership validation.
- Publish flow preserves the last successful version and handles failures safely.
- Public route renders the correct published state without cross-tenant leaks.

## Milestones
1. [M5.1 Project CRUD and validation](./M5.1-project-crud.md)
2. [M5.2 Preview and publish flow](./M5.2-preview-publish.md)
3. [M5.3 Public route and publish safety](./M5.3-public-route.md)
