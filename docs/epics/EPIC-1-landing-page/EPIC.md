# Epic 1: Landing Page

**Goal:** Build a UI skeleton for the public landing page with simple structure, minimal styling, and bilingual support. Polish, animations, and real imagery are out of scope.

**Scope (UI skeleton only):**
- Shared layout: header/nav, footer
- Arabic/English switch and RTL/LTR direction handling
- Landing sections: hero, features/value, how it works, target industries, CTA, using placeholder blocks
- Responsive and accessibility basics (semantic HTML, keyboard nav, lucide-react icons)
- Bilingual AR/EN labels and messages

**Out of scope:** real design polish, template previews, pricing, auth logic.

## Proposed folder/file structure

This epic organizes work under feature-based structure (per CODE_RULES). Files shown are the expected locations for code produced by this epic.

```
src/
  app/
    [locale]/
      (marketing)/
        layout.tsx        # Landing/shared layout
        page.tsx           # Landing page
      layout.tsx          # Root layout (i18n, dir, providers if needed)
  features/
    landing/
      components/
        header.tsx
        footer.tsx
        nav.tsx
        language-switcher.tsx
        hero-section.tsx
        features-section.tsx
        how-it-works-section.tsx
        industries-section.tsx
        cta-section.tsx
      constants.ts
      types.ts
  shared/
    ui/                  # (reusable UI only if shared by 2+ features)
  messages/
    en.json              # landing labels added
    ar.json              # landing labels added
```

> Note: Only create files needed. Follow existing patterns first. Do not create empty directories unnecessarily.

## Milestones

1. [M1.1 Layout foundation](./M1.1-layout-foundation.md)
2. [M1.2 Landing sections skeleton](./M1.2-landing-sections.md)
3. [M1.3 Responsive and accessibility pass](./M1.3-responsive-a11y.md)