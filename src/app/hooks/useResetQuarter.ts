import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useLifeTargetsStore } from "@/app/lib/lifeTargetsStore";
import { generateSessionId } from "@/app/lib/sessionUtils";
import { supabase } from "@/integrations/supabase/client";

interface ResetQuarterParams {
  quarter: string;
}

export function useResetQuarter() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { reset: resetStore, setCurrentSessionId } = useLifeTargetsStore();

  return useMutation({
    mutationFn: async ({ quarter }: ResetQuarterParams) => {
      const { error } = await supabase.rpc('reset_my_life_targets_quarter', {
        p_quarter: quarter,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      // Reset store state
      resetStore();

      // Generate new session ID
      const newSessionId = generateSessionId();
      setCurrentSessionId(newSessionId);

      // Invalidate all related queries
      queryClient.invalidateQueries({ queryKey: ['quarterly-targets'] });
      queryClient.invalidateQueries({ queryKey: ['quarterly-targets-history'] });
      queryClient.invalidateQueries({ queryKey: ['brainstorm-targets'] });

      // Start at Brain Dump with a clean server-backed quarter.
      navigate('/app/life-targets/brainstorm');

      toast.success('Quarter reset. Starting fresh!');
    },
    onError: (error) => {
      console.error('Error resetting quarter:', error);
      toast.error('Failed to reset quarter. Please try again.');
    },
  });
}
