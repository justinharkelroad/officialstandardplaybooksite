import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { resolve } from "node:path";

const readSource = (path: string) => readFileSync(resolve(process.cwd(), path), "utf8");

test("portal activity reset clears engagement while preserving access and invite history", () => {
  const adminFunction = readSource("supabase/functions/ai-install-portal-admin/index.ts");
  const resetBranch = adminFunction.slice(
    adminFunction.indexOf('if (action === "reset_activity")'),
    adminFunction.indexOf('return errorResponse(`Unknown action:'),
  );

  assert.match(adminFunction, /action === "reset_activity"/);
  assert.match(adminFunction, /from\("ai_install_portal_progress"\)[\s\S]*?\.delete\(\)[\s\S]*?\.eq\("access_id", accessId\)/);
  assert.match(adminFunction, /from\("ai_install_portal_events"\)[\s\S]*?\.delete\(\)[\s\S]*?\.eq\("access_id", accessId\)/);
  assert.match(adminFunction, /first_login_at: null,[\s\S]*?last_login_at: null,[\s\S]*?login_count: 0/);
  assert.match(adminFunction, /body\.include_ready === true[\s\S]*?from\("ai_install_ready_submissions"\)[\s\S]*?\.ilike\("email", access\.email\)/);
  assert.doesNotMatch(resetBranch, /from\("ai_install_portal_access"\)\s*\.delete\(\)/);
  assert.doesNotMatch(resetBranch, /from\("ai_install_portal_testimonials"\)[\s\S]*?\.delete\(\)/);
});

test("admin issues one-time activation codes without sending portal email", () => {
  const adminFunction = readSource("supabase/functions/ai-install-portal-admin/index.ts");
  const disabledEmailFunction = readSource("supabase/functions/ai-install-request-link/index.ts");
  const client = readSource("src/lib/aiInstallPortal.ts");
  const adminPage = readSource("src/pages/AIInstallPortalAdmin.tsx");

  assert.match(adminFunction, /action === "issue_activation_code"/);
  assert.match(adminFunction, /auth\.admin\.updateUserById\([\s\S]*?password: activationCode/);
  assert.match(client, /issueAiInstallPortalActivationCode[\s\S]*?action: "issue_activation_code"/);
  assert.match(adminPage, /title="Issue one-time activation code"/);
  assert.match(adminPage, /> Copy code/);
  assert.doesNotMatch(adminFunction, /sendPortalMagicLink|generateLink\(/);
  assert.match(disabledEmailFunction, /EMAIL_ACCESS_DISABLED_RESPONSE[\s\S]*?410/);
  assert.doesNotMatch(disabledEmailFunction, /sendPortalMagicLink|generateLink\(|RESEND_API_KEY/);
});

test("admin Reset control invokes the protected activity reset action", () => {
  const client = readSource("src/lib/aiInstallPortal.ts");
  const adminPage = readSource("src/pages/AIInstallPortalAdmin.tsx");

  assert.match(client, /resetAiInstallPortalActivity[\s\S]*?action: "reset_activity"/);
  assert.match(adminPage, /window\.confirm\([\s\S]*?resetAiInstallPortalActivity\(row\.id\)/);
  assert.match(adminPage, /session\$\{row\.login_count === 1 \? "" : "s"\}/);
});
