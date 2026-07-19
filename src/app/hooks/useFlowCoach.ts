import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { supabase } from '@/app/lib/supabaseClient';
import type { FlowCoachTurn } from '@/app/types/flows';

export type FlowCoachReflection = FlowCoachTurn;

const COACH_TIMEOUT_MS = 8000;

export function useFlowCoach(sessionId?: string | null) {
  const [reflectionsBySession, setReflectionsBySession] = useState<Record<string, Record<string, FlowCoachReflection>>>({});
  const [pendingKeys, setPendingKeys] = useState<Set<string>>(new Set());
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    return () => { mountedRef.current = false; };
  }, []);

  useEffect(() => {
    if (!sessionId) return;
    let active = true;
    void (async () => {
      const { data } = await supabase.from('flow_coach_messages')
        .select('question_id,reflection,probe,probe_answer,resolution,memory_refs')
        .eq('flow_session_id', sessionId)
        .order('created_at', { ascending: true });
      if (!active || !data) return;
      const loaded = Object.fromEntries(data.map((row) => [row.question_id, {
        reflection: row.reflection,
        probe: row.probe,
        probe_answer: row.probe_answer,
        resolution: row.resolution,
        memory_refs: Array.isArray(row.memory_refs) ? row.memory_refs as FlowCoachReflection['memory_refs'] : [],
      }]));
      setReflectionsBySession((current) => ({
        ...current,
        [sessionId]: { ...loaded, ...(current[sessionId] ?? {}) },
      }));
    })();
    return () => { active = false; };
  }, [sessionId]);

  const reflect = useCallback(async (input: {
    sessionId: string;
    questionId: string;
    answer: string;
  }) => {
    const requestKey = `${input.sessionId}:${input.questionId}`;
    setPendingKeys((current) => new Set(current).add(requestKey));
    let timeoutId: number | undefined;
    try {
      const invocation = supabase.functions.invoke('flow_coach_reflect', {
        body: {
          session_id: input.sessionId,
          question_id: input.questionId,
          answer: input.answer,
          allow_probe: false,
        },
      });
      const delivery = invocation.then((result) => {
        if (result.error) throw result.error;
        if (!mountedRef.current || !result.data?.reflection) return;
        setReflectionsBySession((current) => ({
          ...current,
          [input.sessionId]: {
            ...(current[input.sessionId] ?? {}),
            [input.questionId]: {
              reflection: result.data.reflection,
              probe: result.data.probe ?? null,
              probe_answer: result.data.probe_answer ?? null,
              resolution: result.data.resolution ?? null,
              memory_refs: Array.isArray(result.data.memory_refs) ? result.data.memory_refs : [],
            },
          },
        }));
      }).catch((error) => {
        console.warn('[Flowing] Reflection skipped:', error);
      });
      await Promise.race([
        delivery,
        new Promise<void>((resolve) => { timeoutId = window.setTimeout(resolve, COACH_TIMEOUT_MS); }),
      ]);
    } finally {
      if (timeoutId !== undefined) window.clearTimeout(timeoutId);
      if (mountedRef.current) {
        setPendingKeys((current) => {
          const next = new Set(current);
          next.delete(requestKey);
          return next;
        });
      }
    }
  }, []);

  const reflections = sessionId ? reflectionsBySession[sessionId] ?? {} : {};
  const pendingQuestionIds = useMemo(() => {
    if (!sessionId) return new Set<string>();
    const prefix = `${sessionId}:`;
    return new Set([...pendingKeys].filter((key) => key.startsWith(prefix)).map((key) => key.slice(prefix.length)));
  }, [pendingKeys, sessionId]);

  return { reflections, pendingQuestionIds, reflect };
}
