import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { corsHeaders } from "../_shared/cors.ts";
import { jsonResponse, requireActiveMember } from "../_shared/memberAuth.ts";
import {
  buildBoundedWeeklyReflectionPromptData,
  buildEmptyReflectionContent,
  buildSourceFlows,
  buildWeeklyReflectionSystemPrompt,
  canonicalWeeklyReflectionBounds,
  computeWeeklyReflectionSourceHash,
  type FlowSessionForReflection,
  isoWeekKey,
  isoWeekStart,
  isWeeklyReflectionCacheCurrent,
  localDateForInstant,
  mergeModelOutputWithSources,
  progressiveIAmCount,
  progressiveSignalCount,
  validateWeeklyReflectionBounds,
  validateWeeklyReflectionModelOutput,
  type WeeklyReflectionBounds,
  type WeeklyReflectionContent,
} from "../_shared/weeklyReflection.ts";

const JSON_HEADERS = { ...corsHeaders, "Content-Type": "application/json" };
const GENERATION_CLAIM_TTL_MS = 10 * 60 * 1000;
const FAILED_RETRY_COOLDOWN_MS = 2 * 60 * 1000;
const PROMPT_VERSION = "weekly-flow-reflection-v2";

interface ReflectionRow {
  id: string;
  user_id: string;
  week_key: string;
  week_start: string;
  week_end: string;
  timezone: string;
  range_start_at: string;
  range_end_at: string;
  source_hash: string;
  content_source_hash: string | null;
  source_version: number;
  generation_status: "empty" | "generating" | "ready" | "failed";
  generation_started_at: string | null;
  generated_at: string | null;
  model: string | null;
  prompt_version: string | null;
  last_error: string | null;
  source_session_ids: string[];
  source_count: number;
  source_day_count: number;
  reflection_json: WeeklyReflectionContent;
  created_at: string;
  updated_at: string;
}

interface ReflectionDb {
  // Kept structural so this function remains compatible with the Supabase JS
  // version shared by the rest of the member app.
  // deno-lint-ignore no-explicit-any
  from: (table: string) => any;
}

function parseAction(body: Record<string, unknown>): string {
  return typeof body.action === "string" ? body.action : "get_or_generate";
}

function configuredReflectionModel(): string {
  return Deno.env.get("WEEKLY_REFLECTION_MODEL") ?? "gpt-4o-mini";
}

function publicSignal(signal: unknown) {
  const item = signal && typeof signal === "object"
    ? signal as Record<string, unknown>
    : {};
  return {
    text: typeof item.text === "string" ? item.text : "",
    evidenceSessionIds: Array.isArray(item.evidence_session_ids)
      ? item.evidence_session_ids.filter((id): id is string =>
        typeof id === "string"
      )
      : [],
  };
}

function publicIAmStatement(statement: unknown) {
  const item = statement && typeof statement === "object"
    ? statement as Record<string, unknown>
    : {};
  return {
    text: typeof item.text === "string" ? item.text : "",
    category: typeof item.category === "string" ? item.category : "identity",
    evidenceSessionIds: Array.isArray(item.evidence_session_ids)
      ? item.evidence_session_ids.filter((id): id is string =>
        typeof id === "string"
      )
      : [],
  };
}

function publicSourceFlow(flow: unknown) {
  const item = flow && typeof flow === "object"
    ? flow as Record<string, unknown>
    : {};
  return {
    id: typeof item.id === "string" ? item.id : "",
    title: typeof item.title === "string" ? item.title : null,
    domain: typeof item.domain === "string" ? item.domain : null,
    templateName: typeof item.template_name === "string"
      ? item.template_name
      : null,
    templateSlug: typeof item.template_slug === "string"
      ? item.template_slug
      : null,
    completedAt: typeof item.completed_at === "string" ? item.completed_at : "",
    localDate: typeof item.local_date === "string" ? item.local_date : "",
  };
}

