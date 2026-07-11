import { useMutation, useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useThetaRequestContext } from "@/app/hooks/useThetaRequestContext";
import { getSupabaseFunctionErrorMessage } from "@/app/lib/supabaseFunctionErrors";

export type Tone = 'inspiring' | 'motivational' | 'calm' | 'energizing';

export interface AffirmationSet {
  body: string[];
  being: string[];
  balance: string[];
  business: string[];
}

interface GenerateAffirmationsParams {
  sessionId: string;
  tone: string;
}

export function useGenerateAffirmations() {
  const request = useThetaRequestContext();
  return useMutation({
    mutationFn: async ({ sessionId, tone }: GenerateAffirmationsParams) => {
      if (!request.ready) throw new Error('Not authenticated');
      console.log('Generating affirmations with tone:', tone);
      const { data, error } = await supabase.functions.invoke('generate_affirmations', {
        body: { sessionId, tone }
      });

      if (error) {
        console.error('Edge function error:', error);
        throw new Error(await getSupabaseFunctionErrorMessage(error, {
          fallbackMessage: 'Affirmation generation failed. Please try again.',
        }));
      }

      if (data?.error) {
        throw new Error(data.error);
      }
      if (!data?.affirmations) throw new Error('No affirmations were returned.');

      return data.affirmations as AffirmationSet;
    },
    onError: (error) => {
      console.error('Generate affirmations error:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to generate affirmations');
    }
  });
}

export function useSaveAffirmations() {
  const request = useThetaRequestContext();
  return useMutation({
    mutationFn: async ({
      sessionId,
      affirmations,
      tone
    }: {
      sessionId: string;
      affirmations: AffirmationSet;
      tone: Tone;
    }) => {
      if (!request.ready) throw new Error('Not authenticated');
      const { data, error } = await supabase.functions.invoke('theta_audio_state', {
        body: {
          action: 'save_affirmations',
          sessionId,
          affirmations,
          tone,
        },
      });
      if (error) {
        throw new Error(await getSupabaseFunctionErrorMessage(error, {
          fallbackMessage: 'Saving affirmations failed. Please try again.',
        }));
      }
      if (data?.error) throw new Error(data.error);
      return data?.affirmations ?? [];
    },
    onSuccess: () => {
      toast.success('Affirmations saved successfully');
    },
    onError: (error) => {
      console.error('Save affirmations error:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to save affirmations');
    }
  });
}

export function useGetAffirmations(sessionId: string) {
  const request = useThetaRequestContext();
  return useQuery({
    queryKey: ['theta-affirmations', request.actorKey, sessionId],
    queryFn: async () => {
      const { data, error } = await supabase.functions.invoke('theta_audio_state', {
        body: { action: 'get_affirmations', sessionId },
      });
      if (error) {
        throw new Error(await getSupabaseFunctionErrorMessage(error, {
          fallbackMessage: 'Loading affirmations failed. Please try again.',
        }));
      }
      if (data?.error) throw new Error(data.error);

      // Group by category
      const grouped: AffirmationSet = {
        body: [],
        being: [],
        balance: [],
        business: []
      };

      (data?.affirmations ?? []).forEach((aff: { category: string; text: string }) => {
        if (aff.category in grouped) {
          grouped[aff.category as keyof AffirmationSet].push(aff.text);
        }
      });

      return grouped;
    },
    enabled: !!sessionId && request.ready,
  });
}
