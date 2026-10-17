# Gyzora Implementation Plan Pack

This pack replaces "epic-by-epic" implementation with **user-journey vertical slices (S0-S10)**, backed by one architecture, one data model and one API contract. It is written so that a weaker coding model can follow it with little room for error.

## Install into the repo
1. Copy `docs/plan/` into the repo at `docs/plan/`.
2. Copy `repo-root-files/.env.example` to the repo root (never commit a real `.env`).
3. Copy `repo-root-files/.github/pull_request_template.md` to `.github/`.
4. Add the banner from `docs/plan/08-LEGACY-MAPPING.md` to the old epic files (do not delete them).
5. Complete the owner checklist in `docs/plan/07-OWNER-PREREQUISITES.md` (slice by slice; each slice lists what it needs).

## Reading order
`00-ROADMAP` -> `01-JOURNEY-MAP` -> `02-ARCHITECTURE` -> `03-DATA-MODEL` -> `04-API-CONTRACT` -> `05-AGENT-WORKFLOW` -> `06-SCOPE-AND-DECISIONS` -> the slice file.

## How to run a slice
Give the agent `docs/plan/prompts/START-SLICE.md` with the slice id filled in. The agent works on its own branch, proves each acceptance item, opens a Pull Request, and **stops**. You review; then say "merged" (or send review comments with `prompts/FIX-AFTER-REVIEW.md`). Never start the next slice before the previous PR is merged.

## Golden rules (apply to every slice)
1. A screen without an inbound link, an outbound link, an empty state and an error state is a bug.
2. Never link to a page that does not exist yet. Navigation items are added by the slice that builds the page.
3. Read the official docs / `node_modules` docs before using any library API. Do not guess APIs.
4. Server decides ownership. Never accept `userId`, `ownerUserId` or `siteId` from the client.
5. One slice = one branch = one PR. No drive-by refactors. No new dependencies beyond the slice's list.
6. If the spec is ambiguous or something cannot be verified: write it down (`docs/questions/<slice>.md` / PR "UNVERIFIED") and stop. Do not invent.
