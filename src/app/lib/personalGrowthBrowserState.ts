import { useLifeTargetsStore } from '@/app/lib/lifeTargetsStore';
import { useThetaStore } from '@/app/lib/thetaTrackStore';

export function clearPersonalGrowthBrowserState(): void {
  useLifeTargetsStore.getState().clearActor();
  useThetaStore.getState().clearActor();
  try {
    localStorage.removeItem('life-targets-storage');
    localStorage.removeItem('theta-track-session');
    localStorage.removeItem('theta_session_id');
  } catch {
    // State is already cleared in memory when storage is unavailable.
  }
}
