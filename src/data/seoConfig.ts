
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
    title: 'The Boardroom — Elite Mastermind for Insurance Agency Owners | The Standard Playbook',
    description: 'Join The Boardroom: an exclusive mastermind for insurance agency owners. $299/month for peer accountability, strategy sessions, and proven growth systems from $1M+ agency operators.',
    keywords: ['agency mastermind', 'insurance agency owners', 'business coaching group', 'scaling agencies', 'agency growth', 'mastermind group'],
    ogImage: OG_IMAGE,
    type: 'article',
    structuredData: structuredDataByRoute['/boardroom'],
  },
  '/directive': {
    title: 'The Directive — Intensive 1:1 Implementation Coaching | The Standard Playbook',
    description: 'Get intensive 1:1 coaching with direct access to Justin. Monthly private sessions, weekly check-ins, 100 AI-graded calls/month, and custom tech/AI strategy buildouts for your agency.',
    keywords: ['1:1 business coaching', 'intensive coaching', 'implementation coaching', 'agency consulting', 'AI call scoring', 'sales coaching'],
    ogImage: OG_IMAGE,
    type: 'article',
    structuredData: structuredDataByRoute['/directive'],
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
    title: '8-Week Sales Management Training — Master Revenue Generation | The Standard Playbook',
    description: 'Transform your agency sales management in 8 weeks. Dashboard analytics, training modules, sales process frameworks, accountability metrics, and consequence ladder systems.',
    keywords: ['sales management training', 'insurance sales training', 'revenue optimization', 'sales systems', 'sales team development', 'sales accountability'],
    ogImage: OG_IMAGE,
    type: 'article',
    structuredData: structuredDataByRoute['/sales-experience'],
  },
  '/producer-power-up': {
    title: 'Producer Power-Up — 6-Week Sales Transformation | The Standard Playbook',
    description: 'Transform your insurance producer from reactive chaos to systematic execution in 42 days. Daily modules, Core 4 tracking, weekly Discovery Stacks, and daily owner reports. $299/producer.',
    keywords: ['producer training', 'insurance producer development', 'sales transformation', 'Core 4 system', 'producer challenge', 'sales team training'],
    ogImage: OG_IMAGE,
    type: 'article',
    structuredData: structuredDataByRoute['/producer-power-up'],
  },
  '/owner-challenge': {
    title: 'Owner Challenge — 6-Week Core 4 & Leadership Transformation | The Standard Playbook',
    description: '6-week identity-driven leadership challenge for insurance agency owners. Core 4 habit system, micro-lessons, executive templates, and weekly reinforcement. $299.',
    keywords: ['agency owner challenge', 'leadership development', 'Core 4 system', 'identity transformation', 'agency leadership', 'owner coaching'],
    ogImage: OG_IMAGE,
    type: 'article',
    structuredData: structuredDataByRoute['/owner-challenge'],
  },
  '/callscoring': {
    title: 'Standard Call Scoring — AI-Powered Call Evaluation for Sales Teams | The Standard Playbook',
    description: 'AI-powered call scoring that transforms sales coaching in minutes. Instant insights, consistent feedback, and accelerated team performance for insurance agencies. $299-499/month.',
    keywords: ['call scoring', 'AI call analysis', 'sales coaching', 'call evaluation', 'sales training', 'call grading', 'insurance call scoring'],
    ogImage: OG_IMAGE,
    type: 'article',
    structuredData: structuredDataByRoute['/callscoring'],
  },
  '/app': {
    title: 'The Standard Playbook App — Sales Training & Accountability Platform',
    description: 'Access The Standard Playbook training platform: The Armory (30 modules), Core 4 Tracker, 19 Stacking frameworks, call scoring, role-play practice, and performance analytics.',
    keywords: ['coaching app', 'sales training app', 'accountability platform', 'Core 4 tracker', 'business coaching tools'],
    ogImage: OG_IMAGE,
    type: 'article',
    structuredData: structuredDataByRoute['/app'],
  },
  '/appinfo': {
    title: 'App Access — Standard Playbook Training Platform',
    description: 'Access the Standard Playbook training and coaching app. Sales training modules, habit tracking, and performance tools for insurance producers and agency owners.',
    keywords: ['app access', 'coaching platform', 'training modules'],
    ogImage: OG_IMAGE,
    type: 'article',
  },
  '/about': {
    title: 'About The Standard Playbook — Coaching for Insurance Agency Growth | Fort Wayne, IN',
    description: 'Learn about The Standard Playbook: our mission to elevate entrepreneurship through world-class coaching, proven systems, and elite community. 500+ entrepreneurs coached, $500M+ revenue generated.',
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
    title: 'Find Your Program — Personalized Coaching Recommendation | The Standard Playbook',
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
    title: 'The Owner Challenge | 6-Week Insurance Agency Intensive | Standard Playbook',
    description: '6-week intensive for insurance agency owners. Daily accountability, real systems, measurable results. Limited spots.',
    keywords: ['owner challenge', 'insurance agency intensive', '6-week challenge', 'agency accountability', 'agency coaching'],
    ogImage: OG_IMAGE,
    type: 'article',
    structuredData: structuredDataByRoute['/the-challenge'],
  },
  '/formulaai': {
    title: 'Formula AI — Insurance Agency AI Tools | The Standard Playbook',
    description: 'AI-powered tools and prompts for insurance agencies. Leverage artificial intelligence to streamline operations and boost productivity.',
    keywords: ['insurance AI', 'agency AI tools', 'insurance automation'],
    ogImage: OG_IMAGE,
    type: 'article',
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
