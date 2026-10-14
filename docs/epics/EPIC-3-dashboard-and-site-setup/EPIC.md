# Epic 3: Dashboard and Site Setup

**Goal:** Build the authenticated dashboard and the first-time site setup flow so a customer can create a single Site, see publish status, and access the editor without publishing. This covers FR-02, FR-03, FR-12, FR-13, FR-14, and the one-Site-per-user requirement from the PRD.

**Scope:**
- Authenticated dashboard with Site existence and publish-state summary
- One-Site-per-user guard in UI and server
- Site creation wizard with company name, category, description, logo, contact address, services, features, language preferences, and selection from the five-template catalog defined in [the design brief](../../template-design/README.md) and implemented through [the template-engine contract](../../template-engine/README.md)
- M3.2 owns connecting the existing Site-creation form and `/api/sites` handler to the template catalog. The picker must offer exactly `atelier`, `modern-build`, `urban-estate`, `interior-calm`, and `craft-studio`; the API must validate against that same catalog, not a duplicated or legacy list.
- Server-side validation for required fields and catalog-supported template IDs; any otherwise-valid authenticated request using a supported ID creates a draft Site, while unsupported IDs are rejected.
- No-publish creation flow that initializes editable Site content from template
- Redirects to editor or dashboard based on Site existence

**Out of scope:** project CRUD, publishing, public-site rendering, custom domains, billing, team roles.

## User stories
- As a customer, I want a dashboard that shows whether my Site exists and whether it is published, so that I know what to do next.
- As a customer, I want to create only one Site, so that the product stays tenant-isolated and predictable.
- As a customer, I want to create a Site from a template without publishing, so that I can refine the content safely before launch.
- As a product owner, I want server-side ownership and uniqueness checks, so that no user can create duplicate Sites or access another user's data.

## Acceptance criteria
- [ ] Dashboard loads for authenticated users and redirects unauthenticated users to sign-in.
- [ ] Users with no Site see a clear create-site action; users with an existing Site see edit, preview, and publish actions.
- [ ] Create-Site form validates required fields and rejects unsupported template choices.
- [ ] With otherwise valid data and an authenticated owner, creation succeeds for each of the five supported catalog IDs; unsupported IDs are rejected server-side. The picker defaults to a supported ID.
- [ ] A second Site creation attempt is blocked in the UI and rejected on the server.
- [ ] Concurrent creation attempts are safely rejected without creating duplicate Site records.
- [ ] Site creation initializes editable content from the chosen template but does not publish content.
- [ ] Site status reflects draft versus published state without leaking another user's content.

## Technical notes
- Use the existing Better Auth session and server-side route handlers under `src/app/api/**` only.
- Enforce `site.ownerUserId` unique index on MongoDB and perform creation under safe insert logic suitable for concurrent requests.
- Use `zod` validation at API boundaries and server-side ownership checks on every protected read/write.
- Keep the dashboard intentionally simple; no multi-site UI, no analytics, no billing.

## Dependencies
- Must happen after: [EPIC-1 Landing Page](../EPIC-1-landing-page/EPIC.md), [EPIC-2 Authentication](../EPIC-2-auth/EPIC.md)
- Blocks: [EPIC-4 Template and Editor](../EPIC-4-template-editor/EPIC.md), [EPIC-5 Projects and Publishing](../EPIC-5-projects-and-publishing/EPIC.md)

## Priority & size
- Priority: P0
- Size: L

## Definition of Done
- Dashboard and site-creation flows work in EN and AR with correct language/RTL handling.
- Duplicate creation is blocked both client-side and server-side.
- MongoDB uniqueness and ownership checks are tested.
- Build passes and the epic is ready for review by QA.

## Milestones
1. [M3.1 Dashboard and route guard](./M3.1-dashboard.md)
2. [M3.2 Site creation flow](./M3.2-site-creation.md)
3. [M3.3 Duplicate protection and status handling](./M3.3-status-guardrails.md)
