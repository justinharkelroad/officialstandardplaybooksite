import { stripFlowAnswerHtmlForPrompt } from '@/app/lib/flowPromptInterpolation';
import type { FlowCoachTurn, FlowQuestion } from '@/app/types/flows';

export interface FlowCoachRow {
  id: string;
  question_id: string;
  answer_excerpt: string | null;
  answer_hash: string | null;
  reflection: string;
  probe: string | null;
  probe_answer: string | null;
  resolution: string | null;
  memory_refs: unknown;
  created_at: string;
}

export interface FlowConversationTurn {
  questionId: string;
  prompt: string;
  memberAnswer: string;
  coach?: FlowCoachTurn;
}

function cleanOptionalText(value: unknown): string | null {
  return typeof value === 'string' && value.trim() ? value.trim() : null;
}

function normalizeMemoryRefs(value: unknown): FlowCoachTurn['memory_refs'] {
  if (!Array.isArray(value)) return [];

  const seen = new Set<string>();
  return value.flatMap((candidate) => {
    if (!candidate || typeof candidate !== 'object') return [];
    const raw = candidate as Record<string, unknown>;
    const id = cleanOptionalText(raw.id);
    if (!id || seen.has(id)) return [];
    seen.add(id);
    return [{
      id,
      flow_slug: cleanOptionalText(raw.flow_slug),
      session_title: cleanOptionalText(raw.session_title),
    }];
  });
}

export async function hashFlowAnswer(answer: string): Promise<string> {
  const bytes = new TextEncoder().encode(answer.trim());
  const digest = await crypto.subtle.digest('SHA-256', bytes);
  return [...new Uint8Array(digest)]
    .map((byte) => byte.toString(16).padStart(2, '0'))
    .join('');
}

function isQuestionVisible(question: FlowQuestion, responses: Record<string, string>): boolean {
  if (!question.show_if) return true;
  return responses[question.show_if.question_id] === question.show_if.equals;
}

/**
 * Selects the first current row for each official question. Callers must pass
 * rows newest-first. RLS remains the authorization boundary; this validator
 * then removes stale answers, hidden/orphaned questions, and legacy duplicates.
 */
export async function validateFlowCoachRows(
  rows: FlowCoachRow[],
  questions: FlowQuestion[],
  responses: Record<string, string>,
): Promise<Record<string, FlowCoachTurn>> {
  const questionsById = new Map(questions.map((question) => [question.id, question]));
  const currentHashes = new Map<string, Promise<string>>();
  const selected: Record<string, FlowCoachTurn> = {};

  for (const row of rows) {
    if (selected[row.question_id]) continue;
    const question = questionsById.get(row.question_id);
    const answer = responses[row.question_id]?.trim();
    const reflection = cleanOptionalText(row.reflection);
    if (!question || !answer || !reflection || !isQuestionVisible(question, responses)) continue;

    let isCurrent = false;
    if (row.answer_hash) {
      let digest = currentHashes.get(row.question_id);
      if (!digest) {
        digest = hashFlowAnswer(answer);
        currentHashes.set(row.question_id, digest);
      }
      isCurrent = (await digest) === row.answer_hash;
    } else if (row.answer_excerpt) {
      // Older rows may predate answer_hash. Exact excerpt equality is the only
      // safe fallback; rows without either currentness signal fail closed.
      isCurrent = row.answer_excerpt === answer.slice(0, 240);
    }
    if (!isCurrent) continue;

    const probe = cleanOptionalText(row.probe);
    const probeAnswer = cleanOptionalText(row.probe_answer);
    const hasCompleteFollowUp = Boolean(probe && probeAnswer);
    selected[row.question_id] = {
      reflection,
      probe: hasCompleteFollowUp ? probe : null,
      probe_answer: hasCompleteFollowUp ? probeAnswer : null,
      resolution: hasCompleteFollowUp ? cleanOptionalText(row.resolution) : null,
      memory_refs: normalizeMemoryRefs(row.memory_refs),
    };
  }

  return selected;
}

export function resolveFlowConversationPrompt(
  prompt: string,
  questions: FlowQuestion[],
  responses: Record<string, string>,
): string {
  return prompt
    .replace(/\{([^}]+)\}/g, (match, rawKey) => {
      const key = rawKey.trim();
      const sourceQuestion = questions.find(
        (question) => question.interpolation_key === key || question.id === key,
      );
      if (!sourceQuestion) return match;
      const answer = responses[sourceQuestion.id]?.trim();
      return answer ? stripFlowAnswerHtmlForPrompt(answer) : '';
    })
    .replace(/[ \t]+([,.;:!?])/g, '$1')
    .replace(/[ \t]{2,}/g, ' ')
    .trim();
}

export function buildFlowConversation(
  questions: FlowQuestion[],
  responses: Record<string, string>,
  coachTurns: Record<string, FlowCoachTurn>,
): FlowConversationTurn[] {
  return questions.flatMap((question) => {
    const memberAnswer = responses[question.id]?.trim();
    if (!memberAnswer || !isQuestionVisible(question, responses)) return [];
    return [{
      questionId: question.id,
      prompt: resolveFlowConversationPrompt(question.prompt, questions, responses),
      memberAnswer,
      coach: coachTurns[question.id],
    }];
  });
}

export function flowRichTextToPlainText(value: string): string {
  if (!/<[a-z][\s\S]*>/i.test(value)) return value.trim();

  if (typeof DOMParser !== 'undefined') {
    const document = new DOMParser().parseFromString(value, 'text/html');
    document.querySelectorAll('br').forEach((element) => element.replaceWith('\n'));
    document.querySelectorAll('p,h1,h2,h3,h4,h5,h6,li,blockquote,tr').forEach((element) => {
      element.append('\n');
    });
    return (document.body.textContent ?? '').replace(/\n{3,}/g, '\n\n').trim();
  }

  return value
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/(p|h[1-6]|li|blockquote|tr)>/gi, '\n')
    .replace(/<[^>]*>/g, '')
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .replace(/&quot;/gi, '"')
    .replace(/&#(?:39|x27);/gi, "'")
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

export function formatPastFlowProvenance(memoryRefs: FlowCoachTurn['memory_refs']): string[] {
  return memoryRefs.map((reference) => (
    reference.session_title?.trim()
      || reference.flow_slug?.trim()?.replace(/-/g, ' ')
      || 'Previous Flow'
  ));
}
