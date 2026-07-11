import { useMutation } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { getSupabaseFunctionErrorMessage } from "@/app/lib/supabaseFunctionErrors";
import { toast } from "sonner";

export interface DailyActionsOutput {
  body: string[];
  being: string[];
  balance: string[];
  business: string[];
}

interface GenerateDailyActionsParams {
  body?: {
    target?: string;
    monthlyMissions?: Record<string, unknown>;
    narrative?: string;
  };
  being?: {
    target?: string;
    monthlyMissions?: Record<string, unknown>;
    narrative?: string;
  };
  balance?: {
    target?: string;
    monthlyMissions?: Record<string, unknown>;
    narrative?: string;
  };
  business?: {
    target?: string;
    monthlyMissions?: Record<string, unknown>;
    narrative?: string;
  };
}

export function useDailyActions() {
  return useMutation({
    mutationFn: async (params: GenerateDailyActionsParams) => {
      const { data, error } = await supabase.functions.invoke('life_targets_daily_actions', {
        body: params
      });

      if (error) {
        console.error('Edge function error:', error);
        throw new Error(await getSupabaseFunctionErrorMessage(error, { fallbackMessage: 'AI analysis failed' }));
      }

      if (data.error) {
        throw new Error(data.error);
      }

      return data.dailyActions as DailyActionsOutput;
    },
    onSuccess: () => {
      toast.success('Daily actions generated');
    },
    onError: (error) => {
      console.error('Generate daily actions error:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to generate daily actions');
    }
  });
}
