import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useThetaRequestContext } from "@/app/hooks/useThetaRequestContext";
import { getSupabaseFunctionErrorMessage } from "@/app/lib/supabaseFunctionErrors";

interface CreateTargetsData {
  sessionId: string;
  body: string;
  being: string;
  balance: string;
  business: string;
}

async function invokeTargets(action: string, data: CreateTargetsData) {
  const { data: response, error } = await supabase.functions.invoke('theta_audio_state', {
    body: {
      action,
      sessionId: data.sessionId,
      targets: {
        body: data.body,
        being: data.being,
        balance: data.balance,
        business: data.business,
      },
    },
  });

  if (error) {
    throw new Error(await getSupabaseFunctionErrorMessage(error, {
      fallbackMessage: 'Saving targets failed. Please try again.',
    }));
  }
  if (response?.error) throw new Error(response.error);
  return response?.target;
}

export function useCreateTargets() {
  const queryClient = useQueryClient();
  const request = useThetaRequestContext();

  return useMutation({
    mutationFn: async (data: CreateTargetsData) => {
      if (!request.ready) throw new Error('Not authenticated');
      return invokeTargets('save_targets', data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['theta-targets'] });
    }
  });
}

export function useGetTargetsBySession(sessionId: string) {
  const request = useThetaRequestContext();
  return useQuery({
    queryKey: ['theta-targets', request.actorKey, sessionId],
    queryFn: async () => {
      const { data, error } = await supabase.functions.invoke('theta_audio_state', {
        body: { action: 'get_targets', sessionId },
      });
      if (error) {
        throw new Error(await getSupabaseFunctionErrorMessage(error, {
          fallbackMessage: 'Loading targets failed. Please try again.',
        }));
      }
      if (data?.error) throw new Error(data.error);
      return data?.target ?? null;
    },
    enabled: !!sessionId && request.ready,
  });
}

export function useUpdateTargets() {
  const queryClient = useQueryClient();
  const request = useThetaRequestContext();

  return useMutation({
    mutationFn: async (data: CreateTargetsData & { id: string }) => {
      if (!request.ready) throw new Error('Not authenticated');
      return invokeTargets('save_targets', data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['theta-targets'] });
    }
  });
}
