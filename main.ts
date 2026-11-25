// main.ts — The Meeting That Should Have Been One Line entry writer.
// Writes the one sentence that replaces the meeting to /output/entry.txt.
import { mkdirSync as ensureFolder, writeFileSync as writeText } from "node:fs";

// The line, written in this session: the meeting and the email blame
// each other in a loop, and the loop itself is the joke — the sentence
// kills the meeting by showing why it exists at all.
const LINE =
  "This meeting could have been an email, but the email needed a meeting to decide if it was ready to send.";

// Gate from the rules: entry.txt is UTF-8 text of 1–200 characters,
// exactly one line, never only whitespace.
const SHORTEST = 1;
const LONGEST = 200;
const OUT_NAME = "entry.txt";

function violationsOf(text: string): string[] {
  // Each gate rule adds its own complaint, so a bad line reports
  // every problem at once instead of failing on the first one.
  const bad: string[] = [];
  if (text.length < SHORTEST || text.length > LONGEST) {
    bad.push(`length ${text.length} is outside ${SHORTEST}-${LONGEST}`);
  }
  if (text.trim().length === 0) bad.push("blank");
  if (text.split("\n").length > 1 || text.split("\r").length > 1) {
    bad.push("more than one line");
  }
  return bad;
}

const problems = violationsOf(LINE);
if (problems.length > 0) {
  throw new Error(`line rejected: ${problems.join("; ")}`);
}
const targetDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
ensureFolder(targetDir, { recursive: true });
writeText(`${targetDir}/${OUT_NAME}`, LINE, "utf8");
console.log(`line saved: ${LINE.length} characters to ${targetDir}/${OUT_NAME}`);
