// submit_flow_answer — ported to the Standard Playbook member app.
// Auth: per-session session_token (constant-time compare in verifyFlowSession).
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import {
  buildFlowRequestLogEnvelope,
  corsHeaders,
  createServiceClient,
  errorResponse,
  getCurrentQuestion,
  getNextVisibleQuestion,
  jsonResponse,
  mergeFlowAgentMetadata,
  methodNotAllowed,
  normalizeSelectAnswer,
  parseJsonBody,
  serializeQuestion,
  verifyFlowSession,
  withEdgeToolExecutor,
} from "../_shared/flow_agent_runtime.ts";
import { getSupabaseServiceKey } from "../_shared/supabaseKeys.ts";
import { shouldRunServerVoiceCoach } from "../_shared/voice_flow_coach.ts";

type RequestBody = {
  session_id?: unknown;
  session_token?: unknown;
  question_id?: unknown;
  answer?: unknown;
  flow_agent_run_id?: unknown;
  conversation_id?: unknown;
  conversationId?: unknown;
  client_tool_executor?: unknown;
};

type CoachResult = {
  coach_message_id?: string;
  reflection?: string;
  probe?: string | null;
  resolution?: string | null;
  probe_resolved?: boolean;
  skipped?: boolean;
  reason?: string;
};

async function requestCoach(
  body: Record<string, unknown>,
): Promise<CoachResult> {
  try {
    const serviceKey = getSupabaseServiceKey();
    const response = await fetch(
      `${
        (Deno.env.get("SUPABASE_URL") ?? "").replace(/\/$/, "")
      }/functions/v1/flow_coach_reflect`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          apikey: serviceKey,
          Authorization: `Bearer ${serviceKey}`,
        },
        body: JSON.stringify(body),
      },
    );
    const result = await response.json().catch(() => null);
    if (!response.ok || !result || typeof result !== "object") {
      console.warn("[submit_flow_answer] voice coach failed open", {
        status: response.status,
        response: result,
      });
      return { skipped: true, reason: "voice_coach_unavailable" };
    }
    return result as CoachResult;
  } catch (error) {
    console.warn("[submit_flow_answer] voice coach failed open", {
      error: error instanceof Error ? error.message : String(error),
    });
    return { skipped: true, reason: "voice_coach_unavailable" };
  }
}

function coachFields(coach: CoachResult): Record<string, unknown> {
  return {
    coach_message_id: coach.coach_message_id,
    coach_reflection: coach.reflection,
    coach_probe: coach.probe ?? null,
    coach_resolution: coach.resolution ?? null,
    coach_skipped: coach.skipped ?? false,
    coach_skip_reason: coach.reason,
    probe_resolved: coach.probe_resolved ?? false,
  };
}

