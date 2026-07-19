ALTER TABLE public.flow_sessions
  ADD COLUMN IF NOT EXISTS analysis_generation_started_at timestamptz,
  ADD COLUMN IF NOT EXISTS analysis_generation_completed_at timestamptz;

CREATE TABLE public.weekly_flow_reflections (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  week_key text NOT NULL CHECK (week_key ~ '^[0-9]{4}-W(0[1-9]|[1-4][0-9]|5[0-3])$'),
  week_start date NOT NULL,
  week_end date NOT NULL,
  timezone text NOT NULL CHECK (char_length(timezone) BETWEEN 1 AND 100),
  range_start_at timestamptz NOT NULL,
  range_end_at timestamptz NOT NULL,

  source_hash text NOT NULL,
  content_source_hash text,
  source_version bigint NOT NULL DEFAULT 1 CHECK (source_version > 0),
  generation_status text NOT NULL DEFAULT 'generating'
    CHECK (generation_status IN ('empty', 'generating', 'ready', 'failed')),
  generation_started_at timestamptz,
  generated_at timestamptz,
  model text,
  prompt_version text,
  last_error text,

  source_session_ids uuid[] NOT NULL DEFAULT '{}'::uuid[],
  source_count integer NOT NULL DEFAULT 0 CHECK (source_count >= 0),
  source_day_count integer NOT NULL DEFAULT 0 CHECK (source_day_count >= 0),
  reflection_json jsonb NOT NULL DEFAULT jsonb_build_object(
    'headline', '',
    'reflection', '',
    'signals', jsonb_build_array(),
    'iam_statements', jsonb_build_array(),
    'source_flows', jsonb_build_array(),
    'source_count', 0,
    'source_day_count', 0
  ) CHECK (jsonb_typeof(reflection_json) = 'object'),

  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),

  UNIQUE (user_id, week_key),
  CHECK (week_end = week_start + 6),
  CHECK (range_end_at > range_start_at),
  CHECK (source_day_count <= source_count),
  CHECK (cardinality(source_session_ids) = source_count)
);

CREATE INDEX weekly_flow_reflections_user_week_idx
  ON public.weekly_flow_reflections (user_id, week_start DESC);

ALTER TABLE public.weekly_flow_reflections ENABLE ROW LEVEL SECURITY;

REVOKE ALL ON public.weekly_flow_reflections FROM anon;
REVOKE ALL ON public.weekly_flow_reflections FROM authenticated;
GRANT SELECT ON public.weekly_flow_reflections TO authenticated;

CREATE POLICY "weekly_flow_reflections_select_own"
  ON public.weekly_flow_reflections FOR SELECT
  USING (public.is_active_member(auth.uid()) AND user_id = auth.uid());

CREATE OR REPLACE FUNCTION public.guard_weekly_flow_reflection_memory_pause()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  IF NEW.generation_status = 'ready'
    AND (
      NEW.reflection_json IS DISTINCT FROM OLD.reflection_json
      OR NEW.content_source_hash IS DISTINCT FROM OLD.content_source_hash
    )
    AND EXISTS (
      SELECT 1
      FROM public.flow_profiles
      WHERE user_id = NEW.user_id
        AND coach_memory_paused = true
    )
  THEN
    RAISE EXCEPTION 'weekly_flow_reflection_memory_paused';
  END IF;

  RETURN NEW;
END;
$$;

CREATE TRIGGER guard_weekly_flow_reflection_memory_pause
  BEFORE UPDATE ON public.weekly_flow_reflections
  FOR EACH ROW EXECUTE FUNCTION public.guard_weekly_flow_reflection_memory_pause();

CREATE TRIGGER update_weekly_flow_reflections_updated_at
  BEFORE UPDATE ON public.weekly_flow_reflections
  FOR EACH ROW EXECUTE FUNCTION public.member_app_set_updated_at();

CREATE OR REPLACE FUNCTION public.delete_my_flow_coach_memory()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF auth.uid() IS NULL OR NOT public.is_active_member(auth.uid()) THEN
    RAISE EXCEPTION 'Active member required';
  END IF;

  DELETE FROM public.flow_coach_messages
  WHERE flow_session_id IN (
    SELECT id FROM public.flow_sessions WHERE user_id = auth.uid()
  );
  DELETE FROM public.flow_member_insights WHERE user_id = auth.uid();
  DELETE FROM public.weekly_flow_reflections WHERE user_id = auth.uid();
  UPDATE public.flow_profiles
  SET coach_memory_announced_at = NULL
  WHERE user_id = auth.uid();
END;
$$;

REVOKE ALL ON FUNCTION public.delete_my_flow_coach_memory() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.delete_my_flow_coach_memory() TO authenticated;