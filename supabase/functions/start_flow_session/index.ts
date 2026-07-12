// start_flow_session — ported to the Standard Playbook member app.
// Auth: requireActiveMember (Supabase JWT + ACTIVE members row) replaces the
// source's bare auth.getUser(jwt). Data scoping: flow_sessions.user_id.
// Voice routing: the source read an app_config table for canary/override
// routing — that table is not ported; routing is fixed to the signed-url
// ("base") path. Text-mode session creation must succeed with zero
// ElevenLabs config; voice mode returns a structured voice_error instead.
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import {
  buildFlowRequestLogEnvelope,
  corsHeaders,
  errorResponse,
  getCurrentQuestion,
  getFirstVisibleQuestion,
  getFlowAgentRunId,
  jsonResponse,
  loadTemplateBySlug,
  methodNotAllowed,
  normalizeAnswers,
  parseJsonBody,
  serializeQuestion,
} from "../_shared/flow_agent_runtime.ts";
import { requireActiveMember } from "../_shared/memberAuth.ts";

type RequestBody = {
  flow_slug?: unknown;
  start_fresh?: unknown;
  resume_session_id?: unknown;
  agent_id?: unknown;
  flow_agent_run_id?: unknown;
  bible_scripture?: unknown;
};

type BibleFlowPrefill = {
  scriptureAnswer: string;
  context: Record<string, unknown>;
};

type VoiceRouting = {
  mode: "base";
  routing: "base";
  flow_slug: string;
  tts_voice_id: string | null;
};

type VoiceSession = {
  signed_url?: string;
  conversation_token?: string;
  connection_type: "webrtc" | "websocket";
  agent_id: string;
};

type VoiceSessionResult =
  | { session: VoiceSession; error: null }
  | { session: null; error: { code: string; message: string } | null };

function getJsonString(value: unknown): string | null {
  return typeof value === "string" && value.trim() ? value.trim() : null;
}

function normalizeBibleFlowPrefill(
  flowSlug: string,
  raw: unknown,
): BibleFlowPrefill | null {
  if (flowSlug !== "bible") return null;
  if (typeof raw !== "object" || raw === null || Array.isArray(raw)) {
    return null;
  }

  const record = raw as Record<string, unknown>;
  const source = getJsonString(record.source);
  const content = getJsonString(record.content);
  const reference = getJsonString(record.reference);
  if (source !== "api_bible" && source !== "user_provided") return null;
  if (!content) return null;

  const translationName = getJsonString(record.translation_name);
  const bibleId = getJsonString(record.bible_id);
  const passageId = getJsonString(record.passage_id);
  const copyright = getJsonString(record.copyright);
  const reason = getJsonString(record.reason);
  const userContext = getJsonString(record.user_context);
  const cachedAt = getJsonString(record.content_cached_at) ??
    new Date().toISOString();
  const cachePolicy = getJsonString(record.content_cache_policy) ??
    "session_display_only_until_license_confirmed";

  const scriptureAnswer = source === "api_bible"
    ? [
      reference ?? "Verified API.Bible passage",
      translationName ? `Translation: ${translationName}` : null,
      "Full passage text was displayed in the Bible Flow scripture reader.",
    ].filter(Boolean).join("\n")
    : content;

  return {
    scriptureAnswer,
    context: {
      source,
      reference,
      bible_id: bibleId,
      translation_name: translationName,
      passage_id: passageId,
      copyright,
      reason,
      user_context: userContext,
      content_cached_at: cachedAt,
      content_cache_policy: cachePolicy,
    },
  };
}

function mergeBibleFlowPrefill(
  existingResponses: unknown,
  prefill: BibleFlowPrefill | null,
): Record<string, unknown> {
  const base = typeof existingResponses === "object" &&
      existingResponses !== null &&
      !Array.isArray(existingResponses)
    ? { ...(existingResponses as Record<string, unknown>) }
    : {};

  if (!prefill) return base;

  return {
    ...base,
    scripture: prefill.scriptureAnswer,
    __bible: prefill.context,
  };
}

