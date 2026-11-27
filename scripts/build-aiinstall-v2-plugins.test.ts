import test from "node:test";
import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, mkdtempSync, readFileSync, readdirSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { buildPlugins, parseFrontmatter, substituteTokens } from "./build-aiinstall-v2-plugins.ts";

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");

const RULES = `## Operating rules

Connect the folder in {{APP_NAME}}.

1. Nothing sends to staff, clients, or prospects without the owner's sign-off.
2. Never invent numbers. Real data only.
3. Never touch pricing, commission, or comp.
4. Never confirm coverage, quote a rate, or bind anything in a draft.

## Receipt

\`\`\`
AII-R1|<command name>|<PASS or FAIL>|<files>|<date>
\`\`\`
`;

interface FixtureOptions {
  phaseBody?: string;
  rules?: string;
  phaseFrontmatter?: Record<string, string | undefined>;
  extraPhases?: Record<string, string>;
  claudeStarter?: string;
  codexStarter?: string;
}

const tempDirs: string[] = [];

function tmp(prefix: string): string {
  const dir = mkdtempSync(join(tmpdir(), prefix));
  tempDirs.push(dir);
  return dir;
}

test.after(() => {
  for (const dir of tempDirs) rmSync(dir, { recursive: true, force: true });
});

function phaseFile(fm: Record<string, string | undefined>, body: string): string {
  const lines = Object.entries(fm)
    .filter(([, v]) => v !== undefined)
    .map(([k, v]) => `${k}: ${v}`);
  return `---\n${lines.join("\n")}\n---\n\n${body}\n`;
}

function makeFixture(opts: FixtureOptions = {}): { src: string; out: string } {
  const src = tmp("aii-src-");
  const out = join(tmp("aii-out-"), "dist");
  const write = (rel: string, content: string): void => {
    const file = join(src, rel);
    mkdirSync(dirname(file), { recursive: true });
    writeFileSync(file, content);
  };
  write(
    "v2/phases/alpha-step.md",
    phaseFile(
      {
        name: "alpha-step",
        title: "Alpha step",
        description: "Run alpha. Use when the owner says: go alpha, or start: now.",
        stage: "prework",
        creates: "ALPHA.txt",
        ...opts.phaseFrontmatter,
      },
      opts.phaseBody ?? "# Alpha\n\nRead `{{MASTER_FILE}}` and `{{STARTER_FILE}}` in {{APP_NAME}}. Skills live in `{{SKILLS_DIR}}` for {{PLATFORM}}.",
    ),
  );
  write(
    "v2/phases/beta-step.md",
    phaseFile(
      { name: "beta-step", title: "Beta step", description: "Run beta.", stage: "build", creates: "BETA.md" },
      "# Beta\n\nDo beta.",
    ),
  );
  for (const [file, content] of Object.entries(opts.extraPhases ?? {})) write(`v2/phases/${file}`, content);
  write("v2/shared/operating-rules.md", opts.rules ?? RULES);
  write("v2/report-skills/INSTALL-STANDARD-SKILLS.md", "Works with Claude and Codex, CLAUDE.md or AGENTS.md.\n");
  write("v2/report-skills/STANDARD-SKILLS/manifest.json", '{"skills":[]}\n');
  write("v2/report-skills/STANDARD-SKILLS/__pycache__/x.pyc", "junk");
  write("v2/report-skills/.DS_Store", "junk");
  write("starter-pack/common/memory/glossary.md", "# Glossary\n");
  write("starter-pack/common/working-preferences-STARTER.md", "# Preferences\n");
  write("starter-pack/claude/CLAUDE-STARTER.md", opts.claudeStarter ?? "# Claude starter\n");
  write("starter-pack/claude/README-START-HERE.md", "v1 readme\n");
  write("starter-pack/codex/AGENTS-STARTER.md", opts.codexStarter ?? "# Codex-free starter\n");
  write("starter-pack/codex/README-START-HERE.md", "v1 readme\n");
  return { src, out };
}

