// Member-app auth context. Replaces the source platform's 4-user-type
// auth engine with the closed model: Supabase email+password session +
// an ACTIVE public.members row. No tiers, no staff, no agencies.
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

export interface MemberRow {
  id: string;
  full_name: string;
  email: string;
  is_active: boolean;
  is_admin: boolean;
}

interface MemberAuthContextValue {
  user: User | null;
  session: Session | null;
  member: MemberRow | null;
  loading: boolean;
  isAdmin: boolean;
  isActiveMember: boolean;
  signOut: () => Promise<void>;
  refreshMember: () => Promise<void>;
}

const MemberAuthContext = createContext<MemberAuthContextValue | undefined>(undefined);

async function fetchMemberRow(userId: string): Promise<MemberRow | null> {
  const { data, error } = await supabase
    .from("members")
    .select("id, full_name, email, is_active, is_admin")
    .eq("id", userId)
    .maybeSingle();
  if (error) return null;
  return (data as MemberRow) ?? null;
}

export function MemberAuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [member, setMember] = useState<MemberRow | null>(null);
  const [loading, setLoading] = useState(true);

  const loadMember = useCallback(async (nextSession: Session | null) => {
    if (!nextSession?.user) {
      setMember(null);
      return;
    }
    setMember(await fetchMemberRow(nextSession.user.id));
  }, []);

  useEffect(() => {
    let cancelled = false;

    supabase.auth.getSession().then(async ({ data }) => {
      if (cancelled) return;
      setSession(data.session);
      await loadMember(data.session);
      if (!cancelled) setLoading(false);
    });

    const { data: sub } = supabase.auth.onAuthStateChange(async (_event, nextSession) => {
      if (cancelled) return;
      setSession(nextSession);
      await loadMember(nextSession);
      if (!cancelled) setLoading(false);
    });

    return () => {
      cancelled = true;
      sub.subscription.unsubscribe();
    };
  }, [loadMember]);

  const signOut = useCallback(async () => {
    await supabase.auth.signOut();
    setSession(null);
    setMember(null);
  }, []);

  const refreshMember = useCallback(async () => {
    await loadMember(session);
  }, [loadMember, session]);

  const value = useMemo<MemberAuthContextValue>(
    () => ({
      user: session?.user ?? null,
      session,
      member,
      loading,
      isAdmin: !!member?.is_admin && !!member?.is_active,
      isActiveMember: !!member?.is_active,
      signOut,
      refreshMember,
    }),
    [session, member, loading, signOut, refreshMember],
  );

  return <MemberAuthContext.Provider value={value}>{children}</MemberAuthContext.Provider>;
}

export function useAuth(): MemberAuthContextValue {
  const ctx = useContext(MemberAuthContext);
  if (!ctx) throw new Error("useAuth must be used within MemberAuthProvider");
  return ctx;
}
