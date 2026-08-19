# LCM patch workflow (do not skip)

Shop code has been wiped more than once: a whole file overwritten, a feature
gone, then a zip shipped. This workflow exists so that **cannot** happen again.

Read this **and** `artifacts/LCM-FEATURE-LOCK.md` before touching code.

## The rule

One patch = one job. Snapshot first. Edit small. If a file got emptied or a
locked feature disappeared, **put the snapshot back** and redo only the
intended change. Never “fix” a wipe by rewriting the file from memory.

## Every patch — in this order

1. **Read the lock**  
   `artifacts/LCM-FEATURE-LOCK.md`  
   If your change would remove a locked behavior, stop. Update the lock only
   when James asked to replace that behavior.

2. **Snapshot (before any edit)**  
   ```
   node scripts/patch-guard.mjs start "short reason"
   ```  
   Copies `src`, `scripts`, `docs` → `artifacts/lcm-pre-patch/`.  
   That folder is the undo for **this** patch. Do not skip this step.

3. **Edit surgically**  
   - Change the smallest unique block. Never replace an entire existing file.  
   - Never call write/edit with an empty old string on a file that already exists.  
   - Do not “recreate” `shop-guide.ts`, `barcode.ts`, `brother-label-print.ts`,
     `lcm-store.ts`, `quoting.tsx`, `board.tsx`, or `po-material.ts`.  
   - If StrReplace fails, read the file and retry a smaller unique snippet.
     Do not Write the whole file.

4. **If something looks wiped** (file suddenly tiny, page blank, missing export)  
   ```
   node scripts/patch-guard.mjs abort src/lib/lcm/that-file.ts
   ```  
   or restore everything:  
   ```
   node scripts/patch-guard.mjs abort
   ```  
   Then apply **only** the intended patch again.

5. **Prove it**  
   - `npx tsc --noEmit`  
   - `node scripts/patch-guard.mjs check`  
   Check fails if a source file went missing, dropped under 200 bytes, or
   shrank more than 60% vs the snapshot.

6. **Record the behavior**  
   If you added or changed a shop-facing behavior, add one short bullet to
   `artifacts/LCM-FEATURE-LOCK.md` in the right page section. Copy the same
   file to `docs/LCM-FEATURE-LOCK.md`.

7. **Finish + ship**  
   ```
   node scripts/patch-guard.mjs finish
   node scripts/make-update-package.mjs "one-line note"
   ```  
   Finish refreshes `artifacts/lcm-live-src` (last known good program).  
   The zip builder refuses if the wipe check fails.

## Two snapshots (do not mix them)

| Folder | When | Use |
| --- | --- | --- |
| `artifacts/lcm-pre-patch/` | Start of **this** patch | Undo a wipe mid-patch |
| `artifacts/lcm-live-src/` | Last successful ship | Last good program if pre-patch is missing |

Never restore program files from an old USB zip over later work.

## Why this is the standard

This is the same idea as git: commit (snapshot) → small diff → revert if the
diff destroyed the tree. The extra lock file is a **product contract** so a
new idea cannot silently delete an old one. Industry names: feature freeze
list, regression guard, pre-commit snapshot.

## Do not

- Start coding before `patch-guard start`
- Ship if `patch-guard check` is red
- Gold-plate or “clean up” files you did not need to touch
- Recreate a 1,000-line module from memory after a bad Write
