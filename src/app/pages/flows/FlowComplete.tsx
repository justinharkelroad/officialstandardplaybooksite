import {
  useState,
  useEffect,
  useRef } from 'react';
import { useParams,
  useNavigate } from 'react-router-dom';
import { supabase } from '@/app/lib/supabaseClient';
import { useFlowProfile } from '@/app/hooks/useFlowProfile';
import { useFlowStats } from '@/app/hooks/useFlowStats';
import { useToast } from '@/app/hooks/use-toast';
import { generateFlowPDF } from '@/app/lib/generateFlowPDF';
import { FlowSession,
  FlowTemplate,
  normalizeFlowCoachIntensity,
  FlowAnalysis,
  FlowQuestion } from '@/app/types/flows';
import { Card,
  CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2,
  Sparkles,
  RotateCcw,
  Home,
  CheckCircle2,
  Lightbulb,
  Target,
  Tags,
  Brain,
  HelpCircle,
} from 'lucide-react';
import { format } from 'date-fns';
import confetti from 'canvas-confetti';
import { parseExplicitDeclaredFlowActions } from '@/app/lib/declaredFlowActions';
import { isHtmlContent } from '@/app/components/flows/ChatBubble';
import DOMPurify from 'dompurify';
import { AnimatedDownload as Download } from "@/app/components/icons/AnimatedDownload";
import { FlowTypeIcon } from '@/app/components/flows/FlowTypeIcon';
import { DailyFrameReportCard } from '@/app/components/daily-frame/DailyFrameReportCard';
import { AppIcon } from "@/app/components/icons/appIcons";
import { useFlowCoach } from '@/app/hooks/useFlowCoach';
import { FlowTurningPoints } from '@/app/components/flows/FlowTurningPoints';
import { refreshCurrentWeeklyReflection } from "@/app/hooks/useWeeklyFlowReflection";
import { waitForFlowAnalysis } from "@/app/lib/waitForFlowAnalysis";
import { useQueryClient } from "@tanstack/react-query";
import { FlowShareButton } from '@/app/components/flows/FlowShareButton';

