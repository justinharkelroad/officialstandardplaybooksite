import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "@/app/lib/auth";

function FullScreenSpinner() {
  return (
    <div className="member-app flex min-h-screen items-center justify-center">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#2997FF] border-t-transparent" />
    </div>
  );
}

function InactiveScreen() {
  const { signOut } = useAuth();
  // Fire-and-forget: RLS already blocks this session's data access.
  void signOut();
  return (
    <div className="member-app flex min-h-screen items-center justify-center px-6">
      <p className="sp-label max-w-md text-center text-[12px] text-[#0A0A0B]">
        Your access is inactive — contact Justin.
      </p>
    </div>
  );
}

/** Session + active-member gate for everything under /app. */
export function RequireMember() {
  const { session, member, loading } = useAuth();
  const location = useLocation();

  if (loading) return <FullScreenSpinner />;
  if (!session) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }
  if (!member || !member.is_active) return <InactiveScreen />;
  return <Outlet />;
}

/** Additional admin gate for /app/admin. */
export function RequireAdmin() {
  const { isAdmin, loading } = useAuth();
  if (loading) return <FullScreenSpinner />;
  if (!isAdmin) return <Navigate to="/app" replace />;
  return <Outlet />;
}
