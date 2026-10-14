# Template Engine

## Purpose and scope

The template engine renders Gyzora's five approved company-site designs from
shared, immutable definitions and customer-owned Site data. It is a fixed
product feature, not a general visual builder: customers choose a template and
edit supported business content, projects, and images; they do not add arbitrary
pages, rearrange sections, or edit layout code.

This document is the architecture and feature contract for the template-engine
MVP. The five visual design briefs and page/section plan are in
`docs/template-design/README.md`.

## Current repository state and implementation gate

The current Site profile already models company name, category, description,
services, features, address, and language preferences as explicit `en`/`ar`
values in `src/features/sites/types/site.ts`. The Site also has a `templateId`.
`src/features/sites/repository.ts` can create a Site and find one by owner.

The source now contains the five catalog IDs and shared page/section
definitions, typed Site/project render inputs, and a server-first renderer with
responsive theme styling. The renderer is not yet wired to a template picker,
editor, preview route, public route, or persisted Project model. Those
integrations remain with their owning features.

The catalog uses the Gyzora-specific directions and IDs in
`docs/template-design/README.md`; it does not adopt reference-project template
IDs or visuals. The five design directions still require visual review against
the product baseline before the template milestone can be considered complete.

## Responsibilities and boundaries

| Feature | Owns | Template-engine relationship |
| --- | --- | --- |
| Templates (`src/features/templates/`) | Five immutable template definitions, stable IDs, catalog lookup, supported page/section structure, renderer | Reads customer data as input; never persists or mutates it |
| Sites (`src/features/sites/`) | Site ownership, company profile, template selection, localized draft content, persistence | Supplies the owned Site draft and selected template ID; saves validated edits outside template definitions |
| Projects (future `src/features/projects/`) | Site-scoped project records, localized fields, cover and gallery images | Supplies only that Site's projects to supported project-list and project-detail views |
| Editor (future `src/features/editor/`) | Draft editing UI, save states, selection of language/page and supported fields | Uses the same template renderer in draft/edit mode; mutations go through API route handlers |
| Images (future `src/features/images/`) | Customer upload references and illustrative-image lookup/integration | Resolves template illustration slots separately from customer project media |
| Publishing (future `src/features/publishing/`) | Validation, publication snapshot, public-site lookup | Publishes a complete value snapshot; renderer consumes the snapshot, never the live draft |
| i18n (`src/i18n/`, `src/messages/`) | Product UI translations, locale routing, locale metadata | Supplies `en`/`ar`, labels, `lang`, and explicit `ltr`/`rtl`; customer copy remains Site data |

No feature should write customer values into a template definition. Site/project
repositories remain the persistence boundary; the template engine does not
connect to MongoDB, authenticate users, upload images, or publish content.

## Template definition and customer data

Each catalog definition should be plain, code-owned, read-only data with:

- A stable ID and bilingual name/description used by the template picker.
- Supported locales and a default theme/style configuration.
- Ordered pages with stable IDs and URL slugs.
- Ordered sections per page, selected from the engine's supported section types.
- Stable field keys and required/optional rules for editable customer values.
- Image slots for illustrative/template imagery, with local fallback assets and
  descriptive alt text.

The definition describes structure and presentation; it does not contain a
customer's company name, contact details, portfolio projects, credentials,
claims, or uploaded image references.

Customer-owned values remain on the Site or Project:

- Site profile: existing bilingual company/category/description/contact,
  services, features, and language preferences.
- Additional localized page copy: explicit `en` and `ar` values keyed by
  supported page/field identifiers.
- Projects: separate records scoped to a Site, with localized title,
  description, category/location as applicable, and customer image references.
- Illustrative assets: template-owned references/defaults, not Site project
  images.

The exact Site persistence shape for additional page copy, the Project record,
and image metadata belongs to those feature designs and must be agreed before
their implementation. Do not duplicate mutable profile or project data into
the catalog.

## Pages and section map

The MVP's supported page concepts come from the Gyzora PRD:

