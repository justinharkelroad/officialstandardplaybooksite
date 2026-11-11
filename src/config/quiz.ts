import type { OfferKey } from './offers';

/*
 * The /decision prescription quiz: questions, answer phrasing, and the
 * "why" copy on the result page. Justin can edit any text here.
 *
 * In the "why" templates, these tokens are replaced with the visitor's own
 * answers: {producers} {manager} {problem} {timing} {budget}
 */

export type Producers = 'solo' | '1-3' | '4-9' | '10+';
export type Manager = 'yes' | 'no' | 'self';
export type Problem = 'alone' | 'team' | 'manager' | 'calls' | 'rebuild';
export type Timing = 'month' | 'quarter' | 'looking';
export type Budget = 'under500' | '500-2500' | '2500-5000' | '5000+';

export interface QuizAnswers {
  producers: Producers;
  manager: Manager;
  problem: Problem;
  timing: Timing;
  budget: Budget;
}

export type QuizQuestionId = keyof QuizAnswers;

export interface QuizQuestion<K extends QuizQuestionId = QuizQuestionId> {
  id: K;
  title: string;
  options: { value: QuizAnswers[K]; label: string }[];
}

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 'producers',
    title: 'How many producers do you have?',
    options: [
      { value: 'solo', label: 'Just me' },
      { value: '1-3', label: '1–3' },
      { value: '4-9', label: '4–9' },
      { value: '10+', label: '10+' },
    ],
  },
  {
    id: 'manager',
    title: 'Do you have a sales manager?',
    options: [
      { value: 'yes', label: 'Yes' },
      { value: 'no', label: 'No' },
      { value: 'self', label: "I'm the sales manager" },
    ],
  },
  {
    id: 'problem',
    title: "What's the biggest problem right now?",
    options: [
      { value: 'alone', label: "I'm running it alone and second-guessing every decision" },
      { value: 'team', label: "My team doesn't follow through when I'm not watching" },
      { value: 'manager', label: 'My sales manager has no system to run' },
      { value: 'calls', label: "I don't know what's happening on our sales calls" },
      { value: 'rebuild', label: 'I want to rebuild how the whole agency runs' },
    ],
  },
  {
    id: 'timing',
    title: 'How soon do you want to fix it?',
    options: [
      { value: 'month', label: 'This month' },
      { value: 'quarter', label: 'This quarter' },
      { value: 'looking', label: 'Just looking' },
    ],
  },
  {
    id: 'budget',
    title: 'Monthly budget for growth?',
    options: [
      { value: 'under500', label: 'Under $500' },
      { value: '500-2500', label: '$500–$2,500' },
      { value: '2500-5000', label: '$2,500–$5,000' },
      { value: '5000+', label: '$5,000+' },
    ],
  },
];

/** How each answer reads inside a sentence. */
export const ANSWER_PHRASES: { [K in QuizQuestionId]: Record<QuizAnswers[K], string> } = {
  producers: {
    solo: 'no producers besides you',
    '1-3': '1–3 producers',
    '4-9': '4–9 producers',
    '10+': '10 or more producers',
  },
  manager: {
    yes: 'you have a sales manager',
    no: "you don't have a sales manager",
    self: "you're the sales manager",
  },
  problem: {
    alone: "you're running it alone and second-guessing every decision",
    team: "your team doesn't follow through when you're not watching",
    manager: 'your sales manager has no system to run',
    calls: "you don't know what's happening on your sales calls",
    rebuild: 'you want to rebuild how the whole agency runs',
  },
  timing: {
    month: 'this month',
    quarter: 'this quarter',
    looking: 'when the timing is right',
  },
  budget: {
    under500: 'under $500 a month',
    '500-2500': '$500–$2,500 a month',
    '2500-5000': '$2,500–$5,000 a month',
    '5000+': '$5,000 or more a month',
  },
};

/** Three sentences per prescription. Shown under "Your prescription". */
export const PRESCRIPTION_WHY: Record<OfferKey, string> = {
  agencyBrainPlusLcc:
    "You have {producers} and said {problem}. Agency Brain Plus scores your sales calls with AI, and Live Call Coach coaches your reps while they're on the phone. You'll know what's happening on every call without listening to recordings all week.",
  agencyBrainCore:
    'You have {producers} and said {problem}. Agency Brain Core gives you the dashboards, scorecards and 20 AI-scored calls a month. Start there and add Live Call Coach when you want coaching on live calls.',
  standard90:
    "You have {producers}, said {problem}, and have {budget} to put behind it. Standard 90 is 90 days of daily 1:1 work with you, your manager and your team, with two calls every week. If your framework isn't live by day 90, Justin keeps working free until it is.",
  eightWeek:
    'You said {manager} and {problem}. The 8-Week installs that system: the sales process, the scorecard and the weekly rhythm your manager runs without you. Stay in the 8 weeks, do the work, and if you want your money back, ask.',
  teamStandard2x:
    "You have {producers} and said {problem}. Team Standard puts your team on two calls a month with Justin, without you in the room, and you get the Weekly Return & Reports. With {budget} for growth, it's the fastest way to make the standard theirs.",
  teamStandard4x:
    "You have {producers} and said {problem}. Team Standard 4X puts your team on four calls a month with Justin, without you in the room, and you get the Weekly Return & Reports. At your size and with {budget} for growth, the extra calls keep every producer accountable.",
  mirror:
    'Your budget is {budget} right now, so start where it costs the least. The Mirror Challenge scores your agency across five pillars, then works the gaps for eight weeks. Your $197 comes off your first month of Agency Brain or the Boardroom when you move up.',
  boardroom:
    'You have {producers} and said {problem}. The Boardroom puts you on a call with Justin and other owners every Monday, with Agency Brain Core included. It is the lowest-cost way to stop making every decision alone.',
  certifiedStandard:
    'You have {producers} and said {problem}. Certified Standard certifies each producer on the Standard Playbook sales process. Every seat is a one-time $399.',
  producerChallenge:
    'You have {producers} and said {problem}. The 6-Week Producer Challenge gets producers executing in six weeks with 30 trainings. It is $299 per producer.',
  ascension:
    'You said {problem}. The Ascension is twelve weeks of private coaching with Justin across Body, Being, Balance and Business. Apply to see the investment.',
  momentum:
    'You have {producers} and said {problem}. Momentum gives you two 90-minute 1:1 calls with Justin every month plus the Monday group call. It is waitlist only right now — join the waitlist and start in the weekly Boardroom while you wait.',
  directive:
    'The Directive and Momentum are both waitlist only right now. Join the waitlist, and start in the weekly Boardroom group coaching to learn the systems while a seat opens.',
};
