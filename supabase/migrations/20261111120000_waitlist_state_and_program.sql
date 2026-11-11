-- The waitlist form now collects the applicant's state, and the same table
-- backs both The Directive and Momentum waitlists, tagged by program.
-- (Justin, 2026-11-11.) The existing "Anyone can submit" INSERT policy with
-- WITH CHECK (true) already covers the new columns.
ALTER TABLE public.directive_applications
  ADD COLUMN IF NOT EXISTS state TEXT,
  ADD COLUMN IF NOT EXISTS program TEXT NOT NULL DEFAULT 'directive';