function hasGeneratedContent(
  content: WeeklyReflectionContent | null | undefined,
): boolean {
  return Boolean(
    content?.headline || content?.reflection || content?.iam_statements?.length,
  );
}

function publicReflection(row: ReflectionRow | null) {
  if (!row) return null;
  const content = row.reflection_json ?? buildEmptyReflectionContent();
  const displayedSourceCount = Number.isInteger(content.source_count)
    ? content.source_count
    : row.source_count;
  const displayedSourceDayCount = Number.isInteger(content.source_day_count)
    ? content.source_day_count
    : row.source_day_count;
  return {
    id: row.id,
    weekKey: row.week_key,
    weekStart: row.week_start,
    weekEnd: row.week_end,
    timezone: row.timezone,
    weekStartIso: row.range_start_at,
    weekEndIso: row.range_end_at,
    headline: content.headline ?? "",
    reflectionText: content.reflection ?? "",
    signals: Array.isArray(content.signals)
      ? content.signals.map(publicSignal)
      : [],
    iamStatements: Array.isArray(content.iam_statements)
      ? content.iam_statements.map(publicIAmStatement)
      : [],
    sourceFlows: Array.isArray(content.source_flows)
      ? content.source_flows.map(publicSourceFlow)
      : [],
    // Counts and sourceFlows always describe the content being displayed. If a
    // refresh is in progress or failed, latestSource* describes the newer
    // source set while isStale remains true.
    sourceCount: displayedSourceCount,
    sourceDayCount: displayedSourceDayCount,
    latestSourceCount: row.source_count,
    latestSourceDayCount: row.source_day_count,
    sourceVersion: row.source_version,
    generationStatus: row.generation_status,
    generatedAt: row.generated_at,
    model: row.model,
    promptVersion: row.prompt_version,
    isStale: hasGeneratedContent(content) &&
      row.content_source_hash !== row.source_hash,
    lastError: row.last_error,
  };
}

function pausedReflection(
  bounds: WeeklyReflectionBounds,
  sourceFlows: ReturnType<typeof buildSourceFlows>,
  existing: ReflectionRow | null,
  currentSourceHash: string,
) {
  const previous = publicReflection(existing);
  const synthesisSourceFlows = previous?.sourceFlows ?? [];
  return {
    id: existing?.id ?? null,
    weekKey: bounds.weekKey,
    weekStart: bounds.weekStart,
    weekEnd: bounds.weekEnd,
    timezone: bounds.timezone,
    weekStartIso: bounds.weekStartIso,
    weekEndIso: bounds.weekEndIso,
    headline: previous?.headline ?? "",
    reflectionText: previous?.reflectionText ?? "",
    signals: previous?.signals ?? [],
    iamStatements: previous?.iamStatements ?? [],
    sourceFlows: sourceFlows.map(publicSourceFlow),
    synthesisSourceFlows,
    sourceCount: sourceFlows.length,
    sourceDayCount: new Set(sourceFlows.map((flow) => flow.local_date)).size,
    sourceVersion: existing?.source_version ?? 0,
    generationStatus: "paused" as const,
    generatedAt: existing?.generated_at ?? null,
    model: existing?.model ?? null,
    promptVersion: existing?.prompt_version ?? null,
    isStale: Boolean(
      existing && hasGeneratedContent(existing.reflection_json) &&
        existing.content_source_hash !== currentSourceHash,
    ),
    lastError: existing?.last_error ?? null,
  };
}

async function findReflection(
  db: ReflectionDb,
  userId: string,
  weekKey: string,
): Promise<ReflectionRow | null> {
  const { data, error } = await db.from("weekly_flow_reflections")
    .select("*")
    .eq("user_id", userId)
    .eq("week_key", weekKey)
    .maybeSingle();
  if (error) throw error;
  return data as ReflectionRow | null;
}

