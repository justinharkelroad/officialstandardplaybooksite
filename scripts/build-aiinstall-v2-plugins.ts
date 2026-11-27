/**
 * Builds the AI Install v2 plugin packages from one content source.
 *
 *   bun scripts/build-aiinstall-v2-plugins.ts
 *
 * Source (sourceRoot, default resources/aiinstall):
 *   v2/phases/*.md            one file per command
 *   v2/shared/operating-rules.md
 *   v2/report-skills/**       copied verbatim
 *   starter-pack/{common,claude,codex}
 *
 * Output (outDir, default dist-aiinstall-v2): a Claude (Cowork) plugin and an
 * OpenAI Codex plugin, workspace starter folders, report skills, and zips.
 */
import {
  cpSync,
  existsSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  rmSync,
  statSync,
  writeFileSync,
} from "node:fs";
import { execFileSync } from "node:child_process";
import { basename, dirname, join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";

export const VERSION = "2.0.0";

export type Platform = "claude" | "codex";
export const PLATFORMS: readonly Platform[] = ["claude", "codex"];

export const REQUIRED_FRONTMATTER = ["name", "title", "description", "stage", "creates"] as const;

export const TOKENS: Record<Platform, Record<string, string>> = {
  claude: {
    APP_NAME: "Cowork",
    MASTER_FILE: "CLAUDE.md",
    STARTER_FILE: "CLAUDE-STARTER.md",
    SKILLS_DIR: ".claude/skills",
    PLATFORM: "claude",
  },
  codex: {
    APP_NAME: "Codex",
    MASTER_FILE: "AGENTS.md",
    STARTER_FILE: "AGENTS-STARTER.md",
    SKILLS_DIR: ".agents/skills",
    PLATFORM: "codex",
  },
};

export const FORBIDDEN_STRINGS: Record<Platform, readonly string[]> = {
  claude: ["AGENTS.md", "AGENTS-STARTER.md", ".agents/skills", "Codex"],
  codex: ["CLAUDE.md", "CLAUDE-STARTER.md", ".claude/skills", "Cowork"],
};

export const SAFETY_PHRASES = [
  "Nothing sends",
  "Never invent numbers",
  "Never touch pricing, commission, or comp",
  "Never confirm coverage, quote a rate, or bind anything",
] as const;

export const RECEIPT_MARKER = "AII-R1|";
export const EM_DASH = "—";

const PLUGIN_DESCRIPTION =
  "Guided commands that help an insurance agency owner build an AI co-working brain, one phase at a time.";
const PLUGIN_AUTHOR = { name: "Standard Playbook", url: "https://standardplaybook.com" };
const KEBAB = /^[a-z0-9]+(-[a-z0-9]+)*$/;

export interface Phase {
  name: string;
  title: string;
  description: string;
  stage: string;
  creates: string;
  /** Run order for the connector listing; phases without one sort last. */
  order: number;
  body: string;
  file: string;
}

export interface BuildResult {
  commands: string[];
  outDir: string;
}

export class BuildError extends Error {
  readonly guard: number | string;
  constructor(guard: number | string, message: string) {
    super(`[guard ${guard}] ${message}`);
    this.name = "BuildError";
    this.guard = guard;
  }
}

// ---------------------------------------------------------------------------
// Parsing and substitution (pure)
// ---------------------------------------------------------------------------

function unquote(value: string): string {
  const v = value.trim();
  if (v.length >= 2 && v.startsWith('"') && v.endsWith('"')) {
    try {
      const parsed: unknown = JSON.parse(v);
      if (typeof parsed === "string") return parsed;
    } catch {
      // not valid JSON string escapes: fall through to a plain slice
    }
    return v.slice(1, -1);
  }
  if (v.length >= 2 && v.startsWith("'") && v.endsWith("'")) {
    return v.slice(1, -1).replace(/''/g, "'");
  }
  return v;
}

/** Parses `---` delimited frontmatter made of flat `key: value` lines. */
export function parseFrontmatter(text: string): { data: Record<string, string>; body: string } {
  const normalized = text.replace(/\r\n/g, "\n");
  const match = /^---\n([\s\S]*?)\n---[ \t]*(?:\n|$)/.exec(normalized);
  if (!match) throw new Error("missing frontmatter block (expected leading --- ... ---)");
  const data: Record<string, string> = {};
  for (const [i, line] of match[1].split("\n").entries()) {
    if (line.trim() === "" || line.trim().startsWith("#")) continue;
    const idx = line.indexOf(":");
    if (idx <= 0) throw new Error(`frontmatter line ${i + 1} is not "key: value": ${line}`);
    const key = line.slice(0, idx).trim();
    if (!/^[A-Za-z0-9_-]+$/.test(key)) throw new Error(`frontmatter line ${i + 1} has invalid key "${key}"`);
    data[key] = unquote(line.slice(idx + 1));
  }
  return { data, body: normalized.slice(match[0].length) };
}

/** Replaces known {{TOKEN}} values for a platform. Unknown tokens are left for the guard. */
export function substituteTokens(text: string, platform: Platform): string {
  const map = TOKENS[platform];
  return text.replace(/\{\{([A-Z_]+)\}\}/g, (whole, key: string) =>
    Object.prototype.hasOwnProperty.call(map, key) ? map[key] : whole,
  );
}

function yamlScalar(value: string): string {
  const needsQuote = /: | #|^[\s\-?:,\[\]{}#&*!|>'"%@`]|\s$/.test(value) || value.includes("\n");
  return needsQuote ? JSON.stringify(value) : value;
}

// ---------------------------------------------------------------------------
// Filesystem helpers
// ---------------------------------------------------------------------------

const SKIP_NAMES = new Set([".DS_Store", "__pycache__"]);

function listFiles(dir: string): string[] {
  const out: string[] = [];
  const walk = (d: string): void => {
    for (const entry of readdirSync(d, { withFileTypes: true })) {
      if (SKIP_NAMES.has(entry.name)) continue;
      const full = join(d, entry.name);
      if (entry.isDirectory()) walk(full);
      else if (entry.isFile()) out.push(full);
    }
  };
  walk(dir);
  return out.sort();
}

function copyTree(from: string, to: string): void {
  if (!existsSync(from) || !statSync(from).isDirectory()) {
    throw new BuildError("input", `missing source directory: ${from}`);
  }
  mkdirSync(to, { recursive: true });
  cpSync(from, to, {
    recursive: true,
    filter: (src) => !SKIP_NAMES.has(basename(src)),
  });
}

function readTextFileIfText(file: string): string | null {
  const buf = readFileSync(file);
  if (buf.includes(0)) return null;
  return buf.toString("utf8");
}

function writeText(file: string, content: string): void {
  mkdirSync(dirname(file), { recursive: true });
  writeFileSync(file, content, "utf8");
}

// ---------------------------------------------------------------------------
// Phase loading and guard 3
// ---------------------------------------------------------------------------

export function loadPhases(phasesDir: string): Phase[] {
  if (!existsSync(phasesDir)) throw new BuildError("input", `missing phases directory: ${phasesDir}`);
  const files = readdirSync(phasesDir)
    .filter((f) => f.endsWith(".md"))
    .sort();
  if (files.length === 0) throw new BuildError("input", `no phase files found in ${phasesDir}`);

  const phases: Phase[] = [];
  const problems: string[] = [];
  const seen = new Map<string, string>();

  for (const file of files) {
    const base = file.replace(/\.md$/, "");
    let parsed: { data: Record<string, string>; body: string };
    try {
      parsed = parseFrontmatter(readFileSync(join(phasesDir, file), "utf8"));
    } catch (err) {
      problems.push(`${file}: ${(err as Error).message}`);
      continue;
    }
    const { data, body } = parsed;
    for (const key of REQUIRED_FRONTMATTER) {
      if (!data[key] || data[key].trim() === "") problems.push(`${file}: missing required frontmatter "${key}"`);
    }
    if (data.name) {
      if (!KEBAB.test(data.name)) problems.push(`${file}: name "${data.name}" is not lowercase-kebab-case`);
      if (data.name !== base) problems.push(`${file}: name "${data.name}" does not equal file basename "${base}"`);
      const prior = seen.get(data.name);
      if (prior) problems.push(`${file}: duplicate name "${data.name}" (also in ${prior})`);
      else seen.set(data.name, file);
    }
    phases.push({
      name: data.name ?? base,
      title: data.title ?? "",
      description: data.description ?? "",
      stage: data.stage ?? "",
      creates: data.creates ?? "",
      order: Number.isFinite(Number(data.order)) && data.order !== undefined && data.order.trim() !== "" ? Number(data.order) : 999,
      body,
      file,
    });
  }

  if (problems.length > 0) {
    throw new BuildError(3, `invalid phase frontmatter:\n  - ${problems.join("\n  - ")}`);
  }
  return phases;
}

// ---------------------------------------------------------------------------
// Guards on built output (pure, return violation lists)
// ---------------------------------------------------------------------------

function textFilesUnder(dir: string): { file: string; text: string }[] {
  const out: { file: string; text: string }[] = [];
  for (const file of listFiles(dir)) {
    const text = readTextFileIfText(file);
    if (text !== null) out.push({ file, text });
  }
  return out;
}

/** Guard 1: platform separation. `roots` are the built plugin and starter dirs for the platform. */
export function checkPlatformSeparation(platform: Platform, roots: string[]): string[] {
  const violations: string[] = [];
  for (const root of roots) {
    for (const { file, text } of textFilesUnder(root)) {
      for (const bad of FORBIDDEN_STRINGS[platform]) {
        if (text.includes(bad)) {
          violations.push(`${platform} output contains "${bad}" in ${file}`);
        }
      }
    }
  }
  return violations;
}

/** Guard 1 (starter half): each starter holds its own starter file and not the other's. */
export function checkStarterFiles(platform: Platform, starterDir: string): string[] {
  const own = TOKENS[platform].STARTER_FILE;
  const other = TOKENS[platform === "claude" ? "codex" : "claude"].STARTER_FILE;
  const violations: string[] = [];
  if (!existsSync(join(starterDir, own))) violations.push(`${platform} starter is missing ${own}`);
  if (existsSync(join(starterDir, other))) violations.push(`${platform} starter must not contain ${other}`);
  return violations;
}

/** Guard 2: any unresolved {{token}} in built plugin or starter text. */
export function checkUnresolvedTokens(roots: string[]): string[] {
  const violations: string[] = [];
  for (const root of roots) {
    for (const { file, text } of textFilesUnder(root)) {
      const found = text.match(/\{\{[^}\n]*\}\}/g);
      if (found) violations.push(`unresolved token ${[...new Set(found)].join(", ")} in ${file}`);
    }
  }
  return violations;
}

