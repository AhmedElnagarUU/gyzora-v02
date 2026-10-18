# S2 questions for the owner

## Q1 (needs an answer) - unknown draft-preview URLs answer with HTTP 200

The acceptance says "project details 404s cleanly with no projects".

Verified behaviour on the dev server: `/en/dashboard/site/preview/projects/villa-1`, `/en/dashboard/site/preview/nope` and `/en/dashboard/site/preview/projects/a/b` render the app's standard "404: This page could not be found." UI inside the dashboard shell (no preview chrome, no preview content) and the response carries `<meta name="robots" content="noindex">`, but the HTTP status is **200**. The sample route still returns a real 404 for the same cases.

Why: the dashboard layout (`[locale]/dashboard/layout.tsx`) awaits the session and the site before it renders, so Next has already flushed the shell by the time the page calls `notFound()` and cannot change the status. The Next docs state this in `01-app/02-guides/streaming.md`: "If `notFound()` fires mid-stream, Next.js cannot go back and change the status to 404. Instead, it injects `<meta name="robots" content="noindex">`". Moving the page's own slug validation before its data awaits does not change the status (tested).

Options:
- (a) accept it (noindex + clean message; S5's public route will have the same shape),
- (b) add a localized `dashboard/not-found.tsx` (message only, status stays 200),
- (c) restructure the guard so the page's `notFound()` fires before the shell flushes (move the auth/site guard out of the dashboard layout for this route - more churn, not in S2's file list).

Nothing is blocked; the preview works either way. Tell me which you want and I will do it in a follow-up commit or leave it for S5.

## Q2 (FYI) - the sidebar item needs to know whether a site exists

`01-JOURNEY-MAP.md` line 30 says "Users WITHOUT a site: sidebar shows only Overview", so the "Preview" item is conditional. That required `dashboard/layout.tsx` + `dashboard-shell.tsx` to load the site and pass `hasSite` (2 files outside the slice's list; see the PR's Deviations).

## Q3 (FYI) - the sample route keeps its old language-switch slug

`/en/templates/atelier/projects/palais-penthouse` switches language to `/ar/templates/atelier/projects` (the project id is lost) because the sample page is not in the slice's file list and still derives its slug from the page id. The new draft route preserves whatever slug it was opened with. Say the word if you want the sample page changed too (one line).

## Q4 (approve or replace) - the new Arabic strings

- `templatePreview.badgeDraft`: "معاينة المسوّدة"
- `templatePreview.backToDashboard`: "العودة إلى لوحة التحكم"
- `templatePreview.metadata.draftTitle`: "معاينة المسوّدة | جيزورا"
- `dashboard.nav.preview`: "معاينة"
- `dashboard.overview.previewAction`: "معاينة"
