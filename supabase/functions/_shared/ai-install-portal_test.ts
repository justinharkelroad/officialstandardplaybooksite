import {
  AI_INSTALL_RECEIPT_MAX_FILES_LENGTH,
  AI_INSTALL_RECEIPT_MAX_LINES,
  AI_INSTALL_RECEIPT_MAX_TEXT_LENGTH,
  AI_INSTALL_RECEIPT_STEPS,
  canAccessPortalAsset,
  generatePortalActivationCode,
  isPortalAccessCurrent,
  isPortalEmail,
  normalizePortalEmail,
  normalizePortalPlatform,
  parseAiInstallReceipts,
  shouldCountPortalSession,
} from "./ai-install-portal.ts";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

function assertEquals(actual: unknown, expected: unknown, message: string): void {
  if (JSON.stringify(actual) !== JSON.stringify(expected)) {
    throw new Error(`${message}\nExpected: ${JSON.stringify(expected)}\nActual: ${JSON.stringify(actual)}`);
  }
}

Deno.test("normalizes portal identity fields", () => {
  assertEquals(normalizePortalEmail(" Owner@Agency.COM "), "owner@agency.com", "Email should normalize");
  assert(isPortalEmail("owner@agency.com"), "Valid email should pass");
  assert(!isPortalEmail("not-an-email"), "Invalid email should fail");
  assertEquals(normalizePortalPlatform("codex"), "codex", "Codex should remain Codex");
  assertEquals(normalizePortalPlatform("unexpected"), "both", "Unexpected platform should safely default");
});

Deno.test("requires active and unexpired access", () => {
  const now = new Date("2026-08-28T12:00:00.000Z");
  assert(isPortalAccessCurrent({ is_active: true, expires_at: null }, now), "Non-expiring active access should pass");
  assert(!isPortalAccessCurrent({ is_active: false, expires_at: null }, now), "Revoked access should fail");
  assert(isPortalAccessCurrent({ is_active: true, expires_at: "2026-08-29T12:00:00.000Z" }, now), "Future expiration should pass");
  assert(!isPortalAccessCurrent({ is_active: true, expires_at: "2026-08-27T12:00:00.000Z" }, now), "Past expiration should fail");
});

Deno.test("keeps Claude and Codex downloads platform-specific", () => {
  assert(canAccessPortalAsset("claude", "both"), "All attendees should receive shared guides");
  assert(canAccessPortalAsset("codex", "codex"), "Codex should receive Codex files");
  assert(!canAccessPortalAsset("codex", "claude"), "Codex should not receive Claude files");
  assert(!canAccessPortalAsset("claude", "codex"), "Claude should not receive Codex files");
  assert(canAccessPortalAsset("both", "claude"), "Both access should receive Claude files");
  assert(canAccessPortalAsset("both", "codex"), "Both access should receive Codex files");
});

Deno.test("counts one portal session per 30-minute activity window", () => {
  const now = new Date("2026-08-28T12:00:00.000Z");
  assert(
    shouldCountPortalSession(null, now),
    "A first portal open should count",
  );
  assert(
    shouldCountPortalSession("not-a-date", now),
    "Invalid historical data should not suppress a session",
  );
  assert(
    !shouldCountPortalSession("2026-08-28T11:45:00.000Z", now),
    "A repeated status request inside the window should not count",
  );
  assert(
    shouldCountPortalSession("2026-08-28T11:30:00.000Z", now),
    "A portal open at the boundary should start a new session",
  );
});

Deno.test("creates a strong one-time activation code without email delivery", () => {
  const code = generatePortalActivationCode(
    new Uint8Array([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]),
  );

  assertEquals(code.length, 17, "Activation code should be long enough for temporary access");
  assert(/[A-Z]/.test(code), "Activation code should contain uppercase characters");
  assert(/[a-z]/.test(code), "Activation code should contain lowercase characters");
  assert(/[0-9]/.test(code), "Activation code should contain a number");
  assert(code.endsWith("-Aa7!"), "Activation code should satisfy strong password character rules");
});

const PHASES_DIRECTORY = new URL("../../../resources/aiinstall/v2/phases/", import.meta.url);

function readPhaseFrontmatter(): Array<{ name: string; order: number }> {
  const phases: Array<{ name: string; order: number }> = [];
  for (const entry of Deno.readDirSync(PHASES_DIRECTORY)) {
    if (!entry.isFile || !entry.name.endsWith(".md")) continue;
    const text = Deno.readTextFileSync(new URL(entry.name, PHASES_DIRECTORY));
    const frontmatter = /^---\r?\n([\s\S]*?)\r?\n---/.exec(text)?.[1] ?? "";
    const name = /^name:\s*(\S+)\s*$/m.exec(frontmatter)?.[1];
    const order = Number(/^order:\s*(\d+)\s*$/m.exec(frontmatter)?.[1]);
    assert(name, `${entry.name} should have a name in its frontmatter`);
    assert(Number.isInteger(order), `${entry.name} should have a numeric order in its frontmatter`);
    phases.push({ name, order });
  }
  return phases;
}

