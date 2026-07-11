import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useDeleteQuarterlyTargets } from "./useQuarterlyTargetsHistory";
import { useClearBrainstormSession } from "./useBrainstormTargets";
import { useLifeTargetsStore } from "@/app/lib/lifeTargetsStore";
import { generateSessionId } from "@/app/lib/sessionUtils";

interface ResetQuarterParams {
  quarter: string;
  quarterlyTargetId: string | null;
  sessionId: string | null;
}

export function useResetQuarter() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const isStaffPortal = pathname.startsWith('/staff/');
  const queryClient = useQueryClient();
  const deleteQuarterlyTargets = useDeleteQuarterlyTargets();
  const clearBrainstormSession = useClearBrainstormSession();
  const { reset: resetStore, setCurrentSessionId } = useLifeTargetsStore();

  return useMutation({
    mutationFn: async (params: ResetQuarterParams) => {
      const { quarterlyTargetId, sessionId, quarter } = params;
      // Delete saved quarterly targets if they exist
      if (quarterlyTargetId) {
        await deleteQuarterlyTargets.mutateAsync(quarterlyTargetId);
      }
      
      // Brainstorm targets are stored against auth.users and are not part of
      // the staff-owned Life Targets path.
      if (!isStaffPortal && sessionId) {
        await clearBrainstormSession.mutateAsync({ quarter, sessionId });
      }
    },
    onSuccess: (_, params) => {
      // Reset store state
      resetStore();
      
      // Generate new session ID
      const newSessionId = generateSessionId();
      setCurrentSessionId(newSessionId);
      
      // Invalidate all related queries
      queryClient.invalidateQueries({ queryKey: ['quarterly-targets'] });
      queryClient.invalidateQueries({ queryKey: ['quarterly-targets-history'] });
      queryClient.invalidateQueries({ queryKey: ['brainstorm-targets'] });
      
      // Navigate to targets page to start fresh
      navigate(isStaffPortal ? '/staff/life-targets/quarterly' : '/life-targets/quarterly');
      
      toast.success('Quarter reset. Starting fresh!');
    },
    onError: (error) => {
      console.error('Error resetting quarter:', error);
      toast.error('Failed to reset quarter. Please try again.');
    },
  });
}
