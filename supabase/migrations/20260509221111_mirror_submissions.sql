-- The Mirror — assessment submission storage
-- Captures self-scoring lead-magnet submissions from /mirror/score.

CREATE TABLE public.mirror_submissions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  email TEXT NOT NULL,
  first_name TEXT,
  total_score INT NOT NULL,
  tier TEXT NOT NULL CHECK (tier IN ('foundation', 'developing', 'established', 'advanced', 'elite')),
  weakest_pillar TEXT NOT NULL CHECK (weakest_pillar IN ('culture_team', 'systems_rhythm', 'training_scripts', 'marketing_lead_flow', 'owner_command')),
  pillar_scores JSONB NOT NULL,
  question_scores JSONB NOT NULL,
  utm_source TEXT,
  utm_medium TEXT,
  utm_campaign TEXT,
  utm_content TEXT,
  device_type TEXT,
  user_agent TEXT
);

-- Open insert policy for the public lead magnet form.
ALTER TABLE public.mirror_submissions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can insert mirror submissions"
ON public.mirror_submissions
FOR INSERT
WITH CHECK (true);

-- Open select policy so the results page can read its own submission by id.
-- Submissions are uuid-keyed, so a row can only be read if the id is known.
CREATE POLICY "Anyone can read mirror submissions by id"
ON public.mirror_submissions
FOR SELECT
USING (true);

CREATE INDEX mirror_submissions_email_idx ON public.mirror_submissions(email);
CREATE INDEX mirror_submissions_tier_idx ON public.mirror_submissions(tier);
CREATE INDEX mirror_submissions_created_idx ON public.mirror_submissions(created_at DESC);
