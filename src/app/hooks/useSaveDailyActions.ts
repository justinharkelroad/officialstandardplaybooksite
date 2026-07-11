import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { migrateOldFormat } from "@/app/lib/quarterUtils";
import { useAuth } from "@/app/lib/auth";
import type { QuarterlyTargets } from "@/app/hooks/useQuarterlyTargets";

interface SaveDailyActionsParams {
  quarter: string;
  selectedActions: Record<string, string[]>;
  showToast?: boolean;
}

interface SaveActionPoolParams {
  quarter: string;
  pool: Record<string, string[]>;
}

export function useSaveDailyActions() {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const actorKey = user?.id ? `owner:${user.id}` : 'owner:pending';

  return useMutation({
    mutationFn: async ({ quarter, selectedActions, showToast = true }: SaveDailyActionsParams) => {
      const normalizedQuarter = migrateOldFormat(quarter);

      if (!user) throw new Error('Not authenticated');

      const { error } = await supabase
        .from('life_targets_quarterly')
        .update({
          body_daily_actions: selectedActions.body || [],
          being_daily_actions: selectedActions.being || [],
          balance_daily_actions: selectedActions.balance || [],
          business_daily_actions: selectedActions.business || [],
          updated_at: new Date().toISOString(),
        })
        .eq('user_id', user.id)
        .eq('quarter', normalizedQuarter);

      if (error) throw error;

      if (showToast) {
        toast.success('Daily actions saved');
      }

      return { quarter: normalizedQuarter, selectedActions };
    },
    onSuccess: ({ quarter }) => {
      queryClient.invalidateQueries({ queryKey: ['quarterly-targets', actorKey, quarter] });
      queryClient.invalidateQueries({ queryKey: ['quarterly-targets-history', actorKey] });
    },
    onError: (error) => {
      console.error('Save daily actions error:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to save daily actions');
    }
  });
}

// Persists the full generated action pool so it survives reload / cache
// invalidation. Called after Generate, Edit, and Add Custom — anywhere the
// pool changes. Selections are saved separately via useSaveDailyActions.
export function useSaveActionPool() {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const actorKey = user?.id ? `owner:${user.id}` : 'owner:pending';

  return useMutation({
    mutationFn: async ({ quarter, pool }: SaveActionPoolParams) => {
      const normalizedQuarter = migrateOldFormat(quarter);

      if (!user) throw new Error('Not authenticated');

      const { error } = await supabase
        .from('life_targets_quarterly')
        .update({
          body_action_pool: pool.body || [],
          being_action_pool: pool.being || [],
          balance_action_pool: pool.balance || [],
          business_action_pool: pool.business || [],
          updated_at: new Date().toISOString(),
        })
        .eq('user_id', user.id)
        .eq('quarter', normalizedQuarter);

      if (error) throw error;
      return { quarter: normalizedQuarter, pool };
    },
    onSuccess: ({ quarter, pool }) => {
      // Update the cached row in place instead of invalidating. The Daily
      // page's hydration effect is gated to once per quarter, so an
      // invalidate here would be a no-op on that page, but other readers of
      // the active quarterly-targets query should still see the fresh pool
      // without triggering a refetch that could race with selection saves.
      queryClient.setQueryData<QuarterlyTargets | null>(
        ['quarterly-targets', actorKey, quarter],
        (prev) => prev ? {
          ...prev,
          body_action_pool: pool.body || [],
          being_action_pool: pool.being || [],
          balance_action_pool: pool.balance || [],
          business_action_pool: pool.business || [],
        } : prev
      );
      queryClient.invalidateQueries({ queryKey: ['quarterly-targets-history', actorKey] });
    },
    onError: (error) => {
      console.error('Save action pool error:', error);
      // Pool save failures are non-fatal — the UI still works from local
      // state, the user just loses the pool on reload. Silent console log
      // matches the tolerance level of the existing auto-save path.
    }
  });
}
