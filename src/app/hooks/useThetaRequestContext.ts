import { useAuth } from '@/app/lib/auth';

export function useThetaRequestContext() {
  const { user, loading } = useAuth();

  return {
    actorKey: user?.id ? `owner:${user.id}` : 'owner:pending',
    ready: !loading && !!user?.id,
  };
}
