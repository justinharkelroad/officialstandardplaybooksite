import { SmartBackButton } from '@/app/components/SmartBackButton';
import { Core4MonthlyMissions } from '@/app/components/core4/Core4MonthlyMissions';

export default function MonthlyMissions() {
  return (
    <div className="min-h-screen bg-background">
      <div className="sticky top-0 z-10 bg-background/95 backdrop-blur border-b border-border px-4 py-3">
        <div className="max-w-4xl mx-auto flex items-center gap-3">
          <SmartBackButton
            authenticatedPath="/personal-growth"
            authenticatedLabel="Personal Growth"
          />
          <div>
            <h1 className="text-xl font-bold">Monthly Missions</h1>
            <p className="text-sm text-muted-foreground">
              Set your live monthly missions here. Quarterly Targets can seed empty domains and refresh untouched generated missions, while anything you edit here stays yours.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6">
        <Core4MonthlyMissions />
      </div>
    </div>
  );
}
