import { useEffect, useState } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Loader2 } from "lucide-react";
import { useLifeTargetsStore } from "@/app/lib/lifeTargetsStore";
import { useQuarterlyTargets } from "@/app/hooks/useQuarterlyTargets";
import { useSaveDailyActions } from "@/app/hooks/useSaveDailyActions";

export function DataStatusIndicator() {
  const { currentQuarter, selectedDailyActions } = useLifeTargetsStore();
  const { data: targets } = useQuarterlyTargets(currentQuarter);
  const saveDailyActions = useSaveDailyActions();
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  useEffect(() => {
    if (!targets) {
      setHasUnsavedChanges(false);
      return;
    }

    // Check if there are daily actions in store but not in DB
    const storeHasActions = Object.values(selectedDailyActions).some(arr => arr.length > 0);
    const dbHasActions = 
      (targets.body_daily_actions && Array.isArray(targets.body_daily_actions) && targets.body_daily_actions.length > 0) ||
      (targets.being_daily_actions && Array.isArray(targets.being_daily_actions) && targets.being_daily_actions.length > 0) ||
      (targets.balance_daily_actions && Array.isArray(targets.balance_daily_actions) && targets.balance_daily_actions.length > 0) ||
      (targets.business_daily_actions && Array.isArray(targets.business_daily_actions) && targets.business_daily_actions.length > 0);

    // Compare store vs DB
    const storeBody = selectedDailyActions.body || [];
    const storeeBeing = selectedDailyActions.being || [];
    const storeBalance = selectedDailyActions.balance || [];
    const storeBusiness = selectedDailyActions.business || [];

    const dbBody = targets.body_daily_actions || [];
    const dbBeing = targets.being_daily_actions || [];
    const dbBalance = targets.balance_daily_actions || [];
    const dbBusiness = targets.business_daily_actions || [];

    const isDifferent = 
      JSON.stringify(storeBody) !== JSON.stringify(dbBody) ||
      JSON.stringify(storeeBeing) !== JSON.stringify(dbBeing) ||
      JSON.stringify(storeBalance) !== JSON.stringify(dbBalance) ||
      JSON.stringify(storeBusiness) !== JSON.stringify(dbBusiness);

    setHasUnsavedChanges(storeHasActions && (!dbHasActions || isDifferent));
  }, [selectedDailyActions, targets]);

  const handleSyncToDatabase = () => {
    saveDailyActions.mutate({
      quarter: currentQuarter,
      selectedActions: selectedDailyActions,
      showToast: true,
    });
  };

  if (!hasUnsavedChanges && !saveDailyActions.isPending) {
    return (
      <div className="flex items-center justify-end gap-2 text-xs text-muted-foreground" role="status">
        <CheckCircle2 className="h-3.5 w-3.5 text-[#2997FF]" />
        Daily proof saved
      </div>
    );
  }

  return (
    <Alert className="mb-4 border-[#2997FF]/50 bg-[#2997FF]/10">
      {saveDailyActions.isPending ? (
        <Loader2 className="h-4 w-4 animate-spin text-[#2997FF]" />
      ) : (
        <CheckCircle2 className="h-4 w-4 text-[#2997FF]" />
      )}
      <AlertDescription className="flex items-center justify-between gap-4">
        <div className="flex-1">
          {saveDailyActions.isPending ? (
            <p className="font-medium text-foreground flex items-center gap-2">
              <Loader2 className="h-3 w-3 animate-spin" />
              Saving daily proof...
            </p>
          ) : hasUnsavedChanges ? (
            <>
              <p className="font-medium text-foreground mb-1">
                Saving shortly
              </p>
              <p className="text-sm text-muted-foreground">
                Daily proof auto-saves after you stop making changes. Save now if you are leaving this page.
              </p>
            </>
          ) : (
            <p className="font-medium text-foreground">
              All changes saved ✓
            </p>
          )}
        </div>
        {hasUnsavedChanges && !saveDailyActions.isPending && (
          <Button
            onClick={handleSyncToDatabase}
            size="sm"
            variant="default"
          >
            Save now
          </Button>
        )}
      </AlertDescription>
    </Alert>
  );
}
