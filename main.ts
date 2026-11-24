import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

// One-line office joke — entry for the 24-hour sprint.
// Setup: a performance review compliment. Punchline: what it really means.
const ENTRY =
  "My performance review said I 'thrive under pressure' — corporate for 'we caught you crying in the stairwell and decided to call it a strength.'";

// Gate: 1-200 characters, a single line, not only whitespace, no control chars.
const chars = [...ENTRY];
if (chars.length < 1 || chars.length > 200) {
  throw new Error(`entry must be 1-200 characters, got ${chars.length}`);
}
if (ENTRY.trim().length === 0) {
  throw new Error("entry must not be only whitespace");
}
if (ENTRY !== ENTRY.trim()) {
  throw new Error("entry must not have leading or trailing whitespace");
}
if (ENTRY.includes("\n") || ENTRY.includes("\r")) {
  throw new Error("entry must be a single line");
}
if (/[\u0000-\u001F\u007F]/.test(ENTRY)) {
  throw new Error("entry must not contain control characters");
}

const outDir =
  process.env.MAKEFUN_OUTPUT_DIR ?? process.env.OUTPUT_DIR ?? "/output";
mkdirSync(outDir, { recursive: true });
const outPath = join(outDir, "entry.txt");

// Write with no trailing newline, then read back and verify byte-for-byte.
writeFileSync(outPath, ENTRY, "utf8");
const roundTrip = readFileSync(outPath, "utf8");
if (roundTrip !== ENTRY) {
  throw new Error("round-trip check failed: entry.txt does not match ENTRY");
}

console.log(ENTRY);
