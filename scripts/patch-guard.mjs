#!/usr/bin/env node
/**
 * Pre-patch snapshot so a wipe can be undone.
 *
 *   node scripts/patch-guard.mjs start "why this patch"
 *   node scripts/patch-guard.mjs check
 *   node scripts/patch-guard.mjs abort          # restore everything
 *   node scripts/patch-guard.mjs abort src/lib/lcm/shop-guide.ts
 *   node scripts/patch-guard.mjs finish
 *
 * Baseline is artifacts/lcm-pre-patch (this patch).
 * Last shipped good copy is artifacts/lcm-live-src.
 */
import { spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const pre = path.join(root, "artifacts", "lcm-pre-patch");
const live = path.join(root, "artifacts", "lcm-live-src");
const lockA = path.join(root, "artifacts", "LCM-FEATURE-LOCK.md");
const lockB = path.join(root, "docs", "LCM-FEATURE-LOCK.md");

const INCLUDE = [
  "src",
  "scripts",
  "docs",
  "package.json",
  "package-lock.json",
  "vite.config.ts",
  "tsconfig.json",
  "startup.sh",
  "eslint.config.mjs",
  "HOW-TO-UPDATE.txt",
  "AGENTS.project.md",
];

function copyRecursive(src, out) {
  const st = fs.statSync(src);
  if (st.isDirectory()) {
    fs.mkdirSync(out, { recursive: true });
    for (const name of fs.readdirSync(src)) {
      if (name === "node_modules" || name === ".git" || name === "data") continue;
      copyRecursive(path.join(src, name), path.join(out, name));
    }
    return;
  }
  fs.mkdirSync(path.dirname(out), { recursive: true });
  fs.copyFileSync(src, out);
}

function walkFiles(dir, acc = [], base = dir) {
  if (!fs.existsSync(dir)) return acc;
  for (const name of fs.readdirSync(dir)) {
    const abs = path.join(dir, name);
    const st = fs.statSync(abs);
    if (st.isDirectory()) walkFiles(abs, acc, base);
    else acc.push({ rel: path.relative(base, abs).replaceAll("\\", "/"), bytes: st.size });
  }
  return acc;
}

function saveTree(dest) {
  fs.rmSync(dest, { recursive: true, force: true });
  fs.mkdirSync(dest, { recursive: true });
  for (const rel of INCLUDE) {
    const abs = path.join(root, rel);
    if (!fs.existsSync(abs)) continue;
    copyRecursive(abs, path.join(dest, rel));
  }
}

function baselineDir() {
  if (fs.existsSync(path.join(pre, "GUARD.json"))) return pre;
  if (fs.existsSync(path.join(live, "SNAPSHOT.json"))) return live;
  return null;
}

function checkWipes(baseDir) {
  const problems = [];
  const srcBase = path.join(baseDir, "src");
  const nowSrc = path.join(root, "src");
  if (!fs.existsSync(nowSrc)) {
    problems.push({ file: "src", kind: "missing", detail: "src/ is gone" });
    return problems;
  }
  for (const row of walkFiles(srcBase)) {
    const now = path.join(nowSrc, row.rel);
    if (!fs.existsSync(now)) {
      problems.push({ file: `src/${row.rel}`, kind: "missing", was: row.bytes });
      continue;
    }
    const neu = fs.statSync(now).size;
    if (row.bytes >= 1500 && neu < 200) {
      problems.push({
        file: `src/${row.rel}`,
        kind: "wiped",
        was: row.bytes,
        now: neu,
      });
    } else if (row.bytes >= 2000 && neu < row.bytes * 0.4) {
      problems.push({
        file: `src/${row.rel}`,
        kind: "shrunk",
        was: row.bytes,
        now: neu,
      });
    }
  }
  return problems;
}

const cmd = process.argv[2] || "check";
const rest = process.argv.slice(3).join(" ");

if (cmd === "start") {
  saveTree(pre);
  const srcFiles = walkFiles(path.join(pre, "src")).length;
  const guard = {
    startedAt: new Date().toISOString(),
    reason: rest || "patch",
    srcFiles,
  };
  fs.writeFileSync(path.join(pre, "GUARD.json"), JSON.stringify(guard, null, 2));
  console.log(JSON.stringify({ ok: true, cmd: "start", ...guard, dest: pre }, null, 2));
  process.exit(0);
}

if (cmd === "abort") {
  const from = baselineDir();
  if (!from) {
    console.error(JSON.stringify({ ok: false, error: "No pre-patch or live snapshot to restore" }));
    process.exit(1);
  }
  const one = process.argv[3];
  if (one) {
    const srcFile = path.join(from, one);
    const destFile = path.join(root, one);
    if (!fs.existsSync(srcFile)) {
      console.error(JSON.stringify({ ok: false, error: "Not in snapshot: " + one }));
      process.exit(1);
    }
    copyRecursive(srcFile, destFile);
    console.log(JSON.stringify({ ok: true, cmd: "abort", restored: one, from }, null, 2));
    process.exit(0);
  }
  for (const rel of INCLUDE) {
    const srcp = path.join(from, rel);
    if (!fs.existsSync(srcp)) continue;
    const destp = path.join(root, rel);
    if (fs.existsSync(destp) && fs.statSync(destp).isDirectory()) {
      // replace directory contents from snapshot
      fs.rmSync(destp, { recursive: true, force: true });
    }
    copyRecursive(srcp, destp);
  }
  console.log(JSON.stringify({ ok: true, cmd: "abort", restored: "all", from }, null, 2));
  process.exit(0);
}

if (cmd === "check" || cmd === "finish") {
  const lockOk = fs.existsSync(lockA) || fs.existsSync(lockB);
  const base = baselineDir();
  const problems = base ? checkWipes(base) : [{ file: "snapshot", kind: "missing", detail: "run start first" }];
  const result = {
    ok: problems.length === 0 && lockOk,
    baseline: base,
    featureLock: lockOk,
    problems,
  };
  if (!lockOk) {
    result.problems = [
      ...problems,
      { file: "LCM-FEATURE-LOCK.md", kind: "missing", detail: "required lock file" },
    ];
    result.ok = false;
  }
  if (cmd === "check") {
    console.log(JSON.stringify(result, null, 2));
    process.exit(result.ok ? 0 : 2);
  }
  if (!result.ok) {
    console.error(JSON.stringify({ ...result, error: "Wipes or missing feature lock — abort or fix before finish" }, null, 2));
    process.exit(2);
  }
  const snap = spawnSync(process.execPath, [path.join(root, "scripts", "snapshot-live-src.mjs")], {
    encoding: "utf8",
  });
  console.log(JSON.stringify({ ok: true, cmd: "finish", liveSnapshot: snap.status === 0 }, null, 2));
  if (snap.stdout) process.stdout.write(snap.stdout);
  process.exit(snap.status === 0 ? 0 : 1);
}

console.error("Usage: node scripts/patch-guard.mjs start|check|abort|finish");
process.exit(1);
