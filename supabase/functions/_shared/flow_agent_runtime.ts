// Flow agent runtime helpers — ported from the source platform's
// flow_agent_runtime.ts with staff plumbing removed. CORS headers come from
// the member-app _shared/cors.ts (member headers only).
import {
  createClient,
  type SupabaseClient,
} from "https://esm.sh/@supabase/supabase-js@2.49.1";
import type { FlowQuestion, FlowTemplate } from "./flow_types.ts";
import { corsHeaders } from "./cors.ts";
import { getSupabaseServiceKey } from "./supabaseKeys.ts";

export { corsHeaders };

export type FlowErrorCode =
  | "INVALID_REQUEST"
  | "UNAUTHORIZED"
  | "FLOW_NOT_FOUND"
  | "SESSION_NOT_FOUND"
  | "INVALID_SESSION_TOKEN"
  | "MEMBER_INACTIVE"
  | "QUESTION_NOT_FOUND"
  | "QUESTION_OUT_OF_ORDER"
  | "ANSWER_REQUIRED"
  | "INVALID_SELECT_OPTION"
  | "REQUIRED_ANSWERS_MISSING"
  | "LLM_ERROR"
  | "INTERNAL_ERROR";

export type FlowSessionRow = {
  id: string;
  user_id: string;
  flow_template_id: string;
  title: string | null;
  domain: string | null;
  responses_json: Record<string, string> | null;
  ai_analysis_json?: Record<string, unknown> | null;
  status: "in_progress" | "awaiting_completion" | "completed" | "abandoned";
  completed_at: string | null;
  pdf_url?: string | null;
  session_token: string;
  current_question_id: string | null;
  agent_metadata: Record<string, unknown> | null;
  created_at: string;
  updated_at: string;
  flow_template?: FlowTemplate;
};

export type VerifiedFlowSession = {
  session: FlowSessionRow;
  template: FlowTemplate;
  answers: Record<string, string>;
  questions: FlowQuestion[];
};

export type FlowToolExecutor =
  | "elevenlabs_server_webhook"
  | "supabase_edge_function";

export function getStringBodyField(
  body: Record<string, unknown> | null,
  key: string,
): string | null {
  const value = body?.[key];
  return typeof value === "string" && value.trim() ? value.trim() : null;
}

export function getFlowAgentRunId(
  body: Record<string, unknown> | null,
): string | null {
  return getStringBodyField(body, "flow_agent_run_id");
}

export function getFlowConversationId(
  body: Record<string, unknown> | null,
): string | null {
  return getStringBodyField(body, "conversation_id") ??
    getStringBodyField(body, "conversationId");
}

export function detectFlowToolExecutor(req: Request): FlowToolExecutor {
  const userAgent = req.headers.get("user-agent") ?? "";
  const hasElevenLabsHeaders = [...req.headers.keys()].some((key) =>
    key.toLowerCase().includes("eleven")
  );

  return hasElevenLabsHeaders || userAgent.toLowerCase().includes("eleven")
    ? "elevenlabs_server_webhook"
    : "supabase_edge_function";
}

export function buildFlowRequestLogEnvelope(
  req: Request,
  functionName: string,
  body: Record<string, unknown> | null,
  extra: Record<string, unknown> = {},
): Record<string, unknown> {
  const answer = body?.answer;

  return {
    functionName,
    session_id: getStringBodyField(body, "session_id"),
    question_id: getStringBodyField(body, "question_id"),
    answerLength: typeof answer === "string" ? answer.length : null,
    current_question_id_before: extra.current_question_id_before ?? null,
    current_question_id_after: extra.current_question_id_after ?? null,
    flow_slug: extra.flow_slug ?? getStringBodyField(body, "flow_slug"),
    flow_agent_run_id: getFlowAgentRunId(body),
    conversation_id: getFlowConversationId(body),
    userAgent: req.headers.get("user-agent"),
    origin: req.headers.get("origin"),
    hasElevenLabsHeaders: [...req.headers.keys()].some((key) =>
      key.toLowerCase().includes("eleven")
    ),
    tool_executor: detectFlowToolExecutor(req),
    ...extra,
  };
}

