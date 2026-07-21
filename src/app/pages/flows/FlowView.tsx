import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/app/lib/supabaseClient';
import { useAuth } from '@/app/lib/auth';
import { useFlowProfile } from '@/app/hooks/useFlowProfile';
import { generateFlowPDF } from '@/app/lib/generateFlowPDF';
import { FlowSession, FlowTemplate, FlowQuestion, FlowAnalysis, normalizeFlowCoachIntensity } from '@/app/types/flows';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { FlowReportCard } from '@/app/components/flows/FlowReportCard';
import { useFlowCoach } from '@/app/hooks/useFlowCoach';
import { waitForFlowAnalysis } from '@/app/lib/waitForFlowAnalysis';
import { FlowShareButton } from '@/app/components/flows/FlowShareButton';
import { isProfileFlowSlug } from '@/app/lib/flowProfileInterview';

export default function FlowView() {
  const { sessionId } = useParams<{ sessionId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { profile } = useFlowProfile();
  const { reflections: coachReflections } = useFlowCoach(sessionId);
  
  const [session, setSession] = useState<FlowSession | null>(null);
  const [template, setTemplate] = useState<FlowTemplate | null>(null);
  const [questions, setQuestions] = useState<FlowQuestion[]>([]);
  const [analysis, setAnalysis] = useState<FlowAnalysis | null>(null);
  const [loading, setLoading] = useState(true);
  const [analyzing, setAnalyzing] = useState(false);
  const [generatingPDF, setGeneratingPDF] = useState(false);

  // Check if current user is the owner of this flow
  const isOwner = session?.user_id === user?.id;

  // Update browser tab title
  useEffect(() => {
    if (template?.name) {
      document.title = `${template.name} Flow | Standard Playbook`;
    } else {
      document.title = "View Flow | Standard Playbook";
    }
    return () => { document.title = "Standard Playbook"; };
  }, [template?.name]);

  useEffect(() => {
    if (sessionId) {
      loadSession();
    }
  }, [sessionId]);

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

      if (isProfileFlowSlug(templateData.slug)) {
        navigate(`/app/flows/profile?session_id=${encodeURIComponent(data.id)}`, { replace: true });
        return;
      }

      setSession(data as unknown as FlowSession);
      setTemplate(templateData as unknown as FlowTemplate);
      setQuestions(templateData.questions_json);
      setAnalysis(data.ai_analysis_json as unknown as FlowAnalysis);

      // If completed but no analysis, trigger it (only for owner)
      if (data.status === 'completed' && !data.ai_analysis_json && data.user_id === user?.id) {
        await runAnalysis(sessionId);
      }
    } catch (err) {
      console.error('Error loading session:', err);
      navigate(-1);
    } finally {
      setLoading(false);
    }
  };

  const runAnalysis = async (id: string) => {
    setAnalyzing(true);
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

      if (nextAnalysis) setAnalysis(nextAnalysis);
    } catch (err) {
      console.error('Analysis error:', err);
    } finally {
      setAnalyzing(false);
    }
  };

  const handleDownloadPDF = async () => {
    if (!session || !template) return;
    
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

  const handleBack = () => {
    if (isOwner) {
      navigate('/app/flows/library');
    } else {
      navigate(-1);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!session || !template) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="border-border/10">
          <CardContent className="p-8 text-center">
            <p className="text-muted-foreground">Flow not found.</p>
            <Button className="mt-4" onClick={() => navigate(-1)}>
              Go Back
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 px-6">
      <div className="max-w-3xl mx-auto">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={handleBack}
          className="mb-4 -ml-2"
        >
          <ArrowLeft className="h-4 w-4 mr-2" strokeWidth={1.5} />
          {isOwner ? 'Back to Library' : 'Back'}
        </Button>

        {/* Flow Report Card */}
        <FlowReportCard
          session={session}
          template={template}
          questions={questions}
          analysis={analysis}
          analyzing={analyzing}
          isReadOnly={!isOwner}
          generatingPDF={generatingPDF}
          onDownloadPDF={handleDownloadPDF}
          onNewFlow={isOwner ? () => navigate(`/app/flows/start/${template.slug}`) : undefined}
          coachReflections={coachReflections}
          publicShareButton={isOwner && session.status === 'completed' ? (
            <FlowShareButton
              sessionId={session.id}
              session={session}
              template={template}
              questions={questions}
              analysis={analysis}
              userName={profile?.preferred_name || undefined}
              label="PDF Link"
              size="sm"
            />
          ) : undefined}
        />
      </div>
    </div>
  );
}
