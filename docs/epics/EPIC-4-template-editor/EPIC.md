# Epic 4: Template and Site Editor

**Goal:** Build the two shared templates and the site editor so a customer can edit company content, services, contact details, and image placeholders in Arabic and English without altering the shared template definition. This covers FR-04, FR-05, FR-06, FR-08, FR-10, FR-14, and the template/content separation requirements.

**Scope:**
- Two template definitions with realistic content blocks and fallback behavior
- Site editor for company info, sections, services, features, contact data, and imagery
- Draft-only editing with reliable save feedback and validation
- AR/EN supported content model, RTL/LTR layout, and fallback translations
- Template and customers content remain isolated

**Out of scope:** project CRUD, publishing logic, billing, ecommerce, real custom design tools.

## User stories
- As a customer, I want to edit my Site content in a structured editor, so that my public website stays accurate without affecting the shared template.
- As a business owner, I want both templates to render complete and responsive pages, so that I can present my company clearly in either language.
- As a customer, I want language switching to preserve Site data and route context, so that my content remains intact in AR or EN.
- As a product owner, I want image fallback handling and template separation, so that public pages stay robust even when optional media is missing.

## Acceptance criteria
- [ ] Both templates render complete site sections and handle missing optional content without broken layouts.
- [ ] Shared template content is not mutated by customer edits.
- [ ] Editor loads saved draft content, validates input, and shows success/error feedback.
- [ ] Switching AR/EN preserves the Site context and does not overwrite customer text.
- [ ] Missing translations follow a defined fallback policy and do not crash the UI.
- [ ] Illustrative images are clearly separated from real project/photos and fall back gracefully.

## Technical notes
- Use a template schema that keeps shared layout definitions separate from customer content.
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
- Both templates render complete pages and handle empty/missing images cleanly.
- Editor saves persistently and remains isolated from the shared template.
- AR/EN language flow passes QA and no broken RTL/LTR layout remains.

## Milestones
1. [M4.1 Template schema and rendering](./M4.1-template-rendering.md)
2. [M4.2 Editor CRUD and save flow](./M4.2-editor-crud.md)
3. [M4.3 Bilingual content model and fallbacks](./M4.3-bilingual-content.md)
