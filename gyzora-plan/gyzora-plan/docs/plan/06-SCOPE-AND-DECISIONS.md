# 06 - Scope changes and decisions

PRD rule: scope expansion needs reason, impact, approval. Approved by the owner in planning chat.

## Approved scope changes
| ID | Change | Reason | Impact | Slice |
|---|---|---|---|---|
| SC-1 | Images stored in an S3 bucket (customer logo + project images) | Users must upload their own project photos | S3 SDK, presign API, bucket CORS/policy | S4 |
| SC-2 | Billing with Polar: 10-day free publish trial, then monthly subscription to stay published | Revenue model | Entitlement logic, webhook, cron | S5, S8 |
| SC-3 | Google sign-in | Easier onboarding | Better Auth social provider | S7 |
| SC-4 | Owner admin dashboard (users, manual Pro, delete) | Manage customers and manual upgrades | `role`, `/admin`, audit log | S6 |
| SC-5 | Manual Egyptian wallet payments (Vodafone/Etisalat/Orange Cash, InstaPay) with receipt + admin approval | Polar/Stripe do not cover Egyptian wallets (verify again in S9 if desired); keeps MVP free of new gateways | paymentRequests, private receipts | S9 |
| SC-6 | Feedback button and inbox | Collect product feedback | feedback collection, rate limit | S6 |
| SC-7 | lucide-react dependency | Required by PRD FR-14 | add to CODE_RULES approved list | S0 |
Still out of scope: multiple sites per user, custom domains, ecommerce, drag-and-drop, team roles, analytics, Pexels, email sending, password reset, email verification, manual project reordering.

## Decisions (D-xx)
| ID | Decision |
|---|---|
| D-01 | Public URL: `/{locale}/s/{slug}`; slug generated from business name, editable until first publish, then locked |
| D-02 | `Site.data` has the renderer's `SiteData` shape (no separate `content`) |
| D-03 | Publish snapshot stored inside the site document, replaced by one atomic update |
| D-04 | Missing translations: hide optional empty fields; required fields missing in an ACTIVE locale block publish |
| D-05 | Trial: 10 days from first publish, never reset. Grace after failed payment: 2 days. Values from env (`TRIAL_DAYS`, `GRACE_DAYS`) |
| D-06 | Polar webhook is the only source of truth for Polar payment state |
| D-07 | Google account linking to an existing password account is DISABLED (email is not verified for password sign-ups, so linking would allow account pre-hijacking). Revisit when email verification exists |
| D-08 | Admin role is stored in the DB and granted by `npm run admin:grant -- <email>`. No email-based env allowlist (unverified emails could claim it) |
| D-09 | No automatic republish after a user is upgraded; the user publishes again |
| D-10 | OPEN: approve Playwright for browser tests? Default: no, manual click-paths |
| D-11 | OPEN: monthly price comes from env/Polar product; wallet price from `WALLET_PRICE_EGP` |
| D-12 | OPEN: hosting provider (affects country header for Egypt detection and cron scheduler) |
| D-13 | Template Arabic names/summaries are drafted by the agent in S1; owner approves final wording |
| D-14 | Gallery preview query params (`name`, `category`) are display-only, length-limited, never persisted |
