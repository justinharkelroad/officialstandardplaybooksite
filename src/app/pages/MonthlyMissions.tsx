import { SmartBackButton } from '@/app/components/SmartBackButton';
import { Core4MonthlyMissions } from '@/app/components/core4/Core4MonthlyMissions';
import { CadenceMap } from '@/app/components/CadenceMap';
import { HelpButton } from '@/app/components/HelpButton';

export default function MonthlyMissions() {
  return (
    <div className="min-h-screen bg-background">
      <div className="sticky top-0 z-10 bg-background/95 backdrop-blur border-b border-border px-4 py-3">
        <div className="max-w-4xl mx-auto flex items-center gap-3">
          <SmartBackButton
            authenticatedPath="/app"
            authenticatedLabel="Hub"
          />
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold">This Month</h1>
              <HelpButton videoKey="monthly_missions" />
            </div>
            <p className="text-sm text-muted-foreground">
              Execute the live mission for each Core Four domain. Quarterly can fill empty slots,
              while anything you edit here remains yours.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6">
        <CadenceMap active="monthly" compact showHandoffNote className="mb-6" />
        <Core4MonthlyMissions />
      </div>
    </div>
  );
}
