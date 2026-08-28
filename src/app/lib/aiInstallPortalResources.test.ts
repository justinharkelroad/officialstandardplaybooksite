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
