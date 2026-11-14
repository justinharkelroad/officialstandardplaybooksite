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

/** The one video case study on /start. */
export const PROOF_FEATURE = {
  clip: { title: 'Case study: Dan Westrick', src: '/video/westrick-testimonial.mp4', poster: '/video/westrick-testimonial-poster.jpg' } satisfies Clip,
  quote: 'He paid attention to my culture first.',
  author: 'Dan Westrick',
  role: 'Video case study',
};

/**
 * Written testimonials (names only, no photos; Justin, 2026-11-13). `role`
 * is left off where the program isn't known. Wording is verbatim except
 * Nicholas S., where an em dash became a comma (house style).
 */
export const PROOF_TESTIMONIALS: { quote: string; name: string; role?: string }[] = [
  {
    quote: "Creating and enforcing a standard is something every leader needs help with. Working with Justin was a game changer. You don't realize what you're missing until you have someone who truly understands your challenges and helps deliver results that matter. Accountability was something I struggled to implement, but once we established and enforced our own standards, it forced everyone to level up.",
    name: 'Luis S.',
    role: '8-Week participant',
  },
  {
    quote: 'Working with Justin Harkelroad has truly transformed my insurance agency, both professionally and personally. His quick responses over text and always spot-on advice have been invaluable, helping me navigate challenges with confidence and clarity. Justin’s mentorship has been a game-changer, and I’m incredibly grateful for his guidance and impact on my journey.',
    name: 'Jackie C.',
  },
  {
    quote: "I've learned a lot from this process, a lot about myself as a manager and leader as well. I feel that I can move forward a lot more confidently knowing what questions to ask myself and being a bit more inquisitive rather than jumping into action that may not be the most efficient or produce the best outcome. You've really taught me not just to think but how to think in just 7 hours which is wild.",
    name: 'Mike V.',
    role: '8-Week participant',
  },
  {
    quote: "While searching for standout consultants, Justin Harkelroad's name consistently surfaced, and for good reason. Justin has far exceeded expectations, guiding my team and me through every challenge our business has faced. Grounded in God-fearing principles, his coaching has transformed not only how I manage my business but also how I engage with my family. He continually pushes me to grow into a better man. His sharp attention to detail and strong business acumen are just the icing on the cake of the invaluable lessons he's imparted.",
    name: 'Nicholas S.',
  },
  {
    quote: "Working with Justin over the 8-week training was eye-opening and transformative. He showed me how to become a stronger, more accountable leader for my team and can truly bulletproof your agency, as long as you're able to hold yourself accountable as well.",
    name: 'Jonas B.',
    role: '8-Week participant',
  },
  {
    quote: "Justin has been instrumental in helping me achieve balance in both my personal life and business. His guidance has not only fostered my personal growth but has also elevated my business and team to levels I'm incredibly proud of. I’m appreciative of Justin’s time and dedication to my continued growth, making the journey exciting as I strive to win at this thing called life!",
    name: 'Heather E.',
  },
];

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
  'momentum',
  'directive',
] as const;
