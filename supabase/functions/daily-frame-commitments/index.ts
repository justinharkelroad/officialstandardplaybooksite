// daily-frame-commitments — ported to the Standard Playbook member app.
// Owner-only rewrite: actions get_my_frames (default) and mark_complete,
// both scoped to the member (user_id). The source's staff actor path,
// team_summary, and admin_summary were deleted along with their
// roster/role lookups. mark_complete sets status='completed' AND
// completed_at together (the table CHECK requires them to match).
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { corsHeaders } from "../_shared/cors.ts";
import { requireActiveMember } from "../_shared/memberAuth.ts";

type DbClient = any;

type Action = "get_my_frames" | "mark_complete";

type Body = {
  action?: Action;
  commitment_id?: string;
  history_days?: number;
};

type Commitment = {
  id: string;
  user_id: string;
  flow_session_id: string | null;
  frame_date: string;
  core4_domain: string;
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
  status: string;
  completed_at: string | null;
  created_at: string;
  updated_at: string;
};

const DEFAULT_TIMEZONE = "America/New_York";

function json(status: number, body: Record<string, unknown>) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

function utcDateParts(date: Date): string {
  const y = date.getUTCFullYear();
  const m = String(date.getUTCMonth() + 1).padStart(2, "0");
  const d = String(date.getUTCDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function localDate(timezone?: string | null, offsetDays = 0): string {
  const date = new Date();
  if (offsetDays !== 0) date.setUTCDate(date.getUTCDate() + offsetDays);
  try {
    return new Intl.DateTimeFormat("en-CA", {
      timeZone: timezone || DEFAULT_TIMEZONE,
    }).format(date);
  } catch {
    return utcDateParts(date);
  }
}

function todayDate(timezone?: string | null): string {
  return localDate(timezone);
}

function daysAgo(days: number, timezone?: string | null): string {
  return localDate(timezone, -days);
}

function effectiveStatus(row: Commitment, today = todayDate()) {
  if (row.status === "completed") return "completed";
  if (row.frame_date < today) return row.status === "missed" ? "missed" : "overdue";
  return row.status;
}

async function markOverdueRows(supabase: DbClient, userId: string) {
  const today = todayDate(DEFAULT_TIMEZONE);
  const { error } = await supabase
    .from("daily_frame_commitments")
    .update({ status: "overdue" })
    .eq("status", "open")
    .lt("frame_date", today)
    .eq("user_id", userId);
  if (error) throw error;
}

async function getMyFrames(supabase: DbClient, userId: string, historyDays: number) {
  await markOverdueRows(supabase, userId);

  const today = todayDate(DEFAULT_TIMEZONE);
  const since = daysAgo(Math.max(1, Math.min(historyDays, 30)) - 1, DEFAULT_TIMEZONE);
  const { data, error } = await supabase
    .from("daily_frame_commitments")
    .select("*")
    .eq("user_id", userId)
    .gte("frame_date", since)
    .order("frame_date", { ascending: false })
    .order("updated_at", { ascending: false });

  if (error) throw error;

  const rows = (data ?? []) as Commitment[];
  const todayRow = rows.find((row) => row.frame_date === today) ?? null;
  return {
    today: todayRow,
    recent: rows
      .filter((row) => row.id !== todayRow?.id)
      .map((row) => ({ ...row, effective_status: effectiveStatus(row, today) })),
  };
}

async function markComplete(supabase: DbClient, userId: string, commitmentId: string) {
  const { data: existing, error: selectError } = await supabase
    .from("daily_frame_commitments")
    .select("*")
    .eq("id", commitmentId)
    .eq("user_id", userId)
    .maybeSingle();

  if (selectError) throw selectError;
  if (!existing) return json(404, { error: "Commitment not found" });

  const completedAt = new Date().toISOString();
  const { data, error } = await supabase
    .from("daily_frame_commitments")
    .update({ status: "completed", completed_at: completedAt })
    .eq("id", commitmentId)
    .eq("user_id", userId)
    .select("*")
    .maybeSingle();

  if (error) throw error;
  if (!data) return json(404, { error: "Commitment not found" });
  return json(200, { commitment: data });
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  if (req.method !== "POST") return json(405, { error: "Method not allowed" });

  try {
    const member = await requireActiveMember(req);
    if (member instanceof Response) return member;
    const supabase = member.supabase;
    const userId = member.userId;

    const body = (await req.json().catch(() => ({}))) as Body;

    if (body.action === "mark_complete") {
      if (!body.commitment_id) return json(400, { error: "commitment_id is required" });
      return await markComplete(supabase, userId, body.commitment_id);
    }

    const frames = await getMyFrames(supabase, userId, body.history_days ?? 7);
    return json(200, frames);
  } catch (error) {
    console.error("[daily-frame-commitments] failed", error);
    return json(500, { error: "Unable to load Daily Frame commitments" });
  }
});
