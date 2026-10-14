# Epic 4: Template and Site Editor

**Goal:** Define and integrate five selectable Gyzora template variations with the separate template engine, and build the site editor so customers can edit company content, services, contact details, and images in Arabic and English without altering shared definitions. This covers FR-04, FR-05, FR-06, FR-08, FR-10, FR-14, and template/content separation.

**Scope:**
- Five design-defined template variations, implemented as immutable definitions through the template-engine contract
- Site editor for company info, sections, services, features, contact data, and imagery
- Draft-only editing with reliable save feedback and validation
- AR/EN supported content model, RTL/LTR layout, and fallback translations
- Template and customers content remain isolated

**Out of scope:** project CRUD, publishing logic, billing, ecommerce, real custom design tools.

## User stories
- As a customer, I want to edit my Site content in a structured editor, so that my public website stays accurate without affecting the shared template.
- As a business owner, I want to choose from five complete, responsive templates, so that my company site has a suitable visual identity in either language.
- As a customer, I want language switching to preserve Site data and route context, so that my content remains intact in AR or EN.
- As a product owner, I want image fallback handling and template separation, so that public pages stay robust even when optional media is missing.

## Acceptance criteria
- [ ] All five templates match [the design brief](../../template-design/README.md), render the agreed pages/sections, and handle missing optional content without broken layouts.
- [ ] Shared template content is not mutated by customer edits.
- [ ] Editor loads saved draft content, validates input, and shows success/error feedback.
- [ ] Switching AR/EN preserves the Site context and does not overwrite customer text.
- [ ] Missing translations follow a defined fallback policy and do not crash the UI.
- [ ] Illustrative images are clearly separated from real project/photos and fall back gracefully.

## Technical notes
- Use a template schema that keeps shared layout definitions separate from customer content.
- Follow the boundaries in [the template-engine contract](../../template-engine/README.md); its renderer/catalog implementation is delivered in a separate session and must be integrated rather than duplicated here.
- Treat the five stable IDs and visual/page briefs in `docs/template-design/README.md` as the product catalog source. IDs are proposed until implemented; do not silently rename or substitute them.
- Model language-specific fields explicitly; do not infer text direction from content.
- Keep the save model simple and reliable: draft content saved to Site state with clear validation and user feedback.
- Respect existing i18n routing and use the approved Pexels integration only for illustrative template imagery and not as a dependency for core site generation.

## Dependencies
- Must happen after: [EPIC-3 Dashboard and Site Setup](../EPIC-3-dashboard-and-site-setup/EPIC.md)
- Blocks: [EPIC-5 Projects and Publishing](../EPIC-5-projects-and-publishing/EPIC.md)

## Priority & size
- Priority: P0
- Size: L

## Definition of Done
- All five template variations conform to the design brief and engine contract, render complete pages, and handle empty/missing images cleanly.
- Editor saves persistently and remains isolated from the shared template.
- AR/EN language flow passes QA and no broken RTL/LTR layout remains.

## Milestones
1. [M4.1 Template schema and rendering](./M4.1-template-rendering.md)
2. [M4.2 Editor CRUD and save flow](./M4.2-editor-crud.md)
3. [M4.3 Bilingual content model and fallbacks](./M4.3-bilingual-content.md)
