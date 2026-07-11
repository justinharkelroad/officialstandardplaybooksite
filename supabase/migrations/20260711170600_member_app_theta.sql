-- ============================================================
-- 90 Day Audio (Theta Talk Track)
-- Ported from source 20251113163631 (+165655 4B renames, +174918 tones,
-- +171332 theta_tracks, +20251114132102 no audio_url, +20260710190000
-- ownership hardening, +20260710210000 concurrent-generation lock).
-- Rework: user_id NOT NULL (members only — the source's public/lead-capture
-- era and agency/staff columns are gone). theta_voice_tracks /
-- theta_final_tracks / theta_track_leads NOT ported: current client mixes
-- audio locally and stores nothing server-side; those tables are legacy.
-- ============================================================

CREATE TABLE public.theta_targets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  session_id text NOT NULL UNIQUE,
  body text,
  being text,
  balance text,
  business text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.theta_affirmations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  target_id uuid REFERENCES public.theta_targets(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  session_id text NOT NULL,
  category text NOT NULL CHECK (category IN ('body', 'being', 'balance', 'business')),
  text text NOT NULL,
  tone text NOT NULL CHECK (tone IN ('inspiring', 'motivational', 'calm', 'energizing')),
  approved boolean NOT NULL DEFAULT false,
  edited boolean NOT NULL DEFAULT false,
  order_index integer CHECK (order_index BETWEEN 0 AND 4),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.theta_tracks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  session_id text NOT NULL,
  voice_id text NOT NULL,
  status text NOT NULL CHECK (status IN ('pending', 'generating', 'completed', 'failed')),
  duration_minutes integer DEFAULT 21,
  error_message text,
  created_at timestamptz DEFAULT now(),
  completed_at timestamptz
);
COMMENT ON TABLE public.theta_tracks IS 'Tracks metadata only - audio is mixed client-side and not stored on server';

CREATE INDEX idx_theta_targets_user ON public.theta_targets(user_id);
CREATE INDEX idx_theta_affirmations_target ON public.theta_affirmations(target_id);
CREATE INDEX idx_theta_affirmations_session ON public.theta_affirmations(session_id);
CREATE INDEX idx_theta_tracks_session_id ON public.theta_tracks(session_id);
CREATE INDEX idx_theta_tracks_status ON public.theta_tracks(status);
CREATE UNIQUE INDEX theta_affirmations_session_category_order_unique
  ON public.theta_affirmations(session_id, category, order_index);

ALTER TABLE public.theta_targets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.theta_affirmations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.theta_tracks ENABLE ROW LEVEL SECURITY;

-- Reads go to the owner; writes happen through the theta edge functions
-- (service role) which enforce ownership — mirrors the hardened source model.
CREATE POLICY "theta_targets_select_own"
  ON public.theta_targets FOR SELECT TO authenticated
  USING (user_id = auth.uid() AND public.is_active_member(auth.uid()));

CREATE POLICY "theta_affirmations_select_own"
  ON public.theta_affirmations FOR SELECT TO authenticated
  USING (user_id = auth.uid() AND public.is_active_member(auth.uid()));

CREATE POLICY "theta_tracks_select_own"
  ON public.theta_tracks FOR SELECT TO authenticated
  USING (user_id = auth.uid() AND public.is_active_member(auth.uid()));

CREATE TRIGGER update_theta_targets_updated_at
  BEFORE UPDATE ON public.theta_targets
  FOR EACH ROW EXECUTE FUNCTION public.member_app_set_updated_at();

CREATE TRIGGER update_theta_affirmations_updated_at
  BEFORE UPDATE ON public.theta_affirmations
  FOR EACH ROW EXECUTE FUNCTION public.member_app_set_updated_at();

-- Serialize billable generation per session (source 20260710210000)
CREATE OR REPLACE FUNCTION public.prevent_concurrent_theta_track_generation()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  PERFORM pg_advisory_xact_lock(hashtextextended(NEW.session_id, 0));

  IF EXISTS (
    SELECT 1
    FROM public.theta_tracks AS existing
    WHERE existing.session_id = NEW.session_id
      AND existing.status IN ('pending', 'generating')
  ) THEN
    RAISE EXCEPTION USING
      ERRCODE = 'P0001',
      MESSAGE = 'theta track generation already active';
  END IF;

  RETURN NEW;
END;
$$;

REVOKE ALL ON FUNCTION public.prevent_concurrent_theta_track_generation() FROM PUBLIC;

CREATE TRIGGER trg_prevent_concurrent_theta_track_generation
BEFORE INSERT ON public.theta_tracks
FOR EACH ROW
EXECUTE FUNCTION public.prevent_concurrent_theta_track_generation();

-- Background track bucket (client downloads 21m.mp3 from here for local
-- mixing). Justin uploads the audio file — see report checklist.
INSERT INTO storage.buckets (id, name, public)
VALUES ('binaural-beats', 'binaural-beats', true)
ON CONFLICT (id) DO NOTHING;
