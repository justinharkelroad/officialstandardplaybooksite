import { Sparkles } from 'lucide-react';
import { FlowTypeIcon } from '@/app/components/flows/FlowTypeIcon';
import { SanitizedRichText } from '@/app/components/flows/SanitizedRichText';
import {
  buildFlowConversation,
  formatPastFlowProvenance,
} from '@/app/lib/flowConversation';
import type { FlowCoachTurn, FlowQuestion } from '@/app/types/flows';

interface FlowConversationTranscriptProps {
  questions: FlowQuestion[];
  responses: Record<string, string>;
  coachTurns: Record<string, FlowCoachTurn>;
  flowSlug: string;
  fallbackIcon?: string | null;
}

export function FlowConversationTranscript({
  questions,
  responses,
  coachTurns,
  flowSlug,
  fallbackIcon,
}: FlowConversationTranscriptProps) {
  const conversation = buildFlowConversation(questions, responses, coachTurns);
  if (!conversation.length) return null;

  return (
    <section className="space-y-6" data-flow-conversation>
      <div className="flex items-center gap-2">
        <FlowTypeIcon
          flowSlug={flowSlug}
          fallback={fallbackIcon}
          size="sm"
          className="text-foreground"
        />
        <h2 className="font-medium text-lg">Your Flow Conversation</h2>
      </div>

      <div className="space-y-6">
        {conversation.map((turn, index) => {
          const coach = turn.coach;
          const provenance = coach ? formatPastFlowProvenance(coach.memory_refs) : [];
          return (
            <article
              key={turn.questionId}
              className="border-b border-border/10 pb-6 last:border-0 last:pb-0"
              data-flow-question-id={turn.questionId}
            >
              <div data-transcript-role="official-question">
                <p className="mb-1 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Official Flow question {index + 1}
                </p>
                <p className="text-sm leading-relaxed text-muted-foreground/90">{turn.prompt}</p>
              </div>

              <div className="mt-3" data-transcript-role="official-answer">
                <p className="mb-1 text-xs font-medium uppercase tracking-wider text-muted-foreground">Your answer</p>
                <SanitizedRichText
                  value={turn.memberAnswer}
                  className="text-foreground leading-relaxed"
                />
              </div>

              {coach?.reflection && (
                <div className="mt-4 border-l-2 border-[#2997FF] bg-[#2997FF]/5 px-4 py-3">
                  <div data-transcript-role="coach-reflection">
                    <div className="mb-1 flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-[#2997FF]">
                      <Sparkles className="h-3.5 w-3.5" strokeWidth={1.5} />
                      Coach reflection
                    </div>
                    <SanitizedRichText
                      value={coach.reflection}
                      className="text-sm leading-relaxed text-muted-foreground"
                    />
                  </div>

                  {coach.probe && coach.probe_answer && (
                    <div className="mt-3 space-y-3 border-t border-[#2997FF]/20 pt-3">
                      <div data-transcript-role="coach-follow-up">
                        <p className="mb-1 text-xs font-medium uppercase tracking-wider text-[#2997FF]">Coach follow-up</p>
                        <SanitizedRichText value={coach.probe} className="text-sm font-medium text-foreground" />
                      </div>
                      <div data-transcript-role="member-follow-up">
                        <p className="mb-1 text-xs font-medium uppercase tracking-wider text-muted-foreground">Member follow-up</p>
                        <SanitizedRichText value={coach.probe_answer} className="text-sm text-foreground/90" />
                      </div>
                      {coach.resolution && (
                        <div data-transcript-role="coach-resolution">
                          <p className="mb-1 text-xs font-medium uppercase tracking-wider text-[#2997FF]">Coach resolution</p>
                          <SanitizedRichText value={coach.resolution} className="text-sm leading-relaxed text-muted-foreground" />
                        </div>
                      )}
                    </div>
                  )}

                  {provenance.length > 0 && (
                    <p className="mt-3 text-xs text-muted-foreground" data-transcript-role="past-flow-provenance">
                      <span className="font-medium">Past-Flow provenance:</span> {provenance.join(', ')}
                    </p>
                  )}
                </div>
              )}
            </article>
          );
        })}
      </div>
    </section>
  );
}
