import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { cn } from "@/lib/utils";
import { spScopeClass } from "@/app/lib/theme";
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import {
  AlertCircle,
  ArrowLeft,
  CheckCircle2,
  ListChecks,
  Loader2,
  Mic,
  MicOff,
  Plus,
  Radio,
  RotateCcw,
  UserRound,
  Volume2,
  X,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import {
  BibleFlowScriptureSetup,
  BibleScriptureReader,
} from '@/app/components/flows/BibleFlowScriptureSetup';
import { ChatBubble, isHtmlContent } from '@/app/components/flows/ChatBubble';
import { ChatInput } from '@/app/components/flows/ChatInput';
import { FlowModeToggle } from '@/app/components/flows/FlowModeToggle';
import { FlowTypeIcon } from '@/app/components/flows/FlowTypeIcon';
import { StreamingChatBubble } from '@/app/components/flows/StreamingChatBubble';
import { TypingIndicator } from '@/app/components/flows/TypingIndicator';
import { useFocusItems } from '@/app/hooks/useFocusItems';
import {
  FlowAgentMode,
  FlowAgentStatus,
  FlowAgentVoiceState,
  useFlowAgentSession,
} from '@/app/hooks/useFlowAgentSession';
import { FlowQuestion } from '@/app/types/flows';
import { useAuth } from '@/app/lib/auth';
import { supabase } from '@/app/lib/supabaseClient';
import { DeclaredFlowAction, getDeclaredFlowActionKey } from '@/app/lib/declaredFlowActions';
import { BibleScriptureContext, saveFlowAgentResponses } from '@/app/lib/flowAgentApi';
import { interpolateFlowPrompt } from '@/app/lib/flowPromptInterpolation';
import { toast } from 'sonner';

const TEXT_INPUT_QUESTION: FlowQuestion = {
  id: '__agent_text_input',
  type: 'textarea',
  prompt: 'Your response',
  required: true,
  placeholder: 'Type your response...',
};

const MOBILE_VISUAL_VIEWPORT_QUERY = '(max-width: 767px), (pointer: coarse)';

function useMobileVisualViewportHeight(enabled: boolean) {
  const [viewportHeight, setViewportHeight] = useState<number | null>(null);

  useEffect(() => {
    if (!enabled || typeof window === 'undefined') {
      setViewportHeight(null);
      return;
    }

    const visualViewport = window.visualViewport;
    const mediaQuery = typeof window.matchMedia === 'function'
      ? window.matchMedia(MOBILE_VISUAL_VIEWPORT_QUERY)
      : null;

    const updateViewportHeight = () => {
      const isMobileViewport = mediaQuery?.matches ?? window.innerWidth < 768;

      if (!isMobileViewport) {
        setViewportHeight(null);
        return;
      }

      const nextHeight = Math.round(visualViewport?.height ?? window.innerHeight);
      setViewportHeight(nextHeight > 0 ? nextHeight : null);
    };

    updateViewportHeight();

    visualViewport?.addEventListener('resize', updateViewportHeight);
    visualViewport?.addEventListener('scroll', updateViewportHeight);
    window.addEventListener('resize', updateViewportHeight);
    if (mediaQuery?.addEventListener) {
      mediaQuery.addEventListener('change', updateViewportHeight);
    } else {
      mediaQuery?.addListener?.(updateViewportHeight);
    }

    return () => {
      visualViewport?.removeEventListener('resize', updateViewportHeight);
      visualViewport?.removeEventListener('scroll', updateViewportHeight);
      window.removeEventListener('resize', updateViewportHeight);
      if (mediaQuery?.removeEventListener) {
        mediaQuery.removeEventListener('change', updateViewportHeight);
      } else {
        mediaQuery?.removeListener?.(updateViewportHeight);
      }
    };
  }, [enabled]);

  return viewportHeight;
}

function readStoredFlowMode(): FlowAgentMode {
  if (typeof window === 'undefined') return 'text';
  return window.localStorage.getItem('flow_mode_pref') === 'voice' ? 'voice' : 'text';
}

interface FlowSessionAgentBaseProps {
  exitPath: string;
  completePathPrefix?: string;
  avatarUrl?: string | null;
  avatarFallback?: string;
}

type PostFlowStage = 'idle' | 'review' | 'add_to_playbook' | 'ask_more' | 'capture_additional';

interface DraftDeclaredAction {
  index: number;
  originalText: string;
  refinedText: string;
  coachMessage: string;
  finalText: string | null;
}

function statusLabel(status: FlowAgentStatus) {
  if (status === 'starting') return 'Starting your Coach...';
  if (status === 'switching') return 'Switching modes...';
  if (status === 'completed') return 'Flow complete';
  if (status === 'ended') return 'Voice session ended';
  if (status === 'error') return 'Coach paused';
  return null;
}

function initialsForName(value?: string | null) {
  const name = value?.trim();
  if (!name) return '??';

  return name
    .split(/\s+/)
    .map((part) => part[0])
    .join('')
    .toUpperCase()
    .slice(0, 2) || '??';
}

function getAuthDisplayName(user?: { email?: string | null; user_metadata?: { full_name?: unknown } } | null) {
  const metadataName = user?.user_metadata?.full_name;
  return typeof metadataName === 'string' && metadataName.trim() ? metadataName : user?.email;
}

const VOICE_STATE_LABELS: Record<FlowAgentVoiceState, string> = {
  connecting: 'Connecting',
  listening: 'Listening',
  thinking: 'Thinking',
  speaking: 'Speaking',
  error: 'Paused',
};

function FlowAudioBars({
  active,
  levels,
  tone,
}: {
  active: boolean;
  levels: number[];
  tone: 'user' | 'coach';
}) {
  return (
    <div className="flex h-9 items-end justify-center gap-[4px]" aria-hidden="true">
      {levels.map((level, index) => {
        const idleLevel = FLOW_AUDIO_IDLE_LEVELS[index % FLOW_AUDIO_IDLE_LEVELS.length];
        const activity = active ? Math.max(idleLevel * 0.6, level) : idleLevel;
        return (
          <span
            key={`${tone}-${index}`}
            className={cn(
              'block w-[4px] rounded-full transition-[height,opacity] duration-100',
              tone === 'coach' ? 'bg-[#2997FF]' : 'bg-zinc-300',
            )}
            style={{
              height: `${Math.max(4, Math.min(36, activity * 36))}px`,
              opacity: active ? Math.max(0.38, Math.min(1, 0.35 + activity * 0.65)) : 0.18,
            }}
          />
        );
      })}
    </div>
  );
}

const FLOW_AUDIO_BAR_COUNT = 12;
const FLOW_AUDIO_IDLE_LEVELS = [0.28, 0.44, 0.7, 0.52, 0.34, 0.62, 0.38, 0.5, 0.31, 0.56, 0.42, 0.3];

function emptyFlowAudioLevels() {
  return Array(FLOW_AUDIO_BAR_COUNT).fill(0) as number[];
}

function clampAudioLevel(value: number) {
  if (!Number.isFinite(value)) return 0;
  return Math.max(0, Math.min(1, value));
}

function levelsFromFrequencyData(data: Uint8Array | undefined, fallbackVolume: number) {
  if (!data?.length) return null;

  const usableBins = data.length > FLOW_AUDIO_BAR_COUNT * 2 ? data.slice(2, Math.floor(data.length * 0.72)) : data;
  const chunkSize = Math.max(1, Math.floor(usableBins.length / FLOW_AUDIO_BAR_COUNT));
  const levels = Array.from({ length: FLOW_AUDIO_BAR_COUNT }, (_, index) => {
    const start = index * chunkSize;
    const end = Math.min(usableBins.length, start + chunkSize);
    let total = 0;

    for (let cursor = start; cursor < end; cursor += 1) {
      total += usableBins[cursor] ?? 0;
    }

    const average = end > start ? total / (end - start) : 0;
    return clampAudioLevel((average / 255) * 2.8);
  });

  return levels.some((level) => level > 0.02) ? levels : levelsFromVolume(fallbackVolume);
}

function levelsFromVolume(volume: number) {
  const amplifiedVolume = clampAudioLevel(volume * 4.5);
  if (amplifiedVolume <= 0.01) return emptyFlowAudioLevels();

  return FLOW_AUDIO_IDLE_LEVELS.map((level, index) => {
    const waveOffset = 0.72 + ((index % 4) * 0.13);
    return clampAudioLevel((amplifiedVolume * waveOffset) + level * 0.18);
  });
}

function smoothAudioLevels(previous: number[], next: number[]) {
  return next.map((level, index) => {
    const current = previous[index] ?? 0;
    const smoothing = level > current ? 0.62 : 0.32;
    return current + (level - current) * smoothing;
  });
}

function VoiceSeat({
  label,
  sublabel,
  active,
  muted,
  avatarUrl,
  avatarFallback,
  levels,
  role,
  flowSlug,
}: {
  label: string;
  sublabel: string;
  active: boolean;
  muted?: boolean;
  avatarUrl?: string | null;
  avatarFallback?: string;
  levels: number[];
  role: 'user' | 'coach';
  flowSlug?: string | null;
}) {
  const isCoach = role === 'coach';

  return (
    <div
      className={cn(
        'flex min-h-[320px] flex-col items-center justify-center rounded-lg border p-6 text-center transition-colors duration-200',
        active
          ? isCoach
            ? 'border-[#2997FF]/45 bg-[#2997FF]/[0.04]'
            : 'border-zinc-300/35 bg-zinc-300/[0.04]'
          : 'border-white/10 bg-white/[0.02]',
      )}
    >
      <div
        className={cn(
          'relative flex h-36 w-36 items-center justify-center overflow-hidden rounded-full border transition-all duration-200',
          active
            ? isCoach
              ? 'border-[#2997FF]/70 shadow-[0_0_0_8px_rgba(52,211,153,0.08),0_0_34px_rgba(52,211,153,0.28)]'
              : 'border-zinc-200/65 shadow-[0_0_0_8px_rgba(228,228,231,0.08),0_0_34px_rgba(161,161,170,0.18)]'
            : 'border-white/10',
        )}
      >
        {avatarUrl && !isCoach ? (
          <img src={avatarUrl} alt={label} className="h-full w-full object-cover" />
        ) : (
          <div
            className={cn(
              'flex h-full w-full items-center justify-center text-3xl font-semibold',
              isCoach
                ? 'bg-[radial-gradient(circle_at_50%_30%,rgba(52,211,153,0.16),rgba(23,23,23,0.94)_58%,rgba(10,10,10,1))] text-[#2997FF]'
                : 'bg-[radial-gradient(circle_at_50%_30%,rgba(212,212,216,0.18),rgba(23,23,23,0.94)_58%,rgba(10,10,10,1))] text-zinc-100',
            )}
          >
            {isCoach ? (
              <FlowTypeIcon flowSlug={flowSlug} active={active} size="xl" />
            ) : (
              avatarFallback || <UserRound className="h-14 w-14" />
            )}
          </div>
        )}

        {muted && (
          <div className="absolute bottom-3 right-3 rounded-full border border-foreground/20 bg-card/90 p-2 text-foreground/70">
            <MicOff className="h-4 w-4" />
          </div>
        )}
      </div>

      <div className="mt-6">
        <p className="text-lg font-semibold leading-tight text-foreground">{label}</p>
        <p className="mt-1 text-sm text-foreground/70">{sublabel}</p>
      </div>

      <div className="mt-9 w-full">
        <FlowAudioBars active={active} levels={levels} tone={role} />
      </div>
    </div>
  );
}

function FlowVoiceSessionRoom({
  flowSlug,
  flowName,
  status,
  voiceState,
  muted,
  lastUserTranscript,
  lastUserTranscriptAt,
  avatarUrl,
  avatarFallback,
  onToggleMute,
  onEndSession,
  getInputVolume,
  getOutputVolume,
  getInputByteFrequencyData,
  getOutputByteFrequencyData,
}: {
  flowSlug?: string | null;
  flowName: string;
  status: FlowAgentStatus;
  voiceState: FlowAgentVoiceState;
  muted: boolean;
  lastUserTranscript: string | null;
  lastUserTranscriptAt: number | null;
  avatarUrl?: string | null;
  avatarFallback?: string;
  onToggleMute: () => void;
  onEndSession: () => void;
  getInputVolume: () => number;
  getOutputVolume: () => number;
  getInputByteFrequencyData: () => Uint8Array | undefined;
  getOutputByteFrequencyData: () => Uint8Array | undefined;
}) {
  const [inputLevels, setInputLevels] = useState<number[]>(emptyFlowAudioLevels);
  const [outputLevels, setOutputLevels] = useState<number[]>(emptyFlowAudioLevels);
  const [lastInputActivityAt, setLastInputActivityAt] = useState<number | null>(null);
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      const nextInputVolume = clampAudioLevel(getInputVolume());
      const nextOutputVolume = clampAudioLevel(getOutputVolume());
      const nextInputLevels = muted
        ? emptyFlowAudioLevels()
        : levelsFromFrequencyData(getInputByteFrequencyData(), nextInputVolume) ?? levelsFromVolume(nextInputVolume);
      const nextOutputLevels = levelsFromFrequencyData(getOutputByteFrequencyData(), nextOutputVolume) ?? levelsFromVolume(nextOutputVolume);

      setNow(Date.now());
      setInputLevels((current) => smoothAudioLevels(current, nextInputLevels));
      setOutputLevels((current) => smoothAudioLevels(current, nextOutputLevels));

      if (nextInputVolume > 0.04) {
        setLastInputActivityAt(Date.now());
      }
    }, 80);

    return () => window.clearInterval(intervalId);
  }, [
    getInputByteFrequencyData,
    getInputVolume,
    getOutputByteFrequencyData,
    getOutputVolume,
    muted,
  ]);

  const connected = status === 'active' || status === 'switching';
  const inputRecently = Boolean(lastInputActivityAt && now - lastInputActivityAt < 1800);
  const heardRecently = Boolean(lastUserTranscriptAt && now - lastUserTranscriptAt < 6000);
  const userActive = voiceState === 'listening' && !muted;
  const coachActive = voiceState === 'speaking' || voiceState === 'thinking' || voiceState === 'connecting';
  const userSublabel = muted
    ? 'Mic muted'
    : heardRecently
      ? 'Heard you'
      : inputRecently
        ? 'Mic receiving audio'
      : connected
        ? 'Mic live'
        : 'Participant';
  const stateIcon = voiceState === 'speaking'
    ? <Volume2 className="h-4 w-4" />
    : voiceState === 'thinking'
      ? <Radio className="h-4 w-4" />
      : voiceState === 'connecting'
        ? <Loader2 className="h-4 w-4 animate-spin" />
        : muted
          ? <MicOff className="h-4 w-4" />
          : <Mic className="h-4 w-4" />;

  return (
    <section className="overflow-hidden rounded-lg border border-foreground/25 bg-card text-foreground shadow-sm">
      <div className="border-b border-foreground/15 bg-card px-5 py-5 sm:px-7">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-2 rounded-md bg-[#2997FF]/12 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-[#2997FF]">
                <span className="relative flex h-2 w-2">
                  {connected && <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#2997FF] opacity-70" />}
                  <span className={cn('relative inline-flex h-2 w-2 rounded-full', connected ? 'bg-[#2997FF]' : 'bg-zinc-500')} />
                </span>
                {connected ? 'Live' : 'Voice'}
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-md border border-white/15 px-2.5 py-1 text-[11px] text-foreground/70">
                {stateIcon}
                {VOICE_STATE_LABELS[voiceState]}
              </span>
              <span className="inline-flex rounded-md border border-white/15 px-2.5 py-1 text-[11px] text-foreground/70">
                Flow session
              </span>
            </div>
            <h2 className="mt-4 truncate text-2xl font-semibold tracking-tight text-foreground">{flowName}</h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-foreground/70">
              Settle in. Take your time, speak naturally, and let the Coach guide the next question.
            </p>
          </div>

          <Button
            variant="ghost"
            size="icon"
            onClick={onEndSession}
            aria-label="Close voice session"
            className="self-end text-foreground/70 hover:bg-foreground/10 hover:text-foreground lg:self-start"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="grid gap-5 p-5 sm:p-7 lg:grid-cols-2">
        <VoiceSeat
          label="You"
          sublabel={userSublabel}
          active={userActive}
          muted={muted}
          avatarUrl={avatarUrl}
          avatarFallback={avatarFallback}
          levels={inputLevels}
          role="user"
        />
        <VoiceSeat
          label="Coach"
          sublabel={voiceState === 'speaking' ? 'Speaking' : voiceState === 'thinking' ? 'Reflecting' : 'Guiding'}
          active={coachActive}
          levels={outputLevels}
          role="coach"
          flowSlug={flowSlug}
        />
      </div>

      {heardRecently && lastUserTranscript ? (
        <div className="border-t border-white/10 px-5 pb-5 text-center text-xs text-foreground/70">
          Heard: <span className="text-foreground/70">{lastUserTranscript}</span>
        </div>
      ) : inputRecently ? (
        <div className="border-t border-white/10 px-5 pb-5 text-center text-xs text-foreground/70">
          Mic input detected. Listening for your words.
        </div>
      ) : null}

      <div className="flex flex-wrap items-center justify-center gap-3 border-t border-white/10 px-5 py-5">
        <Button
          type="button"
          variant="outline"
          onClick={onToggleMute}
          className="min-w-32 border-foreground/25 bg-transparent text-foreground hover:bg-foreground/10 hover:text-foreground"
        >
          {muted ? <MicOff className="mr-2 h-4 w-4" /> : <Mic className="mr-2 h-4 w-4" />}
          {muted ? 'Muted' : 'Mute'}
        </Button>
        <Button
          type="button"
          onClick={onEndSession}
          className="min-w-40 bg-[#2997FF] text-white hover:bg-[#2997FF]"
        >
          <MicOff className="mr-2 h-4 w-4" />
          End session
        </Button>
      </div>
    </section>
  );
}

function stripAnswerPreview(value: string) {
  if (!isHtmlContent(value)) return value;

  try {
    return new DOMParser().parseFromString(value, 'text/html').body.textContent || value;
  } catch {
    return value;
  }
}

function FlowAnswerReviewDialog({
  open,
  onOpenChange,
  questions,
  answers,
  saving,
  onSave,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  questions: FlowQuestion[];
  answers: Record<string, string>;
  saving: boolean;
  onSave: (questionId: string, answer: string) => Promise<void>;
}) {
  const answeredQuestions = useMemo(
    () => questions.filter((question) => answers[question.id]?.trim()),
    [answers, questions],
  );
  const [editingQuestionId, setEditingQuestionId] = useState<string | null>(null);
  const [draftAnswer, setDraftAnswer] = useState('');
  const editingQuestion = answeredQuestions.find((question) => question.id === editingQuestionId) ?? null;
  const promptFor = (question: FlowQuestion) =>
    interpolateFlowPrompt(question.prompt, questions, answers);

  useEffect(() => {
    if (!open) {
      setEditingQuestionId(null);
      setDraftAnswer('');
      return;
    }

    if (!editingQuestionId && answeredQuestions[0]) {
      setEditingQuestionId(answeredQuestions[0].id);
      setDraftAnswer(answers[answeredQuestions[0].id] ?? '');
    }
  }, [answeredQuestions, answers, editingQuestionId, open]);

  const startEditing = (question: FlowQuestion) => {
    setEditingQuestionId(question.id);
    setDraftAnswer(answers[question.id] ?? '');
  };

  const handleSave = async () => {
    if (!editingQuestion || (editingQuestion.required && !draftAnswer.trim())) return;
    await onSave(editingQuestion.id, draftAnswer);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={cn(spScopeClass(), "flex max-h-[88vh] w-[min(calc(100vw-1.5rem),42rem)] flex-col gap-0 overflow-hidden p-0 sm:rounded-lg")}>
        <DialogHeader className="border-b border-border/60 px-5 py-4">
          <DialogTitle className="flex items-center gap-2 text-base">
            <ListChecks className="h-4 w-4" />
            Review Answers
          </DialogTitle>
          <DialogDescription className="sr-only">
            Edit saved Flow answers and continue from the recalculated Flow state.
          </DialogDescription>
        </DialogHeader>

        <div className="min-h-0 flex-1 overflow-y-auto px-5 py-4">
          {answeredQuestions.length === 0 ? (
            <p className="py-8 text-center text-sm text-muted-foreground">No answers saved yet.</p>
          ) : (
            <div className="space-y-4">
              <div className="space-y-2">
                {answeredQuestions.map((question, index) => (
                  <button
                    key={question.id}
                    type="button"
                    onClick={() => startEditing(question)}
                    className={cn(
                      'block w-full rounded-md border px-3 py-2 text-left text-sm transition-colors',
                      editingQuestionId === question.id
                        ? 'border-primary bg-primary/5'
                        : 'border-border/70 hover:bg-muted/60',
                    )}
                  >
                    <span className="block text-xs font-medium uppercase text-muted-foreground">
                      Question {index + 1}
                    </span>
                    <span className="mt-1 block font-medium text-foreground">{promptFor(question)}</span>
                    <span className="mt-1 line-clamp-2 block text-muted-foreground">
                      {stripAnswerPreview(answers[question.id] ?? '')}
                    </span>
                  </button>
                ))}
              </div>

              {editingQuestion && (
                <div className="space-y-3 border-t border-border/60 pt-4">
                  <p className="text-sm font-medium">{promptFor(editingQuestion)}</p>
                  {editingQuestion.type === 'select' && editingQuestion.options?.length ? (
                    <div className="flex flex-wrap gap-2">
                      {editingQuestion.options.map((option) => (
                        <Button
                          key={option}
                          type="button"
                          variant={draftAnswer === option ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => setDraftAnswer(option)}
                          disabled={saving}
                          className="rounded-full"
                        >
                          {option}
                        </Button>
                      ))}
                    </div>
                  ) : (
                    <Textarea
                      value={stripAnswerPreview(draftAnswer)}
                      onChange={(event) => setDraftAnswer(event.target.value)}
                      disabled={saving}
                      className="min-h-32 resize-none"
                    />
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        <DialogFooter className="border-t border-border/60 px-5 py-4">
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={saving}>
            Cancel
          </Button>
          <Button
            type="button"
            onClick={() => void handleSave()}
            disabled={!editingQuestion || (editingQuestion.required && !draftAnswer.trim()) || saving}
          >
            {saving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              'Save Answer'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export function FlowSessionAgentBase({
  exitPath,
  completePathPrefix = '/app/flows/complete',
  avatarUrl,
  avatarFallback = '??',
}: FlowSessionAgentBaseProps) {
  const { slug } = useParams<{ slug: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const stateSessionId = typeof (location.state as { sessionId?: unknown } | null)?.sessionId === 'string'
    ? (location.state as { sessionId: string }).sessionId
    : null;
  const querySessionId = new URLSearchParams(location.search).get('resume');
  const resumeSessionId = stateSessionId ?? querySessionId;
  const [mode, setMode] = useState<FlowAgentMode>(() => readStoredFlowMode());
  const [modeChosen, setModeChosen] = useState(false);
  const [selectedBibleScripture, setSelectedBibleScripture] = useState<BibleScriptureContext | null>(null);
  const [inputValue, setInputValue] = useState('');
  const [postFlowInput, setPostFlowInput] = useState('');
  const [answerReviewOpen, setAnswerReviewOpen] = useState(false);
  const [savingEditedAnswer, setSavingEditedAnswer] = useState(false);
  const [declaredActions, setDeclaredActions] = useState<DeclaredFlowAction[]>([]);
  const [draftAction, setDraftAction] = useState<DraftDeclaredAction | null>(null);
  const [postFlowStage, setPostFlowStage] = useState<PostFlowStage>('idle');
  const [refiningAction, setRefiningAction] = useState(false);
  const [addingToPlaybook, setAddingToPlaybook] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const initialPostFlowActionRef = useRef<string | null>(null);
  const addingToPlaybookRef = useRef(false);
  const { createItem: createOwnerItem } = useFocusItems();

  const {
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
    editSavedAnswer,
    endSession,
    retry,
    toggleMute,
    muted,
    errorMessage,
    getInputVolume,
    getOutputVolume,
    getInputByteFrequencyData,
    getOutputByteFrequencyData,
  } = useFlowAgentSession({
    flowSlug: slug,
    mode,
    enabled: modeChosen,
    resumeSessionId,
    bibleScripture: selectedBibleScripture,
  });

  const isBusy = status === 'starting' || status === 'switching';
  const isCompleted = status === 'completed';
  const useVoiceRoom = mode === 'voice' && !isCompleted;
  const mobileViewportHeight = useMobileVisualViewportHeight(modeChosen && !useVoiceRoom);
  const isBibleFlow = slug === 'bible';
  const isDailyFrameFlow = slug === 'daily-frame';
  const activeBibleScripture = selectedBibleScripture ?? flowSession?.bible_context ?? null;

  useEffect(() => {
    const sessionId = flowSession?.session_id;
    if (!sessionId || querySessionId === sessionId) return;
    const search = new URLSearchParams(location.search);
    search.set('resume', sessionId);
    navigate({ pathname: location.pathname, search: `?${search.toString()}` }, {
      replace: true,
      state: { ...(location.state as Record<string, unknown> | null), sessionId },
    });
  }, [flowSession?.session_id, location.pathname, location.search, location.state, navigate, querySessionId]);
  const completedActionText = isDailyFrameFlow ? null : completedAnswers?.actions?.trim() || null;
  const savedAnswers = useMemo(() => answers ?? completedAnswers ?? {}, [answers, completedAnswers]);
  const flowQuestions = useMemo(() => {
    if (flowSession?.questions?.length) return flowSession.questions;
    return flowSession?.first_question ? [flowSession.first_question] : [];
  }, [flowSession?.first_question, flowSession?.questions]);
  const answeredFlowQuestions = useMemo(
    () => flowQuestions.filter((question) => savedAnswers[question.id]?.trim()),
    [flowQuestions, savedAnswers],
  );
  const flowIcon = (
    <FlowTypeIcon
      flowSlug={slug}
      size="sm"
      animateOnHover
      className="text-foreground"
    />
  );

  const scrollTranscriptToBottom = useCallback((behavior: ScrollBehavior = 'smooth') => {
    if (mode === 'voice' && !isCompleted) return;

    window.requestAnimationFrame(() => {
      bottomRef.current?.scrollIntoView({ behavior, block: 'end' });
    });
  }, [isCompleted, mode]);

  useEffect(() => {
    document.title = flowSession?.flow_name
      ? `${flowSession.flow_name} | Standard Playbook`
      : 'Flow Session | Standard Playbook';
    return () => {
      document.title = 'Standard Playbook';
    };
  }, [flowSession?.flow_name]);

  useEffect(() => {
    scrollTranscriptToBottom('auto');
  }, [
    declaredActions.length,
    draftAction?.finalText,
    isCompleted,
    messages.length,
    postFlowStage,
    refiningAction,
    scrollTranscriptToBottom,
    status,
    mobileViewportHeight,
  ]);

  const handleSubmitText = async (valueOverride?: string) => {
    const nextValue = (valueOverride ?? inputValue).trim();
    if (!nextValue || status !== 'active') return;
    setInputValue('');
    await sendUserMessage(nextValue);
  };

  const handleSaveEditedAnswer = async (questionId: string, answer: string) => {
    if (!editSavedAnswer) return;

    setSavingEditedAnswer(true);
    try {
      await editSavedAnswer(questionId, answer);
      if (questionId === 'actions') {
        initialPostFlowActionRef.current = null;
        setDeclaredActions([]);
        setDraftAction(null);
        setPostFlowInput('');
        setPostFlowStage('idle');
      }
      toast.success('Answer updated.');
    } catch (error) {
      console.error('Failed to edit flow answer:', error);
      toast.error('Could not update that answer. Please try again.');
      throw error;
    } finally {
      setSavingEditedAnswer(false);
    }
  };

  const handleExit = async () => {
    if (status === 'active' || status === 'starting' || status === 'switching') {
      await endSession();
    }
    navigate(exitPath);
  };

  const handleViewResults = useCallback(() => {
    if (!flowSession) {
      navigate(exitPath);
      return;
    }

    navigate(`${completePathPrefix}/${flowSession.session_id}`);
  }, [completePathPrefix, exitPath, flowSession, navigate]);

  const refineActionItem = useCallback(async (actionText: string) => {
    const { data, error } = await supabase.functions.invoke('refine_flow_action_item', {
      body: {
        action_text: actionText,
        flow_name: flowSession?.flow_name,
        flow_title: completedAnswers?.title ?? null,
        domain: completedAnswers?.domain ?? null,
        previous_actions: declaredActions.map(action => action.finalText),
      },
    });

    if (error) throw error;

    return {
      coachMessage:
        data?.coach_message ||
        'That has strong intent. I sharpened it so it is easier to measure and easier to win.',
      refinedText: data?.refined_action || actionText,
    };
  }, [
    completedAnswers?.domain,
    completedAnswers?.title,
    declaredActions,
    flowSession?.flow_name,
  ]);

  const startPostFlowReview = useCallback(async (actionText: string) => {
    const trimmedAction = actionText.trim();
    if (!trimmedAction) {
      handleViewResults();
      return;
    }

    setRefiningAction(true);

    try {
      const { coachMessage, refinedText } = await refineActionItem(trimmedAction);
      setDraftAction({
        index: declaredActions.length + 1,
        originalText: trimmedAction,
        refinedText,
        coachMessage,
        finalText: null,
      });
      setPostFlowStage('review');
    } catch (error) {
      console.error('Failed to refine flow action item:', error);
      setDraftAction({
        index: declaredActions.length + 1,
        originalText: trimmedAction,
        refinedText: trimmedAction,
        coachMessage: 'That has real intent behind it. You can keep it as-is or use the sharpened version below.',
        finalText: null,
      });
      setPostFlowStage('review');
      toast.error('Unable to refine the action item. You can still keep going.');
    } finally {
      setRefiningAction(false);
    }
  }, [declaredActions.length, handleViewResults, refineActionItem]);

  useEffect(() => {
    if (!isCompleted || !completedActionText || postFlowStage !== 'idle') return;
    if (initialPostFlowActionRef.current === completedActionText) return;

    initialPostFlowActionRef.current = completedActionText;
    void startPostFlowReview(completedActionText);
  }, [completedActionText, isCompleted, postFlowStage, startPostFlowReview]);

  const persistDeclaredAction = useCallback(async (action: DeclaredFlowAction) => {
    if (!flowSession) throw new Error('Flow session is not available.');

    await saveFlowAgentResponses(flowSession, {
      [getDeclaredFlowActionKey(action.index, 'original')]: action.originalText,
      [getDeclaredFlowActionKey(action.index, 'refined')]: action.refinedText,
      [getDeclaredFlowActionKey(action.index, 'final')]: action.finalText,
      [getDeclaredFlowActionKey(action.index, 'added_to_weekly_playbook')]:
        action.addedToWeeklyPlaybook === null ? '' : String(action.addedToWeeklyPlaybook),
    });
  }, [flowSession]);

  const addDraftActionToPlaybook = async (actionText: string) => {
    if (!flowSession) throw new Error('Flow session is not available.');

    await createOwnerItem.mutateAsync({
      title: actionText,
      description: `Action from ${flowSession.flow_name} flow session`,
      priority_level: 'mid',
      source_type: 'flow',
      source_name: flowSession.flow_name,
      source_session_id: flowSession.session_id,
      zone: 'bench',
    });
  };

  const finalizeDraftAction = async (addedToWeeklyPlaybook: boolean, finalTextOverride?: string) => {
    const finalText = finalTextOverride ?? draftAction?.finalText;
    if (!draftAction || !finalText || addingToPlaybookRef.current) return;

    if (addedToWeeklyPlaybook) {
      addingToPlaybookRef.current = true;
      setAddingToPlaybook(true);
      try {
        await addDraftActionToPlaybook(finalText);
        toast.success('Action added to your Weekly Playbook.');
      } catch (error) {
        console.error('Failed to add action to weekly playbook:', error);
        toast.error('Failed to add this action to your Weekly Playbook.');
        addingToPlaybookRef.current = false;
        setAddingToPlaybook(false);
        return;
      }
    }

    const finalizedAction: DeclaredFlowAction = {
      index: draftAction.index,
      originalText: draftAction.originalText,
      refinedText: draftAction.refinedText,
      finalText,
      addedToWeeklyPlaybook,
    };

    try {
      await persistDeclaredAction(finalizedAction);
      setDeclaredActions(prev => [...prev, finalizedAction]);
      setDraftAction(null);
      setPostFlowInput('');
      setPostFlowStage('ask_more');
    } catch (error) {
      console.error('Failed to persist declared flow action:', error);
      toast.error('Your action may not have saved. Please try again.');
    } finally {
      if (addedToWeeklyPlaybook) {
        addingToPlaybookRef.current = false;
        setAddingToPlaybook(false);
      }
    }
  };

  const handleUseSuggestedAction = () => {
    if (!draftAction) return;
    const finalText = draftAction.refinedText;
    setDraftAction({ ...draftAction, finalText });
    setPostFlowStage('add_to_playbook');
    void finalizeDraftAction(true, finalText);
  };

  const handleKeepOriginalAction = () => {
    if (!draftAction) return;
    const finalText = draftAction.originalText;
    setDraftAction({ ...draftAction, finalText });
    setPostFlowStage('add_to_playbook');
    void finalizeDraftAction(true, finalText);
  };

  const handleSubmitAdditionalAction = async (valueOverride?: string) => {
    const actionText = (valueOverride ?? postFlowInput).trim();
    if (!actionText || refiningAction) return;

    setPostFlowInput('');
    await startPostFlowReview(actionText);
  };

  if (isBibleFlow && !resumeSessionId && !selectedBibleScripture && !modeChosen) {
    return (
      <BibleFlowScriptureSetup
        onSelect={setSelectedBibleScripture}
        onBack={() => navigate(exitPath)}
      />
    );
  }

  if (!modeChosen) {
    return (
      <div className="min-h-screen bg-background">
        <div className="mx-auto flex min-h-screen max-w-xl items-center px-4 py-10">
          <Card className="w-full">
            <CardContent className="space-y-6 p-6">
              <div className="space-y-2">
                <Button variant="ghost" size="sm" onClick={() => navigate(exitPath)} className="-ml-2 gap-2">
                  <ArrowLeft className="h-4 w-4" />
                  Back
                </Button>
                <div>
                  <p className="text-xs font-semibold uppercase text-muted-foreground">Choose your Flow mode</p>
                  <h1 className="mt-1 text-2xl font-semibold">How do you want to experience your Flow today?</h1>
                </div>
              </div>

              <FlowModeToggle value={mode} onChange={setMode} />

              <p className="text-sm leading-6 text-muted-foreground">
                Your choice applies to this Flow. You can switch modes after the conversation starts, and
                this choice will be pre-selected next time.
              </p>

              <Button className="w-full gap-2" size="lg" onClick={() => setModeChosen(true)}>
                Start in {mode === 'voice' ? 'VOICE' : 'TEXT'} Mode
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div
      className="flex h-[100dvh] min-h-0 w-full max-w-[100vw] flex-col overflow-hidden bg-background"
      style={mobileViewportHeight ? { height: `${mobileViewportHeight}px` } : undefined}
    >
      <FlowAnswerReviewDialog
        open={answerReviewOpen}
        onOpenChange={setAnswerReviewOpen}
        questions={flowQuestions}
        answers={savedAnswers}
        saving={savingEditedAnswer}
        onSave={handleSaveEditedAnswer}
      />
      <header className="shrink-0 border-b border-border/10 bg-background/95 backdrop-blur">
        <div
          className={cn(
            'mx-auto py-3 pl-[max(1rem,env(safe-area-inset-left))] pr-[max(1rem,env(safe-area-inset-right))] pt-[calc(0.75rem+env(safe-area-inset-top))]',
            useVoiceRoom ? 'max-w-5xl' : 'max-w-2xl',
          )}
        >
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between sm:gap-3">
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-xl">{flowIcon}</span>
                <h1 className="truncate text-sm font-medium text-muted-foreground">
                  {flowSession?.flow_name || 'Flow'}
                </h1>
              </div>
              {statusLabel(status) && (
                <p className="mt-1 text-xs text-muted-foreground">{statusLabel(status)}</p>
              )}
            </div>
            <div className="flex min-w-0 items-center justify-between gap-2 sm:justify-end">
              {answeredFlowQuestions.length > 0 && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setAnswerReviewOpen(true)}
                  disabled={isBusy || savingEditedAnswer}
                  className="h-9 shrink-0 gap-2 px-3"
                >
                  <ListChecks className="h-4 w-4" />
                  <span className="hidden sm:inline">Answers</span>
                </Button>
              )}
              <FlowModeToggle
                value={mode}
                onChange={setMode}
                compact
                disabled={isBusy}
                className="w-full flex-1 sm:w-auto sm:flex-none"
              />
              <Button variant="ghost" size="icon" onClick={handleExit} className="h-9 w-9">
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="min-h-0 flex-1 overflow-y-auto overscroll-contain scroll-pb-32">
        <div className={cn(
          'mx-auto py-6 pl-[max(1rem,env(safe-area-inset-left))] pr-[max(1rem,env(safe-area-inset-right))]',
          useVoiceRoom || activeBibleScripture ? 'max-w-6xl' : 'max-w-2xl',
        )}>
          {errorMessage && (
            <div className="mb-4 flex items-start gap-3 rounded-lg border border-destructive/30 bg-destructive/10 p-4 text-sm">
              <AlertCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-destructive" />
              <div className="flex-1">
                <p className="font-medium text-destructive">{errorMessage}</p>
                <Button variant="outline" size="sm" onClick={() => void retry()} className="mt-3 gap-2">
                  <RotateCcw className="h-4 w-4" />
                  Retry
                </Button>
              </div>
            </div>
          )}

          <div className={cn(
            activeBibleScripture && 'grid gap-4 lg:grid-cols-[minmax(280px,0.9fr)_minmax(0,1.55fr)]',
          )}>
            {activeBibleScripture && (
              <BibleScriptureReader
                scripture={activeBibleScripture}
                className="lg:sticky lg:top-4 lg:self-start"
              />
            )}

          <div className={cn('space-y-4', mode === 'voice' && 'pb-4')}>
            {useVoiceRoom ? (
              <FlowVoiceSessionRoom
                flowSlug={flowSession?.flow_slug || slug}
                flowName={flowSession?.flow_name || 'Flow'}
                status={status}
                voiceState={voiceState}
                muted={muted}
                lastUserTranscript={lastUserTranscript}
                lastUserTranscriptAt={lastUserTranscriptAt}
                avatarUrl={avatarUrl}
                avatarFallback={avatarFallback}
                onToggleMute={toggleMute}
                onEndSession={() => void endSession()}
                getInputVolume={getInputVolume}
                getOutputVolume={getOutputVolume}
                getInputByteFrequencyData={getInputByteFrequencyData}
                getOutputByteFrequencyData={getOutputByteFrequencyData}
              />
            ) : (
              messages.map((message) => (
                <StreamingChatBubble
                  key={message.id}
                  text={message.content}
                  variant={message.role === 'assistant' ? 'incoming' : 'outgoing'}
                  streaming={message.streaming}
                  icon={message.role === 'assistant' ? (flowIcon as unknown as string) : undefined}
                  avatarUrl={message.role === 'user' ? avatarUrl : undefined}
                  avatarFallback={message.role === 'user' ? avatarFallback : undefined}
                  onContentChange={message.streaming ? () => scrollTranscriptToBottom('auto') : undefined}
                />
              ))
            )}

            {!useVoiceRoom && isBusy && messages.length === 0 && (
              <div className="flex items-center justify-center py-16 text-sm text-muted-foreground">
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Connecting your Coach...
              </div>
            )}

            {!useVoiceRoom && awaitingAgent && !isCompleted && (
              <div className="flex items-end gap-2">
                <span className="mb-1 flex-shrink-0 text-lg">{flowIcon}</span>
                <TypingIndicator />
              </div>
            )}

            {status === 'ended' && flowSession && (
              <div className="flex flex-col items-center gap-3 pt-4 text-center">
                <p className="text-sm text-muted-foreground">
                  Your Flow draft is saved. Continue the conversation or come back to it from Flows.
                </p>
                <Button onClick={() => void retry()} className="gap-2">
                  <RotateCcw className="h-4 w-4" />
                  Continue Flow
                </Button>
              </div>
            )}

            {isCompleted && flowSession && (
              <div className="space-y-4">
                <div className="rounded-lg border border-border/60 bg-card p-4">
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 flex-shrink-0 text-[#2997FF]" />
                    <div>
                      <p className="font-medium">Flow saved.</p>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {isDailyFrameFlow
                          ? 'Your Daily Frame commitment is being added to your dashboard.'
                          : 'Review your declared action items before you close this out.'}
                      </p>
                    </div>
                  </div>
                </div>

                {!completedActionText && postFlowStage === 'idle' && (
                  <div className="flex justify-end">
                    <Button size="sm" onClick={handleViewResults}>
                      View Results
                    </Button>
                  </div>
                )}

                {declaredActions.length > 0 && (
                  <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
                    <ChatBubble variant="incoming" icon={flowIcon}>
                      Here are the action items you have declared so far.
                    </ChatBubble>
                    <div className="space-y-2 pl-8">
                      {declaredActions.map((action) => (
                        <div key={action.index} className="rounded-2xl border border-border/60 bg-card px-4 py-3">
                          <p className="text-sm text-foreground">{action.finalText}</p>
                          <p className="mt-1 text-xs text-muted-foreground">
                            {action.addedToWeeklyPlaybook
                              ? 'Added to Weekly Playbook'
                              : 'Not added to Weekly Playbook'}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {refiningAction && (
                  <div className="flex items-center gap-2 pl-8 text-sm text-muted-foreground">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Sharpening that action...
                  </div>
                )}

                {draftAction && postFlowStage === 'review' && (
                  <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
                    <ChatBubble variant="incoming" icon={flowIcon} animate>
                      {draftAction.coachMessage}
                      <br />
                      <br />
                      <strong>Sharper version:</strong> {draftAction.refinedText}
                    </ChatBubble>

                    <div className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleKeepOriginalAction}
                        className="rounded-full"
                      >
                        Keep Mine
                      </Button>
                      <Button size="sm" onClick={handleUseSuggestedAction} className="rounded-full">
                        Use Suggestion
                      </Button>
                    </div>
                  </div>
                )}

                {draftAction && postFlowStage === 'add_to_playbook' && (
                  <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
                    <ChatBubble variant="incoming" icon={flowIcon} animate>
                      Strong move. This is going to your <strong>Weekly Playbook</strong>.
                    </ChatBubble>

                    <div className="ml-8 rounded-2xl border border-border/60 bg-card px-4 py-3">
                      <p className="text-sm text-foreground">{draftAction.finalText}</p>
                    </div>

                    <div className="flex justify-end">
                      <Button
                        size="sm"
                        onClick={() => void finalizeDraftAction(true)}
                        disabled={addingToPlaybook}
                        className="rounded-full"
                      >
                        {addingToPlaybook ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Adding...
                          </>
                        ) : (
                          <>
                            <Plus className="mr-2 h-4 w-4" />
                            Add to Playbook
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                )}

                {postFlowStage === 'ask_more' && (
                  <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
                    <ChatBubble variant="incoming" icon={flowIcon} animate>
                      Anything else you&apos;re being called to declare before we close this out?
                    </ChatBubble>

                    <div className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleViewResults}
                        className="rounded-full"
                      >
                        No, I&apos;m done
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => setPostFlowStage('capture_additional')}
                        className="rounded-full"
                      >
                        Yes, add another
                      </Button>
                    </div>
                  </div>
                )}

                {postFlowStage === 'capture_additional' && !refiningAction && (
                  <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
                    <ChatBubble variant="incoming" icon={flowIcon} animate>
                      What&apos;s the next action you&apos;re declaring?
                    </ChatBubble>
                  </div>
                )}
              </div>
            )}

            <div ref={bottomRef} className="h-px scroll-mb-32" />
          </div>
          </div>
        </div>
      </main>

      {!useVoiceRoom && (
        <footer className="shrink-0 border-t border-border/10 bg-background/95 backdrop-blur">
          <div className="mx-auto w-full max-w-2xl pb-[calc(0.75rem+env(safe-area-inset-bottom))] pl-[max(0.75rem,env(safe-area-inset-left))] pr-[max(0.75rem,env(safe-area-inset-right))] pt-3">
            {isCompleted ? (
              postFlowStage === 'capture_additional' && !refiningAction ? (
                <ChatInput
                  question={{
                    id: '__post_flow_action_item',
                    type: 'textarea',
                    prompt: "What's the next action you're declaring?",
                    required: true,
                    placeholder: "What you'll actually do. Specific.",
                  }}
                  value={postFlowInput}
                  onChange={setPostFlowInput}
                  onSubmit={handleSubmitAdditionalAction}
                  disabled={refiningAction || addingToPlaybook}
                  isLast
                />
              ) : (
                <div className="text-center text-sm text-muted-foreground">
                  Choose an option above to continue.
                </div>
              )
            ) : (
              <ChatInput
                question={TEXT_INPUT_QUESTION}
                value={inputValue}
                onChange={setInputValue}
                onSubmit={handleSubmitText}
                disabled={status !== 'active' || awaitingAgent}
                isLast={false}
              />
            )}
          </div>
        </footer>
      )}
    </div>
  );
}

export default function FlowSessionAgent() {
  const { user, member } = useAuth();
  const displayName = member?.full_name?.trim() ? member.full_name : getAuthDisplayName(user);
  const userInitials = user?.id ? initialsForName(displayName) : '??';

  return (
    <FlowSessionAgentBase
      exitPath="/app/flows"
      avatarUrl={null}
      avatarFallback={userInitials}
    />
  );
}
