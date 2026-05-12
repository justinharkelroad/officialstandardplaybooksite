-- The Mirror — capture Meta/Google click IDs and referrer for attribution.
-- Meta's in-app browser strips utm_* params and only appends fbclid, so without
-- this column we lose attribution on the majority of Facebook ad clicks.

ALTER TABLE public.mirror_submissions
  ADD COLUMN IF NOT EXISTS fbclid TEXT,
  ADD COLUMN IF NOT EXISTS gclid TEXT,
  ADD COLUMN IF NOT EXISTS referrer TEXT,
  ADD COLUMN IF NOT EXISTS landing_path TEXT;

CREATE INDEX IF NOT EXISTS mirror_submissions_fbclid_idx ON public.mirror_submissions(fbclid) WHERE fbclid IS NOT NULL;
CREATE INDEX IF NOT EXISTS mirror_submissions_gclid_idx  ON public.mirror_submissions(gclid)  WHERE gclid  IS NOT NULL;
