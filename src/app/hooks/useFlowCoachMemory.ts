import { useCallback, useEffect, useRef, useState } from 'react';
import { supabase } from '@/app/lib/supabaseClient';
import { useAuth } from '@/app/lib/auth';

export interface FlowCoachInsight {
  id: string;
  flow_slug: string | null;
  session_title: string | null;
  kind: 'quote' | 'commitment' | 'pattern' | 'fact' | 'breakthrough';
  content: string;
  created_at: string;
}

export function useFlowCoachMemory() {
  const { user } = useAuth();
  const [insights, setInsights] = useState<FlowCoachInsight[]>([]);
  const [insightCount, setInsightCount] = useState(0);
  const [paused, setPausedState] = useState(false);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const requestVersionRef = useRef(0);

  const fetchMemory = useCallback(async () => {
    const requestVersion = ++requestVersionRef.current;
    if (!user?.id) {
      setInsights([]);
      setInsightCount(0);
      setPausedState(false);
      setError(null);
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const [insightResult, profileResult] = await Promise.all([
        supabase.from('flow_member_insights')
          .select('id,flow_slug,session_title,kind,content,created_at', { count: 'exact' })
          .eq('user_id', user.id).order('created_at', { ascending: false }).limit(200),
        supabase.from('flow_profiles').select('coach_memory_paused').eq('user_id', user.id).maybeSingle(),
      ]);
      if (requestVersion !== requestVersionRef.current) return;
      if (insightResult.error || profileResult.error) {
        setError('Coach memory could not be loaded.');
        return;
      }
      setInsights((insightResult.data ?? []) as FlowCoachInsight[]);
      setInsightCount(insightResult.count ?? insightResult.data?.length ?? 0);
      setPausedState(Boolean(profileResult.data?.coach_memory_paused));
    } catch {
      if (requestVersion === requestVersionRef.current) setError('Coach memory could not be loaded.');
    } finally {
      if (requestVersion === requestVersionRef.current) setLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    void fetchMemory();
    return () => { requestVersionRef.current += 1; };
  }, [fetchMemory]);

  const setPaused = async (nextPaused: boolean) => {
    if (!user?.id) return false;
    setUpdating(true);
    try {
      const { error: updateError } = await supabase.from('flow_profiles').upsert({
        user_id: user.id,
        coach_memory_paused: nextPaused,
      }, { onConflict: 'user_id' });
      if (!updateError) setPausedState(nextPaused);
      return !updateError;
    } catch {
      return false;
    } finally {
      setUpdating(false);
    }
  };

  const deleteAll = async () => {
    if (!user?.id) return false;
    setUpdating(true);
    try {
      const { error: deleteError } = await supabase.rpc('delete_my_flow_coach_memory');
      if (!deleteError) {
        setInsights([]);
        setInsightCount(0);
      }
      return !deleteError;
    } catch {
      return false;
    } finally {
      setUpdating(false);
    }
  };

  return { insights, insightCount, paused, loading, updating, error, setPaused, deleteAll, refetch: fetchMemory };
}
