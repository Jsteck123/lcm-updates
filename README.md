# LCM updates

Latest: [lcm-update-latest.zip](https://github.com/Jsteck123/lcm-updates/raw/main/lcm-update-latest.zip)

This build: [lcm-update-20260815-222208.zip](https://github.com/Jsteck123/lcm-updates/raw/main/lcm-update-20260815-222208.zip)

Install on the office host: **Settings → Update app → Choose file**. Shop data is not in the zip.

**This build — Load Lanes follow Return and re-assign**
- Return job takes that OP / line off Load Lanes right away (desk assign + running-order row clear).
- Re-assign to someone else moves the hours. The old person’s lane does not keep a leftover bar.
- Stale machine-queue rows no longer book hours after the job is given back or handed off.
- Multi-machine OP cards still split the same way.

Also still in this package
- Per-OP assign / pull on lathe → mill → lathe jobs.
- Load Lanes, stock match, BUY inches.
