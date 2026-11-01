// Aligned with Agency Brain origin/main approved Mirror sales copy, 2026-11-01.
// Keep offer terms aligned with myagencybrain.com/themirrorchallenge.
// Copy for the Mirror Challenge sales page (/themirrorchallenge).
//
// Copy approved by Justin on 2026-10-27. Same rules as every Mirror Challenge
// message: no em or en dashes, no emoji, no prize or cash language, no cohort or
// "join us Monday" language. Coaching is named as the source of the Mirror, with no
// coaching prices (Justin, 2026-10-27).
type MirrorCategory = string;
type MirrorItemId = string;

export const MIRROR_SALES_PAGE_COPY_STATUS = "APPROVED" as "DRAFT" | "APPROVED";

export const MIRROR_SALES_HERO = {
  eyebrow: "The Mirror Challenge for agency owners",
  headline: "You think you know your agency. Prove it.",
  intro:
    "Thirty-two systems every great agency runs. Eight weeks. One honest look at each, delivered to your inbox. The gap between the score you give yourself on Day 1 and the one you write on Day 32 is the whole point.",
  primaryCta: "Start The Mirror Challenge for $197",
  secondaryCta: "Take the 5-question Mirror first",
  anchor:
    "The same Mirror that Standard Playbook coaching clients work through.",
  imageAlt:
    "A Mirror Score of 99 out of 160, with the five pillars on a radar chart",
};

export interface MirrorQuickItem {
  itemId: MirrorItemId;
  pillar: string;
  title: string;
  question: string;
  atFive: string;
}

// One system from each pillar, rewritten for the page from the Mirror itself.
export const MIRROR_QUICK_ITEMS: MirrorQuickItem[] = [
  {
    itemId: "management_role",
    pillar: "Culture & Team",
    title: "Management",
    question:
      "Do you have someone who coaches every day, reviews calls, and holds the standard, without you?",
    atFive:
      "A manager who coaches. Not a super-producer with an office. Not you doing management work at 9pm because no one else will.",
  },
  {
    itemId: "morning_huddle",
    pillar: "Systems & Rhythm",
    title: "Morning Huddle",
    question: "Did your team huddle yesterday? And the day before?",
    atFive: "Fifteen minutes. Same time. Every day. Non-negotiable.",
  },
  {
    itemId: "scoring_calls",
    pillar: "Training & Scripts",
    title: "Scoring Calls",
    question:
      "Are sales calls scored on the same scorecard every week, with feedback to the producer?",
    atFive:
      "A rubric that says what good looks like, and who is hitting it. Scored every week by someone who knows.",
  },
  {
    itemId: "marketing_plan",
    pillar: "Marketing & Lead Flow",
    title: "Marketing Plan",
    question:
      "Is there a written plan that puts four to five quoted households per producer per day on the phone?",
    atFive:
      "A plan on paper and a rhythm for running it. Every month you know what you are running, what you are spending, and what you expect back.",
  },
  {
    itemId: "cancellations_reporting",
    pillar: "Owner Command",
    title: "Cancellations Reporting",
    question:
      "Do you review every cancellation monthly and know which ones you could have saved?",
    atFive:
      "Every cancellation is logged with a reason, a producer, and a pattern. You know retention by channel and by product, and you adjust.",
  },
];

export const MIRROR_QUICK_COPY = {
  title: "Five questions. Be honest.",
  intro:
    "One system from each pillar. Rate each one where it actually is, not where you want it to be.",
  atFiveLabel: "At a 5",
  resultTitle: "Your quick Mirror: {{score}} of 25",
  resultTier: 'On the full Mirror, that reads as "{{tier}}."',
  resultBody:
    "That is 5 of 32. The other 27 are where owners find the surprises.",
  resultCta: "Get all 32",
  remaining: "Rate all five to see your score.",
};

