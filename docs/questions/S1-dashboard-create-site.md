# S1-dashboard-create-site — questions for the owner

Resolutions (2026-10-18, owner): 
- **Q1 (delete endpoint):** keep `DELETE /api/sites/me`; the row is added to `04-API-CONTRACT.md`
  and to the S1 slice (task 13), with a note that S4/S5 add the cascade. Done in this branch.
- **Q2 (edit scope):** keep the profile-only edit on S3's route/endpoint; the S3 slice now says
  "extend what S1 shipped" instead of "create these files". Done in this branch.
- The slice and contract were updated to mirror the shipped API and the branch was merged to `main`.

Still open:
- **Q3 Arabic catalog names/summaries** (`أتيلييه التحرير`, `البناء العصري`, `العقارات الحضرية`,
  `الهدوء الداخلي`, `استوديو الحرفية` + summaries): approve or replace.
- **Q4 `docs/template-design/README.md`** does not exist; confirm it is obsolete (or point me at it)
  so future "Read first" lists are accurate.
- **Q5 the dev `sites` collection is empty** at the end of the session (it held one draft at the
  start); all my DB access was read-only. If that was not you, say so before I re-verify the create
  path.

## 1. `DELETE /api/sites/me` was not in the API contract (RESOLVED — see above)

You asked for "delete the website" on the dashboard. `04-API-CONTRACT.md` has no user-side delete
row — only S6's admin `DELETE /api/admin/users/[id]`. `CODE_RULES.md` says every endpoint path must
be defined in the task file, so this is the one place where I had to extend the contract.

- **taken:** `DELETE /api/sites/me` (mirrors the existing `PATCH /api/sites/me`), 204 on success,
  `NOT_FOUND` when the user has no site; UI confirm step before the call.
- Alternatives: `POST /api/sites/delete`; defer delete to a later slice and revert it now;
  or make it admin-only.

**Q1:** keep `DELETE /api/sites/me` (and I add the row to `04-API-CONTRACT.md` + the slice), or
should it be a different path / deferred?

Related: there is no cascade yet. Deleting a site today removes the `sites` document only.
Projects (S4) and published snapshots (S5) do not exist, so nothing else references the site.

## 2. Editing pulls part of S3 forward (RESOLVED — see above)

The S1 slice says "Do NOT: add editor/preview links" and "Do not render buttons for pages that do
not exist yet"; S3 defines `PATCH /api/sites/me` and the route
`src/app/[locale]/dashboard/site/edit/page.tsx`.

- **taken:** a profile/details editor on that same S3 route — the full wizard field set, for the
  locale being viewed, no language tabs and no per-item list editing.
- Alternative: wait for S3 and only ship delete now.

**Q2:** is this the right split, or do you want the full S3 editor (language tabs, stable item ids,
reordering, uploads) now on this branch?

Note: `S3` is written as "Depends on S2 merged" and S2 (preview of my own site) is not merged yet.

## 3. Arabic catalog names and summaries

Task 7 required "real Arabic names/summaries". I wrote them
(`أتيلييه التحرير`, `البناء العصري`, `العقارات الحضرية`, `الهدوء الداخلي`, `استوديو الحرفية`
+ one-line summaries). They are my wording, not from the PRD.

**Q3:** approve or replace. They live in `src/features/templates/catalog.ts` and are only used for
display (`name`/`summary`).

## 4. `docs/template-design/README.md` does not exist

The slice's "Read first" names `docs/template-design/README.md`; it is in neither the repo nor
`gyzora-plan/`. I followed the existing template components and `docs/template-engine/` instead.

**Q4:** point me at the file (or confirm it is obsolete) so the next slice's "read first" list is
accurate.

## Resolved during the slice (for the record)
- **Model refactor:** after `CODE_RULES.md` gained the "write through a Mongoose model" rule,
  the owner chose "Refactor S1 now" → `src/features/sites/model.ts` + `repository.ts`
  (commit `6280060`).
- **Edit + delete:** owner-requested on 2026-10-18 ("there is no edit or delete button … as a user
  I can change or delete the website"), implemented in commit `27a4978`.
- **Error envelope:** per `02 §6`, API codes are mapped through a top-level `errors` namespace; the
  gallery maps unknown codes to `INTERNAL`/`field.invalid_type`, and `400` sends the user back to
  step 1 with `?fields=name:code,...`.
