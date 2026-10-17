Slice **{{SLICE_ID}}** is in review. Work on the existing branch `{{BRANCH}}`.
Review comments to address:
{{COMMENTS}}

Rules: change only what the comments require (plus tests for it), re-run lint/tsc/test/build and the affected click-paths in EN and AR, update the PR description (what changed, evidence), push, and STOP. If a comment conflicts with `docs/plan`, write `docs/questions/{{SLICE_ID}}.md` and stop instead of choosing.
