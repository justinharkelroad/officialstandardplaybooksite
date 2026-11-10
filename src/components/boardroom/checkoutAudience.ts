import type { SupabaseClient } from '@supabase/supabase-js';
import type { CheckoutAudience } from './BoardroomPlanChoices';

type CheckoutAuth = Pick<SupabaseClient['auth'], 'getSession' | 'onAuthStateChange'>;

export function watchCheckoutAudience(auth: CheckoutAuth, update: (state: CheckoutAudience) => void, timeoutMs = 8000) {
  let active = true;
  let authEventReceived = false;
  update('checking');
  const timeout = setTimeout(() => { if (active) update('error'); }, timeoutMs);
  // Subscribe before reading: an older session snapshot must never overwrite a sign-in.
  const { data: { subscription } } = auth.onAuthStateChange((event, session) => {
    // Supabase can emit an empty initial event after a failed session read.
    // Only the successful getSession result can establish this visitor as signed out.
    if (event === 'INITIAL_SESSION' && !session) return;
    authEventReceived = true;
    clearTimeout(timeout);
    if (active) update(session ? 'signed-in' : event === 'SIGNED_OUT' ? 'signed-out' : 'error');
  });
  void auth.getSession().then(({ data, error }) => {
    clearTimeout(timeout);
    if (active && !authEventReceived) update(error ? 'error' : data.session ? 'signed-in' : 'signed-out');
  }).catch(() => {
    clearTimeout(timeout);
    if (active && !authEventReceived) update('error');
  });
  return () => { active = false; clearTimeout(timeout); subscription.unsubscribe(); };
}
