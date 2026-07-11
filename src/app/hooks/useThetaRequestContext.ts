import { useLocation } from 'react-router-dom';
import { useAuth } from '@/app/lib/auth';
import { useStaffAuth } from '@/app/hooks/useStaffAuth';

export function useThetaRequestContext() {
  const { pathname } = useLocation();
  const { user, loading: ownerLoading } = useAuth();
  const { user: staffUser, sessionToken, loading: staffLoading } = useStaffAuth();
  const staffMode = pathname.startsWith('/staff/');
  const actorId = staffMode ? staffUser?.id : user?.id;

  return {
    staffMode,
    actorKey: actorId
      ? `${staffMode ? 'staff' : 'owner'}:${actorId}`
      : `${staffMode ? 'staff' : 'owner'}:pending`,
    ready: staffMode
      ? !staffLoading && !!staffUser?.id && !!sessionToken
      : !ownerLoading && !!user?.id,
    headers: staffMode && sessionToken
      ? { 'x-staff-session': sessionToken }
      : undefined,
  };
}