Deno.test("receipt step list matches the workshop phase files in workshop order", () => {
  const phases = readPhaseFrontmatter().sort((a, b) => a.order - b.order);
  assertEquals(phases.length, 20, "The workshop should have 20 phase files");
  assertEquals(
    [...AI_INSTALL_RECEIPT_STEPS],
    phases.map((phase) => phase.name),
    "AI_INSTALL_RECEIPT_STEPS must equal the phase names in resources/aiinstall/v2/phases, sorted by order",
  );
});

Deno.test("accepts a valid receipt", () => {
  const result = parseAiInstallReceipts("AII-R1|phase-1-about-me|PASS|about-me.md|2027-02-10");
  assertEquals(result.rejected, [], "A valid receipt should not be rejected");
  assertEquals(
    result.receipts,
    [{ step: "phase-1-about-me", result: "PASS", files: "about-me.md", date: "2027-02-10" }],
    "A valid receipt should be returned unchanged",
  );
});

Deno.test("accepts FAIL receipts with no files", () => {
  const result = parseAiInstallReceipts("AII-R1|check-day-1|FAIL|none|2027-02-10");
  assertEquals(result.rejected, [], "A FAIL receipt is still a valid receipt");
  assertEquals(result.receipts[0].result, "FAIL", "FAIL should be preserved");
  assertEquals(result.receipts[0].files, "none", "none should be preserved");
});

Deno.test("finds receipts inside chat text, code fences, backticks and spaces", () => {
  const pasted = [
    "Here is your receipt, copy the next line:",
    "```",
    "   AII-R1|phase-2-voice|PASS|voice.md, voice-examples.md|2027-02-11   ",
    "```",
    "Done! `AII-R1|phase-3-rules|PASS|rules.md|2027-02-11`",
    "Receipt: AII-R1|memory|FAIL|none|2027-02-12 ",
  ].join("\r\n");
  const result = parseAiInstallReceipts(pasted);
  assertEquals(result.rejected, [], "Surrounding text should not cause rejections");
  assertEquals(
    result.receipts.map((receipt) => receipt.step),
    ["phase-2-voice", "phase-3-rules", "memory"],
    "Every receipt line should be found in order",
  );
  assertEquals(result.receipts[0].files, "voice.md, voice-examples.md", "Comma separated files should survive");
});

Deno.test("rejects bad receipts with a reason an owner can act on", () => {
  const cases: Array<[string, RegExp]> = [
    ["AII-R2|phase-1-about-me|PASS|about-me.md|2027-02-10", /must start with AII-R1/],
    ["aii-r1|phase-1-about-me|PASS|about-me.md|2027-02-10", /must start with AII-R1/],
    ["AII-R1|phase-1-about-me|PASS|about-me.md", /five parts.*has 4/],
    ["AII-R1|phase-1-about-me|PASS|a.md|b.md|2027-02-10", /five parts.*has 6/],
    ["AII-R1|phase-9-nonsense|PASS|about-me.md|2027-02-10", /not a step name/],
    ["AII-R1|phase-1-about-me|pass|about-me.md|2027-02-10", /PASS or FAIL/],
    ["AII-R1|phase-1-about-me|MAYBE|about-me.md|2027-02-10", /PASS or FAIL/],
    ["AII-R1|phase-1-about-me|PASS|about-me.md|2027-02-30", /real date/],
    ["AII-R1|phase-1-about-me|PASS|about-me.md|2027-2-3", /real date/],
    ["AII-R1|phase-1-about-me|PASS|about-me.md|2027-13-01", /real date/],
    ["AII-R1|phase-1-about-me|PASS||2027-02-10", /empty/],
    [`AII-R1|phase-1-about-me|PASS|${"a".repeat(AI_INSTALL_RECEIPT_MAX_FILES_LENGTH + 1)}|2027-02-10`, /longer than 500/],
  ];
  for (const [line, reason] of cases) {
    const result = parseAiInstallReceipts(line);
    assertEquals(result.receipts.length, 0, `Should reject: ${line.slice(0, 60)}`);
    assertEquals(result.rejected.length, 1, `Should explain one rejection: ${line.slice(0, 60)}`);
    assert(reason.test(result.rejected[0].reason), `Reason "${result.rejected[0].reason}" should match ${reason}`);
    assertEquals(result.rejected[0].lineNumber, 1, "Rejection should name the line");
  }
});

