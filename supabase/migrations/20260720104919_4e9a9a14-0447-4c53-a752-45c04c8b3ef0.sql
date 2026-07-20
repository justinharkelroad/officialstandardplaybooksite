CREATE TABLE public.flow_shares (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  flow_session_id uuid NOT NULL REFERENCES public.flow_sessions(id) ON DELETE CASCADE,
  created_by_user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  token uuid NOT NULL UNIQUE DEFAULT gen_random_uuid(),
  pdf_path text NOT NULL,
  revoked boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.flow_shares TO authenticated;
GRANT ALL ON public.flow_shares TO service_role;

CREATE INDEX idx_flow_shares_flow_session ON public.flow_shares(flow_session_id);
CREATE INDEX idx_flow_shares_created_by_user ON public.flow_shares(created_by_user_id);

CREATE UNIQUE INDEX flow_shares_one_active_per_session
  ON public.flow_shares(flow_session_id)
  WHERE revoked = false;

CREATE TRIGGER set_updated_at_flow_shares
  BEFORE UPDATE ON public.flow_shares
  FOR EACH ROW EXECUTE FUNCTION public.member_app_set_updated_at();

ALTER TABLE public.flow_shares ENABLE ROW LEVEL SECURITY;

CREATE POLICY "flow_shares_select_own"
  ON public.flow_shares FOR SELECT
  USING (
    created_by_user_id = auth.uid()
    AND public.is_active_member(auth.uid())
  );