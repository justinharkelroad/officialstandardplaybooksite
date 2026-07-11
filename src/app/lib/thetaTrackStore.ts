import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { ThetaTargetValues } from '@/app/lib/thetaQuarterlyTargets';

type ThetaTargets = ThetaTargetValues;
type ThetaAffirmations = Record<keyof ThetaTargets, string[]>;

interface ThetaTrackState {
  actorScope: string | null;
  sessionId: string;
  currentStep: number;
  targets: ThetaTargets;
  quarterlyTargetsFingerprint: string | null;
  affirmations: ThetaAffirmations;
  selectedVoice: string | null;
  finalTrackId: string | null;

  // Actions
  setSessionId: (id: string) => void;
  setCurrentStep: (step: number) => void;
  setTargets: (targets: Partial<ThetaTargets>) => void;
  setTargetsFromQuarterly: (targets: ThetaTargets, fingerprint: string) => void;
  setAffirmations: (affirmations: ThetaAffirmations) => void;
  setSelectedVoice: (voice: string) => void;
  setFinalTrackId: (id: string) => void;
  resetForActor: (actorScope: string) => void;
  clearActor: () => void;
  resetSession: () => void;
}

const emptySessionState = {
  sessionId: '',
  currentStep: 1,
  targets: { body: '', being: '', balance: '', business: '' },
  quarterlyTargetsFingerprint: null,
  affirmations: { body: [], being: [], balance: [], business: [] },
  selectedVoice: null,
  finalTrackId: null,
};

function normalizeString(value: unknown, maxLength: number): string {
  return typeof value === 'string' ? value.slice(0, maxLength) : '';
}

export function normalizePersistedThetaTrackState(persistedState: unknown): unknown {
  if (!persistedState || typeof persistedState !== 'object') return persistedState;

  const source = persistedState as Partial<ThetaTrackState>;
  const sourceTargets = source.targets && typeof source.targets === 'object'
    ? source.targets as Partial<ThetaTargets>
    : {};
  const sourceAffirmations = source.affirmations && typeof source.affirmations === 'object'
    ? source.affirmations as Partial<ThetaAffirmations>
    : {};
  const normalizeAffirmations = (value: unknown) =>
    Array.isArray(value)
      ? value.filter((item): item is string => typeof item === 'string').slice(0, 5).map((item) => item.slice(0, 300))
      : [];
  const currentStep = Number.isInteger(source.currentStep) && Number(source.currentStep) >= 1 && Number(source.currentStep) <= 4
    ? Number(source.currentStep)
    : 1;

  return {
    actorScope: typeof source.actorScope === 'string' && /^owner:[^:\s]{1,160}$/i.test(source.actorScope)
      ? source.actorScope
      : null,
    sessionId: normalizeString(source.sessionId, 160),
    currentStep,
    targets: {
      body: normalizeString(sourceTargets.body, 500),
      being: normalizeString(sourceTargets.being, 500),
      balance: normalizeString(sourceTargets.balance, 500),
      business: normalizeString(sourceTargets.business, 500),
    },
    quarterlyTargetsFingerprint: typeof source.quarterlyTargetsFingerprint === 'string'
      ? source.quarterlyTargetsFingerprint.slice(0, 500)
      : null,
    affirmations: {
      body: normalizeAffirmations(sourceAffirmations.body),
      being: normalizeAffirmations(sourceAffirmations.being),
      balance: normalizeAffirmations(sourceAffirmations.balance),
      business: normalizeAffirmations(sourceAffirmations.business),
    },
    selectedVoice: typeof source.selectedVoice === 'string' ? source.selectedVoice.slice(0, 100) : null,
    finalTrackId: typeof source.finalTrackId === 'string' ? source.finalTrackId.slice(0, 160) : null,
  };
}

export const useThetaStore = create<ThetaTrackState>()(
  persist(
    (set) => ({
      actorScope: null,
      ...emptySessionState,

      setSessionId: (id) => set({ sessionId: id }),
      setCurrentStep: (step) => set({ currentStep: step }),
      setTargets: (targets) => set((state) => ({
        targets: { ...state.targets, ...targets }
      })),
      setTargetsFromQuarterly: (targets, fingerprint) => set({
        targets,
        quarterlyTargetsFingerprint: fingerprint,
      }),
      setAffirmations: (affirmations) => set({ affirmations }),
      setSelectedVoice: (voice) => set({ selectedVoice: voice }),
      setFinalTrackId: (id) => set({ finalTrackId: id }),
      resetForActor: (actorScope) => set({
        actorScope,
        ...emptySessionState,
      }),
      clearActor: () => set({
        actorScope: null,
        ...emptySessionState,
      }),
      resetSession: () => set((state) => ({
        actorScope: state.actorScope,
        ...emptySessionState,
      })),
    }),
    {
      name: 'theta-track-session',
      version: 2,
      migrate: normalizePersistedThetaTrackState,
    }
  )
);