serve(async (req) => {
  const startedAt = Date.now();
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }
  if (req.method !== "POST") return methodNotAllowed();

  let sessionId: string | undefined;
  let questionId: string | undefined;

  try {
    const body = await parseJsonBody<RequestBody>(req);
    sessionId = typeof body?.session_id === "string"
      ? body.session_id
      : undefined;
    const sessionToken = typeof body?.session_token === "string"
      ? body.session_token
      : undefined;
    questionId = typeof body?.question_id === "string"
      ? body.question_id
      : undefined;
    let answer = typeof body?.answer === "string" ? body.answer.trim() : "";

    console.log(
      "[submit_flow_answer] request_source",
      buildFlowRequestLogEnvelope(req, "submit_flow_answer", body),
    );

    if (!questionId) {
      return errorResponse(400, "INVALID_REQUEST", "question_id is required.");
    }

    const supabase = createServiceClient();
    const verified = await verifyFlowSession(supabase, sessionId, sessionToken);
    if (!verified.ok) return verified.response;

    const { session, answers, questions } = verified.value;
    const runServerVoiceCoach = shouldRunServerVoiceCoach(req, body);
    await mergeFlowAgentMetadata(supabase, req, session, body, {
      last_flow_tool: "submit_flow_answer",
    });
    if (session.status === "completed" || session.status === "abandoned") {
      return errorResponse(
        400,
        "INVALID_REQUEST",
        "This flow session is not accepting answers.",
      );
    }

    if (runServerVoiceCoach) {
      const { data: pendingProbe, error: pendingProbeError } = await supabase
        .from("flow_coach_messages")
        .select("id,question_id,reflection,probe")
        .eq("flow_session_id", session.id)
        .not("probe", "is", null)
        .is("probe_answer", null)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();
      if (pendingProbeError) throw pendingProbeError;

      if (pendingProbe?.probe) {
        if (!answer) {
          return errorResponse(
            400,
            "ANSWER_REQUIRED",
            "This coaching question requires an answer.",
          );
        }
        const coach = await requestCoach({
          session_id: session.id,
          session_token: sessionToken,
          question_id: pendingProbe.question_id,
          probe_answer: answer,
          allow_probe: false,
        });
        const resumedQuestion = getCurrentQuestion(
          questions,
          answers,
          session.current_question_id,
        );
        return jsonResponse(
          200,
          withEdgeToolExecutor(req, body, {
            success: true,
            next_question: serializeQuestion(resumedQuestion),
            is_complete: resumedQuestion === null,
            answers_so_far: answers,
            ...coachFields(coach),
          }),
        );
      }
    }

    const currentQuestion = getCurrentQuestion(
      questions,
      answers,
      session.current_question_id,
    );
    if (!currentQuestion) {
      return errorResponse(
        400,
        "QUESTION_NOT_FOUND",
        "No current question is available for this session.",
      );
    }

    if (currentQuestion.id !== questionId) {
      return errorResponse(
        400,
        "QUESTION_OUT_OF_ORDER",
        "question_id does not match the current question.",
      );
    }

    if (currentQuestion.required && answer.length === 0) {
      return errorResponse(
        400,
        "ANSWER_REQUIRED",
        "This question requires an answer.",
      );
    }

    if (currentQuestion.type === "select" && answer) {
      const normalizedAnswer = normalizeSelectAnswer(currentQuestion, answer);
      if (!normalizedAnswer) {
        const retryQuestion = serializeQuestion(currentQuestion);
        return jsonResponse(
          200,
          withEdgeToolExecutor(req, body, {
            success: true,
            validation_error: true,
            user_message: `Please answer with one of these options: ${
              (currentQuestion.options ?? []).join(", ")
            }.`,
            retry_question: retryQuestion,
            next_question: retryQuestion,
            is_complete: false,
            answers_so_far: answers,
            error: {
              code: "INVALID_SELECT_OPTION",
              message: "Answer must be one of the question options.",
              question: serializeQuestion(currentQuestion),
              allowed_options: currentQuestion.options ?? [],
            },
          }),
        );
      }
      answer = normalizedAnswer;
    }

    const nextAnswers = { ...answers, [questionId]: answer };
    const nextQuestion = getNextVisibleQuestion(
      questions,
      nextAnswers,
      questionId,
    );
    const updateData: Record<string, unknown> = {
      responses_json: nextAnswers,
      current_question_id: nextQuestion?.id ?? null,
      status: nextQuestion ? "in_progress" : "awaiting_completion",
      updated_at: new Date().toISOString(),
    };

    const titleQuestion = questions.find((question) =>
      question.id === "title" || question.interpolation_key === "stack_title"
    );
    if (titleQuestion?.id === questionId) updateData.title = answer;
    if (questionId === "domain") updateData.domain = answer;

    const { error: updateError } = await supabase
      .from("flow_sessions")
      .update(updateData)
      .eq("id", session.id);

    if (updateError) throw updateError;

    console.log("[submit_flow_answer] success", {
      session_id: session.id,
      user_id: session.user_id,
      question_id: questionId,
      flow_agent_run_id: body?.flow_agent_run_id ?? null,
      current_question_id_before: currentQuestion.id,
      current_question_id_after: nextQuestion?.id ?? null,
      flow_slug: verified.value.template.slug,
      answerLength: answer.length,
      status: nextQuestion ? "in_progress" : "awaiting_completion",
      duration_ms: Date.now() - startedAt,
    });

    const coach = runServerVoiceCoach
      ? await requestCoach({
        session_id: session.id,
        session_token: sessionToken,
        question_id: questionId,
        answer,
        allow_probe: true,
      })
      : null;
    const hasCoachProbe = Boolean(coach?.probe);

    return jsonResponse(
      200,
      withEdgeToolExecutor(req, body, {
        success: true,
        next_question: hasCoachProbe ? null : serializeQuestion(nextQuestion),
        is_complete: hasCoachProbe ? false : nextQuestion === null,
        answers_so_far: nextAnswers,
        ...(coach ? coachFields(coach) : {}),
      }),
    );
  } catch (error) {
    console.error("[submit_flow_answer] failed", {
      session_id: sessionId,
      question_id: questionId,
      duration_ms: Date.now() - startedAt,
      error: error instanceof Error ? error.message : String(error),
    });
    return errorResponse(
      500,
      "INTERNAL_ERROR",
      "Unable to submit flow answer.",
    );
  }
});
