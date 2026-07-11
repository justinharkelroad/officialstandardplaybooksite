import { format } from "date-fns";

export type DailyFrameDomain = "body" | "being" | "balance" | "business";

export type DailyFrameStatus = "open" | "completed" | "overdue" | "missed";

export type DailyFrameResponses = Record<string, string | null | undefined>;

export interface DailyFrameInput {
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
}

// Reworked from source: single-actor model — one user_id, no agency/staff.
export interface DailyFrameCommitment extends DailyFrameInput {
  id: string;
  user_id: string;
  flow_session_id: string | null;
  status: DailyFrameStatus;
  completed_at: string | null;
  created_at: string;
  updated_at: string;
}

export type DailyFrameEffectiveStatus = DailyFrameStatus | "no_frame";

export interface DailyFrameCard {
  today_lane: string;
  gratitude_snapshot: string;
  todays_win: string;
  proof: string;
  likely_obstacle: string;
  if_then_plan: string;
  declared_action: string;
  coach_check_tomorrow: string;
}

const DOMAINS: DailyFrameDomain[] = ["body", "being", "balance", "business"];

const DOMAIN_LABELS: Record<DailyFrameDomain, string> = {
  body: "Body",
  being: "Being",
  balance: "Balance",
  business: "Business",
};

function clean(value: string | null | undefined): string {
  return typeof value === "string" ? value.trim() : "";
}

export function normalizeDailyFrameDomain(value: string | null | undefined): DailyFrameDomain {
  const normalized = clean(value).toLowerCase();
  return DOMAINS.includes(normalized as DailyFrameDomain)
    ? (normalized as DailyFrameDomain)
    : "business";
}

export function getTodayFrameDate(now = new Date()): string {
  return format(now, "yyyy-MM-dd");
}

export function getLocalFrameDate(timezone: string, now = new Date()): string {
  try {
    return new Intl.DateTimeFormat("en-CA", { timeZone: timezone }).format(now);
  } catch {
    return getTodayFrameDate(now);
  }
}

export function extractDailyFrameInput(
  responses: DailyFrameResponses,
  frameDate = getTodayFrameDate(),
): DailyFrameInput {
  const declared = clean(responses.declared_commitment) || clean(responses.actions);

  return {
    frame_date: frameDate,
    core4_domain: normalizeDailyFrameDomain(responses.domain),
    gratitude_body: clean(responses.gratitude_body),
    gratitude_being: clean(responses.gratitude_being),
    gratitude_balance: clean(responses.gratitude_balance),
    gratitude_business: clean(responses.gratitude_business),
    current_state: clean(responses.current_state),
    target_outcome: clean(responses.target_outcome),
    measurable_proof: clean(responses.measurable_proof),
    likely_obstacle: clean(responses.likely_obstacle),
    if_then_plan: clean(responses.if_then_plan),
    declared_commitment: declared,
  };
}

export function buildDailyFrameCard(input: DailyFrameInput): DailyFrameCard {
  const lane = DOMAIN_LABELS[input.core4_domain];
  const gratitudeItems = [
    input.gratitude_body && `Body: ${input.gratitude_body}`,
    input.gratitude_being && `Being: ${input.gratitude_being}`,
    input.gratitude_balance && `Balance: ${input.gratitude_balance}`,
    input.gratitude_business && `Business: ${input.gratitude_business}`,
  ].filter(Boolean);

  return {
    today_lane: lane,
    gratitude_snapshot: gratitudeItems.join(" | "),
    todays_win: input.target_outcome,
    proof: input.measurable_proof,
    likely_obstacle: input.likely_obstacle,
    if_then_plan: input.if_then_plan,
    declared_action: input.declared_commitment,
    coach_check_tomorrow: `Tomorrow, check whether "${input.measurable_proof || input.declared_commitment}" happened.`,
  };
}

export function getEffectiveDailyFrameStatus(
  status: DailyFrameStatus,
  frameDate: string,
  today = getTodayFrameDate(),
): DailyFrameStatus {
  if (status === "completed") return "completed";
  if (frameDate < today) return status === "missed" ? "missed" : "overdue";
  return status;
}

export function replaceDailyFrameForSameActorAndDate(
  existing: DailyFrameCommitment[],
  next: DailyFrameCommitment,
): DailyFrameCommitment[] {
  return [
    ...existing.filter(
      (row) => !(row.frame_date === next.frame_date && row.user_id === next.user_id),
    ),
    next,
  ];
}
