# 04 - API contract

## Envelope
Success: `{ "data": <payload> }`. Error: `{ "error": { "code": "<CODE>", "fields"?: { "<path>": "<code>" } } }`. No stack traces, no DB messages, no user existence details.

| Code | HTTP | Meaning |
|---|---|---|
| UNAUTHENTICATED | 401 | no valid session |
| FORBIDDEN | 403 | not allowed (admin endpoints for non-admin API callers) |
| NOT_FOUND | 404 | missing OR not owned (never reveal which) |
| VALIDATION_FAILED | 400 | zod failure; `fields` filled with i18n-able codes |
| SITE_ALREADY_EXISTS | 409 | owner already has a site |
| NO_SITE | 409 | action needs a site |
| SLUG_TAKEN / SLUG_LOCKED | 409 | slug rules |
| STALE_REVISION | 409 | draft changed in another tab |
| NOT_PUBLISHABLE | 422 | `issues: [{path, code}]` in `fields` |
| ENTITLEMENT_REQUIRED | 402 | trial over, no active plan |
| RATE_LIMITED | 429 | too many requests |
| UPLOAD_REJECTED | 400 | bad key/type/size/ownership |
| REQUEST_PENDING | 409 | a wallet request is already pending |
| INTERNAL | 500 | anything unexpected |

## Endpoints (all JSON; `S` = slice that creates it)
| Method + path | Auth | Body -> Response | Errors | S |
|---|---|---|---|---|
| POST `/api/sites` | session | `{companyName, category, ...wizard fields, locale, templateId}` -> 201 `{site:{id,slug,status,templateId}}` | VALIDATION_FAILED, SITE_ALREADY_EXISTS | S1 |
| GET `/api/sites/me` | session | -> `{site}` (own, draft view) | NOT_FOUND | S1 |
| PATCH `/api/sites/me` | session | `{revision, data:{profile}}` (strict; unknown keys rejected; the whole profile for both locales) -> `{site}` | VALIDATION_FAILED, STALE_REVISION, NOT_FOUND, UPLOAD_REJECTED | S1 (profile) / S3 (full editor) |
| DELETE `/api/sites/me` | session | - -> 204 | NOT_FOUND | S1 |
| PATCH `/api/sites/me/slug` | session | `{slug}` -> `{slug}` | SLUG_TAKEN, SLUG_LOCKED, VALIDATION_FAILED | S5 |
| POST `/api/uploads/presign` | session | `{kind:'logo'|'cover'|'gallery'|'receipt', contentType, size}` -> `{uploadUrl, key, headers}` | UPLOAD_REJECTED, RATE_LIMITED, NO_SITE | S4 |
| GET `/api/projects` | session | -> `{projects[]}` (own site) | NO_SITE | S4 |
| POST `/api/projects` | session | project payload -> 201 `{project}` | VALIDATION_FAILED, UPLOAD_REJECTED | S4 |
| GET/PATCH/DELETE `/api/projects/[id]` | session | payload / - -> `{project}` / 204 | NOT_FOUND | S4 |
| GET `/api/publish/status` | session | -> `{status, issues[], entitlement, hasUnpublishedChanges, publicUrl}` | NO_SITE | S5 |
| POST `/api/publish` | session | - -> `{publishedAt, publicUrl}` | NOT_PUBLISHABLE, ENTITLEMENT_REQUIRED | S5 |
| POST `/api/unpublish` | session | - -> `{status:'unpublished'}` | NO_SITE | S5 |
| POST `/api/feedback` | session | `{type,message,canContact,path}` -> 201 | VALIDATION_FAILED, RATE_LIMITED | S6 |
| GET `/api/admin/users?q=&page=` | admin | -> `{users[], total}` | FORBIDDEN | S6 |
| GET `/api/admin/users/[id]` | admin | -> `{user, site?, entitlement}` | NOT_FOUND | S6 |
| POST `/api/admin/users/[id]/grant-pro` | admin | `{days:1..366}` -> `{manualProUntil}` | NOT_FOUND | S6 |
| POST `/api/admin/users/[id]/revoke-pro` | admin | - -> 204 | | S6 |
| POST `/api/admin/sites/[id]/unpublish` | admin | - -> 204 | | S6 |
| DELETE `/api/admin/users/[id]` | admin | `{confirmEmail}` -> 204 (cascade) | VALIDATION_FAILED, FORBIDDEN (self/admin) | S6 |
| GET/PATCH `/api/admin/feedback[/id]` | admin | list / `{status}` | | S6 |
| GET `/api/billing/status` | session | -> `{entitlement, polar?, manualProUntil?}` | NO_SITE | S8 |
| POST `/api/billing/checkout` | session | - -> `{url}` | NO_SITE, RATE_LIMITED | S8 |
| POST `/api/billing/portal` | session | - -> `{url}` | NOT_FOUND | S8 |
| POST `/api/webhooks/polar` | signature | raw body -> 200 | 400 (bad signature) | S8 |
| POST `/api/cron/entitlements` | `Authorization: Bearer CRON_SECRET` | - -> `{unpublished: n}` | 401 | S8 |
| GET/POST `/api/billing/wallet-requests` | session | list own / `{method,senderWallet,reference?,receiptKey}` | REQUEST_PENDING, UPLOAD_REJECTED | S9 |
| GET/PATCH `/api/admin/wallet-requests[/id]` ; GET `.../[id]/receipt` | admin | list / `{action:'approve'|'reject', reason?}` / `{url}` | | S9 |

`/api/auth/[...all]` stays Better Auth's. Public pages are Next pages, not APIs.

Notes:
- `DELETE /api/sites/me` (S1) removes the site document only, so the user can create a new site.
  Cascade rules for projects (S4), uploads and the published snapshot (S4/S5) are added by those
  slices.
- `PATCH /api/sites/me` accepts the `profile` section in S1 (the business-details form, one locale
  per save, revision-filtered). S3 keeps the same path and body shape and extends `data` to the
  remaining sections (about, services, features, projects copy) with per-locale partials.
