# MVP Template Design Briefs

**Status:** Product design baseline; catalog and renderer foundation is implemented in `src/features/templates/`.
**Purpose:** Define five selectable company-site variations for the engine in [../template-engine/README.md](../template-engine/README.md). The engine must consume these design inputs without duplicating or replacing its rendering contract.

## Shared product structure

Every variation uses the same six page concepts and supported customer data. Visual composition, section order, spacing, color, typography, and image treatment distinguish the templates; users do not add pages or freely rearrange sections.

| Page | Sections / content slots |
|---|---|
| Home | 8: hero; company introduction; services; featured projects; capabilities/features; process; call to action; contact summary |
| About | 3: page introduction; company story; capabilities |
| Services | 2: page introduction; service list |
| Projects | 2: page introduction; project collection |
| Project Details | 3: project hero; description/details; image gallery |
| Contact | 2: contact introduction; contact methods and address |

Header and footer are shared page chrome and are not included in section counts. Section content may be omitted or use a deliberate empty state when optional customer data is absent. Do not add unverified claims, metrics, testimonials, credentials, or placeholder copy. Demonstration content in the picker/preview must be visibly labeled as sample.

## Five selectable variations

IDs below are the proposed stable catalog keys; display names and descriptions should be localized by the product UI. Each template supports all six pages, EN/AR, RTL/LTR, responsive mobile/tablet/desktop layouts, and the common section inventory above.

| ID / working name | Visual direction | Home composition |
|---|---|---|
| `atelier` — Editorial Atelier | Warm ivory, ink, and restrained clay accents; editorial typography using existing project fonts; generous whitespace and large, curated photography. Best suited to interior design and finishing firms. | Full-width image-led hero; editorial introduction; services as concise text rows; featured projects as large asymmetric tiles; capabilities; numbered process; quiet CTA; compact contact strip. |
| `modern-build` — Modern Build | Strong geometry, deep blue/charcoal with a restrained safety-orange accent; clear hierarchy, strong alignment, robust cards. Best suited to construction and contracting firms. | Split hero with prominent contact action; concise introduction; service cards; regular project grid; capability list; process steps; high-contrast CTA; structured contact band. |
| `urban-estate` — Urban Estate | Refined stone, deep green, and subtle brass; calm premium type scale and property-first imagery. Best suited to real-estate companies. | Property-led hero; company introduction; services; featured properties/projects in image cards; capabilities; simple process; discreet CTA; contact summary. |
| `interior-calm` — Interior Calm | Soft cream, muted sage, and natural wood tones; airy layouts, soft edges, restrained image framing. Best suited to interior and finishing studios. | Quiet split hero; warm introduction; services in open editorial cards; featured projects in a spacious masonry-like arrangement; capabilities; process; soft CTA; contact details. |
| `craft-studio` — Craft Studio | Charcoal, off-white, and muted copper; confident studio identity, strong image/copy contrast, varied but orderly composition. Best suited to architecture, construction, and design practices. | Typographic hero with a strong project image; concise studio introduction; services; featured projects in alternating image/text panels; capabilities; compact process; bold CTA; contact summary. |

## Selection and rendering rules

- The picker presents all five options with localized name/summary, a representative preview, and clear selection feedback. Preview imagery/content is sample, not customer data.
- Template definitions describe immutable layout, ordered semantic sections, supported fields, and illustrative image slots. Site and Project records contain mutable customer content and media.
- Use the engine's stable page/section/field identifiers and supported renderer types. These briefs do not prescribe a schema or renderer implementation.
- All variations use existing locale routing and explicit localized values. Switching locale preserves page and project context; it never copies text between languages.
- Use the existing design system/fonts and logical layout behavior. Images need meaningful alt text and graceful local fallback; illustrative imagery must remain distinct from customer project imagery and comply with the PRD's Pexels requirements if that integration is used.
- No template is dependent on remote image search, custom domains, new routes, or a new dependency.

## Acceptance checks

- [ ] The picker exposes exactly these five supported IDs and labels them in EN and AR.
- [ ] Each variation renders the six pages and its specified Home ordering using the engine contract.
- [ ] All pages work responsively in LTR and RTL with accessible labels, keyboard use, and sufficient contrast.
- [ ] Missing optional text, image assets, or projects does not break rendering or introduce false claims.
- [ ] Template definitions remain immutable when customer draft content is edited.
- [ ] Preview/demo content is visibly identified as sample; public rendering uses only the publication snapshot.

**Open product decision:** Confirm final localized display names and visual approval of the five directions before implementation is called complete. The five IDs and design directions are planning inputs, not evidence of implemented templates.
