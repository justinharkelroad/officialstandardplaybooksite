import {
  useState,
  useEffect,
  useMemo,
  useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card,
  CardContent,
  CardHeader,
  CardTitle } from "@/components/ui/card";
import { Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue } from "@/components/ui/select";
import { Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger } from "@/components/ui/tooltip";
import { ArrowLeft,
  Loader2,
  CheckCircle2,
} from "lucide-react";
import { MonthlyMissionsTimeline } from "@/app/components/life-targets/MonthlyMissionsTimeline";
import { QuarterDisplay } from "@/app/components/life-targets/QuarterDisplay";
import { ChangeQuarterDialog } from "@/app/components/life-targets/ChangeQuarterDialog";
import { useLifeTargetsStore } from "@/app/lib/lifeTargetsStore";
import { useQuarterlyTargets, useSaveQuarterlyTargets } from "@/app/hooks/useQuarterlyTargets";
import {
  type DomainMissions,
  type GenerateMissionsParams,
  type MonthlyMissionsOutput,
  useMonthlyMissions,
} from "@/app/hooks/useMonthlyMissions";
import { formatQuarterDisplay, parseQuarter } from "@/app/lib/quarterUtils";
import { toast } from "sonner";
import { AnimatedRefresh as RefreshCw } from "@/app/components/icons/AnimatedRefresh";

type MissionDomain = "body" | "being" | "balance" | "business";

type PrimarySelections = Record<MissionDomain, boolean | null>;

type ExistingStandaloneMission = {
  id: string;
  domain: MissionDomain;
  month_year: string;
  title: string;
  weekly_measurable: string | null;
  created_at?: string | null;
  updated_at?: string | null;
  items?: unknown;
};

type StandaloneMissionSyncRow = {
  domain: MissionDomain;
  title: string;
  items: [];
  weekly_measurable: string | null;
  month_year: string;
  status: "active";
  previous_title?: string | null;
  previous_weekly_measurable?: string | null;
};

const MISSION_DOMAINS: MissionDomain[] = ["body", "being", "balance", "business"];

const MONTH_INDEX_BY_NAME: Record<string, number> = {
  January: 0,
  February: 1,
  March: 2,
  April: 3,
  May: 4,
  June: 5,
  July: 6,
  August: 7,
  September: 8,
  October: 9,
  November: 10,
  December: 11,
};

const normalizeMissionText = (value: string | null | undefined) => (value ?? "").trim();

const missionMatches = (
  mission: Pick<ExistingStandaloneMission, "title" | "weekly_measurable">,
  title: string | null | undefined,
  weeklyMeasurable: string | null | undefined,
) => (
  normalizeMissionText(mission.title) === normalizeMissionText(title) &&
  normalizeMissionText(mission.weekly_measurable) === normalizeMissionText(weeklyMeasurable)
);

const shouldUpdateStandaloneMission = (
  existing: ExistingStandaloneMission,
  row: StandaloneMissionSyncRow,
) => {
  if (missionMatches(existing, row.title, row.weekly_measurable)) return false;
  if (row.previous_title === undefined) return false;

  return missionMatches(existing, row.previous_title, row.previous_weekly_measurable);
};

const getStandaloneMissionTimestamp = (
  mission: Pick<ExistingStandaloneMission, "created_at" | "updated_at">,
) => {
  const timestamp = new Date(mission.updated_at ?? mission.created_at ?? 0).getTime();
  return Number.isFinite(timestamp) ? timestamp : 0;
};

const dedupeStandaloneMissionsByKey = (rows: ExistingStandaloneMission[]) => {
  const latestByKey = new Map<string, ExistingStandaloneMission>();

  for (const row of rows) {
    const key = `${row.domain}:${row.month_year}`;
    const existing = latestByKey.get(key);
    const isNewer =
      existing &&
      (getStandaloneMissionTimestamp(row) > getStandaloneMissionTimestamp(existing) ||
        (getStandaloneMissionTimestamp(row) === getStandaloneMissionTimestamp(existing) && row.id > existing.id));

    if (!existing || isNewer) {
      latestByKey.set(key, row);
    }
  }

  return latestByKey;
};

