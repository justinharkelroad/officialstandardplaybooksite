
import { structuredDataByRoute } from './structuredData';

export interface SEOConfig {
  title: string;
  description: string;
  keywords: string[];
  ogImage?: string;
  canonical?: string;
  type?: 'website' | 'article';
  noindex?: boolean;
  structuredData?: object[];
}

const OG_IMAGE = 'https://standardplaybook.com/og-image.png';

export const seoConfig: Record<string, SEOConfig> = {
  '/': {
    title: 'Insurance Agency Coaching for Owners Who Want More | The Standard Playbook',
    description: 'High-performance coaching for insurance agency owners. Boardroom, Directive, and Partnership programs built by a 20-year Allstate operator.',
    keywords: ['insurance agency coaching', 'business coaching', 'elite entrepreneurs', 'agency mastermind', 'sales training', 'producer development', 'standard playbook', 'Fort Wayne coaching'],
    ogImage: OG_IMAGE,
    type: 'website',
    structuredData: structuredDataByRoute['/'],
  },
  '/boardroom': {
    title: 'The Boardroom: Elite Mastermind for Insurance Agency Owners | The Standard Playbook',
    description: 'Join The Boardroom: an exclusive mastermind for insurance agency owners. $299/month for peer accountability, strategy sessions, and proven growth systems from $1M+ agency operators.',
    keywords: ['agency mastermind', 'insurance agency owners', 'business coaching group', 'scaling agencies', 'agency growth', 'mastermind group'],
    ogImage: OG_IMAGE,
    type: 'article',
    structuredData: structuredDataByRoute['/boardroom'],
  },
  '/directive': {
    title: 'The Directive: Intensive 1:1 Implementation Coaching | The Standard Playbook',
    description: 'Get intensive 1:1 coaching with direct access to Justin. Monthly private sessions, weekly check-ins, 100 AI-graded calls/month, and custom tech/AI strategy buildouts for your agency.',
    keywords: ['1:1 business coaching', 'intensive coaching', 'implementation coaching', 'agency consulting', 'AI call scoring', 'sales coaching'],
    ogImage: OG_IMAGE,
    type: 'article',
    structuredData: structuredDataByRoute['/directive'],
  },
  '/standard90': {
    title: 'The Standard 90 | The Standard Playbook',
    description: 'A 90 day action map for the agency owner who is done being the operating system. Customized and personally coached one on one all the way through. By application.',
    keywords: ['insurance agency coaching', 'sales process framework', 'agency owner coaching', 'sales standard', 'personal sales coaching', 'standard playbook'],
    ogImage: OG_IMAGE,
    type: 'article',
  },
  '/ascension': {
    title: 'The Standard Ascension | One-on-One Private Mentorship',
    description: 'A 12-week private mentorship with Justin Harkelroad. One business target, all four areas of your life on the board, and weekly evidence you cannot hide from.',
    keywords: ['private mentorship', 'one on one business coaching', 'agency owner mentorship', '12 week coaching', 'standard ascension', 'standard playbook'],
    ogImage: 'https://standardplaybook.com/og/ascension.png',
    canonical: 'https://standardplaybook.com/ascension',
    type: 'article',
  },
  '/aiinstall': {
    title: 'Agency AI Install Waitlist | Standard Playbook',
    description: 'Join the waitlist for the next Agency AI Install: a live two-day build for insurance agency owners using Claude or Codex, with an ongoing replay and resource portal.',
    keywords: ['insurance agency AI', 'AI workshop waitlist', 'Claude for insurance agencies', 'Codex for insurance agencies', 'agency systems'],
    ogImage: 'https://standardplaybook.com/og/ai-install-portal.png',
    canonical: 'https://standardplaybook.com/aiinstall',
    type: 'website',
  },
  '/aiinstall/prework/claude': {
    title: 'Claude Pre-Work | The Agency AI Install',
    description: 'Get your computer ready for the workshop. You will install the app, create one folder, load it with your raw material, and prove it works. Do this early in the week, not the night before.',
    keywords: ['AI Install pre-work', 'Claude Cowork', 'MY BIZ BRAIN', 'workshop setup'],
    ogImage: 'https://standardplaybook.com/og/ai-install-claude-prework.png',
    canonical: 'https://standardplaybook.com/aiinstall/prework/claude',
    type: 'website',
    noindex: true,
  },
  '/aiinstall/prework/codex': {
    title: 'Codex Pre-Work | The Agency AI Install',
    description: 'Get your computer ready for the workshop. You will install the app, create one folder, load it with your raw material, and prove it works. Do this early in the week, not the night before.',
    keywords: ['AI Install pre-work', 'ChatGPT Codex', 'MY BIZ BRAIN', 'workshop setup'],
    ogImage: 'https://standardplaybook.com/og/ai-install-codex-prework.png',
    canonical: 'https://standardplaybook.com/aiinstall/prework/codex',
    type: 'website',
    noindex: true,
  },
  '/partnership': {
    title: 'Partnership Coaching for Insurance Agency Owners | Standard Playbook',
    description: '1:1 coaching plus team training for insurance agency owners ready to scale. Limited enrollment. Built by an operator, not a consultant.',
    keywords: ['business partnership', 'executive coaching', 'white-glove service', 'revenue sharing', 'elite coaching'],
    ogImage: OG_IMAGE,
    type: 'article',
    structuredData: structuredDataByRoute['/partnership'],
  },
  '/sales-experience': {
    title: 'The 8-Week Sales Management Experience | The Standard Playbook',
    description: 'In eight weeks, your sales manager and team author the sales process, numbers, and consequences your agency runs on. Written, signed, and operating.',
    keywords: ['sales management training', 'insurance sales training', 'revenue optimization', 'sales systems', 'sales team development', 'sales accountability'],
    ogImage: 'https://standardplaybook.com/og/sales-experience-v2.png',
    canonical: 'https://standardplaybook.com/sales-experience',
    type: 'article',
    structuredData: structuredDataByRoute['/sales-experience'],
  },
  '/salesprocess': {
    title: 'Agency Sales Process | The Standard Playbook',
    description: 'Install the sales process in the brain of your business: the process your team runs, the daily metrics they own, and the consequence ladder that protects the standard.',
    keywords: ['agency sales process', 'insurance sales framework', 'producer activity metrics', 'sales accountability', 'insurance agency sales training'],
    ogImage: 'https://standardplaybook.com/og/sales-process.png',
    canonical: 'https://standardplaybook.com/salesprocess',
    type: 'article',
  },
  '/callscoring': {
    title: 'Standard Call Scoring: AI-Powered Call Evaluation for Sales Teams | The Standard Playbook',
    description: 'AI-powered call scoring that transforms sales coaching in minutes. Instant insights, consistent feedback, and accelerated team performance for insurance agencies. $299-499/month.',
    keywords: ['call scoring', 'AI call analysis', 'sales coaching', 'call evaluation', 'sales training', 'call grading', 'insurance call scoring'],
    ogImage: OG_IMAGE,
    type: 'article',
    structuredData: structuredDataByRoute['/callscoring'],
  },
  '/calls': {
    title: 'The Standard Cadence | Recurring Calls',
    description: 'Register once for every recurring Standard Playbook session: Boardroom, AgencyBrain, AI, and your private working rooms.',
    keywords: ['Standard Playbook calls', 'Boardroom calls', 'AgencyBrain calls', 'AI training calls', 'recurring coaching calls'],
    ogImage: 'https://standardplaybook.com/og/calls.png',
    canonical: 'https://standardplaybook.com/calls',
    type: 'website',
  },
  '/app': {
    title: 'The Standard Playbook App',
    description: 'Turn quarterly goals into daily action across Body, Being, Balance, and Business.',
    keywords: ['Standard Playbook app', 'Core 4', 'quarterly goals', 'daily action', 'member app'],
    ogImage: 'https://standardplaybook.com/og/app.png',
    canonical: 'https://standardplaybook.com/app',
    type: 'website',
    noindex: true,
  },
  '/thetool': {
    title: 'The Standard Playbook App | Turn Quarterly Goals Into Daily Action',
    description: 'See how the Standard Playbook app connects quarterly targets, monthly missions, weekly priorities, daily Core 4 actions, guided Flows, reflection, and weekly Debriefs.',
    keywords: ['Standard Playbook app', 'daily goal tracker', 'quarterly planning app', 'weekly planning system', 'Core 4', 'personal operating system'],
    ogImage: 'https://standardplaybook.com/og/thetool.png',
    canonical: 'https://standardplaybook.com/thetool',
    type: 'website',
  },
  '/about': {
    title: 'About The Standard Playbook: Coaching for Insurance Agency Growth | Fort Wayne, IN',
    description: 'Learn about The Standard Playbook: our mission to elevate entrepreneurship through world-class coaching, proven systems, and elite community.',
    keywords: ['about standard playbook', 'coaching philosophy', 'insurance coaching team', 'Fort Wayne business coaching', 'agency growth coaching'],
    ogImage: OG_IMAGE,
    type: 'article',
    structuredData: structuredDataByRoute['/about'],
  },
  '/contact': {
    title: 'Contact The Standard Playbook | Insurance Agency Coaching',
    description: 'Book a call with The Standard Playbook. Coaching programs for insurance agency owners who are done with average.',
    keywords: ['contact standard playbook', 'business coaching Fort Wayne', 'coaching consultation', 'insurance coaching contact'],
    ogImage: OG_IMAGE,
    type: 'article',
    structuredData: structuredDataByRoute['/contact'],
  },
  '/decision': {
    title: 'Find Your Program: Personalized Coaching Recommendation | The Standard Playbook',
    description: 'Tell us your situation and goals. Get a personalized recommendation for the right Standard Playbook coaching program, from masterminds to 1:1 coaching to producer training.',
    keywords: ['coaching assessment', 'find coaching program', 'personalized recommendation', 'insurance coaching quiz'],
    ogImage: OG_IMAGE,
    type: 'article',
    structuredData: structuredDataByRoute['/decision'],
  },
  '/privacy': {
    title: 'Privacy Policy | The Standard Playbook',
    description: 'Privacy policy for The Standard Playbook (Standard Playbook INC DBA Agency Brain). Learn how we protect and use your personal information.',
    keywords: ['privacy policy', 'data protection', 'user privacy'],
    ogImage: OG_IMAGE,
    type: 'article',
    structuredData: structuredDataByRoute['/privacy'],
  },
  '/terms': {
    title: 'Terms of Service | The Standard Playbook',
    description: 'Terms of service for The Standard Playbook coaching services and platform. Review our service agreement, policies, and usage terms.',
    keywords: ['terms of service', 'legal terms', 'service agreement'],
    ogImage: OG_IMAGE,
    type: 'article',
    structuredData: structuredDataByRoute['/terms'],
  },
  '/the-challenge': {
    title: 'The 6 Week Producer Challenge | Insurance Producer Execution System | Standard Playbook',
    description: 'A 42-day execution system for one insurance producer. Daily modules, daily accountability, and a weekly Discovery Stack reported to the owner.',
    keywords: ['producer challenge', 'insurance producer training', 'producer accountability', 'sales producer development', 'agency coaching'],
    ogImage: OG_IMAGE,
    type: 'article',
    structuredData: structuredDataByRoute['/the-challenge'],
  },
  '/8-week-apply': {
    title: '8-Week Sales Management Experience | Apply Now | The Standard Playbook',
    description: 'Stop managing chaos. Start running a system. Book a 45-minute strategy call with Justin. Built for Allstate, Farmers, and State Farm agency owners.',
    keywords: ['sales management experience', 'agency coaching apply', 'strategy call', '8 week sales program'],
    ogImage: OG_IMAGE,
    type: 'article',
    noindex: true,
  },
  '/blog': {
    title: 'Blog | The Standard Playbook - Insurance Agency Insights',
    description: 'Insights, strategies, and coaching wisdom for insurance agency owners. From The Standard Playbook team.',
    keywords: ['insurance agency blog', 'agency coaching insights', 'insurance business tips', 'agency growth strategies'],
    ogImage: OG_IMAGE,
    type: 'website',
    structuredData: structuredDataByRoute['/blog'],
  },
};
