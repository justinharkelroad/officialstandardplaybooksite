-- The Mirror — drip send tracking
-- Records every scheduled (or sent) drip email so we can cancel pending sends
-- by email when a lead converts (e.g. books a Mirror call via Acuity).

CREATE TABLE public.mirror_drip_sends (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  submission_id UUID NOT NULL REFERENCES public.mirror_submissions(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  tier TEXT NOT NULL,
  weakest_pillar TEXT NOT NULL,
  day_offset INT NOT NULL,
  scheduled_at TIMESTAMP WITH TIME ZONE,
  resend_id TEXT,
  status TEXT NOT NULL DEFAULT 'queued'
    CHECK (status IN ('queued', 'sent', 'cancelled', 'failed')),
  cancelled_at TIMESTAMP WITH TIME ZONE,
  cancel_reason TEXT,
  send_error TEXT
);

-- RLS on, no public policies. Only the service role / edge functions touch this.
ALTER TABLE public.mirror_drip_sends ENABLE ROW LEVEL SECURITY;

CREATE INDEX mirror_drip_sends_email_status_idx ON public.mirror_drip_sends(email, status);
CREATE INDEX mirror_drip_sends_submission_idx ON public.mirror_drip_sends(submission_id);
CREATE INDEX mirror_drip_sends_scheduled_at_idx ON public.mirror_drip_sends(scheduled_at);
