import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import test from "node:test";

import {
  AI_INSTALL_RECEIPT_STEPS,
  describeAiInstallReceiptSubmission,
  summarizeAiInstallReceipts,
} from "../../lib/aiInstallReceipts";

const PHASES_DIRECTORY = join(process.cwd(), "resources", "aiinstall", "v2", "phases");

function readPhases(): Array<{ name: string; title: string; order: number }> {
  return readdirSync(PHASES_DIRECTORY)
    .filter((file) => file.endsWith(".md"))
    .map((file) => {
      const text = readFileSync(join(PHASES_DIRECTORY, file), "utf8");
      const frontmatter = /^---\r?\n([\s\S]*?)\r?\n---/.exec(text)?.[1] ?? "";
      return {
        name: /^name:\s*(\S+)\s*$/m.exec(frontmatter)?.[1] ?? "",
        title: /^title:\s*(.+?)\s*$/m.exec(frontmatter)?.[1] ?? "",
        order: Number(/^order:\s*(\d+)\s*$/m.exec(frontmatter)?.[1]),
      };
    })
    .sort((a, b) => a.order - b.order);
}

test("client step list matches the workshop phase files in workshop order", () => {
  const phases = readPhases();
  assert.equal(phases.length, 20);
  assert.deepEqual(
    AI_INSTALL_RECEIPT_STEPS.map((step) => ({ name: step.name, label: step.label })),
    phases.map((phase) => ({ name: phase.name, label: phase.title })),
  );
});

test("summary lists all 20 steps in order with not-yet for missing receipts", () => {
  const summary = summarizeAiInstallReceipts([]);
  assert.equal(summary.steps.length, 20);
  assert.equal(summary.passed, 0);
  assert.equal(summary.day1, null);
  assert.equal(summary.day2, null);
  assert.ok(summary.steps.every((step) => step.result === null));
});

test("summary counts passes, calls out the day checks, and ignores unknown steps", () => {
  const summary = summarizeAiInstallReceipts([
    { step: "phase-1-about-me", result: "PASS", files: "about-me.md", receipt_date: "2027-02-10" },
    { step: "check-day-1", result: "FAIL", files: "none", receipt_date: "2027-02-10" },
    { step: "check-day-2", result: "PASS", files: "none", receipt_date: "2027-02-11" },
    { step: "not-a-real-step", result: "PASS", files: "none", receipt_date: "2027-02-11" },
  ]);
  assert.equal(summary.passed, 2);
  assert.equal(summary.failed, 1);
  assert.equal(summary.day1, "FAIL");
  assert.equal(summary.day2, "PASS");
  assert.equal(summary.steps[1].files, "about-me.md");
  assert.equal(summary.steps.length, 20);
});

test("summary tolerates a missing receipt list", () => {
  assert.equal(summarizeAiInstallReceipts(undefined).passed, 0);
  assert.equal(summarizeAiInstallReceipts(null).total, 20);
});

test("submission message says what was and was not recorded", () => {
  assert.equal(describeAiInstallReceiptSubmission(1, 0), "1 receipt recorded.");
  assert.equal(describeAiInstallReceiptSubmission(3, 0), "3 receipts recorded.");
  assert.match(describeAiInstallReceiptSubmission(2, 1), /2 receipts recorded\. 1 line could not be recorded\./);
  assert.match(describeAiInstallReceiptSubmission(0, 2), /Nothing was recorded/);
});
