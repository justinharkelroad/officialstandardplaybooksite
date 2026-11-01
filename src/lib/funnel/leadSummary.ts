import { OFFERS, type OfferKey, type OfferRoute } from '@/config/offers';
import { QUIZ_QUESTIONS, type QuizAnswers } from '@/config/quiz';
import type { Prescription } from './prescribe';

/** Readable lead details for the team email, built from the same config the pages use. */
export interface LeadSummary {
  prescriptionName: string;
  alternativeName: string;
  offerName: string | null;
  routeLabel: string;
  answers: { question: string; answer: string }[];
}

const ROUTE_LABELS: Record<OfferRoute, (offer: string) => string> = {
  buy: (offer) => `Booking form: shown checkout for ${offer}, no call needed`,
  apply: (offer) => `Booking form: sent to the ${offer} application and Justin's calendar`,
  waitlist: (offer) => `Booking form: sent to the ${offer} waitlist`,
};

export function leadSummary(answers: QuizAnswers, rx: Prescription, offer?: OfferKey): LeadSummary {
  const offerName = offer ? OFFERS[offer].name : null;
  return {
    prescriptionName: OFFERS[rx.a].name,
    alternativeName: OFFERS[rx.b].name,
    offerName,
    routeLabel: offer && offerName
      ? ROUTE_LABELS[OFFERS[offer].route](offerName)
      : `Quiz: prescribed ${OFFERS[rx.a].name}`,
    answers: QUIZ_QUESTIONS.map((q) => ({
      question: q.title,
      answer: q.options.find((o) => o.value === answers[q.id])?.label ?? String(answers[q.id] ?? ''),
    })),
  };
}
