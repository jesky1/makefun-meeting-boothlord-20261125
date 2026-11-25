// test.mjs — checks for the meeting one-liner entry writer.
// Run: node --test test.mjs
import test from "node:test";
import { strict as assert } from "node:assert";
import { execFileSync as runMain } from "node:child_process";
import { mkdtempSync as freshDir, readFileSync as readBytes, rmSync as wipeDir } from "node:fs";
import { tmpdir as tempRoot } from "node:os";
import { join as joinPath } from "node:path";

// Runs main.ts into a new temp folder and returns the written text.
function oneLiner() {
  const folder = freshDir(joinPath(tempRoot(), "meeting-line-"));
  runMain(process.execPath, ["main.ts"], {
    cwd: import.meta.dirname,
    env: { ...process.env, MAKEFUN_OUTPUT_DIR: folder },
    encoding: "utf8",
  });
  const text = readBytes(joinPath(folder, "entry.txt"), "utf8");
  wipeDir(folder, { recursive: true, force: true });
  return text;
}

test("the line fits the gate and ends cleanly", () => {
  const text = oneLiner();
  assert.ok(text.length >= 1 && text.length <= 200, `length ${text.length} breaks the gate`);
  assert.ok(text.trim().length > 0, "the line is blank");
  assert.ok(!text.includes("\n") && !text.includes("\r"), "the line must stay on one line");
  assert.equal(text.at(-1), ".", "the line should end with a full stop");
});

test("every build writes the same line", () => {
  assert.deepStrictEqual(oneLiner(), oneLiner());
});

test("the line kills the meeting with the email loop", () => {
  const text = oneLiner();
  assert.match(text, /could have been an email/);
  assert.match(text, /needed a meeting/);
  assert.match(text, /ready to send/);
});
