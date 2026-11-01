import type { CheckoutKey } from './checkout';
import { MIRROR_SALES_OFFER } from '@/data/mirrorChallengeCopy';

/*
 * The offer catalog the funnel pages read: names, prices, what's included,
 * and how each one is bought. Prices follow the 2026-10-30 lineup.
 */

export type OfferKey =
  | 'mirror'
  | 'certifiedStandard'
  | 'producerChallenge'
  | 'agencyBrainCore'
  | 'agencyBrainPlusLcc'
  | 'boardroom'
  | 'teamStandard2x'
  | 'teamStandard4x'
  | 'eightWeek'
  | 'standard90'
  | 'ascension'
  | 'momentum'
  | 'directive';

/**
 * How a booking routes for this offer:
 *  buy      checkout now, no call needed
 *  apply    the application and Justin's calendar
 *  waitlist not open; join the waitlist
 * There are no sales calls with Mary (Justin, 2026-11-01).
 */
export type OfferRoute = 'buy' | 'apply' | 'waitlist';

export interface CheckoutOption {
  key: CheckoutKey;
  label: string;
  /** Shown above the button: price, billing cadence, and "Cancel any time" for subscriptions. */
  billing: string;
}

export interface Offer {
  key: OfferKey;
  name: string;
  /** Shown on cards. `null` hides the price (Ascension). */
  price: string | null;
  cadence: string;
  summary: string;
  includes: string[];
  /** The offer's own page (internal path or external URL). */
  page: string;
  route: OfferRoute;
  checkouts: CheckoutOption[];
  /** Offers bought somewhere else (Agency Brain checks out on its own site). */
  external?: { label: string; href: string; billing: string };
  /** Booking source, used for the application form and lead tagging. */
  applySource?: string;
}

export const AGENCY_BRAIN_PLANS_URL = 'https://myagencybrain.com/2027';

export const MIRROR_CREDIT_TERMS =
  "The Mirror pays for itself. Your $197 comes off your first month of Agency Brain or Boardroom, until 14 days after the Mirror ends. One per agency. Doesn't apply to Live Call Coach seats or programs.";

export const MIRROR_FREE_LINE = 'Free for Boardroom and Agency Brain members.';

export const RESULTS_DISCLAIMER = 'No income or sales results are promised. Results depend on your market and execution.';

export const GUARANTEES = {
  eightWeek: "Stay in the 8 weeks, do the work, and if you want your money back, ask. You'll get it.",
  standard90: "If your framework isn't live by day 90, Justin keeps working free until it is.",
};

const TEAM_STANDARD_SHARED = [
  'One 45-minute agency owner coaching call a month',
  'Private messaging channel between Justin and your team',
  'Weekly Return & Reports to the agency owner',
  'Agency Brain Pro',
  'The owner gets the Monday Boardroom call and all live events',
  'Mirror Challenge free',
];