async function listReflections(
  db: ReflectionDb,
  userId: string,
  requestedLimit: unknown,
): Promise<ReflectionRow[]> {
  const numericLimit =
    typeof requestedLimit === "number" && Number.isFinite(requestedLimit)
      ? Math.floor(requestedLimit)
      : 12;
  const limit = Math.min(Math.max(numericLimit, 1), 52);
  const { data, error } = await db.from("weekly_flow_reflections")
    .select("*")
    .eq("user_id", userId)
    .order("week_start", { ascending: false })
    .limit(limit);
  if (error) throw error;
  return (data ?? []) as ReflectionRow[];
}

function addDays(dateOnly: string, days: number): string {
  const date = new Date(`${dateOnly}T00:00:00.000Z`);
  date.setUTCDate(date.getUTCDate() + days);
  return date.toISOString().slice(0, 10);
}

function validTimezone(value: unknown): value is string {
  if (typeof value !== "string" || !value || value.length > 100) return false;
  try {
    new Intl.DateTimeFormat("en-US", { timeZone: value }).format(new Date());
    return true;
  } catch {
    return false;
  }
}

async function listAvailableWeeks(
  db: ReflectionDb,
  userId: string,
  timezone: string,
  rows: ReflectionRow[],
  requestedLimit: unknown,
) {
  const numericLimit =
    typeof requestedLimit === "number" && Number.isFinite(requestedLimit)
      ? Math.floor(requestedLimit)
      : 12;
  const limit = Math.min(Math.max(numericLimit, 1), 52);
  const sessionLimit = Math.min(Math.max(limit * 50, 500), 2000);
  const { data, error } = await db.from("flow_sessions")
    .select("id,completed_at")
    .eq("user_id", userId)
    .eq("status", "completed")
    .not("completed_at", "is", null)
    .order("completed_at", { ascending: false })
    .limit(sessionLimit);
  if (error) throw error;

  const byWeek = new Map<string, {
    weekKey: string;
    weekStart: string;
    weekEnd: string;
    sourceCount: number;
    hasReflection: boolean;
    generationStatus: ReflectionRow["generation_status"];
  }>();
  const storedByWeek = new Map(rows.map((row) => [row.week_key, row]));
  for (const source of data ?? []) {
    if (typeof source.completed_at !== "string") continue;
    const localDate = localDateForInstant(source.completed_at, timezone);
    const weekKey = isoWeekKey(localDate);
    const weekStart = isoWeekStart(localDate);
    const current = byWeek.get(weekKey);
    if (current) {
      current.sourceCount += 1;
      continue;
    }
    const stored = storedByWeek.get(weekKey);
    byWeek.set(weekKey, {
      weekKey,
      weekStart: stored?.week_start ?? weekStart,
      weekEnd: stored?.week_end ?? addDays(weekStart, 6),
      sourceCount: 1,
      hasReflection: Boolean(stored),
      generationStatus: stored?.generation_status ?? "empty",
    });
  }

  // Preserve an established artifact even if its underlying Flows were later
  // removed. Deleting Flow coach memory is the explicit action that removes it.
  for (const row of rows) {
    if (byWeek.has(row.week_key)) continue;
    byWeek.set(row.week_key, {
      weekKey: row.week_key,
      weekStart: row.week_start,
      weekEnd: row.week_end,
      sourceCount: row.source_count,
      hasReflection: true,
      generationStatus: row.generation_status,
    });
  }

  return [...byWeek.values()]
    .sort((a, b) => b.weekStart.localeCompare(a.weekStart))
    .slice(0, limit);
}

async function loadCompletedFlows(
  db: ReflectionDb,
  userId: string,
  bounds: WeeklyReflectionBounds,
): Promise<FlowSessionForReflection[]> {
  const { data, error } = await db.from("flow_sessions")
    .select(
      "id,title,domain,responses_json,ai_analysis_json,completed_at," +
        "flow_template:flow_templates(id,name,slug,questions_json)",
    )
    .eq("user_id", userId)
    .eq("status", "completed")
    .not("completed_at", "is", null)
    .gte("completed_at", bounds.weekStartIso)
    .lt("completed_at", bounds.weekEndIso)
    .order("completed_at", { ascending: true })
    .order("id", { ascending: true });
  if (error) throw error;
  return (data ?? []) as FlowSessionForReflection[];
}