/** Guards 4 and 6: safety phrases and receipt marker in each built command/skill file. */
export function checkCommandFiles(commandFiles: string[]): { safety: string[]; receipt: string[] } {
  const safety: string[] = [];
  const receipt: string[] = [];
  for (const file of commandFiles) {
    const text = readFileSync(file, "utf8");
    for (const phrase of SAFETY_PHRASES) {
      if (!text.includes(phrase)) safety.push(`${file} is missing safety rule "${phrase}"`);
    }
    if (!text.includes(RECEIPT_MARKER)) receipt.push(`${file} is missing receipt marker "${RECEIPT_MARKER}"`);
  }
  return { safety, receipt };
}

/** Guard 5: no em dash in built plugin or starter text. */
export function checkNoEmDash(roots: string[]): string[] {
  const violations: string[] = [];
  for (const root of roots) {
    for (const { file, text } of textFilesUnder(root)) {
      if (text.includes(EM_DASH)) violations.push(`em dash (U+2014) in ${file}`);
    }
  }
  return violations;
}

function failIf(guard: number, label: string, violations: string[]): void {
  if (violations.length > 0) {
    throw new BuildError(guard, `${label}:\n  - ${violations.join("\n  - ")}`);
  }
}

/** Runs every guard against a built platform tree. Throws BuildError on the first failing guard. */
export function runGuards(platform: Platform, platformDir: string, commandFiles: string[]): void {
  const roots = [join(platformDir, "ai-install"), join(platformDir, "starter")];
  failIf(2, "unresolved {{token}} in built output", checkUnresolvedTokens(roots));
  failIf(
    1,
    "platform separation violated",
    [...checkPlatformSeparation(platform, roots), ...checkStarterFiles(platform, join(platformDir, "starter"))],
  );
  const { safety, receipt } = checkCommandFiles(commandFiles);
  failIf(4, "safety rules missing from built commands", safety);
  failIf(5, "em dash character found", checkNoEmDash(roots));
  failIf(6, "receipt marker missing from built commands", receipt);
}

