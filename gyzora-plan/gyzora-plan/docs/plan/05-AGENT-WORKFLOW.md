# 05 - Agent workflow (mandatory for every slice)

## Before coding
1. Read, in order: `AGENTS.md`, `CODE_RULES.md`, `docs/plan/02-ARCHITECTURE.md`, `03-DATA-MODEL.md`, `04-API-CONTRACT.md`, the slice file, and every file the slice's "Read first" lists.
2. Check git is clean; create branch `slice/<id>-<short-name>` from the latest main.
3. For each library you will touch, read its official docs or the docs shipped in `node_modules` (e.g. `node_modules/next/dist/docs/`). Quote the API signature you rely on in the PR. If you cannot find it, STOP and ask.
4. For each new file, first find the closest existing file in the repo and mirror its structure and naming.

## While coding
- Only touch files listed in the slice. Anything else goes under "Deviations" in the PR with a reason.
- Follow the tasks in order. Commit after each task: `S3: add site update schema`.
- No new dependency except those the slice lists. No `any`, no `@ts-ignore`, no Server Actions, no hardcoded UI strings, no directional CSS, no `process.env` outside `shared/config/env.ts`.
- Every new UI string goes into BOTH `messages/en.json` and `ar.json`. Arabic text must be real Arabic, not a copy of English. Mark any Arabic wording you are unsure about in the PR for owner review.
- Never print or commit values from `.env`.
- Do not "improve" unrelated code. Write findings to the PR under "Observations".

## Stop conditions (write `docs/questions/<slice>.md`, stop, tell the owner)
- The spec is ambiguous or contradicts another doc.
- A library API differs from what the spec assumes.
- You would need a new dependency, env variable not listed, or route not in `04-API-CONTRACT.md`.
- A required owner prerequisite is missing.

## Verification (run and paste a summary into the PR)
```
npm run lint
npx tsc --noEmit
npm run test
npm run build
```
Plus the slice's click-paths in EN and AR. If you cannot run a browser, write the exact numbered manual steps and mark the item `UNVERIFIED (needs owner)`. Never mark an item verified without evidence. Integration tests need `MONGODB_TEST_URL`; if absent, list them as UNVERIFIED.

## Pull request (always)
1. Update `docs/plan/STATUS.md` (slice -> `in review`) and `.env.example` if needed.
2. Push the branch and open a PR with `gh pr create --fill` using `.github/pull_request_template.md`. If `gh` is not available, write the PR body to `docs/pr/<slice>.md` and tell the owner.
3. Fill every section of the template. Acceptance checklist items need evidence.
4. STOP. Do not start the next slice. Wait for "merged" or review comments.

## After review
Owner sends comments with `prompts/FIX-AFTER-REVIEW.md`. Fix on the same branch, push, update the PR description, stop again.