export const MIRROR_SALES_PILLARS: Array<{
  id: MirrorCategory;
  title: string;
  count: number;
  line: string;
  question: string;
}> = [
  {
    id: "culture_team",
    title: "Culture & Team",
    count: 10,
    line: "Who does what, and whether they would still do it without you in the room.",
    question:
      "If your best producer quit tomorrow and your second best took a week off the same day, what would actually break?",
  },
  {
    id: "systems_rhythm",
    title: "Systems & Rhythm",
    count: 6,
    line: "The daily and weekly rhythms that run the agency when you are not there.",
    question:
      "If you disappeared for two weeks, what would keep running on its own?",
  },
  {
    id: "training_scripts",
    title: "Training & Scripts",
    count: 6,
    line: "Whether your people know what good looks like, and practice it.",
    question:
      "If you stopped telling your team what to do tomorrow, would they still know?",
  },
  {
    id: "marketing_lead_flow",
    title: "Marketing & Lead Flow",
    count: 6,
    line: "Where your leads come from, what they cost, and who earns them.",
    question:
      "Do you actually know what a lead costs you today? Not a guess. A number.",
  },
  {
    id: "owner_command",
    title: "Owner Command",
    count: 4,
    line: "The numbers you look at, and the ones you avoid.",
    question:
      "What number did you look at first today? Was it the right one, or just the easiest to find?",
  },
];

export const MIRROR_SALES_PILLARS_COPY = {
  title: "Five pillars. Thirty-two systems.",
  intro:
    "Every item comes with what a 5 looks like and three questions written to get past the easy answer.",
};

export const MIRROR_SALES_STEPS = [
  {
    title: "Pick your start",
    body: "Choose any weekday in the next 7 days. If you do not choose, your challenge starts on its own.",
    image: "/marketing/mirror-challenge/start.png",
    width: 1440,
    height: 612,
    imageAlt: "Choosing a start date for The Mirror Challenge",
  },
  {
    title: "One system a day, by email",
    body: "Four days a week, the day's system lands in your inbox with what a 5 looks like.",
    image: "/marketing/mirror-challenge/email.png",
    width: 1280,
    height: 1100,
    imageAlt: "The Day 14 email for Morning Huddle",
  },
  {
    title: "Rate it. Answer three hard questions.",
    body: "A rating and three questions written to get past the easy answer. Everything saves to your own Mirror.",
    image: "/marketing/mirror-challenge/day.png",
    width: 1344,
    height: 2360,
    imageAlt: "The Morning Huddle item with its three questions answered",
  },
  {
    title: "Watch the picture come into focus",
    body: "Your score and all five pillars, updated as you go. A short reflection closes each week.",
    image: "/marketing/mirror-challenge/pillar.png",
    width: 1520,
    height: 1064,
    imageAlt: "The Systems & Rhythm pillar with each system rated",
  },
];

export const MIRROR_SALES_STEPS_COPY = {
  title: "How the eight weeks run.",
};

export const MIRROR_SALES_DOSSIER = {
  title: "What you walk away with.",
  intro: "Finish all 32 and the Mirror builds your finisher dossier.",
  points: [
    "Your Mirror Score on Day 1 and on Day 32, out of 160",
    "All five pillars, with where you rose and where you got honest",
    "Honest Mirror Recalibrations: the systems you rated too high on Day 1",
    "Your next 90 days: your lowest systems, paired with the 5-star version you wrote yourself",
    "A print-ready dossier to share with your team or your coach",
  ],
  image: "/marketing/mirror-challenge/dossier-print.png",
  width: 1800,
  height: 2500,
  imageAlt:
    "A finisher dossier showing the score shift, five pillars, momentum, recalibrations, and the next 90 days",
  caption:
    "A sample dossier for a fictional agency. Yours is built from your own ratings and answers.",
  counters: {
    dayOne: "Day 1 score",
    dayThirtyTwo: "Day 32 score",
    recalibrated: "systems re-rated once she looked closer",
    answers: "answers written",
  },
};

export const MIRROR_SALES_STORY = {
  title: "Built by an operator, not a consultant.",
  paragraphs: [
    "I spent 20 years in insurance. I built a mega agency and sold it in 2019. The same year I sold FollowUp Tool, the software I built for agents, in a seven-figure deal. Then I lost over $1 million on another investment, and I learned more from that than from the wins.",
    "The Mirror is the diagnostic I wish someone had handed me in year one. It is the same Mirror our Standard Playbook coaching clients work through, built into Agency Brain so you can run it on your own.",
  ],
  signature: "Justin Harkelroad",
  role: "Founder, Standard Playbook and Agency Brain",
};

export const MIRROR_SALES_PROOF = {
  title: "Owners are already running it.",
  stats: [
    // Counts that only ever grow, so the lines stay true (production, 2026-10-27).
    { value: "51", label: "agencies have built their Mirror in Agency Brain" },
    { value: "3", label: "owners have already gone 32 for 32" },
  ],
};

