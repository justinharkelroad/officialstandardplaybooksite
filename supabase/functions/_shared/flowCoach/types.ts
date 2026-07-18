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
