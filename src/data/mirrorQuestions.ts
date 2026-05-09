/**
 * The Mirror — 32 subcategory questions, ordered by pillar.
 * Source: docs/mirror/ui-openers.md
 */

export type PillarKey =
  | 'culture_team'
  | 'systems_rhythm'
  | 'training_scripts'
  | 'marketing_lead_flow'
  | 'owner_command';

export interface MirrorQuestion {
  /** 1-based question number across the whole assessment (1..32). */
  num: number;
  /** Stable id used as the key in question_scores. */
  id: string;
  pillar: PillarKey;
  pillarLabel: string;
  pillarNumber: 1 | 2 | 3 | 4 | 5;
  /** Subcategory name (Anton large all-caps). */
  subcategory: string;
  /** Declarative opener (Inter italic mid). */
  opener: string;
}

export const PILLAR_LABELS: Record<PillarKey, string> = {
  culture_team: 'Culture & Team',
  systems_rhythm: 'Systems & Rhythm',
  training_scripts: 'Training & Scripts',
  marketing_lead_flow: 'Marketing & Lead Flow',
  owner_command: 'Owner Command',
};

export const PILLAR_MAX: Record<PillarKey, number> = {
  culture_team: 50,
  systems_rhythm: 30,
  training_scripts: 30,
  marketing_lead_flow: 30,
  owner_command: 20,
};

export const PILLAR_ORDER: PillarKey[] = [
  'culture_team',
  'systems_rhythm',
  'training_scripts',
  'marketing_lead_flow',
  'owner_command',
];

export const TOTAL_QUESTIONS = 32;

export const STANDARDIZED_PROMPT = 'Rate your agency on this standard:';
export const DISCIPLINE_REMINDER = "if tempted to give a 4 because you're “almost there” — it's a 3";
export const ANCHOR_LOW = "We don't have this";
export const ANCHOR_HIGH = 'Dialed in';

const p = (
  num: number,
  id: string,
  pillar: PillarKey,
  pillarNumber: MirrorQuestion['pillarNumber'],
  subcategory: string,
  opener: string,
): MirrorQuestion => ({
  num,
  id,
  pillar,
  pillarLabel: PILLAR_LABELS[pillar],
  pillarNumber,
  subcategory,
  opener,
});