export const OFFERS: Record<OfferKey, Offer> = {
  mirror: {
    key: 'mirror',
    name: 'Mirror Challenge',
    price: '$197',
    cadence: 'one time',
    summary: 'Eight weeks, 32 systems, four a week: see what is actually true in your agency.',
    includes: [...MIRROR_SALES_OFFER.includes, MIRROR_FREE_LINE],
    page: '/mirror',
    route: 'buy',
    checkouts: [{ key: 'mirror', label: 'Start the Mirror', billing: '$197, one time' }],
  },
  certifiedStandard: {
    key: 'certifiedStandard',
    name: 'Certified Standard',
    price: '$399',
    cadence: 'per seat, one time',
    summary: 'Producer certification on the Standard Playbook sales process.',
    includes: ['Self-paced certification for each producer seat', 'Owner confirmation of producer readiness'],
    page: '/certified-standard',
    route: 'buy',
    checkouts: [{ key: 'certifiedStandard', label: 'Choose seats', billing: '$399 per seat, one time' }],
  },
  producerChallenge: {
    key: 'producerChallenge',
    name: '6-Week Producer Challenge',
    price: '$299',
    cadence: 'per producer',
    summary: 'Six weeks, 30 trainings, for producers who need to execute now.',
    includes: ['30 training modules', 'Sunday target setting', 'Owner and manager view of every takeaway'],
    page: '/the-challenge',
    route: 'buy',
    checkouts: [{ key: 'producerChallenge', label: 'Start the Challenge', billing: '$299 per producer, one time' }],
  },
  agencyBrainCore: {
    key: 'agencyBrainCore',
    name: 'Agency Brain Core',
    price: '$299',
    cadence: '/mo',
    summary: 'Dashboards, scorecards, sales and service tools, Standard Playbook training, Core 4 and Flows.',
    includes: ['20 AI-scored sales calls a month', 'Mirror Challenge free'],
    page: AGENCY_BRAIN_PLANS_URL,
    route: 'buy',
    checkouts: [],
    external: { label: 'See Agency Brain plans', href: AGENCY_BRAIN_PLANS_URL, billing: '$299 a month · Billed monthly · Cancel any time' },
  },
  agencyBrainPlusLcc: {
    key: 'agencyBrainPlusLcc',
    name: 'Agency Brain Plus + Live Call Coach',
    price: '$449',
    cadence: '/mo + $129 per rep',
    summary: 'Agency Brain Plus with Live Call Coach on your reps: know what is happening on every sales call.',
    includes: [
      '50 AI-scored sales calls a month',
      'AI Training Studio roleplay and the AI builders',
      'Live Call Coach, $129 per rep a month',
      'Mirror Challenge free',
    ],
    page: AGENCY_BRAIN_PLANS_URL,
    route: 'buy',
    checkouts: [],
    external: { label: 'See Agency Brain plans', href: AGENCY_BRAIN_PLANS_URL, billing: '$449 a month, plus $129 per rep a month for Live Call Coach · Cancel any time' },
  },
  boardroom: {
    key: 'boardroom',
    name: 'The Boardroom',
    price: '$399',
    cadence: '/mo',
    summary: 'Weekly group coaching with Agency Brain Core included.',
    includes: [
      'Weekly group coaching call, Monday 1pm EST',
      'Boardroom tool access inside Agency Brain',
      'Agency Brain Core',
      'Telegram',
      'Both Fort Wayne member events',
      'Mirror Challenge free',
    ],
    page: '/boardroom',
    route: 'buy',
    checkouts: [{ key: 'boardroom', label: 'Join the Boardroom', billing: '$399 a month · Billed monthly · Cancel any time' }],
  },
  teamStandard2x: {
    key: 'teamStandard2x',
    name: 'Team Standard 2X',
    price: '$2,500',
    cadence: '/mo',
    summary: 'Two fifty-minute team coaching and accountability calls a month, run without the owner in the room.',
    includes: ['Two 50-minute team coaching and accountability calls a month', ...TEAM_STANDARD_SHARED],
    page: '/team-standard',
    route: 'buy',
    checkouts: [{ key: 'teamStandard2x', label: 'Start Team Standard', billing: '$2,500 a month · Billed monthly · Cancel any time' }],
    applySource: 'team-standard',
  },
  teamStandard4x: {
    key: 'teamStandard4x',
    name: 'Team Standard 4X',
    price: '$4,000',
    cadence: '/mo',
    summary: 'Four fifty-minute team coaching and accountability calls a month, run without the owner in the room.',
    includes: ['Four 50-minute team coaching and accountability calls a month', ...TEAM_STANDARD_SHARED],
    page: '/team-standard',
    route: 'buy',
    checkouts: [{ key: 'teamStandard4x', label: 'Start Team Standard 4X', billing: '$4,000 a month · Billed monthly · Cancel any time' }],
    applySource: 'team-standard',
  },
  eightWeek: {
    key: 'eightWeek',
    name: '8-Week Sales Management Experience',
    price: '$4,500',
    cadence: 'or $625/week',
    summary: 'Install a sales management system your manager can run: process, scorecard, rhythm.',
    includes: [
      '40 daily coaching prompts to your manager',
      '8 live coaching calls with Justin',
      '16 team training assets',
      'Your signed sales process and consequence ladder',
      `The guarantee: ${GUARANTEES.eightWeek}`,
    ],
    page: '/sales-experience',
    route: 'buy',
    checkouts: [
      { key: 'eightWeekPif', label: 'Pay in full', billing: '$4,500, paid in full' },
      { key: 'eightWeekWeekly', label: 'Pay weekly', billing: '$625 a week for 8 weeks' },
    ],
    applySource: 'eight-week',
  },
  standard90: {
    key: 'standard90',
    name: 'Standard 90',
    price: '$15,000',
    cadence: '($5,000/mo × 3)',
    summary: 'Ninety days of daily 1:1 work to rebuild how the whole agency runs.',
    includes: [
      'Daily 1:1 work for 90 days with the owner, the manager if there is one, and the team',
      'Two calls every week: one with the owner or manager, one with the team',
      `The guarantee: ${GUARANTEES.standard90}`,
    ],
    page: '/standard90',
    route: 'apply',
    checkouts: [],
    applySource: 'standard90',
  },
  ascension: {
    key: 'ascension',
    name: 'The Standard Ascension',
    price: null,
    cadence: 'Apply to see the investment.',
    summary: 'Twelve weeks of private coaching across Body, Being, Balance and Business.',
    includes: [
      'Required daily interaction with Justin in your private messaging channel',
      'A private call every week',
    ],
    page: '/ascension',
    route: 'apply',
    checkouts: [],
    applySource: 'ascension',
  },
  momentum: {
    key: 'momentum',
    name: 'Momentum',
    price: '$2,500',
    cadence: '/mo',
    summary: 'Directive-level work, twice the conversation.',
    includes: [
      'Two 90-minute 1:1 coaching and implementation calls a month',
      'Weekly group coaching call, Monday 1pm EST',
      'Agency Brain Pro',
    ],
    page: '/momentum',
    route: 'apply',
    checkouts: [],
    applySource: 'momentum',
  },
  directive: {
    key: 'directive',
    name: 'The Directive',
    price: '$1,500',
    cadence: '/mo · Waitlist',
    summary: 'Monthly 2-hour private sessions with Justin. Waitlist only.',
    includes: [],
    page: '/directive',
    route: 'waitlist',
    checkouts: [],
  },
};

/** Offers whose booking routes to the application flow on Justin's calendar. */
export const isApplyOffer = (key: OfferKey) => OFFERS[key].route === 'apply';

export const isOfferKey = (value: string | null | undefined): value is OfferKey =>
  Boolean(value && Object.prototype.hasOwnProperty.call(OFFERS, value));
