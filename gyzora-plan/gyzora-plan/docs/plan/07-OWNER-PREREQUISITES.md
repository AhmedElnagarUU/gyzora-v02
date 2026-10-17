# 07 - Owner prerequisites (do these before the slice that needs them)

## A. Fonts (before S0)
Put these files in `src/app/fonts/` (SIL OFL fonts, download once, commit them): a Latin variable font (e.g. Geist) and an Arabic-capable variable font (e.g. IBM Plex Sans Arabic or Cairo), as `.woff2`. The agent must stop and ask if the files are missing. This removes the build dependency on Google Fonts.

## B. S3 bucket (before S4)
- Create a bucket and an access key limited to that bucket (`PutObject`, `GetObject`, `DeleteObject`, `HeadObject`).
- CORS (replace origins):
```json
[{"AllowedOrigins":["http://localhost:3000","https://YOUR-DOMAIN"],"AllowedMethods":["PUT"],"AllowedHeaders":["Content-Type"],"ExposeHeaders":["ETag"],"MaxAgeSeconds":3000}]
```
- Public read ONLY for prefix `sites/*` (bucket policy or CDN). `receipts/*` must stay private.
- Fill `S3_BUCKET, S3_REGION, S3_ACCESS_KEY_ID, S3_SECRET_ACCESS_KEY, S3_PUBLIC_BASE_URL` (+ `S3_ENDPOINT`, `S3_FORCE_PATH_STYLE` for non-AWS S3). Use the variable names already in your `.env` if they differ; tell the agent.

## C. Google OAuth (before S7)
Google Cloud Console -> OAuth client (Web). Authorized redirect URIs: `http://localhost:3000/api/auth/callback/google` and `https://YOUR-DOMAIN/api/auth/callback/google`. Set `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`.

## D. Polar (before S8)
Create a SANDBOX organization, one monthly recurring product, an access token and a webhook endpoint `https://<public-url>/api/webhooks/polar` (use a tunnel for local testing). Set `POLAR_SERVER=sandbox`, `POLAR_ACCESS_TOKEN`, `POLAR_WEBHOOK_SECRET`, `POLAR_PRODUCT_ID`, `BILLING_PRICE_LABEL`. Go to production only in S10.
Cron: a daily scheduler (host cron, GitHub Actions, etc.) calling `POST /api/cron/entitlements` with `Authorization: Bearer $CRON_SECRET`.

## E. Wallets (before S9)
Decide `WALLET_PRICE_EGP`, and the receiving numbers/handles you want enabled (`WALLET_VODAFONE_NUMBER`, `WALLET_ETISALAT_NUMBER`, `WALLET_ORANGE_NUMBER`, `WALLET_INSTAPAY_HANDLE`). Methods without a value are hidden.

## F. Admin (before S6 verification)
After S6 is merged: sign up normally, then run `npm run admin:grant -- you@example.com`.

## G. Test database (before S1 integration tests)
A separate MongoDB database; set `MONGODB_TEST_URL`. Tests wipe collections they create; never point it at dev/prod.

## H. Dev data (before S1)
Drop the dev `sites` collection (legacy shape). Remove duplicate owner sites if any.
