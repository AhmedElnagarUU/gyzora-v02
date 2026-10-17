# 01 - Journey map and screens

All URLs are locale-prefixed (`/en/...`, `/ar/...`). "Auth" = server-validated session.

## Screens
| Screen | URL | File | Auth | Entry points | Exits | Slice |
|---|---|---|---|---|---|---|
| Landing | `/` | `app/[locale]/(marketing)/page.tsx` | no | - | Sign in, Sign up | exists |
| Sign in / up | `/auth/sign-in`, `/auth/sign-up` | `app/[locale]/auth/*` | no | Landing, each other | Dashboard | exists, S0 (switcher), S7 (Google) |
| Dashboard overview | `/dashboard` | `dashboard/page.tsx` | yes | after auth, sidebar | every sidebar item | S1 |
| Create site step 1 | `/dashboard/site-create` | `dashboard/site-create/page.tsx` | yes (redirect to dashboard if site exists) | Overview empty-state CTA | Gallery, Back to dashboard | S1 |
| Template gallery | `/dashboard/site-create/templates` | `.../templates/page.tsx` | yes (same guard) | Step 1, template preview "Use this template" | Preview (new tab), Select -> Overview, Back to step 1 | S1 |
| Template sample preview | `/templates/{id}/[[...slug]]` | exists | no | Gallery | Back to gallery, Use this template | exists, S1 fixes |
| My site preview | `/dashboard/site/preview/[[...slug]]` | `dashboard/site/preview/...` | yes | Overview card, sidebar, Editor | Back to dashboard, Editor | S2 |
| Content editor | `/dashboard/site/edit` | `dashboard/site/edit/page.tsx` | yes | Overview card, sidebar | Preview, Overview | S3 |
| Projects list | `/dashboard/site/projects` | `.../projects/page.tsx` | yes | sidebar, Overview | New, Edit, Delete | S4 |
| Project new / edit | `/dashboard/site/projects/new`, `/{id}/edit` | `.../projects/...` | yes | Projects list | back to list | S4 |
| Publish | `/dashboard/site/publish` | `.../publish/page.tsx` | yes | Overview card, sidebar | public URL (new tab), Editor/Project fix links, Billing | S5 |
| Public site | `/s/{siteSlug}/[[...path]]` | `app/[locale]/s/[siteSlug]/[[...path]]/page.tsx` | no | Publish page link | its own pages | S5 |
| Billing | `/dashboard/billing` | `.../billing/page.tsx` | yes | sidebar, trial banners | Polar checkout/portal, Wallet | S8 |
| Wallet payment | `/dashboard/billing/wallet` | `.../billing/wallet/page.tsx` | yes | Billing | Billing | S9 |
| Admin | `/admin`, `/admin/users`, `/admin/users/[id]`, `/admin/payments`, `/admin/feedback` | `app/[locale]/admin/...` | admin only (non-admin gets 404) | "Admin" link in user menu (admins only) | each other, back to dashboard | S6 (payments S9) |

## Dashboard shell (built in S1, used by every `/dashboard/**` page)
- File: `src/features/dashboard/components/dashboard-shell.tsx`, used from `dashboard/layout.tsx` AFTER the server session guard.
- Header: brand (links to `/dashboard`), language switcher (preserves path + query), user menu (name, Sign out; "Admin" for admins from S6).
- Sidebar (drawer on mobile, keyboard accessible, `aria-current="page"` on active item). Items appear only when their slice is merged:
  Overview (S1) | Content (S3) | Projects (S4) | Preview (S2) | Publish (S5) | Billing (S8).
- Feedback button (S6).
- Users WITHOUT a site: sidebar shows only Overview; Overview shows the empty state with the "Create your site" CTA.

## Screen state rules (every screen)
loading (skeleton or spinner, `aria-busy`), empty (explains + one primary action), error (translated, generic, retry), success (toast or inline `role="status"`). Forms: disabled submit while pending, field-level errors from API `fields`.

## Click-path acceptance scripts (run in EN and AR; same number of clicks)
- CP-1 Sign up -> Overview -> "Create your site" -> name+category -> Continue -> preview a template -> Select -> Overview shows my site. (<= 7 clicks after sign-up)
- CP-2 Overview -> Content -> edit AR and EN text -> Save -> reload -> values persist, other language untouched.
- CP-3 Projects -> New -> fill AR/EN, upload cover + 3 gallery images -> Save -> appears in list and in Preview (projects page and details page).
- CP-4 Projects -> Delete -> confirm dialog -> project and its images gone from list/preview.
- CP-5 Publish -> fix checklist -> Publish -> open public URL in a logged-out window -> edit draft -> public unchanged -> Publish again -> public updated.
- CP-6 (S8) Simulate trial expiry -> site unpublished, public URL = 404, editor still works, Billing shows Subscribe.
- CP-7 (S6) Admin grants Pro to a user; admin deletes a test user (all data gone).
- CP-8 (S9) Egyptian wallet request with receipt -> admin approves -> user becomes Pro.
- CP-9 (S7) Continue with Google -> lands on dashboard.
- CP-10 (S6) Feedback button -> submit -> appears in `/admin/feedback`.
