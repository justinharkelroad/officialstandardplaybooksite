// save_flow_agent_responses — ported to the Standard Playbook member app.
// Auth: per-session session_token (constant-time compare in verifyFlowSession).
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import {
  corsHeaders,
  createServiceClient,
  errorResponse,
  getNextVisibleQuestion,
  getVisibleQuestions,
  jsonResponse,
  methodNotAllowed,
  normalizeSelectAnswer,
  parseJsonBody,
  serializeQuestion,
  verifyFlowSession,
} from "../_shared/flow_agent_runtime.ts";
import type { FlowQuestion } from "../_shared/flow_types.ts";

type RequestBody = {
  session_id?: unknown;
  session_token?: unknown;
  responses?: unknown;
  question_id?: unknown;
  answer?: unknown;
};

const DECLARED_ACTION_KEY_PATTERN =
  /^__declared_action_\d+_(original|refined|final|added_to_weekly_playbook)$/;

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

    const declaredActionUpdates = normalizeDeclaredActionUpdates(body?.responses);
    const answerUpdate = normalizeAnswerUpdate(body?.question_id, body?.answer);
    if (!declaredActionUpdates && !answerUpdate) {
      return errorResponse(
        400,
        "INVALID_REQUEST",
        "Declared action or Flow answer updates are required.",
      );
    }

    const supabase = createServiceClient();
    const verified = await verifyFlowSession(supabase, sessionId, sessionToken);
    if (!verified.ok) return verified.response;

    const { session, answers, questions } = verified.value;
    if (session.status === "abandoned") {
      return errorResponse(
        400,
        "INVALID_REQUEST",
        "This flow session has been abandoned.",
      );
    }

    let nextAnswers = {
      ...answers,
      ...(declaredActionUpdates ?? {}),
    };
    const updatedAt = new Date().toISOString();
    const updateData: Record<string, unknown> = {
      responses_json: nextAnswers,
      updated_at: updatedAt,
    };
    let nextQuestion: FlowQuestion | null = null;
    let editedQuestionId: string | null = null;

    if (answerUpdate) {
      const question = questions.find((candidate) =>
        candidate.id === answerUpdate.questionId
      );
      if (!question) {
        return errorResponse(
          400,
          "QUESTION_NOT_FOUND",
          "Question not found for this Flow.",
        );
      }

      let answer = answerUpdate.answer.trim();
      if (question.required && answer.length === 0) {
        return errorResponse(
          400,
          "ANSWER_REQUIRED",
          "This question requires an answer.",
        );
      }

      const skippedOptionalQuestion = !question.required && /^(pass|skip|prefer not to answer)$/i.test(answer);
      if (question.type === "select" && answer && !skippedOptionalQuestion) {
        const normalizedAnswer = normalizeSelectAnswer(question, answer);
        if (!normalizedAnswer) {
          return errorResponse(
            400,
            "INVALID_SELECT_OPTION",
            "Answer must be one of the question options.",
            {
              question: serializeQuestion(question),
              allowed_options: question.options ?? [],
            },
          );
        }
        answer = normalizedAnswer;
      }

      editedQuestionId = question.id;
      nextAnswers = pruneHiddenQuestionAnswers(questions, {
        ...nextAnswers,
        [question.id]: answer,
      });
      if (question.id === "actions") {
        nextAnswers = removeDeclaredActionAnswers(nextAnswers);
      }
      nextQuestion = getNextVisibleQuestion(questions, nextAnswers, question.id);

      updateData.responses_json = nextAnswers;
      updateData.current_question_id = nextQuestion?.id ?? null;
      updateData.status = nextQuestion ? "in_progress" : "awaiting_completion";
      updateData.completed_at = null;
      updateData.ai_analysis_json = null;
      updateData.pdf_url = null;

      const titleQuestion = questions.find((candidate) =>
        candidate.id === "title" || candidate.interpolation_key === "stack_title"
      );
      const domainQuestion = questions.find((candidate) =>
        candidate.id === "domain"
      );
      if (titleQuestion) updateData.title = nextAnswers[titleQuestion.id] ?? null;
      if (domainQuestion) updateData.domain = nextAnswers[domainQuestion.id] ?? null;
    }

    const { error: updateError } = await supabase
      .from("flow_sessions")
      .update(updateData)
      .eq("id", session.id);

    if (updateError) throw updateError;

    // A coach probe is tied to the exact official answer. Editing that answer
    // invalidates the associated reflection/probe row so a stale pending probe
    // cannot own the next turn after the edit.
    if (editedQuestionId) {
      const { error: coachDeleteError } = await supabase
        .from("flow_coach_messages")
        .delete()
        .eq("flow_session_id", session.id)
        .eq("question_id", editedQuestionId);
      if (coachDeleteError) throw coachDeleteError;
    }

    console.log("[save_flow_agent_responses] success", {
      session_id: session.id,
      user_id: session.user_id,
      keys: Object.keys(declaredActionUpdates ?? {}),
      edited_question_id: editedQuestionId,
      duration_ms: Date.now() - startedAt,
    });

    return jsonResponse(200, {
      success: true,
      session_id: session.id,
      answers_so_far: nextAnswers,
      edited_question_id: editedQuestionId,
      next_question: serializeQuestion(nextQuestion),
      is_complete: answerUpdate
        ? nextQuestion === null
        : session.status === "completed" || session.status === "awaiting_completion",
    });
  } catch (error) {
    console.error("[save_flow_agent_responses] failed", {
      session_id: sessionId,
      duration_ms: Date.now() - startedAt,
      error: error instanceof Error ? error.message : String(error),
    });
    return errorResponse(
      500,
      "INTERNAL_ERROR",
      "Unable to save flow response updates.",
    );
  }
});

function normalizeDeclaredActionUpdates(
  raw: unknown,
): Record<string, string> | null {
  if (typeof raw !== "object" || raw === null || Array.isArray(raw)) {
    return null;
  }

  const updates: Record<string, string> = {};
  for (const [key, value] of Object.entries(raw as Record<string, unknown>)) {
    if (!DECLARED_ACTION_KEY_PATTERN.test(key)) return null;
    if (typeof value !== "string") return null;
    updates[key] = value;
  }

  return Object.keys(updates).length > 0 ? updates : null;
}

function normalizeAnswerUpdate(
  rawQuestionId: unknown,
  rawAnswer: unknown,
): { questionId: string; answer: string } | null {
  if (typeof rawQuestionId !== "string" || !rawQuestionId.trim()) return null;
  if (typeof rawAnswer !== "string") return null;

  return {
    questionId: rawQuestionId.trim(),
    answer: rawAnswer,
  };
}

function pruneHiddenQuestionAnswers(
  questions: FlowQuestion[],
  answers: Record<string, string>,
): Record<string, string> {
  const questionIds = new Set(questions.map((question) => question.id));
  const visibleQuestionIds = new Set(
    getVisibleQuestions(questions, answers).map((question) => question.id),
  );
  const nextAnswers: Record<string, string> = {};

  for (const [key, value] of Object.entries(answers)) {
    if (!questionIds.has(key) || visibleQuestionIds.has(key)) {
      nextAnswers[key] = value;
    }
  }

  return nextAnswers;
}

function removeDeclaredActionAnswers(
  answers: Record<string, string>,
): Record<string, string> {
  const nextAnswers: Record<string, string> = {};

  for (const [key, value] of Object.entries(answers)) {
    if (!DECLARED_ACTION_KEY_PATTERN.test(key)) {
      nextAnswers[key] = value;
    }
  }

  return nextAnswers;
}