async function loadSourceSnapshot(
  db: ReflectionDb,
  userId: string,
  bounds: WeeklyReflectionBounds,
) {
  const sessions = await loadCompletedFlows(db, userId, bounds);
  const sourceFlows = buildSourceFlows(sessions, bounds.timezone);
  const sourceHash = await computeWeeklyReflectionSourceHash(sessions);
  return { sessions, sourceFlows, sourceHash };
}

function claimExpired(row: ReflectionRow): boolean {
  if (!row.generation_started_at) return true;
  return Date.now() - new Date(row.generation_started_at).getTime() >
    GENERATION_CLAIM_TTL_MS;
}

function retryCooldownActive(row: ReflectionRow): boolean {
  if (row.generation_status !== "failed" || !row.generation_started_at) {
    return false;
  }
  return Date.now() - new Date(row.generation_started_at).getTime() <
    FAILED_RETRY_COOLDOWN_MS;
}

async function claimGeneration(
  db: ReflectionDb,
  userId: string,
  bounds: WeeklyReflectionBounds,
  sourceHash: string,
  sourceFlows: ReturnType<typeof buildSourceFlows>,
  existing: ReflectionRow | null,
  force: boolean,
  currentModel: string,
): Promise<{ row: ReflectionRow; claimed: boolean }> {
  const sourceSessionIds = sourceFlows.map((flow) => flow.id);
  const sourceDayCount =
    new Set(sourceFlows.map((flow) => flow.local_date)).size;
  const now = new Date().toISOString();

  if (
    existing && !force && isWeeklyReflectionCacheCurrent(
      {
        sourceHash: existing.source_hash,
        contentSourceHash: existing.content_source_hash,
        sourceCount: existing.source_count,
        generationStatus: existing.generation_status,
        model: existing.model,
        promptVersion: existing.prompt_version,
      },
      sourceHash,
      currentModel,
      PROMPT_VERSION,
    )
  ) {
    return { row: existing, claimed: false };
  }
  if (
    existing && existing.source_hash === sourceHash &&
    existing.generation_status === "generating" && !claimExpired(existing)
  ) {
    return { row: existing, claimed: false };
  }
  if (
    existing && !force && existing.source_hash === sourceHash &&
    retryCooldownActive(existing)
  ) {
    return { row: existing, claimed: false };
  }

  if (!existing) {
    const { data, error } = await db.from("weekly_flow_reflections")
      .insert({
        user_id: userId,
        week_key: bounds.weekKey,
        week_start: bounds.weekStart,
        week_end: bounds.weekEnd,
        timezone: bounds.timezone,
        range_start_at: bounds.weekStartIso,
        range_end_at: bounds.weekEndIso,
        source_hash: sourceHash,
        content_source_hash: null,
        source_version: 1,
        generation_status: "generating",
        generation_started_at: now,
        source_session_ids: sourceSessionIds,
        source_count: sourceFlows.length,
        source_day_count: sourceDayCount,
        reflection_json: buildEmptyReflectionContent(sourceFlows),
      })
      .select("*")
      .single();
    if (!error && data) return { row: data as ReflectionRow, claimed: true };
    // A concurrent first request may have won the unique (user_id, week_key)
    // insert. Re-read that row and let the caller observe its claim.
    if (error?.code === "23505") {
      const concurrent = await findReflection(db, userId, bounds.weekKey);
      if (concurrent) return { row: concurrent, claimed: false };
    }
    throw error;
  }

  const nextVersion = existing.source_version + 1;
  const { data, error } = await db.from("weekly_flow_reflections")
    .update({
      source_hash: sourceHash,
      source_version: nextVersion,
      generation_status: "generating",
      generation_started_at: now,
      last_error: null,
      source_session_ids: sourceSessionIds,
      source_count: sourceFlows.length,
      source_day_count: sourceDayCount,
    })
    .eq("id", existing.id)
    .eq("user_id", userId)
    .eq("source_version", existing.source_version)
    .eq("source_hash", existing.source_hash)
    .eq("generation_status", existing.generation_status)
    .select("*")
    .maybeSingle();
  if (error) throw error;
  if (data) return { row: data as ReflectionRow, claimed: true };

  const concurrent = await findReflection(db, userId, bounds.weekKey);
  if (!concurrent) {
    throw new Error("Weekly reflection disappeared during generation claim.");
  }
  return { row: concurrent, claimed: false };
}

