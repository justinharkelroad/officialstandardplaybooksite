-- ============================================================
-- The Debrief — weekly reviews
-- Ported from source 20260313200000 (owner table only; staff table dropped)
-- + 20260314060000 coaching_analysis + 20260711100000 analysis claim columns.
-- Rework: agency_id dropped (source has it nullable); member-active RLS gate.
-- ============================================================

CREATE TABLE public.weekly_reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  week_key text NOT NULL,                    -- e.g. '2026-W11'
  core4_points int NOT NULL DEFAULT 0,       -- snapshot 0-28
  flow_points int NOT NULL DEFAULT 0,        -- snapshot 0-7
  playbook_points int NOT NULL DEFAULT 0,    -- snapshot 0-21
  total_points int NOT NULL DEFAULT 0,       -- snapshot 0-56
  domain_reflections jsonb DEFAULT '{}',
  gratitude_note text,
  next_week_one_big_thing text,
  status text NOT NULL DEFAULT 'in_progress' CHECK (status IN ('in_progress','completed')),
  completed_at timestamptz,
  current_step int NOT NULL DEFAULT 0,
  coaching_analysis text,
  analysis_generation_started_at timestamptz,
  analysis_generation_completed_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  CONSTRAINT unique_user_week UNIQUE (user_id, week_key)
);

ALTER TABLE public.weekly_reviews ENABLE ROW LEVEL SECURITY;

CREATE POLICY "weekly_reviews_select_own"
  ON public.weekly_reviews FOR SELECT
  USING (auth.uid() = user_id AND public.is_active_member(auth.uid()));

CREATE POLICY "weekly_reviews_insert_own"
  ON public.weekly_reviews FOR INSERT
  WITH CHECK (auth.uid() = user_id AND public.is_active_member(auth.uid()));

CREATE POLICY "weekly_reviews_update_own"
  ON public.weekly_reviews FOR UPDATE
  USING (auth.uid() = user_id AND public.is_active_member(auth.uid()))
  WITH CHECK (auth.uid() = user_id AND public.is_active_member(auth.uid()));

CREATE INDEX idx_weekly_reviews_user_week ON public.weekly_reviews(user_id, week_key);

CREATE TRIGGER update_weekly_reviews_updated_at
  BEFORE UPDATE ON public.weekly_reviews
  FOR EACH ROW EXECUTE FUNCTION public.member_app_set_updated_at();
