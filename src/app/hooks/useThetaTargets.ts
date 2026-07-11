import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useThetaRequestContext } from "@/app/hooks/useThetaRequestContext";

interface CreateTargetsData {
  sessionId: string;
  body: string;
  being: string;
  balance: string;
  business: string;
}

async function invokeTargets(action: string, data: CreateTargetsData, headers?: Record<string, string>) {
  const { data: response, error } = await supabase.functions.invoke('theta_audio_state', {
    headers,
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

  if (error) throw error;
  if (response?.error) throw new Error(response.error);
  return response?.target;
}

export function useCreateTargets() {
  const queryClient = useQueryClient();
  const request = useThetaRequestContext();
  
  return useMutation({
    mutationFn: async (data: CreateTargetsData) => {
      if (!request.ready) throw new Error('Not authenticated');
      return invokeTargets('save_targets', data, request.headers);
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
        headers: request.headers,
        body: { action: 'get_targets', sessionId },
      });
      if (error) throw error;
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
      return invokeTargets('save_targets', data, request.headers);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['theta-targets'] });
    }
  });
}
