import {
  canAccessPortalAsset,
  generatePortalActivationCode,
  isPortalAccessCurrent,
  isPortalEmail,
  normalizePortalEmail,
  normalizePortalPlatform,
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
