import type { ReactNode } from 'react';
import {
  Card,
  CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Download,
  RotateCcw,
  Sparkles,
  Lightbulb,
  Target,
  Tags,
  Loader2,
  Brain,
  HelpCircle,
} from 'lucide-react';
import { format } from 'date-fns';
import { FlowSession, FlowTemplate, FlowQuestion, FlowAnalysis } from '@/app/types/flows';
import { isHtmlContent } from '@/app/components/flows/ChatBubble';
import DOMPurify from 'dompurify';
import { parseExplicitDeclaredFlowActions } from '@/app/lib/declaredFlowActions';
import { FlowTypeIcon } from '@/app/components/flows/FlowTypeIcon';
import type { FlowCoachReflection } from '@/app/hooks/useFlowCoach';
import { FlowTurningPoints } from '@/app/components/flows/FlowTurningPoints';

interface FlowReportCardProps {
  session: FlowSession;
  template: FlowTemplate;
  questions: FlowQuestion[];
  analysis: FlowAnalysis | null;
  analyzing?: boolean;
  isReadOnly?: boolean;
  generatingPDF?: boolean;
  onDownloadPDF?: () => void;
  onNewFlow?: () => void;
  coachReflections?: Record<string, FlowCoachReflection>;
  publicShareButton?: ReactNode;
}

