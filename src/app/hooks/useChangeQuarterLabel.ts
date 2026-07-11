import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { remapMonthlyMissions } from "@/app/lib/quarterUtils";
import { useLocation } from "react-router-dom";
import { useAuth } from "@/app/lib/auth";
import { useStaffAuth } from "@/app/hooks/useStaffAuth";

export function useChangeQuarterLabel() {
  const queryClient = useQueryClient();
  const { pathname } = useLocation();
  const staffMode = pathname.startsWith('/staff/');
  const { user } = useAuth();
  const { user: staffUser, sessionToken } = useStaffAuth();
  const actorKey = staffMode
    ? (staffUser?.id ? `staff:${staffUser.id}` : 'staff:pending')
    : (user?.id ? `owner:${user.id}` : 'owner:pending');
  
  return useMutation({
    mutationFn: async ({ fromQuarter, toQuarter }: { fromQuarter: string, toQuarter: string }) => {
      if (staffMode) {
        if (!sessionToken) throw new Error('Not authenticated');
        const { data, error } = await supabase.functions.invoke('staff_life_targets', {
          headers: { 'x-staff-session': sessionToken },
          body: { action: 'move', fromQuarter, toQuarter },
        });
        if (error) throw error;
        if (data?.error) throw new Error(data.error);
        return data.target;
      }

      if (!user) throw new Error('Not authenticated');
      
      // Check if target quarter already has data
      const { data: existing } = await supabase
        .from('life_targets_quarterly')
        .select('id')
        .eq('user_id', user.id)
        .eq('quarter', toQuarter)
        .maybeSingle();
      
      if (existing) {
        throw new Error('Target quarter already has data. Please choose a different quarter or delete the existing plan first.');
      }
      
      // Fetch existing data to remap missions
      const { data: existingData, error: fetchError } = await supabase
        .from('life_targets_quarterly')
        .select('*')
        .eq('user_id', user.id)
        .eq('quarter', fromQuarter)
        .single();
      
      if (fetchError) throw fetchError;
      
      // Remap all monthly missions to new quarter's months
      const moveFields = {
        quarter: toQuarter,
        body_monthly_missions: remapMonthlyMissions(
          existingData.body_monthly_missions,
          fromQuarter,
          toQuarter
        ),
        being_monthly_missions: remapMonthlyMissions(
          existingData.being_monthly_missions,
          fromQuarter,
          toQuarter
        ),
        balance_monthly_missions: remapMonthlyMissions(
          existingData.balance_monthly_missions,
          fromQuarter,
          toQuarter
        ),
        business_monthly_missions: remapMonthlyMissions(
          existingData.business_monthly_missions,
          fromQuarter,
          toQuarter
        ),
      };
      
      // Move atomically so a failed write cannot delete the source plan. Only
      // update fields that change; all target content remains on this row.
      const { data, error: updateError } = await supabase
        .from('life_targets_quarterly')
        .update(moveFields)
        .eq('user_id', user.id)
        .eq('quarter', fromQuarter)
        .select()
        .single();
      
      if (updateError) throw updateError;
      return data;
    },
    onSuccess: (_, { toQuarter }) => {
      queryClient.invalidateQueries({ queryKey: ['quarterly-targets', actorKey] });
      queryClient.invalidateQueries({ queryKey: ['quarterly-targets-history', actorKey] });
      toast.success(`Plan successfully moved to ${toQuarter}`);
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to move quarter');
    }
  });
}
