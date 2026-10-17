# S0-foundations — questions for the owner (RESOLVED — work resumed)

Resolutions (2026-10-17):
- **Q1 (fonts):** owner added `src/app/fonts/` (Geist + IBM Plex Sans Arabic, `.ttf`
  instead of the `.woff2` suggested in 07 A — `.ttf` works with `next/font/local`,
  accepted). Task 5 proceeds with these files.
- **Q2 (dirty tree):** owner committed everything (`a05331f`); tree is clean.
  Branch `slice/S0-foundations` created from `main`.
- **Q3 (audit section 9):** owner could not locate the audit document. Decision
  (owner-approved "fix it"): the explicit list in Task 11 (template preview page
  metadata, aria-labels in `template-preview-bar.tsx` and `TemplateSections.tsx`,
  `'Home'` label) is the full hardcoded-string scope for A7, plus a grep sweep of
  the files named in the S0 slice.
- **Q4 (plan-pack paths):** proceeded as proposed — STATUS.md updated in
  `gyzora-plan/gyzora-plan/docs/plan/`, `.env.example` + PR template installed from
  `repo-root-files/`; PR body goes to `docs/pr/S0-foundations.md` (`gh` absent).

## Original questions (kept for the record)

Stopped per `05-AGENT-WORKFLOW.md` ("A required owner prerequisite is missing" /
"The spec is ambiguous") and per the slice: "Owner: font files in `src/app/fonts/`
(07 A). If missing: STOP and ask." No branch was created and no code was changed.

## Blocker 1 — Font files missing (prerequisite 07 A)

Evidence:
- `src/app/fonts/` does not exist.
- Repo-wide search (working tree **and** `git ls-files`) for `*.woff2`, `*.woff`,
  `*.ttf`, `*.otf` returns nothing.
- `next/font/google` is still in use (`src/app/layout.tsx`), which S0 Task 5 must
  remove — that cannot be done without the owner's local files.

**Q1:** Please add the two `.woff2` files to `src/app/fonts/` (a Latin variable font,
e.g. Geist, and an Arabic-capable variable font, e.g. IBM Plex Sans Arabic or Cairo —
see `docs/plan/07-OWNER-PREREQUISITES.md` A), or tell me the exact filenames to use.
Tasks 4–5 of the slice depend on this.

## Blocker 2 — Working tree is not clean

Workflow step 2 requires: "Check git is clean; create branch `slice/<id>-<short-name>`
from the latest main."

Evidence — `git status` on `main` (63 changed paths), including:
- Deleted: all of `docs/` (PRD, epics, template docs) — uncommitted deletions.
- Modified: `src/app/api/sites/route.ts`, `src/messages/{en,ar}.json`,
  `src/features/sites/*`, `src/features/templates/*`, `AGENTS.md`, etc.
- Untracked: `gyzora-plan/` (the plan pack), new template pages/components
  (`src/app/[locale]/templates/`, `src/features/templates/components/`, ...).

CODE_RULES §9 and the workflow forbid mixing unrelated owner work into my commits,
and I must not commit or discard your WIP on my own initiative.

**Q2:** How should I proceed?
- (a) You commit or stash your WIP first, then I branch from a clean `main` (safest);
- (b) I branch as-is and stage **only** the files listed in the S0 slice, leaving your
  WIP uncommitted in the worktree throughout;
- (c) Something else you prefer.

## Question 3 — "audit section 9" is not in the plan pack

Acceptance A7 says: "No hardcoded strings from audit section 9 remain (show grep)."
No audit document exists in `gyzora-plan/` or anywhere in the repo.

**Q3:** Point me to the audit, or confirm that the explicit list in Task 11
(template preview page metadata, aria-labels in `template-preview-bar.tsx` and
`TemplateSections.tsx`, the `'Home'` label) is the full scope for A7.

## Question 4 — Plan-pack install steps were never done (minor; will proceed as noted unless you object)

`gyzora-plan/gyzora-plan/README.md` says to copy `docs/plan/` to the repo root and
install `repo-root-files/`; this was not done, and root `docs/` is currently deleted
in the working tree. AGENTS.md also references `docs/PRD.md`, which is deleted.

Unless you say otherwise, on resume I will:
- update `gyzora-plan/gyzora-plan/docs/plan/STATUS.md` (S0 → `blocked`, then later → `in review`);
- copy `gyzora-plan/gyzora-plan/repo-root-files/.env.example` to the repo root (S0 Task 3);
- copy `gyzora-plan/gyzora-plan/repo-root-files/.github/pull_request_template.md` to
  `.github/` (needed by the workflow's PR step).

Note: `gh` CLI is **not installed** on this machine, so per the workflow fallback the
PR body will be written to `docs/pr/S0-foundations.md` and handed to you.

## Verified fine (no action needed)

- `src/proxy.ts` matcher `['/', '/(en|ar)/:path*']` already redirects `/` → `/{locale}`,
  so Task 4's precondition for deleting `src/app/page.tsx` holds.
- The pack does contain `repo-root-files/.env.example` and the PR template
  (they are dotfiles; first search missed them).