function getStoredBibleContext(raw: unknown): Record<string, unknown> | null {
  if (typeof raw !== "object" || raw === null || Array.isArray(raw)) {
    return null;
  }
  const bible = (raw as Record<string, unknown>).__bible;
  if (typeof bible !== "object" || bible === null || Array.isArray(bible)) {
    return null;
  }
  return bible as Record<string, unknown>;
}

async function createVoiceSession(
  agentId: string | null,
): Promise<VoiceSessionResult> {
  const elevenApiKey = Deno.env.get("ELEVEN_API_KEY");
  const resolvedAgentId = agentId ?? Deno.env.get("ELEVEN_FLOW_AGENT_ID") ?? null;

  if (!elevenApiKey || !resolvedAgentId) {
    return {
      session: null,
      error: {
        code: "VOICE_NOT_CONFIGURED",
        message:
          "Voice mode isn't configured yet (missing ELEVEN_API_KEY or ELEVEN_FLOW_AGENT_ID). Text mode is still available.",
      },
    };
  }

  const params = new URLSearchParams({ agent_id: resolvedAgentId });

  const signedUrlResponse = await fetch(
    `https://api.elevenlabs.io/v1/convai/conversation/get_signed_url?${params.toString()}`,
    {
      method: "GET",
      headers: { "xi-api-key": elevenApiKey },
    },
  );

  if (signedUrlResponse.ok) {
    const data = await signedUrlResponse.json();
    if (typeof data?.signed_url === "string" && data.signed_url.trim()) {
      return {
        session: {
          signed_url: data.signed_url,
          connection_type: "websocket",
          agent_id: resolvedAgentId,
        },
        error: null,
      };
    }
  } else {
    console.warn(
      "[start_flow_session] ElevenLabs signed URL failed",
      signedUrlResponse.status,
      await signedUrlResponse.text(),
    );
  }

  const tokenResponse = await fetch(
    `https://api.elevenlabs.io/v1/convai/conversation/token?${params.toString()}`,
    {
      method: "GET",
      headers: { "xi-api-key": elevenApiKey },
    },
  );

  if (tokenResponse.ok) {
    const data = await tokenResponse.json();
    if (typeof data?.token === "string" && data.token.trim()) {
      return {
        session: {
          conversation_token: data.token,
          connection_type: "webrtc",
          agent_id: resolvedAgentId,
        },
        error: null,
      };
    }
  } else {
    console.error(
      "[start_flow_session] ElevenLabs token failed",
      tokenResponse.status,
      await tokenResponse.text(),
    );
  }

  return {
    session: null,
    error: {
      code: "VOICE_SESSION_FAILED",
      message:
        "Unable to start a voice session right now. Text mode is still available.",
    },
  };
}

