import {
  useEffect,
  useRef,
  useCallback } from "react";
import { useState } from "react";
import { useLocation,
  useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { ArrowLeft,
  Loader2,
} from "lucide-react";
import { DailyActionsSelector } from "@/app/components/life-targets/DailyActionsSelector";
import { QuarterDisplay } from "@/app/components/life-targets/QuarterDisplay";
import { ChangeQuarterDialog } from "@/app/components/life-targets/ChangeQuarterDialog";
import { DataStatusIndicator } from "@/app/components/life-targets/DataStatusIndicator";
import { useLifeTargetsStore } from "@/app/lib/lifeTargetsStore";
import { useQuarterlyTargets } from "@/app/hooks/useQuarterlyTargets";
import { useDailyActions } from "@/app/hooks/useDailyActions";
import { useSaveDailyActions, useSaveActionPool } from "@/app/hooks/useSaveDailyActions";
import { formatQuarterDisplay } from "@/app/lib/quarterUtils";
import { toast } from "sonner";
import { AnimatedRefresh as RefreshCw } from "@/app/components/icons/AnimatedRefresh";

export default function LifeTargetsDaily() {
  const navigate = useNavigate();
  const location = useLocation();
  const lifeTargetsBasePath = location.pathname.startsWith('/staff/') ? '/staff/life-targets' : '/life-targets';
  const queryClient = useQueryClient();
  const { 
    currentQuarter, 
    dailyActions, 
    selectedDailyActions,
    setDailyActions,
    setSelectedDailyActions,
    changeQuarter 
  } = useLifeTargetsStore();
  const { data: targets } = useQuarterlyTargets(currentQuarter);
  const generateActions = useDailyActions();
  const saveDailyActions = useSaveDailyActions();
  const saveActionPool = useSaveActionPool();
  const [showChangeDialog, setShowChangeDialog] = useState(false);
  const saveTimeoutRef = useRef<NodeJS.Timeout>();
  const poolSaveTimeoutRef = useRef<NodeJS.Timeout>();
  const hydratedQuarterRef = useRef<string | null>(null);

  // Hydrate daily actions from DB once per quarter. Subsequent refetches
  // (e.g. from our own auto-save cache updates) must not overwrite the
  // in-memory pool with the saved selection subset. That bug made the
  // unselected options disappear after picking one (reported 2026-04-12).
  //
  // Pool (what the user picks from) comes from {domain}_action_pool.
  // Selections (what's checked) come from {domain}_daily_actions.
  // Legacy rows pre-migration 20260412120000 may have selections but no pool;
  // the migration backfills pool = selections, but we also fall back here.
  useEffect(() => {
    if (!targets) return;
    if (hydratedQuarterRef.current === currentQuarter) return;

    const pickArray = (v: unknown): string[] =>
      Array.isArray(v) ? v.filter((x): x is string => typeof x === 'string') : [];

    const pool = {
      body: pickArray(targets.body_action_pool),
      being: pickArray(targets.being_action_pool),
      balance: pickArray(targets.balance_action_pool),
      business: pickArray(targets.business_action_pool),
    };

    const selections = {
      body: pickArray(targets.body_daily_actions),
      being: pickArray(targets.being_daily_actions),
      balance: pickArray(targets.balance_daily_actions),
      business: pickArray(targets.business_daily_actions),
    };

    // Legacy fallback: if pool column is empty for a domain but selections
    // exist, seed pool from selections so the user sees at least their
    // saved picks.
    (['body', 'being', 'balance', 'business'] as const).forEach((k) => {
      if (pool[k].length === 0 && selections[k].length > 0) {
        pool[k] = [...selections[k]];
      }
    });

    const hasAnyPool = Object.values(pool).some((arr) => arr.length > 0);
    const hasAnySelections = Object.values(selections).some((arr) => arr.length > 0);

    // Always hydrate, including the empty case. Zustand persists
    // dailyActions/selectedDailyActions to localStorage, so without this the
    // previous quarter's cached pool would leak into a new quarter that has
    // no DB data yet. DB is the source of truth for the current quarter.
    setDailyActions(hasAnyPool ? (pool as any) : null);
    setSelectedDailyActions(
      hasAnySelections
        ? selections
        : { body: [], being: [], balance: [], business: [] }
    );

    hydratedQuarterRef.current = currentQuarter;
  }, [targets, currentQuarter, setDailyActions, setSelectedDailyActions]);

  const handleGenerate = async () => {
    if (!targets) {
      toast.error('Please set your quarterly targets first');
      return;
    }

    const params: any = {};

    // Use primary target based on selection (default to target1 if not set)
    if (targets.body_target || targets.body_target2) {
      const isPrimaryTarget1 = targets.body_primary_is_target1 ?? true;
      const primaryTarget = isPrimaryTarget1 ? targets.body_target : targets.body_target2;
      const primaryNarrative = isPrimaryTarget1 ? targets.body_narrative : targets.body_narrative2;
      
      if (primaryTarget) {
        params.body = {
          target: primaryTarget,
          monthlyMissions: targets.body_monthly_missions || undefined,
          narrative: primaryNarrative || undefined,
        };
      }
    }

    if (targets.being_target || targets.being_target2) {
      const isPrimaryTarget1 = targets.being_primary_is_target1 ?? true;
      const primaryTarget = isPrimaryTarget1 ? targets.being_target : targets.being_target2;
      const primaryNarrative = isPrimaryTarget1 ? targets.being_narrative : targets.being_narrative2;
      
      if (primaryTarget) {
        params.being = {
          target: primaryTarget,
          monthlyMissions: targets.being_monthly_missions || undefined,
          narrative: primaryNarrative || undefined,
        };
      }
    }

    if (targets.balance_target || targets.balance_target2) {
      const isPrimaryTarget1 = targets.balance_primary_is_target1 ?? true;
      const primaryTarget = isPrimaryTarget1 ? targets.balance_target : targets.balance_target2;
      const primaryNarrative = isPrimaryTarget1 ? targets.balance_narrative : targets.balance_narrative2;
      
      if (primaryTarget) {
        params.balance = {
          target: primaryTarget,
          monthlyMissions: targets.balance_monthly_missions || undefined,
          narrative: primaryNarrative || undefined,
        };
      }
    }

    if (targets.business_target || targets.business_target2) {
      const isPrimaryTarget1 = targets.business_primary_is_target1 ?? true;
      const primaryTarget = isPrimaryTarget1 ? targets.business_target : targets.business_target2;
      const primaryNarrative = isPrimaryTarget1 ? targets.business_narrative : targets.business_narrative2;
      
      if (primaryTarget) {
        params.business = {
          target: primaryTarget,
          monthlyMissions: targets.business_monthly_missions || undefined,
          narrative: primaryNarrative || undefined,
        };
      }
    }

    try {
      const results = await generateActions.mutateAsync(params);
      setDailyActions(results);
      // Persist the generated pool so reload/cache-invalidation doesn't
      // collapse it back to the saved selection subset. Cancel any pending
      // debounced pool save first so the fresh pool wins.
      if (poolSaveTimeoutRef.current) {
        clearTimeout(poolSaveTimeoutRef.current);
      }
      saveActionPool.mutate({
        quarter: currentQuarter,
        pool: results as unknown as Record<string, string[]>,
      });
      toast.success('Daily actions generated successfully!');
    } catch (error) {
      console.error('Failed to generate daily actions:', error);
      toast.error('Failed to generate daily actions');
    }
  };

  // Debounced auto-save: save 2 seconds after last change
  const handleSelectionsChange = useCallback((selections: Record<string, string[]>) => {
    setSelectedDailyActions(selections);

    // Clear existing timeout
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    // Set new timeout to save after 2 seconds of inactivity
    saveTimeoutRef.current = setTimeout(() => {
      console.log('🔄 Auto-saving daily actions after 2s debounce...');
      saveDailyActions.mutate({
        quarter: currentQuarter,
        selectedActions: selections,
        showToast: false, // Silent auto-save
      });
    }, 2000);
  }, [currentQuarter, setSelectedDailyActions, saveDailyActions]);

  // Save on page unload
  useEffect(() => {
    const handleBeforeUnload = () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
      if (poolSaveTimeoutRef.current) {
        clearTimeout(poolSaveTimeoutRef.current);
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
      if (poolSaveTimeoutRef.current) {
        clearTimeout(poolSaveTimeoutRef.current);
      }
    };
  }, []);

  const handleActionsChange = useCallback((updatedActions: typeof dailyActions) => {
    setDailyActions(updatedActions);

    // Debounce pool saves triggered by Edit / Add Custom Action. Same 2s
    // window as the selections auto-save so rapid edits coalesce.
    if (poolSaveTimeoutRef.current) {
      clearTimeout(poolSaveTimeoutRef.current);
    }
    if (!updatedActions) return;
    poolSaveTimeoutRef.current = setTimeout(() => {
      saveActionPool.mutate({
        quarter: currentQuarter,
        pool: updatedActions as unknown as Record<string, string[]>,
      });
    }, 2000);
  }, [currentQuarter, setDailyActions, saveActionPool]);

  const handleContinue = () => {
    // GATE 3: Navigate to cascade view instead of saving
    navigate(`${lifeTargetsBasePath}/cascade`);
  };

  const handleQuarterChange = (newQuarter: string) => {
    changeQuarter(newQuarter);
    queryClient.invalidateQueries({ queryKey: ['quarterly-targets'] });
    toast.success(`Quarter updated to ${formatQuarterDisplay(newQuarter)}`);
  };

  const hasGeneratedActions = dailyActions && Object.values(dailyActions).some(
    actions => actions && actions.length > 0
  );

  return (
    <div className="container max-w-5xl mx-auto py-8 px-4 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate(`${lifeTargetsBasePath}/missions`)}
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <div className="flex items-center gap-4 mb-1">
            <h1 className="text-3xl font-bold">Daily Actions</h1>
            <QuarterDisplay
              quarter={currentQuarter}
              onEditClick={() => setShowChangeDialog(true)}
            />
          </div>
          <p className="text-muted-foreground">
            Generate optional daily ideas from your quarterly targets. Pick what fits, skip what does not, or add your own.
          </p>
        </div>
      </div>

        <Button
          onClick={handleGenerate}
          disabled={generateActions.isPending || !targets}
          variant="outline"
        >
          {generateActions.isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <RefreshCw className="mr-2 h-4 w-4" />
              {hasGeneratedActions ? 'Regenerate' : 'Generate'} Actions
            </>
          )}
        </Button>
      </div>

      {/* Data status indicator - shows unsaved changes warning */}
      <DataStatusIndicator />

      {/* Actions Selector */}
      {hasGeneratedActions && dailyActions ? (
          <DailyActionsSelector
            actions={dailyActions}
            selectedActions={selectedDailyActions}
            onSelectionsChange={handleSelectionsChange}
            onActionsChange={handleActionsChange}
            onContinue={handleContinue}
          />
      ) : generateActions.isPending ? (
        <div className="text-center py-12 space-y-4">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
          <p className="text-muted-foreground">Generating your daily actions...</p>
        </div>
      ) : (
        <div className="text-center py-12 space-y-4">
          <p className="text-muted-foreground">
            Click "Generate Actions" to get optional daily ideas. You can choose none of them and still keep your plan.
          </p>
        </div>
      )}

      <ChangeQuarterDialog
        open={showChangeDialog}
        onOpenChange={setShowChangeDialog}
        currentQuarter={currentQuarter}
        hasUnsavedChanges={false}
        onConfirm={handleQuarterChange}
      />
    </div>
  );
}
