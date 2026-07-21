import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { corsHeaders } from "../_shared/cors.ts";
import { isResponse, requireAdminMember } from "../_shared/memberAuth.ts";
import { distillInsights, retrieveInsights } from "../_shared/flowCoach/index.ts";
import { isProfileFlowSlug, joinedFlowTemplateSlug } from "../_shared/profileFlow.ts";

function response(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  if (req.method !== "POST") return response({ error: "POST required" }, 405);
  const member = await requireAdminMember(req);
  if (isResponse(member)) return member;

  try {
    const body = await req.json().catch(() => ({})) as {
      cursor?: unknown;
      limit?: unknown;
      session_ids?: unknown;
    };
    const limit = Math.min(Math.max(Number(body.limit) || 10, 1), 25);
    const requestedSessionIds = Array.isArray(body.session_ids)
      ? body.session_ids.filter((id): id is string => typeof id === "string").slice(0, 25)
      : [];
    let query = member.supabase.from("flow_sessions")
      .select("id,user_id,title,responses_json,completed_at,flow_template:flow_templates(slug,questions_json)")
      .eq("status", "completed")
      .order("id", { ascending: true })
      .limit(limit * 3);
    if (requestedSessionIds.length) {
      query = query.in("id", requestedSessionIds).limit(requestedSessionIds.length);
    } else if (typeof body.cursor === "string") {
      query = query.gt("id", body.cursor);
    }
    const sessions = await query;
    if (sessions.error) throw sessions.error;

    let processed = 0;
    let skipped = 0;
    let failed = 0;
    const failedSessionIds: string[] = [];
    let lastCursor: string | null = null;
    let examined = 0;
    const candidates = sessions.data ?? [];
    for (const session of candidates) {
      if (processed >= limit) break;
      examined += 1;
      lastCursor = session.id;
      try {
        if (isProfileFlowSlug(joinedFlowTemplateSlug(session.flow_template))) {
          skipped += 1;
          continue;
        }
        const existing = await member.supabase.from("flow_member_insights")
          .select("id", { count: "exact", head: true }).eq("source_session_id", session.id);
        if (existing.error) throw existing.error;
        if ((existing.count ?? 0) > 0) { skipped += 1; continue; }

        const profile = await member.supabase.from("flow_profiles")
          .select("coach_memory_paused").eq("user_id", session.user_id).maybeSingle();
        if (profile.error) throw profile.error;
        if (profile.data?.coach_memory_paused) { skipped += 1; continue; }

        const flowTemplate = Array.isArray(session.flow_template)
          ? session.flow_template[0]
          : session.flow_template;
        const flowSlug = flowTemplate?.slug ?? "";
        const questions = typeof flowTemplate?.questions_json === "string"
          ? JSON.parse(flowTemplate.questions_json)
          : flowTemplate?.questions_json ?? [];
        const priorInsights = await retrieveInsights(member.supabase, session.user_id, {
          flowSlug,
          stepKey: "",
          limit: 20,
        });
        const rows = await distillInsights({
          session: {
            id: session.id,
            user_id: session.user_id,
            title: session.title,
            flow_slug: flowSlug,
          },
          responses: session.responses_json ?? {},
          priorInsights,
          questions,
          config: {
            model: Deno.env.get("FLOW_COACH_DISTILL_MODEL") ?? "gpt-5.4-mini",
            openaiApiKey: Deno.env.get("OPENAI_API_KEY"),
            anthropicApiKey: Deno.env.get("ANTHROPIC_API_KEY"),
          },
        });
        if (rows.length) {
          const inserted = await member.supabase.from("flow_member_insights").upsert(rows, {
            onConflict: "source_session_id,kind,content",
            ignoreDuplicates: true,
          });
          if (inserted.error) throw inserted.error;
        }
        processed += 1;
      } catch (error) {
        failed += 1;
        failedSessionIds.push(session.id);
        console.warn("[flow_coach_backfill] session skipped", {
          session_id: session.id,
          error: error instanceof Error ? error.message : String(error),
        });
      }
    }

    const stoppedAtBatchLimit = !requestedSessionIds.length && processed >= limit && examined < candidates.length;

    return response({
      success: true,
      processed,
      skipped,
      failed,
      failed_session_ids: failedSessionIds,
      next_cursor: requestedSessionIds.length ? null : lastCursor,
      done: requestedSessionIds.length > 0 || (!stoppedAtBatchLimit && candidates.length < limit * 3),
    });
  } catch (error) {
    console.error("[flow_coach_backfill] failed", error);
    return response({ error: "Backfill batch failed" }, 500);
  }
});