export async function mergeFlowAgentMetadata(
  supabase: SupabaseClient,
  req: Request,
  session: FlowSessionRow,
  body: Record<string, unknown> | null,
  extra: Record<string, unknown> = {},
): Promise<void> {
  const previousMetadata = typeof session.agent_metadata === "object" &&
      session.agent_metadata !== null &&
      !Array.isArray(session.agent_metadata)
    ? session.agent_metadata
    : {};
  const nextMetadata = {
    ...previousMetadata,
    ...extra,
    flow_agent_run_id: getFlowAgentRunId(body) ??
      previousMetadata.flow_agent_run_id ?? null,
    conversation_id: getFlowConversationId(body) ??
      previousMetadata.conversation_id ?? null,
    last_tool_executor: detectFlowToolExecutor(req),
  };

  if (JSON.stringify(previousMetadata) === JSON.stringify(nextMetadata)) {
    return;
  }

  const { error } = await supabase
    .from("flow_sessions")
    .update({ agent_metadata: nextMetadata })
    .eq("id", session.id);

  if (error) {
    console.warn("[flow_agent_runtime] Failed to merge agent metadata", {
      session_id: session.id,
      flow_agent_run_id: getFlowAgentRunId(body),
      conversation_id: getFlowConversationId(body),
      error: error.message,
    });
  }
}

export function withEdgeToolExecutor<T extends object>(
  req: Request,
  body: Record<string, unknown> | null,
  result: T,
): T & {
  tool_executor: FlowToolExecutor;
  flow_agent_run_id: string | null;
} {
  return {
    ...result,
    tool_executor: detectFlowToolExecutor(req),
    flow_agent_run_id: getFlowAgentRunId(body),
  };
}

export function jsonResponse(status: number, body: unknown): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

export function errorResponse(
  status: number,
  code: FlowErrorCode,
  message: string,
  details?: Record<string, unknown>,
): Response {
  return jsonResponse(status, {
    error: {
      code,
      message,
      ...(details ?? {}),
    },
  });
}

export function methodNotAllowed(): Response {
  return errorResponse(
    405,
    "INVALID_REQUEST",
    "Only POST requests are supported.",
  );
}

export function createServiceClient(): SupabaseClient {
  return createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    getSupabaseServiceKey(),
  );
}

export async function parseJsonBody<T extends Record<string, unknown>>(
  req: Request,
): Promise<T | null> {
  try {
    const body = await req.json();
    return typeof body === "object" && body !== null ? body as T : null;
  } catch {
    return null;
  }
}

export function normalizeQuestions(raw: unknown): FlowQuestion[] {
  const parsed = typeof raw === "string" ? JSON.parse(raw) : raw;
  return Array.isArray(parsed) ? parsed.filter(isFlowQuestion) : [];
}

function isFlowQuestion(value: unknown): value is FlowQuestion {
  if (typeof value !== "object" || value === null) return false;
  const question = value as Record<string, unknown>;
  return typeof question.id === "string" &&
    typeof question.prompt === "string" &&
    (question.type === "text" || question.type === "textarea" ||
      question.type === "select");
}

export function serializeQuestion(
  question: FlowQuestion | null,
): Record<string, unknown> | null {
  if (!question) return null;

  return {
    id: question.id,
    prompt: question.prompt,
    type: question.type,
    required: Boolean(question.required),
    placeholder: question.placeholder ?? null,
    options: question.options ?? null,
    interpolation_key: question.interpolation_key ?? null,
    ai_challenge: Boolean(question.ai_challenge),
    show_if: question.show_if ?? null,
  };
}

export function getVisibleQuestions(
  questions: FlowQuestion[],
  answers: Record<string, string>,
): FlowQuestion[] {
  return questions.filter((question) => {
    if (!question.show_if) return true;
    return answers[question.show_if.question_id] === question.show_if.equals;
  });
}

export function getCurrentQuestion(
  questions: FlowQuestion[],
  answers: Record<string, string>,
  currentQuestionId: string | null,
): FlowQuestion | null {
  const visibleQuestions = getVisibleQuestions(questions, answers);
  if (currentQuestionId) {
    const current = visibleQuestions.find((question) =>
      question.id === currentQuestionId
    );
    if (current) return current;
  }

  return visibleQuestions.find((question) =>
    !hasAnswer(answers, question.id)
  ) ?? null;
}

export function hasAnswer(
  answers: Record<string, string>,
  questionId: string,
): boolean {
  return typeof answers[questionId] === "string" &&
    answers[questionId].trim().length > 0;
}

