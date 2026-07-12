// Theta audio validators + ownership helpers — ported to the Standard
// Playbook member app. Single-actor model: theta rows belong to the member
// (user_id). The source's staff/agency actor plumbing is removed.

export const THETA_CATEGORIES = ["body", "being", "balance", "business"] as const;
export const THETA_TONES = ["inspiring", "motivational", "calm", "energizing"] as const;
export const MAX_THETA_TARGET_LENGTH = 500;
export const MAX_THETA_AFFIRMATION_LENGTH = 300;

export type ThetaCategory = typeof THETA_CATEGORIES[number];
export type ThetaTone = typeof THETA_TONES[number];
export type ThetaTargets = Record<ThetaCategory, string>;
export type ThetaAffirmations = Record<ThetaCategory, string[]>;

type ValidationResult<T> =
  | { ok: true; value: T }
  | { ok: false; error: string };

export type ThetaOwnedRow = {
  user_id: string | null;
};

export type ThetaAffirmationRow = ThetaOwnedRow & {
  target_id: string;
  category: string;
  text: string;
  order_index: number;
};

export function thetaActorColumns(userId: string): { user_id: string } {
  return { user_id: userId };
}

export function thetaRowBelongsToActor(
  row: ThetaOwnedRow,
  userId: string,
): boolean {
  return Boolean(userId && row.user_id === userId);
}

export function validateThetaSessionId(value: unknown): ValidationResult<string> {
  if (typeof value !== "string" || value.trim().length < 12 || value.length > 160) {
    return { ok: false, error: "A valid audio session is required." };
  }
  return { ok: true, value: value.trim() };
}

export function validateThetaTargets(value: unknown): ValidationResult<ThetaTargets> {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return { ok: false, error: "Targets are required." };
  }

  const source = value as Record<string, unknown>;
  const targets = {} as ThetaTargets;
  let populated = 0;

  for (const category of THETA_CATEGORIES) {
    const raw = source[category];
    if (raw !== undefined && typeof raw !== "string") {
      return { ok: false, error: `${category} target must be text.` };
    }
    const target = typeof raw === "string" ? raw.trim() : "";
    if (target.length > MAX_THETA_TARGET_LENGTH) {
      return {
        ok: false,
        error: `${category} target exceeds ${MAX_THETA_TARGET_LENGTH} characters.`,
      };
    }
    if (target) populated += 1;
    targets[category] = target;
  }

  if (populated < 1) {
    return { ok: false, error: "Enter a target for at least one Core Four area." };
  }

  return { ok: true, value: targets };
}

export function validateThetaTone(value: unknown): ValidationResult<ThetaTone> {
  if (typeof value !== "string" || !THETA_TONES.includes(value as ThetaTone)) {
    return { ok: false, error: "Invalid affirmation tone." };
  }
  return { ok: true, value: value as ThetaTone };
}

export function validateThetaAffirmations(
  value: unknown,
): ValidationResult<ThetaAffirmations> {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return { ok: false, error: "Affirmations are required." };
  }

  const source = value as Record<string, unknown>;
  const affirmations = {} as ThetaAffirmations;

  for (const category of THETA_CATEGORIES) {
    const rows = source[category];
    if (!Array.isArray(rows) || rows.length !== 5) {
      return { ok: false, error: `${category} must contain exactly 5 affirmations.` };
    }

    const normalized: string[] = [];
    for (const row of rows) {
      if (typeof row !== "string" || row.trim().length === 0) {
        return { ok: false, error: `${category} contains an empty affirmation.` };
      }
      const text = row.trim();
      if (text.length > MAX_THETA_AFFIRMATION_LENGTH) {
        return {
          ok: false,
          error: `${category} affirmation exceeds ${MAX_THETA_AFFIRMATION_LENGTH} characters.`,
        };
      }
      normalized.push(text);
    }
    affirmations[category] = normalized;
  }

  return { ok: true, value: affirmations };
}

export function resolveSavedThetaAffirmations(
  rows: ThetaAffirmationRow[],
  targetId: string,
  userId: string,
): ValidationResult<ThetaAffirmations> {
  const grouped: ThetaAffirmations = { body: [], being: [], balance: [], business: [] };
  const seen = new Set<string>();

  for (const row of rows) {
    if (!thetaRowBelongsToActor(row, userId) || row.target_id !== targetId) {
      return { ok: false, error: "Saved affirmations do not belong to this audio session." };
    }
    if (!THETA_CATEGORIES.includes(row.category as ThetaCategory)) {
      return { ok: false, error: "Saved affirmations contain an invalid category." };
    }
    if (!Number.isInteger(row.order_index) || row.order_index < 0 || row.order_index > 4) {
      return { ok: false, error: "Saved affirmations contain an invalid order." };
    }
    const key = `${row.category}:${row.order_index}`;
    if (seen.has(key)) {
      return { ok: false, error: "Saved affirmations contain duplicate positions." };
    }
    seen.add(key);
    grouped[row.category as ThetaCategory][row.order_index] = row.text;
  }

  return validateThetaAffirmations(grouped);
}
