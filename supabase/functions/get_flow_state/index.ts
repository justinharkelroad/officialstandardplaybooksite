// get_flow_state — ported to the Standard Playbook member app.
// Auth: per-session session_token (constant-time compare in verifyFlowSession).
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import {
  corsHeaders,
  buildFlowRequestLogEnvelope,
  createServiceClient,
  errorResponse,
  getCurrentQuestion,
  getQuestionIndex,
  getVisibleQuestions,
  jsonResponse,
  mergeFlowAgentMetadata,
  methodNotAllowed,
  parseJsonBody,
  serializeQuestion,
  withEdgeToolExecutor,
  verifyFlowSession,
} from "../_shared/flow_agent_runtime.ts";

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
      "[get_flow_state] request_source",
      buildFlowRequestLogEnvelope(req, "get_flow_state", body),
    );

    const supabase = createServiceClient();
    const verified = await verifyFlowSession(supabase, sessionId, sessionToken);
    if (!verified.ok) return verified.response;

    const { session, template, answers, questions } = verified.value;
    await mergeFlowAgentMetadata(supabase, req, session, body, {
      last_flow_tool: "get_flow_state",
    });
    const visibleQuestions = getVisibleQuestions(questions, answers);
    const currentQuestion = session.status === "completed"
      ? null
      : getCurrentQuestion(questions, answers, session.current_question_id);
    const currentQuestionIndex = getQuestionIndex(
      visibleQuestions,
      currentQuestion?.id ?? null,
    );
    const isComplete = session.status === "completed" ||
      session.status === "awaiting_completion" ||
      currentQuestion === null;
    const pendingProbeResult = await supabase.from("flow_coach_messages")
      .select("id,question_id,reflection,probe")
      .eq("flow_session_id", session.id)
      .not("probe", "is", null)
      .is("probe_answer", null)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();
    if (pendingProbeResult.error) throw pendingProbeResult.error;
    const pendingProbe = pendingProbeResult.data?.probe
      ? {
        coach_message_id: pendingProbeResult.data.id,
        question_id: pendingProbeResult.data.question_id,
        reflection: pendingProbeResult.data.reflection,
        probe: pendingProbeResult.data.probe,
      }
      : null;

    console.log("[get_flow_state] success", {
      session_id: session.id,
      user_id: session.user_id,
      flow_slug: template.slug,
      flow_agent_run_id: body?.flow_agent_run_id ?? null,
      current_question_id_before: session.current_question_id,
      current_question_id_after: currentQuestion?.id ?? null,
      duration_ms: Date.now() - startedAt,
    });

    return jsonResponse(200, withEdgeToolExecutor(req, body, {
      session_id: session.id,
      flow_slug: template.slug,
      flow_name: template.name,
      current_question: serializeQuestion(currentQuestion),
      current_question_index: currentQuestionIndex,
      total_visible_questions: visibleQuestions.length,
      answers,
      is_complete: isComplete && !pendingProbe,
      coach_probe: pendingProbe,
    }));
  } catch (error) {
    console.error("[get_flow_state] failed", {
      session_id: sessionId,
      duration_ms: Date.now() - startedAt,
      error: error instanceof Error ? error.message : String(error),
    });
    return errorResponse(500, "INTERNAL_ERROR", "Unable to load flow state.");
  }
});
