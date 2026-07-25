-- Life Targets persistence + reset hardening.
--
-- Daily Proof is optional, so completion needs an explicit review marker
-- instead of inferring completion from at least one selected action.
ALTER TABLE public.life_targets_quarterly
  ADD COLUMN IF NOT EXISTS daily_proof_reviewed_at timestamptz;

COMMENT ON COLUMN public.life_targets_quarterly.daily_proof_reviewed_at IS
  'Set when the member leaves Daily Proof through Review the Full Plan, including when zero optional actions are selected.';

-- Resetting a quarter must clear the quarterly plan and every Brain Dump row
-- for that actor/quarter in one transaction. The actor is always derived from
-- the JWT; callers cannot choose another member.
CREATE OR REPLACE FUNCTION public.reset_my_life_targets_quarter(
  p_quarter text
)
RETURNS void
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = public
AS $$
DECLARE
  v_actor_id uuid := auth.uid();
BEGIN
  IF v_actor_id IS NULL OR NOT public.is_active_member(v_actor_id) THEN
    RAISE EXCEPTION USING
      ERRCODE = '42501',
      MESSAGE = 'Active member access is required';
  END IF;

  IF p_quarter !~ '^[0-9]{4}-Q[1-4]$' THEN
    RAISE EXCEPTION USING
      ERRCODE = '22023',
      MESSAGE = 'A valid quarter is required';
  END IF;

  PERFORM pg_advisory_xact_lock(
    hashtextextended(
      'member-life-targets-reset:' || v_actor_id::text || ':' || p_quarter,
      0
    )
  );

  DELETE FROM public.life_targets_brainstorm
  WHERE user_id = v_actor_id
    AND quarter = p_quarter;

  DELETE FROM public.life_targets_quarterly
  WHERE user_id = v_actor_id
    AND quarter = p_quarter;
END;
$$;

REVOKE ALL ON FUNCTION public.reset_my_life_targets_quarter(text)
  FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.reset_my_life_targets_quarter(text)
  TO authenticated, service_role;

-- "Start Over This Month" clears the live monthly surface by archiving every
-- active mission for the authenticated member/month. Weekly work is a separate
-- cadence and intentionally remains untouched.
CREATE OR REPLACE FUNCTION public.reset_my_core4_month(
  p_month_year text
)
RETURNS integer
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = public
AS $$
DECLARE
  v_actor_id uuid := auth.uid();
  v_archived_count integer;
BEGIN
  IF v_actor_id IS NULL OR NOT public.is_active_member(v_actor_id) THEN
    RAISE EXCEPTION USING
      ERRCODE = '42501',
      MESSAGE = 'Active member access is required';
  END IF;

  IF p_month_year !~ '^[0-9]{4}-(0[1-9]|1[0-2])$' THEN
    RAISE EXCEPTION USING
      ERRCODE = '22023',
      MESSAGE = 'A valid month is required';
  END IF;

  PERFORM pg_advisory_xact_lock(
    hashtextextended(
      'member-core4-month-reset:' || v_actor_id::text || ':' || p_month_year,
      0
    )
  );

  UPDATE public.core4_monthly_missions
  SET
    status = 'archived',
    updated_at = now()
  WHERE user_id = v_actor_id
    AND month_year = p_month_year
    AND status = 'active';

  GET DIAGNOSTICS v_archived_count = ROW_COUNT;
  RETURN v_archived_count;
END;
$$;

REVOKE ALL ON FUNCTION public.reset_my_core4_month(text)
  FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.reset_my_core4_month(text)
  TO authenticated, service_role;
