import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import type { QuarterlyTargets } from "./useQuarterlyTargets";
import { useAuth } from "@/app/lib/auth";

export type QuarterlyTargetsSummary = QuarterlyTargets;

export function useQuarterlyTargetsHistory() {
  const { user, loading: ownerLoading } = useAuth();
  const actorKey = user?.id ? `owner:${user.id}` : 'owner:pending';
  const authReady = !ownerLoading && !!user?.id;

  return useQuery({
    queryKey: ['quarterly-targets-history', actorKey],
    queryFn: async () => {
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('life_targets_quarterly')
        .select('*')
        .eq('user_id', user.id)
        .order('quarter', { ascending: false });

      if (error) throw error;
      return data as QuarterlyTargetsSummary[];
    },
    enabled: authReady,
  });
}

export function useDeleteQuarterlyTargets() {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const actorKey = user?.id ? `owner:${user.id}` : 'owner:pending';

  return useMutation({
    mutationFn: async (id: string) => {
      if (!user) throw new Error('Not authenticated');

      const { error } = await supabase
        .from('life_targets_quarterly')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['quarterly-targets', actorKey] });
      queryClient.invalidateQueries({ queryKey: ['quarterly-targets-history', actorKey] });
      toast.success('Quarterly plan deleted successfully');
    },
    onError: (error) => {
      console.error('Delete error:', error);
      toast.error('Failed to delete quarterly plan');
    },
  });
}