function unzipList(zip: string): string[] {
  return execFileSync("unzip", ["-Z1", zip], { encoding: "utf8" }).split("\n").filter(Boolean);
}

function buildRejects(opts: FixtureOptions, pattern: RegExp): void {
  const { src, out } = makeFixture(opts);
  assert.throws(() => buildPlugins(src, out), pattern);
}

test("fixture builds both platforms with manifests in the right place", () => {
  const { src, out } = makeFixture();
  const result = buildPlugins(src, out);
  assert.deepEqual(result.commands, ["alpha-step", "beta-step"]);

  const claude = join(out, "claude", "ai-install");
  const manifest = JSON.parse(readFileSync(join(claude, ".claude-plugin", "plugin.json"), "utf8"));
  assert.equal(manifest.name, "ai-install");
  assert.equal(manifest.displayName, "AI Install");
  assert.equal(manifest.version, "2.0.0");
  assert.equal(manifest.license, "UNLICENSED");
  assert.deepEqual(manifest.author, { name: "Standard Playbook", url: "https://standardplaybook.com" });
  assert.deepEqual(readdirSync(join(claude, ".claude-plugin")), ["plugin.json"]);
  assert.ok(existsSync(join(claude, "commands", "alpha-step.md")));
  assert.ok(existsSync(join(claude, "commands", "beta-step.md")));
  assert.ok(!existsSync(join(claude, "bin")));
  assert.ok(!existsSync(join(claude, "plugin.json")));

  const codex = join(out, "codex", "ai-install");
  const codexManifest = JSON.parse(readFileSync(join(codex, "plugin.json"), "utf8"));
  assert.equal(codexManifest.$schema, "https://agent-plugins.org/schemas/1.0.0/plugin.schema.json");
  assert.equal(codexManifest.name, "ai-install");
  assert.equal(codexManifest.version, "2.0.0");
  assert.ok(Array.isArray(codexManifest.keywords));
  assert.ok(existsSync(join(codex, "skills", "alpha-step", "SKILL.md")));
  assert.ok(!existsSync(join(codex, ".claude-plugin")));
  assert.ok(!existsSync(join(codex, "commands")));

  const skill = readFileSync(join(codex, "skills", "alpha-step", "SKILL.md"), "utf8");
  assert.match(skill, /^---\nname: alpha-step\ndescription: /);
  const command = readFileSync(join(claude, "commands", "alpha-step.md"), "utf8");
  assert.match(command, /^---\ndescription: .*\n---\n/);
  assert.doesNotMatch(command, /^name:/m);

  for (const platform of ["claude", "codex"]) {
    const readme = readFileSync(join(out, platform, "ai-install", "README.md"), "utf8");
    assert.ok(readme.split(/\s+/).filter(Boolean).length >= 40);
    assert.ok(readme.includes("Alpha step") && readme.includes("Beta step"));
  }
  assert.ok(readFileSync(join(claude, "README.md"), "utf8").includes("/ai-install:alpha-step"));
  assert.ok(readFileSync(join(codex, "README.md"), "utf8").includes("$alpha-step"));

  // Operating rules are appended under a horizontal rule, with tokens resolved.
  assert.match(command, /\n---\n\n## Operating rules/);
  assert.ok(command.includes("Connect the folder in Cowork."));

  // Starters: platform file present, other absent, v1 README excluded.
  const cs = join(out, "claude", "starter");
  const xs = join(out, "codex", "starter");
  assert.ok(existsSync(join(cs, "CLAUDE-STARTER.md")) && !existsSync(join(cs, "AGENTS-STARTER.md")));
  assert.ok(existsSync(join(xs, "AGENTS-STARTER.md")) && !existsSync(join(xs, "CLAUDE-STARTER.md")));
  assert.ok(existsSync(join(cs, "memory", "glossary.md")) && existsSync(join(xs, "working-preferences-STARTER.md")));
  assert.ok(!existsSync(join(cs, "README-START-HERE.md")) && !existsSync(join(xs, "README-START-HERE.md")));

  // Report skills copied verbatim (including text naming both platforms), junk skipped.
  for (const platform of ["claude", "codex"]) {
    const rs = join(out, platform, "report-skills");
    assert.equal(
      readFileSync(join(rs, "INSTALL-STANDARD-SKILLS.md"), "utf8"),
      "Works with Claude and Codex, CLAUDE.md or AGENTS.md.\n",
    );
    assert.ok(!existsSync(join(rs, ".DS_Store")));
    assert.ok(!existsSync(join(rs, "STANDARD-SKILLS", "__pycache__")));
  }

  for (const z of [
    "ai-install-claude-plugin.zip",
    "ai-install-codex-plugin.zip",
    "ai-install-claude-starter.zip",
    "ai-install-codex-starter.zip",
    "ai-install-claude-report-skills.zip",
    "ai-install-codex-report-skills.zip",
  ]) {
    assert.ok(existsSync(join(out, z)), `${z} missing`);
  }
});

test("build wipes the output directory first", () => {
  const { src, out } = makeFixture();
  mkdirSync(out, { recursive: true });
  writeFileSync(join(out, "stale.txt"), "old");
  buildPlugins(src, out);
  assert.ok(!existsSync(join(out, "stale.txt")));
});

test("zip layouts: plugin zips have one ai-install/ folder, starter zips are rooted", () => {
  const { src, out } = makeFixture();
  buildPlugins(src, out);

  const claudeZip = unzipList(join(out, "ai-install-claude-plugin.zip"));
  assert.ok(claudeZip.includes("ai-install/.claude-plugin/plugin.json"));
  assert.ok(claudeZip.every((e) => e.startsWith("ai-install/")));

  const codexZip = unzipList(join(out, "ai-install-codex-plugin.zip"));
  assert.ok(codexZip.includes("ai-install/plugin.json"));
  assert.ok(codexZip.every((e) => e.startsWith("ai-install/")));

  assert.ok(unzipList(join(out, "ai-install-claude-starter.zip")).includes("CLAUDE-STARTER.md"));
  assert.ok(unzipList(join(out, "ai-install-codex-starter.zip")).includes("AGENTS-STARTER.md"));
  assert.ok(unzipList(join(out, "ai-install-claude-report-skills.zip")).includes("INSTALL-STANDARD-SKILLS.md"));
});

test("token substitution yields CLAUDE.md for Claude and AGENTS.md for Codex from the same source line", () => {
  const { src, out } = makeFixture();
  buildPlugins(src, out);
  const claude = readFileSync(join(out, "claude", "ai-install", "commands", "alpha-step.md"), "utf8");
  const codex = readFileSync(join(out, "codex", "ai-install", "skills", "alpha-step", "SKILL.md"), "utf8");
  assert.ok(claude.includes("Read `CLAUDE.md` and `CLAUDE-STARTER.md` in Cowork. Skills live in `.claude/skills` for claude."));
  assert.ok(codex.includes("Read `AGENTS.md` and `AGENTS-STARTER.md` in Codex. Skills live in `.agents/skills` for codex."));
  assert.equal(substituteTokens("{{MASTER_FILE}}", "claude"), "CLAUDE.md");
  assert.equal(substituteTokens("{{MASTER_FILE}}", "codex"), "AGENTS.md");
  assert.equal(substituteTokens("{{NOPE}}", "codex"), "{{NOPE}}");
});

test("frontmatter parsing keeps colons after the first one and strips quotes", () => {
  const { data, body } = parseFrontmatter(
    '---\nname: x\ndescription: Run it. Use when the owner says: go, or time: 5pm. See https://a.b/c\ncreates: "A.md, memory/, b/c.md"\n---\n\n# Body\n',
  );
  assert.equal(data.description, "Run it. Use when the owner says: go, or time: 5pm. See https://a.b/c");
  assert.equal(data.creates, "A.md, memory/, b/c.md");
  assert.equal(body.trim(), "# Body");
  assert.throws(() => parseFrontmatter("# no frontmatter"), /frontmatter/);
});

test("description with colons survives into built output as parseable frontmatter", () => {
  const { src, out } = makeFixture();
  buildPlugins(src, out);
  const built = readFileSync(join(out, "claude", "ai-install", "commands", "alpha-step.md"), "utf8");
  const { data } = parseFrontmatter(built);
  assert.equal(data.description, "Run alpha. Use when the owner says: go alpha, or start: now.");
});

test("guard 1: Claude build rejects AGENTS.md in a phase body", () => {
  buildRejects({ phaseBody: "Open AGENTS.md." }, /guard 1[\s\S]*"AGENTS\.md"/);
});

test("guard 1: Codex build rejects Cowork in a phase body", () => {
  buildRejects({ phaseBody: "Open Cowork." }, /guard 1[\s\S]*codex[\s\S]*"Cowork"/);
});

test("a build that fails on the second platform leaves no zip behind for the first", () => {
  // "Cowork" is legal in the Claude output and only trips the Codex guard.
  const { src, out } = makeFixture({ phaseBody: "Open Cowork." });
  assert.throws(() => buildPlugins(src, out), /guard 1/);
  const zips = existsSync(out) ? readdirSync(out).filter((name) => name.endsWith(".zip")) : [];
  assert.deepEqual(zips, []);
});

test("connector module: ordered steps, tokens left in place, no receipt, starter files per platform", async () => {
  const out = tmp("aii-connector-");
  buildPlugins(join(repoRoot, "resources", "aiinstall"), out);
  const file = join(out, "connector", "aiInstallContent.generated.ts");
  const mod = await import(file);
  const names = mod.AI_INSTALL_STEPS.map((step: { name: string }) => step.name);
  assert.equal(names[0], "ready");
  assert.equal(names[1], "phase-1-about-me");
  assert.ok(names.indexOf("check-day-1") < names.indexOf("phase-6-project"));
  assert.ok(names.indexOf("cold-test") < names.indexOf("brief-setup"));
  assert.ok(names.indexOf("upkeep-setup") < names.indexOf("check-day-2"));
  assert.ok(names.indexOf("check-day-2") < names.indexOf("apply-updates"));
  assert.equal(names.at(-1), "team-pack");
  const memory = mod.AI_INSTALL_STEPS.find((step: { name: string }) => step.name === "memory");
  assert.match(memory.body, /\{\{MASTER_FILE\}\}/);
  assert.doesNotMatch(memory.body, /CLAUDE\.md|AGENTS\.md/);
  assert.doesNotMatch(mod.AI_INSTALL_RULES, /AII-R1\|/);
  assert.match(mod.AI_INSTALL_RULES, /Never invent numbers/);
  assert.equal(mod.AI_INSTALL_TOKENS.claude.MASTER_FILE, "CLAUDE.md");
  assert.equal(mod.AI_INSTALL_TOKENS.codex.MASTER_FILE, "AGENTS.md");
  assert.deepEqual(Object.keys(mod.AI_INSTALL_STARTER_FILES.claude), ["CLAUDE-STARTER.md"]);
  assert.deepEqual(Object.keys(mod.AI_INSTALL_STARTER_FILES.codex), ["AGENTS-STARTER.md"]);
  assert.ok(mod.AI_INSTALL_STARTER_FILES.common["memory/glossary.md"].includes("PIF"));
  assert.ok(!("README-START-HERE.md" in mod.AI_INSTALL_STARTER_FILES.claude));
});

test("guard 1: Claude build rejects Codex and .agents/skills", () => {
  buildRejects({ phaseBody: "Use Codex." }, /guard 1[\s\S]*claude[\s\S]*"Codex"/);
  buildRejects({ phaseBody: "See .agents/skills." }, /guard 1[\s\S]*"\.agents\/skills"/);
});

test("guard 1: Codex build rejects CLAUDE.md and .claude/skills", () => {
  buildRejects({ phaseBody: "Open CLAUDE.md." }, /guard 1[\s\S]*codex[\s\S]*"CLAUDE\.md"/);
  buildRejects({ phaseBody: "See .claude/skills." }, /guard 1[\s\S]*"\.claude\/skills"/);
});

test("guard 1: starters must hold their own starter file and not the other's name", () => {
  buildRejects({ claudeStarter: "mentions AGENTS-STARTER.md\n" }, /guard 1[\s\S]*claude[\s\S]*AGENTS-STARTER\.md/);
  buildRejects({ codexStarter: "mentions CLAUDE-STARTER.md\n" }, /guard 1[\s\S]*codex[\s\S]*CLAUDE-STARTER\.md/);
});

test("guard 2: unresolved {{token}} fails", () => {
  buildRejects({ phaseBody: "Hello {{UNKNOWN_THING}}." }, /guard 2[\s\S]*\{\{UNKNOWN_THING\}\}/);
});

test("guard 3: missing frontmatter key, bad name, mismatched name", () => {
  buildRejects({ phaseFrontmatter: { creates: undefined } }, /guard 3[\s\S]*missing required frontmatter "creates"/);
  buildRejects({ phaseFrontmatter: { description: "" } }, /guard 3[\s\S]*"description"/);
  buildRejects({ phaseFrontmatter: { name: "Alpha_Step" } }, /guard 3[\s\S]*not lowercase-kebab-case/);
  buildRejects({ phaseFrontmatter: { name: "gamma" } }, /guard 3[\s\S]*does not equal file basename/);
});

test("guard 3: duplicate names", () => {
  // The name must equal the basename, so a duplicate surfaces as a name mismatch and a duplicate.
  buildRejects(
    {
      extraPhases: {
        "dup.md": phaseFile(
          { name: "alpha-step", title: "Dup", description: "Dup.", stage: "x", creates: "y" },
          "Body.",
        ),
      },
    },
    /guard 3[\s\S]*duplicate name "alpha-step"/,
  );
});

test("guard 4: each safety rule is required", () => {
  for (const phrase of [
    "Nothing sends",
    "Never invent numbers",
    "Never touch pricing, commission, or comp",
    "Never confirm coverage, quote a rate, or bind anything",
  ]) {
    buildRejects({ rules: RULES.replace(phrase, "Redacted rule") }, new RegExp(`guard 4[\\s\\S]*${phrase}`));
  }
});

test("guard 5: em dash fails", () => {
  buildRejects({ phaseBody: "Alpha — beta." }, /guard 5[\s\S]*em dash/);
});

test("guard 5: em dash inside report-skills is exempt", () => {
  const { src, out } = makeFixture();
  writeFileSync(join(src, "v2/report-skills/INSTALL-STANDARD-SKILLS.md"), "ok — fine\n");
  assert.doesNotThrow(() => buildPlugins(src, out));
});

test("guard 6: receipt marker required", () => {
  buildRejects({ rules: RULES.replace("AII-R1|", "RECEIPT:") }, /guard 6[\s\S]*AII-R1\|/);
});

test("real resources tree builds into a temp dir with one command per phase file", () => {
  const sourceRoot = join(repoRoot, "resources", "aiinstall");
  const phasesDir = join(sourceRoot, "v2", "phases");
  const expected = readdirSync(phasesDir)
    .filter((f) => f.endsWith(".md"))
    .map((f) => f.replace(/\.md$/, ""))
    .sort();
  assert.ok(expected.length > 0);

  const out = join(tmp("aii-real-"), "dist");
  const result = buildPlugins(sourceRoot, out);
  assert.deepEqual([...result.commands].sort(), expected);

  const commandsDir = join(out, "claude", "ai-install", "commands");
  const skillsDir = join(out, "codex", "ai-install", "skills");
  assert.deepEqual(readdirSync(commandsDir).map((f) => f.replace(/\.md$/, "")).sort(), expected);
  assert.deepEqual(readdirSync(skillsDir).sort(), expected);
  for (const name of expected) assert.ok(existsSync(join(skillsDir, name, "SKILL.md")));
});
