import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Loader2 } from "lucide-react";

interface DataStatusIndicatorProps {
  hasUnsavedChanges: boolean;
  isSaving: boolean;
  onSync: () => void;
}

export function DataStatusIndicator({
  hasUnsavedChanges,
  isSaving,
  onSync,
}: DataStatusIndicatorProps) {
  if (!hasUnsavedChanges && !isSaving) return null;

  return (
    <Alert className="mb-4 border-yellow-500/50 bg-yellow-500/15">
      <AlertTriangle className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
      <AlertDescription className="flex items-center justify-between gap-4">
        <div className="flex-1">
          {isSaving ? (
            <p className="flex items-center gap-2 font-medium text-foreground">
              <Loader2 className="h-3 w-3 animate-spin" />
              Saving Daily Proof...
            </p>
          ) : (
            <>
              <p className="mb-1 font-medium text-foreground">Unsaved Daily Proof</p>
              <p className="text-sm text-muted-foreground">
                Save these changes before leaving this step.
              </p>
            </>
          )}
        </div>
        {hasUnsavedChanges && !isSaving && (
          <Button onClick={onSync} size="sm" variant="default">
            Save now
          </Button>
        )}
      </AlertDescription>
    </Alert>
  );
}