serve(async (req) => {
  const startedAt = Date.now();
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }
  if (req.method !== "POST") return methodNotAllowed();

  let userId: string | null = null;
  let flowSlug: string | null = null;

  try {
    const member = await requireActiveMember(req);
    if (member instanceof Response) return member;
    userId = member.userId;
    const supabase = member.supabase;

    const body = await parseJsonBody<RequestBody>(req);
    flowSlug = typeof body?.flow_slug === "string"
      ? body.flow_slug.trim()
      : null;
    const startFresh = body?.start_fresh === true;
    const resumeSessionId = typeof body?.resume_session_id === "string" &&
        body.resume_session_id.trim()
      ? body.resume_session_id.trim()
      : null;
    const requestedAgentId =
      typeof body?.agent_id === "string" && body.agent_id.trim()
        ? body.agent_id.trim()
        : null;
    const flowAgentRunId = getFlowAgentRunId(body);

    console.log(
      "[start_flow_session] request_source",
      buildFlowRequestLogEnvelope(req, "start_flow_session", body),
    );

    if (!flowSlug) {
      return errorResponse(400, "INVALID_REQUEST", "flow_slug is required.");
    }
    const biblePrefill = normalizeBibleFlowPrefill(
      flowSlug,
      body?.bible_scripture,
    );

    const template = await loadTemplateBySlug(supabase, flowSlug);
    if (!template) {
      return errorResponse(
        404,
        "FLOW_NOT_FOUND",
        "Flow template not found or inactive.",
      );
    }

    const questions = template.questions_json;
    const firstQuestion = getFirstVisibleQuestion(questions);
    if (!firstQuestion) {
      return errorResponse(
        400,
        "INVALID_REQUEST",
        "Flow template has no questions.",
      );
    }

    // Voice routing is fixed to the base signed-url path in this app.
    const voiceRouting: VoiceRouting = {
      mode: "base",
      routing: "base",
      flow_slug: flowSlug,
      tts_voice_id: null,
    };
    const voiceResult = await createVoiceSession(requestedAgentId);
    const voiceSession = voiceResult.session;
    const voiceError = voiceResult.error;
    const agentMetadata = {
      flow_agent_run_id: flowAgentRunId,
      voice_agent_requested_agent_id: requestedAgentId,
      voice_agent_returned_agent_id: voiceSession?.agent_id ?? null,
      voice_agent_connection_type: voiceSession?.connection_type ?? null,
      voice_agent_routing_mode: voiceRouting.mode,
      voice_agent_routing: voiceRouting.routing,
      voice_agent_tts_voice_id: voiceRouting.tts_voice_id,
      voice_agent_started_at: new Date().toISOString(),
    };

    if (startFresh) {
      const { error: abandonError } = await supabase
        .from("flow_sessions")
        .update({
          status: "abandoned",
          current_question_id: null,
          updated_at: new Date().toISOString(),
        })
        .eq("user_id", userId)
        .eq("flow_template_id", template.id)
        .eq("status", "in_progress");

      if (abandonError) throw abandonError;
    }

    if (!startFresh) {
      let existingQuery = supabase
        .from("flow_sessions")
        .select("*")
        .eq("user_id", userId)
        .eq("flow_template_id", template.id)
        .eq("status", "in_progress");

      if (resumeSessionId) {
        existingQuery = existingQuery.eq("id", resumeSessionId);
      } else {
        existingQuery = existingQuery.order("updated_at", { ascending: false })
          .limit(1);
      }

      const { data: existing, error: existingError } = await existingQuery
        .maybeSingle();

      if (existingError) throw existingError;
      if (resumeSessionId && !existing) {
        return errorResponse(
          404,
          "SESSION_NOT_FOUND",
          "Draft not found for this flow.",
        );
      }
      if (existing) {
        const nextResponses = mergeBibleFlowPrefill(
          existing.responses_json,
          biblePrefill,
        );
        const answers = normalizeAnswers(nextResponses);
        const currentQuestion = getCurrentQuestion(
          questions,
          answers,
          existing.current_question_id === "scripture" && answers.scripture
            ? null
            : existing.current_question_id,
        );
        if (
          currentQuestion &&
          (
            existing.current_question_id !== currentQuestion.id ||
            biblePrefill
          )
        ) {
          await supabase
            .from("flow_sessions")
            .update({
              responses_json: nextResponses,
              current_question_id: currentQuestion.id,
              updated_at: new Date().toISOString(),
            })
            .eq("id", existing.id);
        }

        console.log("[start_flow_session] reused", {
          session_id: existing.id,
          user_id: userId,
          flow_slug: flowSlug,
          flow_agent_run_id: flowAgentRunId,
          duration_ms: Date.now() - startedAt,
        });

        const previousMetadata = typeof existing.agent_metadata === "object" &&
            existing.agent_metadata !== null &&
            !Array.isArray(existing.agent_metadata)
          ? existing.agent_metadata
          : {};
        await supabase
          .from("flow_sessions")
          .update({
            agent_metadata: {
              ...previousMetadata,
              ...agentMetadata,
            },
            updated_at: new Date().toISOString(),
          })
          .eq("id", existing.id);

        return jsonResponse(200, {
          session_id: existing.id,
          session_token: existing.session_token,
          flow_agent_run_id: flowAgentRunId,
          flow_slug: template.slug,
          flow_name: template.name,
          flow_description: template.description,
          ai_challenge_enabled: template.ai_challenge_enabled ?? true,
          ai_challenge_intensity: template.ai_challenge_intensity ?? null,
          first_question: serializeQuestion(currentQuestion ?? firstQuestion),
          questions: questions.map(serializeQuestion),
          voice_session: voiceSession,
          voice_error: voiceError,
          voice_routing: voiceRouting,
          bible_context: biblePrefill?.context ??
            getStoredBibleContext(existing.responses_json),
        });
      }
    }

    const initialResponses = mergeBibleFlowPrefill({}, biblePrefill);
    const { data: inserted, error: insertError } = await supabase
      .from("flow_sessions")
      .insert({
        user_id: userId,
        flow_template_id: template.id,
        status: "in_progress",
        responses_json: initialResponses,
        current_question_id: firstQuestion.id,
        agent_metadata: agentMetadata,
      })
      .select("*")
      .single();

    if (insertError) {
      if (insertError.code === "23505") {
        const { data: racingSession, error: fetchError } = await supabase
          .from("flow_sessions")
          .select("*")
          .eq("user_id", userId)
          .eq("flow_template_id", template.id)
          .eq("status", "in_progress")
          .order("updated_at", { ascending: false })
          .limit(1)
          .maybeSingle();

        if (!fetchError && racingSession) {
          const previousMetadata =
            typeof racingSession.agent_metadata === "object" &&
              racingSession.agent_metadata !== null &&
              !Array.isArray(racingSession.agent_metadata)
              ? racingSession.agent_metadata
              : {};
          await supabase
            .from("flow_sessions")
            .update({
              agent_metadata: {
                ...previousMetadata,
                ...agentMetadata,
              },
              updated_at: new Date().toISOString(),
            })
            .eq("id", racingSession.id);

          return jsonResponse(200, {
            session_id: racingSession.id,
            session_token: racingSession.session_token,
            flow_agent_run_id: flowAgentRunId,
            flow_slug: template.slug,
            flow_name: template.name,
            flow_description: template.description,
            ai_challenge_enabled: template.ai_challenge_enabled ?? true,
            ai_challenge_intensity: template.ai_challenge_intensity ?? null,
            first_question: serializeQuestion(firstQuestion),
            questions: questions.map(serializeQuestion),
            voice_session: voiceSession,
            voice_error: voiceError,
            voice_routing: voiceRouting,
            bible_context: biblePrefill?.context ??
              getStoredBibleContext(racingSession.responses_json),
          });
        }
      }

      throw insertError;
    }

    console.log("[start_flow_session] created", {
      session_id: inserted.id,
      user_id: userId,
      flow_slug: flowSlug,
      flow_agent_run_id: flowAgentRunId,
      duration_ms: Date.now() - startedAt,
    });

    return jsonResponse(200, {
      session_id: inserted.id,
      session_token: inserted.session_token,
      flow_agent_run_id: flowAgentRunId,
      flow_slug: template.slug,
      flow_name: template.name,
      flow_description: template.description,
      ai_challenge_enabled: template.ai_challenge_enabled ?? true,
      ai_challenge_intensity: template.ai_challenge_intensity ?? null,
      first_question: serializeQuestion(firstQuestion),
      questions: questions.map(serializeQuestion),
      voice_session: voiceSession,
      voice_error: voiceError,
      voice_routing: voiceRouting,
      bible_context: biblePrefill?.context,
    });
  } catch (error) {
    console.error("[start_flow_session] failed", {
      user_id: userId,
      flow_slug: flowSlug,
      duration_ms: Date.now() - startedAt,
      error: error instanceof Error ? error.message : String(error),
    });
    return errorResponse(
      500,
      "INTERNAL_ERROR",
      "Unable to start flow session.",
    );
  }
});
