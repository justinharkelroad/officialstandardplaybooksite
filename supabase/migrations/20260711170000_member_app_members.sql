-- ============================================================
-- Standard Playbook Member App — members table + access helpers
-- ============================================================
-- members.id == auth.users.id. One row per member.
-- is_active is the kill switch: every member-facing RLS policy in this app
-- goes through is_active_member(), so deactivating a member cuts data access
-- for live sessions too (their JWT may still be valid, but RLS returns nothing).

CREATE TABLE public.members (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name text NOT NULL,
  email text NOT NULL UNIQUE,
  is_active boolean NOT NULL DEFAULT true,
  is_admin boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Shared updated_at trigger for the member app tables
CREATE OR REPLACE FUNCTION public.member_app_set_updated_at()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER set_updated_at_members
  BEFORE UPDATE ON public.members
  FOR EACH ROW EXECUTE FUNCTION public.member_app_set_updated_at();

-- SECURITY DEFINER so policies on members (and every other table) can call it
-- without recursing into members' own RLS.
CREATE OR REPLACE FUNCTION public.is_active_member(uid uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.members m
    WHERE m.id = uid AND m.is_active
  );
$$;

CREATE OR REPLACE FUNCTION public.is_admin_member(uid uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.members m
    WHERE m.id = uid AND m.is_active AND m.is_admin
  );
$$;

REVOKE EXECUTE ON FUNCTION public.is_active_member(uuid) FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.is_admin_member(uuid) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.is_active_member(uuid) TO authenticated, anon, service_role;
GRANT EXECUTE ON FUNCTION public.is_admin_member(uuid) TO authenticated, anon, service_role;

ALTER TABLE public.members ENABLE ROW LEVEL SECURITY;

-- A member may always read their own row (even when deactivated, so the
-- client can show the "access is inactive" state and sign out cleanly).
CREATE POLICY "members_select_own"
  ON public.members FOR SELECT
  USING (id = auth.uid());

-- Admins manage everything. Uses SECURITY DEFINER helper — no self-recursion.
CREATE POLICY "members_admin_select"
  ON public.members FOR SELECT
  USING (public.is_admin_member(auth.uid()));

CREATE POLICY "members_admin_update"
  ON public.members FOR UPDATE
  USING (public.is_admin_member(auth.uid()))
  WITH CHECK (public.is_admin_member(auth.uid()));

-- INSERT/DELETE happen only via the admin-manage-member edge function
-- (service role bypasses RLS); no client insert/delete policies on purpose.

CREATE INDEX idx_members_active ON public.members(is_active);
