# S9: Egyptian e-wallet payments (manual approval)

## Goal and user story
As a customer in Egypt I pay with Vodafone Cash / Etisalat Cash / Orange Cash / InstaPay, upload my receipt, and the owner activates my Pro plan after checking it.

## Depends on / prerequisites
S6, S8 merged. Owner: wallet numbers and price in env (07 E). Receipts are PRIVATE in the bucket.

## Read first
`03-DATA-MODEL.md` (paymentRequests); `02-ARCHITECTURE.md` section 8 (receipts); S4 images code; S6 admin and audit code; hosting docs for the client-country header (D-12).

## Files
Create: `src/features/billing/wallet/{types,repository,service,methods}.ts` (+ tests), `src/features/billing/country.ts` (+ test), API routes `billing/wallet-requests`, `admin/wallet-requests`, `admin/wallet-requests/[id]/receipt`, pages `dashboard/billing/wallet/page.tsx`, `admin/payments/page.tsx`, components for the form, request list, admin review.
Modify: `env.ts` (`getWalletEnv`), presign service (kind `receipt`, prefix `receipts/{userId}/`, no site required), `indexes.ts`, billing page (wallet entry), admin sidebar, messages, `.env.example`.

## Tasks
1. `methods.ts`: enabled methods = those with an env value; none enabled -> the wallet page explains "not available" and Billing hides the entry.
2. `getRequestCountry(headers)` (pure): read the first available of `x-vercel-ip-country`, `cf-ipcountry` (extend per D-12); returns upper-case ISO code or null. Billing page: if `EG`, show the wallet card prominently; otherwise a small "Pay with an Egyptian mobile wallet" link (IP detection can be wrong).
3. Wallet page: shows price `WALLET_PRICE_EGP`, the receiving numbers/handles with copy buttons, steps, and a form: method, sender wallet number (digits only), optional reference, receipt image uploader (private prefix, jpeg/png/webp <= 5 MB). Submit -> `POST /api/billing/wallet-requests`. List of the user's own requests with status and rejection reason. One pending request per user (`REQUEST_PENDING`).
4. Receipt key must start with `receipts/{session.user.id}/` and pass `verifyUploadedKey` (HeadObject); otherwise `UPLOAD_REJECTED`.
5. Admin `/admin/payments`: pending first; detail with user, site, amount, method, sender, reference and a receipt viewer using a 5-minute presigned GET from `GET .../[id]/receipt` (admin only, never public).
6. Approve/reject: `findOneAndUpdate({_id, status:'pending'}, ...)` so a request can be decided exactly once. Approve sets `grantedUntil = max(now, manualProUntil) + WALLET_PERIOD_DAYS` and writes `billing.manualProUntil`; reject stores a required reason. Both write audit entries. (Pro from approval is "manual Pro": same entitlement path as S6.)
7. After approval/rejection the user sees the status on the wallet page and a banner on Billing. No emails.
8. Tests: country header parsing, extension math (extends an active Pro, starts from now when expired), double-approve grants once (integration), user cannot list/see others' requests or receipts, receipt key of another user rejected, non-admin cannot call admin wallet APIs.

## Acceptance
- CP-8 passes in EN and AR with a real uploaded receipt.
- Egypt detection: with `x-vercel-ip-country: EG` (simulated header) the wallet card is prominent; without it only the small link shows.
- Second request while one is pending -> translated error.
- Receipt URL for user A cannot be obtained by user B or anonymous; the object is not publicly readable (try the plain URL: access denied).
- Approving twice grants Pro once (show `manualProUntil` before/after).
- lint, tsc, test, build pass.

## Do NOT
Add another gateway (Paymob etc. is a later, separate decision), store wallet credentials, make receipts public, auto-approve.
