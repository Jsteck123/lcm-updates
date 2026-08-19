# LCM feature lock

Shop-facing behaviors that **must still work** after every patch.
If a patch would remove one, stop. James has to ask for that removal.

This file is **source** (`docs/`). Every update zip ships the latest copy.
Copies: `artifacts/` (new Grok project) and GitHub `Jsteck123/lcm-updates`.

Update this file when a behavior is **added or replaced on purpose**.
It lives in `docs/` (source), ships in every update zip, copies to
`artifacts/` (new Grok project), and is pushed to GitHub `lcm-updates`.

Last reviewed: 2026-08-19 · shipped in 20260819-210647

## Hard rules (every page)

- Program zip never replaces shop data (quotes, jobs, POs, inventory, drawings).
- **One recipe per part # + rev.** Save **updates** that row. Never a second copy of the same rev.
- Opening Master Quoter folds leftover duplicate rows. Toast if any were folded.
- Empty part # on the quoter blanks the whole form (no leftover fields).
- Number boxes accept shop math (`12*12`, `12x12`) on blur / Enter.
- Up next on a machine card is that machine’s **open** queue only. A part that already ran (gone from the job board, packed, qty in, or OP done) must not stay in Up next.
- Due date on Up next / board / calendar is the **PO calendar day** (the 25th stays the 25th). Do not shift a day for timezone.
- How-to on every page stays in sync with the buttons that are actually there.
- Surgical edits only. Never overwrite a whole existing source file.
- Snapshot before a patch (`node scripts/patch-guard.mjs start`). Wipe → abort restore.
- Never restore program `src` from an old USB over later work.

---

## Master Quoter

- Type a part # → up to 12 matches → pick one fills the whole form.
- Exact part # match loads silently. Partial search lists unique **part + rev** only.
- Rev A and Rev E can both exist. Two Rev A rows cannot.
- Save / Update existing writes the same part+rev. New rev letter = new row.
- **Bought blank (Total Fab):** type their $ each. Material % still applies. Skip bar size, calculator, drop, rack hold, and saw.
- **Cut from our rack:** material, type, shape, how it sits (mill XYZ / lathe XZ), sizes, drop calculator as before.
- Existing open POs that already had Mark OK / stock noted / sitting at the saw get **pending holds** on update. Unplanned lines stay available until Mark OK or Request cut.
- Machines: select all that apply (first is preferred). Per-OP machine when ops use different machines.
- Guided quote wizard: Customer → Part → Rev → Type → Material → Tooling → Machines → Times → Qty breaks → Review → Apply to form → Save.
- Price each is always calculated (setup, run, material, machine %, qty breaks, BOM + bench on assemblies). You do not type a unit price.
- Assemblies: -01 parent, children -02/-03 on BOM, bench minutes, then final ops on -01.
- Soft jaws / special tools are their own billed lines — not buried in part each.
- Shop averages can move setup & run on the saved part; live price moves because the recipe moved.
- Draft auto-saves on this device. Email jumps to Email Quotes with this part checked.
- More… : Search database, Update existing, Clear form, Delete part.

## Job Board

- Part # search next to the filters (matches P/N, parent P/N, description, PO).
- Soonest due first. Unreleased cards stay Hold until PDF rev + stock.
- Filters: All Jobs / Available / My Jobs, optional machine, All POs.
- Assemblies: take component jobs (-02, -03…) first, then assembly (-01) to bolt → pack.
- **Multi-machine job: one card**, not one card per OP. Rows: OP1 / OP2 / OP3 (machine + who / Take).
- Tap an OP → Who + Machine → Take & Load (or Load / Return / Done if yours).
- OP1 and OP2 **may run at the same time** on two machines. “Wait OP1” is a reminder, not a lock.
- Same machine on every OP still uses a single **Take job** button.
- Two different POs of the same part = two cards.
- Take pair / Load pair still work for nest parts (single-machine cards).
- Load puts the part on the picked (or quoted) machine and opens the station.
- Request cut is grey after a ticket is open (requested / done / skipped). Skip does not reopen it.
- Request cut keeps the numbers you type (sync must not snap them back to the quote).
- Request cut: blank sizes, select-all on tap, show rack stock + suggested sizes.
- Rack suggestions only when size is close to what you typed (e.g. 2x1, 1x2, 3.5x2).
- Shop WO / Drawing / CAD stay on the card. Box labels do **not** print from this card.

