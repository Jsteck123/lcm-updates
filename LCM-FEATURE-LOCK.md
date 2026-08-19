# LCM feature lock

Shop-facing behaviors that **must still work** after every patch.
If a patch would remove one, stop. James has to ask for that removal.

Update this file when a behavior is **added or replaced on purpose**.
Copy to `docs/LCM-FEATURE-LOCK.md` in the same turn.

Last reviewed: 2026-08-19

## Hard rules (every page)

- Program zip never replaces shop data (quotes, jobs, POs, inventory, drawings).
- One recipe per **part # + rev**. Save **updates** that row. It does not add a second copy.
- Opening Master Quoter folds leftover duplicate rows. Toast if any were folded.
- Surgical edits only. Never overwrite a whole existing source file.
- Snapshot before a patch (`node scripts/patch-guard.mjs start`). Wipe → abort restore.

## Master Quoter

- Type a part # → list matching recipes → pick one fills the whole form.
- Rev A and Rev E can both exist. Two Rev A rows cannot.
- **Bought blank (Total Fab):** price per piece; skip rack size / drop calculator.
- **Cut from our rack:** material, type, shape, how it sits, sizes as before.
- Machines: select all that apply, plus per-OP machine when the job uses more than one.
- Guided quote and Save / Email / More stay on the page.

## Job Board

- Part # search box next to the filters.
- Soonest due first. Unreleased cards stay Hold until PDF rev + stock.
- **Multi-machine job (OP1 M250Y, OP2 DS30Y, OP3 M250Y): one card**, not one card per OP.
- That card shows OP1 / OP2 / OP3 rows (machine + who / Take).
- Tap an OP → Who + Machine → Take & Load (or Load / Return / Done if it is yours).
- OP1 and OP2 **may run at the same time** on two machines. “Wait OP1” is a reminder, not a lock.
- Same machine on every OP still uses a single Take job button.
- Two different POs of the same part = two cards.
- Shop WO / Drawing / CAD stay on the card. Box labels do **not** print from this card.

## Assign / load

- Office can still put OP1 on one machine and OP2 on another (`opMachines` / assign).
- Load jumps to that machine station. Timer lives on the station, not the board.

## PIN / shop host

- If a print, save, chat send, or attach needs a PIN, **the PIN dialog opens**.
- After a good PIN, **the original action continues**. Do not make them tap again.
- Stale token → clear it, show PIN, retry once.

## Pack / Ship Calendar

- **Mark packed** prints a box label (no Label button on the job card).
- Tape **1.1 × 2**. Same Brother QL Wi-Fi as inventory.
- Layout: **QR on the left**, customer / PO / part / rev / qty packed on the right.
- QR opens `/box` — contents + check off for the truck.
- **Reset pack** clears the line check **and** loaded boxes. No leftover check under Pack.

## Cut queue / scan / labels

- Every barcode kind has its **own** instructions. Not every scan is a leftover bar.
- Leftover-bar scan: list cut-queue jobs that use that material → pick job → cut length, qty, how many just cut → remaining length drops.
- Inventory rack labels keep the existing QL size/config.
- Sample label page still sets the printer IP.

## Timer / Good so far

- Cap with **no quoted time** is **clock from start** (not 20 seconds per click).
- Waiting until 12 are done, then tapping 12, still needs the same total elapsed as 12 × 20s from start — not 20s between each click.

## Updates / recover

- Shop install: **Settings → Update app** with `lcm-update-latest.zip`.
- GitHub: `Jsteck123/lcm-updates` (`lcm-update-latest.zip` + dated zip).
- Never restore program `src` from an old USB over later work. Live snapshot is `artifacts/lcm-live-src`.
- Host data restore is a **data-only** path, not a program overwrite.

## New Grok project

These files live in `/workspace/artifacts` so they mount on a new project.
GitHub copies: [Jsteck123/lcm-updates](https://github.com/Jsteck123/lcm-updates)
(`LCM-START-HERE.md`, `LCM-FEATURE-LOCK.md`, `LCM-PATCH-WORKFLOW.md`, `AGENTS.project.md`, `scripts/patch-guard.mjs`).
On a new workspace follow `LCM-START-HERE.md` before any edit.