// Quotes from owners who went 32 for 32, sent by Justin (2026-10-27). The section
// shows the stats alone whenever this list is empty. Heather's opening paragraph
// ("this 32-week journey") is left out because the offer runs eight weeks.
export const MIRROR_SALES_TESTIMONIALS: Array<{
  paragraphs: string[];
  name: string;
  agency: string;
}> = [
  {
    paragraphs: [
      "The mirror challenge is a very helpful way of looking at the agency to see if you have everything in place. It can open your eyes to seeing what’s working great or what’s not even getting touched. At the end you have a roadmap that you can use to guide your week to build up each section. We have all these to-do lists in our heads that we know need to be done. This helps get it out of your head, and if you use it you can help make things better for yourself and your team.",
    ],
    name: "Romilee B.",
    agency: "Agency owner, finished all 32",
  },
  {
    paragraphs: [
      "As agency owners, we get so caught up in working in our businesses that we don’t always take the time to work on them. The Mirror forced me to slow down, be honest with myself, and take accountability.",
      "The biggest value wasn’t just the reflection, but walking away with a clear, actionable 90-day plan. You can’t improve what you’re not willing to honestly evaluate. I highly recommend it to any agency owner who is serious about growth!",
    ],
    name: "Heather E.",
    agency: "Agency owner, finished all 32",
  },
];

export const MIRROR_SALES_SAMPLE = {
  title: "Not ready? Start with one pillar.",
  body: 'Get the Systems & Rhythm workbook free. "What runs without you." Six rhythms to score on paper, with the questions that go with them.',
  nameLabel: "Your name",
  emailLabel: "Email",
  cta: "Get the free workbook",
  sending: "Getting your workbook...",
  done: "Your workbook is opening. If it does not, use this link.",
  doneLink: "Open the Systems & Rhythm workbook",
  privacy: "Your email stays with Standard Playbook. No spam.",
  invalidEmail: "Enter a valid email address.",
  rateLimited: "Too many requests from here. Try again in a little while.",
  failed:
    "We could not get your workbook right now. Please try again in a minute.",
};

export const MIRROR_SALES_OFFER = {
  title: "One payment. Eight weeks.",
  price: "$197",
  priceNote: "One payment. No subscription.",
  includes: [
    "All 32 Mirror systems over eight weeks, four a week",
    "A daily email with that day's system, plus a reminder",
    "A short weekly reflection to close each week",
    "Your finisher dossier, open for 30 days after you finish",
    "Upgrade to Agency Brain any time and keep everything",
  ],
  startNote:
    "Start within 7 days of purchase. If you do not pick a day, your challenge starts on its own.",
};

export const MIRROR_SALES_FAQ = [
  {
    q: "How much time does it take?",
    a: "One system a day, four days a week. A rating and three questions. You decide how deep to go, and the depth is where the value is.",
  },
  {
    q: "What if I rate myself too high?",
    a: "Almost everyone does on Day 1. The questions are built to catch it, and your dossier shows every score you lowered once you looked closer.",
  },
  {
    q: "What happens after eight weeks?",
    a: "Your Mirror and your dossier stay open for 30 days after you finish. After that they are saved and locked until you upgrade to Agency Brain, which brings them back.",
  },
  {
    q: "I already have Agency Brain.",
    a: "The Mirror Challenge is included. Log in and start it from The Mirror.",
  },
  {
    q: "Can my team do it with me?",
    a: "The challenge is built for the owner, and your answers are yours. Share the dossier with your team when you are ready.",
  },
  {
    // No refunds (Justin, 2026-10-27), matching section 8 of the Terms.
    q: "Can I get a refund?",
    a: "No. The Mirror Challenge is a one-time purchase and all sales are final. Take the 5-question Mirror above first if you want a feel for it before you buy.",
  },
];

// Unchanged from the approved landing page (2026-10-26).
export const MIRROR_SALES_SIGNED_IN = {
  title: "You are signed in to Agency Brain.",
  body: "The Mirror Challenge is included with your account. Open it from The Mirror.",
  cta: "Open The Mirror Challenge",
};

export const MIRROR_SALES_CLOSE = {
  title: "Find out what is actually true.",
  cta: "Start The Mirror Challenge for $197",
};