// ---------------------------------------------------------------------------
// Rendering
// ---------------------------------------------------------------------------

function renderCommandBody(phase: Phase, rules: string, platform: Platform): string {
  const body = substituteTokens(phase.body, platform).replace(/\s+$/, "");
  const ruleText = substituteTokens(rules, platform).replace(/^\s+|\s+$/g, "");
  return `${body}\n\n---\n\n${ruleText}\n`;
}

function renderReadme(phases: Phase[], platform: Platform): string {
  const invoke = (name: string): string => (platform === "claude" ? `/ai-install:${name}` : `$${name}`);
  const app = TOKENS[platform].APP_NAME;
  const master = TOKENS[platform].MASTER_FILE;
  const lines = phases.map((p) => `- \`${invoke(p.name)}\`: ${p.title}`);
  const how =
    platform === "claude"
      ? `Open ${app}, connect your \`MY BIZ BRAIN\` folder, and type a command in a fresh conversation.`
      : `Open ${app}, connect your \`MY BIZ BRAIN\` folder, and mention a skill by name in a fresh conversation.`;
  return [
    "# AI Install",
    "",
    `AI Install v${VERSION} walks an insurance agency owner through building an AI co-working brain, one phase at a time. Each command does one job, shows its work before saving, and ends with a receipt line you can paste into the AI Install portal. The finished brain centers on \`${master}\` at the root of your \`MY BIZ BRAIN\` folder.`,
    "",
    "## How to use it",
    "",
    how,
    "",
    "## Commands",
    "",
    ...lines,
    "",
    "Run one command at a time. When a command finishes, stop and review what it created before starting the next one.",
    "",
  ].join("\n");
}

