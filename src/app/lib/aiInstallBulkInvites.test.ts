import assert from "node:assert/strict";
import test from "node:test";

import { parseAiInstallBulkInvites } from "../../lib/aiInstallBulkInvites";

test("parses pasted emails, display names, and case-insensitive duplicates", () => {
  const result = parseAiInstallBulkInvites(
    [
      "alex@agency.com",
      "Jordan Lee <jordan@agency.com>",
      "ALEX@AGENCY.COM",
    ].join("\n"),
    { platform: "codex", expiresAt: null },
  );

  assert.deepEqual(
    result.invites.map(({ email, fullName, platform }) => ({ email, fullName, platform })),
    [
      { email: "alex@agency.com", fullName: "", platform: "codex" },
      { email: "jordan@agency.com", fullName: "Jordan Lee", platform: "codex" },
    ],
  );
  assert.deepEqual(result.duplicateEmails, ["alex@agency.com"]);
  assert.equal(result.issues.length, 0);
});

test("reads CSV headers and lets row values override the defaults", () => {
  const result = parseAiInstallBulkInvites(
    [
      "email,name,platform,expires",
      'owner@northstar.com,"Morgan, Lee",claude,2026-10-31',
      "builder@southside.com,Sam Builder,,",
      "team@fullstack.com,Full Stack,Claude + Codex,",
    ].join("\n"),
    { platform: "codex", expiresAt: "2026-12-01T12:00" },
  );

  assert.equal(result.invites.length, 3);
  assert.deepEqual(result.invites[0], {
    email: "owner@northstar.com",
    fullName: "Morgan, Lee",
    platform: "claude",
    expiresAt: "2026-10-31T00:00:00.000Z",
    sourceLine: 2,
  });
  assert.equal(result.invites[1].platform, "codex");
  assert.equal(result.invites[1].expiresAt, new Date("2026-12-01T12:00").toISOString());
  assert.equal(result.invites[2].platform, "both");
});

test("accepts simple name and email pairs without a CSV header", () => {
  const result = parseAiInstallBulkInvites(
    [
      "Taylor Reed,taylor@agency.com",
      "casey@agency.com,Casey Rivera",
      "first@agency.com;second@agency.com",
    ].join("\n"),
    { platform: "both", expiresAt: null },
  );

  assert.deepEqual(
    result.invites.map(({ email, fullName }) => ({ email, fullName })),
    [
      { email: "taylor@agency.com", fullName: "Taylor Reed" },
      { email: "casey@agency.com", fullName: "Casey Rivera" },
      { email: "first@agency.com", fullName: "" },
      { email: "second@agency.com", fullName: "" },
    ],
  );
});

test("skips rows with invalid emails, platforms, or expiration dates", () => {
  const result = parseAiInstallBulkInvites(
    [
      "email,name,platform,expires",
      "not-an-email,No Email,codex,",
      "wrong-platform@agency.com,Wrong Platform,gpt,",
      "wrong-date@agency.com,Wrong Date,claude,not-a-date",
      "valid@agency.com,Valid Person,codex,",
    ].join("\n"),
    { platform: "codex", expiresAt: null },
  );

  assert.deepEqual(result.invites.map((invite) => invite.email), ["valid@agency.com"]);
  assert.equal(result.issues.length, 3);
  assert.match(result.issues[0].message, /valid email/i);
  assert.match(result.issues[1].message, /platform/i);
  assert.match(result.issues[2].message, /expiration/i);
});

test("caps a single send run while reporting the remaining unique emails", () => {
  const source = Array.from({ length: 5 }, (_, index) => `person${index}@agency.com`).join("\n");
  const result = parseAiInstallBulkInvites(source, {
    platform: "codex",
    expiresAt: null,
    limit: 3,
  });

  assert.equal(result.invites.length, 3);
  assert.equal(result.overflowCount, 2);
});
