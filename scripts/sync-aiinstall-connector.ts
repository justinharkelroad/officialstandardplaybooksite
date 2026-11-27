#!/usr/bin/env bun
/**
 * Keeps the AgencyBrain connector's copy of the AI Install steps in line with
 * the source in this repository.
 *
 *   bun run check:aiinstall-connector
 *     Builds the steps here, reads AgencyBrain's copy from its main branch on
 *     GitHub, and exits 1 with the names of the steps that differ.
 *
 *   bun run sync:aiinstall-connector -- <path to an AgencyBrain worktree>
 *     Writes the freshly built file into that worktree. It commits nothing
 *     and pushes nothing. Open the pull request there as usual.
 *
 * AGENCYBRAIN_REPO overrides the GitHub repository ("owner/name").
 */
import { execFileSync } from "node:child_process";
import { existsSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

import { buildPlugins, connectorFingerprint } from "./build-aiinstall-v2-plugins.ts";

export const CONNECTOR_FILE =
  "supabase/functions/agencybrain-mcp/aiInstall/aiInstallContent.generated.ts";
const DEFAULT_REPO = "justinharkelroad/agencybrain";

export interface ConnectorContent {
  AI_INSTALL_CONTENT_VERSION: string;
  AI_INSTALL_CONTENT_FINGERPRINT?: string;
  AI_INSTALL_TOKENS: unknown;
  AI_INSTALL_RULES: string;
  AI_INSTALL_STEPS: { name: string }[];
  AI_INSTALL_STARTER_FILES: unknown;
}

export interface ConnectorDiff {
  same: boolean;
  /** Plain sentences an owner of the repository can act on. */
  differences: string[];
}

export function fingerprintOf(content: ConnectorContent): string {
  return connectorFingerprint({
    version: content.AI_INSTALL_CONTENT_VERSION,
    tokens: content.AI_INSTALL_TOKENS,
    rules: content.AI_INSTALL_RULES,
    steps: content.AI_INSTALL_STEPS,
    starterFiles: content.AI_INSTALL_STARTER_FILES,
  });
}

/** Compares what this repository builds with what AgencyBrain holds. */
export function diffConnectorContent(source: ConnectorContent, copy: ConnectorContent): ConnectorDiff {
  const differences: string[] = [];
  const same = (a: unknown, b: unknown) => JSON.stringify(a) === JSON.stringify(b);

  if (source.AI_INSTALL_CONTENT_VERSION !== copy.AI_INSTALL_CONTENT_VERSION) {
    differences.push(
      `Version differs: here ${source.AI_INSTALL_CONTENT_VERSION}, AgencyBrain ${copy.AI_INSTALL_CONTENT_VERSION}.`,
    );
  }
  if (!same(source.AI_INSTALL_TOKENS, copy.AI_INSTALL_TOKENS)) differences.push("App names or file names differ.");
  if (source.AI_INSTALL_RULES !== copy.AI_INSTALL_RULES) differences.push("The operating rules differ.");
  if (!same(source.AI_INSTALL_STARTER_FILES, copy.AI_INSTALL_STARTER_FILES)) {
    differences.push("The starter files differ.");
  }

  const here = new Map(source.AI_INSTALL_STEPS.map((step) => [step.name, step]));
  const there = new Map(copy.AI_INSTALL_STEPS.map((step) => [step.name, step]));
  for (const [name, step] of here) {
    if (!there.has(name)) differences.push(`Step ${name} is missing from AgencyBrain.`);
    else if (!same(step, there.get(name))) differences.push(`Step ${name} differs.`);
  }
  for (const name of there.keys()) {
    if (!here.has(name)) differences.push(`Step ${name} is in AgencyBrain but no longer exists here.`);
  }
  if (
    differences.length === 0 &&
    !same(source.AI_INSTALL_STEPS.map((s) => s.name), copy.AI_INSTALL_STEPS.map((s) => s.name))
  ) {
    differences.push("The steps are in a different order.");
  }

  // A copy edited by hand can keep every field above and still carry a stale
  // fingerprint, or carry none at all.
  if (differences.length === 0 && copy.AI_INSTALL_CONTENT_FINGERPRINT !== fingerprintOf(source)) {
    differences.push(
      copy.AI_INSTALL_CONTENT_FINGERPRINT
        ? "AgencyBrain's fingerprint does not match its content."
        : "AgencyBrain's copy has no fingerprint yet.",
    );
  }

  return { same: differences.length === 0, differences };
}

async function loadModule(file: string): Promise<ConnectorContent> {
  return (await import(pathToFileURL(file).href)) as ConnectorContent;
}

function buildHere(workDir: string): string {
  const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
  const out = join(workDir, "dist");
  buildPlugins(join(repoRoot, "resources", "aiinstall"), out);
  return join(out, "connector", "aiInstallContent.generated.ts");
}

function fetchAgencyBrainCopy(repo: string, workDir: string): string {
  let text: string;
  try {
    text = execFileSync(
      "gh",
      ["api", `repos/${repo}/contents/${CONNECTOR_FILE}`, "-H", "Accept: application/vnd.github.raw"],
      { encoding: "utf8", stdio: ["ignore", "pipe", "pipe"], maxBuffer: 32 * 1024 * 1024 },
    );
  } catch (error) {
    throw new Error(
      `Could not read ${CONNECTOR_FILE} from ${repo} on GitHub. Check that gh is signed in and can see that repository.\n${
        (error as Error).message
      }`,
    );
  }
  const file = join(workDir, "agencybrain-copy.ts");
  writeFileSync(file, text);
  return file;
}

async function main(): Promise<number> {
  const args = process.argv.slice(2).filter((arg) => arg !== "--");
  const repo = process.env.AGENCYBRAIN_REPO || DEFAULT_REPO;
  const workDir = mkdtempSync(join(tmpdir(), "aii-connector-"));
  try {
    const built = buildHere(workDir);

    if (args.length > 0) {
      const worktree = resolve(args[0]);
      const target = join(worktree, CONNECTOR_FILE);
      if (!existsSync(dirname(target))) {
        console.error(`That does not look like an AgencyBrain checkout: ${dirname(target)} is missing.`);
        return 1;
      }
      writeFileSync(target, readFileSync(built));
      const content = await loadModule(built);
      console.log(`Wrote ${target}`);
      console.log(`Fingerprint ${content.AI_INSTALL_CONTENT_FINGERPRINT}`);
      console.log("Nothing was committed or pushed. Run the tests there and open the pull request.");
      return 0;
    }

    const source = await loadModule(built);
    const copy = await loadModule(fetchAgencyBrainCopy(repo, workDir));
    const diff = diffConnectorContent(source, copy);
    if (diff.same) {
      console.log(`AgencyBrain main matches this repository (${source.AI_INSTALL_CONTENT_FINGERPRINT}).`);
      return 0;
    }
    console.error(`AgencyBrain main (${repo}) is out of date with the AI Install steps here:`);
    for (const line of diff.differences) console.error(`  - ${line}`);
    console.error("Fix: bun run sync:aiinstall-connector -- <path to an AgencyBrain worktree>");
    return 1;
  } finally {
    rmSync(workDir, { recursive: true, force: true });
  }
}

if (import.meta.main) {
  process.exit(await main());
}
