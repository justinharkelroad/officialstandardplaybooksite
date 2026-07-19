export type WeeklyReflectionGenerationStatus =
  | "empty"
  | "generating"
  | "ready"
  | "failed"
  | "paused";

export interface WeeklyReflectionSignal {
  text: string;
  evidenceSessionIds: string[];
}

export interface WeeklyReflectionIAmStatement {
  text: string;
  category: string;
  evidenceSessionIds: string[];
}

export interface WeeklyReflectionSourceFlow {
  id: string;
  title: string | null;
  domain: string | null;
  templateName: string | null;
  templateSlug: string | null;
  completedAt: string;
  localDate: string;
}

export interface WeeklyFlowReflection {
  id: string | null;
  weekKey: string;
  weekStart: string;
  weekEnd: string;
  timezone: string;
  headline: string | null;
  reflectionText: string | null;
  signals: WeeklyReflectionSignal[];
  iamStatements: WeeklyReflectionIAmStatement[];
  sourceFlows: WeeklyReflectionSourceFlow[];
  synthesisSourceFlows?: WeeklyReflectionSourceFlow[];
  sourceCount: number;
  sourceDayCount: number;
  sourceVersion: number | null;
  generationStatus: WeeklyReflectionGenerationStatus;
  generatedAt: string | null;
  isStale: boolean;
  lastError: string | null;
}

export interface WeeklyReflectionAvailableWeek {
  weekKey: string;
  weekStart: string;
  weekEnd: string;
  sourceCount: number;
  hasReflection: boolean;
  generationStatus: WeeklyReflectionGenerationStatus;
}

export interface WeeklyFlowReflectionResponse {
  reflection: WeeklyFlowReflection | null;
  refreshError?: string | null;
  memoryPaused?: boolean;
  memory_paused?: boolean;
}

export interface WeeklyFlowReflectionHistoryResponse {
  reflections: WeeklyFlowReflection[];
  availableWeeks: WeeklyReflectionAvailableWeek[];
}

export interface WeeklyReflectionRequestWindow {
  weekKey: string;
  timezone: string;
  weekStartIso: string;
  weekEndIso: string;
  label: string;
}