## Assign / load lanes

- Office can assign OP1 to one machine/person and OP2 to another.
- Assign from the drawing without leaving the print. Skip bumps to the bottom.
- Load lanes lay quoted setup + run hours on the week.

## Machine station / timer

- Active Jobs **Start** on a paused job (including from yesterday) **resumes** that same Setup/Runtime clock. Do not send them to Open machine first.
- Pause setup says **Resume OP1 Setup** (named OP). Runtime is for **all pieces**, not per piece.
- **Good so far:** never steal a tap. If the operator is watching, the count does not drop. Clock still caps how fast they tap. They **may go past job qty** (about 10 extras) so over-run parts can go to packing.
- No quoted time: pace is **20 seconds per piece from clock start** (not 20s per click, not 45s).
- Waiting until qty 12 then tapping 12 still needs 12 × 20s of clock — not 20s between clicks.
- Plus lock pad shows **why** plus is locked.
- Machine Stock step: pick and save stock even with no PO or quote.
- Two-vise / nest pair still loadable on the same machine.

## PIN / shop host

- If print, save, chat send, or attach needs a PIN, **the PIN dialog opens**.
- After a good PIN, **the original action continues**. Do not make them tap again.
- Stale token → clear it, show PIN, retry once.
- Chat and feedback photos wait for unlock, then continue.

## Packing Table

- Nav item **Packing Table** (Floor, next to Saw / Cut queue).
- Shows every PO line marked **ready for pack** that is not packed yet. One card per PO, lines under it.
- Each line has the drawing picture, part #, rev, qty, description.
- **Packed** prints the existing 1.1×2 box label (QR left: customer, PO, part, rev, qty) and the line leaves the queue.
- Extra parts: operator marks Good / Minor issues / scrap, writes a **4-digit UIN**, sends to packing. Packing shows ordered vs ran vs extra as soon as they send (example: ordered 10, ran 11, pack 10). **Only Packing Table prints** the extra QR label (who, when, part, rev, notes, UIN). Packed prints the box label then extra UIN stickers. Machine stations do not print those stickers.
- UIN lookup on Packing Table (and `/uin` QR) finds the notes.
- Pam’s truck scan is still the box QR → `/box`. This page does not replace that.

## Pack / Ship Calendar

- **Mark packed** prints a box label (no Label button on the job card).
- Tape **1.1 × 2**. Same Brother QL Wi-Fi as inventory (IP from Sample label).
- Layout: **QR on the left**, customer / PO # / part # / rev / qty packed on the right.
- QR opens `/box` — what’s in the box + check off for the truck.
- **Reset pack** clears the line check **and** loaded boxes. No leftover check under Pack.
- Ship calendar PO panel has **Drawing** (same print as the job board).
- Friday delivery run card: this week’s due + packed/verified. Print slips Thu/Fri morning.

## Cut queue / scan / labels

- Every barcode kind has its **own** instructions. Not every scan is a leftover bar.
- **LCMM** rack labels work. Scan attaches to the matching cut ticket and marks it.
- **LCM** leftover-bar scan: list cut-queue jobs that use that material → pick job → cut length, qty, how many just cut → remaining length on that bar drops.
- Sticker camera opens **Scan stock**, not the calendar. Scan is allowed without the Inventory tab.
- Matching jobs: same alloy, compatible shape, closest size first, then due date.
- Cut N spends inches. Pending hold on that job is consumed (available goes back up).
- Inventory rack labels keep the existing QL size/config.
- Sample label page still sets the QL-810W Wi-Fi address. No Edge / Paint / USB required.

## Inventory / holds

- Pending holds: book minus spoken-for = available (example: 288 − 62 = 226).
- Mark OK or Request cut **holds inches**. Dwayne saw cut/skip **consumes** the hold.
- After 30 days, dashboard + Inventory Pending ask **Still hold** or **Release**.
- Bought-blank jobs do **not** take a rack hold and do **not** go to the saw.

## Customer orders

- Job Board **Open full PO** opens that PO on Customer Orders. Picking another PO in the list stays on the one they picked — it must not snap back to the board link.
- Line not released until office checks PDF rev + stock (+ CAD if present).
- Follow-up banner and pack/ship stay on the order.

## Updates / recover