export function getFirstVisibleQuestion(
  questions: FlowQuestion[],
  answers: Record<string, string> = {},
): FlowQuestion | null {
  return getVisibleQuestions(questions, answers)[0] ?? null;
}

export function getQuestionIndex(
  questions: FlowQuestion[],
  questionId: string | null,
): number {
  if (!questionId) return -1;
  return questions.findIndex((question) => question.id === questionId);
}

export function getNextVisibleQuestion(
  questions: FlowQuestion[],
  answers: Record<string, string>,
  currentQuestionId: string,
): FlowQuestion | null {
  const visibleQuestions = getVisibleQuestions(questions, answers);
  const currentIndex = getQuestionIndex(visibleQuestions, currentQuestionId);
  if (currentIndex >= 0) {
    return visibleQuestions
      .slice(currentIndex + 1)
      .find((question) => !hasAnswer(answers, question.id)) ?? null;
  }
  return visibleQuestions.find((question) =>
    !hasAnswer(answers, question.id)
  ) ?? null;
}

export function getMissingRequiredQuestions(
  questions: FlowQuestion[],
  answers: Record<string, string>,
): string[] {
  return getVisibleQuestions(questions, answers)
    .filter((question) => question.required && !hasAnswer(answers, question.id))
    .map((question) => question.id);
}

export async function loadTemplateBySlug(
  supabase: SupabaseClient,
  flowSlug: string,
): Promise<FlowTemplate | null> {
  const { data, error } = await supabase
    .from("flow_templates")
    .select("*")
    .eq("slug", flowSlug)
    .eq("is_active", true)
    .maybeSingle();

  if (error) throw error;
  if (!data) return null;

  return {
    ...data,
    questions_json: normalizeQuestions(data.questions_json),
  } as FlowTemplate;
}

export async function verifyFlowSession(
  supabase: SupabaseClient,
  sessionId: string | undefined,
  sessionToken: string | undefined,
): Promise<
  { ok: true; value: VerifiedFlowSession } | { ok: false; response: Response }
> {
  if (!sessionId || !sessionToken) {
    return {
      ok: false,
      response: errorResponse(
        401,
        "INVALID_SESSION_TOKEN",
        "session_id and session_token are required.",
      ),
    };
  }

  const { data, error } = await supabase
    .from("flow_sessions")
    .select("*, flow_template:flow_templates(*)")
    .eq("id", sessionId)
    .maybeSingle();

  if (error) {
    console.error(
      "[flow_agent_runtime] Session lookup failed:",
      sessionId,
      error.message,
    );
    return {
      ok: false,
      response: errorResponse(
        500,
        "INTERNAL_ERROR",
        "Unable to load flow session.",
      ),
    };
  }

  if (!data) {
    return {
      ok: false,
      response: errorResponse(
        404,
        "SESSION_NOT_FOUND",
        "Flow session not found.",
      ),
    };
  }

  const row = data as FlowSessionRow;
  if (!constantTimeEquals(String(row.session_token ?? ""), sessionToken)) {
    return {
      ok: false,
      response: errorResponse(
        401,
        "INVALID_SESSION_TOKEN",
        "Invalid session token.",
      ),
    };
  }

  // Membership kill switch: these functions run with the service role and are
  // reachable with only a session_token, so RLS cannot protect them. A
  // deactivated member's live session must die here too.
  const { data: member, error: memberError } = await supabase
    .from("members")
    .select("is_active")
    .eq("id", row.user_id)
    .maybeSingle();
  if (memberError || !member?.is_active) {
    return {
      ok: false,
      response: errorResponse(
        403,
        "MEMBER_INACTIVE",
        "Your access is inactive — contact Justin.",
      ),
    };
  }

  const template = row.flow_template
    ? {
      ...row.flow_template,
      questions_json: normalizeQuestions(row.flow_template.questions_json),
    } as FlowTemplate
    : null;

  if (!template) {
    return {
      ok: false,
      response: errorResponse(
        404,
        "FLOW_NOT_FOUND",
        "Flow template not found for this session.",
      ),
    };
  }

  return {
    ok: true,
    value: {
      session: row,
      template,
      answers: normalizeAnswers(row.responses_json),
      questions: template.questions_json,
    },
  };
}

