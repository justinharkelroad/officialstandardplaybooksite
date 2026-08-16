import { supabase } from '@/app/lib/supabaseClient';
import {
  validateFlowCoachRows,
  type FlowCoachRow,
} from '@/app/lib/flowConversation';
import type { FlowCoachTurn, FlowQuestion } from '@/app/types/flows';

export async function loadAuthorizedFlowCoachTurns(
  sessionId: string,
  questions: FlowQuestion[],
  responses: Record<string, string>,
): Promise<Record<string, FlowCoachTurn>> {
  const { data, error } = await supabase
    .from('flow_coach_messages')
    .select('id,question_id,answer_excerpt,answer_hash,reflection,probe,probe_answer,resolution,memory_refs,created_at')
    .eq('flow_session_id', sessionId)
    .order('created_at', { ascending: false });

  if (error) {
    throw new Error('Unable to load the authorized Coach conversation for this Flow.', { cause: error });
  }

  return validateFlowCoachRows((data ?? []) as FlowCoachRow[], questions, responses);
}
