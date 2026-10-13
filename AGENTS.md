<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

<!-- BEGIN:project-rules -->

## Project rules (read before writing any code)

1. **Read `CODE_RULES.md` once, in full, before your first code change.** It is the source of truth. Don't rely on memory of it or on summaries from other agents.
2. **Don't re-read it** unless you're unsure about a specific rule. Then read only that section.
3. **Read `docs/PRD.md` only for the sections your task touches**, not the whole file.
4. **Before coding, state in 3-5 lines** which rules apply to your task (e.g. folder placement, function separation, KISS limits). If you can't, re-read.
5. **Follow existing patterns first.** Look at one similar existing file before creating a new one.
6. **Rule conflicts:** if `CODE_RULES.md`, the PRD, or the Next.js docs disagree, stop and ask. Don't guess.
7. **Keep it simple.** No new dependencies, abstractions, or features beyond the task.

### Context discipline
- Read only the files your task needs. Don't scan the whole repo.
- Report back in under 200 words: files changed, what was done, open issues. No pasted code or logs unless something failed.
- When handing work to another agent, pass the task, file paths, and acceptance criteria. Tell it to read `CODE_RULES.md` itself.

### Done means
- Code follows `CODE_RULES.md`.
- Build and relevant checks pass.
- Any unverified item is reported as **unverified**, never assumed to work.

<!-- END:project-rules -->

## Agent Roles

| Role | Responsibility | Receives | Returns |
|---|---|---|---|
| **Orchestrator** | Plans, delegates, tracks status, talks to me | PRD, rules | Status + decisions needed |
| **Planner (PM)** | Writes epics, milestones, acceptance criteria | PRD sections for the epic | Epic/milestone docs |
| **Frontend Dev** | UI, pages, components, RTL/LTR, responsiveness | One milestone brief | Changed files + short summary |
| **Backend/Auth Dev** | API routes, auth flows, validation, DB access | One milestone brief | Changed files + short summary |
| **QA Verifier** | Verifies acceptance criteria independently, reports pass/fail with evidence | Milestone criteria only | Pass/fail table |
| **Reviewer** | Checks the diff against `CODE_RULES.md` and PRD constraints | Diff + rules | Issues list |

### Context rules (to avoid wasting context)
- Each sub-agent gets a **self-contained brief**: goal, relevant PRD excerpt, file paths, acceptance criteria. Never the full conversation.
- Sub-agents return **summaries under 200 words** plus file paths. No pasted code or logs unless something failed.
- Durable state lives in **files**, not chat. Status goes in `docs/epics/EPIC-N/STATUS.md`.
- One milestone per sub-agent run. Don't mix epics or concerns.
- The QA Verifier never sees the developer's reasoning, only the criteria and the result.
- If the orchestrator's context grows large, it re-reads `STATUS.md` instead of relying on memory.