async function coachMemoryIsPaused(
  db: ReflectionDb,
  userId: string,
): Promise<boolean> {
  const { data, error } = await db.from("flow_profiles")
    .select("coach_memory_paused")
    .eq("user_id", userId)
    .maybeSingle();
  if (error) throw error;
  return Boolean(data?.coach_memory_paused);
}

async function cancelGenerationForMemoryPause(
  db: ReflectionDb,
  userId: string,
  claimed: ReflectionRow,
): Promise<ReflectionRow> {
  const contentWasCurrent = claimed.content_source_hash === claimed.source_hash;
  const restoredStatus = contentWasCurrent
    ? hasGeneratedContent(claimed.reflection_json) ? "ready" : "empty"
    : "failed";
  const { data, error } = await db.from("weekly_flow_reflections")
    .update({
      generation_status: restoredStatus,
      generation_started_at: null,
      last_error: null,
    })
    .eq("id", claimed.id)
    .eq("user_id", userId)
    .eq("source_hash", claimed.source_hash)
    .eq("source_version", claimed.source_version)
    .eq("generation_status", "generating")
    .select("*")
    .maybeSingle();
  if (error) throw error;
  return (data as ReflectionRow | null) ??
    (await findReflection(db, userId, claimed.week_key)) ?? claimed;
}

async function saveEmptyReflection(
  db: ReflectionDb,
  userId: string,
  claimed: ReflectionRow,
  sourceFlows: ReturnType<typeof buildSourceFlows>,
): Promise<ReflectionRow> {
  const now = new Date().toISOString();
  const { data, error } = await db.from("weekly_flow_reflections")
    .update({
      reflection_json: buildEmptyReflectionContent(sourceFlows),
      content_source_hash: claimed.source_hash,
      generation_status: "empty",
      generation_started_at: null,
      generated_at: now,
      model: null,
      prompt_version: null,
      last_error: null,
    })
    .eq("id", claimed.id)
    .eq("user_id", userId)
    .eq("source_hash", claimed.source_hash)
    .eq("source_version", claimed.source_version)
    .eq("generation_status", "generating")
    .select("*")
    .maybeSingle();
  if (error) throw error;
  return (data as ReflectionRow | null) ??
    (await findReflection(db, userId, claimed.week_key)) ?? claimed;
}

