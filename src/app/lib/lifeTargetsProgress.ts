const DAILY_PROOF_DOMAINS = ['body', 'being', 'balance', 'business'] as const;

type DailyProofDomain = (typeof DAILY_PROOF_DOMAINS)[number];

export type DailyProofProgressInput = {
  daily_proof_reviewed_at?: string | null;
} & Partial<Record<`${DailyProofDomain}_daily_actions`, unknown>>;

export interface DailyProofProgress {
  completed: boolean;
  selectedDomainCount: number;
}

export function getDailyProofProgress(
  targets: DailyProofProgressInput | null | undefined,
): DailyProofProgress {
  if (!targets) {
    return { completed: false, selectedDomainCount: 0 };
  }

  const selectedDomainCount = DAILY_PROOF_DOMAINS.filter((domain) => {
    const actions = targets[`${domain}_daily_actions`];
    return Array.isArray(actions) && actions.length > 0;
  }).length;

  return {
    completed: selectedDomainCount > 0 || Boolean(targets.daily_proof_reviewed_at),
    selectedDomainCount,
  };
}
