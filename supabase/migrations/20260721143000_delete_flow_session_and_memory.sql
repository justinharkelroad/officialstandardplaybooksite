-- Let a member permanently remove one Flow and every continuity artifact that
-- can still repeat material from it. Keep this as one transaction so history
-- and coach memory cannot disagree after a partial failure.

CREATE OR REPLACE FUNCTION public.delete_my_flow_session(p_session_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF auth.uid() IS NULL OR NOT public.is_active_member(auth.uid()) THEN
    RAISE EXCEPTION 'Active member required';
  END IF;

  IF NOT EXISTS (
    SELECT 1
    FROM public.flow_sessions
    WHERE id = p_session_id
      AND user_id = auth.uid()
  ) THEN
    RAISE EXCEPTION 'Flow session not found';
  END IF;

  -- A later Flow's saved coach reflection can contain rendered text from an
  -- insight owned by this session. Remove those reflections before cascading
  -- the source insight so the deleted material cannot remain visible there.
  DELETE FROM public.flow_coach_messages AS message
  WHERE EXISTS (
    SELECT 1
    FROM public.flow_member_insights AS insight
    WHERE insight.source_session_id = p_session_id
      AND EXISTS (
        SELECT 1
        FROM jsonb_array_elements(
          CASE
            WHEN jsonb_typeof(message.memory_refs) = 'array' THEN message.memory_refs
            ELSE '[]'::jsonb
          END
        ) AS memory_ref
        WHERE memory_ref->>'id' = insight.id::text
      )
  );

  -- Weekly Reflections preserve their generated prose even when source Flows
  -- disappear. Delete affected artifacts so a fresh version can be generated
  -- from the remaining sessions if the member revisits that week.
  DELETE FROM public.weekly_flow_reflections
  WHERE user_id = auth.uid()
    AND p_session_id = ANY(source_session_ids);

  -- Cascades remove this session's challenge logs, coach messages, insights,
  -- attempts, and share records. Other derived links intentionally become
  -- NULL under their existing foreign-key policy.
  DELETE FROM public.flow_sessions
  WHERE id = p_session_id
    AND user_id = auth.uid();

  -- If this was the last remembered Flow, show the memory disclosure again
  -- before any future memory is used.
  IF NOT EXISTS (
    SELECT 1
    FROM public.flow_member_insights
    WHERE user_id = auth.uid()
  ) THEN
    UPDATE public.flow_profiles
    SET coach_memory_announced_at = NULL
    WHERE user_id = auth.uid();
  END IF;
END;
$$;

REVOKE ALL ON FUNCTION public.delete_my_flow_session(uuid) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.delete_my_flow_session(uuid) TO authenticated;
