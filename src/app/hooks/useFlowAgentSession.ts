import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useConversation } from '@11labs/react';
import {
  completeFlowAgentSession,
  answerFlowCoachProbe,
  createFlowAgentRunId,
  editFlowAgentAnswer,
  evaluateFlowAgentAnswer,
  reflectFlowAgentAnswer,
  FlowCoachReflectResponse,
  FlowAgentFunctionError,
  FlowAgentStateResponse,
  PendingFlowCoachProbe,
  BibleScriptureContext,
  getFlowAgentState,
  startFlowSession,
  StartFlowSessionResponse,
  submitFlowAgentAnswer,
} from '@/app/lib/flowAgentApi';
import { interpolateFlowPrompt, interpolateFlowQuestionPrompt } from '@/app/lib/flowPromptInterpolation';
import { buildFlowVoicePrompt, buildQuestionMap } from '@/app/lib/flowVoicePrompt';
import { FlowQuestion } from '@/app/types/flows';

const REACT_CLIENT_TOOL_EXECUTOR = 'react_client_tools';
const VOICE_TRANSCRIPT_AUTOSAVE_DELAY_MS = 4000;
async function requestFlowCoachReflection(
  session: StartFlowSessionResponse,
  questionId: string,
  answer: string,
  allowProbe = true,
): Promise<FlowCoachReflectResponse> {
  try {
    // Adaptive probes affect navigation. Do not race the server with a client
    // timeout: a late probe arriving after the next official question would
    // recreate the two-active-questions bug. The edge function remains
    // fail-open and returns { skipped: true } on provider failure.
    return await reflectFlowAgentAnswer(session, questionId, answer, allowProbe);
  } catch (error) {
    console.warn('[FlowAgentTool] Flowing reflection skipped:', error);
    return { skipped: true, reason: 'client_error' };
  }
}

export type FlowAgentMode = 'text' | 'voice';
export type FlowAgentStatus = 'idle' | 'starting' | 'active' | 'switching' | 'completed' | 'ended' | 'error';
export type FlowAgentVoiceState = 'listening' | 'thinking' | 'speaking' | 'connecting' | 'error';

export interface FlowAgentMessage {
  id: string;
  role: 'assistant' | 'user';
  content: string;
  streaming?: boolean;
  timestamp: number;
}

interface UseFlowAgentSessionArgs {
  flowSlug?: string;
  mode: FlowAgentMode;
  enabled: boolean;
  resumeSessionId?: string | null;
  bibleScripture?: BibleScriptureContext | null;
}

interface UseFlowAgentSessionResult {
  status: FlowAgentStatus;
  voiceState: FlowAgentVoiceState;
  messages: FlowAgentMessage[];
  flowSession: StartFlowSessionResponse | null;
  completedAnswers: Record<string, string> | null;
  answers: Record<string, string>;
  awaitingAgent: boolean;
  lastUserTranscript: string | null;
  lastUserTranscriptAt: number | null;
  sendUserMessage: (text: string) => Promise<void>;
  editSavedAnswer: (questionId: string, answer: string) => Promise<void>;
  endSession: () => Promise<void>;
  retry: () => Promise<void>;
  toggleMute: () => void;
  muted: boolean;
  errorMessage: string | null;
  getInputVolume: () => number;
  getOutputVolume: () => number;
  getInputByteFrequencyData: () => Uint8Array | undefined;
  getOutputByteFrequencyData: () => Uint8Array | undefined;
}

interface PendingCoachProbeState extends PendingFlowCoachProbe {
  nextQuestion: FlowQuestion | null;
  answers: Record<string, string>;
  flowComplete: boolean;
}

