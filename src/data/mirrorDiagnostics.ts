/**
 * The Mirror — 25 diagnostic cells (5 tiers × 5 pillars).
 * Source: docs/mirror/diagnostic-matrix.md
 */

import type { PillarKey } from './mirrorQuestions';

export type Tier = 'foundation' | 'developing' | 'established' | 'advanced' | 'elite';

export const TIER_LABELS: Record<Tier, string> = {
  foundation: 'Foundation',
  developing: 'Developing',
  established: 'Established',
  advanced: 'Advanced',
  elite: 'Elite',
};

export const TIER_BRACKETS: Record<Tier, [number, number]> = {
  foundation: [32, 64],
  developing: [65, 94],
  established: [95, 119],
  advanced: [120, 144],
  elite: [145, 160],
};

export const tierFromScore = (score: number): Tier => {
  if (score >= 145) return 'elite';
  if (score >= 120) return 'advanced';
  if (score >= 95) return 'established';
  if (score >= 65) return 'developing';
  return 'foundation';
};

export const DIAGNOSTIC_MATRIX: Record<Tier, Record<PillarKey, string>> = {
  foundation: {
    culture_team:
      "You don’t have a team — you have helpers. Every standard in your agency rises and falls with you being in the room, which means there is no agency without you. The first move isn’t a system or a script. It’s defining one specific seat, hiring for it, and refusing to do that work yourself anymore.",
    systems_rhythm:
      "You’re firefighting because you have no system to hold the line for you. No morning huddle, no scoreboard, no 1:1s — just you reacting to whatever blows up that day. Pick one rhythm and install it this week. The morning huddle is the cheapest, fastest way to turn chaos into a calendar.",
    training_scripts:
      "Your team is making it up every day because there’s no playbook to make it up FROM. No scripts, no scoring, no video walkthroughs — every new hire is a six-month nightmare and every old hire runs their own version. Build the playbook this quarter. Even a rough version is infinitely better than nothing.",
    marketing_lead_flow:
      "Your producers might be good, but they’re not getting enough at-bats. No CRM, no marketing plan tied to numbers, no idea which dollar is actually working. Install the CRM. Track every lead source by cost-per-sale. You can’t fix what you can’t measure, and right now the whole front of your business is invisible.",
    owner_command:
      "Your agency runs on optimism because you have no real visibility. No commission verification, no cancellation tracking, no marketing ROI report. You’re making decisions on memory and gut, and the carrier statements rarely match what you think happened. Install the basic reporting cadence this month. You can’t lead what you can’t see.",
  },
  developing: {
    culture_team:
      "You’ve built systems your people can’t run yet. The producer who’s also doing service isn’t a producer. The service person who’s also taking payments isn’t a service person. Specialization isn’t a luxury — it’s the unlock that makes everything else you’ve built actually work, and right now your team is the reason your numbers cap out where they do.",
    systems_rhythm:
      "You have pieces of a rhythm, but you’re still the engine. The huddle happens when you’re there. The 1:1 happens when you remember it. Your team waits for your energy to perform — which means the agency caps at your bandwidth. Codify the cadence so it runs whether you’re in the room or not.",
    training_scripts:
      "You have training materials, but nobody references them. Scripts might exist somewhere — but no one’s been scored on a call in months. Your team is performing on personality, not process. Install the scoring loop and the weekly training rhythm; that’s where training actually starts to stick.",
    marketing_lead_flow:
      "You’re spending on marketing without knowing what’s working. Some leads convert, others don’t, and you’re guessing which channel is the keeper. Build the comparison chart — every vendor side by side, real numbers. The agencies that scale are the ones that stop guessing about the front of the funnel.",
    owner_command:
      "You see some of it. You don’t see all of it. You probably react to cancellations instead of tracking patterns. You probably check commissions when something feels off, not on a schedule. The data exists — you’re just not in the seat reviewing it. Build the review rhythm, and the rest of your agency starts running cleaner overnight.",
  },
  established: {
    culture_team:
      "Your foundation is built. What you don’t have is a team that wants to stay. A-players leave when there’s no recognition rhythm, no real management layer, and no clear path forward — and you’re paying full training cost on people who’ll be gone in 18 months. You can keep replacing them, or you can build the conditions that make A-players want to plant flags.",
    systems_rhythm:
      "The structure is built. The discipline isn’t. You have huddles but no scoreboard, or 1:1s but no monthly recap — somewhere in your rhythm there’s a leak you’ve stopped noticing. Find the missing loop and close it. The agency doesn’t need a new system; it needs the existing one to actually run.",
    training_scripts:
      "The materials are built. The accountability loop isn’t. You can have the best playbook in the market and it won’t matter if no one’s scoring calls against it. Scoring calls is the unlock — it’s the difference between training your team had and training your team uses.",
    marketing_lead_flow:
      "Your marketing flow exists, but it’s leaking at the back end. Leads come in, sit in an inbox, get assigned by round-robin, and die in follow-up. Speed to response is speed to close. Install the automation layer and let your producers fight for the leads they actually quote — not the ones they’re handed in turn.",
    owner_command:
      "The reports exist. The discipline of reviewing them doesn’t. You can have every report your CRM can generate and it won’t matter if no one looks at them on a schedule. Pick a weekly hour, sit in the dashboard, make the calls the data is already telling you to make.",
  },
  advanced: {
    culture_team:
      "You’ve built something most agencies don’t. The team that got you here isn’t the team that takes you to the next level, and you’re starting to feel it in the friction. Hire ahead of the gap, build a real management bench, and raise the standard before the next growth spurt exposes the cracks you’re already noticing.",
    systems_rhythm:
      "Your rhythm built the agency you have. The same rhythm at this scale is loosening, and you’re starting to see variance you didn’t see at lower volume. Tighten the cadence back to where it was when you were hungry. At this level, rhythm isn’t maintenance — it’s the multiplier.",
    training_scripts:
      "Your playbook built this agency. It’s also slowly getting stale while the market moves around it. Ongoing training isn’t optional at this tier — it’s how you keep the standard from quietly becoming yesterday’s standard. Refresh the scripts, reset the scoring rubric, train weekly.",
    marketing_lead_flow:
      "You have marketing that works. The risk is over-reliance on the channels that built you. One algorithm change, one vendor shift, and your lead flow softens overnight. Diversify the sources, automate the follow-up, and stop letting your top channels dictate your growth ceiling.",
    owner_command:
      "Your reporting is solid. You’re the bottleneck for it. Every decision waits for you to look at the numbers, which means the agency moves at owner speed. Train a second set of eyes — someone who reviews the data and brings you the patterns, not the spreadsheets. That’s how owner command stops being owner labor.",
  },
  elite: {
    culture_team:
      "You’re operating at the standard. At this level, your team is the one variable without a fixed ceiling — one B-player on an A-team compounds in the wrong direction faster than at any other tier. Recognition rhythm and the management layer are full-time work now. Protecting the standard is the standard.",
    systems_rhythm:
      "You’re operating at the standard, and your rhythm is the reason. The danger at this tier isn’t broken rhythm — it’s assumed rhythm. The owner who built it is also the one most likely to bend it for “good reasons.” Protect the discipline from yourself.",
    training_scripts:
      "You’re operating at the standard. The risk at this tier isn’t that your training is bad — it’s that it’s been good for so long you’ve stopped evolving it. The agencies that stay at the top are the ones that keep updating their definition of “dialed in.” Don’t outsource that work to anyone but yourself.",
    marketing_lead_flow:
      "You’re operating at the standard. The marketing engine works — which means the next move isn’t fixing it, it’s testing what’s beyond it. New channels, tighter attribution, AI-driven nurture. At this tier, the question isn’t “is the funnel full” — it’s “is it future-proof.”",
    owner_command:
      "You’re operating at the standard. The dashboards work. The risk at this tier is missing one quiet metric — a cancellation pattern, a commission anomaly, a marketing source that’s softening. Tighten the precision on the reports you already trust. The next move isn’t more data; it’s sharper review.",
  },
};
