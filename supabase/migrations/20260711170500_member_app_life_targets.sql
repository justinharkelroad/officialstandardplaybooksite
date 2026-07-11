-- ============================================================
-- Quarterly / Life Targets
-- Ported from source 20251115002037 (user-scoped recreate) + 20251115134331
-- (target2/primary flags + brainstorm table) + 20251115194143 (daily_actions)
-- + 20260412120000 (action pools).
-- DISCOVERY logged in report: life_targets_brainstorm was not on the handoff
-- table list but is required by the Brainstorm page.
-- ============================================================

CREATE TABLE public.life_targets_quarterly (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  quarter text NOT NULL,

  body_target text,
  body_target2 text,
  body_monthly_missions jsonb DEFAULT '{"Jan": [], "Feb": [], "Mar": []}'::jsonb,
  body_daily_habit text,
  body_daily_actions jsonb DEFAULT '[]'::jsonb,
  body_action_pool jsonb DEFAULT '[]'::jsonb,
  body_narrative text,
  body_narrative2 text,
  body_primary_is_target1 boolean,

  being_target text,
  being_target2 text,
  being_monthly_missions jsonb DEFAULT '{"Jan": [], "Feb": [], "Mar": []}'::jsonb,
  being_daily_habit text,
  being_daily_actions jsonb DEFAULT '[]'::jsonb,
  being_action_pool jsonb DEFAULT '[]'::jsonb,
  being_narrative text,
  being_narrative2 text,
  being_primary_is_target1 boolean,

  balance_target text,
  balance_target2 text,
  balance_monthly_missions jsonb DEFAULT '{"Jan": [], "Feb": [], "Mar": []}'::jsonb,
  balance_daily_habit text,
  balance_daily_actions jsonb DEFAULT '[]'::jsonb,
  balance_action_pool jsonb DEFAULT '[]'::jsonb,
  balance_narrative text,
  balance_narrative2 text,
  balance_primary_is_target1 boolean,

  business_target text,
  business_target2 text,
  business_monthly_missions jsonb DEFAULT '{"Jan": [], "Feb": [], "Mar": []}'::jsonb,
  business_daily_habit text,
  business_daily_actions jsonb DEFAULT '[]'::jsonb,
  business_action_pool jsonb DEFAULT '[]'::jsonb,
  business_narrative text,
  business_narrative2 text,
  business_primary_is_target1 boolean,

  raw_session_data jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(user_id, quarter)
);

CREATE TABLE public.life_targets_brainstorm (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  quarter text NOT NULL,
  domain text NOT NULL CHECK (domain IN ('body', 'being', 'balance', 'business')),
  target_text text NOT NULL,
  clarity_score integer CHECK (clarity_score >= 0 AND clarity_score <= 10),
  rewritten_target text,
  is_selected boolean DEFAULT false,
  is_primary boolean DEFAULT false,
  session_id text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(user_id, quarter, domain, target_text)
);

CREATE INDEX idx_life_targets_user_id ON public.life_targets_quarterly(user_id);
CREATE INDEX idx_life_targets_quarter ON public.life_targets_quarterly(quarter);
CREATE INDEX idx_life_targets_brainstorm_user_quarter ON public.life_targets_brainstorm(user_id, quarter);
CREATE INDEX idx_life_targets_brainstorm_domain ON public.life_targets_brainstorm(domain) WHERE is_selected = true;

ALTER TABLE public.life_targets_quarterly ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.life_targets_brainstorm ENABLE ROW LEVEL SECURITY;

CREATE POLICY "life_targets_all_own"
  ON public.life_targets_quarterly FOR ALL
  USING (auth.uid() = user_id AND public.is_active_member(auth.uid()))
  WITH CHECK (auth.uid() = user_id AND public.is_active_member(auth.uid()));

CREATE POLICY "life_targets_brainstorm_all_own"
  ON public.life_targets_brainstorm FOR ALL
  USING (auth.uid() = user_id AND public.is_active_member(auth.uid()))
  WITH CHECK (auth.uid() = user_id AND public.is_active_member(auth.uid()));

CREATE TRIGGER update_life_targets_quarterly_updated_at
  BEFORE UPDATE ON public.life_targets_quarterly
  FOR EACH ROW EXECUTE FUNCTION public.member_app_set_updated_at();

CREATE TRIGGER update_life_targets_brainstorm_updated_at
  BEFORE UPDATE ON public.life_targets_brainstorm
  FOR EACH ROW EXECUTE FUNCTION public.member_app_set_updated_at();
