import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { corsHeaders } from "../_shared/cors.ts";
import { requireActiveMember, isResponse } from "../_shared/memberAuth.ts";
import {
  assembleCoachPrompt,
  assembleCoachResolutionPrompt,
  dispatchModel,
  renderCoachResolution,
  renderCoachTurn,
  retrieveInsights,
  serializeSavedCoachTurn,
  shouldCoachQuestion,
  type CoachIntensity,
  type CoachWorkingThesis,
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
  probe_answer?: unknown;
  allow_probe?: unknown;
};

type CoachAttemptOutcome = "succeeded" | "skipped" | "failed";

type CoachAttemptRecord = {
  flow_session_id: string;
  question_id: string;
  request_kind: "reflection" | "resolution";
  outcome: CoachAttemptOutcome;
  reason: string | null;
  answer_hash: string | null;
  coach_message_id: string | null;
  model: string | null;
  provider_attempts: number;
  latency_ms: number;
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

function observableFailureReason(error: unknown): string {
  const message = error instanceof Error ? error.message : String(error);
  const providerStatus = message.match(/(?:OpenAI|Anthropic) returned (\d{3})/i)?.[1];
  if (providerStatus) return `provider_http_${providerStatus}`;
  if (/API_KEY is not configured/i.test(message)) return "provider_not_configured";
  return error instanceof Error && error.name ? `internal_${error.name.toLowerCase()}` : "internal_error";
}

async function recordCoachAttempt(
  supabase: ReturnType<typeof createServiceClient>,
  record: CoachAttemptRecord,
): Promise<void> {
  const { error } = await supabase.from("flow_coach_attempts").insert(record);
  if (error) {
    console.error("[flow_coach_reflect] attempt telemetry failed", {
      flow_session_id: record.flow_session_id,
      question_id: record.question_id,
      request_kind: record.request_kind,
      outcome: record.outcome,
      reason: record.reason,
      error: error.message,
    });
  }
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
  let finishAttempt: ((
    body: unknown,
    outcome: CoachAttemptOutcome,
    reason?: string | null,
    status?: number,
  ) => Promise<Response>) | null = null;
  try {
    const body = await req.json() as RequestBody;
    sessionId = typeof body.session_id === "string" ? body.session_id : null;
    const sessionToken = typeof body.session_token === "string" ? body.session_token : undefined;
    const questionId = typeof body.question_id === "string" ? body.question_id : null;
    const requestedAnswer = typeof body.answer === "string" ? body.answer.trim() : "";
    const probeAnswer = typeof body.probe_answer === "string" ? body.probe_answer.trim() : "";
    const allowProbe = body.allow_probe === true;
    if (!sessionId || !questionId || (!requestedAnswer && !probeAnswer)) return response({ skipped: true });
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

    const attemptStartedAt = Date.now();
    const requestKind = probeAnswer ? "resolution" as const : "reflection" as const;
    let attemptAnswerHash: string | null = null;
    let attemptCoachMessageId: string | null = null;
    let attemptModel: string | null = null;
    let providerAttempts = 0;
    finishAttempt = async (body, outcome, reason = null, status = 200) => {
      await recordCoachAttempt(supabase, {
        flow_session_id: sessionId!,
        question_id: questionId,
        request_kind: requestKind,
        outcome,
        reason,
        answer_hash: attemptAnswerHash,
        coach_message_id: attemptCoachMessageId,
        model: attemptModel,
        provider_attempts: providerAttempts,
        latency_ms: Date.now() - attemptStartedAt,
      });
      return response(body, status);
    };

    if (!template?.coach_enabled) return await finishAttempt({ skipped: true, reason: "template_disabled" }, "skipped", "template_disabled");
    const questions = normalizeQuestions(template.questions_json);
    const question = questions.find((candidate) => candidate.id === questionId);
    if (!question) return await finishAttempt({ skipped: true, reason: "question_not_found" }, "skipped", "question_not_found");
    if (session.status === "abandoned") return await finishAttempt({ skipped: true, reason: "session_closed" }, "skipped", "session_closed");
    const storedAnswers = normalizeAnswers(session.responses_json);
    const persistedAnswer = storedAnswers[questionId]?.trim() ?? "";
    if (!persistedAnswer) return await finishAttempt({ skipped: true, reason: "answer_not_saved" }, "skipped", "answer_not_saved");
    const normalizedRequestedAnswer = question.type === "select"
      ? normalizeSelectAnswer(question, requestedAnswer) ?? requestedAnswer
      : requestedAnswer;
    if (!probeAnswer && normalizedRequestedAnswer !== persistedAnswer) {
      return await finishAttempt({ skipped: true, reason: "stale_answer" }, "skipped", "stale_answer");
    }
    const answer = persistedAnswer.slice(0, 2000);
    const visibleQuestions = getVisibleQuestions(questions, storedAnswers);
    if (!visibleQuestions.some((candidate) => candidate.id === questionId)) {
      return await finishAttempt({ skipped: true, reason: "question_not_visible" }, "skipped", "question_not_visible");
    }
    if (!shouldCoachQuestion(question)) {
      return await finishAttempt({ skipped: true, reason: "non_reflective_step" }, "skipped", "non_reflective_step");
    }

    const existing = await supabase.from("flow_coach_messages")
      .select("id,reflection,probe,probe_answer,resolution,working_thesis,memory_refs,answer_hash").eq("flow_session_id", sessionId)
      .eq("question_id", questionId).maybeSingle();
    if (existing.error) throw existing.error;
    const answerHash = await sha256(persistedAnswer);
    attemptAnswerHash = answerHash;

    if (probeAnswer) {
      if (!existing.data?.probe) {
        return await finishAttempt({ skipped: true, reason: "no_pending_probe" }, "skipped", "no_pending_probe");
      }
      attemptCoachMessageId = existing.data.id;
      if (existing.data.answer_hash !== answerHash) {
        return await finishAttempt({ skipped: true, reason: "stale_probe" }, "skipped", "stale_probe");
      }
      if (existing.data.probe_answer) {
        return await finishAttempt({
          coach_message_id: existing.data.id,
          resolution: existing.data.resolution,
          probe_resolved: true,
          working_thesis: existing.data.working_thesis ?? {},
        }, "succeeded", "idempotent");
      }

      const profileResult = await supabase.from("flow_profiles").select("*").eq("user_id", userId).maybeSingle();
      if (profileResult.error) throw profileResult.error;
      const rawProfile = profileResult.data;
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
      const resolutionPrompt = assembleCoachResolutionPrompt({
        charter: typeof template.coach_prompt === "string" ? template.coach_prompt : null,
        intensity: (template.coach_intensity ?? "standard") as CoachIntensity,
        profile: sanitizeProfile(rawProfile),
        transcript: sanitizePromptRecord(storedAnswers) as Record<string, string>,
        memory,
        workingThesis: existing.data.working_thesis as CoachWorkingThesis | null,
        question: { id: question.id, prompt: question.prompt, note: questionNote },
        answer: persistedAnswer,
        reflection: existing.data.reflection,
        probe: existing.data.probe,
        probeAnswer,
      });
      const configuredModel = Deno.env.get("FLOW_COACH_MODEL") ?? "gpt-5.4-mini";
      attemptModel = configuredModel;
      let resolution: string | null = null;
      let workingThesis = existing.data.working_thesis ?? {};
      let memoryRefs = existing.data.memory_refs ?? [];
      let model = configuredModel;
      let inputTokens: number | null = null;
      let outputTokens: number | null = null;
      try {
        providerAttempts += 1;
        const modelResult = await dispatchModel({
          model: configuredModel,
          openaiApiKey: Deno.env.get("OPENAI_API_KEY"),
          anthropicApiKey: Deno.env.get("ANTHROPIC_API_KEY"),
          maxTokens: 900,
          reasoningEffort: "low",
          jsonMode: true,
        }, resolutionPrompt);
        attemptModel = modelResult.model;
        const rendered = renderCoachResolution(modelResult.text, memory);
        resolution = rendered.resolution || null;
        workingThesis = rendered.thesis;
        memoryRefs = [
          ...(Array.isArray(existing.data.memory_refs) ? existing.data.memory_refs : []),
          ...rendered.memoryRefs,
        ].filter((item, index, all) => all.findIndex((candidate) => candidate.id === item.id) === index);
        model = modelResult.model;
        inputTokens = modelResult.inputTokens;
        outputTokens = modelResult.outputTokens;
      } catch (error) {
        console.warn("[flow_coach_reflect] probe resolution failed open", error instanceof Error ? error.message : String(error));
      }

      const answeredAt = new Date().toISOString();
      const updated = await supabase.from("flow_coach_messages").update({
        probe_answer: probeAnswer.slice(0, 2000),
        resolution,
        working_thesis: workingThesis,
        memory_refs: memoryRefs,
        probe_answered_at: answeredAt,
        model,
        input_tokens: inputTokens,
        output_tokens: outputTokens,
      }).eq("id", existing.data.id).select("id,resolution,working_thesis,memory_refs").single();
      if (updated.error) throw updated.error;
      attemptCoachMessageId = updated.data.id;
      return await finishAttempt({
        coach_message_id: updated.data.id,
        resolution: updated.data.resolution,
        probe_resolved: true,
        working_thesis: updated.data.working_thesis,
        memory_refs: updated.data.memory_refs,
      }, "succeeded", resolution ? null : "resolution_failed_open");
    }

    if (existing.data?.answer_hash === answerHash) {
      attemptCoachMessageId = existing.data.id;
      return await finishAttempt({
        coach_message_id: existing.data.id,
        reflection: existing.data.reflection,
        probe: existing.data.probe && !existing.data.probe_answer ? existing.data.probe : null,
        probe_answer: existing.data.probe_answer,
        resolution: existing.data.resolution,
        working_thesis: existing.data.working_thesis ?? {},
        memory_refs: existing.data.memory_refs ?? [],
      }, "succeeded", "idempotent");
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
      }, { onConflict: "flow_session_id,question_id" }).select("id,reflection,memory_refs").single();
      if (safetyRecord.error) throw safetyRecord.error;
      attemptModel = "safety-rule";
      attemptCoachMessageId = safetyRecord.data.id;
      return await finishAttempt(safetyRecord.data, "succeeded", "safety_rule");
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
    const previousCoach = await supabase.from("flow_coach_messages")
      .select("working_thesis").eq("flow_session_id", sessionId)
      .neq("question_id", questionId).order("created_at", { ascending: false }).limit(1).maybeSingle();
    if (previousCoach.error) throw previousCoach.error;
    const usedProbes = await supabase.from("flow_coach_messages")
      .select("id", { count: "exact", head: true }).eq("flow_session_id", sessionId).not("probe", "is", null);
    if (usedProbes.error) throw usedProbes.error;
    const maxProbes = Number(template.coach_max_probes ?? 0);
    const probesRemaining = Math.max(0, maxProbes - (usedProbes.count ?? 0));
    const depthEnabled = template.coach_depth_enabled === true;
    const probeEligible = allowProbe && depthEnabled && question.id !== "title";
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
      allowProbe: probeEligible,
      probesRemaining,
      workingThesis: previousCoach.data?.working_thesis as CoachWorkingThesis | null,
    });

    const configuredModel = Deno.env.get("FLOW_COACH_MODEL") ?? "gpt-5.4-mini";
    attemptModel = configuredModel;
    const modelConfig = {
      model: configuredModel,
      openaiApiKey: Deno.env.get("OPENAI_API_KEY"),
      anthropicApiKey: Deno.env.get("ANTHROPIC_API_KEY"),
      maxTokens: 900,
      reasoningEffort: "low" as const,
      jsonMode: true,
    };
    providerAttempts += 1;
    let modelResult = await dispatchModel(modelConfig, prompt);
    attemptModel = modelResult.model;
    let rendered = renderCoachTurn(modelResult.text, memory);
    if (!rendered.reflection) {
      const repairPrompt = {
        ...prompt,
        system: `${prompt.system}\n\nSERVER VALIDATION REPAIR: The previous draft was rejected (${rendered.rejectionReason ?? "empty_reflection"}). Return a fresh valid JSON response. Reflect the current answer directly; do not use phrases such as "you said," "you wrote," or "you shared." The reflection must contain no question mark. Put an optional question only in the probe field when probes are allowed.`,
      };
      providerAttempts += 1;
      modelResult = await dispatchModel(modelConfig, repairPrompt);
      attemptModel = modelResult.model;
      rendered = renderCoachTurn(modelResult.text, memory);
    }
    if (!rendered.reflection) {
      const reason = `output_rejected_${rendered.rejectionReason ?? "empty_reflection"}`;
      return await finishAttempt({ skipped: true, reason }, "skipped", reason);
    }
    const finalReflection = discloseMemory
      ? `${MEMORY_DISCLOSURE} ${rendered.reflection}`
      : rendered.reflection;

    const record = {
      flow_session_id: sessionId,
      question_id: questionId,
      answer_excerpt: answer.slice(0, 240),
      answer_hash: answerHash,
      reflection: finalReflection,
      probe: rendered.probe,
      probe_answer: null,
      resolution: null,
      working_thesis: rendered.thesis,
      memory_refs: rendered.memoryRefs,
      model: modelResult.model,
      input_tokens: modelResult.inputTokens,
      output_tokens: modelResult.outputTokens,
    };
    const saved = await supabase.from("flow_coach_messages").upsert(record, {
      onConflict: "flow_session_id,question_id",
    }).select("id,reflection,probe,working_thesis,memory_refs").single();
    if (saved.error) throw saved.error;
    attemptCoachMessageId = saved.data.id;

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
    return await finishAttempt(serializeSavedCoachTurn(saved.data), "succeeded");
  } catch (error) {
    console.error("[flow_coach_reflect] fail-open", {
      session_id: sessionId,
      error: error instanceof Error ? error.message : String(error),
    });
    if (finishAttempt) {
      return await finishAttempt({ skipped: true, reason: observableFailureReason(error) }, "failed", observableFailureReason(error));
    }
    return response({ skipped: true, reason: observableFailureReason(error) });
  }
});
