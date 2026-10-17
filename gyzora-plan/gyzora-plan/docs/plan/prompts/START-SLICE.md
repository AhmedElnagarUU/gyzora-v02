You are implementing slice **{{SLICE_ID}}** of the Gyzora project.

1. Read `AGENTS.md`, `CODE_RULES.md`, then `docs/plan/02-ARCHITECTURE.md`, `03-DATA-MODEL.md`, `04-API-CONTRACT.md`, `05-AGENT-WORKFLOW.md`, and finally `docs/plan/slices/{{SLICE_FILE}}` and every file it lists under "Read first".
2. Follow `05-AGENT-WORKFLOW.md` exactly: branch, read library docs before using APIs, mirror existing files, only touch files listed in the slice, commit per task.
3. Do not guess. If the spec is unclear, an API differs, or a prerequisite is missing, write `docs/questions/{{SLICE_ID}}.md` and stop.
4. When all tasks are done, run lint, tsc, tests and build, execute the slice's click-paths in EN and AR (or mark UNVERIFIED with exact manual steps), update `docs/plan/STATUS.md`, open a Pull Request with the template filled with evidence, and STOP. Do not start another slice.