Deno.test("accepts leap days only in leap years", () => {
  assert(
    parseAiInstallReceipts("AII-R1|ready|PASS|READY.txt|2028-02-29").receipts.length === 1,
    "2028-02-29 is a real date",
  );
  assert(
    parseAiInstallReceipts("AII-R1|ready|PASS|READY.txt|2027-02-29").receipts.length === 0,
    "2027-02-29 is not a real date",
  );
});

Deno.test("accepts a files field of exactly 500 characters", () => {
  const files = "a".repeat(AI_INSTALL_RECEIPT_MAX_FILES_LENGTH);
  const result = parseAiInstallReceipts(`AII-R1|ready|PASS|${files}|2027-02-10`);
  assertEquals(result.receipts.length, 1, "500 characters is allowed");
});

Deno.test("strips control characters from file names and never treats them as HTML", () => {
  const result = parseAiInstallReceipts(
    ["AII-R1|ready|PASS|a" + String.fromCharCode(0) + "b" + String.fromCharCode(7) + ".md," + String.fromCharCode(0x202e) + "c.md" + String.fromCharCode(0x200b) + ",<img src=x onerror=alert(1)>.md|2027-02-10"].join(""),
  );
  assertEquals(result.receipts.length, 1, "Control characters should not reject the receipt");
  const files = result.receipts[0].files;
  assert(![...files].some((character) => { const code = character.codePointAt(0) ?? 0; return code <= 0x1f || (code >= 0x7f && code <= 0x9f) || (code >= 0x200b && code <= 0x200f) || (code >= 0x202a && code <= 0x202e); }), "Control characters should be removed");
  assertEquals(files, "ab.md,c.md,<img src=x onerror=alert(1)>.md", "Markup is kept as inert text, not interpreted");
});

Deno.test("a repeated step in one paste keeps the last line and says so", () => {
  const result = parseAiInstallReceipts([
    "AII-R1|memory|FAIL|none|2027-02-10",
    "AII-R1|cleanup|PASS|none|2027-02-10",
    "AII-R1|memory|PASS|memory.md|2027-02-11",
  ].join("\n"));
  assertEquals(result.receipts.map((r) => `${r.step}:${r.result}`), ["cleanup:PASS", "memory:PASS"], "Last line wins");
  assertEquals(result.rejected.length, 1, "The dropped line should be reported");
  assert(/more than once/.test(result.rejected[0].reason), "The report should explain the repeat");
});

Deno.test("caps the paste at 8000 characters and 40 receipt lines", () => {
  const line = "AII-R1|ready|PASS|READY.txt|2027-02-10";
  const lines = Array.from({ length: 45 }, (_, index) => `${line} ${index}`.replace(" ", "|").slice(0, line.length));
  const many = parseAiInstallReceipts(lines.join("\n"));
  assertEquals(many.receipts.length, 1, "All 40 read lines are the same step so one survives");
  assert(many.rejected.some((item) => /5 more were skipped/.test(item.reason)), "Lines past 40 should be reported as skipped");

  const long = parseAiInstallReceipts(`${"x".repeat(AI_INSTALL_RECEIPT_MAX_TEXT_LENGTH)}\n${line}`);
  assertEquals(long.receipts.length, 0, "Text past 8000 characters should not be read");
  assert(long.rejected.some((item) => /longer than 8000/.test(item.reason)), "Truncation should be reported");
  assertEquals(AI_INSTALL_RECEIPT_MAX_LINES, 40, "The line cap should be 40");
});

Deno.test("never throws on bad input", () => {
  const inputs: unknown[] = [undefined, null, 42, {}, "", "   ", "AII-R", "AII-R1", "AII-R1|||||", "|||", "\u0000\u0000", "AII-R1|" + "|".repeat(5000)];
  for (const input of inputs) {
    const result = parseAiInstallReceipts(input as string);
    assertEquals(result.receipts.length, 0, "Bad input should produce no receipts");
    assert(result.rejected.length >= 1, "Bad input should produce a reason");
  }
});

Deno.test("ignores unrelated chat lines", () => {
  const result = parseAiInstallReceipts("Great work today!\nSee you tomorrow.");
  assertEquals(result.receipts.length, 0, "No receipts in plain chat");
  assertEquals(result.rejected.length, 1, "Plain chat should produce one 'no receipt found' message");
  assert(/No receipt line was found/.test(result.rejected[0].reason), "The message should say no receipt was found");
});