async function callReflectionModel(
  sessions: FlowSessionForReflection[],
  model: string,
) {
  const apiKey = Deno.env.get("OPENAI_API_KEY");
  if (!apiKey) throw new Error("Weekly Reflection AI is not configured.");

  const statementCount = progressiveIAmCount(sessions.length);
  const signalCount = progressiveSignalCount(sessions.length);
  const modelInput = buildBoundedWeeklyReflectionPromptData(sessions);
  const schema = {
    type: "object",
    additionalProperties: false,
    required: ["headline", "reflection", "signals", "iam_statements"],
    properties: {
      headline: { type: "string" },
      reflection: { type: "string" },
      signals: {
        type: "array",
        minItems: signalCount,
        maxItems: signalCount,
        items: {
          type: "object",
          additionalProperties: false,
          required: ["text", "evidence_session_ids"],
          properties: {
            text: { type: "string" },
            evidence_session_ids: {
              type: "array",
              minItems: 1,
              maxItems: 4,
              items: { type: "string" },
            },
          },
        },
      },
      iam_statements: {
        type: "array",
        minItems: statementCount,
        maxItems: statementCount,
        items: {
          type: "object",
          additionalProperties: false,
          required: ["text", "category", "evidence_session_ids"],
          properties: {
            text: { type: "string" },
            category: {
              type: "string",
              enum: [
                "identity",
                "posture",
                "relationship",
                "leadership",
                "practice",
              ],
            },
            evidence_session_ids: {
              type: "array",
              minItems: 1,
              maxItems: 4,
              items: { type: "string" },
            },
          },
        },
      },
    },
  };

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model,
      temperature: 0.35,
      max_tokens: 2200,
      response_format: {
        type: "json_schema",
        json_schema: { name: "weekly_flow_reflection", strict: true, schema },
      },
      messages: [
        {
          role: "system",
          content: buildWeeklyReflectionSystemPrompt(
            statementCount,
            signalCount,
            sessions.length,
          ),
        },
        {
          role: "user",
          content: [
            "Synthesize the authorized completed Flows below.",
            '<FLOW_DATA role="untrusted_member_data">',
            `{"total_source_count":${sessions.length},"presented_source_count":${modelInput.sessions.length},"flows":${modelInput.json}}`,
            "</FLOW_DATA>",
          ].join("\n"),
        },
      ],
    }),
  });

  if (!response.ok) {
    const responseText = await response.text();
    console.error(
      "[weekly_flow_reflection] OpenAI error",
      response.status,
      responseText.slice(0, 1000),
    );
    throw new Error("Weekly Reflection generation failed.");
  }
  const result = await response.json();
  const text = result?.choices?.[0]?.message?.content;
  if (typeof text !== "string" || !text.trim()) {
    throw new Error("Weekly Reflection generation returned no content.");
  }
  let parsed: unknown;
  try {
    parsed = JSON.parse(text);
  } catch {
    throw new Error("Weekly Reflection generation returned invalid JSON.");
  }
  const validated = validateWeeklyReflectionModelOutput(
    parsed,
    modelInput.sessions,
    sessions.length,
  );
  if (!validated.ok) throw new Error(validated.error);
  return { output: validated.value, model };
}

async function saveGeneratedReflection(
  db: ReflectionDb,
  userId: string,
  claimed: ReflectionRow,
  content: WeeklyReflectionContent,
  model: string,
): Promise<ReflectionRow> {
  const { data, error } = await db.from("weekly_flow_reflections")
    .update({
      reflection_json: content,
      content_source_hash: claimed.source_hash,
      generation_status: "ready",
      generation_started_at: null,
      generated_at: new Date().toISOString(),
      model,
      prompt_version: PROMPT_VERSION,
      last_error: null,
    })
    .eq("id", claimed.id)
    .eq("user_id", userId)
    .eq("source_hash", claimed.source_hash)
    .eq("source_version", claimed.source_version)
    .eq("generation_status", "generating")
    .select("*")
    .maybeSingle();
  if (error) throw error;
  return (data as ReflectionRow | null) ??
    (await findReflection(db, userId, claimed.week_key)) ?? claimed;
}

