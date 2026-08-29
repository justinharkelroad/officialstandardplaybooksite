import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import test from "node:test";

import {
  AI_INSTALL_PORTAL_MIN_PASSWORD_LENGTH,
  validateAiInstallPortalPassword,
} from "../../lib/aiInstallPortalAuth.ts";

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

test("keeps password sign-in primary and uses admin-issued activation codes for setup", () => {
  const source = readFileSync(resolve(process.cwd(), "src/pages/AIInstallPortal.tsx"), "utf8");

  assert.match(source, /useState<"password" \| "activation">\("password"\)/);
  assert.match(source, /supabase\.auth\.signInWithPassword\(/);
  assert.match(source, /supabase\.auth\.updateUser\(\{ password: newPassword \}\)/);
  assert.match(source, /First visit or forgot your password\? Use activation code/);
  assert.match(source, /No email is sent\./);
  assert.doesNotMatch(source, /verifyOtp|requestAiInstallPortalLink|Email setup|Check your inbox/);
});
