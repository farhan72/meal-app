#!/usr/bin/env node
// scripts/build-report.mjs
// Post-build compression report: shows raw vs gzip vs brotli sizes for all static assets.

import { readdirSync, statSync, readFileSync } from "fs";
import { gzipSync, brotliCompressSync } from "zlib";
import { join, extname, relative } from "path";

const NEXT_STATIC = join(process.cwd(), ".next", "static");
const EXTENSIONS = new Set([".js", ".css"]);

function getAllFiles(dir, files = []) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) {
      getAllFiles(full, files);
    } else if (EXTENSIONS.has(extname(entry.name))) {
      files.push(full);
    }
  }
  return files;
}

function formatBytes(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} kB`;
  return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
}

function pad(str, len) {
  return String(str).padEnd(len);
}

function padL(str, len) {
  return String(str).padStart(len);
}

function pct(before, after) {
  return ((1 - after / before) * 100).toFixed(1) + "%";
}

const files = getAllFiles(NEXT_STATIC);

let totalRaw = 0;
let totalGzip = 0;
let totalBrotli = 0;
const rows = [];

for (const file of files) {
  const content = readFileSync(file);
  const raw = content.length;
  const gz = gzipSync(content, { level: 9 }).length;
  const br = brotliCompressSync(content).length;

  totalRaw += raw;
  totalGzip += gz;
  totalBrotli += br;

  rows.push({
    name: relative(process.cwd(), file),
    raw,
    gz,
    br,
  });
}

rows.sort((a, b) => b.raw - a.raw);

// ─── Table layout ────────────────────────────────────────────────────────────
const C = { file: 56, raw: 11, gz: 11, gzPct: 9, br: 11, brPct: 9 };
const LINE = "─".repeat(Object.values(C).reduce((a, b) => a + b + 1, 0));

const green = (s) => `\x1b[32m${s}\x1b[0m`;
const bold  = (s) => `\x1b[1m${s}\x1b[0m`;
const dim   = (s) => `\x1b[2m${s}\x1b[0m`;
const cyan  = (s) => `\x1b[36m${s}\x1b[0m`;

console.log("\n" + bold(cyan("  ⚡ Build Compression Report")));
console.log("  " + LINE);
console.log(
  "  " +
    bold(pad("File", C.file)) +
    " " + padL("Original", C.raw) +
    " " + padL("Gzip ▼", C.gz) +
    " " + padL("Saving", C.gzPct) +
    " " + padL("Brotli ▼", C.br) +
    " " + padL("Saving", C.brPct)
);
console.log("  " + LINE);

for (const row of rows) {
  const name =
    row.name.length > C.file - 1
      ? "…" + row.name.slice(-(C.file - 2))
      : row.name;

  console.log(
    "  " +
      dim(pad(name, C.file)) +
      " " + padL(formatBytes(row.raw), C.raw) +
      " " + green(padL(formatBytes(row.gz), C.gz)) +
      " " + padL(pct(row.raw, row.gz), C.gzPct) +
      " " + green(padL(formatBytes(row.br), C.br)) +
      " " + padL(pct(row.raw, row.br), C.brPct)
  );
}

console.log("  " + LINE);
console.log(
  "  " +
    bold(pad("TOTAL", C.file)) +
    " " + bold(padL(formatBytes(totalRaw), C.raw)) +
    " " + bold(green(padL(formatBytes(totalGzip), C.gz))) +
    " " + bold(padL(pct(totalRaw, totalGzip), C.gzPct)) +
    " " + bold(green(padL(formatBytes(totalBrotli), C.br))) +
    " " + bold(padL(pct(totalRaw, totalBrotli), C.brPct))
);
console.log("  " + LINE);

const gzSaved  = formatBytes(totalRaw - totalGzip);
const brSaved  = formatBytes(totalRaw - totalBrotli);

console.log();
console.log(green("  ✓") + bold(" Gzip   ") + `saves ${gzSaved} (${pct(totalRaw, totalGzip)} smaller)`);
console.log(green("  ✓") + bold(" Brotli ") + `saves ${brSaved} (${pct(totalRaw, totalBrotli)} smaller)`);
console.log();
