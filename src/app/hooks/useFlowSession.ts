import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { supabase } from '@/app/lib/supabaseClient';
import { useAuth } from '@/app/lib/auth';
import { FlowTemplate, FlowSession, FlowQuestion, normalizeFlowCoachIntensity } from '@/app/types/flows';
import { toast } from 'sonner';

export interface PromptSegment {
  type: 'text' | 'interpolated';
  content: string;
}

interface UseFlowSessionProps {
  templateSlug?: string;
  sessionId?: string;
}

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  if (error && typeof error === 'object' && 'message' in error) {
    const message = (error as { message?: unknown }).message;
    if (typeof message === 'string') return message;
  }
  return 'An unexpected error occurred.';
}

export function useFlowSession({ templateSlug, sessionId }: UseFlowSessionProps) {
  const { user } = useAuth();
  
  const [template, setTemplate] = useState<FlowTemplate | null>(null);
  const [session, setSession] = useState<FlowSession | null>(null);
  const [responses, setResponses] = useState<Record<string, string>>({});
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // Track if session was loaded from DB (vs newly created in this session)
  const [sessionLoadedFromDb, setSessionLoadedFromDb] = useState(false);

  useEffect(() => {
    if (sessionId) {
      loadExistingSession(sessionId);
    } else if (templateSlug) {
      loadTemplate(templateSlug);
    }
  }, [sessionId, templateSlug]);

  const loadTemplate = async (slug: string) => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('flow_templates')
        .select('*')
        .eq('slug', slug)
        .eq('is_active', true)
        .single();

      if (error) throw error;
      
      const templateData = {
        ...data,
        coach_intensity: normalizeFlowCoachIntensity(data.coach_intensity),
        questions_json: typeof data.questions_json === 'string' 
          ? JSON.parse(data.questions_json) 
          : data.questions_json
      } as FlowTemplate;
      
      setTemplate(templateData);
    } catch (err: unknown) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const loadExistingSession = async (id: string) => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('flow_sessions')
        .select('*, flow_template:flow_templates(*)')
        .eq('id', id)
        .single();

      if (error) throw error;

      const templateData = {
        ...data.flow_template,
        coach_intensity: normalizeFlowCoachIntensity(data.flow_template.coach_intensity),
        questions_json: typeof data.flow_template.questions_json === 'string'
          ? JSON.parse(data.flow_template.questions_json)
          : data.flow_template.questions_json
      } as FlowTemplate;

      setSession(data as unknown as FlowSession);
      setTemplate(templateData);
      setResponses((data.responses_json as Record<string, string>) || {});
      setSessionLoadedFromDb(true); // Mark as loaded from DB
      
      // We'll set index after computing visible questions
    } catch (err: unknown) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  // Get all questions from template
  const allQuestions = useMemo(() => {
    return (template?.questions_json || []) as FlowQuestion[];
  }, [template]);

  // Compute visible questions based on show_if conditions and current responses
  const visibleQuestions = useMemo(() => {
    return allQuestions.filter(q => {
      // If no show_if condition, always show
      if (!q.show_if) return true;
      
      // Check if the gate question's answer matches the required value
      const gateAnswer = responses[q.show_if.question_id];
      return gateAnswer === q.show_if.equals;
    });
  }, [allQuestions, responses]);

  // Set initial question index ONLY when resuming an existing session from DB
  // This prevents double-advancing when a new session is created after the first answer
  useEffect(() => {
    if (!loading && template && session && sessionLoadedFromDb) {
      const firstUnanswered = visibleQuestions.findIndex(
        q => !responses[q.id]
      );
      const newIndex = firstUnanswered === -1 ? visibleQuestions.length - 1 : firstUnanswered;
      console.log('[useFlowSession] Resuming session from DB, setting index to:', newIndex);
      setCurrentQuestionIndex(newIndex);
      setSessionLoadedFromDb(false);
    }
  }, [loading, responses, session, sessionLoadedFromDb, template, visibleQuestions]);

  const createSession = async () => {
    if (!user?.id || !template) return null;

    try {
      // Check for existing in_progress session first (deduplication)
      const { data: existing } = await supabase
        .from('flow_sessions')
        .select('*')
        .eq('user_id', user.id)
        .eq('flow_template_id', template.id)
        .eq('status', 'in_progress')
        .order('updated_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (existing) {
        console.log('[useFlowSession] Found existing session, reusing:', existing.id);
        setSession(existing as unknown as FlowSession);
        setResponses((existing.responses_json as Record<string, string>) || {});
        return existing as unknown as FlowSession;
      }

      // No existing session, create new one
      const { data, error } = await supabase
        .from('flow_sessions')
        .insert({
          user_id: user.id,
          flow_template_id: template.id,
          status: 'in_progress',
          responses_json: {},
        })
        .select()
        .single();

      if (error) {
        if (error.code === '23505') {
          const { data: racingSession, error: fetchError } = await supabase
            .from('flow_sessions')
            .select('*')
            .eq('user_id', user.id)
            .eq('flow_template_id', template.id)
            .eq('status', 'in_progress')
            .order('updated_at', { ascending: false })
            .limit(1)
            .maybeSingle();

          if (fetchError) throw fetchError;

          if (racingSession) {
            console.log('[useFlowSession] Reused session created by concurrent request:', racingSession.id);
            setSession(racingSession as unknown as FlowSession);
            setResponses((racingSession.responses_json as Record<string, string>) || {});
            return racingSession as unknown as FlowSession;
          }
        }

        throw error;
      }
      
      console.log('[useFlowSession] Created new session:', data.id);
      setSession(data as unknown as FlowSession);
      return data as unknown as FlowSession;
    } catch (err: unknown) {
      setError(getErrorMessage(err));
      return null;
    }
  };

  // Track consecutive save failures to avoid spamming toasts
  const saveFailCountRef = useRef(0);

  const saveResponse = async (questionId: string, value: string): Promise<FlowSession | null> => {
    const newResponses = { ...responses, [questionId]: value };
    setResponses(newResponses);

    let currentSession = session;
    if (!currentSession) {
      currentSession = await createSession();
      if (!currentSession) return null;
    }

    setSaving(true);
    try {
      const updateData: Pick<FlowSession, 'responses_json' | 'updated_at'> &
        Partial<Pick<FlowSession, 'title' | 'domain'>> = {
        responses_json: newResponses,
        updated_at: new Date().toISOString(),
      };

      const titleQuestion = allQuestions.find(q => q.interpolation_key === 'stack_title' || q.id === 'title');
      const domainQuestion = allQuestions.find(q => q.id === 'domain');

      if (titleQuestion && questionId === titleQuestion.id) {
        updateData.title = value;
      }
      if (domainQuestion && questionId === domainQuestion.id) {
        updateData.domain = value;
      }

      const { error } = await supabase
        .from('flow_sessions')
        .update(updateData)
        .eq('id', currentSession.id);

      if (error) throw error;

      saveFailCountRef.current = 0;
      const savedSession = { ...currentSession, ...updateData } as FlowSession;
      setSession(savedSession);
      return savedSession;
    } catch (err: unknown) {
      console.error('Error saving response:', err);
      saveFailCountRef.current += 1;
      // Notify user on first failure and every 3rd failure after that
      if (saveFailCountRef.current === 1 || saveFailCountRef.current % 3 === 0) {
        toast.error('Your response may not have saved. Check your connection and try again.');
      }
      return null;
    } finally {
      setSaving(false);
    }
  };

  const goToNextQuestion = useCallback(() => {
    if (currentQuestionIndex < visibleQuestions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  }, [currentQuestionIndex, visibleQuestions.length]);

  const goToPreviousQuestion = useCallback(() => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  }, [currentQuestionIndex]);

  const goToQuestion = useCallback((index: number) => {
    if (index >= 0 && index < visibleQuestions.length) {
      setCurrentQuestionIndex(index);
    }
  }, [visibleQuestions.length]);

  const interpolatePrompt = useCallback((prompt: string): PromptSegment[] => {
    const segments: PromptSegment[] = [];
    
    const regex = /\{([^}]+)\}/g;
    let lastIndex = 0;
    let match;

    while ((match = regex.exec(prompt)) !== null) {
      if (match.index > lastIndex) {
        const textBefore = prompt.slice(lastIndex, match.index);
        if (textBefore) {
          segments.push({ type: 'text', content: textBefore });
        }
      }

      const key = match[1];
      const sourceQuestion = allQuestions.find(
        q => q.interpolation_key === key || q.id === key
      );

      if (sourceQuestion && responses[sourceQuestion.id]) {
        segments.push({ type: 'interpolated', content: responses[sourceQuestion.id] });
      } else {
        segments.push({ type: 'text', content: match[0] });
      }

      lastIndex = match.index + match[0].length;
    }

    if (lastIndex < prompt.length) {
      const remaining = prompt.slice(lastIndex);
      if (remaining) {
        segments.push({ type: 'text', content: remaining });
      }
    }

    if (segments.length === 0) {
      segments.push({ type: 'text', content: prompt });
    }

    return segments;
  }, [responses, allQuestions]);

  const currentQuestion = visibleQuestions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === visibleQuestions.length - 1;
  const isFirstQuestion = currentQuestionIndex === 0;
  const progress = visibleQuestions.length > 0 
    ? ((currentQuestionIndex + 1) / visibleQuestions.length) * 100 
    : 0;

  return {
    template,
    session,
    questions: visibleQuestions,
    currentQuestion,
    currentQuestionIndex,
    responses,
    loading,
    saving,
    error,
    isFirstQuestion,
    isLastQuestion,
    progress,
    saveResponse,
    goToNextQuestion,
    goToPreviousQuestion,
    goToQuestion,
    interpolatePrompt,
    createSession,
  };
}
