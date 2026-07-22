// submit_flow_answer — ported to the Standard Playbook member app.
// Auth: per-session session_token (constant-time compare in verifyFlowSession).
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import {
  corsHeaders,
  buildFlowRequestLogEnvelope,
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
  withEdgeToolExecutor,
  verifyFlowSession,
} from "../_shared/flow_agent_runtime.ts";

type RequestBody = {
  session_id?: unknown;
  session_token?: unknown;
  question_id?: unknown;
  answer?: unknown;
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

    const skippedOptionalQuestion = !currentQuestion.required && /^(pass|skip|prefer not to answer)$/i.test(answer);
    if (currentQuestion.type === "select" && answer && !skippedOptionalQuestion) {
      const normalizedAnswer = normalizeSelectAnswer(currentQuestion, answer);
      if (!normalizedAnswer) {
        const retryQuestion = serializeQuestion(currentQuestion);
        return jsonResponse(200, withEdgeToolExecutor(req, body, {
          success: true,
          validation_error: true,
          user_message:
            `Please answer with one of these options: ${(currentQuestion.options ?? []).join(", ")}.`,
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
        }));
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

    return jsonResponse(200, withEdgeToolExecutor(req, body, {
      success: true,
      next_question: serializeQuestion(nextQuestion),
      is_complete: nextQuestion === null,
      answers_so_far: nextAnswers,
    }));
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
