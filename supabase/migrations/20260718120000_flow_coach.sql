-- Interleaved Flow coach: server-written reflections and member-owned memory.

CREATE TABLE public.flow_coach_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  flow_session_id uuid NOT NULL REFERENCES public.flow_sessions(id) ON DELETE CASCADE,
  question_id text NOT NULL,
  answer_excerpt text,
  answer_hash text,
  reflection text NOT NULL,
  memory_refs jsonb NOT NULL DEFAULT '[]'::jsonb,
  model text,
  input_tokens integer,
  output_tokens integer,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (flow_session_id, question_id)
);

CREATE TABLE public.flow_member_insights (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  flow_slug text,
  source_session_id uuid NOT NULL REFERENCES public.flow_sessions(id) ON DELETE CASCADE,
  session_title text,
  kind text NOT NULL CHECK (kind IN ('quote', 'commitment', 'pattern', 'fact', 'breakthrough')),
  step_key text,
  theme text,
  claim text,
  content text NOT NULL CHECK (octet_length(content) <= 2000),
  salience smallint NOT NULL DEFAULT 3 CHECK (salience BETWEEN 1 AND 5),
  created_at timestamptz NOT NULL DEFAULT now(),
  last_referenced_at timestamptz
);

CREATE INDEX flow_member_insights_user_step_idx
  ON public.flow_member_insights (user_id, step_key);
CREATE INDEX flow_member_insights_user_flow_created_idx
  ON public.flow_member_insights (user_id, flow_slug, created_at DESC);
CREATE UNIQUE INDEX flow_member_insights_source_kind_content_idx
  ON public.flow_member_insights (source_session_id, kind, content);

ALTER TABLE public.flow_templates
  ADD COLUMN coach_enabled boolean NOT NULL DEFAULT false,
  ADD COLUMN coach_prompt text,
  ADD COLUMN coach_intensity text NOT NULL DEFAULT 'standard'
    CHECK (coach_intensity IN ('gentle', 'standard', 'hard')),
  ADD COLUMN coach_question_notes jsonb NOT NULL DEFAULT '{}'::jsonb;

ALTER TABLE public.flow_profiles
  ADD COLUMN coach_memory_paused boolean NOT NULL DEFAULT false,
  ADD COLUMN coach_memory_announced_at timestamptz;

ALTER TABLE public.flow_coach_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.flow_member_insights ENABLE ROW LEVEL SECURITY;

CREATE POLICY "flow_coach_messages_select_own"
  ON public.flow_coach_messages FOR SELECT
  USING (
    public.is_active_member(auth.uid())
    AND flow_session_id IN (
      SELECT id FROM public.flow_sessions WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "flow_member_insights_select_own"
  ON public.flow_member_insights FOR SELECT
  USING (public.is_active_member(auth.uid()) AND user_id = auth.uid());

-- One atomic, auditable member action clears both recalled insights and the
-- reflections that referenced them. The service-role edge functions remain
-- the only writers otherwise.
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
  UPDATE public.flow_profiles
  SET coach_memory_announced_at = NULL
  WHERE user_id = auth.uid();
END;
$$;

REVOKE ALL ON FUNCTION public.delete_my_flow_coach_memory() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.delete_my_flow_coach_memory() TO authenticated;
