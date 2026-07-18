import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { corsHeaders } from "../_shared/cors.ts";
import { requireActiveMember, isResponse } from "../_shared/memberAuth.ts";
import {
  assembleCoachPrompt,
  dispatchModel,
  renderReflection,
  retrieveInsights,
  type CoachIntensity,
} from "../_shared/flowCoach/index.ts";
import {
  createServiceClient,
  getVisibleQuestions,
  normalizeAnswers,
  normalizeQuestions,
  normalizeSelectAnswer,
  verifyFlowSession,
} from "../_shared/flow_agent_runtime.ts";

type RequestBody = {
  session_id?: unknown;
  session_token?: unknown;
  question_id?: unknown;
  answer?: unknown;
};

const MEMORY_DISCLOSURE = "I've read your past flows so I can coach you with continuity.";
const CRISIS_SIGNAL = /\b(suicide|kill myself|end my life|hurt myself|self[- ]?harm|being abused|domestic violence|i(?:'m| am) not safe|immediate danger)\b/i;
const PROFILE_PROMPT_FIELDS = new Set([
  "preferred_name",
  "life_roles",
  "core_values",
  "current_goals",
  "current_challenges",
  "spiritual_beliefs",
  "faith_tradition",
  "background_notes",
  "accountability_style",
  "feedback_preference",
  "peak_state",
  "growth_edge",
  "overwhelm_response",
]);

function sanitizePromptRecord(input: Record<string, unknown> | null, maxTotal = 12000): Record<string, unknown> | null {
  if (!input) return null;
  const output: Record<string, unknown> = {};
  let remaining = maxTotal;
  for (const [key, value] of Object.entries(input).slice(0, 60)) {
    if (remaining <= 0) break;
    if (typeof value === "string") {
      const next = value.slice(0, Math.min(2000, remaining));
      output[key] = next;
      remaining -= next.length;
    } else if (Array.isArray(value)) {
      const next = value.slice(0, 20).map((item) => String(item).slice(0, 200));
      output[key] = next;
      remaining -= next.join("").length;
    } else if (typeof value === "number" || typeof value === "boolean" || value === null) {
      output[key] = value;
    }
  }
  return output;
}

function sanitizeProfile(input: Record<string, unknown> | null): Record<string, unknown> | null {
  if (!input) return null;
  return sanitizePromptRecord(Object.fromEntries(
    Object.entries(input).filter(([key]) => PROFILE_PROMPT_FIELDS.has(key)),
  ));
}

function response(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

async function sha256(value: string): Promise<string> {
  const bytes = new TextEncoder().encode(value);
  const digest = await crypto.subtle.digest("SHA-256", bytes);
  return [...new Uint8Array(digest)].map((byte) => byte.toString(16).padStart(2, "0")).join("");
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  if (req.method !== "POST") return response({ skipped: true }, 405);

  let sessionId: string | null = null;
  try {
    const body = await req.json() as RequestBody;
    sessionId = typeof body.session_id === "string" ? body.session_id : null;
    const sessionToken = typeof body.session_token === "string" ? body.session_token : undefined;
    const questionId = typeof body.question_id === "string" ? body.question_id : null;
    const requestedAnswer = typeof body.answer === "string" ? body.answer.trim() : "";
    if (!sessionId || !questionId || !requestedAnswer) return response({ skipped: true });
    if (Deno.env.get("FLOW_COACH_ENABLED")?.toLowerCase() === "false") {
      return response({ skipped: true, reason: "disabled" });
    }

    const supabase = createServiceClient();
    let userId: string;
    let session: Record<string, unknown>;
    let template: Record<string, unknown>;

    if (sessionToken) {
      const verified = await verifyFlowSession(supabase, sessionId, sessionToken);
      if (!verified.ok) return verified.response;
      userId = verified.value.session.user_id;
      session = verified.value.session as unknown as Record<string, unknown>;
      template = verified.value.template as unknown as Record<string, unknown>;
    } else {
      const member = await requireActiveMember(req);
      if (isResponse(member)) return member;
      const lookup = await member.supabase.from("flow_sessions")
        .select("*, flow_template:flow_templates(*)").eq("id", sessionId).maybeSingle();
      if (lookup.error) throw lookup.error;
      if (!lookup.data) return response({ skipped: true }, 404);
      if (lookup.data.user_id !== member.userId) return response({ error: "Not authorized for this session" }, 403);
      userId = member.userId;
      session = lookup.data as Record<string, unknown>;
      template = lookup.data.flow_template as Record<string, unknown>;
    }

    if (!template?.coach_enabled) return response({ skipped: true, reason: "template_disabled" });
    const questions = normalizeQuestions(template.questions_json);
    const question = questions.find((candidate) => candidate.id === questionId);
    if (!question) return response({ skipped: true });
    if (session.status === "abandoned") return response({ skipped: true, reason: "session_closed" });
    const storedAnswers = normalizeAnswers(session.responses_json);
    const persistedAnswer = storedAnswers[questionId]?.trim() ?? "";
    if (!persistedAnswer) return response({ skipped: true, reason: "answer_not_saved" });
    const normalizedRequestedAnswer = question.type === "select"
      ? normalizeSelectAnswer(question, requestedAnswer) ?? requestedAnswer
      : requestedAnswer;
    if (normalizedRequestedAnswer !== persistedAnswer) return response({ skipped: true, reason: "stale_answer" });
    const answer = persistedAnswer.slice(0, 2000);
    const visibleQuestions = getVisibleQuestions(questions, storedAnswers);
    if (!visibleQuestions.some((candidate) => candidate.id === questionId)) {
      return response({ skipped: true, reason: "question_not_visible" });
    }
    const visibleCount = visibleQuestions.length;

    const existing = await supabase.from("flow_coach_messages")
      .select("reflection,memory_refs,answer_hash").eq("flow_session_id", sessionId)
      .eq("question_id", questionId).maybeSingle();
    if (existing.error) throw existing.error;
    const answerHash = await sha256(persistedAnswer);
    if (existing.data?.answer_hash === answerHash) {
      return response({ reflection: existing.data.reflection, memory_refs: existing.data.memory_refs ?? [] });
    }

    if (CRISIS_SIGNAL.test(persistedAnswer)) {
      const safetyReflection = "Your safety matters more than this flow. If you may be in immediate danger, contact local emergency services or a crisis hotline now, and reach out to someone you trust who can stay with you.";
      const safetyRecord = await supabase.from("flow_coach_messages").upsert({
        flow_session_id: sessionId,
        question_id: questionId,
        answer_excerpt: answer.slice(0, 240),
        answer_hash: answerHash,
        reflection: safetyReflection,
        memory_refs: [],
        model: "safety-rule",
        input_tokens: 0,
        output_tokens: 0,
      }, { onConflict: "flow_session_id,question_id" }).select("reflection,memory_refs").single();
      if (safetyRecord.error) throw safetyRecord.error;
      return response(safetyRecord.data);
    }

    const turns = await supabase.from("flow_coach_messages")
      .select("id", { count: "exact", head: true }).eq("flow_session_id", sessionId);
    if (turns.error) throw turns.error;
    if ((turns.count ?? 0) >= visibleCount && !existing.data) return response({ skipped: true, reason: "turn_cap" });

    const dayStart = new Date();
    dayStart.setUTCHours(0, 0, 0, 0);
    const todaySessions = await supabase.from("flow_sessions").select("id", { count: "exact" })
      .eq("user_id", userId).gte("created_at", dayStart.toISOString()).limit(1000);
    if (todaySessions.error) throw todaySessions.error;
    // This cap is about sessions that actually used the coach, not every flow
    // the member opened today. A very high raw-session count is itself abusive.
    if ((todaySessions.count ?? 0) > 1000) return response({ skipped: true, reason: "daily_abuse_rail" });
    const todaySessionIds = (todaySessions.data ?? []).map((row) => row.id);
    if (todaySessionIds.length) {
      const coachedToday = await supabase.from("flow_coach_messages")
        .select("flow_session_id").in("flow_session_id", todaySessionIds).limit(1000);
      if (coachedToday.error) throw coachedToday.error;
      const coachedSessionIds = new Set((coachedToday.data ?? []).map((row) => row.flow_session_id));
      if (coachedSessionIds.size >= 10 && !coachedSessionIds.has(sessionId)) {
        return response({ skipped: true, reason: "daily_abuse_rail" });
      }
    }

    const profileResult = await supabase.from("flow_profiles").select("*").eq("user_id", userId).maybeSingle();
    if (profileResult.error) throw profileResult.error;
    const rawProfile = profileResult.data;
    const profile = sanitizeProfile(rawProfile);
    const questionNote = (template.coach_question_notes as Record<string, unknown> | null)?.[question.id] ?? null;
    const themes = typeof questionNote === "object" && questionNote !== null
      ? (Array.isArray((questionNote as Record<string, unknown>).themes)
        ? (questionNote as Record<string, unknown>).themes as unknown[]
        : [(questionNote as Record<string, unknown>).theme])
        .filter((theme): theme is string => typeof theme === "string")
      : [];
    const memory = await retrieveInsights(supabase, userId, {
      flowSlug: String(template.slug ?? ""), stepKey: questionId, themes, limit: 20,
    });
    const discloseMemory = Boolean(memory.length && !rawProfile?.coach_memory_announced_at);
    const prompt = assembleCoachPrompt({
      charter: typeof template.coach_prompt === "string" ? template.coach_prompt : null,
      intensity: (template.coach_intensity ?? "standard") as CoachIntensity,
      profile,
      spine: questions.map((item) => ({ id: item.id, prompt: item.prompt })),
      transcript: sanitizePromptRecord(storedAnswers) as Record<string, string>,
      memory,
      currentQuestion: {
        id: question.id,
        prompt: question.prompt,
        note: questionNote,
      },
      answer,
      discloseMemory,
    });

    const configuredModel = Deno.env.get("FLOW_COACH_MODEL") ?? "gpt-4o-mini";
    const modelResult = await dispatchModel({
      model: configuredModel,
      openaiApiKey: Deno.env.get("OPENAI_API_KEY"),
      anthropicApiKey: Deno.env.get("ANTHROPIC_API_KEY"),
    }, prompt);
    const rendered = renderReflection(modelResult.text, memory);
    if (!rendered.reflection) return response({ skipped: true });
    const finalReflection = discloseMemory
      ? `${MEMORY_DISCLOSURE} ${rendered.reflection}`
      : rendered.reflection;

    const record = {
      flow_session_id: sessionId,
      question_id: questionId,
      answer_excerpt: answer.slice(0, 240),
      answer_hash: answerHash,
      reflection: finalReflection,
      memory_refs: rendered.memoryRefs,
      model: modelResult.model,
      input_tokens: modelResult.inputTokens,
      output_tokens: modelResult.outputTokens,
    };
    const saved = await supabase.from("flow_coach_messages").upsert(record, {
      onConflict: "flow_session_id,question_id",
    }).select("reflection,memory_refs").single();
    if (saved.error) throw saved.error;

    if (rendered.memoryRefs.length) {
      await supabase.from("flow_member_insights")
        .update({ last_referenced_at: new Date().toISOString() })
        .in("id", rendered.memoryRefs.map((item) => item.id)).eq("user_id", userId);
    }
    if (discloseMemory) {
      await supabase.from("flow_profiles").upsert({
        user_id: userId,
        coach_memory_announced_at: new Date().toISOString(),
      }, { onConflict: "user_id" });
    }
    return response(saved.data);
  } catch (error) {
    console.error("[flow_coach_reflect] fail-open", {
      session_id: sessionId,
      error: error instanceof Error ? error.message : String(error),
    });
    return response({ skipped: true });
  }
});
