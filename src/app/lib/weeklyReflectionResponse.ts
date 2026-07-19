import { z } from "zod";
import type {
  WeeklyFlowReflectionHistoryResponse,
  WeeklyFlowReflectionResponse,
} from "../types/weeklyReflection";

const generationStatusSchema = z.enum([
  "empty",
  "generating",
  "ready",
  "failed",
  "paused",
]);

const sourceFlowSchema = z.object({
  id: z.string().min(1),
  title: z.string().nullable().default(null),
  domain: z.string().nullable().default(null),
  templateName: z.string().nullable().default(null),
  templateSlug: z.string().nullable().default(null),
  completedAt: z.string().default(""),
  localDate: z.string().default(""),
});

const reflectionSchema = z.object({
  id: z.string().nullable().default(null),
  weekKey: z.string().min(1),
  weekStart: z.string().default(""),
  weekEnd: z.string().default(""),
  timezone: z.string().default("UTC"),
  headline: z.string().nullable().default(null),
  reflectionText: z.string().nullable().default(null),
  signals: z
    .array(
      z.object({
        text: z.string().min(1),
        evidenceSessionIds: z.array(z.string()).default([]),
      }),
    )
    .default([]),
  iamStatements: z
    .array(
      z.object({
        text: z.string().min(1),
        category: z.string().default("identity"),
        evidenceSessionIds: z.array(z.string()).default([]),
      }),
    )
    .default([]),
  sourceFlows: z.array(sourceFlowSchema).default([]),
  synthesisSourceFlows: z.array(sourceFlowSchema).optional(),
  sourceCount: z.number().int().nonnegative().default(0),
  sourceDayCount: z.number().int().nonnegative().default(0),
  sourceVersion: z.number().int().nonnegative().nullable().default(null),
  generationStatus: generationStatusSchema,
  generatedAt: z.string().nullable().default(null),
  isStale: z.boolean().default(false),
  lastError: z.string().nullable().default(null),
});

const responseSchema = z.object({
  reflection: reflectionSchema.nullable().default(null),
  refreshError: z.string().nullable().optional(),
  memoryPaused: z.boolean().optional(),
  memory_paused: z.boolean().optional(),
});

const historyResponseSchema = z.object({
  reflections: z.array(reflectionSchema).default([]),
  availableWeeks: z
    .array(
      z.object({
        weekKey: z.string().min(1),
        weekStart: z.string().default(""),
        weekEnd: z.string().default(""),
        sourceCount: z.number().int().nonnegative().default(0),
        hasReflection: z.boolean().default(false),
        generationStatus: generationStatusSchema,
      }),
    )
    .default([]),
});

export function parseWeeklyFlowReflectionResponse(
  value: unknown,
): WeeklyFlowReflectionResponse {
  const parsed = responseSchema.safeParse(value ?? { reflection: null });
  if (!parsed.success) {
    throw new Error("Weekly Reflection returned an invalid response.");
  }
  return parsed.data as WeeklyFlowReflectionResponse;
}

export function parseWeeklyFlowReflectionHistoryResponse(
  value: unknown,
): WeeklyFlowReflectionHistoryResponse {
  const parsed = historyResponseSchema.safeParse(
    value ?? { reflections: [], availableWeeks: [] },
  );
  if (!parsed.success) {
    throw new Error("Reflection history returned an invalid response.");
  }
  return parsed.data as WeeklyFlowReflectionHistoryResponse;
}
