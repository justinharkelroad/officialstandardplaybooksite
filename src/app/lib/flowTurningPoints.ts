import type { FlowCoachTurn, FlowQuestion } from '@/app/types/flows';

export interface FlowTurningPoint {
  questionId: string;
  prompt: string;
  answer: string;
  coach: FlowCoachTurn;
}

const LATE_SYNTHESIS_IDS = new Set(['lesson', 'revelation', 'actions']);
const STORY_IDS = new Set(['start_story', 'stop_story', 'sustain_story']);

export function selectFlowTurningPoints(
  questions: FlowQuestion[],
  responses: Record<string, string>,
  coachReflections: Record<string, FlowCoachTurn>,
  limit = 6,
): FlowTurningPoint[] {
  return questions
    .map((question, index) => {
      const answer = responses[question.id]?.trim();
      const coach = coachReflections[question.id];
      if (!answer || !coach?.reflection?.trim()) return null;
      const resolvedProbe = Boolean(coach.probe && coach.probe_answer);
      const score = (resolvedProbe ? 100 : 0)
        + (LATE_SYNTHESIS_IDS.has(question.id) ? 30 : 0)
        + (STORY_IDS.has(question.id) ? 20 : 0)
        + index / Math.max(questions.length, 1);
      return { questionId: question.id, prompt: question.prompt, answer, coach, score, index };
    })
    .filter((item): item is NonNullable<typeof item> => item !== null)
    .sort((a, b) => b.score - a.score)
    .slice(0, Math.max(0, limit))
    .sort((a, b) => a.index - b.index)
    .map(({ score: _score, index: _index, ...turningPoint }) => turningPoint);
}
