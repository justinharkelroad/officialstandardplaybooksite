-- The Mirror — expand qualification fields
-- Renames first_name to full_name and adds phone + carrier (all required).
-- Safe to run on an empty mirror_submissions table; if rows exist, backfill before running.

ALTER TABLE public.mirror_submissions RENAME COLUMN first_name TO full_name;

-- full_name was nullable as first_name. Tighten to NOT NULL.
ALTER TABLE public.mirror_submissions
  ALTER COLUMN full_name SET NOT NULL;

ALTER TABLE public.mirror_submissions
  ADD COLUMN phone TEXT NOT NULL,
  ADD COLUMN carrier TEXT NOT NULL
    CHECK (carrier IN ('allstate', 'state_farm', 'farmers', 'american_family', 'independent', 'other'));
