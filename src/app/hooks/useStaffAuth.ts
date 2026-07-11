// Owner-mode stub for the source platform's staff/owner dual-auth hook.
// This app has exactly one kind of user (a member), so every transplanted
// call site that branched on staff mode resolves to the owner path.
export interface StaffAuthState {
  isStaffMode: boolean;
  staffUser: null;
  staffSessionToken: null;
  isImpersonation: boolean;
  loading: boolean;
}

export function useStaffAuth(): StaffAuthState {
  return {
    isStaffMode: false,
    staffUser: null,
    staffSessionToken: null,
    isImpersonation: false,
    loading: false,
  };
}

export default useStaffAuth;