export function normalizeAnswers(raw: unknown): Record<string, string> {
  if (typeof raw !== "object" || raw === null || Array.isArray(raw)) return {};
  const answers: Record<string, string> = {};
  for (const [key, value] of Object.entries(raw as Record<string, unknown>)) {
    if (typeof value === "string") answers[key] = value;
  }
  return answers;
}

export function normalizeSelectAnswer(
  question: FlowQuestion,
  rawAnswer: string,
): string | null {
  const options = question.options ?? [];
  if (!options.length) return rawAnswer;

  const normalizedAnswer = normalizeSelectToken(rawAnswer);
  if (!normalizedAnswer) return null;

  const directMatch = options.find((option) =>
    normalizeSelectToken(option) === normalizedAnswer
  );
  if (directMatch) return directMatch;

  const containedMatches = options.filter((option) => {
    const normalizedOption = normalizeSelectToken(option);
    return normalizedOption &&
      new RegExp(`(^| )${escapeRegExp(normalizedOption)}( |$)`).test(
        normalizedAnswer,
      );
  });
  if (containedMatches.length === 1) return containedMatches[0];
  if (containedMatches.length > 1) return null;

  return resolveCoreFourSelectAnswer(options, normalizedAnswer);
}

function normalizeSelectToken(value: string): string {
  return value
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, " ")
    .trim()
    .replace(/\s+/g, " ");
}

