import { useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Loader2, RotateCcw } from "lucide-react";
import { SidebarLayout } from "@/app/components/SidebarLayout";
import { useThetaStore } from "@/app/lib/thetaTrackStore";
import { ThetaTargetsInput } from "@/app/components/ThetaTargetsInput";
import { ThetaToneSelector } from "@/app/components/ThetaToneSelector";
import { ThetaAffirmationsApproval } from "@/app/components/ThetaAffirmationsApproval";
import { ThetaVoiceStudioSelector } from "@/app/components/ThetaVoiceStudioSelector";
import { ThetaBinauralComposer } from "@/app/components/ThetaBinauralComposer";
import { ThetaStartOverDialog } from "@/app/components/ThetaStartOverDialog";
import { getOrCreateSessionId, clearSessionId } from "@/app/lib/sessionUtils";
import { useGenerateAffirmations, useSaveAffirmations } from "@/app/hooks/useThetaAffirmations";
import type { AffirmationSet } from "@/app/hooks/useThetaAffirmations";
import { useLifeTargetsStore } from "@/app/lib/lifeTargetsStore";
import { useQuarterlyTargets } from "@/app/hooks/useQuarterlyTargets";
import { formatQuarterDisplay } from "@/app/lib/quarterUtils";
import {
  getThetaQuarterlyTargetsFingerprint,
  hasThetaTargetValues,
  resolveThetaTargetsFromQuarterly,
} from "@/app/lib/thetaQuarterlyTargets";
import { useAuth } from "@/app/lib/auth";
import { useStaffAuth } from "@/app/hooks/useStaffAuth";
import { toast } from "sonner";

