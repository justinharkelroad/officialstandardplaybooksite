/*
 * Clips on /start. Every `src: null` is a placeholder frame; set it to an
 * mp4 path (e.g. '/video/scored-call.mp4') to show the real clip.
 * Demo clips play muted on a loop. Proof and objection clips get controls.
 */

export interface Clip {
  title: string;
  src: string | null;
  poster?: string;
}

export const DEMO_CLIPS: Clip[] = [
  { title: 'A scored sales call', src: null },
  { title: 'Live Call Coach, live', src: null },
  { title: 'A weekly scorecard', src: null },
];

export const PROOF_CLIPS: Clip[] = [
  { title: 'Case study: Dan Westrick', src: '/video/westrick-testimonial.mp4', poster: '/video/westrick-testimonial-poster.jpg' },
  { title: 'Case study #2', src: null },
  { title: 'Case study #3', src: null },
];

export const PROOF_QUOTE = {
  text: 'He paid attention to my culture first.',
  author: 'Dan Westrick',
};

export const OBJECTION_CLIPS: Clip[] = [
  { title: 'Is it worth the money?', src: null },
  { title: "I don't have time", src: null },
  { title: 'Will this work for my carrier?', src: null },
  { title: "My producers won't change", src: null },
  { title: "I've tried coaching before", src: null },
  { title: 'What if I want to cancel?', src: null },
  { title: 'Do I need Agency Brain too?', src: null },
  { title: "What's the difference between Boardroom and Team Standard?", src: null },
];

export const NOT_FOR = [
  'Solo agents with no team.',
  'Owners who want a course to hand off and disappear.',
  "Owners who won't let a manager lead.",
];

/** /start pricing table, in this order. */
export const START_PRICING_ORDER = [
  'mirror',
  'certifiedStandard',
  'producerChallenge',
  'agencyBrainPlusLcc',
  'boardroom',
  'teamStandard2x',
  'teamStandard4x',
  'eightWeek',
  'standard90',
  'ascension',
  'directive',
] as const;
