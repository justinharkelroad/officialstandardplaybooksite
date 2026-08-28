import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import test from "node:test";

import {
  AI_INSTALL_PORTAL_MIN_PASSWORD_LENGTH,
  parseAiInstallPortalToken,
  validateAiInstallPortalPassword,
} from "../../lib/aiInstallPortalAuth.ts";

const TOKEN = "0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef";

test("reads the scanner-safe AI Install token from the URL fragment", () => {
  assert.equal(parseAiInstallPortalToken(`#portal_token=${TOKEN}`), TOKEN);
});

test("does not confuse legacy Supabase session fragments with portal verification", () => {
  assert.equal(parseAiInstallPortalToken("#access_token=jwt&refresh_token=refresh"), null);
  assert.equal(parseAiInstallPortalToken("#portal_token=too-short"), null);
});

test("requires an eight-character AI Install portal password", () => {
  assert.equal(AI_INSTALL_PORTAL_MIN_PASSWORD_LENGTH, 8);
  assert.equal(
    validateAiInstallPortalPassword("short", "short"),
    "Use at least 8 characters.",
  );
});

test("requires matching AI Install portal passwords", () => {
  assert.equal(
    validateAiInstallPortalPassword("a-secure-password", "a-different-password"),
    "The passwords do not match.",
  );
  assert.equal(
    validateAiInstallPortalPassword("a-secure-password", "a-secure-password"),
    null,
  );
});

test("keeps password sign-in primary and email verification as setup", () => {
  const source = readFileSync(resolve(process.cwd(), "src/pages/AIInstallPortal.tsx"), "utf8");

  assert.match(source, /useState<"password" \| "email">\("password"\)/);
  assert.match(source, /supabase\.auth\.signInWithPassword\(/);
  assert.match(source, /supabase\.auth\.verifyOtp\(/);
  assert.match(source, /supabase\.auth\.updateUser\(\{ password \}\)/);
  assert.match(source, /First visit or forgot your password\? Email setup/);
});