// ---------------------------------------------------------------------------
// Connector output
// ---------------------------------------------------------------------------

/** The receipt is for pasting into the portal. The connector records results itself, so it is left out. */
export function stripReceiptSection(rules: string): string {
  const at = rules.indexOf("\n## Receipt");
  return (at === -1 ? rules : rules.slice(0, at)).replace(/\s+$/, "");
}

function starterFilesFor(dir: string, onlyFile?: string): Record<string, string> {
  const files: Record<string, string> = {};
  if (!existsSync(dir)) return files;
  for (const file of listFiles(dir)) {
    const rel = relative(dir, file).split("\\").join("/");
    if (onlyFile && rel !== onlyFile) continue;
    const text = readTextFileIfText(file);
    if (text !== null) files[rel] = text;
  }
  return files;
}

/**
 * One TypeScript module for the AgencyBrain connector, generated from the same
 * phase files as the plugins so the two delivery routes cannot drift. Tokens
 * are left in place: the connector substitutes them for the app in use.
 */
export function renderConnectorModule(phases: Phase[], rules: string, starterSrc: string): string {
  const ordered = [...phases].sort((a, b) => a.order - b.order || a.name.localeCompare(b.name));
  const steps = ordered.map((phase) => ({
    name: phase.name,
    title: phase.title,
    description: phase.description,
    stage: phase.stage,
    creates: phase.creates,
    body: phase.body.replace(/^\s+|\s+$/g, ""),
  }));
  const starter = {
    common: starterFilesFor(join(starterSrc, "common")),
    claude: starterFilesFor(join(starterSrc, "claude"), TOKENS.claude.STARTER_FILE),
    codex: starterFilesFor(join(starterSrc, "codex"), TOKENS.codex.STARTER_FILE),
  };
  const json = (value: unknown) => JSON.stringify(value, null, 2);
  const text = [
    "// GENERATED FILE. Do not edit by hand.",
    "// Source: officialstandardplaybooksite, resources/aiinstall/v2/phases/*.md and shared/operating-rules.md",
    "// Regenerate there with `bun run build:aiinstall-v2`, then copy dist-aiinstall-v2/connector/ here.",
    "",
    `export const AI_INSTALL_CONTENT_VERSION = ${json(VERSION)};`,
    "",
    `export const AI_INSTALL_TOKENS: Record<"claude" | "codex", Record<string, string>> = ${json(TOKENS)};`,
    "",
    `export const AI_INSTALL_RULES: string = ${json(stripReceiptSection(rules))};`,
    "",
    "export type AiInstallStep = { name: string; title: string; description: string; stage: string; creates: string; body: string };",
    "",
    `export const AI_INSTALL_STEPS: AiInstallStep[] = ${json(steps)};`,
    "",
    `export const AI_INSTALL_STARTER_FILES: Record<"common" | "claude" | "codex", Record<string, string>> = ${json(starter)};`,
    "",
  ].join("\n");
  if (text.includes(EM_DASH)) throw new BuildError(5, "em dash found in connector output");
  return text;
}

function writeConnectorModule(phases: Phase[], rules: string, starterSrc: string, file: string): void {
  writeText(file, renderConnectorModule(phases, rules, starterSrc));
}

function zipFolder(cwd: string, folder: string, zipPath: string): void {
  rmSync(zipPath, { force: true });
  try {
    execFileSync("zip", ["-X", "-q", "-r", zipPath, folder], { cwd, stdio: ["ignore", "pipe", "pipe"] });
  } catch (err) {
    throw new BuildError("zip", `zip failed for ${folder}: ${(err as Error).message}`);
  }
}

// ---------------------------------------------------------------------------
// Build
// ---------------------------------------------------------------------------

/**
 * Builds both platform packages into outDir from sourceRoot.
 * sourceRoot must contain v2/{phases,shared,report-skills} and starter-pack/.
 * outDir is wiped first.
 */