export const MIRROR_QUESTIONS: MirrorQuestion[] = [
  // PILLAR 1 — CULTURE & TEAM (10)
  p(1, 'core_values', 'culture_team', 1, 'Core Values',
    "Core values aren’t a poster on the wall — they’re the filter for every hire, every fire, every hard call."),
  p(2, 'role_specialization', 'culture_team', 1, 'Role Specialization',
    'When producers split time between sales and service, neither gets the attention it deserves.'),
  p(3, 'sales', 'culture_team', 1, 'Sales',
    'A sales producer’s job is new business — 5+ quoted households a day, closing. Period.'),
  p(4, 'service', 'culture_team', 1, 'Service',
    'Service is the engine of retention — protecting the book, handling claims fast, and surfacing cross-sell from a relationship standpoint.'),
  p(5, 'hybrid', 'culture_team', 1, 'Hybrid',
    'A hybrid role with no structure is just chaos with a title.'),
  p(6, 'sdr_telemarketer', 'culture_team', 1, 'SDR / Telemarketer',
    'Your best closer shouldn’t be cold-calling.'),
  p(7, 'onboarding', 'culture_team', 1, 'Onboarding',
    'The sale isn’t the finish line — it’s the starting line.'),
  p(8, 'management', 'culture_team', 1, 'Management',
    'Somebody has to hold the standard when you’re not in the room.'),
  p(9, 'always_be_recruiting', 'culture_team', 1, 'Always Be Recruiting',
    'The worst time to recruit is when you’re desperate.'),
  p(10, 'recognition', 'culture_team', 1, 'Recognition',
    'People repeat what gets recognized — but only when the criteria are clear, earned, and consistent.'),

  // PILLAR 2 — SYSTEMS & RHYTHM (6)
  p(11, 'accountability', 'systems_rhythm', 2, 'Accountability',
    'When accountability lives in the team — not just the owner — you stop being the enforcer.'),
  p(12, 'scoreboard', 'systems_rhythm', 2, 'Scoreboard',
    'You can’t be engaged in a goal you can’t see.'),
  p(13, 'call_reports', 'systems_rhythm', 2, 'Call Reports',
    'A call report answers the question: what did my sales team actually do all day?'),
  p(14, 'morning_huddle', 'systems_rhythm', 2, 'Morning Huddle',
    'The morning huddle sets the tone — every team member reports yesterday, declares today’s goal, and trains together.'),
  p(15, 'weekly_1on1s', 'systems_rhythm', 2, 'Weekly 1:1s',
    'The weekly 1:1 is where you find out what’s really going on.'),
  p(16, 'monthly_recap', 'systems_rhythm', 2, 'Monthly Recap Meeting',
    'Without a monthly recap, your agency runs on disconnected weeks instead of measured momentum.'),

  // PILLAR 3 — TRAINING & SCRIPTS (6)
  p(17, 'sales_agent_playbook', 'training_scripts', 3, 'Sales Agent Playbook',
    'Without a playbook, every producer runs their own version of the job — and you can’t coach what isn’t standardized.'),
  p(18, 'training_video_vault', 'training_scripts', 3, 'Training Video Vault',
    'When a new hire asks “how do I do this?” — the answer should be “watch the video.”'),
  p(19, 'new_hire_training', 'training_scripts', 3, 'New Hire Training',
    'Goal: get a new sales producer to write their first sale within their first full month.'),
  p(20, 'ongoing_training', 'training_scripts', 3, 'Ongoing Training',
    'Training isn’t a one-time event — it’s a weekly discipline.'),
  p(21, 'scoring_calls', 'training_scripts', 3, 'Scoring Calls',
    'Call scoring is how you know if your training is sticking.'),
  p(22, 'sales_service_scripts', 'training_scripts', 3, 'Sales & Service Scripts',
    'Scripts aren’t training wheels — they’re guardrails.'),

  // PILLAR 4 — MARKETING & LEAD FLOW (6)
  p(23, 'crm', 'marketing_lead_flow', 4, 'CRM',
    'A CRM only works if your team uses it.'),
  p(24, 'phone_system', 'marketing_lead_flow', 4, 'Phone System',
    'If your team is manually dialing and flying blind on call quality, you’re leaving production on the table.'),
  p(25, 'agency_communication', 'marketing_lead_flow', 4, 'Agency Communication Platform',
    'Internal email chains are where information goes to die.'),
  p(26, 'marketing_plan', 'marketing_lead_flow', 4, 'Marketing Plan',
    'A marketing plan has one job: put enough leads in front of your producers to hit their number.'),
  p(27, 'ai_email_system', 'marketing_lead_flow', 4, 'AI-Powered Email System',
    'Speed to response is speed to close — every new lead, automated, 5+ days, no exceptions.'),
  p(28, 'lead_distribution', 'marketing_lead_flow', 4, 'Lead Distribution',
    'Stop assigning leads automatically.'),

  // PILLAR 5 — OWNER COMMAND (4)
  p(29, 'new_sale_review', 'owner_command', 5, 'New Sale Review',
    'No review, no credit — every new policy gets checked before commission counts.'),
  p(30, 'marketing_reporting', 'owner_command', 5, 'Marketing Reporting',
    'If you can’t compare lead vendors side by side on real numbers, you’re guessing which marketing is working.'),
  p(31, 'commissions_reporting', 'owner_command', 5, 'Commissions Reporting',
    'Commissions should reflect reality, not optimism.'),
  p(32, 'cancellations_reporting', 'owner_command', 5, 'Cancellations Reporting',
    'Every cancellation is a data point.'),
];
