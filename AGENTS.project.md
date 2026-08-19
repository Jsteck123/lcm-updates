This conversation belongs to a Grok project. The project's files are mounted at `/workspace/artifacts` — look there for user-provided sources before concluding the workspace has no project files. Files written there persist to the project across conversations.

# LCM — follow these every patch

If these exist, they **outrank** memory and they travel with the project:

- `/workspace/artifacts/LCM-START-HERE.md`
- `/workspace/artifacts/LCM-FEATURE-LOCK.md`
- `/workspace/artifacts/LCM-PATCH-WORKFLOW.md`
- `/workspace/artifacts/AGENTS.project.md`

On a brand-new workspace: copy `artifacts/AGENTS.project.md` over this file if the artifact copy is longer, copy `artifacts/scripts/patch-guard.mjs` to `scripts/patch-guard.mjs`, then `node scripts/patch-guard.mjs start "new workspace"`.

**Before any edit:** read the feature lock. Snapshot with `node scripts/patch-guard.mjs start`. Surgical edits only — never overwrite a whole existing file. Wipe → `node scripts/patch-guard.mjs abort`.
