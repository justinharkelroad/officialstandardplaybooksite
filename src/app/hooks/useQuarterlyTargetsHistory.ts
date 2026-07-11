import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import type { QuarterlyTargets } from "./useQuarterlyTargets";
import { useLocation } from "react-router-dom";
import { useAuth } from "@/app/lib/auth";
import { useStaffAuth } from "@/app/hooks/useStaffAuth";

export type QuarterlyTargetsSummary = QuarterlyTargets;

export function useQuarterlyTargetsHistory() {
  const { pathname } = useLocation();
  const staffMode = pathname.startsWith('/staff/');
  const { user, loading: ownerLoading } = useAuth();
  const { user: staffUser, sessionToken, loading: staffLoading } = useStaffAuth();
  const actorKey = staffMode
    ? (staffUser?.id ? `staff:${staffUser.id}` : 'staff:pending')
    : (user?.id ? `owner:${user.id}` : 'owner:pending');
  const authReady = staffMode
    ? !staffLoading && !!staffUser?.id && !!sessionToken
    : !ownerLoading && !!user?.id;

  return useQuery({
    queryKey: ['quarterly-targets-history', actorKey],
    queryFn: async () => {
      if (staffMode) {
        if (!sessionToken) throw new Error('Not authenticated');

        const { data, error } = await supabase.functions.invoke('staff_life_targets', {
          headers: { 'x-staff-session': sessionToken },
          body: { action: 'list' },
        });

        if (error) throw error;
        if (data?.error) throw new Error(data.error);
        return (data?.targets || []) as QuarterlyTargetsSummary[];
      }

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
  const { pathname } = useLocation();
  const staffMode = pathname.startsWith('/staff/');
  const { user } = useAuth();
  const { user: staffUser, sessionToken } = useStaffAuth();
  const actorKey = staffMode
    ? (staffUser?.id ? `staff:${staffUser.id}` : 'staff:pending')
    : (user?.id ? `owner:${user.id}` : 'owner:pending');

  return useMutation({
    mutationFn: async (id: string) => {
      if (staffMode) {
        if (!sessionToken) throw new Error('Not authenticated');

        const { data, error } = await supabase.functions.invoke('staff_life_targets', {
          headers: { 'x-staff-session': sessionToken },
          body: { action: 'delete', id },
        });

        if (error) throw error;
        if (data?.error) throw new Error(data.error);
        return;
      }

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