| Page | Typical content |
| --- | --- |
| Home | Hero, introduction, services, featured projects, capabilities, process, CTA, contact |
| About | Localized company story and supported capabilities |
| Services | Customer services and descriptions |
| Projects | Site-scoped project list and graceful empty state |
| Project Details | One project selected by its stable route identifier |
| Contact | Localized address and contact methods |

Templates may arrange or visually present supported sections differently while
using stable semantic section/field identifiers. A section is omitted or shown
with a deliberate empty state according to its definition; rendering must not
produce broken layout because optional customer content or an image is absent.
Avoid fabricated statistics, credentials, testimonials, years, or achievements.
Any demonstration data used in a template picker/preview must be clearly
identified as sample and must not be mistaken for a customer's published site.

The list above is the product-level page target. The five Gyzora design briefs
and page/section arrangement are defined in
`docs/template-design/README.md`; the renderer implements this shared page
structure, but route-level integration remains incomplete.

## Rendering contract

The renderer is a pure presentation boundary. It receives:

1. One immutable template definition, resolved from the supported catalog.
2. A render mode: template demo, authenticated draft/preview, or published.
3. Explicit locale (`en` or `ar`) and direction (`ltr` or `rtl`).
4. The corresponding customer data: Site profile/page copy and, where relevant,
   Site-scoped projects and customer images.
5. A stable active page and (for Project Details) a selected project.

It resolves the page and its ordered sections, selects a known section renderer,
passes only the relevant localized values and media, and applies the selected
template's style tokens. It does not fetch or mutate data. Unsupported template
IDs, page IDs, section types, and project IDs must be handled explicitly rather
than silently rendering another customer's data or a different template.

Prefer a small, typed section-renderer registry over arbitrary component names
or executable template data. Template-specific UI may use dedicated layout
components where the existing designs materially differ; shared semantic
sections and fields should not be duplicated merely for styling.

### Implemented module layout

```text
src/features/templates/
  types.ts                 Definition, page, section, media, and render-mode contracts
  catalog.ts               Five immutable definitions, shared page structure, and lookup
  render/
    TemplateRenderer.tsx   Resolve page and render shared header/footer
    TemplateSections.tsx   Render supported semantic section types
    TemplateImageFrame.tsx Render images and failed-load fallbacks
    localized.ts           Explicit locale selection, direction, and visible projects
```

The renderer receives data and route-link construction from its caller. It
does not choose a route scheme or fetch customer data. Keep template-specific
presentation in the theme styles unless a design genuinely needs a separate
component; do not introduce a plugin system or runtime JSON builder.
Sample-mode rendering displays the existing localized sample-preview label.
Template illustrations are defined on the immutable template; Site and Project
data remain caller-owned inputs.

## Feature interaction flows

### Site creation and template choice

```text
Authenticated creation UI
  → POST /api/sites (existing approved API path)
  → session + input/template validation
  → resolve supported template ID
  → create owned Site draft with templateId and customer profile
  → editor reads Site + immutable definition
```

The route handler should parse/translate the request and delegate feature logic.
The Sites feature verifies the Better Auth session and ownership rules; the
Templates feature validates that the ID is one of its supported definitions.
Template defaults are not copied back as customer content unless an explicit
product decision requires editable starter copy. Even then, seeded customer data
must be copied into the Site and never mutate the shared definition.

### Draft editing and preview

```text
Editor selects locale/page and edits an allowed field
  → PATCH /api/sites/... (route path to follow the approved milestone contract)
  → authenticated Sites API validates owner, locale, page, field and value
  → persist that locale's Site draft only
  → renderer receives refreshed draft + selected definition
```

Language switching changes the active locale, not the stored content. Each edit
targets exactly one locale's field. Preview uses the same current draft data as
the editor but does not publish it.

### Projects and project details

```text
Projects feature loads projects scoped to the authenticated Site / public Site
  → renderer receives that site's list for Projects
  → stable project route ID resolves one project for Project Details
```

Project CRUD and authorization remain owned by the Projects feature. The
template engine receives read-only project data and must not perform CRUD or
trust a client-supplied owner ID. Public project rendering must use the
published project's snapshot/data, not newer draft edits.

