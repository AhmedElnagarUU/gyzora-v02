# Plan status

| Slice | Status | Branch | PR | Notes |
|---|---|---|---|---|
| S0 Foundations | in review | slice/S0-foundations | `docs/pr/S0-foundations.md` (no `gh` CLI) | Prereqs resolved (2026-10-17). lint/tsc/build pass; `npm run test` 11 pass + 1 skipped (needs `MONGODB_TEST_URL`). A4 click-through and A5 concurrency test UNVERIFIED. `[locale]/loading.tsx` relocated to `dashboard/` for real 404s (owner-approved). Dev-DB `user` docs deleted during cleanup — see PR "Observations". |
| S1 Dashboard + create site | done | slice/S1-dashboard-create-site (fast-forwarded to `main` 2026-10-18) | `docs/pr/S1-dashboard-create-site.md` (no `gh` CLI), questions in `docs/questions/S1-dashboard-create-site.md` | Owner-requested additions: sites are written through a Mongoose model (`6280060`), and the dashboard card can edit details + delete the site (`27a4978`, pulls part of S3 forward). Plan updated to mirror the shipped API: `04-API-CONTRACT.md` gained `DELETE /api/sites/me` + the S1 scope on `PATCH /api/sites/me`; the S1 slice records tasks 1/3/5/11/13 as built; the S3 slice now extends what S1 shipped. lint/tsc/build pass; `npm run test` 31 pass + 2 skipped (needs `MONGODB_TEST_URL`). CP-1 click-through, the model write path, edit/delete in the browser, 375px/RTL and keyboard checks UNVERIFIED (no browser/session here); dev `sites` collection is empty again — see PR. |
| S2 Preview my site | in review | slice/S2-preview-my-site | `docs/pr/S2-preview-my-site.md` (no `gh` CLI), questions in `docs/questions/S2-preview-my-site.md` | The sample bar was generalised into `PreviewChrome` (bar + viewport frame) now shared by the sample route and the new draft route `/[locale]/dashboard/site/preview/[[...slug]]`, which renders the owner's stored data through `toRenderData` with `mode="draft"`; entry points are the overview card + a sidebar item (shown only when a site exists, so `dashboard/layout.tsx` + `dashboard-shell.tsx` gained `hasSite`); language switch keeps the current page/slug. lint/tsc/build pass; `npm run test` 34 pass + 2 skipped (needs `MONGODB_TEST_URL`). Signed-in rendering was verified with a temporary, reverted local stub (no dev-DB writes); the owner click-through, 375px/RTL/keyboard checks and the two-account isolation check are UNVERIFIED. Unknown draft URLs render the not-found UI with HTTP 200 (the dashboard shell streams first) — see Q1. |
| S3 Content editor | todo | | | |
| S4 Projects + images | todo | | | |
| S5 Publish + public site | todo | | | |
| S6 Admin + feedback | todo | | | |
| S7 Google sign-in | todo | | | |
| S8 Polar billing | todo | | | |
| S9 Egypt wallets | todo | | | |
| S10 Hardening + launch | todo | | | |

Statuses: todo | in progress | in review | changes requested | done | blocked.
