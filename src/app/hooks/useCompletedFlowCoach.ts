import { useEffect, useState } from 'react';
import { loadAuthorizedFlowCoachTurns } from '@/app/lib/flowCoachData';
import type { FlowCoachTurn, FlowQuestion } from '@/app/types/flows';

interface UseCompletedFlowCoachParams {
  sessionId?: string | null;
  questions: FlowQuestion[];
  responses: Record<string, string>;
}

export function useCompletedFlowCoach({
  sessionId,
  questions,
  responses,
}: UseCompletedFlowCoachParams) {
  const [coachTurns, setCoachTurns] = useState<Record<string, FlowCoachTurn>>({});
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!sessionId || !questions.length) {
      setCoachTurns({});
      setError(null);
      return;
    }

    let active = true;
    void loadAuthorizedFlowCoachTurns(sessionId, questions, responses)
      .then((loaded) => {
        if (!active) return;
        setCoachTurns(loaded);
        setError(null);
      })
      .catch((caughtError: unknown) => {
        if (!active) return;
        setCoachTurns({});
        setError(caughtError instanceof Error ? caughtError : new Error('Unable to load Coach conversation.'));
      });

    return () => { active = false; };
  }, [questions, responses, sessionId]);

  return { coachTurns, error };
}
