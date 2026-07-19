export interface DeclaredFlowAction {
  index: number;
  originalText: string;
  refinedText: string;
  finalText: string;
  addedToWeeklyPlaybook: boolean | null;
}

type DeclaredFlowActionField =
  | "original"
  | "refined"
  | "final"
  | "added_to_weekly_playbook";

const DECLARED_ACTION_PREFIX = "__declared_action_";
const DECLARED_ACTION_PATTERN =
  /^__declared_action_(\d+)_(original|refined|final|added_to_weekly_playbook)$/;

export function getDeclaredFlowActionKey(
  index: number,
  field: DeclaredFlowActionField,
): string {
  return `${DECLARED_ACTION_PREFIX}${index}_${field}`;
}

export function parseDeclaredFlowActions(
  responses: Record<string, string> | null | undefined,
): DeclaredFlowAction[] {
  if (!responses) return [];

  const actionMap = new Map<number, Partial<DeclaredFlowAction>>();

  for (const [key, value] of Object.entries(responses)) {
    const match = key.match(DECLARED_ACTION_PATTERN);
    if (!match) continue;

    const index = Number(match[1]);
    const field = match[2] as DeclaredFlowActionField;
    const existing = actionMap.get(index) ?? { index };

    if (field === "original") existing.originalText = value;
    if (field === "refined") existing.refinedText = value;
    if (field === "final") existing.finalText = value;
    if (field === "added_to_weekly_playbook") {
      existing.addedToWeeklyPlaybook =
        value === "true" ? true : value === "false" ? false : null;
    }

    actionMap.set(index, existing);
  }

  const parsed = Array.from(actionMap.values())
    .filter(
      (item): item is DeclaredFlowAction =>
        typeof item.index === "number" &&
        typeof item.originalText === "string" &&
        typeof item.refinedText === "string" &&
        typeof item.finalText === "string",
    )
    .sort((a, b) => a.index - b.index);

  if (parsed.length > 0) {
    return parsed;
  }

  const fallbackAction = responses.actions?.trim();
  if (!fallbackAction) return [];

  return [
    {
      index: 1,
      originalText: fallbackAction,
      refinedText: fallbackAction,
      finalText: fallbackAction,
      addedToWeeklyPlaybook: null,
    },
  ];
}

export function parseExplicitDeclaredFlowActions(
  responses: Record<string, string> | null | undefined,
): DeclaredFlowAction[] {
  if (!responses || !Object.keys(responses).some((key) => DECLARED_ACTION_PATTERN.test(key))) return [];
  return parseDeclaredFlowActions(responses);
}
