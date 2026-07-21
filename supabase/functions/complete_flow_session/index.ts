// complete_flow_session — ported to the Standard Playbook member app.
// Auth: per-session session_token (constant-time compare in verifyFlowSession).
// Triggers analyze_flow_session fn-to-fn with the service-role key via
// EdgeRuntime.waitUntil so completion returns immediately.
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import {
  corsHeaders,
  buildFlowRequestLogEnvelope,
  createServiceClient,
  errorResponse,
  getMissingRequiredQuestions,
  jsonResponse,
  mergeFlowAgentMetadata,
  methodNotAllowed,
  parseJsonBody,
  withEdgeToolExecutor,
  verifyFlowSession,
} from "../_shared/flow_agent_runtime.ts";
import { getSupabaseServiceKey } from "../_shared/supabaseKeys.ts";
import { isProfileFlowSlug } from "../_shared/profileFlow.ts";

declare const EdgeRuntime:
  | { waitUntil(promise: Promise<unknown>): void }
  | undefined;

type RequestBody = {
  session_id?: unknown;
  session_token?: unknown;
  flow_agent_run_id?: unknown;
  conversation_id?: unknown;
  conversationId?: unknown;
};

serve(async (req) => {
  const startedAt = Date.now();
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }
  if (req.method !== "POST") return methodNotAllowed();

  let sessionId: string | undefined;

  try {
    const body = await parseJsonBody<RequestBody>(req);
    sessionId = typeof body?.session_id === "string"
      ? body.session_id
      : undefined;
    const sessionToken = typeof body?.session_token === "string"
      ? body.session_token
      : undefined;

    console.log(
      "[complete_flow_session] request_source",
      buildFlowRequestLogEnvelope(req, "complete_flow_session", body),
    );

    const supabase = createServiceClient();
    const verified = await verifyFlowSession(supabase, sessionId, sessionToken);
    if (!verified.ok) return verified.response;

    const { session, answers, questions } = verified.value;
    await mergeFlowAgentMetadata(supabase, req, session, body, {
      last_flow_tool: "complete_flow_session",
    });
    if (session.status === "abandoned") {
      return errorResponse(
        400,
        "INVALID_REQUEST",
        "This flow session has been abandoned.",
      );
    }

    if (session.status === "completed") {
      const completedAt = session.completed_at ?? new Date().toISOString();
      if (!session.completed_at) {
        const { error: timestampError } = await supabase
          .from("flow_sessions")
          .update({ completed_at: completedAt })
          .eq("id", session.id)
          .is("completed_at", null);
        if (timestampError) throw timestampError;
      }

      const profileInterview = isProfileFlowSlug(verified.value.template.slug);
      const analysisStarted = profileInterview || session.ai_analysis_json
        ? false
        : triggerAnalysis(session.id);
      const profileExtractionStarted = profileInterview
        ? triggerProfileExtraction(session.id)
        : false;

      return jsonResponse(200, withEdgeToolExecutor(req, body, {
        success: true,
        session_id: session.id,
        completed_at: completedAt,
        answers,
        analysis_started: analysisStarted,
        profile_extraction_started: profileExtractionStarted,
        already_completed: true,
      }));
    }

    const missingQuestionIds = getMissingRequiredQuestions(questions, answers);
    if (missingQuestionIds.length > 0) {
      return errorResponse(
        400,
        "REQUIRED_ANSWERS_MISSING",
        "Flow is missing required answers.",
        {
          missing_question_ids: missingQuestionIds,
        },
      );
    }

    const completedAt = new Date().toISOString();
    const { data: completedRow, error: updateError } = await supabase
      .from("flow_sessions")
      .update({
        status: "completed",
        completed_at: completedAt,
        current_question_id: null,
        updated_at: completedAt,
      })
      .eq("id", session.id)
      .neq("status", "completed")
      .select("id, completed_at")
      .maybeSingle();

    if (updateError) throw updateError;

    // A concurrent completion may have won the conditional update. That call
    // owns the analysis trigger, so this request must not start a duplicate.
    const profileInterview = isProfileFlowSlug(verified.value.template.slug);
    const analysisStarted = completedRow && !profileInterview
      ? triggerAnalysis(session.id)
      : false;
    const profileExtractionStarted = completedRow && profileInterview
      ? triggerProfileExtraction(session.id)
      : false;
    let effectiveCompletedAt = completedRow?.completed_at ?? session.completed_at;
    if (!effectiveCompletedAt) {
      const { data: currentRow, error: currentRowError } = await supabase
        .from("flow_sessions")
        .select("completed_at")
        .eq("id", session.id)
        .single();
      if (currentRowError) throw currentRowError;
      effectiveCompletedAt = currentRow.completed_at;
    }

    console.log("[complete_flow_session] success", {
      session_id: session.id,
      user_id: session.user_id,
      flow_slug: verified.value.template.slug,
      flow_agent_run_id: body?.flow_agent_run_id ?? null,
      current_question_id_before: session.current_question_id,
      current_question_id_after: null,
      analysis_started: analysisStarted,
      duration_ms: Date.now() - startedAt,
    });

    return jsonResponse(200, withEdgeToolExecutor(req, body, {
      success: true,
      session_id: session.id,
      completed_at: effectiveCompletedAt,
      answers,
      analysis_started: analysisStarted,
      profile_extraction_started: profileExtractionStarted,
      already_completed: !completedRow,
    }));
  } catch (error) {
    console.error("[complete_flow_session] failed", {
      session_id: sessionId,
      duration_ms: Date.now() - startedAt,
      error: error instanceof Error ? error.message : String(error),
    });
    return errorResponse(
      500,
      "INTERNAL_ERROR",
      "Unable to complete flow session.",
    );
  }
});

