import { AI_INSTALL_COHORT } from "./aiInstallCohort";

export type AiInstallResourcePlatform = "claude" | "codex" | "both";

export interface AiInstallPortalResource {
  id: string;
  title: string;
  detail: string;
  kind: "PDF" | "ZIP";
}

export interface AiInstallPortalPreworkResource extends AiInstallPortalResource {
  platform: Exclude<AiInstallResourcePlatform, "both">;
  checklistHref: string;
}

const DAY_ONE_RESOURCES: AiInstallPortalResource[] = [
  { id: "day-1-guide", title: "Day 1 Build Guide", detail: "Follow along while you build the foundation", kind: "PDF" },
  { id: "skills-guide", title: "Standard Playbook Skills", detail: "Your skills reference playbook", kind: "PDF" },
];

const DAY_TWO_GUIDE: AiInstallPortalResource = {
  id: "day-2-guide",
  title: "Day 2 Build Guide",
  detail: "Follow along while you install skills and memory",
  kind: "PDF",
};

// The connect-first guides for the next cohort. Listed beside the first
// cohort's guides, never in place of them, because the replays follow those.
const V2_DAY_ONE_GUIDE: AiInstallPortalResource = {
  id: "day-1-guide-v2",
  title: "Day 1 Guide: Build the Brain",
  detail: "The step-by-step guide for the connect-first workshop",
  kind: "PDF",
};

const V2_DAY_TWO_GUIDE: AiInstallPortalResource = {
  id: "day-2-guide-v2",
  title: "Day 2 Guide: Make It Run",
  detail: "Morning brief, dashboard, custom skill, and weekly upkeep",
  kind: "PDF",
};

const PLATFORM_RESOURCES = {
  claude: {
    prework: {
      id: "claude-prework",
      title: "Claude Pre-work Pack",
      detail: "Includes CLAUDE-STARTER.md and folder setup files",
      kind: "ZIP",
      platform: "claude",
      checklistHref: "/aiinstall/prework/claude",
    },
    skills: {
      id: "claude-skills",
      title: "Claude Skills Library",
      detail: "Complete skill files installed during Day 2",
      kind: "ZIP",
    },
    plugin: {
      id: "claude-plugin",
      title: "AI Install Plugin for Claude",
      detail: "Only if you cannot connect AgencyBrain. Upload it in Customize, then Plugins. Do not unzip it.",
      kind: "ZIP",
    },
  },
  codex: {
    prework: {
      id: "codex-prework",
      title: "Codex Pre-work Pack",
      detail: "Includes AGENTS-STARTER.md and folder setup files",
      kind: "ZIP",
      platform: "codex",
      checklistHref: "/aiinstall/prework/codex",
    },
    skills: {
      id: "codex-skills",
      title: "Codex Skills Library",
      detail: "Complete skill files installed during Day 2",
      kind: "ZIP",
    },
    plugin: {
      id: "codex-plugin",
      title: "AI Install Plugin for Codex",
      detail: "Only if you cannot connect AgencyBrain. Follow the README inside to install it.",
      kind: "ZIP",
    },
  },
} as const;

/**
 * The plugin is the fallback for owners who cannot connect AgencyBrain. It is
 * listed only once the cohort settings turn the v2 portal on, so the first
 * cohort's alumni keep seeing exactly what they were given.
 */
export function getAiInstallPortalResourcePlan(
  platform: AiInstallResourcePlatform,
  options: { showV2: boolean } = { showV2: AI_INSTALL_COHORT.portalShowsV2 },
): {
  prework: AiInstallPortalPreworkResource[];
  plugin: AiInstallPortalResource[];
  dayOne: AiInstallPortalResource[];
  dayTwo: AiInstallPortalResource[];
  resourceCount: number;
} {
  const platforms = platform === "both" ? ["claude", "codex"] as const : [platform];
  const prework = platforms.map((name) => PLATFORM_RESOURCES[name].prework);
  const dayOne = options.showV2 ? [V2_DAY_ONE_GUIDE, ...DAY_ONE_RESOURCES] : [...DAY_ONE_RESOURCES];
  const dayTwo = [
    ...(options.showV2 ? [V2_DAY_TWO_GUIDE] : []),
    DAY_TWO_GUIDE,
    ...platforms.map((name) => PLATFORM_RESOURCES[name].skills),
  ];

  const plugin = options.showV2 ? platforms.map((name) => PLATFORM_RESOURCES[name].plugin) : [];

  return {
    prework: [...prework],
    plugin: [...plugin],
    dayOne: [...dayOne],
    dayTwo: [...dayTwo],
    resourceCount: prework.length + plugin.length + dayOne.length + dayTwo.length,
  };
}