export default function LifeTargetsMissions() {
  const navigate = useNavigate();
  const lifeTargetsBasePath = '/app/life-targets';
  const queryClient = useQueryClient();
  const { currentQuarter, monthlyMissions, setMonthlyMissions, setCurrentStep, changeQuarter } = useLifeTargetsStore();
  const { data: targets } = useQuarterlyTargets(currentQuarter);
  const generateMissions = useMonthlyMissions();
  const saveTargets = useSaveQuarterlyTargets();
  const [selectedDomain, setSelectedDomain] = useState<string>('all');
  const [showChangeDialog, setShowChangeDialog] = useState(false);
  const [primarySelections, setPrimarySelections] = useState<Record<string, boolean | null>>({
    body: null,
    being: null,
    balance: null,
    business: null,
  });
  const missionsRef = useRef<HTMLDivElement>(null);
  const lastStandaloneSyncKeyRef = useRef<string>("");

  // Helper function to check if missions data actually exists
  const hasMissionsData = (missions: MonthlyMissionsOutput | null | undefined): boolean => {
    if (!missions) return false;
    
    // Check if any domain has actual mission data
    return (Object.values(missions) as Array<DomainMissions | undefined>).some(domain => {
      if (!domain || typeof domain !== 'object') return false;
      
      // Check target1 and target2 for month data
      return Object.values(domain).some(target => {
        if (!target || typeof target !== 'object') return false;
        return Object.keys(target).length > 0;
      });
    });
  };

  // Prepare target texts for inline display
  const targetTexts = targets ? {
    body: {
      target1: targets.body_target,
      target2: targets.body_target2,
    },
    being: {
      target1: targets.being_target,
      target2: targets.being_target2,
    },
    balance: {
      target1: targets.balance_target,
      target2: targets.balance_target2,
    },
    business: {
      target1: targets.business_target,
      target2: targets.business_target2,
    },
  } : null;

  const targetMonthlyMissions = useMemo(() => targets ? {
    body: targets.body_monthly_missions,
    being: targets.being_monthly_missions,
    balance: targets.balance_monthly_missions,
    business: targets.business_monthly_missions,
  } as MonthlyMissionsOutput : null, [targets]);

  const targetPrimarySelections = useMemo<PrimarySelections>(() => ({
    body: targets?.body_primary_is_target1 ?? null,
    being: targets?.being_primary_is_target1 ?? null,
    balance: targets?.balance_primary_is_target1 ?? null,
    business: targets?.business_primary_is_target1 ?? null,
  }), [targets]);

  // Load missions from database if they exist
  useEffect(() => {
    if (targets) {
      const missions = {
        body: targets.body_monthly_missions,
        being: targets.being_monthly_missions,
        balance: targets.balance_monthly_missions,
        business: targets.business_monthly_missions,
      };
      if (hasMissionsData(missions as MonthlyMissionsOutput)) {
        setMonthlyMissions(missions as MonthlyMissionsOutput);
      }

      // Load primary selections from database
      setPrimarySelections({
        body: targets.body_primary_is_target1,
        being: targets.being_primary_is_target1,
        balance: targets.balance_primary_is_target1,
        business: targets.business_primary_is_target1,
      });
    }
  }, [targets, setMonthlyMissions]);

  // Auto-generate missions if database has no missions
  useEffect(() => {
    const dbHasMissions = targets && (
      (targets.body_monthly_missions && Object.keys(targets.body_monthly_missions).length > 0) ||
      (targets.being_monthly_missions && Object.keys(targets.being_monthly_missions).length > 0) ||
      (targets.balance_monthly_missions && Object.keys(targets.balance_monthly_missions).length > 0) ||
      (targets.business_monthly_missions && Object.keys(targets.business_monthly_missions).length > 0)
    );
    
    if (targets && !dbHasMissions && !hasMissionsData(monthlyMissions)) {
      handleGenerate();
    }
  }, [targets, monthlyMissions]);

  const getMonthYearForQuarterMonth = (quarter: string, monthName: string): string | null => {
    const monthIndex = MONTH_INDEX_BY_NAME[monthName];
    if (monthIndex === undefined) return null;

    try {
      const { year } = parseQuarter(quarter);
      return `${year}-${String(monthIndex + 1).padStart(2, "0")}`;
    } catch (error) {
      console.error("Invalid quarter while mapping monthly missions:", quarter, error);
      return null;
    }
  };

  const getSelectedTargetKey = (
    domainMissions: MonthlyMissionsOutput[MissionDomain] | undefined,
    isPrimaryTarget1: boolean | null | undefined,
  ): "target1" | "target2" | null => {
    const hasTarget1 = !!domainMissions?.target1 && Object.keys(domainMissions.target1).length > 0;
    const hasTarget2 = !!domainMissions?.target2 && Object.keys(domainMissions.target2).length > 0;

    if (hasTarget1 && hasTarget2) {
      if (isPrimaryTarget1 === true) return "target1";
      if (isPrimaryTarget1 === false) return "target2";
      return null;
    }

    if (hasTarget1) return "target1";
    if (hasTarget2) return "target2";
    return null;
  };

  const syncStandaloneMonthlyMissions = async (
    missions: MonthlyMissionsOutput,
    selections: PrimarySelections,
    quarter: string,
    domainFilter?: MissionDomain,
    previousMissions?: MonthlyMissionsOutput | null,
    previousSelections?: PrimarySelections,
  ) => {
    const candidateRows: StandaloneMissionSyncRow[] = [];

    const domainsToSync = domainFilter ? [domainFilter] : MISSION_DOMAINS;

    for (const domain of domainsToSync) {
      const domainMissions = missions[domain];
      const selectedTarget = getSelectedTargetKey(domainMissions, selections[domain]);
      if (!selectedTarget) continue;

      const selectedMissions = domainMissions?.[selectedTarget];
      if (!selectedMissions) continue;

      const previousDomainMissions = previousMissions?.[domain];
      const previousSelection = previousSelections?.[domain] ?? selections[domain];
      const previousSelectedTarget = previousDomainMissions
        ? getSelectedTargetKey(previousDomainMissions, previousSelection)
        : null;
      const previousSelectedMissions = previousSelectedTarget
        ? previousDomainMissions?.[previousSelectedTarget]
        : null;

      for (const [monthName, missionData] of Object.entries(selectedMissions)) {
        if (!missionData?.mission?.trim()) continue;

        const monthYear = getMonthYearForQuarterMonth(quarter, monthName);
        if (!monthYear) continue;

        const previousMissionData = previousSelectedMissions?.[monthName];

        candidateRows.push({
          domain,
          title: missionData.mission.trim(),
          items: [],
          weekly_measurable: missionData.why?.trim() || null,
          month_year: monthYear,
          status: "active",
          previous_title: previousMissionData?.mission?.trim(),
          previous_weekly_measurable: previousMissionData?.why?.trim() || null,
        });
      }
    }

    if (candidateRows.length === 0) return;

    await syncOwnerStandaloneMonthlyMissions(candidateRows);
  };

  const syncOwnerStandaloneMonthlyMissions = async (candidateRows: StandaloneMissionSyncRow[]) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const uniqueDomains = [...new Set(candidateRows.map((row) => row.domain))];
    const uniqueMonthYears = [...new Set(candidateRows.map((row) => row.month_year))];

    const { data: existingRows, error: existingError } = await supabase
      .from("core4_monthly_missions")
      .select("id, domain, month_year, title, weekly_measurable, created_at, updated_at")
      .eq("user_id", user.id)
      .eq("status", "active")
      .in("domain", uniqueDomains)
      .in("month_year", uniqueMonthYears)
      .order("updated_at", { ascending: false })
      .order("created_at", { ascending: false })
      .order("id", { ascending: false });

    if (existingError) throw existingError;

    const existingByKey = dedupeStandaloneMissionsByKey((existingRows || []) as ExistingStandaloneMission[]);

    const rowsToInsert = candidateRows.filter(
      (row) => !existingByKey.has(`${row.domain}:${row.month_year}`)
    );
    const rowsToUpdate = candidateRows
      .map((row) => ({
        row,
        existing: existingByKey.get(`${row.domain}:${row.month_year}`),
      }))
      .filter(({ row, existing }) => existing && shouldUpdateStandaloneMission(existing, row));

    if (rowsToInsert.length > 0) {
      const { error: insertError } = await supabase
        .from("core4_monthly_missions")
        .insert(rowsToInsert.map((row) => ({
          user_id: user.id,
          domain: row.domain,
          title: row.title,
          items: row.items,
          weekly_measurable: row.weekly_measurable,
          month_year: row.month_year,
          status: row.status,
        })));

      if (insertError) throw insertError;
    }

    await Promise.all(
      rowsToUpdate.map(async ({ row, existing }) => {
        const { error: updateError } = await supabase
          .from("core4_monthly_missions")
          .update({
            title: row.title,
            weekly_measurable: row.weekly_measurable,
            updated_at: new Date().toISOString(),
          })
          .eq("id", existing!.id);

        if (updateError) throw updateError;
      })
    );
  };

  useEffect(() => {
    if (!targets || !hasMissionsData(targetMonthlyMissions)) return;

    const syncKey = `${targets.id ?? currentQuarter}:${targets.updated_at ?? ""}:${JSON.stringify(targetPrimarySelections)}`;
    if (lastStandaloneSyncKeyRef.current === syncKey) return;
    lastStandaloneSyncKeyRef.current = syncKey;

    void syncStandaloneMonthlyMissions(
      targetMonthlyMissions as MonthlyMissionsOutput,
      targetPrimarySelections,
      targets.quarter,
      undefined,
      targetMonthlyMissions,
      targetPrimarySelections,
    ).catch((error) => {
      console.error("Failed to sync quarterly missions into standalone Monthly Missions:", error);
      lastStandaloneSyncKeyRef.current = "";
    });
  }, [targets, currentQuarter, targetMonthlyMissions, targetPrimarySelections]);

  const handleGenerate = async () => {
    if (!targets) {
      toast.error('Please set your quarterly targets first');
      return;
    }

    if (!hasAllPrimaryTargets) {
      toast.error(`Add a quarterly target for ${missingTargetDomains.map((domain) => domain.label).join(", ")} before generating Monthly Missions.`);
      return;
    }

    const params: GenerateMissionsParams = { quarter: currentQuarter };

    if (targets.body_target) {
      params.body = {
        target1: targets.body_target,
        target2: targets.body_target2 || undefined,
        narrative: targets.body_narrative || undefined,
      };
    }
    if (targets.being_target) {
      params.being = {
        target1: targets.being_target,
        target2: targets.being_target2 || undefined,
        narrative: targets.being_narrative || undefined,
      };
    }
    if (targets.balance_target) {
      params.balance = {
        target1: targets.balance_target,
        target2: targets.balance_target2 || undefined,
        narrative: targets.balance_narrative || undefined,
      };
    }
    if (targets.business_target) {
      params.business = {
        target1: targets.business_target,
        target2: targets.business_target2 || undefined,
        narrative: targets.business_narrative || undefined,
      };
    }

    try {
      const results = await generateMissions.mutateAsync(params);
      setMonthlyMissions(results);

      // Save missions to database
      const updatedTargets = {
        ...targets,
        body_monthly_missions: results.body,
        being_monthly_missions: results.being,
        balance_monthly_missions: results.balance,
        business_monthly_missions: results.business,
      };

      await saveTargets.mutateAsync({ data: updatedTargets, showToast: false });
      try {
        await syncStandaloneMonthlyMissions(
          results,
          targetPrimarySelections,
          targets.quarter,
          undefined,
          targetMonthlyMissions,
          targetPrimarySelections,
        );
      } catch (syncError) {
        console.error("Failed to seed standalone Monthly Missions after generation:", syncError);
        toast.error("Monthly missions were generated, but we couldn't sync them into the standalone Monthly Missions page.");
      }
      setCurrentStep('primary');
      
      // Auto-scroll to missions after generation
      setTimeout(() => {
        missionsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    } catch (error) {
      console.error('Failed to generate missions:', error);
    }
  };

  const handleSavePrimary = async (domain: string, isPrimaryTarget1: boolean) => {
    if (!targets) return;

    const updatedTargets = {
      ...targets,
      [`${domain}_primary_is_target1`]: isPrimaryTarget1,
    };

    try {
      await saveTargets.mutateAsync({ data: updatedTargets, showToast: true });
      setPrimarySelections(prev => ({ ...prev, [domain]: isPrimaryTarget1 }));
      try {
        const nextSelections = {
          ...(primarySelections as PrimarySelections),
          [domain]: isPrimaryTarget1,
        };

        const currentMissions = (monthlyMissions ?? {}) as MonthlyMissionsOutput;
        await syncStandaloneMonthlyMissions(
          currentMissions,
          nextSelections,
          targets.quarter,
          domain as MissionDomain,
          currentMissions,
          primarySelections as PrimarySelections,
        );
      } catch (syncError) {
        console.error('Failed to sync primary-target missions into standalone Monthly Missions:', syncError);
        toast.error("Primary target was saved, but we couldn't sync that domain into the standalone Monthly Missions page.");
      }
      toast.success('Primary target saved');
    } catch (error) {
      console.error('Failed to save primary selection:', error);
      toast.error('Failed to save selection');
    }
  };

  const handleEditMission = async (
    domain: string,
    targetType: 'target1' | 'target2',
    month: string,
    newMission: string,
    newWhy: string
  ) => {
    if (!targets) return;

    const missionDomain = domain as MissionDomain;
    const previousMissions = (monthlyMissions ?? {}) as MonthlyMissionsOutput;
    const updatedMissions = {
      ...previousMissions,
      [missionDomain]: {
        ...previousMissions[missionDomain],
        [targetType]: {
          ...previousMissions[missionDomain]?.[targetType],
          [month]: { mission: newMission, why: newWhy }
        }
      }
    } as MonthlyMissionsOutput;

    setMonthlyMissions(updatedMissions);

    await saveTargets.mutateAsync({
      data: {
        ...targets,
        [`${domain}_monthly_missions`]: updatedMissions[missionDomain]
      },
      showToast: true
    });

    try {
      await syncStandaloneMonthlyMissions(
        updatedMissions,
        primarySelections as PrimarySelections,
        targets.quarter,
        missionDomain,
        previousMissions,
        primarySelections as PrimarySelections,
      );
    } catch (syncError) {
      console.error('Failed to sync edited monthly mission into standalone Monthly Missions:', syncError);
      toast.error("Mission was saved, but we couldn't sync that edit into the standalone Monthly Missions page.");
    }
  };

  const handleContinue = () => {
    setCurrentStep('actions');
    navigate(`${lifeTargetsBasePath}/daily`);
  };

  const handleQuarterChange = (newQuarter: string) => {
    changeQuarter(newQuarter);
    queryClient.invalidateQueries({ queryKey: ['quarterly-targets'] });
    toast.success(`Quarter updated. Months now reflect ${formatQuarterDisplay(newQuarter)}`);
  };

  const hasTargets = targets && [
    targets.body_target,
    targets.being_target,
    targets.balance_target,
    targets.business_target,
  ].some(Boolean);

  const missingTargetDomains = targets ? [
    { key: "body", label: "Body", value: targets.body_target },
    { key: "being", label: "Being", value: targets.being_target },
    { key: "balance", label: "Balance", value: targets.balance_target },
    { key: "business", label: "Business", value: targets.business_target },
  ].filter((domain) => !domain.value?.trim()) : [];

  const hasAllPrimaryTargets = targets ? missingTargetDomains.length === 0 : false;

  const domainsWithMultipleTargets = targets ? [
    { key: 'body', label: 'Body', target1: targets.body_target, target2: targets.body_target2 },
    { key: 'being', label: 'Being', target1: targets.being_target, target2: targets.being_target2 },
    { key: 'balance', label: 'Balance', target1: targets.balance_target, target2: targets.balance_target2 },
    { key: 'business', label: 'Business', target1: targets.business_target, target2: targets.business_target2 },
  ].filter(d => d.target1 && d.target2) : [];

  const canContinue = hasMissionsData(monthlyMissions) && (
    domainsWithMultipleTargets.length === 0 || 
    domainsWithMultipleTargets.every(d => primarySelections[d.key] !== null && primarySelections[d.key] !== undefined)
  );

  return (
    <div className="container max-w-6xl py-8 space-y-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate(lifeTargetsBasePath)}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <div className="flex items-center gap-4 mb-1">
              <h1 className="text-3xl font-bold">Monthly Missions</h1>
              <QuarterDisplay
                quarter={currentQuarter}
                onEditClick={() => setShowChangeDialog(true)}
              />
            </div>
            <p className="text-muted-foreground">
              Turn your quarterly targets into monthly suggestions. Empty Monthly Missions slots can be filled from here, and untouched generated missions can refresh without replacing missions you've edited yourself.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Select value={selectedDomain} onValueChange={setSelectedDomain}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Domains</SelectItem>
              <SelectItem value="body">Body</SelectItem>
              <SelectItem value="being">Being</SelectItem>
              <SelectItem value="balance">Balance</SelectItem>
              <SelectItem value="business">Business</SelectItem>
            </SelectContent>
          </Select>

          <Button
            onClick={handleGenerate}
            disabled={!hasTargets || !hasAllPrimaryTargets || generateMissions.isPending}
            variant={hasMissionsData(monthlyMissions) ? "outline" : "default"}
          >
            {generateMissions.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <RefreshCw className="mr-2 h-4 w-4" />
                {hasMissionsData(monthlyMissions) ? 'Refresh Suggestions' : 'Generate Suggestions'}
              </>
            )}
          </Button>
        </div>
      </div>

      {!hasTargets && (
        <div className="text-center py-12 text-muted-foreground">
          <p className="mb-4">Set your quarterly targets first so we can generate monthly suggestions from them.</p>
          <Button onClick={() => navigate(lifeTargetsBasePath)}>
            Create Your Targets
          </Button>
        </div>
      )}

      {hasTargets && !hasAllPrimaryTargets && (
        <Card className="border-destructive/30 bg-destructive/5">
          <CardContent className="p-6">
            <p className="font-semibold">Finish all four Core Four targets first.</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Monthly Missions are built one per domain. Add a target for {missingTargetDomains.map((domain) => domain.label).join(", ")} so Standard Playbook does not duplicate another area or leave a gap.
            </p>
            <Button
              className="mt-4"
              variant="outline"
              onClick={() => navigate(`${lifeTargetsBasePath}/quarterly`)}
            >
              Finish Quarterly Targets
            </Button>
          </CardContent>
        </Card>
      )}

      <div className="space-y-6" ref={missionsRef}>
        <MonthlyMissionsTimeline
          missions={monthlyMissions || {}}
          selectedDomain={selectedDomain === 'all' ? undefined : selectedDomain}
          targetTexts={targetTexts}
          primarySelections={primarySelections}
          onLockIn={handleSavePrimary}
          onEditMission={handleEditMission}
          isLoading={generateMissions.isPending}
          quarter={currentQuarter}
        />
        
        {hasMissionsData(monthlyMissions) && (
          <div className="flex justify-end">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <span className={!canContinue ? "cursor-not-allowed inline-block" : ""}>
                    <Button 
                      onClick={handleContinue}
                      disabled={!canContinue}
                      size="lg"
                      className={canContinue ? "bg-[#2997FF] hover:bg-[#2997FF]" : ""}
                    >
                      {canContinue && <CheckCircle2 className="mr-2 h-4 w-4" />}
                      Continue to Daily Actions
                    </Button>
                  </span>
                </TooltipTrigger>
                {!canContinue && (
                  <TooltipContent>
                    Please select primary targets for domains with 2 targets
                  </TooltipContent>
                )}
              </Tooltip>
            </TooltipProvider>
          </div>
        )}
      </div>

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