function resolveCoreFourSelectAnswer(
  options: string[],
  normalizedAnswer: string,
): string | null {
  const normalizedOptions = new Map(
    options.map((option) => [normalizeSelectToken(option), option]),
  );
  const isCoreFour = ["balance", "body", "being", "business"].every((option) =>
    normalizedOptions.has(option)
  );
  if (!isCoreFour) return null;

  const synonymGroups: Array<[string, string[]]> = [
    [
      "balance",
      [
        "balance",
        "balanced",
        "family",
        "wife",
        "husband",
        "spouse",
        "kids",
        "children",
        "child",
        "son",
        "sons",
        "daughter",
        "daughters",
        "boys",
        "girls",
        "home",
        "weekend",
        "vacation",
      ],
    ],
    [
      "body",
      [
        "body",
        "health",
        "healthy",
        "workout",
        "exercise",
        "fitness",
        "run",
        "running",
        "walk",
        "walking",
        "sleep",
        "nutrition",
        "food",
      ],
    ],
    [
      "being",
      [
        "being",
        "faith",
        "god",
        "prayer",
        "pray",
        "church",
        "spiritual",
        "mindset",
        "peace",
        "journal",
        "journaling",
        "meditation",
        "meditate",
      ],
    ],
    [
      "business",
      [
        "business",
        "work",
        "company",
        "office",
        "team",
        "client",
        "clients",
        "customer",
        "customers",
        "sales",
        "staff",
        "employees",
      ],
    ],
  ];

  const matches = synonymGroups
    .filter(([, synonyms]) =>
      synonyms.some((synonym) => {
        const normalizedSynonym = normalizeSelectToken(synonym);
        return new RegExp(`(^| )${escapeRegExp(normalizedSynonym)}( |$)`)
          .test(normalizedAnswer);
      })
    )
    .map(([option]) => normalizedOptions.get(option))
    .filter((option): option is string => Boolean(option));

  return matches.length === 1 ? matches[0] : null;
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function constantTimeEquals(a: string, b: string): boolean {
  const encoder = new TextEncoder();
  const left = encoder.encode(a);
  const right = encoder.encode(b);
  const maxLength = Math.max(left.length, right.length);
  let diff = left.length ^ right.length;

  for (let index = 0; index < maxLength; index += 1) {
    diff |= (left[index] ?? 0) ^ (right[index] ?? 0);
  }

  return diff === 0;
}

export function getQuestionFunctionDescription(
  flowSlug: string,
  questionId: string,
): string {
  const flowKey = `${flowSlug}:${questionId}`;
  return QUESTION_FUNCTION_DESCRIPTIONS[flowKey] ??
    QUESTION_FUNCTION_DESCRIPTIONS[questionId] ??
    "Surface a clear, specific response for this coaching checkpoint.";
}

const QUESTION_FUNCTION_DESCRIPTIONS: Record<string, string> = {
  "title": "Welcome across the threshold. Name the session.",
  "domain": "Locate the work inside Core 4.",
  "trigger": "Identify the source, target, person, situation, or opportunity.",
  "story": "Externalize the narrative the user is telling themselves.",
  "feelings": "Affect labeling. Single word.",
  "thoughts_actions":
    "Story to behavior trace. Show how the narrative produces what the user thinks and does.",
  "facts": "Reality test. Separate observable facts from interpretation.",
  "want_for_you":
    "Self-want articulation. Name what the user actually wants going forward.",
  "want_for_trigger":
    "Other-want articulation. Extend the desired outcome outward.",
  "want_for_both": "Mutual-want. Integrative both/and outcome.",
  "why_positive":
    "Meta-positive reframe. Zoom out and name the gift or upside.",
  "lesson": "Generalize the principle. One transferable lesson.",
  "revelation": "Insight surfacing. Crystallize the deepest take.",
  "actions": "Commitment. Translate insight into one specific 24-hour action.",
  "grateful:why_grateful":
    "Surface the felt sense. First articulation of why. The depth move.",
  "prayer:why_pray": "Surface the draw. Why prayer, why now.",
  "prayer:dear_god":
    "Open prayer. Free-form letter to God. The centerpiece of the Flow.",
  "prayer:lesson":
    "Generalize the principle. One transferable lesson from the prayer.",
  "prayer:actions": "Commitment. Translate prayer into one 24-hour action.",
  "bible:scripture": "Scripture intake. Capture the source text the user read.",
  "bible:what_you_see":
    "Observation. Personal vision of the text. The depth move.",
  "bible:start_doing": "START gate. Begins the action triage.",
  "bible:start_what": "Name the START action.",
  "bible:start_measure": "START measurement. How will the user know?",
  "bible:start_story":
    "START story-as-fuel. The identity narrative that drives the action.",
  "bible:stop_doing": "STOP gate.",
  "bible:stop_what": "Name the STOP action.",
  "bible:stop_measure": "STOP measurement.",
  "bible:stop_story": "STOP story-as-fuel.",
  "bible:sustain_doing": "SUSTAIN gate.",
  "bible:sustain_what": "Name the SUSTAIN practice.",
  "bible:sustain_measure": "SUSTAIN measurement.",
  "bible:sustain_story": "SUSTAIN story-as-fuel.",
  "discovery:trigger": "Identify the source of the learning.",
  "discovery:discovery_activated": "Articulate the specific discovery.",
  "discovery:story": "Externalize the narrative around the discovery.",
  "discovery:apply_category": "Choose where to land this lesson in Core 4.",
  "discovery:apply_lesson": "Translate the lesson into the chosen domain.",
  "irritation:title": "Welcome across the threshold. Name the irritation.",
  "irritation:why_irritated":
    "Surface the felt sense. Honest naming of the charge.",
  "irritation:evidence_true":
    "Truth interrogation. Force the user to defend their story like a witness on the stand.",
  "irritation:ignore_consequence":
    "Cost of suppression. Future-pace what unaddressed irritation becomes.",
  "irritation:story_check":
    "Story-utility check. Confronts the cost of holding the current narrative.",
  "irritation:ready_to_let_go":
    "Therapeutic permission before reframe. Critical structural beat.",
  "irritation:desired_story": "Reframe construction. Author the new narrative.",
  "irritation:desired_evidence":
    "Reframe grounding. Anchor the new story in observable reality.",
  "irritation:desired_story_check":
    "Re-test whether the new story gives the user what they want.",
  "irritation:feelings_now":
    "State-shift verification. Did the Flow actually move the user?",
  "idea:idea_activated":
    "Articulate the specific idea. Convert the spark into clarity.",
  "idea:positive_benefits":
    "Upside projection. Name what changes if the idea is executed.",
  "idea:negative_effects":
    "Cost of inaction. Name what is lost if the idea is not executed.",
  "idea:fact_1":
    "Measurable fact #1. Convert idea into a countable, verifiable target.",
  "war:idea_activated": "Vision articulation. What does winning look like?",
  "war:positive_benefits": "Upside if won. Name what changes.",
  "war:negative_effects": "Cost if lost. Name what is at stake.",
  "war:fact_1":
    "Measurable fact #1. Convert the war into a countable, verifiable target.",
  "war:fact_1_obstacle": "Obstacle scan. Adversarial stress test.",
  "war:fact_1_overcome": "Overcome plan. Counter-strategy and allies.",
};
