import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { ArrowLeft, AudioLines } from "lucide-react";
import { QuarterlyTargetsForm } from "@/app/components/life-targets/QuarterlyTargetsForm";
import { MeasurabilityAnalysisCard } from "@/app/components/life-targets/MeasurabilityAnalysisCard";
import { QuarterDisplay } from "@/app/components/life-targets/QuarterDisplay";
import { ChangeQuarterDialog } from "@/app/components/life-targets/ChangeQuarterDialog";
import { useLifeTargetsStore } from "@/app/lib/lifeTargetsStore";
import { useQuarterlyTargets, useSaveQuarterlyTargets } from "@/app/hooks/useQuarterlyTargets";
import { useTargetMeasurability } from "@/app/hooks/useTargetMeasurability";
import type { QuarterlyTargets } from "@/app/hooks/useQuarterlyTargets";
import { formatQuarterDisplay } from "@/app/lib/quarterUtils";
import { toast } from "sonner";

export default function LifeTargetsQuarterly() {
  const navigate = useNavigate();
  const location = useLocation();
  const isStaffPortal = location.pathname.startsWith('/staff/');
  const lifeTargetsBasePath = isStaffPortal ? '/staff/life-targets' : '/life-targets';
  const thetaCreatePath = isStaffPortal
    ? '/staff/theta-talk-track/create?source=quarterly-targets'
    : '/theta-talk-track/create?source=quarterly-targets';
  const queryClient = useQueryClient();
  const { currentQuarter, measurabilityResults, setMeasurabilityResults, changeQuarter } = useLifeTargetsStore();
  const { data: targets, isLoading, isError } = useQuarterlyTargets(currentQuarter);
  const saveTargets = useSaveQuarterlyTargets();
  const analyzeMeasurability = useTargetMeasurability();

  const [localTargets, setLocalTargets] = useState<QuarterlyTargets | null>(null);
  const [appliedSuggestions, setAppliedSuggestions] = useState<Set<string>>(new Set());
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [isLockedIn, setIsLockedIn] = useState(false);
  const [showChangeDialog, setShowChangeDialog] = useState(false);

  useEffect(() => {
    if (isStaffPortal || isLoading || isError || targets) return;

    toast.info("Start with Brain Dump so your quarterly targets are clear before you set them.");
    navigate(`${lifeTargetsBasePath}/brainstorm`, { replace: true });
  }, [isError, isLoading, isStaffPortal, lifeTargetsBasePath, navigate, targets]);

  const handleSave = async (formTargets: QuarterlyTargets) => {
    try {
      await saveTargets.mutateAsync({ 
        data: { ...formTargets, quarter: currentQuarter }, 
        showToast: true 
      });
      navigate(lifeTargetsBasePath);
    } catch (error) {
      console.error('Failed to save targets:', error);
    }
  };

  const handleAnalyze = async (formTargets: QuarterlyTargets) => {
    setIsLockedIn(false);
    setLocalTargets(formTargets);

    const targetsArray = {
      body: formTargets.body_target ? [formTargets.body_target] : [],
      being: formTargets.being_target ? [formTargets.being_target] : [],
      balance: formTargets.balance_target ? [formTargets.balance_target] : [],
      business: formTargets.business_target ? [formTargets.business_target] : [],
    };

    try {
      const results = await analyzeMeasurability.mutateAsync({ targets: targetsArray });
      setMeasurabilityResults(results);
    } catch (error) {
      console.error('Failed to analyze targets:', error);
    }
  };

  const handleLockIn = () => {
    setIsLockedIn(true);
    toast.success("✓ Targets locked in! Review your choices, then click 'Save Targets' to finalize.");
  };

  const handleApplySuggestion = (domain: string, _index: number, rewrittenTarget: string) => {
    if (!localTargets) return;

    const updatedTargets = {
      ...localTargets,
      [`${domain}_target`]: rewrittenTarget,
    };

    setLocalTargets(updatedTargets);
    setHasUnsavedChanges(true);
    setIsLockedIn(false);

    // Track this suggestion as applied
    const suggestionKey = `${domain}-${_index}`;
    setAppliedSuggestions(prev => new Set([...prev, suggestionKey]));

    // Show success feedback
    const domainLabel = domain.charAt(0).toUpperCase() + domain.slice(1);
    toast.success(`✓ Applied improved target to ${domainLabel}`);
  };

  const handleQuarterChange = (newQuarter: string) => {
    changeQuarter(newQuarter);
    setLocalTargets(null);
    setHasUnsavedChanges(false);
    setIsLockedIn(false);
    setMeasurabilityResults(null);
    setAppliedSuggestions(new Set());
    queryClient.invalidateQueries({ queryKey: ['quarterly-targets'] });
    toast.success(`Quarter updated to ${formatQuarterDisplay(newQuarter)}`);
  };

  return (
    <div className="container max-w-4xl py-8 space-y-8">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate(lifeTargetsBasePath)}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Set Quarterly Targets</h1>
              <p className="text-muted-foreground">
                Review the targets you chose from Brain Dump, sharpen anything vague, then save them before Monthly Missions unlock.
              </p>
            </div>
            <QuarterDisplay
              quarter={currentQuarter}
              onEditClick={() => setShowChangeDialog(true)}
            />
          </div>
        </div>
      </div>

      {targets && (
        <div className="rounded-lg border border-primary/20 bg-primary/5 p-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="font-semibold">Ready for your 90 Day Audio?</p>
              <p className="text-sm text-muted-foreground">
                The voice generator will pull these quarterly targets automatically, so you do not have to copy or paste anything.
              </p>
            </div>
            <Button
              variant="outline"
              onClick={() => navigate(thetaCreatePath)}
              className="shrink-0"
            >
              <AudioLines className="mr-2 h-4 w-4" />
              Generate Audio
            </Button>
          </div>
        </div>
      )}

      <QuarterlyTargetsForm
        initialData={localTargets || targets}
        onSave={handleSave}
        onAnalyze={handleAnalyze}
        onLockIn={handleLockIn}
        isSaving={saveTargets.isPending}
        isAnalyzing={analyzeMeasurability.isPending}
        hasUnsavedChanges={hasUnsavedChanges}
        isLockedIn={isLockedIn}
        hasAnalysis={!!measurabilityResults}
      />

      {measurabilityResults && (
        <MeasurabilityAnalysisCard
          analysis={measurabilityResults}
          onApplySuggestion={handleApplySuggestion}
          appliedSuggestions={appliedSuggestions}
        />
      )}

      <ChangeQuarterDialog
        open={showChangeDialog}
        onOpenChange={setShowChangeDialog}
        currentQuarter={currentQuarter}
        hasUnsavedChanges={hasUnsavedChanges}
        onConfirm={handleQuarterChange}
      />
    </div>
  );
}