function createMessageId(role: FlowAgentMessage['role']) {
  return `${role}-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

function normalizeError(error: unknown): string {
  if (typeof error === 'string') return error;
  if (error instanceof Error) return error.message;
  return 'Your Coach paused. Continue?';
}

function isDuplicateMessage(messages: FlowAgentMessage[], role: FlowAgentMessage['role'], content: string) {
  const lastSameRole = [...messages].reverse().find((message) => message.role === role);
  return lastSameRole?.content.trim() === content.trim();
}

function isQuestionChallengeEnabled(session: StartFlowSessionResponse, question?: FlowQuestion | null) {
  return Boolean(question?.ai_challenge);
}

function getSessionQuestions(session: StartFlowSessionResponse) {
  return session.questions?.length ? session.questions : [session.first_question];
}

function interpolateSessionPrompt(
  session: StartFlowSessionResponse,
  prompt: string,
  answers: Record<string, string>,
) {
  return interpolateFlowPrompt(prompt, getSessionQuestions(session), answers);
}

function interpolateSessionQuestion(
  session: StartFlowSessionResponse,
  question: FlowQuestion | null | undefined,
  answers: Record<string, string>,
) {
  return question
    ? interpolateFlowQuestionPrompt(question, getSessionQuestions(session), answers)
    : question;
}

function interpolateFlowAgentResultQuestions<T extends {
  answers?: Record<string, string>;
  answers_so_far?: Record<string, string>;
  current_question?: FlowQuestion | null;
  next_question?: FlowQuestion | null;
  retry_question?: FlowQuestion | null;
}>(
  result: T,
  session: StartFlowSessionResponse | null | undefined,
): T {
  if (!session) return result;
  const resultAnswers = result.answers_so_far ?? result.answers ?? {};

  return {
    ...result,
    current_question: interpolateSessionQuestion(session, result.current_question, resultAnswers),
    next_question: interpolateSessionQuestion(session, result.next_question, resultAnswers),
    retry_question: interpolateSessionQuestion(session, result.retry_question, resultAnswers),
  };
}

function getStringParam(parameters: unknown, key: string) {
  if (typeof parameters !== 'object' || parameters === null) return '';
  const value = (parameters as Record<string, unknown>)[key];
  return typeof value === 'string' ? value : '';
}

export function isIgnorableVoiceTranscript(content: string) {
  const normalized = content.trim();
  if (!normalized) return true;
  return /^[.\u2026\s]+$/.test(normalized);
}

const FILLER_TEXTAREA_TRANSCRIPTS = new Set([
  'that',
  'this',
  'it',
  'yeah',
  'yes',
  'yep',
  'no',
  'nope',
  'okay',
  'ok',
]);

function normalizeTranscriptForFillerCheck(content: string) {
  return content
    .trim()
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s']/gu, '')
    .replace(/\s+/g, ' ');
}

export function isIgnorableVoiceTranscriptForQuestion(content: string, question?: FlowQuestion | null) {
  if (isIgnorableVoiceTranscript(content)) return true;
  if (question?.type !== 'textarea') return false;

  return FILLER_TEXTAREA_TRANSCRIPTS.has(normalizeTranscriptForFillerCheck(content));
}

export function mergeVoiceTranscriptFragments(existing: string | null | undefined, next: string) {
  const current = existing?.trim() ?? '';
  const incoming = next.trim();
  if (!current) return incoming;
  if (!incoming) return current;

  const normalizedCurrent = current.toLowerCase();
  const normalizedIncoming = incoming.toLowerCase();
  if (normalizedCurrent === normalizedIncoming) return current;
  if (normalizedCurrent.includes(normalizedIncoming)) return current;
  if (normalizedIncoming.includes(normalizedCurrent)) return incoming;

  return `${current} ${incoming}`.replace(/\s+/g, ' ').trim();
}

function withReactToolExecutor<T extends object>(
  result: T,
  session?: StartFlowSessionResponse | null,
) {
  return {
    ...result,
    tool_executor: REACT_CLIENT_TOOL_EXECUTOR,
    flow_agent_run_id: session?.flow_agent_run_id ?? null,
  };
}

function stringifyReactToolResult<T extends object>(
  result: T,
  session?: StartFlowSessionResponse | null,
) {
  return JSON.stringify(withReactToolExecutor(result, session));
}

function sanitizeFlowAgentLogValue(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(sanitizeFlowAgentLogValue);
  if (typeof value !== 'object' || value === null) return value;

  const sanitized: Record<string, unknown> = {};
  for (const [key, rawValue] of Object.entries(value as Record<string, unknown>)) {
    if (
      key === 'answer' ||
      key === 'providedAnswer' ||
      key === 'selectedAnswer' ||
      key === 'lastUserTranscript' ||
      key === 'content'
    ) {
      sanitized[`${key}Length`] = typeof rawValue === 'string' ? rawValue.length : null;
      continue;
    }

    if (key === 'answers' || key === 'answers_so_far' || key === 'stateAnswers') {
      sanitized[`${key}Keys`] =
        typeof rawValue === 'object' && rawValue !== null && !Array.isArray(rawValue)
          ? Object.keys(rawValue as Record<string, unknown>)
          : null;
      continue;
    }

    if (key === 'session_token' || key === 'sessionToken') {
      sanitized[`has${key.charAt(0).toUpperCase()}${key.slice(1)}`] =
        typeof rawValue === 'string' && rawValue.length > 0;
      continue;
    }

    sanitized[key] = sanitizeFlowAgentLogValue(rawValue);
  }

  return sanitized;
}

function logFlowAgentToolReturn(tool: string, result: object, returnedJson: string, extra: Record<string, unknown> = {}) {
  console.info('[FlowAgentToolReturn]', {
    tool,
    result: sanitizeFlowAgentLogValue(result),
    returnedJsonLength: returnedJson.length,
    ...sanitizeFlowAgentLogValue(extra) as Record<string, unknown>,
  });
}

function flowToolError(error: unknown, session?: StartFlowSessionResponse | null) {
  console.error('[FlowAgent] client tool failed', error);
  const json = stringifyReactToolResult({
    success: false,
    code: 'FLOW_TOOL_ERROR',
    internal: true,
    user_message: null,
  }, session);
  console.error('[FlowAgentToolReturn]', {
    tool: 'flowToolError',
    returnedJsonLength: json.length,
    sourceError: error,
    flowAgentRunId: session?.flow_agent_run_id ?? null,
  });
  return json;
}

function isInvalidSelectOptionError(error: unknown) {
  return error instanceof FlowAgentFunctionError && error.code === 'INVALID_SELECT_OPTION';
}

const TEXT_REPLY_MIN_DELAY_MS = 1400;

function wait(ms: number) {
  return new Promise<void>((resolve) => window.setTimeout(resolve, ms));
}

async function waitForTextReplyPause(startedAt: number) {
  const elapsed = Date.now() - startedAt;
  if (elapsed < TEXT_REPLY_MIN_DELAY_MS) {
    await wait(TEXT_REPLY_MIN_DELAY_MS - elapsed);
  }
}

function buildSelectRetryMessage(question: FlowQuestion | null | undefined) {
  const options = question?.options?.filter(Boolean) ?? [];
  if (!question) return 'Please answer that one again.';
  if (!options.length) return question.prompt;
  return `${question.prompt} Options: ${options.join(', ')}.`;
}

function buildSelectRetryMessageFromResult(result: {
  user_message?: string;
  retry_question?: FlowQuestion | null;
  next_question?: FlowQuestion | null;
}) {
  return result.user_message || buildSelectRetryMessage(result.retry_question ?? result.next_question ?? null);
}

async function resolveCurrentQuestionId(session: StartFlowSessionResponse, requestedQuestionId: string) {
  const state = await getFlowAgentState(session);
  const currentQuestionId = state.current_question?.id ?? requestedQuestionId;

  if (requestedQuestionId && currentQuestionId && requestedQuestionId !== currentQuestionId) {
    console.warn('[FlowAgent] Overriding stale tool question_id', {
      requestedQuestionId,
      currentQuestionId,
      sessionId: session.session_id,
    });
  }

  return {
    state,
    questionId: currentQuestionId,
  };
}

async function verifyMicrophoneAccess() {
  let stream: MediaStream | null = null;

  try {
    stream = await navigator.mediaDevices.getUserMedia({
      audio: {
        echoCancellation: true,
        noiseSuppression: true,
        autoGainControl: true,
      },
    });

    const hasLiveAudioTrack = stream.getAudioTracks().some((track) => track.readyState === 'live');
    if (!hasLiveAudioTrack) throw new Error('No live microphone track was available.');
  } finally {
    stream?.getTracks().forEach((track) => track.stop());
  }
}

export function useFlowAgentSession({
  flowSlug,
  mode,
  enabled,
  resumeSessionId,
  bibleScripture,
}: UseFlowAgentSessionArgs): UseFlowAgentSessionResult {
  const [status, setStatus] = useState<FlowAgentStatus>('idle');
  const [messages, setMessages] = useState<FlowAgentMessage[]>([]);
  const [flowSession, setFlowSession] = useState<StartFlowSessionResponse | null>(null);
  const [userJwt, setUserJwt] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [muted, setMuted] = useState(false);
  const [awaitingAgent, setAwaitingAgent] = useState(false);
  const [completedAnswers, setCompletedAnswers] = useState<Record<string, string> | null>(null);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [lastUserTranscript, setLastUserTranscript] = useState<string | null>(null);
  const [lastUserTranscriptAt, setLastUserTranscriptAt] = useState<number | null>(null);
  const connectionStartedRef = useRef(false);
  // Auto-start fires once per enable. `begin` changes identity on most renders,
  // and a failed connect leaves connectionStartedRef false, so without this the
  // effect below reconnects forever and clears the error each time round --
  // which is what made a CSP-blocked audio worklet look like an endless
  // "Connecting" instead of a visible failure.
  const autoStartedRef = useRef(false);
  const startInFlightRef = useRef(false);
  const startFreshRef = useRef(false);
  const explicitEndRef = useRef(false);
  const completionEndRef = useRef(false);
  const switchingRef = useRef(false);
  const modeRef = useRef(mode);
  const flowSessionRef = useRef<StartFlowSessionResponse | null>(null);
  const flowAgentRunIdRef = useRef<string | null>(null);
  const conversationIdRef = useRef<string | null>(null);
  const currentQuestionIdRef = useRef<string | null>(null);
  const lastKnownFlowStateRef = useRef<FlowAgentStateResponse | null>(null);
  const lastUserTranscriptRef = useRef<string | null>(null);
  const lastUserTranscriptAtRef = useRef<number | null>(null);
  const lastUserTranscriptQuestionIdRef = useRef<string | null>(null);
  const autoSaveTimerRef = useRef<number | null>(null);
  const autoSaveInFlightRef = useRef(false);
  const pendingAutoSaveQuestionIdRef = useRef<string | null>(null);
  const pendingAutoSaveAnswerRef = useRef<string | null>(null);
  const pendingCoachProbeRef = useRef<PendingCoachProbeState | null>(null);

  useEffect(() => {
    flowSessionRef.current = flowSession;
  }, [flowSession]);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    try {
      const params = new URLSearchParams(window.location.search);
      startFreshRef.current = params.get('flow_start') === 'fresh';
    } catch {
      startFreshRef.current = false;
    }
  }, []);

  const rememberFlowState = useCallback((state: FlowAgentStateResponse) => {
    lastKnownFlowStateRef.current = state;
    currentQuestionIdRef.current = state.current_question?.id ?? null;
    setAnswers(state.answers);
    if (state.coach_probe) {
      pendingCoachProbeRef.current = {
        ...state.coach_probe,
        nextQuestion: state.current_question,
        answers: state.answers,
        flowComplete: state.current_question === null,
      };
      const content = [state.coach_probe.reflection, state.coach_probe.probe].filter(Boolean).join('\n\n');
      if (modeRef.current === 'text') {
        setMessages((current) => isDuplicateMessage(current, 'assistant', content)
          ? current
          : [...current, {
            id: createMessageId('assistant'),
            role: 'assistant',
            content,
            streaming: true,
            timestamp: Date.now(),
          }]);
      }
    } else if (state.coach_probe === null) {
      pendingCoachProbeRef.current = null;
    }
  }, []);

  const rememberFlowProgress = useCallback((
    session: StartFlowSessionResponse,
    nextQuestion: FlowQuestion | null,
    answers: Record<string, string>,
    isComplete: boolean,
  ) => {
    const visibleQuestions = session.questions ?? [];
    lastKnownFlowStateRef.current = {
      session_id: session.session_id,
      flow_slug: session.flow_slug,
      flow_name: session.flow_name,
      current_question: nextQuestion,
      current_question_index: nextQuestion ? visibleQuestions.findIndex((question) => question.id === nextQuestion.id) : -1,
      total_visible_questions: visibleQuestions.length,
      answers,
      is_complete: isComplete,
    };
    currentQuestionIdRef.current = nextQuestion?.id ?? null;
    setAnswers(answers);
  }, []);

  const resolveCurrentQuestionForSession = useCallback((session: StartFlowSessionResponse) => {
    const stateQuestion = lastKnownFlowStateRef.current?.current_question ?? null;
    const questionId = currentQuestionIdRef.current ?? stateQuestion?.id ?? session.first_question.id;

    return session.questions?.find((question) => question.id === questionId) ??
      stateQuestion ??
      session.first_question;
  }, []);

  const completeSubmittedFlow = useCallback(async (
    session: StartFlowSessionResponse,
    submittedAnswers: Record<string, string>,
  ) => {
    const completed = await completeFlowAgentSession(session);
    const finalAnswers = completed.answers ?? submittedAnswers;

    rememberFlowProgress(session, null, finalAnswers, true);
    setCompletedAnswers(finalAnswers);
    setAnswers(finalAnswers);
    setAwaitingAgent(false);
    setStatus('completed');

    return finalAnswers;
  }, [rememberFlowProgress]);

  const recoverToolState = useCallback(async (tool: string) => {
    const currentSession = flowSessionRef.current;
    const freshState = currentSession ? await getFlowAgentState(currentSession).catch(() => null) : null;
    const state = freshState ?? lastKnownFlowStateRef.current;
    if (!state) return null;

    rememberFlowState(state);
    setAwaitingAgent(false);
    setErrorMessage(null);

    const baseResult = {
      success: true,
      recovered_tool_error: true,
      next_question: state.coach_probe
        ? null
        : currentSession
          ? interpolateSessionQuestion(currentSession, state.current_question, state.answers)
          : state.current_question,
      coach_probe: state.coach_probe ?? null,
      is_complete: state.is_complete,
      answers_so_far: state.answers,
    };
    const result = tool === 'get_flow_state'
      ? interpolateFlowAgentResultQuestions({ ...state, success: true, recovered_tool_error: true }, currentSession)
      : tool === 'evaluate_answer_quality'
        ? {
            ...baseResult,
            should_push_back: false,
            pushback_message: null,
          }
        : tool === 'complete_flow_session'
          ? {
              ...baseResult,
              required_answers_missing: true,
            }
          : baseResult;
    const json = stringifyReactToolResult(result, currentSession);
    logFlowAgentToolReturn(tool, withReactToolExecutor(result, currentSession), json, {
      recoveredFromToolError: true,
      flowAgentRunId: currentSession?.flow_agent_run_id ?? null,
    });
    return json;
  }, [rememberFlowState]);

  const scheduleVoiceTranscriptAutoSave = useCallback((questionId: string | null, answer: string) => {
    if (!questionId || !answer.trim()) return;
    if (modeRef.current !== 'voice') return;
    if (pendingCoachProbeRef.current) return;

    pendingAutoSaveAnswerRef.current = pendingAutoSaveQuestionIdRef.current === questionId
      ? mergeVoiceTranscriptFragments(pendingAutoSaveAnswerRef.current, answer)
      : answer.trim();
    pendingAutoSaveQuestionIdRef.current = questionId;

    if (autoSaveTimerRef.current) {
      window.clearTimeout(autoSaveTimerRef.current);
    }

    autoSaveTimerRef.current = window.setTimeout(async () => {
      const currentSession = flowSessionRef.current;
      if (!currentSession || autoSaveInFlightRef.current) return;
      const pendingQuestionId = pendingAutoSaveQuestionIdRef.current;
      const pendingAnswer = pendingAutoSaveAnswerRef.current?.trim() ?? '';
      if (!pendingQuestionId || !pendingAnswer) return;

      autoSaveInFlightRef.current = true;

      try {
        console.info('[FlowAgentAutoSave]', {
          phase: 'start',
          questionId: pendingQuestionId,
          answerLength: pendingAnswer.length,
          sessionId: currentSession?.session_id ?? null,
          flowAgentRunId: currentSession?.flow_agent_run_id ?? null,
          conversationId: currentSession?.conversation_id ?? conversationIdRef.current,
          currentQuestionIdRef: currentQuestionIdRef.current,
        });
        const state = await getFlowAgentState(currentSession);
        rememberFlowState(state);

        const alreadySaved =
          typeof state.answers[pendingQuestionId] === 'string' &&
          state.answers[pendingQuestionId].trim().length > 0;
        console.info('[FlowAgentAutoSave]', {
          phase: 'state',
          questionId: pendingQuestionId,
          answerLength: pendingAnswer.length,
          stateCurrentQuestionId: state.current_question?.id ?? null,
          stateIsComplete: state.is_complete,
          stateAnswerKeys: Object.keys(state.answers),
          alreadySaved,
        });
        if (state.is_complete || alreadySaved || state.current_question?.id !== pendingQuestionId) return;

        const question = currentSession.questions?.find((candidate) => candidate.id === pendingQuestionId);
        if (isQuestionChallengeEnabled(currentSession, question)) {
          try {
            console.info('[FlowAgentAutoSave]', {
              phase: 'evaluate_answer_quality',
              questionId: pendingQuestionId,
              answerLength: pendingAnswer.length,
              question,
            });
            const quality = await evaluateFlowAgentAnswer(currentSession, pendingQuestionId, pendingAnswer);
            console.info('[FlowAgentAutoSaveReturn]', {
              phase: 'evaluate_answer_quality',
              questionId: pendingQuestionId,
              answerLength: pendingAnswer.length,
              quality: sanitizeFlowAgentLogValue(quality),
            });
            if (quality.should_push_back) return;
          } catch (error) {
            console.warn('[FlowAgent] Voice transcript auto-save evaluator failed; saving transcript anyway', error);
          }
        }

        console.info('[FlowAgentAutoSave]', {
          phase: 'submit_flow_answer',
          questionId: pendingQuestionId,
          answerLength: pendingAnswer.length,
        });
        const result = await submitFlowAgentAnswer(currentSession, pendingQuestionId, pendingAnswer);
        console.info('[FlowAgentAutoSaveReturn]', {
          phase: 'submit_flow_answer',
          questionId: pendingQuestionId,
          answerLength: pendingAnswer.length,
          result: sanitizeFlowAgentLogValue(result),
        });
        if (result.validation_error) {
          currentQuestionIdRef.current = result.retry_question?.id ?? result.next_question?.id ?? pendingQuestionId;
          setErrorMessage(null);
          return;
        }

        rememberFlowProgress(currentSession, result.next_question, result.answers_so_far, result.is_complete);
        setErrorMessage(null);

        if (result.is_complete) {
          await completeSubmittedFlow(currentSession, result.answers_so_far);
        }
      } catch (error) {
        console.error('[FlowAgentAutoSaveError]', {
          questionId: pendingAutoSaveQuestionIdRef.current,
          answerLength: pendingAutoSaveAnswerRef.current?.length ?? null,
          error,
          errorName: error instanceof Error ? error.name : null,
          errorMessage: error instanceof Error ? error.message : String(error),
          errorStack: error instanceof Error ? error.stack : null,
          functionName: error instanceof FlowAgentFunctionError ? error.functionName : null,
          code: error instanceof FlowAgentFunctionError ? error.code : null,
          status: error instanceof FlowAgentFunctionError ? error.status : null,
        });
        console.error('[FlowAgent] Voice transcript auto-save failed', error);
      } finally {
        pendingAutoSaveQuestionIdRef.current = null;
        pendingAutoSaveAnswerRef.current = null;
        autoSaveTimerRef.current = null;
        autoSaveInFlightRef.current = false;
      }
    }, VOICE_TRANSCRIPT_AUTOSAVE_DELAY_MS);
  }, [completeSubmittedFlow, rememberFlowProgress, rememberFlowState]);

  const rememberUserTranscript = useCallback((content: string) => {
    const questionId = currentQuestionIdRef.current ?? flowSessionRef.current?.first_question.id ?? null;
    const question = flowSessionRef.current?.questions?.find((candidate) => candidate.id === questionId) ?? null;

    if (isIgnorableVoiceTranscriptForQuestion(content, question)) {
      console.info('[FlowAgentTranscript]', {
        contentLength: content.length,
        ignored: true,
        reason: 'placeholder_or_filler_transcript',
        questionId,
        question,
        currentQuestionIdRef: currentQuestionIdRef.current,
        firstQuestionId: flowSessionRef.current?.first_question?.id ?? null,
      });
      return;
    }

    const heardAt = Date.now();

    lastUserTranscriptRef.current = content;
    lastUserTranscriptAtRef.current = heardAt;
    lastUserTranscriptQuestionIdRef.current = questionId;
    setLastUserTranscript(content);
    setLastUserTranscriptAt(heardAt);
    console.info('[FlowAgentTranscript]', {
      contentLength: content.length,
      heardAt,
      questionId,
      currentQuestionIdRef: currentQuestionIdRef.current,
      firstQuestionId: flowSessionRef.current?.first_question?.id ?? null,
    });
    scheduleVoiceTranscriptAutoSave(questionId, content);
  }, [scheduleVoiceTranscriptAutoSave]);

  const getToolAnswer = useCallback((parameters: unknown, questionId: string, question?: FlowQuestion | null) => {
    const providedAnswer = getStringParam(parameters, 'answer').trim();
    if (providedAnswer) {
      if (isIgnorableVoiceTranscriptForQuestion(providedAnswer, question)) {
        console.info('[FlowAgentTranscript]', {
          contentLength: providedAnswer.length,
          ignored: true,
          reason: 'placeholder_or_filler_tool_answer',
          questionId,
          question,
        });
        return '';
      }

      return providedAnswer;
    }

    const fallbackAnswer = lastUserTranscriptRef.current?.trim();
    const fallbackAt = lastUserTranscriptAtRef.current;
    const fallbackQuestionId = lastUserTranscriptQuestionIdRef.current;
    if (fallbackAnswer && fallbackAt && fallbackQuestionId === questionId && Date.now() - fallbackAt < 15000) {
      if (isIgnorableVoiceTranscriptForQuestion(fallbackAnswer, question)) {
        return '';
      }

      console.warn('[FlowAgent] Falling back to last heard transcript for tool answer');
      return fallbackAnswer;
    }

    return '';
  }, []);

  const clientTools = useMemo(
    () => ({
      get_flow_state: async () => {
        try {
          const currentSession = flowSessionRef.current;
          console.info('[FlowAgentTool]', {
            tool: 'get_flow_state',
            sessionId: currentSession?.session_id ?? null,
            flowAgentRunId: currentSession?.flow_agent_run_id ?? null,
            conversationId: currentSession?.conversation_id ?? conversationIdRef.current,
            currentQuestionIdRef: currentQuestionIdRef.current,
          });
          if (!currentSession) return flowToolError('Flow session is not ready.', currentSession);
          const state = await getFlowAgentState(currentSession);
          rememberFlowState(state);
          const result = interpolateFlowAgentResultQuestions({ success: true, ...state }, currentSession);
          const json = stringifyReactToolResult(result, currentSession);
          logFlowAgentToolReturn('get_flow_state', withReactToolExecutor(result, currentSession), json);
          return json;
        } catch (error) {
          console.error('[FlowAgentToolError]', {
            tool: 'get_flow_state',
            error,
            errorName: error instanceof Error ? error.name : null,
            errorMessage: error instanceof Error ? error.message : String(error),
            errorStack: error instanceof Error ? error.stack : null,
            functionName: error instanceof FlowAgentFunctionError ? error.functionName : null,
            code: error instanceof FlowAgentFunctionError ? error.code : null,
            status: error instanceof FlowAgentFunctionError ? error.status : null,
          });
          const recovered = await recoverToolState('get_flow_state');
          if (recovered) return recovered;
          return flowToolError(error, flowSessionRef.current);
        }
      },
      evaluate_answer_quality: async (parameters: unknown) => {
        try {
          const currentSession = flowSessionRef.current;
          console.info('[FlowAgentTool]', {
            tool: 'evaluate_answer_quality',
            parameters,
            sessionId: currentSession?.session_id ?? null,
            flowAgentRunId: currentSession?.flow_agent_run_id ?? null,
            conversationId: currentSession?.conversation_id ?? conversationIdRef.current,
            currentQuestionIdRefBefore: currentQuestionIdRef.current,
            lastUserTranscriptLength: lastUserTranscriptRef.current?.length ?? null,
            lastUserTranscriptAt: lastUserTranscriptAtRef.current,
            lastUserTranscriptQuestionId: lastUserTranscriptQuestionIdRef.current,
          });
          if (!currentSession) return flowToolError('Flow session is not ready.', currentSession);

          const requestedQuestionId = getStringParam(parameters, 'question_id');
          console.info('[FlowAgentTool]', {
            tool: 'evaluate_answer_quality',
            phase: 'requested',
            requestedQuestionId,
          });
          const { state, questionId } = await resolveCurrentQuestionId(currentSession, requestedQuestionId);
          rememberFlowState(state);
          console.info('[FlowAgentTool]', {
            tool: 'evaluate_answer_quality',
            phase: 'resolved',
            requestedQuestionId,
            resolvedQuestionId: questionId,
            currentQuestionIdRefAfterResolve: currentQuestionIdRef.current,
          });
          const question = currentSession.questions?.find((candidate) => candidate.id === questionId);
          const answer = questionId ? getToolAnswer(parameters, questionId, question) : '';
          console.info('[FlowAgentTool]', {
            tool: 'evaluate_answer_quality',
            phase: 'answer_selected',
            requestedQuestionId,
            resolvedQuestionId: questionId,
            providedAnswerLength: getStringParam(parameters, 'answer').length,
            selectedAnswerLength: answer.length,
            question,
            isQuestionChallengeEnabled: isQuestionChallengeEnabled(currentSession, question),
          });

          if (!answer.trim()) {
            const result = {
              success: true,
              should_push_back: false,
              pushback_message: null,
              ignored_empty_answer: true,
            };
            const json = stringifyReactToolResult(result, currentSession);
            logFlowAgentToolReturn('evaluate_answer_quality', withReactToolExecutor(result, currentSession), json);
            return json;
          }

          if (!isQuestionChallengeEnabled(currentSession, question)) {
            const result = { success: true, should_push_back: false, pushback_message: null };
            const json = stringifyReactToolResult(result, currentSession);
            logFlowAgentToolReturn('evaluate_answer_quality', withReactToolExecutor(result, currentSession), json);
            return json;
          }

          const result = { success: true, ...(await evaluateFlowAgentAnswer(currentSession, questionId, answer)) };
          const json = stringifyReactToolResult(result, currentSession);
          logFlowAgentToolReturn('evaluate_answer_quality', withReactToolExecutor(result, currentSession), json);
          return json;
        } catch (error) {
          console.error('[FlowAgentToolError]', {
            tool: 'evaluate_answer_quality',
            parameters,
            error,
            errorName: error instanceof Error ? error.name : null,
            errorMessage: error instanceof Error ? error.message : String(error),
            errorStack: error instanceof Error ? error.stack : null,
            functionName: error instanceof FlowAgentFunctionError ? error.functionName : null,
            code: error instanceof FlowAgentFunctionError ? error.code : null,
            status: error instanceof FlowAgentFunctionError ? error.status : null,
          });
          const recovered = await recoverToolState('evaluate_answer_quality');
          if (recovered) return recovered;
          return flowToolError(error, flowSessionRef.current);
        }
      },
      submit_flow_answer: async (parameters: unknown) => {
        try {
          const currentSession = flowSessionRef.current;
          console.info('[FlowAgentTool]', {
            tool: 'submit_flow_answer',
            parameters,
            sessionId: currentSession?.session_id ?? null,
            flowAgentRunId: currentSession?.flow_agent_run_id ?? null,
            conversationId: currentSession?.conversation_id ?? conversationIdRef.current,
            currentQuestionIdRefBefore: currentQuestionIdRef.current,
            lastUserTranscriptLength: lastUserTranscriptRef.current?.length ?? null,
            lastUserTranscriptAt: lastUserTranscriptAtRef.current,
            lastUserTranscriptQuestionId: lastUserTranscriptQuestionIdRef.current,
          });
          if (!currentSession) return flowToolError('Flow session is not ready.', currentSession);

          const requestedQuestionId = getStringParam(parameters, 'question_id');
          console.info('[FlowAgentTool]', {
            tool: 'submit_flow_answer',
            phase: 'requested',
            requestedQuestionId,
          });
          const { state, questionId } = await resolveCurrentQuestionId(currentSession, requestedQuestionId);
          rememberFlowState(state);
          console.info('[FlowAgentTool]', {
            tool: 'submit_flow_answer',
            phase: 'resolved',
            requestedQuestionId,
            resolvedQuestionId: questionId,
            stateCurrentQuestionId: state.current_question?.id ?? null,
            stateIsComplete: state.is_complete,
            stateAnswerKeys: Object.keys(state.answers),
          });
          if (requestedQuestionId && state.answers[requestedQuestionId]?.trim()) {
            rememberFlowProgress(
              currentSession,
              state.current_question,
              state.answers,
              state.is_complete,
            );
            const finalAnswers = state.is_complete
              ? await completeSubmittedFlow(currentSession, state.answers)
              : state.answers;
            if (!state.is_complete) setAwaitingAgent(false);
            const result = {
              success: true,
              next_question: state.is_complete
                ? null
                : interpolateSessionQuestion(currentSession, state.current_question, finalAnswers),
              is_complete: state.is_complete,
              answers_so_far: finalAnswers,
            };
            const json = stringifyReactToolResult(result, currentSession);
            logFlowAgentToolReturn('submit_flow_answer', withReactToolExecutor(result, currentSession), json);
            return json;
          }

          if (state.is_complete || !questionId) {
            const finalAnswers = await completeSubmittedFlow(currentSession, state.answers);
            const result = {
              success: true,
              next_question: null,
              is_complete: true,
              answers_so_far: finalAnswers,
            };
            const json = stringifyReactToolResult(result, currentSession);
            logFlowAgentToolReturn('submit_flow_answer', withReactToolExecutor(result, currentSession), json);
            return json;
          }

          const question = currentSession.questions?.find((candidate) => candidate.id === questionId);
          const answer = getToolAnswer(parameters, questionId, question);
          console.info('[FlowAgentTool]', {
            tool: 'submit_flow_answer',
            phase: 'answer_selected',
            requestedQuestionId,
            resolvedQuestionId: questionId,
            providedAnswerLength: getStringParam(parameters, 'answer').length,
            selectedAnswerLength: answer.length,
            question,
          });
          if (!answer.trim()) {
            console.warn('[FlowAgent] Ignoring empty voice tool submit', {
              requestedQuestionId,
              currentQuestionId: questionId,
              sessionId: currentSession.session_id,
            });
            setAwaitingAgent(false);
            const result = {
              success: true,
              ignored_empty_answer: true,
              next_question: interpolateSessionQuestion(currentSession, state.current_question, state.answers),
              is_complete: state.is_complete,
              answers_so_far: state.answers,
            };
            const json = stringifyReactToolResult(result, currentSession);
            logFlowAgentToolReturn('submit_flow_answer', withReactToolExecutor(result, currentSession), json);
            return json;
          }

          const result = await submitFlowAgentAnswer(currentSession, questionId, answer);
          if (result.validation_error) {
            const interpolatedResult = interpolateFlowAgentResultQuestions(result, currentSession);
            currentQuestionIdRef.current = result.retry_question?.id ?? result.next_question?.id ?? questionId;
            setAwaitingAgent(false);
            setErrorMessage(null);
            const json = stringifyReactToolResult(interpolatedResult, currentSession);
            logFlowAgentToolReturn(
              'submit_flow_answer',
              withReactToolExecutor(interpolatedResult, currentSession),
              json,
            );
            return json;
          }

          rememberFlowProgress(
            currentSession,
            result.next_question,
            result.answers_so_far,
            result.is_complete,
          );

          let completedAnswersSoFar = result.answers_so_far;
          if (result.is_complete) {
            completedAnswersSoFar = await completeSubmittedFlow(currentSession, result.answers_so_far);
          }

          const interpolatedResult = interpolateFlowAgentResultQuestions({
            ...result,
            answers_so_far: completedAnswersSoFar,
          }, currentSession);
          const json = stringifyReactToolResult(interpolatedResult, currentSession);
          logFlowAgentToolReturn(
            'submit_flow_answer',
            withReactToolExecutor(interpolatedResult, currentSession),
            json,
          );
          return json;
        } catch (error) {
          console.error('[FlowAgentToolError]', {
            tool: 'submit_flow_answer',
            parameters,
            error,
            errorName: error instanceof Error ? error.name : null,
            errorMessage: error instanceof Error ? error.message : String(error),
            errorStack: error instanceof Error ? error.stack : null,
            functionName: error instanceof FlowAgentFunctionError ? error.functionName : null,
            code: error instanceof FlowAgentFunctionError ? error.code : null,
            status: error instanceof FlowAgentFunctionError ? error.status : null,
          });
          if (isInvalidSelectOptionError(error)) {
            const currentSession = flowSessionRef.current;
            const state = currentSession ? await getFlowAgentState(currentSession).catch(() => null) : null;
            const retryQuestion = state?.current_question ?? null;
            const answersSoFar = state?.answers ?? {};
            const interpolatedRetryQuestion = currentSession
              ? interpolateSessionQuestion(currentSession, retryQuestion, answersSoFar)
              : retryQuestion;
            setAwaitingAgent(false);
            setErrorMessage(null);
            const result = {
              success: true,
              validation_error: true,
              user_message: buildSelectRetryMessage(interpolatedRetryQuestion),
              retry_question: interpolatedRetryQuestion,
              next_question: interpolatedRetryQuestion,
              is_complete: false,
              answers_so_far: answersSoFar,
            };
            const json = stringifyReactToolResult(result, currentSession);
            logFlowAgentToolReturn('submit_flow_answer', withReactToolExecutor(result, currentSession), json);
            return json;
          }
          const recovered = await recoverToolState('submit_flow_answer');
          if (recovered) return recovered;
          setAwaitingAgent(false);
          setErrorMessage('The app could not confirm the current Flow state. Retry or switch to text.');
          return flowToolError(error, flowSessionRef.current);
        }
      },
      complete_flow_session: async () => {
        try {
          const currentSession = flowSessionRef.current;
          console.info('[FlowAgentTool]', {
            tool: 'complete_flow_session',
            sessionId: currentSession?.session_id ?? null,
            flowAgentRunId: currentSession?.flow_agent_run_id ?? null,
            conversationId: currentSession?.conversation_id ?? conversationIdRef.current,
            currentQuestionIdRef: currentQuestionIdRef.current,
          });
          if (!currentSession) return flowToolError('Flow session is not ready.', currentSession);

          const result = await completeFlowAgentSession(currentSession);
          setCompletedAnswers(result.answers);
          setAnswers(result.answers);
          setAwaitingAgent(false);
          setStatus('completed');
          const json = stringifyReactToolResult(result, currentSession);
          logFlowAgentToolReturn('complete_flow_session', withReactToolExecutor(result, currentSession), json);
          return json;
        } catch (error) {
          console.error('[FlowAgentToolError]', {
            tool: 'complete_flow_session',
            error,
            errorName: error instanceof Error ? error.name : null,
            errorMessage: error instanceof Error ? error.message : String(error),
            errorStack: error instanceof Error ? error.stack : null,
            functionName: error instanceof FlowAgentFunctionError ? error.functionName : null,
            code: error instanceof FlowAgentFunctionError ? error.code : null,
            status: error instanceof FlowAgentFunctionError ? error.status : null,
          });
          if (error instanceof FlowAgentFunctionError && error.code === 'REQUIRED_ANSWERS_MISSING') {
            const recovered = await recoverToolState('complete_flow_session');
            if (recovered) return recovered;
          }
          const recovered = await recoverToolState('complete_flow_session');
          if (recovered) return recovered;
          setAwaitingAgent(false);
          setErrorMessage('The app could not confirm this Flow is complete. Retry or switch to text.');
          return flowToolError(error, flowSessionRef.current);
        }
      },
    }),
    [completeSubmittedFlow, getToolAnswer, recoverToolState, rememberFlowProgress, rememberFlowState],
  );

  const conversation = useConversation({
    textOnly: mode === 'text',
    micMuted: muted,
    clientTools,
    preferHeadphonesForIosDevices: mode === 'voice',
    connectionDelay: mode === 'voice'
      ? {
          default: 750,
          ios: 1000,
          android: 3000,
        }
      : undefined,
    onConnect: (props) => {
      conversationIdRef.current = props.conversationId;
      console.info('[FlowAgentVoiceSession]', {
        phase: 'conversation_connected',
        conversationId: props.conversationId,
        flowAgentRunId: flowSessionRef.current?.flow_agent_run_id ?? flowAgentRunIdRef.current,
      });
      setStatus(switchingRef.current ? 'switching' : 'active');
      switchingRef.current = false;
      setErrorMessage(null);
    },
    onDisconnect: (details) => {
      console.warn('[FlowAgent] ElevenLabs conversation disconnected', {
        details,
        conversationId: conversationIdRef.current,
        flowAgentRunId: flowSessionRef.current?.flow_agent_run_id ?? flowAgentRunIdRef.current,
      });
      if (switchingRef.current) return;
      if (completionEndRef.current) {
        completionEndRef.current = false;
        setStatus('completed');
        return;
      }
      if (explicitEndRef.current) {
        explicitEndRef.current = false;
        setStatus((current) => (current === 'error' ? current : 'ended'));
        return;
      }

      setAwaitingAgent(false);
      setErrorMessage('Voice connection ended before this Flow was complete. Retry or switch to text mode.');
      setStatus('error');
    },
    onError: (error, context) => {
      const err = error as unknown;
      console.error('[FlowAgentConversationError]', {
        error,
        context,
        conversationId: conversationIdRef.current,
        flowAgentRunId: flowSessionRef.current?.flow_agent_run_id ?? flowAgentRunIdRef.current,
        errorName: err instanceof Error ? err.name : null,
        errorMessage: err instanceof Error ? err.message : String(err),
        errorStack: err instanceof Error ? err.stack : null,
      });
      setErrorMessage(normalizeError(error));
      setStatus('error');
    },
    onDebug: (info) => {
      console.debug('[FlowAgentDebug]', {
        info,
        conversationId: conversationIdRef.current,
        flowAgentRunId: flowSessionRef.current?.flow_agent_run_id ?? flowAgentRunIdRef.current,
      });
    },
    onUnhandledClientToolCall: (toolCall) => {
      console.error('[FlowAgentUnhandledToolCall]', {
        toolCall,
        conversationId: conversationIdRef.current,
        flowAgentRunId: flowSessionRef.current?.flow_agent_run_id ?? flowAgentRunIdRef.current,
      });
    },
    onMessage: (message) => {
      const content = typeof message.message === 'string' ? message.message.trim() : '';
      if (!content) return;
      const role = message.source === 'ai' ? 'assistant' : 'user';

      if (role === 'user') {
        rememberUserTranscript(content);
      } else {
        console.info('[FlowAgentAssistantMessage]', {
          contentLength: content.length,
          conversationId: conversationIdRef.current,
          flowAgentRunId: flowSessionRef.current?.flow_agent_run_id ?? flowAgentRunIdRef.current,
        });
      }

      setMessages((current) => {
        if (isDuplicateMessage(current, role, content)) return current;
        return [
          ...current,
          {
            id: createMessageId(role),
            role,
            content,
            streaming: role === 'assistant',
            timestamp: Date.now(),
          },
        ];
      });

      if (role === 'assistant') {
        setAwaitingAgent(false);
      }
    },
  });
  const conversationRef = useRef(conversation);

  useEffect(() => {
    conversationRef.current = conversation;
  }, [conversation]);

  const agentId = import.meta.env.VITE_ELEVENLABS_AGENT_ID;

  const buildDynamicVariables = useCallback(
    (session: StartFlowSessionResponse, jwt: string | null) => {
      const currentQuestion = resolveCurrentQuestionForSession(session);
      const currentAnswers = lastKnownFlowStateRef.current?.answers ?? {};

      return {
        user_jwt: jwt || '',
        session_id: session.session_id,
        session_token: session.session_token,
        flow_agent_run_id: session.flow_agent_run_id ?? '',
        flow_slug: session.flow_slug,
        current_question_id: currentQuestion.id,
        current_question_prompt: interpolateSessionPrompt(session, currentQuestion.prompt, currentAnswers),
        flow_questions: JSON.stringify(buildQuestionMap(session)),
      };
    },
    [resolveCurrentQuestionForSession],
  );

  const startConversation = useCallback(
    async (session: StartFlowSessionResponse, jwt: string | null, includeFirstMessage: boolean) => {
      if (!agentId) {
        throw new Error('Voice mode is not configured yet. Switch to TEXT mode above to continue this Flow.');
      }

      if (conversation.status === 'connected' || conversation.status === 'connecting') {
        await conversation.endSession();
      }

      if (mode === 'voice') {
        try {
          await verifyMicrophoneAccess();
        } catch {
          throw new Error('Voice mode needs mic permission. Switch to text?');
        }
      }

      const voiceSession = mode === 'voice' ? session.voice_session : null;

      // No voice session means the server could not get a credential from
      // ElevenLabs (it returns voice_error saying why). Connecting with a bare
      // agentId is not a fallback — the agent requires auth, so the SDK would
      // sit in `connecting` forever. Fail loudly instead.
      if (mode === 'voice' && !voiceSession) {
        throw new Error(
          session.voice_error?.message ??
            'Voice mode is unavailable right now. Switch to TEXT mode above to continue this Flow.',
        );
      }

      const ttsVoiceId = mode === 'voice' && session.voice_routing?.routing === 'base_with_voice_override'
        ? session.voice_routing.tts_voice_id
        : null;
      const connectionOptions = voiceSession?.conversation_token
        ? {
            conversationToken: voiceSession.conversation_token,
            connectionType: voiceSession.connection_type,
          }
        : voiceSession?.signed_url
          ? {
              signedUrl: voiceSession.signed_url,
            }
          : {
              agentId,
              connectionType: mode === 'voice' ? 'webrtc' as const : 'websocket' as const,
            };

      console.info('[FlowAgentVoiceSession]', {
        phase: 'conversation_start',
        flowSlug: session.flow_slug,
        sessionId: session.session_id,
        flowAgentRunId: session.flow_agent_run_id ?? flowAgentRunIdRef.current,
        voiceSessionAgentId: voiceSession?.agent_id ?? null,
        connectionType: voiceSession?.connection_type ?? connectionOptions.connectionType ?? null,
        hasSignedUrl: Boolean(voiceSession?.signed_url),
        hasConversationToken: Boolean(voiceSession?.conversation_token),
        fallbackAgentId: voiceSession ? null : agentId,
        routing: session.voice_routing?.routing ?? 'base',
        voiceRoutingMode: session.voice_routing?.mode ?? null,
        ttsVoiceId,
        textOnly: mode === 'text',
      });

      type FlowConversationStartSession = (options: typeof connectionOptions & {
        textOnly: boolean;
        dynamicVariables: ReturnType<typeof buildDynamicVariables>;
        overrides: {
          agent: {
            prompt: { prompt: string };
            firstMessage?: string;
          };
          tts?: { voiceId: string };
          conversation: { textOnly: boolean };
        };
      }) => Promise<string>;

      const currentQuestion = resolveCurrentQuestionForSession(session);
      const currentAnswers = lastKnownFlowStateRef.current?.answers ?? {};
      const startSession = conversation.startSession as unknown as FlowConversationStartSession;
      const conversationId = await startSession({
        ...connectionOptions,
        textOnly: mode === 'text',
        dynamicVariables: buildDynamicVariables(session, jwt),
        overrides: {
          agent: {
            prompt: {
              prompt: buildFlowVoicePrompt(session),
            },
            firstMessage: includeFirstMessage
              ? interpolateSessionPrompt(session, currentQuestion.prompt, currentAnswers)
              : undefined,
          },
          tts: ttsVoiceId ? { voiceId: ttsVoiceId } : undefined,
          conversation: {
            textOnly: mode === 'text',
          },
        },
      });
      conversationIdRef.current = conversationId;
      const sessionWithConversationId = {
        ...session,
        conversation_id: conversationId,
      };
      flowSessionRef.current = sessionWithConversationId;
      setFlowSession((current) =>
        current?.session_id === session.session_id ? sessionWithConversationId : current
      );
      console.info('[FlowAgentVoiceSession]', {
        phase: 'conversation_started',
        conversationId,
        flowSlug: session.flow_slug,
        sessionId: session.session_id,
        flowAgentRunId: session.flow_agent_run_id ?? flowAgentRunIdRef.current,
        voiceSessionAgentId: voiceSession?.agent_id ?? null,
        routing: session.voice_routing?.routing ?? 'base',
        voiceRoutingMode: session.voice_routing?.mode ?? null,
        ttsVoiceId,
      });
    },
    [agentId, buildDynamicVariables, conversation, mode, resolveCurrentQuestionForSession],
  );

  const begin = useCallback(
    async (forceRestart = false) => {
      if (!enabled || !flowSlug) return;
      if (startInFlightRef.current && !forceRestart) return;

      startInFlightRef.current = true;
      setStatus(forceRestart ? 'switching' : 'starting');
      setErrorMessage(null);
      explicitEndRef.current = false;

      try {
        let nextFlowSession = flowSession;
        let nextUserJwt = userJwt;
        let includeFirstMessage = false;

        if (!nextFlowSession) {
          const startFresh = startFreshRef.current;
          startFreshRef.current = false;
          const flowAgentRunId = createFlowAgentRunId();
          flowAgentRunIdRef.current = flowAgentRunId;
          conversationIdRef.current = null;
          const result = await startFlowSession({
            flowSlug,
            startFresh,
            resumeSessionId,
            flowAgentRunId,
            bibleScripture,
          });
          nextFlowSession = result.flowSession;
          nextUserJwt = result.userJwt;
          flowAgentRunIdRef.current = result.flowSession.flow_agent_run_id ?? flowAgentRunId;
          flowSessionRef.current = result.flowSession;
          setFlowSession(result.flowSession);
          setUserJwt(result.userJwt);
          includeFirstMessage = true;

          const initialState = await getFlowAgentState(result.flowSession).catch(() => null);
          if (initialState) {
            rememberFlowState(initialState);
          } else {
            currentQuestionIdRef.current = result.flowSession.first_question.id;
          }

          const promptMessage = {
            id: 'first-flow-question',
            role: 'assistant',
            content: interpolateSessionPrompt(
              result.flowSession,
              result.flowSession.first_question.prompt,
              initialState?.answers ?? {},
            ),
            streaming: true,
            timestamp: Date.now(),
          } satisfies FlowAgentMessage;

          if (!initialState?.coach_probe) {
            setMessages((current) => {
              if (!flowSession) return [promptMessage];
              if (isDuplicateMessage(current, 'assistant', promptMessage.content)) return current;
              return [...current, promptMessage];
            });
          }
        } else if (forceRestart) {
          const state = await getFlowAgentState(nextFlowSession).catch(() => null);
          if (state) {
            rememberFlowState(state);
            if (state.is_complete) {
              await completeSubmittedFlow(nextFlowSession, state.answers);
              return;
            }

            const currentQuestion = state.current_question
              ? nextFlowSession.questions?.find((question) => question.id === state.current_question?.id) ??
                state.current_question
              : nextFlowSession.first_question;
            nextFlowSession = {
              ...nextFlowSession,
              first_question: currentQuestion,
            };
            flowSessionRef.current = nextFlowSession;
            setFlowSession(nextFlowSession);
            includeFirstMessage = mode === 'voice';
          }
        }

        if (!nextFlowSession) {
          throw new Error('Unable to prepare this Flow.');
        }

        if (mode === 'text') {
          const currentConversation = conversationRef.current;
          if (currentConversation.status === 'connected' || currentConversation.status === 'connecting') {
            await currentConversation.endSession();
          }
          switchingRef.current = false;
          connectionStartedRef.current = true;
          setStatus('active');
          return;
        }

        await startConversation(nextFlowSession, nextUserJwt, includeFirstMessage);
        connectionStartedRef.current = true;
        setStatus('active');
      } catch (error) {
        let message = normalizeError(error);
        if (mode === 'voice' && !/text/i.test(message)) {
          // Voice must degrade gracefully: always point the user at TEXT mode.
          message = `${message} You can switch to TEXT mode above and continue this Flow.`;
        }
        setErrorMessage(message);
        setStatus('error');
      } finally {
        startInFlightRef.current = false;
      }
    },
    [
      bibleScripture,
      completeSubmittedFlow,
      enabled,
      flowSlug,
      flowSession,
      mode,
      rememberFlowState,
      resumeSessionId,
      startConversation,
      userJwt,
    ],
  );

  const refreshFlowState = useCallback(async () => {
    const currentSession = flowSessionRef.current;
    if (!currentSession) return;

    const state = await getFlowAgentState(currentSession);
    rememberFlowState(state);
    if (state.is_complete) {
      await completeSubmittedFlow(currentSession, state.answers);
    }
  }, [completeSubmittedFlow, rememberFlowState]);

  useEffect(() => {
    if (!enabled) {
      autoStartedRef.current = false;
      return;
    }
    if (connectionStartedRef.current || autoStartedRef.current) return;
    autoStartedRef.current = true;
    void begin(false);
  }, [begin, enabled]);

  useEffect(() => {
    if (!enabled || !connectionStartedRef.current || modeRef.current === mode) {
      modeRef.current = mode;
      return;
    }

    modeRef.current = mode;
    switchingRef.current = true;
    void begin(true);
  }, [begin, enabled, mode]);

  useEffect(() => {
    return () => {
      if (autoSaveTimerRef.current) {
        window.clearTimeout(autoSaveTimerRef.current);
      }
      pendingAutoSaveQuestionIdRef.current = null;
      pendingAutoSaveAnswerRef.current = null;

      const currentConversation = conversationRef.current;
      if (currentConversation.status === 'connected' || currentConversation.status === 'connecting') {
        void currentConversation.endSession();
      }
    };
  }, []);

  useEffect(() => {
    if (!flowSession || (status !== 'active' && status !== 'switching')) return;

    const intervalId = window.setInterval(() => {
      void refreshFlowState();
    }, 2500);

    return () => window.clearInterval(intervalId);
  }, [flowSession, refreshFlowState, status]);

  useEffect(() => {
    if (status !== 'completed') return;
    if (conversation.status !== 'connected' && conversation.status !== 'connecting') return;

    completionEndRef.current = true;
    void conversation.endSession();
  }, [conversation, status]);

  const sendUserMessage = useCallback(
    async (text: string) => {
      const trimmed = text.trim();
      if (!trimmed) return;

      setMessages((current) => [
        ...current,
        {
          id: createMessageId('user'),
          role: 'user',
          content: trimmed,
          timestamp: Date.now(),
        },
      ]);
      setAwaitingAgent(true);
      const replyStartedAt = Date.now();

      try {
        if (mode === 'text') {
          const currentSession = flowSessionRef.current;
          if (!currentSession) {
            throw new Error('Flow session is not ready.');
          }

          const pendingProbe = pendingCoachProbeRef.current;
          if (pendingProbe) {
            const resolved = await answerFlowCoachProbe(currentSession, pendingProbe.question_id, trimmed);
            if (!resolved.probe_resolved) throw new Error('Flowing could not save that follow-up yet. Please retry.');
            pendingCoachProbeRef.current = null;
            rememberFlowProgress(
              currentSession,
              pendingProbe.nextQuestion,
              pendingProbe.answers,
              pendingProbe.flowComplete,
            );
            await waitForTextReplyPause(replyStartedAt);
            const nextQuestionPrompt = pendingProbe.nextQuestion
              ? interpolateSessionPrompt(currentSession, pendingProbe.nextQuestion.prompt, pendingProbe.answers)
              : null;
            const assistantReply = [resolved.resolution, nextQuestionPrompt].filter(Boolean).join('\n\n');
            if (assistantReply) {
              setMessages((current) => [...current, {
                id: createMessageId('assistant'),
                role: 'assistant',
                content: assistantReply,
                streaming: true,
                timestamp: Date.now(),
              }]);
            }
            if (pendingProbe.flowComplete) {
              await completeSubmittedFlow(currentSession, pendingProbe.answers);
            } else {
              setAwaitingAgent(false);
              setErrorMessage(null);
              setStatus('active');
            }
            return;
          }

          const questionId = currentQuestionIdRef.current ?? currentSession.first_question.id;
          if (!questionId) {
            await completeSubmittedFlow(currentSession, answers);
            return;
          }

          const question = currentSession.questions?.find((candidate) => candidate.id === questionId);
          if (isQuestionChallengeEnabled(currentSession, question)) {
            try {
              const evaluation = await evaluateFlowAgentAnswer(currentSession, questionId, trimmed);
              if (evaluation.should_push_back && evaluation.pushback_message) {
                await waitForTextReplyPause(replyStartedAt);
                setMessages((current) => [
                  ...current,
                  {
                    id: createMessageId('assistant'),
                    role: 'assistant',
                    content: evaluation.pushback_message ?? '',
                    streaming: true,
                    timestamp: Date.now(),
                  },
                ]);
                setAwaitingAgent(false);
                return;
              }
            } catch (error) {
              console.warn('[FlowAgent] Text evaluator failed; submitting answer anyway', error);
            }
          }

          const result = await submitFlowAgentAnswer(currentSession, questionId, trimmed);
          if (result.validation_error) {
            const interpolatedResult = interpolateFlowAgentResultQuestions(result, currentSession);
            currentQuestionIdRef.current = result.retry_question?.id ?? result.next_question?.id ?? questionId;
            setAnswers(result.answers_so_far);
            await waitForTextReplyPause(replyStartedAt);
            setMessages((current) => [
              ...current,
              {
                id: createMessageId('assistant'),
                role: 'assistant',
                content: buildSelectRetryMessageFromResult(interpolatedResult),
                streaming: true,
                timestamp: Date.now(),
              },
            ]);
            setAwaitingAgent(false);
            setErrorMessage(null);
            setStatus('active');
            return;
          }

          const coach = await requestFlowCoachReflection(
            currentSession,
            questionId,
            result.answers_so_far[questionId] ?? trimmed,
          );
          console.info('[FlowAgentText]', {
            phase: 'coach_reflection',
            questionId,
            hasReflection: Boolean(coach.reflection),
            skipped: Boolean(coach.skipped),
            reason: coach.reason ?? null,
          });

          const hasCoachProbe = Boolean(coach.probe);
          if (hasCoachProbe) {
            pendingCoachProbeRef.current = {
              coach_message_id: coach.coach_message_id ?? questionId,
              question_id: questionId,
              reflection: coach.reflection ?? '',
              probe: coach.probe!,
              nextQuestion: result.next_question,
              answers: result.answers_so_far,
              flowComplete: result.is_complete,
            };
          }
          rememberFlowProgress(
            currentSession,
            result.next_question,
            result.answers_so_far,
            result.is_complete && !hasCoachProbe,
          );
          setErrorMessage(null);

          await waitForTextReplyPause(replyStartedAt);

          if (hasCoachProbe) {
            const assistantReply = [coach.reflection, coach.probe].filter(Boolean).join('\n\n');
            setMessages((current) => [...current, {
              id: createMessageId('assistant'),
              role: 'assistant',
              content: assistantReply,
              streaming: true,
              timestamp: Date.now(),
            }]);
            setAwaitingAgent(false);
            setStatus('active');
            return;
          }

          if (result.is_complete) {
            if (coach.reflection) {
              setMessages((current) => [
                ...current,
                {
                  id: createMessageId('assistant'),
                  role: 'assistant',
                  content: coach.reflection,
                  streaming: true,
                  timestamp: Date.now(),
                },
              ]);
            }
            await completeSubmittedFlow(currentSession, result.answers_so_far);
            return;
          }

          if (result.next_question) {
            const nextQuestionPrompt = interpolateSessionPrompt(
              currentSession,
              result.next_question.prompt,
              result.answers_so_far,
            );
            const assistantReply = [coach.reflection, nextQuestionPrompt].filter(Boolean).join('\n\n');
            setMessages((current) => [
              ...current,
              {
                id: createMessageId('assistant'),
                role: 'assistant',
                content: assistantReply,
                streaming: true,
                timestamp: Date.now(),
              },
            ]);
          }

          setAwaitingAgent(false);
          setStatus('active');
          return;
        }

        rememberUserTranscript(trimmed);
        conversation.sendUserMessage(trimmed);
      } catch (error) {
        setAwaitingAgent(false);
        setErrorMessage(normalizeError(error));
        setStatus('error');
      }
    },
    [answers, completeSubmittedFlow, conversation, mode, rememberFlowProgress, rememberUserTranscript],
  );

  const editSavedAnswer = useCallback(async (questionId: string, answer: string) => {
    const currentSession = flowSessionRef.current;
    if (!currentSession) {
      throw new Error('Flow session is not ready.');
    }

    setAwaitingAgent(true);

    try {
      const result = await editFlowAgentAnswer(currentSession, questionId, answer);
      const isComplete = result.is_complete ?? result.next_question === null;
      // The edit RPC invalidates the old coach row. Regenerate a grounded
      // reflection before completion analysis or navigation continues. Edits
      // never introduce a surprise probe into an already-established route.
      const coach = await requestFlowCoachReflection(currentSession, questionId, answer, false);
      const finalAnswers = isComplete
        ? (await completeFlowAgentSession(currentSession)).answers
        : result.answers_so_far;
      rememberFlowProgress(
        currentSession,
        result.next_question ?? null,
        finalAnswers,
        isComplete,
      );
      setCompletedAnswers(isComplete ? finalAnswers : null);
      setErrorMessage(null);
      setStatus(isComplete ? 'completed' : 'active');

      if (coach.reflection && modeRef.current === 'text') {
        setMessages((current) => [
          ...current,
          {
            id: createMessageId('assistant'),
            role: 'assistant',
            content: coach.reflection ?? '',
            streaming: true,
            timestamp: Date.now(),
          },
        ]);
      }

      if (!isComplete && result.next_question && modeRef.current === 'text') {
        const nextQuestionPrompt = interpolateSessionPrompt(
          currentSession,
          result.next_question.prompt,
          finalAnswers,
        );
        setMessages((current) => [
          ...current,
          {
            id: createMessageId('assistant'),
            role: 'assistant',
            content: nextQuestionPrompt,
            streaming: true,
            timestamp: Date.now(),
          },
        ]);
      }
    } catch (error) {
      setErrorMessage(normalizeError(error));
      setStatus('error');
      throw error;
    } finally {
      setAwaitingAgent(false);
    }
  }, [rememberFlowProgress]);

  const endSession = useCallback(async () => {
    explicitEndRef.current = true;
    await conversation.endSession();
    setStatus('ended');
  }, [conversation]);

  const retry = useCallback(async () => {
    await begin(true);
  }, [begin]);

  const toggleMute = useCallback(() => {
    setMuted((current) => !current);
  }, []);

  const voiceState = useMemo<FlowAgentVoiceState>(() => {
    if (status === 'starting' || status === 'switching') return 'connecting';
    if (status === 'error') return 'error';
    if (status === 'completed' || status === 'ended' || status === 'idle') return 'connecting';
    if (conversation.isSpeaking) return 'speaking';
    if (awaitingAgent) return 'thinking';
    return 'listening';
  }, [awaitingAgent, conversation.isSpeaking, status]);

  return {
    status,
    voiceState,
    messages,
    flowSession,
    completedAnswers,
    answers,
    awaitingAgent,
    lastUserTranscript,
    lastUserTranscriptAt,
    sendUserMessage,
    endSession,
    retry,
    toggleMute,
    muted,
    errorMessage,
    getInputVolume: conversation.getInputVolume,
    getOutputVolume: conversation.getOutputVolume,
    getInputByteFrequencyData: conversation.getInputByteFrequencyData,
    getOutputByteFrequencyData: conversation.getOutputByteFrequencyData,
    editSavedAnswer,
  };
}
