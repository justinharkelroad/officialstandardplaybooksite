import type { MirrorTier, MirrorTierSequenceEntry } from "./_shared.ts";
import { sequence as foundation } from "./foundation.ts";
import { sequence as developing } from "./developing.ts";
import { sequence as established } from "./established.ts";
import { sequence as advanced } from "./advanced.ts";
import { sequence as elite } from "./elite.ts";

const SEQUENCES: Record<MirrorTier, MirrorTierSequenceEntry[]> = {
  foundation,
  developing,
  established,
  advanced,
  elite,
};

export function sequenceForTier(tier: MirrorTier): MirrorTierSequenceEntry[] {
  return SEQUENCES[tier] ?? [];
}