function triggerAnalysis(sessionId: string): boolean {
  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  let serviceRoleKey: string;
  try {
    serviceRoleKey = getSupabaseServiceKey();
  } catch {
    return false;
  }
  if (!supabaseUrl) return false;

  const analysisPromise = fetch(
    `${supabaseUrl}/functions/v1/analyze_flow_session`,
    {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${serviceRoleKey}`,
        "apikey": serviceRoleKey,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ session_id: sessionId }),
    },
  ).then(async (response) => {
    if (!response.ok) {
      console.error(
        "[complete_flow_session] analyze_flow_session returned non-2xx",
        {
          session_id: sessionId,
          status: response.status,
        },
      );
    }
  }).catch((error) => {
    console.error(
      "[complete_flow_session] analyze_flow_session trigger failed",
      {
        session_id: sessionId,
        error: error instanceof Error ? error.message : String(error),
      },
    );
  });

  if (typeof EdgeRuntime !== "undefined") {
    EdgeRuntime.waitUntil(analysisPromise);
  }

  return true;
}

function triggerProfileExtraction(sessionId: string): boolean {
  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  let serviceRoleKey: string;
  try {
    serviceRoleKey = getSupabaseServiceKey();
  } catch {
    return false;
  }
  if (!supabaseUrl) return false;

  const extractionPromise = fetch(
    `${supabaseUrl}/functions/v1/extract_flow_profile`,
    {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${serviceRoleKey}`,
        "apikey": serviceRoleKey,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ session_id: sessionId }),
    },
  ).then(async (response) => {
    if (!response.ok) {
      console.error("[complete_flow_session] extract_flow_profile returned non-2xx", {
        session_id: sessionId,
        status: response.status,
      });
    }
  }).catch((error) => {
    console.error("[complete_flow_session] extract_flow_profile trigger failed", {
      session_id: sessionId,
      error: error instanceof Error ? error.message : String(error),
    });
  });

  if (typeof EdgeRuntime !== "undefined") EdgeRuntime.waitUntil(extractionPromise);
  return true;
}
