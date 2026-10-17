# 00 - Roadmap

| Slice | Outcome the user can see | Depends on | Size | Owner prerequisites |
|---|---|---|---|---|
| S0 Foundations | Correct `<html lang/dir>`, DB unique index, shared helpers, local fonts, 404/error pages, language switcher everywhere | - | M | Font files (07 A) |
| S1 Dashboard + create site | Sign in -> dashboard -> create site -> pick template (preview + select) -> site exists on dashboard | S0 | L | Wipe dev `sites` collection |
| S2 Preview my site | "Preview" renders MY draft in the chosen template, EN/AR, mobile/tablet/desktop | S1 | M | - |
| S3 Content editor | Edit company info, contact, about, services, features per language; saved and reloaded | S2 | L | - |
| S4 Projects + images | Add/edit/delete projects with cover + gallery uploaded to S3; logo upload; shown in preview | S3 | XL | S3 bucket (07 B) |
| S5 Publish + public site | Publish, public link `/{locale}/s/{slug}`, unpublish, 10-day trial rule, draft edits never leak | S4 | XL | - |
| S6 Admin + feedback | Owner dashboard (users, manual Pro, delete), feedback button + inbox | S5 | L | Grant yourself admin (07 F) |
| S7 Google sign-in | "Continue with Google" | S0 | S | Google OAuth client (07 C) |
| S8 Polar billing | Subscribe monthly, manage, webhook, trial/expiry enforcement, cron | S5, S6 | L | Polar sandbox (07 D), cron scheduler |
| S9 Egypt wallets | Manual wallet payment with receipt, admin approval -> Pro | S6, S8 | M | Wallet numbers (07 E) |
| S10 Hardening + launch | Rate limits, security headers, route-manifest test, deployment docs, PA matrix | all | L | Prod accounts |

S7 can be done any time after S0 (suggested right after S5 so you can test with real accounts). All other slices are strictly sequential.

## Per-slice Definition of Done
- Every acceptance item has evidence in the PR (command output, or numbered manual steps with result, EN and AR).
- `npm run lint`, `npx tsc --noEmit`, `npm run test`, `npm run build` pass (or are listed as UNVERIFIED with reason).
- `.env.example` and `docs/plan/STATUS.md` updated. PR opened. Agent stopped.
