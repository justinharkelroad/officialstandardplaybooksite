import assert from "node:assert/strict";
import test from "node:test";

import { parseAiInstallPortalToken } from "../../lib/aiInstallPortalAuth.ts";

const TOKEN = "0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef";

test("reads the scanner-safe AI Install token from the URL fragment", () => {
  assert.equal(parseAiInstallPortalToken(`#portal_token=${TOKEN}`), TOKEN);
});

test("does not confuse legacy Supabase session fragments with portal verification", () => {
  assert.equal(parseAiInstallPortalToken("#access_token=jwt&refresh_token=refresh"), null);
  assert.equal(parseAiInstallPortalToken("#portal_token=too-short"), null);
});
