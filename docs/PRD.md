PRD: Multi-Tenant Company Profile Website Builder

Stage: MVP, production-ready | Type: Multi-tenant SaaS | Languages: Arabic (RTL) + English (LTR)

1. Vision & Scope

A simple SaaS that lets businesses in real estate, interior design, finishing, and construction create and manage a professional company profile website with no coding. Each customer picks a template, fills in company info, manages a project portfolio, previews, and publishes.

Not a general visual builder, ecommerce platform, or app builder.

Out of scope: multiple sites per user, ecommerce/payments, drag-and-drop builder, custom layouts, custom domains or new routing, team roles, analytics, billing.
Any scope expansion must be documented with reason, impact, and approval.

2. Principles
Simplicity first. One user owns at most one Site.
Templates are reusable and shared. Customer content is stored separately.
Strict tenant isolation.
Editing never requires publishing. The public site shows only the last successful publish.
Arabic and English across all relevant flows.
Templates ship with rich, realistic structure, never empty sections.
3. Core Concepts
Concept	Definition
User	Authenticated customer
Site	The customer's website: content, template, languages, publish state. Max one per user
Template	Reusable JSON-compatible definition of pages, sections, layout, and content slots. Never holds customer data
Project	A portfolio item (e.g. villa, apartment interior) belonging to a Site
Publication	The public version of a Site. Separate from editing
4. User Journey

Register/login → Dashboard → Create Site (if none exists) → Edit content and projects → Preview → Publish → Edit later → Publish updates.

5. Functional Requirements

FR-01 Auth. Use the existing auth system (don't replace it). Protected routes require a server-validated session.

FR-02 Dashboard. Shows Site existence and publish status, with links to editor, projects, preview, and publish. No multi-site UI. Duplicate creation is blocked in the UI and on the server.

FR-03 Site creation. Collects company name, category, description, logo, contact info, address, services, features, language preferences, and template. Only fields with a real product reason are required. Creation initializes editable content from the template plus the user's input, and does not depend on publishing.

FR-04 Templates. Provide five selectable template variations for the MVP. No templates currently exist; create five Gyzora definitions that follow the template-engine contract. Each must:

Have a coherent identity and consistent layout.
Use structured, reusable section definitions.
Support AR/EN and mobile/tablet/desktop.
Render cleanly when optional content or images are missing.
Contain no placeholder text or false company claims.

See [docs/template-design/README.md](./template-design/README.md) for the five
template design briefs and shared page/section plan. The template engine
architecture is documented in [docs/template-engine/README.md](./template-engine/README.md).

FR-05 Pages and sections. Home, About, Services, Projects, Project Details, Contact (or equivalents).

Home: hero, intro, services, featured projects, capabilities, process, CTA, contact.
Do not invent achievements, certifications, counts, or years of experience. Sample content must be clearly marked as sample.

FR-06 Content editing. Customers edit company info, About, services, features, contact info, section text, and images, before and after publishing. The editor loads saved content, validates, saves reliably, and shows success/error feedback. Edits never modify the shared template.

FR-07 Portfolio. Full CRUD on projects: title, description, category, location, cover image, gallery, optional metadata, and AR/EN fields. Validation must prevent invalid data from breaking public pages. Delete is ownership-checked and scoped to the Site.

FR-08 Images (Pexels). Verify the existing integration first, then use it for illustrative template imagery (hero, services).

Site generation must not depend on it.
Keys stay server-side.
Respect Pexels attribution and rate limits.
Provide alt text and graceful fallbacks for failed loads.
Keep illustrative images distinguishable from real customer project images.

FR-09 Publishing. Draft is editable and previewable. Publish makes the validated version public. Edits to a published site don't leak, and the old version stays live until the next publish succeeds. A failed publish never reports success. Pick the simplest reliable model (draft/snapshot/version) after inspecting the codebase, and document it.

FR-10 Bilingual. Covers the dashboard, creation, editor, public pages, template content, services, projects, navigation, and validation messages.

Correct RTL/LTR layout.
Language switching preserves Site and route context.
Language-specific content is modeled explicitly (not inferred from text direction).
Switching language never overwrites customer text.
Defined fallback policy for missing translations.
Follow the existing i18n architecture.

FR-11 Public access. Stable public route using the existing routing model. Verify the Site is published, render the correct template and content, and handle missing, deleted, and unpublished Sites gracefully. No cross-tenant rendering. No custom domains or new routing schemes.

FR-12 Persistence (MongoDB).

Site → one owner; Project → one Site.
Unique index on Site owner to enforce one-Site-per-user, with safe creation logic that survives concurrent requests.
Ownership validated server-side on every update and delete.
Templates never store mutable customer data.

FR-13 Security. On every protected operation, validate the server-side session and load resources with ownership-aware queries. Never trust a client-supplied userId. Apply this to creation, editing, projects, and publishing. Error messages must not leak sensitive info.

FR-14 UX. Loading, empty, success, and error states. No dead buttons. Responsive, consistent design tokens, accessible (labels, keyboard, contrast). Use lucide-react. No unnecessary dependencies.

FR-15 Production readiness. Reproducible build, correct env handling, server-side validation, solid error handling, regression tests for critical rules, a verified production build, and documented deployment prerequisites and known limitations. A passing build alone is not "production-ready."

6. Data Model (logical, reuse existing schemas where possible)
Site: id, ownerUserId (unique), templateId, status, company/website content, language config, draft/publish metadata, timestamps.
Project: id, siteId, title, description, category, metadata, images, language fields, timestamps.
Template: id, metadata, section structure, default content/schema, layout config, supported languages.
Publication: simplest model that fits the architecture. Document how draft and published stay consistent and how publish is made safe or atomic.
7. Non-Functional
Maintainability: follow existing architecture, AGENTS.md, and CODE_RULES.md. Keep it simple and readable for AI agents.
Performance: avoid redundant queries and heavy client JS. Measure before adding caching.
Security / Accessibility / Reliability: handle network and persistence failures without corrupting data or falsely reporting success.
8. Acceptance Criteria
ID	Criterion
PA-01	Register, log in, and access own dashboard. Other users' resources are denied
PA-02	One Site per user. Further and concurrent attempts are safely rejected
PA-03	Create a Site with a template and open the editor without publishing
PA-04	Edit and save content, and see it persist on revisit
PA-05	Add, edit, and delete projects, persisted and isolated per Site
PA-06	All five templates render complete, responsive, meaningful pages
PA-07	Dashboard and public site work in AR/EN with correct RTL/LTR
PA-08	Preview, publish, edit, and republish. Visitors see the correct published version
PA-09	API contracts, persistence, validation, and errors are tested
PA-10	Production build passes, key journeys are tested, no known critical security or isolation bug

Any criterion that can't be verified must be reported as blocked/unverified, never silently waived.

9. Constraints & Open Decisions

Constraints: Preserve the existing Next.js, MongoDB, auth, routing, i18n, and lucide-react setup. Add no unnecessary dependencies or services.

Resolve by inspecting the repo (don't assume):

Site, Project, and Template schemas
Public URL and language routing
Current draft/publish model
Image storage and Pexels integration
Template section schema and renderer
Caching and invalidation
Test framework and browser automation
Deployment config and env vars
10. Success

A business owner can independently register, create a professional company profile site, edit it, manage a portfolio, preview, publish, and update it later in Arabic or English, with one Site per user, tenant isolation, and all five templates rendering as complete sites.