import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/app/lib/auth";
import { getSupabaseFunctionErrorMessage } from "@/app/lib/supabaseFunctionErrors";
import {
  getBrowserTimezone,
  getWeeklyReflectionWindow,
} from "@/app/lib/weeklyReflectionWeek";
import {
  parseWeeklyFlowReflectionHistoryResponse,
  parseWeeklyFlowReflectionResponse,
} from "@/app/lib/weeklyReflectionResponse";
import { supabase } from "@/integrations/supabase/client";
import type {
  WeeklyFlowReflectionResponse,
  WeeklyReflectionRequestWindow,
} from "@/app/types/weeklyReflection";

const FUNCTION_NAME = "weekly_flow_reflection";

async function invokeWeeklyReflection(
  action: "get_or_generate" | "refresh",
  window: WeeklyReflectionRequestWindow,
): Promise<WeeklyFlowReflectionResponse> {
  const { data, error } = await supabase.functions.invoke(FUNCTION_NAME, {
    body: {
      action,
      weekKey: window.weekKey,
      timezone: window.timezone,
      weekStartIso: window.weekStartIso,
      weekEndIso: window.weekEndIso,
    },
  });

  if (error) {
    throw new Error(
      await getSupabaseFunctionErrorMessage(error, {
        fallbackMessage: "Weekly Reflection could not load. Please try again.",
      }),
    );
  }

  if (data?.error) {
    throw new Error(
      typeof data.error === "string"
        ? data.error
        : data.error.message || "Weekly Reflection could not load.",
    );
  }

  return parseWeeklyFlowReflectionResponse(data);
}

/**
 * Quietly asks the server to refresh the current local week after a Flow is
 * analyzed. This intentionally catches failures so callers can fire and forget
 * without interrupting Flow completion or showing a duplicate toast.
 */
export async function refreshCurrentWeeklyReflection(
  date: Date = new Date(),
  timezone: string = getBrowserTimezone(),
): Promise<boolean> {
  try {
    await invokeWeeklyReflection(
      "get_or_generate",
      getWeeklyReflectionWindow(date, timezone),
    );
    return true;
  } catch {
    return false;
  }
}

export function useWeeklyFlowReflection(window: WeeklyReflectionRequestWindow) {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const queryKey = [
    "weekly-flow-reflection",
    user?.id,
    window.weekKey,
    window.timezone,
    window.weekStartIso,
    window.weekEndIso,
  ] as const;

  const query = useQuery({
    queryKey,
    queryFn: () => invokeWeeklyReflection("get_or_generate", window),
    enabled: Boolean(user?.id),
    staleTime: 30_000,
    retry: 1,
    refetchOnWindowFocus: false,
    refetchInterval: (activeQuery) =>
      activeQuery.state.data?.reflection?.generationStatus === "generating"
        ? 2_500
        : false,
  });

  const refreshMutation = useMutation({
    mutationFn: () => invokeWeeklyReflection("refresh", window),
    onSuccess: async (response) => {
      queryClient.setQueryData(queryKey, response);
      await queryClient.invalidateQueries({
        queryKey: ["weekly-flow-reflection-history", user?.id],
      });
    },
  });

  const reflection = query.data?.reflection ?? null;
  const memoryPaused =
    reflection?.generationStatus === "paused" ||
    query.data?.memoryPaused === true ||
    query.data?.memory_paused === true;

  return {
    ...query,
    reflection,
    memoryPaused,
    refreshError: query.data?.refreshError ?? null,
    refresh: refreshMutation.mutateAsync,
    isRefreshing: refreshMutation.isPending,
    refreshFailure: refreshMutation.error,
  };
}

export function useWeeklyFlowReflectionHistory(timezone: string, limit = 26) {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["weekly-flow-reflection-history", user?.id, timezone, limit],
    queryFn: async () => {
      const { data, error } = await supabase.functions.invoke(FUNCTION_NAME, {
        body: { action: "history", timezone, limit },
      });

      if (error) {
        throw new Error(
          await getSupabaseFunctionErrorMessage(error, {
            fallbackMessage: "Reflection history could not load.",
          }),
        );
      }

      if (data?.error) {
        throw new Error(
          typeof data.error === "string"
            ? data.error
            : data.error.message || "Reflection history could not load.",
        );
      }

      return parseWeeklyFlowReflectionHistoryResponse(data);
    },
    enabled: Boolean(user?.id),
    staleTime: 5 * 60_000,
    retry: 1,
    refetchOnWindowFocus: false,
  });
}
