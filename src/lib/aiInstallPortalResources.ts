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
  },
} as const;

export function getAiInstallPortalResourcePlan(platform: AiInstallResourcePlatform): {
  prework: AiInstallPortalPreworkResource[];
  dayOne: AiInstallPortalResource[];
  dayTwo: AiInstallPortalResource[];
  resourceCount: number;
} {
  const platforms = platform === "both" ? ["claude", "codex"] as const : [platform];
  const prework = platforms.map((name) => PLATFORM_RESOURCES[name].prework);
  const dayTwo = [DAY_TWO_GUIDE, ...platforms.map((name) => PLATFORM_RESOURCES[name].skills)];

  return {
    prework: [...prework],
    dayOne: [...DAY_ONE_RESOURCES],
    dayTwo: [...dayTwo],
    resourceCount: prework.length + DAY_ONE_RESOURCES.length + dayTwo.length,
  };
}
