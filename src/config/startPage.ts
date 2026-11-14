/*
 * Clips on /start. Every `src: null` is a placeholder frame; set it to an
 * mp4 path (e.g. '/video/scored-call.mp4') to show the real clip.
 * Demo clips play muted on a loop. The proof clip gets controls.
 */

export interface Clip {
  title: string;
  src: string | null;
  poster?: string;
}

/** Agency Brain demo clips (Vimeo 1232020191, 1232445423, 1231995597; 1080p downloads, 2026-11-13). */
export const DEMO_CLIPS: Clip[] = [
  { title: 'A scored sales call', src: '/video/agency-brain-call-scoring.mp4', poster: '/video/agency-brain-call-scoring-poster.jpg' },
  { title: 'Live Call Coach, live', src: '/video/agency-brain-live-call-coach.mp4', poster: '/video/agency-brain-live-call-coach-poster.jpg' },
  { title: 'A weekly scorecard', src: '/video/agency-brain-scorecards.mp4', poster: '/video/agency-brain-scorecards-poster.jpg' },
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

/**
 * "What owners ask first" on /start: written answers instead of video
 * (Justin, 2026-11-14). `punch` is the big display line; wrap the words to
 * highlight in *asterisks*. Facts come from OFFERS, GUARANTEES and the
 * Boardroom / Team Standard FAQs; keep them in step when prices change.
 */
export interface Objection {
  q: string;
  punch: string;
  body: string[];
  stats?: { value: string; label: string }[];
  link?: { label: string; to: string };
}

export const OBJECTIONS: Objection[] = [
  {
    q: 'Is it worth the money?',
    punch: '*$25* a Monday.',
    body: [
      'Agency Brain Core is $299 a month on its own. The Boardroom is $399 and Core comes with it. That puts the coaching at $100 a month, about $25 for every Monday you sit in the room with me and owners who run agencies like yours.',
      'Ask what one more month of the same is costing you.',
    ],
    stats: [
      { value: '$399', label: 'Boardroom, per month' },
      { value: '$299', label: 'Agency Brain Core, included' },
      { value: '$100', label: 'What the coaching adds' },
    ],
  },
  {
    q: "I don't have time",
    punch: '*One hour.* Every Monday.',
    body: [
      'Sixty minutes live, Monday at 1pm EST, and a 30-minute loop in Agency Brain before the call. You walk out with one Domino due next Monday. Miss a call and it is recorded.',
      "Owners who don't have time are usually running an agency that only works when they're in it. That's the standard problem.",
    ],
    stats: [
      { value: '60', label: 'Minutes live, Monday 1pm EST' },
      { value: '30', label: 'Minute pre-call loop' },
      { value: '1', label: 'Domino a week' },
    ],
  },
  {
    q: 'Will this work for my carrier?',
    punch: "It's not a *carrier* problem.",
    body: [
      'Allstate, State Farm, Farmers, American Family, independent. The name on the sign changes. The problem does not: no written process, no scorecard, no weekly rhythm.',
      "Standard builds those three inside your agency, and none of them depend on whose name is on the policy.",
    ],
  },
  {
    q: "My producers won't change",
    punch: 'They will when the *standard* does.',
    body: [
      "Producers don't change because you asked nicely. They change when the bar is written down, measured every week, and has a consequence attached.",
      'You set the bar. Agency Brain scores the calls and keeps the scorecard, so nobody argues about what happened. The standard does the holding, not your mood.',
    ],
  },
  {
    q: "I've tried coaching before",
    punch: 'This is not a *pep talk.*',
    body: [
      'Most coaching hands you ideas and leaves. This hands you a rhythm. Every week you report on last week\'s Domino before the new one unlocks. You cannot skip it, and you cannot fake it, because the numbers live in Agency Brain.',
      "Ideas didn't fail you. Follow-through did. That's what we install.",
    ],
  },
  {
    q: 'What if I want to cancel?',
    punch: 'Then *cancel.*',
    body: [
      'No contract. The Boardroom is $399 a month, billed month to month. If you need to make a change, our team handles it personally.',
      "I'd rather keep you because it's working than because you're stuck.",
    ],
    stats: [
      { value: '0', label: 'Contracts' },
      { value: '1', label: 'Month at a time' },
    ],
  },
  {
    q: 'Do I need Agency Brain too?',
    punch: "It's *already* in there.",
    body: [
      'The Boardroom includes Agency Brain Core: dashboards, scorecards, 20 AI-scored sales calls a month, Core 4, the Flows and the Standard Playbook training, with unlimited Staff Portal logins for your team.',
      'Want more, like Live Call Coach on your reps? Upgrade inside Agency Brain when you are ready. It is not required to start.',
    ],
  },
  {
    q: "What's the difference between Boardroom and Team Standard?",
    punch: 'One coaches *you.* One coaches *your team.*',
    body: [
      'The Boardroom is for you: the Monday call with owners, Agency Brain Core, $399 a month.',
      'Team Standard puts me inside your team: 50-minute coaching and accountability calls with you out of the room, a weekly report back to you, and 45 minutes with me every month. You get the Boardroom too. It is waitlist only right now.',
    ],
    stats: [
      { value: '$399', label: 'Boardroom, per month' },
      { value: '$2,500', label: 'Team Standard 2X, per month' },
      { value: '$4,000', label: 'Team Standard 4X, per month' },
    ],
    link: { label: 'See Team Standard', to: '/team-standard' },
  },
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
