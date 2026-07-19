import { supabase } from "@/app/lib/supabaseClient";
import type { FlowAnalysis } from "@/app/types/flows";

type WaitForFlowAnalysisOptions = {
  attempts?: number;
  intervalMs?: number;
};

function wait(intervalMs: number) {
  return new Promise((resolve) => window.setTimeout(resolve, intervalMs));
}

/**
 * A Flow can finish while its server-side analysis is already being prepared
 * by another request. Poll the saved session so both completion screens converge
 * on the same analysis without starting another model call.
 */
export async function waitForFlowAnalysis(
  sessionId: string,
  options: WaitForFlowAnalysisOptions = {},
): Promise<FlowAnalysis | null> {
  const attempts = Math.max(1, options.attempts ?? 30);
  const intervalMs = Math.max(250, options.intervalMs ?? 1_000);

  for (let attempt = 0; attempt < attempts; attempt += 1) {
    const { data, error } = await supabase
      .from("flow_sessions")
      .select("ai_analysis_json")
      .eq("id", sessionId)
      .maybeSingle();

    if (error) throw error;
    if (data?.ai_analysis_json) {
      return data.ai_analysis_json as unknown as FlowAnalysis;
    }

    if (attempt < attempts - 1) await wait(intervalMs);
  }

  return null;
}
