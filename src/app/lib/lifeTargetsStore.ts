import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { QuarterlyTargets } from '@/app/hooks/useQuarterlyTargets';
import type { MeasurabilityAnalysis } from '@/app/hooks/useTargetMeasurability';
import type { MonthlyMissionsOutput } from '@/app/hooks/useMonthlyMissions';
import type { DailyActionsOutput } from '@/app/hooks/useDailyActions';
import { getCurrentQuarter as getQuarterFromUtils, migrateOldFormat } from './quarterUtils';
import { isValidUUID } from '@/app/lib/validation';


type Quarter = string; // YYYY-QX format (e.g., "2026-Q1")
type FlowStep = 'brainstorm' | 'selection' | 'targets' | 'missions' | 'primary' | 'actions' | 'complete';
const FLOW_STEPS = new Set<FlowStep>([
  'brainstorm',
  'selection',
  'targets',
  'missions',
  'primary',
  'actions',
  'complete',
]);

function normalizePersistedQuarter(value: unknown): Quarter | null {
  if (typeof value !== 'string') return null;
  const migrated = migrateOldFormat(value);
  return /^\d{4}-Q[1-4]$/.test(migrated) ? migrated : null;
}

export function normalizePersistedLifeTargetsState(
  persistedState: unknown,
): unknown {
  if (!persistedState || typeof persistedState !== 'object') {
    return persistedState;
  }

  const state = { ...(persistedState as Partial<LifeTargetsState>) };
  state.actorScope =
    typeof state.actorScope === 'string' && /^owner:[^:\s]{1,160}$/i.test(state.actorScope)
      ? state.actorScope
      : null;
  state.currentQuarter = normalizePersistedQuarter(state.currentQuarter) ?? getQuarterFromUtils();
  state.lastViewedQuarter = normalizePersistedQuarter(state.lastViewedQuarter);

  if (!state.currentStep || !FLOW_STEPS.has(state.currentStep)) {
    state.currentStep = 'brainstorm';
  }

  if (state.currentSessionId && !isValidUUID(state.currentSessionId)) {
    state.currentSessionId = null;
  }

  if (state.selectionSource !== 'auto' && state.selectionSource !== 'manual') {
    state.selectionSource = null;
  }
  state.hasAutoSwitchedThisSession = state.hasAutoSwitchedThisSession === true;

  const isRecord = (value: unknown) => Boolean(value && typeof value === 'object' && !Array.isArray(value));
  state.targets = isRecord(state.targets) ? state.targets : null;
  state.measurabilityResults = isRecord(state.measurabilityResults) ? state.measurabilityResults : null;
  state.monthlyMissions = isRecord(state.monthlyMissions) ? state.monthlyMissions : null;
  state.dailyActions = isRecord(state.dailyActions) ? state.dailyActions : null;
  const selected = isRecord(state.selectedDailyActions)
    ? state.selectedDailyActions as Record<string, unknown>
    : {};
  state.selectedDailyActions = {
    body: Array.isArray(selected.body) ? selected.body.filter((item): item is string => typeof item === 'string') : [],
    being: Array.isArray(selected.being) ? selected.being.filter((item): item is string => typeof item === 'string') : [],
    balance: Array.isArray(selected.balance) ? selected.balance.filter((item): item is string => typeof item === 'string') : [],
    business: Array.isArray(selected.business) ? selected.business.filter((item): item is string => typeof item === 'string') : [],
  };

  return state;
}

interface LifeTargetsState {
  actorScope: string | null;
  currentQuarter: Quarter;
  lastViewedQuarter: Quarter | null; // Track last viewed quarter for better persistence
  hasAutoSwitchedThisSession: boolean; // Prevent multiple auto-switches
  selectionSource: 'auto' | 'manual' | null; // Track how quarter was selected
  currentStep: FlowStep;
  currentSessionId: string | null;
  targets: QuarterlyTargets | null;
  measurabilityResults: MeasurabilityAnalysis | null;
  monthlyMissions: MonthlyMissionsOutput | null;
  dailyActions: DailyActionsOutput | null;
  selectedDailyActions: Record<string, string[]>; // GATE 3: Temporary multi-select storage
  isLoading: boolean;

