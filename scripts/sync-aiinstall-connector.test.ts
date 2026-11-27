import test from "node:test";
import assert from "node:assert/strict";
import { mkdtempSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

import { buildPlugins } from "./build-aiinstall-v2-plugins.ts";
import { type ConnectorContent, diffConnectorContent, fingerprintOf } from "./sync-aiinstall-connector.ts";

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");

async function builtContent(): Promise<ConnectorContent> {
  const out = join(mkdtempSync(join(tmpdir(), "aii-sync-")), "dist");
  buildPlugins(join(repoRoot, "resources", "aiinstall"), out);
  const file = join(out, "connector", "aiInstallContent.generated.ts");
  const mod = await import(pathToFileURL(file).href);
  return { ...mod } as ConnectorContent;
}

const clone = (content: ConnectorContent): ConnectorContent => JSON.parse(JSON.stringify(content));

test("the generated file carries a fingerprint that matches its own content", async () => {
  const content = await builtContent();
  assert.match(content.AI_INSTALL_CONTENT_FINGERPRINT ?? "", /^[0-9a-f]{64}$/);
  assert.equal(content.AI_INSTALL_CONTENT_FINGERPRINT, fingerprintOf(content));
});

test("an identical copy is reported as matching", async () => {
  const content = await builtContent();
  assert.deepEqual(diffConnectorContent(content, clone(content)), { same: true, differences: [] });
});

test("a changed step is named", async () => {
  const content = await builtContent();
  const copy = clone(content);
  (copy.AI_INSTALL_STEPS[3] as { body?: string }).body = "edited by hand";
  const diff = diffConnectorContent(content, copy);
  assert.equal(diff.same, false);
  assert.deepEqual(diff.differences, [`Step ${content.AI_INSTALL_STEPS[3].name} differs.`]);
});

test("a missing step, an extra step, and changed rules are each reported", async () => {
  const content = await builtContent();
  const copy = clone(content);
  const removed = copy.AI_INSTALL_STEPS.pop()!;
  copy.AI_INSTALL_STEPS.push({ name: "old-step" });
  copy.AI_INSTALL_RULES += " extra";
  const diff = diffConnectorContent(content, copy);
  assert.ok(diff.differences.includes("The operating rules differ."));
  assert.ok(diff.differences.includes(`Step ${removed.name} is missing from AgencyBrain.`));
  assert.ok(diff.differences.includes("Step old-step is in AgencyBrain but no longer exists here."));
});

test("a copy with no fingerprint, or a stale one, does not pass as matching", async () => {
  const content = await builtContent();
  const none = clone(content);
  delete none.AI_INSTALL_CONTENT_FINGERPRINT;
  assert.deepEqual(diffConnectorContent(content, none).differences, ["AgencyBrain's copy has no fingerprint yet."]);

  const stale = clone(content);
  stale.AI_INSTALL_CONTENT_FINGERPRINT = "0".repeat(64);
  assert.deepEqual(diffConnectorContent(content, stale).differences, [
    "AgencyBrain's fingerprint does not match its content.",
  ]);
});

test("steps in a different order are reported", async () => {
  const content = await builtContent();
  const copy = clone(content);
  copy.AI_INSTALL_STEPS.reverse();
  assert.deepEqual(diffConnectorContent(content, copy).differences, ["The steps are in a different order."]);
});
