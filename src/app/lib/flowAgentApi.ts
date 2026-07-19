import { supabase } from '@/app/lib/supabaseClient';
import { FlowQuestion } from '@/app/types/flows';

export interface StartFlowSessionResponse {
  session_id: string;
  session_token: string;
  flow_agent_run_id?: string | null;
  conversation_id?: string | null;
  flow_slug: string;
  flow_name: string;
  flow_description: string | null;
  ai_challenge_enabled: boolean;
  ai_challenge_intensity: string | null;
  first_question: FlowQuestion;
  questions?: FlowQuestion[];
  voice_session?: {
    signed_url?: string;
    conversation_token?: string;
    connection_type: 'webrtc' | 'websocket';
    agent_id: string;
  } | null;
  voice_error?: {
    code: 'VOICE_NOT_CONFIGURED' | 'VOICE_SESSION_FAILED';
    message: string;
  } | null;
  voice_routing?: {
    mode: 'base' | 'base_with_voice_overrides' | 'custom_canary';
    routing: 'base' | 'base_with_voice_override';
    flow_slug: string;
    tts_voice_id: string | null;
  } | null;
  bible_context?: BibleScriptureContext | null;
}

export interface BibleScriptureContext {
  source: 'api_bible' | 'user_provided';
  reference?: string | null;
  bible_id?: string | null;
  translation_name?: string | null;
  passage_id?: string | null;
  copyright?: string | null;
  reason?: string | null;
  user_context?: string | null;
  content_cached_at?: string | null;
  content_cache_policy?: string | null;
  content?: string | null;
  tags?: string[];
}

interface StartFlowSessionArgs {
  flowSlug: string;
  startFresh?: boolean;
  resumeSessionId?: string | null;
  flowAgentRunId?: string | null;
  bibleScripture?: BibleScriptureContext | null;
}

interface StartFlowSessionResult {
  flowSession: StartFlowSessionResponse;
  userJwt: string | null;
}

export interface FlowAgentStateResponse {
  session_id: string;
  flow_slug: string;
  flow_name: string;
  current_question: FlowQuestion | null;
  current_question_index: number;
  total_visible_questions: number;
  answers: Record<string, string>;
  is_complete: boolean;
  tool_executor?: string;
  flow_agent_run_id?: string | null;
  coach_probe?: PendingFlowCoachProbe | null;
}

export interface PendingFlowCoachProbe {
  coach_message_id: string;
  question_id: string;
  reflection: string;
  probe: string;
}

export interface SubmitFlowAnswerResponse {
  success: boolean;
  validation_error?: boolean;
  user_message?: string;
  retry_question?: FlowQuestion | null;
  next_question: FlowQuestion | null;
  is_complete: boolean;
  answers_so_far: Record<string, string>;
  error?: {
    code?: string;
    message?: string;
    allowed_options?: string[];
  };
  tool_executor?: string;
  flow_agent_run_id?: string | null;
  coach_message_id?: string;
  coach_reflection?: string;
  coach_probe?: string | null;
  coach_resolution?: string | null;
  coach_skipped?: boolean;
  coach_skip_reason?: string;
  probe_resolved?: boolean;
}

export interface EvaluateAnswerQualityResponse {
  should_push_back: boolean;
  pushback_message: string | null;
  tool_executor?: string;
  flow_agent_run_id?: string | null;
}

export interface FlowCoachReflectResponse {
  coach_message_id?: string;
  reflection?: string;
  probe?: string | null;
  probe_answer?: string | null;
  resolution?: string | null;
  probe_resolved?: boolean;
  working_thesis?: Record<string, unknown>;
  memory_refs?: Array<{ id: string; flow_slug: string | null; session_title: string | null }>;
  skipped?: boolean;
  reason?: string;
}

export interface CompleteFlowSessionResponse {
  success: boolean;
  session_id: string;
  completed_at: string;
  answers: Record<string, string>;
  analysis_started: boolean;
  tool_executor?: string;
  flow_agent_run_id?: string | null;
}

