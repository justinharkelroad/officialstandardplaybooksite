import type { OfferKey } from '@/config/offers';
import { ANSWER_PHRASES, PRESCRIPTION_WHY, type QuizAnswers } from '@/config/quiz';

export interface Prescription {
  /** The prescription (button A). */
  a: OfferKey;
  /** The alternative (button B). */
  b: OfferKey;
  /** Which rule matched, for lead tagging and debugging. */
  rule: 'calls' | 'rebuild' | 'manager' | 'team' | 'budget' | 'default';
}

const FOUR_PLUS_PRODUCERS: QuizAnswers['producers'][] = ['4-9', '10+'];
const BUDGET_2500_PLUS: QuizAnswers['budget'][] = ['2500-5000', '5000+'];

/** The prescription rules. First match wins, in the order of the handoff table. */
export function prescribe(answers: QuizAnswers): Prescription {
  const { producers, manager, problem, budget } = answers;

  if (problem === 'calls') return { a: 'agencyBrainPlusLcc', b: 'agencyBrainCore', rule: 'calls' };
  if (problem === 'rebuild' && budget === '5000+') return { a: 'standard90', b: 'teamStandard2x', rule: 'rebuild' };
  if (problem === 'manager' && manager === 'yes') return { a: 'eightWeek', b: 'boardroom', rule: 'manager' };
  if (problem === 'team' && FOUR_PLUS_PRODUCERS.includes(producers) && BUDGET_2500_PLUS.includes(budget)) {
    const a = producers === '10+' && budget === '5000+' ? 'teamStandard4x' : 'teamStandard2x';
    return { a, b: 'boardroom', rule: 'team' };
  }
  if (budget === 'under500') return { a: 'mirror', b: 'boardroom', rule: 'budget' };
  return { a: 'boardroom', b: 'agencyBrainPlusLcc', rule: 'default' };
}

const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

/** The "why" text for an offer, filled in with the visitor's own answers. */
export function explainPrescription(offer: OfferKey, answers: QuizAnswers): string {
  const filled = PRESCRIPTION_WHY[offer].replace(/\{(producers|manager|problem|timing|budget)\}/g, (_, key: keyof QuizAnswers) => {
    const phrases = ANSWER_PHRASES[key] as Record<string, string>;
    return phrases[answers[key]] ?? '';
  });
  // A sentence may open with a token ("{problem}..."), so recapitalize.
  return filled.replace(/(^|[.!?]\s+)([a-z])/g, (_, lead: string, ch: string) => lead + capitalize(ch));
}

export const isCompleteAnswers = (value: Partial<QuizAnswers> | null | undefined): value is QuizAnswers =>
  Boolean(value && value.producers && value.manager && value.problem && value.timing && value.budget);