### Publication and public rendering

```text
Publish request
  → verify session + Site ownership
  → validate all required content for the chosen template and active locales
  → construct complete publication snapshot (Site + projects + template ID + media refs)
  → atomically replace last successful snapshot
  → public route resolves only the published snapshot
  → renderer uses snapshot template ID and snapshot data, read-only
```

The snapshot boundary must include every value used by public rendering,
including localized profile/page text, project data, image references, and
template ID/version metadata where needed. Do not render public fields from the
mutable Site draft. If validation or persistence fails, return an error and leave
the previous snapshot unchanged. The precise schema and update strategy are
owned by the Publishing design; this document does not claim they exist today.

## Localization, direction, and missing content

- Customer content is explicitly bilingual; locale is not inferred from text.
- Follow Gyzora's existing `next-intl` locale routes and `en`/`ar` configuration.
- Set `lang` and `dir` from the selected locale; use logical CSS properties for
  layout so the same structure works in LTR and RTL.
- A locale switch preserves Site, current page, and (on a project detail page)
  project identity. It must never copy one language's text over the other.
- **Proposed fallback:** do not substitute customer English text for missing
  Arabic or vice versa. Hide optional fields/sections when empty; make required
  fields visibly incomplete in the editor and reject publication until required
  active-locale fields are present.
- Product approval is still needed for this missing-translation policy and
  whether both languages are required for every publication.

## Images and attribution

Illustrative imagery belongs to template slots and must have a local fallback,
meaningful alt text, and provenance/attribution where its source requires it.
Customer project cover/gallery images are separate customer assets associated
with Project records. Neither type should overwrite or masquerade as the other.

The PRD mentions Pexels, but the inspected Gyzora implementation did not expose
an existing image integration, storage contract, or attribution flow. Verify
the existing integration before using it; keep keys server-side, respect
provider terms and rate limits, and ensure rendering works without network
image search. Image storage/upload routes and project media ownership belong to
the Images/Projects features, not the template renderer.

## Validation and error handling

- Validate template IDs against the finite catalog at Site creation and any
  later template change.
- Validate every edited page/field against the selected definition and validate
  the locale explicitly; unknown fields must not be persisted.
- Use Zod at API boundaries, followed by semantic checks in the owning feature.
- Enforce Site ownership server-side for reads of private draft data and all
  mutations; never accept a client-supplied owner as authority.
- Reject invalid public-page/project IDs with the existing route's not-found
  behavior. Do not fall through to unrelated content.
- Keep persistence/provider errors distinct from validation errors so the UI
  cannot report a save or publish success when it failed.

## Verification plan

Before calling the engine complete, verify:

1. All five approved template IDs resolve and render all agreed pages.
2. Supported sections render in each template without mutating definitions.
3. Empty optional text, missing customer images, and empty project lists do not
   break the layout.
4. English and Arabic values remain isolated during editing and switching;
   direction is correct on each page.
5. Draft preview reflects draft values, while public rendering reads only the
   last successful snapshot, including project data.
6. Invalid template/page/field/project identifiers and non-owner access fail
   closed.
7. Critical validation, locale isolation, rendering fallbacks, and publication
   retention have automated regression coverage using the project's approved
   tooling.
8. Run the project lint, type-check, and production build commands required by
   `CODE_RULES.md`; any unavailable runtime/browser checks remain explicitly
   unverified.

## Decisions required before completing implementation

1. Confirm final localized display names/descriptions and visual approval for
   the five design directions.
2. Confirm any implementation detail that differs from the shared
   page/section plan, especially Projects and Project Details.
3. Approve the missing-translation and publication-language requirement.
4. Confirm whether Pexels is already integrated elsewhere, and identify the
   required attribution and customer-image storage contracts.
5. Confirm the existing stable public-page route and approved route-handler
   paths for editor operations; preserve them rather than inventing new routes.

**Status:** catalog and renderer foundation implemented; feature integration,
final localized template labels, visual review, project persistence, and
public/editor route wiring remain incomplete or unverified.
