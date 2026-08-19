# New Grok project / new workspace — start here

These files live in **source** (`docs/`, `AGENTS.project.md`, `scripts/patch-guard.mjs`).
Every **Settings → Update app** zip carries the latest copy. GitHub
`Jsteck123/lcm-updates` keeps the same files. `artifacts/` is the copy that
mounts on a new Grok project.

## Do this first (agent)

1. Read `LCM-FEATURE-LOCK.md` — shop behaviors that must not vanish.
2. Read `LCM-PATCH-WORKFLOW.md` — snapshot → small edit → undo if wiped.
3. Copy this project's contract into the workspace root:
   - `artifacts/AGENTS.project.md` → `/workspace/AGENTS.project.md` (keep the
     first “Grok project / artifacts” paragraph, then the LCM contract).
   - `artifacts/scripts/patch-guard.mjs` → `/workspace/scripts/patch-guard.mjs`
   - `LCM-FEATURE-LOCK.md` → `/workspace/docs/LCM-FEATURE-LOCK.md`
4. If `/workspace/src/routes/quoting.tsx` is missing or tiny, restore the
   program from GitHub **lcm-update-latest.zip**
   (`https://github.com/Jsteck123/lcm-updates`) or from
   `artifacts/lcm-live-src/` — never from an old USB over later work.
5. `node scripts/patch-guard.mjs start "new workspace"` before the first edit.

GitHub copies of these same files (in case artifacts did not mount):

- https://github.com/Jsteck123/lcm-updates/blob/main/LCM-START-HERE.md
- https://github.com/Jsteck123/lcm-updates/blob/main/LCM-FEATURE-LOCK.md
- https://github.com/Jsteck123/lcm-updates/blob/main/LCM-PATCH-WORKFLOW.md
- https://github.com/Jsteck123/lcm-updates/blob/main/AGENTS.project.md
- https://github.com/Jsteck123/lcm-updates/blob/main/scripts/patch-guard.mjs