async function preservePreviousReflectionAfterFailure(
  db: ReflectionDb,
  userId: string,
  claimed: ReflectionRow,
  error: unknown,
): Promise<{ row: ReflectionRow; recordedFailure: boolean }> {
  const message = error instanceof Error
    ? error.message
    : "Weekly Reflection generation failed.";
  const { data, error: updateError } = await db.from("weekly_flow_reflections")
    .update({
      generation_status: "failed",
      last_error: message.slice(0, 500),
    })
    .eq("id", claimed.id)
    .eq("user_id", userId)
    .eq("source_hash", claimed.source_hash)
    .eq("source_version", claimed.source_version)
    .eq("generation_status", "generating")
    .select("*")
    .maybeSingle();
  if (updateError) {
    console.error(
      "[weekly_flow_reflection] Could not record generation failure",
      updateError,
    );
  }
  return {
    row: (data as ReflectionRow | null) ??
      (await findReflection(db, userId, claimed.week_key)) ?? claimed,
    recordedFailure: Boolean(data),
  };
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }
  if (req.method !== "POST") {
    return jsonResponse({ error: "Method not allowed." }, 405);
  }

  try {
    const member = await requireActiveMember(req);
    if (member instanceof Response) return member;
    const db = member.supabase as unknown as ReflectionDb;

    let body: Record<string, unknown>;
    try {
      const parsed = await req.json();
      if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
        return jsonResponse({ error: "Request body must be an object." }, 400);
      }
      body = parsed as Record<string, unknown>;
    } catch {
      return jsonResponse({ error: "Request body must be valid JSON." }, 400);
    }

    const action = parseAction(body);
    if (action === "history") {
      const rows = await listReflections(db, member.userId, body.limit);
      const timezone = validTimezone(body.timezone)
        ? body.timezone
        : rows[0]?.timezone;
      if (!validTimezone(timezone)) {
        return jsonResponse({
          error: "A valid IANA timezone is required for history.",
        }, 400);
      }
      const availableWeeks = await listAvailableWeeks(
        db,
        member.userId,
        timezone,
        rows,
        body.limit,
      );
      return jsonResponse({
        reflections: rows.map(publicReflection),
        availableWeeks,
      });
    }
    if (action === "get") {
      const weekKey = typeof body.weekKey === "string"
        ? body.weekKey
        : typeof body.week_key === "string"
        ? body.week_key
        : "";
      if (!/^[0-9]{4}-W(0[1-9]|[1-4][0-9]|5[0-3])$/.test(weekKey)) {
        return jsonResponse(
          { error: "weekKey must use ISO format YYYY-Www." },
          400,
        );
      }
      return jsonResponse({
        reflection: publicReflection(
          await findReflection(db, member.userId, weekKey),
        ),
      });
    }
    if (!["get_or_generate", "refresh"].includes(action)) {
      return jsonResponse({ error: "Unsupported action." }, 400);
    }

    const boundsResult = validateWeeklyReflectionBounds(body);
    if (!boundsResult.ok) {
      return jsonResponse({ error: boundsResult.error }, 400);
    }
    const requestedBounds = boundsResult.value;

    const [profileResult, existing] = await Promise.all([
      db.from("flow_profiles")
        .select("coach_memory_paused")
        .eq("user_id", member.userId)
        .maybeSingle(),
      findReflection(db, member.userId, requestedBounds.weekKey),
    ]);
    if (profileResult.error) throw profileResult.error;

    const bounds = canonicalWeeklyReflectionBounds(requestedBounds, existing);
    let source = await loadSourceSnapshot(db, member.userId, bounds);
    if (profileResult.data?.coach_memory_paused) {
      return jsonResponse({
        reflection: pausedReflection(
          bounds,
          source.sourceFlows,
          existing,
          source.sourceHash,
        ),
        memoryPaused: true,
      });
    }

    const currentModel = configuredReflectionModel();
    let claim = await claimGeneration(
      db,
      member.userId,
      bounds,
      source.sourceHash,
      source.sourceFlows,
      existing,
      action === "refresh",
      currentModel,
    );

    // A concurrent request can win either the first insert or the versioned
    // update with a different source snapshot. Re-read the database before a
    // bounded retry so an older caller cannot displace a newer source set.
    for (let attempt = 0; !claim.claimed && attempt < 2; attempt += 1) {
      if (
        isWeeklyReflectionCacheCurrent(
          {
            sourceHash: claim.row.source_hash,
            contentSourceHash: claim.row.content_source_hash,
            sourceCount: claim.row.source_count,
            generationStatus: claim.row.generation_status,
            model: claim.row.model,
            promptVersion: claim.row.prompt_version,
          },
          source.sourceHash,
          currentModel,
          PROMPT_VERSION,
        )
      ) break;
      if (
        claim.row.source_hash === source.sourceHash &&
        claim.row.generation_status === "generating" &&
        !claimExpired(claim.row)
      ) break;
      if (
        action !== "refresh" &&
        claim.row.source_hash === source.sourceHash &&
        retryCooldownActive(claim.row)
      ) break;

      source = await loadSourceSnapshot(db, member.userId, bounds);
      if (
        isWeeklyReflectionCacheCurrent(
          {
            sourceHash: claim.row.source_hash,
            contentSourceHash: claim.row.content_source_hash,
            sourceCount: claim.row.source_count,
            generationStatus: claim.row.generation_status,
            model: claim.row.model,
            promptVersion: claim.row.prompt_version,
          },
          source.sourceHash,
          currentModel,
          PROMPT_VERSION,
        )
      ) break;

      claim = await claimGeneration(
        db,
        member.userId,
        bounds,
        source.sourceHash,
        source.sourceFlows,
        claim.row,
        false,
        currentModel,
      );
    }

    if (!claim.claimed) {
      const reflection = publicReflection(claim.row);
      const awaitingCurrentSource = claim.row.source_hash !== source.sourceHash;
      return jsonResponse({
        reflection: reflection && awaitingCurrentSource
          ? {
            ...reflection,
            generationStatus: "generating",
            isStale: hasGeneratedContent(claim.row.reflection_json),
          }
          : reflection,
        generated: false,
        cached: isWeeklyReflectionCacheCurrent(
          {
            sourceHash: claim.row.source_hash,
            contentSourceHash: claim.row.content_source_hash,
            sourceCount: claim.row.source_count,
            generationStatus: claim.row.generation_status,
            model: claim.row.model,
            promptVersion: claim.row.prompt_version,
          },
          source.sourceHash,
          currentModel,
          PROMPT_VERSION,
        ),
      });
    }

    if (source.sessions.length === 0) {
      const emptyRow = await saveEmptyReflection(
        db,
        member.userId,
        claim.row,
        source.sourceFlows,
      );
      return jsonResponse({
        reflection: publicReflection(emptyRow),
        generated: false,
        cached: false,
      });
    }

    try {
      const generated = await callReflectionModel(
        source.sessions,
        currentModel,
      );
      const content = mergeModelOutputWithSources(
        generated.output,
        source.sourceFlows,
      );
      if (await coachMemoryIsPaused(db, member.userId)) {
        const restored = await cancelGenerationForMemoryPause(
          db,
          member.userId,
          claim.row,
        );
        return jsonResponse({
          reflection: pausedReflection(
            bounds,
            source.sourceFlows,
            restored,
            source.sourceHash,
          ),
          memoryPaused: true,
        });
      }
      const ready = await saveGeneratedReflection(
        db,
        member.userId,
        claim.row,
        content,
        generated.model,
      );
      return jsonResponse({
        reflection: publicReflection(ready),
        generated: ready.content_source_hash === source.sourceHash,
        cached: false,
        model: generated.model,
      });
    } catch (generationError) {
      console.error(
        "[weekly_flow_reflection] Generation failed",
        generationError instanceof Error
          ? generationError.message
          : generationError,
      );
      if (await coachMemoryIsPaused(db, member.userId)) {
        const restored = await cancelGenerationForMemoryPause(
          db,
          member.userId,
          claim.row,
        );
        return jsonResponse({
          reflection: pausedReflection(
            bounds,
            source.sourceFlows,
            restored,
            source.sourceHash,
          ),
          memoryPaused: true,
        });
      }
      const failure = await preservePreviousReflectionAfterFailure(
        db,
        member.userId,
        claim.row,
        generationError,
      );
      return new Response(
        JSON.stringify({
          reflection: publicReflection(failure.row),
          generated: false,
          cached: false,
          ...(failure.recordedFailure
            ? {
              refreshError: generationError instanceof Error
                ? generationError.message
                : "Weekly Reflection generation failed.",
            }
            : {}),
        }),
        { status: 200, headers: JSON_HEADERS },
      );
    }
  } catch (error) {
    console.error(
      "[weekly_flow_reflection] Request failed",
      error instanceof Error ? error.message : error,
    );
    return jsonResponse(
      { error: "Weekly Reflection could not be loaded." },
      500,
    );
  }
});
