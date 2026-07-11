-- ============================================================
-- Daily Frame commitments
-- Ported from source 20260601123000 and reworked per handoff §4:
-- single user_id NOT NULL (agency_id, owner/staff dual-actor columns and the
-- num_nonnulls checks dropped), UNIQUE(user_id, frame_date). The
-- status/completed_at consistency check is kept. Writes flow through the
-- daily-frame-commitments edge function (service role), reads through RLS —
-- same shape as source (authenticated UPDATE stays revoked).
-- ============================================================

CREATE TABLE public.daily_frame_commitments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  flow_session_id uuid REFERENCES public.flow_sessions(id) ON DELETE SET NULL,
  frame_date date NOT NULL DEFAULT current_date,
  core4_domain text NOT NULL CHECK (core4_domain IN ('body', 'being', 'balance', 'business')),
  gratitude_body text NOT NULL DEFAULT '',
  gratitude_being text NOT NULL DEFAULT '',
  gratitude_balance text NOT NULL DEFAULT '',
  gratitude_business text NOT NULL DEFAULT '',
  current_state text NOT NULL DEFAULT '',
  target_outcome text NOT NULL DEFAULT '',
  measurable_proof text NOT NULL DEFAULT '',
  likely_obstacle text NOT NULL DEFAULT '',
  if_then_plan text NOT NULL DEFAULT '',
  declared_commitment text NOT NULL DEFAULT '',
  status text NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'completed', 'overdue', 'missed')),
  completed_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT daily_frame_commitments_completed_at_match
    CHECK ((status = 'completed' AND completed_at IS NOT NULL) OR (status <> 'completed' AND completed_at IS NULL)),
  CONSTRAINT daily_frame_commitments_user_day_unique UNIQUE (user_id, frame_date)
);

-- Owner flow-session integrity (simplified from source validate trigger:
-- the linked flow session must belong to the same user).
CREATE OR REPLACE FUNCTION public.validate_daily_frame_commitment()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_flow_user_id uuid;
BEGIN
  IF NEW.flow_session_id IS NOT NULL THEN
    SELECT user_id INTO v_flow_user_id
    FROM public.flow_sessions
    WHERE id = NEW.flow_session_id;

    IF v_flow_user_id IS DISTINCT FROM NEW.user_id THEN
      RAISE EXCEPTION 'Daily Frame flow session mismatch';
    END IF;
  END IF;

  RETURN NEW;
END;
$$;

CREATE TRIGGER validate_daily_frame_commitments
BEFORE INSERT OR UPDATE OF user_id, flow_session_id
ON public.daily_frame_commitments
FOR EACH ROW EXECUTE FUNCTION public.validate_daily_frame_commitment();

CREATE TRIGGER set_updated_at_daily_frame_commitments
BEFORE UPDATE ON public.daily_frame_commitments
FOR EACH ROW EXECUTE FUNCTION public.member_app_set_updated_at();

CREATE INDEX idx_daily_frame_commitments_user_date
  ON public.daily_frame_commitments(user_id, frame_date DESC);
CREATE INDEX idx_daily_frame_commitments_status
  ON public.daily_frame_commitments(status);

ALTER TABLE public.daily_frame_commitments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "daily_frame_commitments_service_all"
ON public.daily_frame_commitments
FOR ALL
USING (auth.role() = 'service_role')
WITH CHECK (auth.role() = 'service_role');

CREATE POLICY "daily_frame_commitments_select_own"
ON public.daily_frame_commitments
FOR SELECT
USING (user_id = auth.uid() AND public.is_active_member(auth.uid()));

REVOKE UPDATE ON public.daily_frame_commitments FROM authenticated;
GRANT SELECT ON public.daily_frame_commitments TO authenticated;
GRANT ALL ON public.daily_frame_commitments TO service_role;