export interface SaveFlowAgentResponsesResponse {
  success: boolean;
  session_id: string;
  answers_so_far: Record<string, string>;
  edited_question_id?: string | null;
  next_question?: FlowQuestion | null;
  is_complete?: boolean;
}

export class FlowAgentFunctionError extends Error {
  functionName: string;
  status: number;
  code: string | null;

  constructor(functionName: string, status: number, message: string, code?: string | null) {
    super(message);
    this.name = 'FlowAgentFunctionError';
    this.functionName = functionName;
    this.status = status;
    this.code = code ?? null;
  }
}

function getSupabaseFunctionUrl(functionName: string): string {
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  if (!supabaseUrl) {
    throw new Error('Supabase URL is not configured.');
  }
  return `${supabaseUrl.replace(/\/$/, '')}/functions/v1/${functionName}`;
}

function getPublishableKey(): string | null {
  return import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || import.meta.env.VITE_SUPABASE_ANON_KEY || null;
}

function getFlowAgentId(flowSlug: string): { agentId: string | null; routing: 'base' } {
  const baseAgentId = import.meta.env.VITE_ELEVENLABS_AGENT_ID || null;
  void flowSlug;
  return { agentId: baseAgentId, routing: 'base' };
}

export function createFlowAgentRunId(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }

  return `flow-run-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

function sanitizeFlowAgentRequestBody(body: Record<string, unknown>) {
  const answer = body.answer;
  return {
    session_id: typeof body.session_id === 'string' ? body.session_id : null,
    question_id: typeof body.question_id === 'string' ? body.question_id : null,
    flow_slug: typeof body.flow_slug === 'string' ? body.flow_slug : null,
    flow_agent_run_id: typeof body.flow_agent_run_id === 'string' ? body.flow_agent_run_id : null,
    conversation_id: typeof body.conversation_id === 'string' ? body.conversation_id : null,
    answerLength: typeof answer === 'string' ? answer.length : null,
    hasSessionToken: typeof body.session_token === 'string' && body.session_token.length > 0,
    hasResponses: typeof body.responses === 'object' && body.responses !== null,
  };
}

async function parseFunctionError(response: Response): Promise<{ message: string; code: string | null }> {
  try {
    const body = await response.json();
    return parseFunctionErrorBody(response.status, body);
  } catch {
    // Fall through to status-aware defaults.
  }

  return parseFunctionErrorBody(response.status, null);
}

function parseFunctionErrorBody(status: number, body: unknown): { message: string; code: string | null } {
  if (typeof body === 'object' && body !== null) {
    const record = body as Record<string, unknown>;
    const error = record.error;
    if (typeof error === 'object' && error !== null) {
      const errorRecord = error as Record<string, unknown>;
      if (typeof errorRecord.message === 'string') {
        return {
          message: errorRecord.message,
          code: typeof errorRecord.code === 'string' ? errorRecord.code : null,
        };
      }
    }
    if (typeof error === 'string') return { message: error, code: null };
    if (typeof record.message === 'string') return { message: record.message, code: null };
  }

  if (status === 401) {
    return { message: 'Your session expired. Please refresh and try again.', code: null };
  }
  if (status === 404) return { message: 'This Flow is no longer available.', code: null };
  return { message: 'Failed to start Flow session.', code: null };
}

async function invokeFlowAgentFunction<T>(
  functionName: string,
  body: Record<string, unknown>,
): Promise<T> {
  const publishableKey = getPublishableKey();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (publishableKey) {
    headers.apikey = publishableKey;
    headers.Authorization = `Bearer ${publishableKey}`;
  }

  console.info('[FlowAgentEdgeRequest]', { functionName, body: sanitizeFlowAgentRequestBody(body) });
  const response = await fetch(getSupabaseFunctionUrl(functionName), {
    method: 'POST',
    headers,
    body: JSON.stringify(body),
  });
  const responseText = await response.text();
  let responseBody: unknown = null;
  let parseError: unknown = null;
  try {
    responseBody = responseText ? JSON.parse(responseText) : null;
  } catch (error) {
    parseError = error;
  }
  console.info('[FlowAgentEdgeResponse]', {
    functionName,
    status: response.status,
    ok: response.ok,
    body: responseBody ?? responseText,
    parseError: parseError instanceof Error ? parseError.message : parseError,
  });

  if (!response.ok) {
    console.error('[FlowAgentEdgeError]', {
      functionName,
      status: response.status,
      ok: response.ok,
      body: responseBody ?? responseText,
    });
    const { message, code } = parseFunctionErrorBody(response.status, responseBody);
    throw new FlowAgentFunctionError(functionName, response.status, message, code);
  }

  if (parseError) throw parseError;
  return responseBody as T;
}

export async function startFlowSession({
  flowSlug,
  startFresh = false,
  resumeSessionId,
  flowAgentRunId,
  bibleScripture,
}: StartFlowSessionArgs): Promise<StartFlowSessionResult> {
  const {
    data: { session },
  } = await supabase.auth.getSession();

  const userJwt = session?.access_token ?? null;
  const publishableKey = getPublishableKey();
  const authorizationToken = userJwt || publishableKey;
  const { agentId, routing } = getFlowAgentId(flowSlug);
  const resolvedFlowAgentRunId = flowAgentRunId || createFlowAgentRunId();

  if (!userJwt) {
    throw new Error('Not authenticated.');
  }

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (publishableKey) {
    headers.apikey = publishableKey;
  }
  if (authorizationToken) {
    headers.Authorization = `Bearer ${authorizationToken}`;
  }

  console.info('[FlowAgentVoiceSession]', {
    phase: 'start_flow_session_request',
    flowSlug,
    flowAgentRunId: resolvedFlowAgentRunId,
    routing,
    requestedAgentId: agentId,
    startFresh,
  });

  const requestBody: Record<string, unknown> = {
    flow_slug: flowSlug,
    agent_id: agentId,
    start_fresh: startFresh,
    resume_session_id: resumeSessionId ?? null,
    flow_agent_run_id: resolvedFlowAgentRunId,
  };
  if (bibleScripture) {
    requestBody.bible_scripture = bibleScripture;
  }

  const response = await fetch(getSupabaseFunctionUrl('start_flow_session'), {
    method: 'POST',
    headers,
    body: JSON.stringify(requestBody),
  });

  if (!response.ok) {
    const { message, code } = await parseFunctionError(response);
    throw new FlowAgentFunctionError('start_flow_session', response.status, message, code);
  }

  const flowSession = (await response.json()) as StartFlowSessionResponse;
  flowSession.flow_agent_run_id = flowSession.flow_agent_run_id || resolvedFlowAgentRunId;
  console.info('[FlowAgentVoiceSession]', {
    phase: 'start_flow_session_response',
    flowSlug: flowSession.flow_slug,
    flowAgentRunId: flowSession.flow_agent_run_id,
    routing: flowSession.voice_routing?.routing ?? routing,
    voiceRoutingMode: flowSession.voice_routing?.mode ?? null,
    ttsVoiceId: flowSession.voice_routing?.tts_voice_id ?? null,
    requestedAgentId: agentId,
    returnedAgentId: flowSession.voice_session?.agent_id ?? null,
    connectionType: flowSession.voice_session?.connection_type ?? null,
    hasSignedUrl: Boolean(flowSession.voice_session?.signed_url),
    hasConversationToken: Boolean(flowSession.voice_session?.conversation_token),
  });

  return {
    flowSession,
    userJwt,
  };
}

export function getFlowAgentState(flowSession: StartFlowSessionResponse): Promise<FlowAgentStateResponse> {
  return invokeFlowAgentFunction<FlowAgentStateResponse>('get_flow_state', {
    session_id: flowSession.session_id,
    session_token: flowSession.session_token,
    flow_agent_run_id: flowSession.flow_agent_run_id ?? null,
    conversation_id: flowSession.conversation_id ?? null,
  });
}

export function submitFlowAgentAnswer(
  flowSession: StartFlowSessionResponse,
  questionId: string,
  answer: string,
): Promise<SubmitFlowAnswerResponse> {
  return invokeFlowAgentFunction<SubmitFlowAnswerResponse>('submit_flow_answer', {
    session_id: flowSession.session_id,
    session_token: flowSession.session_token,
    question_id: questionId,
    answer,
    flow_agent_run_id: flowSession.flow_agent_run_id ?? null,
    conversation_id: flowSession.conversation_id ?? null,
    client_tool_executor: 'react_client_tools',
  });
}

// The `evaluate_answer_quality` edge function is not deployed in this project.
// Answer-quality pushback fails soft: never push back, and the answer is
// submitted normally. Callers already treat this as the safe default.
export function evaluateFlowAgentAnswer(
  flowSession: StartFlowSessionResponse,
  _questionId: string,
  _answer: string,
): Promise<EvaluateAnswerQualityResponse> {
  return Promise.resolve({
    should_push_back: false,
    pushback_message: null,
    flow_agent_run_id: flowSession.flow_agent_run_id ?? null,
  });
}

export function reflectFlowAgentAnswer(
  flowSession: StartFlowSessionResponse,
  questionId: string,
  answer: string,
  allowProbe = true,
): Promise<FlowCoachReflectResponse> {
  return invokeFlowAgentFunction<FlowCoachReflectResponse>('flow_coach_reflect', {
    session_id: flowSession.session_id,
    session_token: flowSession.session_token,
    question_id: questionId,
    answer,
    allow_probe: allowProbe,
  });
}

export function answerFlowCoachProbe(
  flowSession: StartFlowSessionResponse,
  questionId: string,
  probeAnswer: string,
): Promise<FlowCoachReflectResponse> {
  return invokeFlowAgentFunction<FlowCoachReflectResponse>('flow_coach_reflect', {
    session_id: flowSession.session_id,
    session_token: flowSession.session_token,
    question_id: questionId,
    probe_answer: probeAnswer,
    allow_probe: false,
  });
}

export function completeFlowAgentSession(
  flowSession: StartFlowSessionResponse,
): Promise<CompleteFlowSessionResponse> {
  return invokeFlowAgentFunction<CompleteFlowSessionResponse>('complete_flow_session', {
    session_id: flowSession.session_id,
    session_token: flowSession.session_token,
    flow_agent_run_id: flowSession.flow_agent_run_id ?? null,
    conversation_id: flowSession.conversation_id ?? null,
  });
}

export function saveFlowAgentResponses(
  flowSession: StartFlowSessionResponse,
  responses: Record<string, string>,
): Promise<SaveFlowAgentResponsesResponse> {
  return invokeFlowAgentFunction<SaveFlowAgentResponsesResponse>('save_flow_agent_responses', {
    session_id: flowSession.session_id,
    session_token: flowSession.session_token,
    flow_agent_run_id: flowSession.flow_agent_run_id ?? null,
    conversation_id: flowSession.conversation_id ?? null,
    responses,
  });
}

export function editFlowAgentAnswer(
  flowSession: StartFlowSessionResponse,
  questionId: string,
  answer: string,
): Promise<SaveFlowAgentResponsesResponse> {
  return invokeFlowAgentFunction<SaveFlowAgentResponsesResponse>('save_flow_agent_responses', {
    session_id: flowSession.session_id,
    session_token: flowSession.session_token,
    flow_agent_run_id: flowSession.flow_agent_run_id ?? null,
    conversation_id: flowSession.conversation_id ?? null,
    question_id: questionId,
    answer,
  });
}
