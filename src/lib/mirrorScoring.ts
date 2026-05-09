import {
  MIRROR_QUESTIONS,
  PILLAR_LABELS,
  PILLAR_MAX,
  PILLAR_ORDER,
  type PillarKey,
} from '@/data/mirrorQuestions';
import { tierFromScore, type Tier } from '@/data/mirrorDiagnostics';

export type QuestionScores = Record<string, number>;
export type PillarScores = Record<PillarKey, number>;

export interface ScoringResult {
  totalScore: number;
  tier: Tier;
  pillarScores: PillarScores;
  /** Pillar with the lowest fraction of its max. */
  weakestPillar: PillarKey;
  weakestPillarLabel: string;
}

const emptyPillarScores = (): PillarScores => ({
  culture_team: 0,
  systems_rhythm: 0,
  training_scripts: 0,
  marketing_lead_flow: 0,
  owner_command: 0,
});

export const scoreAssessment = (answers: QuestionScores): ScoringResult => {
  const pillarScores = emptyPillarScores();
  let total = 0;

  for (const q of MIRROR_QUESTIONS) {
    const v = answers[q.id] ?? 0;
    total += v;
    pillarScores[q.pillar] += v;
  }

  // Weakest pillar = lowest fraction of max. Tie-breaker: pillar order from spec.
  let weakest: PillarKey = PILLAR_ORDER[0];
  let weakestFrac = Infinity;
  for (const key of PILLAR_ORDER) {
    const frac = pillarScores[key] / PILLAR_MAX[key];
    if (frac < weakestFrac) {
      weakestFrac = frac;
      weakest = key;
    }
  }

  return {
    totalScore: total,
    tier: tierFromScore(total),
    pillarScores,
    weakestPillar: weakest,
    weakestPillarLabel: PILLAR_LABELS[weakest],
  };
};

/**
 * Tier × weakest-pillar routing for the results page CTA + Brevo tag.
 * Mirrors the table in docs/mirror/page-spec.md.
 */
export interface TierRoute {
  ctaLabel: string;
  ctaHref: string;
  ctaKind: 'external' | 'internal';
  brevoTag: string;
}

const ACUITY = 'https://AGENCYCOACHING.as.me/standardfit';
const BOARDROOM_HREF = '/boardroom';
const EIGHTWEEK_HREF = '/8-week-apply';
const DIRECTIVE_HREF = '/directive';

export const routeForResult = (tier: Tier, weakest: PillarKey): TierRoute => {
  // Pillars 2 + 3 (systems_rhythm, training_scripts) are the "deeper coaching" pillars.
  const isP2or3 = weakest === 'systems_rhythm' || weakest === 'training_scripts';

  if (tier === 'foundation') {
    return {
      ctaLabel: 'Book a 15-min conversation',
      ctaHref: ACUITY,
      ctaKind: 'external',
      brevoTag: `tier:foundation+pillar:${weakest}`,
    };
  }
  if (tier === 'developing') {
    if (isP2or3) {
      return {
        ctaLabel: 'Book a 15-min conversation',
        ctaHref: ACUITY,
        ctaKind: 'external',
        brevoTag: `tier:developing+pillar:${weakest}`,
      };
    }
    return {
      ctaLabel: 'Join the Boardroom',
      ctaHref: BOARDROOM_HREF,
      ctaKind: 'internal',
      brevoTag: `tier:developing+pillar:${weakest}`,
    };
  }
  if (tier === 'established') {
    if (isP2or3) {
      return {
        ctaLabel: 'Apply for 8-Week',
        ctaHref: EIGHTWEEK_HREF,
        ctaKind: 'internal',
        brevoTag: `tier:established+pillar:${weakest}`,
      };
    }
    return {
      ctaLabel: 'Join the Boardroom',
      ctaHref: BOARDROOM_HREF,
      ctaKind: 'internal',
      brevoTag: `tier:established+pillar:${weakest}`,
    };
  }
  if (tier === 'advanced') {
    return {
      ctaLabel: 'Apply for The Directive',
      ctaHref: DIRECTIVE_HREF,
      ctaKind: 'internal',
      brevoTag: `tier:advanced+pillar:${weakest}`,
    };
  }
  // elite — Partnership currently sold out, route to Directive per the brief.
  return {
    ctaLabel: 'Apply for The Directive',
    ctaHref: DIRECTIVE_HREF,
    ctaKind: 'internal',
    brevoTag: `tier:elite+pillar:${weakest}`,
  };
};

/** Single-word page-closer per tier route (matches Bold pattern). */
export const closerWordFor = (tier: Tier, weakest: PillarKey): string => {
  if (tier === 'foundation') return 'BOOK.';
  if (tier === 'developing') {
    return weakest === 'systems_rhythm' || weakest === 'training_scripts' ? 'BOOK.' : 'JOIN.';
  }
  if (tier === 'established') {
    return weakest === 'systems_rhythm' || weakest === 'training_scripts' ? 'APPLY.' : 'JOIN.';
  }
  return 'APPLY.';
};