  // Actions
  setCurrentQuarter: (quarter: Quarter) => void;
  setCurrentQuarterWithSource: (quarter: Quarter, source: 'auto' | 'manual') => void;
  changeQuarter: (quarter: Quarter) => void;
  setCurrentStep: (step: FlowStep) => void;
  setCurrentSessionId: (sessionId: string | null) => void;
  setTargets: (targets: QuarterlyTargets | null) => void;
  setMeasurabilityResults: (results: MeasurabilityAnalysis | null) => void;
  setMonthlyMissions: (missions: MonthlyMissionsOutput | null) => void;
  setDailyActions: (actions: DailyActionsOutput | null) => void;
  setSelectedDailyActions: (selected: Record<string, string[]>) => void;
  setIsLoading: (loading: boolean) => void;
  setHasAutoSwitchedThisSession: (switched: boolean) => void;
  resetForActor: (actorScope: string) => void;
  clearActor: () => void;
  clearTransientData: () => void;
  reset: () => void;
}

// No longer needed - using quarterUtils.getCurrentQuarter()

export const useLifeTargetsStore = create<LifeTargetsState>()(
  persist(
    (set, get) => ({
      actorScope: null,
      currentQuarter: getQuarterFromUtils(),
      lastViewedQuarter: null,
      hasAutoSwitchedThisSession: false,
      selectionSource: null,
      currentStep: 'brainstorm',
      currentSessionId: null,
      targets: null,
      measurabilityResults: null,
      monthlyMissions: null,
      dailyActions: null,
      selectedDailyActions: { body: [], being: [], balance: [], business: [] }, // GATE 3
      isLoading: false,

  setCurrentQuarter: (quarter) => set({ currentQuarter: quarter, lastViewedQuarter: quarter }),
  setCurrentQuarterWithSource: (quarter, source) => set({ 
    currentQuarter: quarter, 
    lastViewedQuarter: quarter, 
    selectionSource: source 
  }),
  changeQuarter: (quarter) => set({ currentQuarter: quarter }), // Relabel only, keep all data
  setCurrentStep: (step) => set({ currentStep: step }),
      setCurrentSessionId: (sessionId) => set({ currentSessionId: sessionId }),
      setTargets: (targets) => set({ targets }),
      setMeasurabilityResults: (results) => set({ measurabilityResults: results }),
      setMonthlyMissions: (missions) => set({ monthlyMissions: missions }),
      setDailyActions: (actions) => set({ dailyActions: actions }),
  setSelectedDailyActions: (selected) => set({ selectedDailyActions: selected }),
  setIsLoading: (loading) => set({ isLoading: loading }),
  setHasAutoSwitchedThisSession: (switched) => set({ hasAutoSwitchedThisSession: switched }),
  resetForActor: (actorScope) => set({
    actorScope,
    currentQuarter: getQuarterFromUtils(),
    lastViewedQuarter: null,
    hasAutoSwitchedThisSession: false,
    selectionSource: null,
    currentStep: 'brainstorm',
    currentSessionId: null,
    targets: null,
    measurabilityResults: null,
    monthlyMissions: null,
    dailyActions: null,
    selectedDailyActions: { body: [], being: [], balance: [], business: [] },
    isLoading: false,
  }),
  clearActor: () => set({
    actorScope: null,
    currentQuarter: getQuarterFromUtils(),
    lastViewedQuarter: null,
    hasAutoSwitchedThisSession: false,
    selectionSource: null,
    currentStep: 'brainstorm',
    currentSessionId: null,
    targets: null,
    measurabilityResults: null,
    monthlyMissions: null,
    dailyActions: null,
    selectedDailyActions: { body: [], being: [], balance: [], business: [] },
    isLoading: false,
  }),
  clearTransientData: () => set({
    measurabilityResults: null,
  }),
  reset: () => set({
        currentStep: 'brainstorm',
        currentSessionId: null,
        targets: null,
        measurabilityResults: null,
        monthlyMissions: null,
        dailyActions: null,
        selectedDailyActions: { body: [], being: [], balance: [], business: [] },
        isLoading: false,
      }),
    }),
    {
      name: 'life-targets-storage',
      version: 4,
      migrate: normalizePersistedLifeTargetsState,
      partialize: (state) => ({
        actorScope: state.actorScope,
        currentQuarter: state.currentQuarter,
        lastViewedQuarter: state.lastViewedQuarter,
        selectionSource: state.selectionSource,
        currentStep: state.currentStep,
        currentSessionId: state.currentSessionId,
        targets: state.targets,
        measurabilityResults: state.measurabilityResults,
        monthlyMissions: state.monthlyMissions,
        dailyActions: state.dailyActions,
        selectedDailyActions: state.selectedDailyActions, // GATE 3
      }),
    }
  )
);