export function FlowReportCard({
  session,
  template,
  questions,
  analysis,
  analyzing = false,
  isReadOnly = false,
  generatingPDF = false,
  onDownloadPDF,
  onNewFlow,
  coachReflections = {},
  publicShareButton,
}: FlowReportCardProps) {
  const declaredActions = parseExplicitDeclaredFlowActions(session.responses_json);

  // Interpolate prompt with responses
  const interpolatePrompt = (prompt: string): string => {
    let result = prompt;
    const matches = prompt.match(/\{([^}]+)\}/g);
    
    if (matches && session?.responses_json) {
      matches.forEach(match => {
        const key = match.slice(1, -1);
        const sourceQuestion = questions.find(
          q => q.interpolation_key === key || q.id === key
        );
        if (sourceQuestion && session.responses_json[sourceQuestion.id]) {
          result = result.replace(match, session.responses_json[sourceQuestion.id]);
        }
      });
    }
    
    return result;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <FlowTypeIcon
              flowSlug={template.slug}
              fallback={template.icon}
              size="md"
              animateOnHover
              className="text-foreground"
            />
            <span className="text-sm text-muted-foreground">{template.name} Flow</span>
          </div>
          <h1 className="text-2xl font-medium">
            {session.title || 'Untitled Flow'}
          </h1>
          <p className="text-sm text-muted-foreground/70 mt-1">
            {session.domain && <span className="mr-3">{session.domain}</span>}
            {format(new Date(session.created_at), 'MMMM d, yyyy • h:mm a')}
          </p>
        </div>
        
        {/* Action buttons - only show for owners */}
        {!isReadOnly && (
          <div className="flex gap-2">
            {publicShareButton}
            {onDownloadPDF && (
              <Button 
                variant="outline" 
                size="sm" 
                onClick={onDownloadPDF}
                disabled={generatingPDF}
              >
                {generatingPDF ? (
                  <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                ) : (
                  <Download className="h-4 w-4 mr-1" strokeWidth={1.5} />
                )}
                PDF
              </Button>
            )}
            {onNewFlow && (
              <Button size="sm" onClick={onNewFlow}>
                <RotateCcw className="h-4 w-4 mr-1" strokeWidth={1.5} />
                New
              </Button>
            )}
          </div>
        )}

        {/* Read-only mode - optionally show PDF download only */}
        {isReadOnly && onDownloadPDF && (
          <Button 
            variant="outline" 
            size="sm" 
            onClick={onDownloadPDF}
            disabled={generatingPDF}
          >
            {generatingPDF ? (
              <Loader2 className="h-4 w-4 mr-1 animate-spin" />
            ) : (
              <Download className="h-4 w-4 mr-1" strokeWidth={1.5} />
            )}
            PDF
          </Button>
        )}
      </div>

      {/* AI Analysis Section */}
      {(analysis || analyzing) && (
        <Card className="border-border/10">
          <CardContent className="p-6">
            {analyzing ? (
              <div className="text-center py-6">
                <Loader2 className="h-6 w-6 animate-spin mx-auto mb-3 text-primary" />
                <p className="text-muted-foreground">Generating insights...</p>
              </div>
            ) : analysis ? (
              <div className="space-y-6">
                {/* Headline */}
                {analysis.headline && (
                  <div className="text-center pb-4 border-b border-border/10">
                    <h3 className="text-xl font-semibold text-foreground">
                      {analysis.headline}
                    </h3>
                  </div>
                )}

                {/* Congratulations */}
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Sparkles className="h-5 w-5 text-[#2997FF]" strokeWidth={1.5} />
                    <h3 className="font-medium">Recognition</h3>
                  </div>
                  <p className="text-muted-foreground leading-relaxed">
                    {analysis.congratulations}
                  </p>
                </div>

                {/* Deep Dive Insight */}
                {analysis.deep_dive_insight && (
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Brain className="h-5 w-5 text-[#2997FF]" strokeWidth={1.5} />
                      <h3 className="font-medium">Deep Dive</h3>
                    </div>
                    <p className="text-muted-foreground leading-relaxed">
                      {analysis.deep_dive_insight}
                    </p>
                  </div>
                )}

                {/* Connections */}
                {analysis.connections && analysis.connections.length > 0 && (
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Lightbulb className="h-5 w-5 text-[#2997FF]" strokeWidth={1.5} />
                      <h3 className="font-medium">Connections</h3>
                    </div>
                    <ul className="space-y-2">
                      {analysis.connections.map((connection, idx) => (
                        <li key={idx} className="text-muted-foreground text-sm flex items-start gap-2">
                          <span className="text-primary mt-1">•</span>
                          {connection}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Themes */}
                {analysis.themes && analysis.themes.length > 0 && (
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Tags className="h-5 w-5 text-[#2997FF]" strokeWidth={1.5} />
                      <h3 className="font-medium">Themes</h3>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {analysis.themes.map((theme, idx) => (
                        <span 
                          key={idx}
                          className="px-3 py-1 bg-muted/50 rounded-full text-sm text-muted-foreground"
                        >
                          {theme}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Provocative Question */}
                {analysis.provocative_question && (
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <HelpCircle className="h-5 w-5 text-[#2997FF]" strokeWidth={1.5} />
                      <h3 className="font-medium">Question to Consider</h3>
                    </div>
                    <div className="bg-[#2997FF]/10 border border-[#2997FF]/20 rounded-lg p-4">
                      <p className="text-sm italic">
                        {analysis.provocative_question}
                      </p>
                    </div>
                  </div>
                )}

                {/* Suggested Action */}
                {analysis.suggested_action && (
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Target className="h-5 w-5 text-[#2997FF]" strokeWidth={1.5} />
                      <h3 className="font-medium">Micro-Step</h3>
                    </div>
                    <div className="bg-[#2997FF]/15 border border-[#2997FF]/20 rounded-lg p-4">
                      <p className="text-sm">
                        {analysis.suggested_action}
                      </p>
                    </div>
                  </div>
                )}

                {session.responses_json?.actions?.trim() && (
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Target className="h-5 w-5 text-muted-foreground" strokeWidth={1.5} />
                      <h3 className="font-medium">24-Hour Action</h3>
                    </div>
                    <p className="rounded-lg border border-border/10 bg-muted/30 p-4 text-sm text-foreground">
                      {session.responses_json.actions}
                    </p>
                  </div>
                )}

                {declaredActions.length > 0 && (
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Target className="h-5 w-5 text-muted-foreground" strokeWidth={1.5} />
                      <h3 className="font-medium">Weekly Playbook Commitments</h3>
                    </div>
                    <div className="space-y-3">
                      {declaredActions.map((action) => (
                        <div key={action.index} className="rounded-lg border border-border/10 bg-muted/30 p-4">
                          <p className="text-sm text-foreground">{action.finalText}</p>
                          {action.addedToWeeklyPlaybook !== null && (
                            <p className="mt-2 text-xs text-muted-foreground">
                              {action.addedToWeeklyPlaybook
                                ? 'Added to Weekly Playbook'
                                : 'Not added to Weekly Playbook'}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : null}
          </CardContent>
        </Card>
      )}

      <FlowTurningPoints
        questions={questions}
        responses={session.responses_json ?? {}}
        coachReflections={coachReflections}
        interpolatePrompt={interpolatePrompt}
      />

      {/* Q&A Section */}
      <div className="space-y-6">
        <h2 className="font-medium text-lg">
          {isReadOnly ? 'Responses' : 'Your Responses'}
        </h2>
        
        {questions.map((question) => {
          const response = session.responses_json?.[question.id];
          const coachTurn = coachReflections[question.id];
          const coachReflection = coachTurn?.reflection;
          if (!response) return null;
          
          return (
            <div key={question.id} className="border-b border-border/10 pb-6 last:border-0">
              <p className="text-muted-foreground/70 text-sm mb-2">
                {interpolatePrompt(question.prompt)}
              </p>
              {isHtmlContent(response) ? (
                <div
                  className="text-foreground leading-relaxed prose prose-sm dark:prose-invert max-w-none"
                  dangerouslySetInnerHTML={{
                    __html: DOMPurify.sanitize(response),
                  }}
                />
              ) : (
                <p className="text-foreground leading-relaxed whitespace-pre-wrap">
                  {response}
                </p>
              )}
              {coachReflection && (
                <div className="mt-4 border-l-2 border-[#2997FF] bg-[#2997FF]/5 px-4 py-3">
                  <div className="mb-1 flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-[#2997FF]">
                    <Sparkles className="h-3.5 w-3.5" strokeWidth={1.5} />
                    Flowing reflection
                  </div>
                  <p className="whitespace-pre-wrap text-sm leading-relaxed text-muted-foreground">
                    {coachReflection}
                  </p>
                  {coachTurn?.probe && coachTurn.probe_answer && (
                    <div className="mt-3 space-y-2 border-t border-[#2997FF]/20 pt-3">
                      <p className="text-sm font-medium text-foreground">{coachTurn.probe}</p>
                      <p className="whitespace-pre-wrap text-sm text-foreground/90">{coachTurn.probe_answer}</p>
                      {coachTurn.resolution && (
                        <p className="whitespace-pre-wrap text-sm leading-relaxed text-muted-foreground">
                          {coachTurn.resolution}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
