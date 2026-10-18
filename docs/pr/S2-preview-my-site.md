## Slice
S2: Preview my site

## Summary
The owner can now open a preview of their own site from the overview card or the sidebar and see their stored business data inside their chosen template, in Arabic or English and at three viewport widths, without publishing anything. The sample-template bar was generalised into a shared `PreviewChrome` (back link, badge, page nav, viewport toggles, language switch, viewport frame) that both the sample route and the new draft route use; the draft preview shows a "Draft preview" badge, no sample badge and no sample content, and renders the app's not-found UI for URLs that carry no content yet (project details arrive in S4). The language switch keeps the page (and the full slug) the owner is looking at.

## Acceptance checklist (evidence required for each)
- [x] From Overview, one click opens my preview; back button returns to Overview - evidence: `site-overview-card.tsx` links to `/dashboard/site/preview` and the sidebar gained the same item; rendered overview HTML (temporary stub) contains `href="/en/dashboard/site/preview"` and `href="/ar/dashboard/site/preview"`, and the chrome's back link is `href="/en/dashboard"` with label "Back to dashboard". End-to-end click with a real session is UNVERIFIED (see below).
- [x] All 6 page types render for each of the 5 templates in EN and AR; project details 404s cleanly with no projects - evidence: sample route (which exercises all 5 templates) 5 templates x EN/AR = 10 x HTTP 200 after the refactor; draft route home/about/services/projects/contact = 200 in EN and AR for the stub site; `template-sample-label` absent in draft, present in sample. `projects/<id>` renders the app's not-found UI with no preview content (HTTP status is 200 - see Q1). Draft for the other 4 templates needs a second site/template in the DB -> UNVERIFIED.
- [x] Language switch keeps the same page; viewport buttons work; no horizontal scroll at 375px - evidence: draft `/en/dashboard/site/preview/about` bar language link `href="/ar/dashboard/site/preview/about"`, `/en/dashboard/site/preview` -> `href="/ar/dashboard/site/preview"`, AR page has `dir="rtl"` and links back to `/en/dashboard/site/preview`; exactly one `aria-current="page"` per bar. Viewport toggles/375px are the S1-verified markup, moved unchanged -> visual check UNVERIFIED.
- [x] A different user cannot see my preview (another account's preview shows THEIR site; unauthenticated -> sign-in redirect) - evidence: the page/ layout resolve the site only with `getSiteForOwner(session.user.id)` (no client-supplied id anywhere); signed out `/en|/ar/dashboard/site/preview`, `/about`, `/contact`, `/projects/villa-1` -> 307 to `/{locale}/auth/sign-in`. Two-account check UNVERIFIED.
- [x] Preview shows my business name/category and no "SAMPLE" label - evidence: draft HTML renders the stored company name (`Temp Verify Co` in EN, `شركة التحقق المؤقت` in AR, and the EN name does not leak into the AR page), has no `template-sample-label` element (rendered only when `mode === 'sample'`) and the bar badge reads "Draft preview".
- [x] lint, tsc, test, build pass - evidence: see Commands; `next build` lists `ƒ /[locale]/dashboard/site/preview/[[...slug]]`.

## Click-paths (EN and AR)
| Path | EN | AR | Notes |
|---|---|---|---|
| `/dashboard` (site exists) | 200 - card shows Preview + Edit details + Delete, sidebar shows Preview | 200 - same, `href="/ar/dashboard/site/preview"` | rendered with a temporary reverted stub (no session/browser here) |
| `/dashboard/site/preview` | 200 - "Draft preview" badge, my data, no sample label | 200 - `dir="rtl"`, AR business name, no EN name leakage | stub; robots noindex + title present in both |
| `/dashboard/site/preview/{about,services,projects,contact}` | 200 x4 | 200 (about checked) | stub |
| `/dashboard/site/preview/projects/villa-1`, `/nope`, `/projects/a/b` | app not-found UI, no preview content, HTTP 200 | - | Q1 |
| `/dashboard/site/preview` signed out | 307 -> `/en/auth/sign-in` | 307 -> `/ar/auth/sign-in` | real HTTP, no stub |
| `/templates/{id}` (5 templates) signed out | 200 x5 | 200 x5 | post-refactor regression |
| `/templates/atelier/projects/palais-penthouse` | 200 (details page renders) | - | post-refactor |
| `/templates/nope` | 404 | - | post-refactor |
| `GET /api/sites/me` signed out | 401 | - | post-refactor |

## Commands
```
npm run lint: pass (eslint, no output)
npx tsc --noEmit: pass (exit 0)
npm run test: 36 tests, 34 pass, 2 skipped, 0 fail
npm run build: pass; 17 static pages generated; route table includes ƒ /[locale]/dashboard/site/preview/[[...slug]]
```

## Deviations from the slice (files outside the list, spec changes) and why
1. `src/app/[locale]/dashboard/layout.tsx` and `src/features/dashboard/components/dashboard-shell.tsx` (not in the slice's list): 01-JOURNEY-MAP line 30 requires "Users WITHOUT a site: sidebar shows only Overview", so the sidebar item needs to know whether a site exists. The layout (already async and auth-guarded) loads it once and passes `hasSite` to the shell -> sidebar. Considered fetching inside the shell instead; rejected to keep the components presentational and to avoid a second session lookup. Cost: one extra indexed `findOne` per dashboard render.
2. `package.json`: the new unit test was added to the `test` script (same as S1), otherwise `npm run test` would not run it.
3. `src/features/templates/components/template-preview-bar.tsx`: the file now exports the two controls only the sample route shows (`TemplateSwitcher`, `UseTemplateAction`); the bar itself moved into `preview-chrome.tsx` as the shared `PreviewChrome`. The file name was kept because the slice lists it as modified; its markup is unchanged.
4. `preview-chrome.tsx` also owns the viewport frame (moved verbatim from `template-preview-shell.tsx`) so the draft page uses one component instead of duplicating the frame markup; `TemplatePreviewShell` is now the sample preset over `PreviewChrome` with unchanged props, which is why `src/app/[locale]/templates/[templateId]/[[...slug]]/page.tsx` needed no edit.
5. The chrome builds page-nav/language hrefs from `basePath` + the current slug instead of a hardcoded template path. The sample route keeps its previous pageId-derived slug (see Observations 2), the draft route uses the real slug.

## New dependencies / env vars / routes (must match docs/plan; `.env.example` updated?)
- No new dependency, no new env var, `.env.example` unchanged.
- New route `/[locale]/dashboard/site/preview/[[...slug]]` - already the plan's URL for this screen (`01-JOURNEY-MAP`, `02-ARCHITECTURE` section 7 base path), so no API-contract change: S2 adds no endpoints. `docs/plan/04-API-CONTRACT.md` needs no edit.

## UNVERIFIED items (what, why, exact manual steps for the owner)
1. Real signed-in click-through (no session/browser in this environment, and I will not write to the dev DB). Steps: sign in -> `/dashboard` -> "Preview" -> the draft bar shows "Draft preview" + my name; page nav walks home/about/services/projects/contact; "Back to dashboard" returns to the overview; the sidebar shows "Preview" with `aria-current` while inside the preview.
2. Two-account isolation: sign in as a second user -> its preview shows its own site (or redirects to `/dashboard` when it has none) and never the first user's data.
3. Draft preview for all 5 templates: create a site per template (or switch `templateId` in the dev DB) and repeat the page walk in EN and AR.
4. 375px no horizontal scroll, RTL layout, viewport toggles, keyboard focus ring (`focus-visible`) - visual checks.
5. Project details with real projects (S4 fills `projects`; in S2 there are none, so `/projects/<id>` is the not-found case).
6. `MONGODB_TEST_URL` is still unset, so the 2 integration tests stay skipped (`SKIPPED: MONGODB_TEST_URL not set`) - unchanged from S1.

## Arabic wording for owner review
- `templatePreview.badgeDraft`: "معاينة المسوّدة"
- `templatePreview.backToDashboard`: "العودة إلى لوحة التحكم"
- `templatePreview.metadata.draftTitle`: "معاينة المسوّدة | جيزورا"
- `dashboard.nav.preview`: "معاينة"
- `dashboard.overview.previewAction`: "معاينة"

## Observations (not fixed here)
1. Under the dashboard shell, `notFound()` cannot produce a real 404 because the layout streams before the page resolves; the response is HTTP 200 with the standard not-found UI and `robots: noindex` (Next docs `01-app/02-guides/streaming.md` state this explicitly). The sample route still returns a real 404. Owner decision needed - Q1.
2. The sample route's language switch still loses the project id (`/en/templates/atelier/projects/palais-penthouse` -> `/ar/templates/atelier/projects`) because the sample page is outside the slice's file list and does not pass its slug to the shell. One-line fix if wanted - Q3.
3. The page-resolution block is deliberately duplicated from the sample route (the slice says "exactly like the sample route"). S5 adds the published route and would be the third copy - worth extracting one pure resolver then.
4. The draft preview shows an empty company name for a locale the owner has not filled yet (`getLocalizedText` never falls back), while the dashboard card keeps its cross-locale fallback (`getDisplayValue`). That is the intended "no sample data, missing content stays empty" behavior, but the two surfaces can differ; worth a shared decision when S3's editor lands.
5. The overview card's Preview button is now the primary action and "Edit details" became a secondary outline button (both still in the same action row as Delete).

## Risk / rollback
Risk is contained to one new page plus a component refactor; the sample route was re-verified after the refactor (10 x 200 + content markers). No DB writes, no schema or API change. Rollback = revert the merge commit; nothing persisted changes.