export default function ThetaTalkTrackCreate() {
  const { 
    currentStep, 
    actorScope,
    sessionId, 
    setSessionId, 
    setCurrentStep,
    quarterlyTargetsFingerprint,
    setTargetsFromQuarterly,
    affirmations,
    setAffirmations,
    selectedVoice,
    setSelectedVoice,
    resetForActor,
    resetSession,
  } = useThetaStore();
  const location = useLocation();
  const { user, loading: authLoading } = useAuth();
  const { user: staffUser, loading: staffAuthLoading } = useStaffAuth();
  const isStaffPortal = location.pathname.startsWith('/staff/');
  const { currentQuarter } = useLifeTargetsStore();
  const { data: quarterlyTargets } = useQuarterlyTargets(
    currentQuarter,
    isStaffPortal ? 'staff' : 'portal',
  );
  const activeActorScope = isStaffPortal
    ? staffUser?.id ? `staff:${staffUser.id}` : null
    : user?.id ? `owner:${user.id}` : null;
  const actorLoading = isStaffPortal ? staffAuthLoading : authLoading;
  const actorReady = Boolean(activeActorScope && actorScope === activeActorScope);
  const transferredTargets = useMemo(
    () => quarterlyTargets
      ? resolveThetaTargetsFromQuarterly(quarterlyTargets)
      : null,
    [quarterlyTargets],
  );
  const transferredTargetsFingerprint = useMemo(
    () => transferredTargets
      ? getThetaQuarterlyTargetsFingerprint(currentQuarter, transferredTargets)
      : null,
    [currentQuarter, transferredTargets],
  );
  const hydratedFromQuarterly = Boolean(
    transferredTargets &&
    hasThetaTargetValues(transferredTargets) &&
    transferredTargetsFingerprint === quarterlyTargetsFingerprint
  );
  
  const [selectedTone, setSelectedTone] = useState('inspiring');
  const [generatedAffirmations, setGeneratedAffirmations] = useState<AffirmationSet | null>(null);
  const [showResetDialog, setShowResetDialog] = useState(false);
  
  const totalSteps = 4;
  const progress = (currentStep / totalSteps) * 100;

  const generateMutation = useGenerateAffirmations();
  const saveMutation = useSaveAffirmations();

  useEffect(() => {
    if (!activeActorScope || actorScope === activeActorScope) return;

    clearSessionId();
    resetForActor(activeActorScope);
    setGeneratedAffirmations(null);
  }, [activeActorScope, actorScope, resetForActor]);

  useEffect(() => {
    if (actorReady && !sessionId) {
      setSessionId(getOrCreateSessionId());
    }
  }, [actorReady, sessionId, setSessionId]);

  useEffect(() => {
    if (
      !actorReady ||
      currentStep !== 1 ||
      !transferredTargets ||
      !transferredTargetsFingerprint ||
      !hasThetaTargetValues(transferredTargets) ||
      quarterlyTargetsFingerprint === transferredTargetsFingerprint
    ) {
      return;
    }

    setTargetsFromQuarterly(transferredTargets, transferredTargetsFingerprint);
  }, [
    actorReady,
    currentStep,
    quarterlyTargetsFingerprint,
    setTargetsFromQuarterly,
    transferredTargets,
    transferredTargetsFingerprint,
  ]);

  const handleGenerateAffirmations = async () => {
    try {
      const result = await generateMutation.mutateAsync({
        sessionId,
        tone: selectedTone
      });
      setGeneratedAffirmations(result);
      toast.success('Affirmations generated successfully!');
    } catch (error) {
      console.error('Generation failed:', error);
    }
  };

  const handleApproveAffirmations = async (approvedAffirmations: AffirmationSet) => {
    try {
      await saveMutation.mutateAsync({
        sessionId,
        affirmations: approvedAffirmations,
        tone: selectedTone as 'inspiring' | 'motivational' | 'calm' | 'energizing'
      });
      setAffirmations(approvedAffirmations);
      setCurrentStep(3);
    } catch (error) {
      console.error('Save failed:', error);
    }
  };

  const handleRegenerate = () => {
    setGeneratedAffirmations(null);
  };

  const handleStartOver = () => {
    resetSession();
    clearSessionId();
    setGeneratedAffirmations(null);
    setSelectedTone('inspiring');
    setShowResetDialog(false);
    toast.success('Session reset. Starting over...');
  };

  const handleStartOverClick = () => {
    if (currentStep > 1) {
      setShowResetDialog(true);
    } else {
      handleStartOver();
    }
  };

  const stepTitles = [
    "Enter Your 90 Day Targets",
    "AI-Generated Affirmations",
    "Voice Studio Selection",
    "Binaural Composer"
  ];

  if (actorLoading || !actorReady) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const content = (
      <div className="flex-1 bg-background">
        {/* Header with Start Over button */}
        <header className="border-b border-border">
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            <h1 className="text-xl font-semibold">Create Theta Talk Track</h1>
            <Button
              variant="outline"
              size="sm"
              onClick={handleStartOverClick}
              className="gap-2"
            >
              <RotateCcw className="h-4 w-4" />
              <span className="hidden sm:inline">Start Over</span>
            </Button>
          </div>
        </header>

        {/* Progress Bar */}
      <div className="border-b border-border bg-muted/30">
        <div className="container mx-auto px-4 py-4">
          <div className="max-w-3xl mx-auto">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">
                Step {currentStep} of {totalSteps}
              </span>
              <span className="text-sm text-muted-foreground">
                {stepTitles[currentStep - 1]}
              </span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle>{stepTitles[currentStep - 1]}</CardTitle>
              <CardDescription>
                {currentStep === 1 && "Define your Body, Being, Balance, and Business goals"}
                {currentStep === 2 && "Review and customize your AI-generated affirmations"}
                {currentStep === 3 && "Choose your preferred voice narrator"}
                {currentStep === 4 && "Generate your binaural theta brainwave track"}
              </CardDescription>
              {currentStep === 1 && hydratedFromQuarterly && (
                <div className="rounded-lg border border-primary/20 bg-primary/5 p-3 text-sm text-muted-foreground">
                  Pulled in your saved quarterly targets for {formatQuarterDisplay(currentQuarter)}. Review them, then continue to generate affirmations from all Core Four targets.
                </div>
              )}
            </CardHeader>
            <CardContent>
              {currentStep === 1 && <ThetaTargetsInput />}
              
              {currentStep === 2 && (
                <div className="space-y-6">
                  {!generatedAffirmations ? (
                    <>
                      <ThetaToneSelector
                        selectedTone={selectedTone}
                        onToneChange={setSelectedTone}
                      />
                      <div className="flex justify-end">
                        <button
                          onClick={handleGenerateAffirmations}
                          disabled={generateMutation.isPending}
                          className="px-6 py-2 bg-white text-black border border-gray-200 rounded-md transition-all disabled:opacity-50"
                        >
                          {generateMutation.isPending ? 'Generating...' : 'Generate Affirmations'}
                        </button>
                      </div>
                    </>
                  ) : (
                    <ThetaAffirmationsApproval
                      affirmations={generatedAffirmations}
                      onApprove={handleApproveAffirmations}
                      onRegenerate={handleRegenerate}
                      isRegenerating={generateMutation.isPending}
                    />
                  )}
                </div>
              )}

              {currentStep === 3 && (
                <ThetaVoiceStudioSelector
                  selectedVoice={selectedVoice}
                  onVoiceSelect={setSelectedVoice}
                  onContinue={() => setCurrentStep(4)}
                />
              )}
              {currentStep === 4 && (
                <ThetaBinauralComposer
                  sessionId={sessionId}
                  voiceId={selectedVoice || ''}
                  affirmations={affirmations}
                />
              )}
            </CardContent>
          </Card>
        </div>
      </div>

        <ThetaStartOverDialog
          open={showResetDialog}
          onOpenChange={setShowResetDialog}
          onConfirm={handleStartOver}
        />
      </div>
  );

  return isStaffPortal ? content : <SidebarLayout>{content}</SidebarLayout>;
}
