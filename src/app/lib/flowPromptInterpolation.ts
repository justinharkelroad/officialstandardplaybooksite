import { FlowQuestion } from '@/app/types/flows';

const EDITOR_HTML_PATTERN = /^<(p|h[1-6]|ul|ol|li|div|blockquote|br|hr)([\s>])/i;

export function stripFlowAnswerHtmlForPrompt(value: string): string {
  if (!EDITOR_HTML_PATTERN.test(value.trim())) return value;

  if (typeof DOMParser !== 'undefined') {
    try {
      const doc = new DOMParser().parseFromString(value, 'text/html');
      const text = doc.body.textContent?.trim();
      if (text) return text;
    } catch {
      // Fall through to a conservative tag strip below.
    }
  }

  return value
    .replace(/<[^>]*>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

export function interpolateFlowPrompt(
  prompt: string,
  questions: FlowQuestion[],
  answers: Record<string, string>,
): string {
  return prompt.replace(/\{([^}]+)\}/g, (match, rawKey) => {
    const key = rawKey.trim();
    const sourceQuestion = questions.find(
      (question) => question.interpolation_key === key || question.id === key,
    );
    if (!sourceQuestion) return match;

    const answer = answers[sourceQuestion.id];
    if (!answer?.trim()) return match;

    return stripFlowAnswerHtmlForPrompt(answer);
  });
}

export function interpolateFlowQuestionPrompt(
  question: FlowQuestion,
  questions: FlowQuestion[],
  answers: Record<string, string>,
): FlowQuestion {
  return {
    ...question,
    prompt: interpolateFlowPrompt(question.prompt, questions, answers),
  };
}
