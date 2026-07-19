export type CoachIntensity = "gentle" | "standard" | "hard";
export type InsightKind = "quote" | "commitment" | "pattern" | "fact" | "breakthrough";

export interface CoachInsight {
  id: string;
  flow_slug: string | null;
  session_title: string | null;
  kind: InsightKind;
  step_key: string | null;
  theme: string | null;
  claim: string | null;
  content: string;
  created_at: string;
}

export interface CoachPromptParts {
  system: string;
  user: string;
}

export interface CoachModelConfig {
  provider?: "openai" | "anthropic";
  model: string;
  openaiApiKey?: string | null;
  anthropicApiKey?: string | null;
  maxTokens?: number;
  temperature?: number;
  reasoningEffort?: "none" | "low" | "medium" | "high" | "xhigh";
  jsonMode?: boolean;
}

export interface CoachWorkingThesis {
  central_tension: string | null;
  emerging_pattern: string | null;
  desired_shift: string | null;
  evidence: string[];
  confidence: "low" | "medium" | "high";
}

export interface CoachTurnDraft {
  reflection: string;
  probe: string | null;
  thesis: CoachWorkingThesis;
}

export interface CoachTurnRendered extends CoachTurnDraft {
  memoryRefs: Array<{ id: string; flow_slug: string | null; session_title: string | null }>;
  rejectionReason: CoachOutputRejectionReason | null;
}

export type CoachOutputRejectionReason =
  | "empty_reflection"
  | "raw_memory_text"
  | "unverified_memory_claim"
  | "reflection_contains_question";

export interface CoachResolutionDraft {
  resolution: string;
  thesis: CoachWorkingThesis;
}

export interface CoachModelResult {
  text: string;
  model: string;
  inputTokens: number | null;
  outputTokens: number | null;
}

// Structural database boundary keeps the core portable across Supabase client
// minor versions used by the two apps.
export type CoachDb = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  from: (table: string) => any;
};