export function buildPlugins(sourceRoot: string, outDir: string): BuildResult {
  const src = resolve(sourceRoot);
  const out = resolve(outDir);
  const v2 = join(src, "v2");
  const starterSrc = join(src, "starter-pack");

  const phases = loadPhases(join(v2, "phases"));
  const rulesFile = join(v2, "shared", "operating-rules.md");
  if (!existsSync(rulesFile)) throw new BuildError("input", `missing operating rules: ${rulesFile}`);
  const rules = readFileSync(rulesFile, "utf8");

  rmSync(out, { recursive: true, force: true });
  mkdirSync(out, { recursive: true });

  for (const platform of PLATFORMS) {
    const platformDir = join(out, platform);
    const pluginDir = join(platformDir, "ai-install");
    const starterDir = join(platformDir, "starter");
    const commandFiles: string[] = [];

    if (platform === "claude") {
      writeText(
        join(pluginDir, ".claude-plugin", "plugin.json"),
        `${JSON.stringify(
          {
            name: "ai-install",
            displayName: "AI Install",
            version: VERSION,
            description: PLUGIN_DESCRIPTION,
            author: PLUGIN_AUTHOR,
            license: "UNLICENSED",
          },
          null,
          2,
        )}\n`,
      );
      for (const phase of phases) {
        const file = join(pluginDir, "commands", `${phase.name}.md`);
        const description = substituteTokens(phase.description, platform);
        writeText(file, `---\ndescription: ${yamlScalar(description)}\n---\n\n${renderCommandBody(phase, rules, platform)}`);
        commandFiles.push(file);
      }
    } else {
      writeText(
        join(pluginDir, "plugin.json"),
        `${JSON.stringify(
          {
            $schema: "https://agent-plugins.org/schemas/1.0.0/plugin.schema.json",
            name: "ai-install",
            version: VERSION,
            description: PLUGIN_DESCRIPTION,
            author: PLUGIN_AUTHOR,
            license: "UNLICENSED",
            keywords: ["ai-install", "insurance", "agency", "workshop", "onboarding"],
          },
          null,
          2,
        )}\n`,
      );
      for (const phase of phases) {
        const file = join(pluginDir, "skills", phase.name, "SKILL.md");
        const description = substituteTokens(phase.description, platform);
        writeText(
          file,
          `---\nname: ${phase.name}\ndescription: ${yamlScalar(description)}\n---\n\n${renderCommandBody(phase, rules, platform)}`,
        );
        commandFiles.push(file);
      }
    }
    writeText(join(pluginDir, "README.md"), renderReadme(phases, platform));

    // Starter: common files, then the platform starter file. No v1 README-START-HERE.md.
    copyTree(join(starterSrc, "common"), starterDir);
    const starterName = TOKENS[platform].STARTER_FILE;
    const starterFile = join(starterSrc, platform, starterName);
    if (!existsSync(starterFile)) throw new BuildError("input", `missing starter file: ${starterFile}`);
    cpSync(starterFile, join(starterDir, starterName));

    // Report skills, verbatim.
    copyTree(join(v2, "report-skills"), join(platformDir, "report-skills"));

    runGuards(platform, platformDir, commandFiles);
  }

  writeConnectorModule(phases, rules, starterSrc, join(out, "connector", "aiInstallContent.generated.ts"));

  // Zip only after every platform has passed its guards, so a failed build
  // never leaves a shippable zip for one platform behind.
  for (const platform of PLATFORMS) {
    const platformDir = join(out, platform);
    zipFolder(platformDir, "ai-install", join(out, `ai-install-${platform}-plugin.zip`));
    zipFolder(join(platformDir, "starter"), ".", join(out, `ai-install-${platform}-starter.zip`));
    zipFolder(join(platformDir, "report-skills"), ".", join(out, `ai-install-${platform}-report-skills.zip`));
  }

  return { commands: phases.map((p) => p.name), outDir: out };
}

// ---------------------------------------------------------------------------
// CLI
// ---------------------------------------------------------------------------

function main(): void {
  const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
  const sourceRoot = join(repoRoot, "resources", "aiinstall");
  const outDir = join(repoRoot, "dist-aiinstall-v2");
  try {
    const result = buildPlugins(sourceRoot, outDir);
    console.log(`Built AI Install v${VERSION}: ${result.commands.length} commands for claude and codex`);
    console.log(`Output: ${relative(repoRoot, outDir)}/`);
  } catch (err) {
    console.error(`AI Install v2 build failed: ${(err as Error).message}`);
    process.exit(1);
  }
}

if (import.meta.main) main();
