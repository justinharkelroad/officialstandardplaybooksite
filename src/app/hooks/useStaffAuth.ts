// Owner-mode stub for the source platform's staff/owner dual-auth hook.
// This app has exactly one kind of user (a member), so every transplanted
// call site that branched on staff mode resolves to the owner path:
// user/sessionToken stay null and loading is false, matching the real
// hook's shape (user, sessionToken, loading, isImpersonation, ...).
export interface StaffAuthStub {
  user: null;
  sessionToken: null;
  loading: boolean;
  isAuthenticated: false;
  isImpersonation: false;
  error: null;
  login: () => Promise<{ error: string }>;
  logout: () => Promise<void>;
  refreshSession: () => Promise<{ success: boolean; error?: string }>;
}

const STUB: StaffAuthStub = {
  user: null,
  sessionToken: null,
  loading: false,
  isAuthenticated: false,
  isImpersonation: false,
  error: null,
  login: async () => ({ error: "Staff portal does not exist in this app" }),
  logout: async () => {},
  refreshSession: async () => ({ success: false, error: "no staff mode" }),
};

export function useStaffAuth(): StaffAuthStub {
  return STUB;
}

export default useStaffAuth;
