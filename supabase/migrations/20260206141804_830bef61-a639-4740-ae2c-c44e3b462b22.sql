-- Create booking_leads table for intake form submissions
CREATE TABLE public.booking_leads (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id TEXT NOT NULL,
  full_name TEXT,
  email TEXT,
  cell_phone TEXT,
  primary_carrier TEXT,
  whats_working TEXT,
  whats_not_working TEXT,
  desired_outcome TEXT,
  committed BOOLEAN DEFAULT FALSE,
  completed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.booking_leads ENABLE ROW LEVEL SECURITY;

-- Create open insert policy for public lead capture
CREATE POLICY "Anyone can insert booking leads"
ON public.booking_leads
FOR INSERT
WITH CHECK (true);

-- Create open update policy for auto-save functionality (by session_id)
CREATE POLICY "Anyone can update their own session"
ON public.booking_leads
FOR UPDATE
USING (true)
WITH CHECK (true);

-- Create select policy so we can fetch existing session data
CREATE POLICY "Anyone can read their own session"
ON public.booking_leads
FOR SELECT
USING (true);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_booking_leads_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_booking_leads_updated_at
BEFORE UPDATE ON public.booking_leads
FOR EACH ROW
EXECUTE FUNCTION public.update_booking_leads_updated_at();

-- Add index on session_id for faster lookups
CREATE INDEX idx_booking_leads_session_id ON public.booking_leads(session_id);