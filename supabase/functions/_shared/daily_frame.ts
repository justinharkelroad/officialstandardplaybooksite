// Daily Frame helpers — ported from the source platform, owner path only.
// Single-actor model: daily_frame_commitments rows belong to the member
// (user_id NOT NULL, UNIQUE(user_id, frame_date)). No staff/dual-actor
// columns exist in this app.
import type { SupabaseClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

type DailyFrameDomain = "body" | "being" | "balance" | "business";

type Responses = Record<string, unknown> | null | undefined;

type DailyFrameInput = {
  frame_date: string;
  core4_domain: DailyFrameDomain;
  gratitude_body: string;
  gratitude_being: string;
  gratitude_balance: string;
  gratitude_business: string;
  current_state: string;
  target_outcome: string;
  measurable_proof: string;
  likely_obstacle: string;
  if_then_plan: string;
  declared_commitment: string;
};

type FlowSessionLike = {
  id: string;
  user_id?: string;
  responses_json?: Responses;
  completed_at?: string | null;
};

const DEFAULT_TIMEZONE = "America/New_York";

const domainLabels: Record<DailyFrameDomain, string> = {
  body: "Body",
  being: "Being",
  balance: "Balance",
  business: "Business",
};

function clean(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function normalizeDomain(value: unknown): DailyFrameDomain {
  const normalized = clean(value).toLowerCase();
  if (
    normalized === "body" ||
    normalized === "being" ||
    normalized === "balance" ||
    normalized === "business"
  ) {
    return normalized;
  }
  return "business";
}

function dateOnly(value?: string | null): string {
  const date = value ? new Date(value) : new Date();
  const y = date.getUTCFullYear();
  const m = String(date.getUTCMonth() + 1).padStart(2, "0");
  const d = String(date.getUTCDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function localDate(timezone?: string | null, value?: string | null): string {
  try {
    return new Intl.DateTimeFormat("en-CA", {
      timeZone: timezone || DEFAULT_TIMEZONE,
    }).format(value ? new Date(value) : new Date());
  } catch {
    return dateOnly(value);
  }
}

export function extractDailyFrameInput(
  responses: Responses,
  frameDate = dateOnly(),
): DailyFrameInput {
  const source = responses ?? {};
  const declaredCommitment = clean(source.declared_commitment) ||
    clean(source.actions);

  return {
    frame_date: frameDate,
    core4_domain: normalizeDomain(source.domain),
    gratitude_body: clean(source.gratitude_body),
    gratitude_being: clean(source.gratitude_being),
    gratitude_balance: clean(source.gratitude_balance),
    gratitude_business: clean(source.gratitude_business),
    current_state: clean(source.current_state),
    target_outcome: clean(source.target_outcome),
    measurable_proof: clean(source.measurable_proof),
    likely_obstacle: clean(source.likely_obstacle),
    if_then_plan: clean(source.if_then_plan),
    declared_commitment: declaredCommitment,
  };
}

export function buildDailyFrameAnalysis(input: DailyFrameInput) {
  const gratitudeSnapshot = [
    input.gratitude_body && `Body: ${input.gratitude_body}`,
    input.gratitude_being && `Being: ${input.gratitude_being}`,
    input.gratitude_balance && `Balance: ${input.gratitude_balance}`,
    input.gratitude_business && `Business: ${input.gratitude_business}`,
  ].filter(Boolean).join(" | ");

  const card = {
    today_lane: domainLabels[input.core4_domain],
    gratitude_snapshot: gratitudeSnapshot,
    todays_win: input.target_outcome,
    proof: input.measurable_proof,
    likely_obstacle: input.likely_obstacle,
    if_then_plan: input.if_then_plan,
    declared_action: input.declared_commitment,
    coach_check_tomorrow:
      `Tomorrow, check whether "${input.measurable_proof || input.declared_commitment}" happened.`,
  };

  return {
    headline: "Daily Frame Set",
    congratulations:
      "You named one lane, one measurable win, and one plan for the obstacle before the day can start pulling you sideways.",
    deep_dive_insight: "",
    connections: [],
    themes: [card.today_lane],
    provocative_question: card.coach_check_tomorrow,
    suggested_action: input.declared_commitment,
    daily_frame_card: card,
  };
}

export async function upsertDailyFrameCommitment(
  supabase: SupabaseClient,
  session: FlowSessionLike,
) {
  if (!session.user_id) return null;

  const input = extractDailyFrameInput(
    session.responses_json,
    localDate(DEFAULT_TIMEZONE, session.completed_at),
  );

  const payload = {
    ...input,
    user_id: session.user_id,
    flow_session_id: session.id,
    status: "open",
    completed_at: null,
  };

  const { data: existing, error: lookupError } = await supabase
    .from("daily_frame_commitments")
    .select("id")
    .eq("user_id", session.user_id)
    .eq("frame_date", input.frame_date)
    .maybeSingle();

  if (lookupError) throw lookupError;

  if (existing?.id) {
    const { error } = await supabase
      .from("daily_frame_commitments")
      .update(payload)
      .eq("id", existing.id);
    if (error) throw error;
    return existing.id;
  }

  const { data: inserted, error } = await supabase
    .from("daily_frame_commitments")
    .insert(payload)
    .select("id")
    .single();

  if (error) throw error;
  return inserted.id;
}
