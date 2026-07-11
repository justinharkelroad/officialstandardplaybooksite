-- ============================================================
-- Weekly Playbook — focus_items (final shape) + global playbook_tags
-- Ported from the source platform 20251111042528 + 20251224123242 + 20260313100000
-- + 20260313140000 + 20260411140000. Reworks per handoff §4:
--   focus_items: user_id NOT NULL; agency_id / team_member_id / mirror_source
--   columns dropped. playbook_tags: global default tag set (no agency_id),
--   admin-managed, readable by all active members.
-- ============================================================

CREATE TABLE public.playbook_tags (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  domain text NOT NULL CHECK (domain IN ('body', 'being', 'balance', 'business')),
  name text NOT NULL,
  is_active boolean NOT NULL DEFAULT true,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(domain, name)
);

CREATE TABLE public.focus_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text,
  priority_level text NOT NULL DEFAULT 'mid' CHECK (priority_level IN ('top', 'mid', 'low')),
  column_status text NOT NULL DEFAULT 'backlog' CHECK (column_status IN ('backlog', 'week1', 'week2', 'next_call', 'completed')),
  column_order integer NOT NULL DEFAULT 0,
  zone text NOT NULL DEFAULT 'bench' CHECK (zone IN ('bench', 'power_play', 'queue', 'one_big_thing')),
  scheduled_date date,
  scheduled_time time,
  domain text CHECK (domain IN ('body', 'being', 'balance', 'business')),
  sub_tag_id uuid REFERENCES public.playbook_tags(id) ON DELETE SET NULL,
  week_key text,
  completed boolean NOT NULL DEFAULT false,
  completion_proof text,
  completion_feeling text,
  source_type text,
  source_name text,
  source_session_id uuid,
  completed_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.playbook_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.focus_items ENABLE ROW LEVEL SECURITY;

-- Tags: readable by any active member; writable by admins only.
CREATE POLICY "playbook_tags_select_active_members"
  ON public.playbook_tags FOR SELECT
  USING (public.is_active_member(auth.uid()));

CREATE POLICY "playbook_tags_admin_insert"
  ON public.playbook_tags FOR INSERT
  WITH CHECK (public.is_admin_member(auth.uid()));

CREATE POLICY "playbook_tags_admin_update"
  ON public.playbook_tags FOR UPDATE
  USING (public.is_admin_member(auth.uid()))
  WITH CHECK (public.is_admin_member(auth.uid()));

CREATE POLICY "playbook_tags_admin_delete"
  ON public.playbook_tags FOR DELETE
  USING (public.is_admin_member(auth.uid()));

CREATE POLICY "focus_items_select_own"
  ON public.focus_items FOR SELECT
  USING (auth.uid() = user_id AND public.is_active_member(auth.uid()));

CREATE POLICY "focus_items_insert_own"
  ON public.focus_items FOR INSERT
  WITH CHECK (auth.uid() = user_id AND public.is_active_member(auth.uid()));

CREATE POLICY "focus_items_update_own"
  ON public.focus_items FOR UPDATE
  USING (auth.uid() = user_id AND public.is_active_member(auth.uid()))
  WITH CHECK (auth.uid() = user_id AND public.is_active_member(auth.uid()));

CREATE POLICY "focus_items_delete_own"
  ON public.focus_items FOR DELETE
  USING (auth.uid() = user_id AND public.is_active_member(auth.uid()));

CREATE INDEX idx_focus_items_user_id ON public.focus_items(user_id);
CREATE INDEX idx_focus_items_zone ON public.focus_items(zone);
CREATE INDEX idx_focus_items_scheduled_date ON public.focus_items(scheduled_date);
CREATE INDEX idx_focus_items_domain ON public.focus_items(domain);
CREATE INDEX idx_focus_items_week_key ON public.focus_items(week_key);
CREATE INDEX idx_focus_items_user_scheduled ON public.focus_items(user_id, scheduled_date);
CREATE INDEX idx_focus_items_source_type ON public.focus_items(source_type);
CREATE INDEX idx_playbook_tags_domain ON public.playbook_tags(domain);

-- Auto-set completed_at when completed flips (source 20260313100000 §5)
CREATE OR REPLACE FUNCTION public.set_focus_item_completed_at()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    IF NEW.completed = true THEN
      NEW.completed_at = now();
    END IF;
  ELSIF TG_OP = 'UPDATE' THEN
    IF NEW.completed = true AND (OLD.completed IS DISTINCT FROM true) THEN
      NEW.completed_at = now();
    ELSIF NEW.completed = false AND OLD.completed = true THEN
      NEW.completed_at = NULL;
    END IF;
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER set_focus_item_completed_bool_trigger
  BEFORE INSERT OR UPDATE ON public.focus_items
  FOR EACH ROW EXECUTE FUNCTION public.set_focus_item_completed_at();

CREATE TRIGGER update_focus_items_updated_at
  BEFORE UPDATE ON public.focus_items
  FOR EACH ROW EXECUTE FUNCTION public.member_app_set_updated_at();

-- Power-play day count (source 20260313100000 §6, user-only — staff branch dropped)
CREATE OR REPLACE FUNCTION public.get_power_play_count(
  p_user_id uuid DEFAULT NULL,
  p_date date DEFAULT CURRENT_DATE,
  p_exclude_id uuid DEFAULT NULL
)
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_count integer;
BEGIN
  SELECT COUNT(*)::integer INTO v_count
  FROM public.focus_items
  WHERE zone = 'power_play'
    AND scheduled_date = p_date
    AND p_user_id IS NOT NULL AND user_id = p_user_id
    AND (p_exclude_id IS NULL OR id != p_exclude_id);

  RETURN v_count;
END;
$$;

REVOKE EXECUTE ON FUNCTION public.get_power_play_count FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.get_power_play_count TO authenticated;

-- Default global tag set (proposed from source domain taxonomy — Justin to
-- approve/adjust; flagged in the final report).
INSERT INTO public.playbook_tags (domain, name, sort_order) VALUES
  ('body', 'Training', 0),
  ('body', 'Nutrition', 1),
  ('body', 'Sleep & Recovery', 2),
  ('being', 'Faith', 0),
  ('being', 'Study & Reading', 1),
  ('being', 'Journaling & Reflection', 2),
  ('balance', 'Marriage', 0),
  ('balance', 'Kids & Family', 1),
  ('balance', 'Friends & Community', 2),
  ('business', 'Revenue Actions', 0),
  ('business', 'Team & Hiring', 1),
  ('business', 'Systems & Process', 2),
  ('business', 'Marketing & Content', 3);