export default function FlowComplete() {
  const { sessionId } = useParams<{ sessionId: string }>();
  const navigate = useNavigate();
  const { profile } = useFlowProfile();
  const stats = useFlowStats();
  const { toast } = useToast();
  const { reflections: coachReflections } = useFlowCoach(sessionId);
  const queryClient = useQueryClient();
  const celebrationShownRef = useRef(false);
  const reflectionRefreshSessionRef = useRef<string | null>(null);
  
  const [session, setSession] = useState<FlowSession | null>(null);
  const [template, setTemplate] = useState<FlowTemplate | null>(null);
  const [analysis, setAnalysis] = useState<FlowAnalysis | null>(null);
  const [loading, setLoading] = useState(true);
  const [analyzing, setAnalyzing] = useState(false);
  const [analysisError, setAnalysisError] = useState<string | null>(null);
  const [generatingPDF, setGeneratingPDF] = useState(false);

  // Celebration effect for milestones and streaks
  useEffect(() => {
    if (!stats.loading && !celebrationShownRef.current && stats.totalFlows > 0) {
      celebrationShownRef.current = true;
      
      // Check if we just hit a milestone
      const justHitMilestone = stats.milestones.find(m => 
        m.achieved && stats.currentStreak === m.days
      );

      if (justHitMilestone) {
        // Fire confetti
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        });

        toast({
          title: `${justHitMilestone.icon} ${justHitMilestone.label} Milestone!`,
          description: `You've maintained a ${justHitMilestone.days}-day streak! Keep going!`,
        });
      } else if (stats.todayCompleted && stats.currentStreak > 1) {
        // Show streak alive toast
        toast({
          title: 'Streak Alive!',
          description: `Day ${stats.currentStreak} in the books!`,
        });
      }
    }
  }, [stats, toast]);

  // Update browser tab title
  useEffect(() => {
    document.title = "Flow Complete | Standard Playbook";
    return () => { document.title = "Standard Playbook"; };
  }, []);

  useEffect(() => {
    if (sessionId) {
      loadSession();
    }
  }, [sessionId]);

  useEffect(() => {
    if (!session?.id || !analysis || reflectionRefreshSessionRef.current === session.id) {
      return;
    }

    reflectionRefreshSessionRef.current = session.id;
    const completedAt = session.completed_at
      ? new Date(session.completed_at)
      : new Date();
    void refreshCurrentWeeklyReflection(completedAt).then((refreshed) => {
      if (!refreshed) return;
      void queryClient.invalidateQueries({ queryKey: ["weekly-flow-reflection"] });
      void queryClient.invalidateQueries({ queryKey: ["weekly-flow-reflection-history"] });
    });
  }, [analysis, queryClient, session?.completed_at, session?.id]);

  const loadSession = async () => {
    try {
      const { data, error } = await supabase
        .from('flow_sessions')
        .select('*, flow_template:flow_templates(*)')
        .eq('id', sessionId)
        .single();

      if (error) throw error;

      const templateData = {
        ...data.flow_template,
        coach_intensity: normalizeFlowCoachIntensity(data.flow_template.coach_intensity),
        questions_json: typeof data.flow_template.questions_json === 'string'
          ? JSON.parse(data.flow_template.questions_json)
          : data.flow_template.questions_json
      };

      setSession(data as unknown as FlowSession);
      setTemplate(templateData as unknown as FlowTemplate);

      // Check if we already have analysis
      if (data.ai_analysis_json) {
        setAnalysis(data.ai_analysis_json as unknown as FlowAnalysis);
        setLoading(false);
      } else {
        // Trigger AI analysis
        setLoading(false);
        await runAnalysis(sessionId!);
      }
    } catch (err) {
      console.error('Error loading session:', err);
      navigate('/app/flows');
    }
  };

  const runAnalysis = async (id: string) => {
    setAnalyzing(true);
    setAnalysisError(null);
    
    try {
      const { data, error } = await supabase.functions.invoke('analyze_flow_session', {
        body: { session_id: id },
      });

      if (error) throw error;

      const nextAnalysis = data?.analysis ?? (
        data?.analysis_in_progress
          ? await waitForFlowAnalysis(id)
          : null
      );

      if (nextAnalysis) {
        setAnalysis(nextAnalysis);
        // Update local session state
        setSession(prev => prev ? {
          ...prev,
          ai_analysis_json: nextAnalysis,
          status: 'completed',
        } : null);
      } else if (data?.analysis_in_progress) {
        setAnalysisError('AI insights are still being prepared. Refresh this page in a moment.');
      }
    } catch (err: unknown) {
      console.error('Analysis error:', err);
      setAnalysisError('Unable to generate AI insights. Your flow has been saved.');
    } finally {
      setAnalyzing(false);
    }
  };

  const handleDownloadPDF = async () => {
    if (!session || !template) return;
    
    const questions: FlowQuestion[] = (typeof template.questions_json === 'string' 
      ? JSON.parse(template.questions_json) 
      : template.questions_json) || [];
    
    setGeneratingPDF(true);
    try {
      await generateFlowPDF({
        session,
        template,
        questions,
        analysis,
        userName: profile?.preferred_name || undefined,
        coachReflections,
      });
    } catch (err) {
      console.error('PDF generation error:', err);
      alert('Failed to generate PDF. Please try again.');
    } finally {
      setGeneratingPDF(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-muted-foreground" />
          <p className="text-muted-foreground">Loading your flow...</p>
        </div>
      </div>
    );
  }

  if (!session || !template) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card>
          <CardContent className="p-8 text-center">
            <p className="text-muted-foreground">Session not found.</p>
            <Button className="mt-4" onClick={() => navigate('/app/flows')}>
              Back to Flows
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const declaredActions = parseExplicitDeclaredFlowActions(session.responses_json);
  const isDailyFrameFlow = template.slug === 'daily-frame';
  const dailyFrameCard = analysis?.daily_frame_card ?? null;
  const questions: FlowQuestion[] = (typeof template.questions_json === 'string'
    ? JSON.parse(template.questions_json)
    : template.questions_json) || [];

  const interpolatePrompt = (prompt: string): string => {
    let result = prompt;
    const matches = prompt.match(/\{([^}]+)\}/g);
    if (matches && session.responses_json) {
      matches.forEach((match) => {
        const key = match.slice(1, -1);
        const sourceQuestion = questions.find(
          (q) => q.interpolation_key === key || q.id === key
        );
        const responses = session.responses_json as Record<string, string> | null;
        if (sourceQuestion && responses && responses[sourceQuestion.id]) {
          result = result.replace(match, responses[sourceQuestion.id]);
        }
      });
    }
    return result;
  };

  const responses = (session.responses_json ?? {}) as Record<string, string>;

  return (
    <div className="min-h-screen py-12 px-6">
      <div className="max-w-2xl mx-auto">
        {/* Success Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#2997FF]/15 mb-4">
            <CheckCircle2 className="h-8 w-8 text-[#2997FF]" />
          </div>
          <h1 className="text-2xl font-medium">Flow Complete!</h1>
          <p className="mt-2 inline-flex items-center justify-center gap-2 text-muted-foreground">
            <FlowTypeIcon
              flowSlug={template.slug}
              fallback={template.icon}
              size="sm"
              animateOnHover
              className="text-foreground"
            />
            <span>{template.name} Flow</span>
          </p>
        </div>

        {/* Flow Info Card */}
        <Card className="mb-6 border-border/10">
          <CardContent className="p-6">
            <h2 className="text-xl font-medium mb-1">
              {session.title || 'Untitled Flow'}
            </h2>
            <p className="text-sm text-muted-foreground">
              {session.domain && <span className="mr-3 inline-flex items-center gap-1.5"><AppIcon name="metric" className="h-3.5 w-3.5" /> {session.domain}</span>}
              {format(new Date(session.created_at), 'MMMM d, yyyy • h:mm a')}
            </p>
          </CardContent>
        </Card>

        {/* AI Analysis Section */}
        {isDailyFrameFlow && analysis ? (
          <DailyFrameReportCard card={dailyFrameCard} />
        ) : (
        <Card className="mb-6 border-border/10">
          <CardContent className="p-6">
            {analyzing ? (
              <div className="text-center py-8">
                <Loader2 className="h-6 w-6 animate-spin mx-auto mb-3 text-primary" />
                <p className="text-muted-foreground">Generating personalized insights...</p>
                <p className="text-xs text-muted-foreground/60 mt-1">This may take a few seconds</p>
              </div>
            ) : analysisError ? (
              <div className="text-center py-6">
                <p className="text-muted-foreground">{analysisError}</p>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="mt-3"
                  onClick={() => runAnalysis(sessionId!)}
                >
                  Try Again
                </Button>
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

                {/* Connections to Profile */}
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
                      <p className="text-sm text-foreground italic">
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
                      <p className="text-sm text-foreground">
                        {analysis.suggested_action}
                      </p>
                    </div>
                  </div>
                )}

                {session.responses_json?.actions?.trim() && (
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <CheckCircle2 className="h-5 w-5 text-muted-foreground" strokeWidth={1.5} />
                      <h3 className="font-medium text-muted-foreground">Your 24-Hour Action</h3>
                    </div>
                    <p className="rounded-lg border border-border/10 bg-muted/30 p-4 text-sm text-foreground">
                      {session.responses_json.actions}
                    </p>
                  </div>
                )}

                {declaredActions.length > 0 && (
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <CheckCircle2 className="h-5 w-5 text-muted-foreground" strokeWidth={1.5} />
                      <h3 className="font-medium text-muted-foreground">Your Weekly Playbook Commitments</h3>
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
            ) : (
              <div className="text-center py-6">
                <p className="text-muted-foreground">No analysis available.</p>
              </div>
            )}
          </CardContent>
        </Card>
        )}

        <FlowTurningPoints
          questions={questions}
          responses={responses}
          coachReflections={coachReflections}
          interpolatePrompt={interpolatePrompt}
        />

        {/* Full Flow Q&A Section */}
        {questions.length > 0 && (
          <Card className="mb-6 border-border/10">
            <CardContent className="p-6">
              <h2 className="font-medium text-lg mb-6">Your Flow Responses</h2>
              <div className="space-y-6">
                {questions.map((question) => {
                  const response = responses[question.id];
                  const coachTurn = coachReflections[question.id];
                  const coachReflection = coachTurn?.reflection;
                  if (!response) return null;

                  return (
                    <div key={question.id} className="border-b border-border/10 pb-6 last:border-0 last:pb-0">
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
            </CardContent>
          </Card>
        )}

        {/* Actions */}
        <div className="space-y-3">
          {!isDailyFrameFlow && (
          <Button 
            className="w-full" 
            variant="outline"
            onClick={handleDownloadPDF}
            disabled={generatingPDF}
          >
            {generatingPDF ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Download className="h-4 w-4 mr-2" strokeWidth={1.5} />
            )}
            {generatingPDF ? 'Generating PDF...' : 'Download PDF'}
          </Button>
          )}

          {!isDailyFrameFlow && (
            <FlowShareButton
              className="w-full"
              sessionId={session.id}
              session={session}
              template={template}
              questions={questions}
              analysis={analysis}
              userName={profile?.preferred_name || undefined}
            />
          )}

          <Button
            className="w-full"
            onClick={() => navigate(`/app/flows/start/${template.slug}`)}
          >
            <RotateCcw className="h-4 w-4 mr-2" strokeWidth={1.5} />
            Start New {template.name} Flow
          </Button>

          <Button
            className="w-full"
            variant="ghost"
            onClick={() => navigate('/app')}
          >
            <Home className="h-4 w-4 mr-2" strokeWidth={1.5} />
            Back to Personal Growth
          </Button>
        </div>
      </div>
    </div>
  );
}
