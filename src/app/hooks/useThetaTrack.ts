import { useMutation } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useThetaRequestContext } from "@/app/hooks/useThetaRequestContext";
import { getSupabaseFunctionErrorMessage } from "@/app/lib/supabaseFunctionErrors";

interface GenerateTrackParams {
  sessionId: string;
  voiceId: string;
}

export function useGenerateThetaTrack() {
  const request = useThetaRequestContext();
  return useMutation({
    mutationFn: async ({ sessionId, voiceId }: GenerateTrackParams) => {
      if (!request.ready) throw new Error('Not authenticated');
      console.log('Generating theta track...');

      const { data, error } = await supabase.functions.invoke('generate_theta_track', {
        body: { sessionId, voiceId }
      });

      if (error) {
        console.error('Edge function error:', error);
        throw new Error(await getSupabaseFunctionErrorMessage(error, {
          fallbackMessage: 'Track generation failed. Please try again.',
        }));
      }

      if (data?.error) {
        throw new Error(data.error);
      }
      if (!data?.trackId || !Array.isArray(data?.segments)) {
        throw new Error('The generated track response was incomplete.');
      }

      return data;
    },
    onError: (error) => {
      console.error('Generate track error:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to generate track');
    }
  });
}
