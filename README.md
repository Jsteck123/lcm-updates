# LCM updates

Latest: [lcm-update-latest.zip](https://github.com/Jsteck123/lcm-updates/raw/main/lcm-update-latest.zip)

This build: [lcm-update-20260815-215858.zip](https://github.com/Jsteck123/lcm-updates/raw/main/lcm-update-20260815-215858.zip)

Install on the office host: **Settings → Update app → Choose file**. Shop data is not in the zip.

**This build — Per-OP assign / pull**
- Jobs that run on more than one machine (lathe then mill then lathe) split into one Assign row and one Job Board card per remaining OP.
- Assign OP1 to the lathe person, OP2 to the mill person. They take only their OP.
- Single-machine multi-op jobs stay one card (Gayle still takes the whole mill job).
- Quoting has a Machine row under Setup / Run — name the station for each OP.
- Load on an OP card clocks only that OP. Wait OPn is a warning, not a lock.
- Done OPn finishes that operation. The last remaining OP finishes the part / sends it to pack.
- Load Lanes books each assigned OP on its person and machine.

Also still in this package
- Load Lanes (admin lookahead).
- Stock search treats 4×2 and 2×4 as the same bar.
