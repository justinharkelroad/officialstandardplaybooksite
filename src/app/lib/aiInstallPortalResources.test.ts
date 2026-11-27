import assert from "node:assert/strict";
import test from "node:test";

import { getAiInstallPortalResourcePlan } from "../../lib/aiInstallPortalResources";

test("puts the assigned platform pack first with its matching pre-work checklist", () => {
  const codex = getAiInstallPortalResourcePlan("codex");
  const claude = getAiInstallPortalResourcePlan("claude");

  assert.deepEqual(codex.prework.map((resource) => resource.id), ["codex-prework"]);
  assert.equal(codex.prework[0].checklistHref, "/aiinstall/prework/codex");
  assert.match(codex.prework[0].detail, /AGENTS-STARTER\.md/);
  assert.deepEqual(claude.prework.map((resource) => resource.id), ["claude-prework"]);
  assert.equal(claude.prework[0].checklistHref, "/aiinstall/prework/claude");
  assert.match(claude.prework[0].detail, /CLAUDE-STARTER\.md/);
});

test("keeps Day 1 guides beside Day 1 and platform skills beside Day 2", () => {
  const codex = getAiInstallPortalResourcePlan("codex");
  const claude = getAiInstallPortalResourcePlan("claude");

  assert.deepEqual(codex.dayOne.map((resource) => resource.id), ["day-1-guide", "skills-guide"]);
  assert.deepEqual(codex.dayTwo.map((resource) => resource.id), ["day-2-guide", "codex-skills"]);
  assert.deepEqual(claude.dayTwo.map((resource) => resource.id), ["day-2-guide", "claude-skills"]);
});

test("both-platform access receives two distinct start packs and two Day 2 libraries", () => {
  const both = getAiInstallPortalResourcePlan("both");

  assert.deepEqual(both.prework.map((resource) => resource.id), ["claude-prework", "codex-prework"]);
  assert.deepEqual(both.dayTwo.map((resource) => resource.id), ["day-2-guide", "claude-skills", "codex-skills"]);
  assert.equal(both.resourceCount, 7);
});

test("the first cohort's portal is unchanged while the v2 portal is off", () => {
  const both = getAiInstallPortalResourcePlan("both", { showV2: false });

  assert.deepEqual(both.plugin, []);
  assert.equal(both.resourceCount, 7);
});

test("the v2 portal adds only the plugin for the member's own platform", () => {
  const claude = getAiInstallPortalResourcePlan("claude", { showV2: true });
  const codex = getAiInstallPortalResourcePlan("codex", { showV2: true });
  const both = getAiInstallPortalResourcePlan("both", { showV2: true });

  assert.deepEqual(claude.plugin.map((resource) => resource.id), ["claude-plugin"]);
  assert.deepEqual(codex.plugin.map((resource) => resource.id), ["codex-plugin"]);
  assert.deepEqual(both.plugin.map((resource) => resource.id), ["claude-plugin", "codex-plugin"]);
  assert.equal(claude.resourceCount, 6);
  assert.equal(both.resourceCount, 9);
  assert.match(claude.plugin[0].detail, /cannot connect AgencyBrain/);
  assert.doesNotMatch(JSON.stringify(codex), /claude-plugin|CLAUDE-STARTER/);
  assert.doesNotMatch(JSON.stringify(claude), /codex-plugin|AGENTS-STARTER/);
});
