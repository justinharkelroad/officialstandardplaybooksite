import { useLifeTargetsStore } from '@/app/lib/lifeTargetsStore';
import { useThetaStore } from '@/app/lib/thetaTrackStore';

export function clearPersonalGrowthBrowserState(actorKind?: 'owner' | 'staff'): void {
  const lifeActor = useLifeTargetsStore.getState().actorScope;
  const thetaActor = useThetaStore.getState().actorScope;
  const clearLife = !actorKind || lifeActor?.startsWith(`${actorKind}:`) === true;
  const clearTheta = !actorKind || thetaActor?.startsWith(`${actorKind}:`) === true;

  if (clearLife) useLifeTargetsStore.getState().clearActor();
  if (clearTheta) useThetaStore.getState().clearActor();
  try {
    if (clearLife) localStorage.removeItem('life-targets-storage');
    if (clearTheta) {
      localStorage.removeItem('theta-track-session');
      localStorage.removeItem('theta_session_id');
    }
  } catch {
    // State is already cleared in memory when storage is unavailable.
  }
}
