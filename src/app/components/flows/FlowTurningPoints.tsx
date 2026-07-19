import { Sparkles } from 'lucide-react';
import type { FlowCoachTurn, FlowQuestion } from '@/app/types/flows';
import { selectFlowTurningPoints } from '@/app/lib/flowTurningPoints';

interface FlowTurningPointsProps {
  questions: FlowQuestion[];
  responses: Record<string, string>;
  coachReflections: Record<string, FlowCoachTurn>;
  interpolatePrompt?: (prompt: string) => string;
}

export function FlowTurningPoints({
  questions,
  responses,
  coachReflections,
  interpolatePrompt = (prompt) => prompt,
}: FlowTurningPointsProps) {
  const turningPoints = selectFlowTurningPoints(questions, responses, coachReflections);
  if (!turningPoints.length) return null;

  return (
    <section className="space-y-4">
      <div className="flex items-center gap-2">
        <Sparkles className="h-5 w-5 text-[#2997FF]" strokeWidth={1.5} />
        <h2 className="font-medium text-lg">Turning Points</h2>
      </div>
      <p className="text-sm text-muted-foreground">
        The reflections and follow-ups that most shaped this Flow.
      </p>
      <div className="space-y-4">
        {turningPoints.map(({ questionId, prompt, answer, coach }) => (
          <div key={questionId} className="rounded-lg border border-[#2997FF]/20 bg-[#2997FF]/5 p-4">
            <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              {interpolatePrompt(prompt)}
            </p>
            <p className="mt-2 whitespace-pre-wrap text-sm text-foreground">{answer}</p>
            <div className="mt-3 border-l-2 border-[#2997FF] pl-3">
              <p className="whitespace-pre-wrap text-sm leading-relaxed text-muted-foreground">{coach.reflection}</p>
              {coach.probe && coach.probe_answer && (
                <div className="mt-3 space-y-2 border-t border-[#2997FF]/20 pt-3">
                  <p className="text-sm font-medium text-foreground">{coach.probe}</p>
                  <p className="whitespace-pre-wrap text-sm text-foreground/90">{coach.probe_answer}</p>
                  {coach.resolution && (
                    <p className="whitespace-pre-wrap text-sm leading-relaxed text-muted-foreground">{coach.resolution}</p>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
