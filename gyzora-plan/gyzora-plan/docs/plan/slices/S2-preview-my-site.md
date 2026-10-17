# S2: Preview my site

## Goal and user story
As a customer I click "Preview" and see MY site (my business data in my chosen template), in Arabic or English, on mobile/tablet/desktop widths, without publishing.

## Depends on
S1 merged.

## Read first
`02-ARCHITECTURE.md` section 7; `src/features/templates/{types.ts,render/*,components/*}`; `src/app/[locale]/templates/[templateId]/[[...slug]]/page.tsx`; `src/features/sites/{service,repository}.ts`.

## Files
Create: `src/app/[locale]/dashboard/site/preview/[[...slug]]/page.tsx`, `src/features/sites/to-render-data.ts` (+ test), `src/features/templates/components/preview-chrome.tsx` (generalised from the preview bar).
Modify: `template-preview-bar.tsx`/`template-preview-shell.tsx` (reuse the chrome), `site-overview-card.tsx`, `sidebar.tsx`, messages.

## Tasks
1. `toRenderData(site, projects = [])`: pure mapping `StoredSiteData` + projects -> renderer `SiteData`. Projects are empty until S4 (renderer already handles empty).
2. Preview page (server, `dynamic = 'force-dynamic'`): session guard; load OWN site (redirect to `/dashboard` if none); resolve page by slug exactly like the sample route (0 -> home; 1 -> about/services/projects/contact; 2 with `projects` -> details; else 404; unknown project id -> 404). Render `TemplateRenderer mode="draft"` with `hrefForPage` building `/{locale}/dashboard/site/preview/...` links. Metadata `robots: noindex`.
3. `PreviewChrome` props: `backHref`, `backLabelKey`, `badgeKey` ("Sample" vs "Draft preview"), `basePath`, viewport toggle, page nav, language switch preserving the full slug (including project id). Sample route keeps working using the same component. In draft mode there is NO sample label and no sample content: optional missing content is hidden/empty-stated.
4. Language toggle here changes the locale of the page (UI + content locale); content of the other locale is never copied.
5. Add "Preview" to the sidebar and a "Preview" button on the overview card.
6. Tests: `toRenderData` (locale isolation, missing optional fields, no mutation of input).

## Acceptance
- From Overview, one click opens my preview; back button returns to Overview.
- All 6 page types render for each of the 5 templates (create/select a template per test user or switch template via DB in dev) in EN and AR; project details 404s cleanly with no projects.
- Language switch keeps the same page; viewport buttons work; no horizontal scroll at 375px.
- A different user cannot see my preview (another account's preview shows THEIR site; unauthenticated -> sign-in redirect).
- Preview shows my business name/category and no "SAMPLE" label.
- lint, tsc, test, build pass.

## Do NOT
Fetch data inside the renderer, add editing controls, show sample data in draft mode.
