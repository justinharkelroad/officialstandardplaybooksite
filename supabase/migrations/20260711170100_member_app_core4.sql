-- ============================================================
-- Core 4 — daily habit entries + monthly missions
-- Ported from the source platform 20251223144953 (user-scoped there too);
-- agency-owner visibility policies dropped, is_active_member() gate added.
-- Active-unique index ported from 20260709120000.
-- ============================================================

CREATE TABLE public.core4_entries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  date date NOT NULL DEFAULT current_date,
  body_completed boolean DEFAULT false,
  being_completed boolean DEFAULT false,
  balance_completed boolean DEFAULT false,
  business_completed boolean DEFAULT false,
  body_note text,
  being_note text,
  balance_note text,
  business_note text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id, date)
);

CREATE TABLE public.core4_monthly_missions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  domain text NOT NULL CHECK (domain IN ('body', 'being', 'balance', 'business')),
  title text NOT NULL,
  items jsonb DEFAULT '[]'::jsonb,
  weekly_measurable text,
  status text DEFAULT 'active' CHECK (status IN ('active', 'completed', 'archived')),
  month_year text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE public.core4_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.core4_monthly_missions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "core4_entries_select_own"
  ON public.core4_entries FOR SELECT
  USING (auth.uid() = user_id AND public.is_active_member(auth.uid()));

CREATE POLICY "core4_entries_insert_own"
  ON public.core4_entries FOR INSERT
  WITH CHECK (auth.uid() = user_id AND public.is_active_member(auth.uid()));

CREATE POLICY "core4_entries_update_own"
  ON public.core4_entries FOR UPDATE
  USING (auth.uid() = user_id AND public.is_active_member(auth.uid()))
  WITH CHECK (auth.uid() = user_id AND public.is_active_member(auth.uid()));

CREATE POLICY "core4_entries_delete_own"
  ON public.core4_entries FOR DELETE
  USING (auth.uid() = user_id AND public.is_active_member(auth.uid()));

CREATE POLICY "core4_missions_all_own"
  ON public.core4_monthly_missions FOR ALL
  USING (auth.uid() = user_id AND public.is_active_member(auth.uid()))
  WITH CHECK (auth.uid() = user_id AND public.is_active_member(auth.uid()));

CREATE INDEX idx_core4_entries_user_date ON public.core4_entries(user_id, date);
CREATE INDEX idx_core4_missions_user_status ON public.core4_monthly_missions(user_id, status);
CREATE INDEX idx_core4_missions_month_year ON public.core4_monthly_missions(month_year);

-- One active mission per user/domain/month (source 20260709120000)
CREATE UNIQUE INDEX idx_core4_monthly_missions_active_unique
  ON public.core4_monthly_missions(user_id, domain, month_year)
  WHERE status = 'active';

CREATE TRIGGER update_core4_entries_updated_at
  BEFORE UPDATE ON public.core4_entries
  FOR EACH ROW EXECUTE FUNCTION public.member_app_set_updated_at();

CREATE TRIGGER update_core4_monthly_missions_updated_at
  BEFORE UPDATE ON public.core4_monthly_missions
  FOR EACH ROW EXECUTE FUNCTION public.member_app_set_updated_at();