- Shop install: **Settings → Update app** with `lcm-update-latest.zip`.
- GitHub: `Jsteck123/lcm-updates` (dated zip + `lcm-update-latest.zip` + these lock files).
- Live program snapshot: `artifacts/lcm-live-src`. Pre-patch undo: `artifacts/lcm-pre-patch`.
- Host data restore is a **data-only** path, not a program overwrite.
- What’s new dialog after an update. Changelog rows stay readable.

---

## Shipped update intents (do not drop these)

These are the patches already sent to the shop. Each line is a locked intent.

| Version | Intent |
| --- | --- |
| 20260818-140259 | Saw scan: rack LCMM labels work. Scan attaches to the matching cut ticket and marks it. |
| 20260818-141832 | Sticker camera opens Scan stock, not calendar. Scan allowed without Inventory tab. |
| 20260818-165222 | Request cut keeps the numbers you type. Sync does not snap them back to the quote. |
| 20260818-171610 | Pause setup says Resume OP1 Setup. Runtime is for all pieces, not per piece. |
| 20260818-173126 | Request cut: blank sizes, select-all on tap, show rack stock + suggested. |
| 20260818-174307 | Machine Stock step: pick and save stock even with no PO or quote. |
| 20260818-175336 | Rack suggestions only when size is close to what you type. |
| 20260818-175841 | Request cut greys out after a saw ticket is already open. |
| 20260818-180313 | Request cut stays locked: requested / done / skipped. Skip does not reopen it. |
| 20260818-180925 | Ship calendar PO panel has Drawing (same print as job board). |
| 20260818-182302 | Pending holds: book − spoken-for = available. Mark OK / Request cut holds. Saw cut/skip consumes. 30-day Still hold / Release. |
| 20260818-183045 | Existing open POs already Mark OK / stock noted / at saw get pending holds on update. |
| 20260818-184307 | Master Quoter: Bought blank (Total Fab) — $ each instead of bar stock. Material % still applies. No rack hold / no saw. |
| 20260818-191027 | Good so far: never steal a tap. No quoted time uses 20s pace. Pad shows why plus is locked. |
| 20260818-192827 | Scan bar on the ground → matching cut-queue jobs, pick job, mark qty. Other labels keep their own instructions. |
| 20260818-201050 | Scan / Inventory howto must parse (no extra comma crash). |
| 20260818-211516 | Mark packed prints 1.1×2 box label (customer, PO, part, rev, qty + QR). Scan QR to check onto truck. Label button removed. |
| 20260818-212837 | Reset pack clears line checks. Box label is QR left, text right. |
| 20260819-132241 | Job board part # search. |
| 20260819-133855 | PIN dialog opens and resumes print/save after unlock. |
| 20260819-140540 | Job board: one card with OP1/OP2/OP3, tap OP to pick who and machine. |
| 20260819-151505 | Quoter: one recipe per part+rev (collapse duplicate rows). |
| 20260819-152308 | Quoter: fold extra copies when you open the page. |
| 20260819-152746 | Save updates the existing part+rev — never a second copy. |
| 20260819-174013 | Feature lock + patch workflow ship in every update zip. |
| 20260819-packing | Extras: operator Good / Minor issues / scrap, 4-digit sharpie UIN, send to packing. Packing shows ordered vs ran vs extra. Only Packing Table prints extra QR labels (who, when, part, rev, notes). Packed prints box then extra stickers. Good so far may go past job qty. |

## Restore next (called out as missing or broken)

Fixed in this pass (keep working):

- Good so far: merge cannot steal a tap (11 stays 11). Clock cap may lock plus; it must not drop the number.
- Reset pack: clears line checks, deletes that order’s box records, merge keeps the reset.
- Multi-op: 2+ timed ops → one card with OP1 / OP2 / OP3 even if the quote bag was messy. Quote lookup uses richest recipe.
- PIN dialog + continue already wired on print / save / chat / pack label.
- One quote per part+rev already locked on save + open.
- shop-guide / barcode / brother-label-print are full files, not stubs.

Still watch: if a screen still shows a clone card or a leftover pack check after this zip, say so — do not rewrite those files from memory.

## New Grok project

Follow `docs/LCM-START-HERE.md`. GitHub copies live in [Jsteck123/lcm-updates](https://github.com/Jsteck123/lcm-updates).
