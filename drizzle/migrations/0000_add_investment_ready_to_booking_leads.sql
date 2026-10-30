ALTER TABLE public.booking_leads
  ADD COLUMN IF NOT EXISTS investment_ready boolean;

COMMENT ON COLUMN public.booking_leads.investment_ready IS
  'Ascension applications only: applicant confirmed they are prepared for a five-figure investment.';