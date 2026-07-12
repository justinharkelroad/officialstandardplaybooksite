// Shared member-email sender.
//
// Every attempt writes a row to public.member_emails BEFORE the network call —
// including the "RESEND_API_KEY isn't configured" case. A send can fail, but it
// can no longer fail *invisibly*: `select * from member_emails order by created_at desc`
// is the whole story. The old debrief send swallowed its errors into console.error
// and shipped zero emails for weeks without a trace.
//
// The unique index on (member_id, kind, ref_key) is the idempotency guard: the
// insert below IS the claim. Overlapping cron runs cannot double-send.

import type { SupabaseClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { BRAND } from './email-template.ts';

export type MemberEmailKind = 'welcome' | 'debrief_reminder' | 'debrief_report';

export interface SendMemberEmailArgs {
  supabase: SupabaseClient; // service-role client
  memberId: string;
  to: string;
  kind: MemberEmailKind;
  /** Dedupe key within (member, kind). Week key for weekly mail, member id for one-shots. */
  refKey: string;
  subject: string;
  html: string;
}

export type SendMemberEmailResult =
  | { status: 'sent'; resendId: string | null }
  | { status: 'duplicate' }
  | { status: 'skipped_no_key' }
  | { status: 'failed'; error: string };

const RESEND_ENDPOINT = 'https://api.resend.com/emails';

export async function sendMemberEmail(
  args: SendMemberEmailArgs,
): Promise<SendMemberEmailResult> {
  const { supabase, memberId, kind, refKey, subject, html } = args;
  const to = args.to.trim().toLowerCase();

  // Claim. A 23505 here means another run already owns this send.
  let logId: string | null = null;
  const { data: claim, error: claimError } = await supabase
    .from('member_emails')
    .insert({ member_id: memberId, email: to, kind, ref_key: refKey, subject, status: 'pending' })
    .select('id')
    .single();

  if (claimError) {
    if (claimError.code === '23505') {
      console.log(`member-email: duplicate suppressed kind=${kind} ref=${refKey} member=${memberId}`);
      return { status: 'duplicate' };
    }
    // The ledger is broken, but the email still matters more than the bookkeeping.
    console.error(`member-email: claim failed (sending anyway) kind=${kind}:`, claimError.message);
  } else {
    logId = claim?.id ?? null;
  }

  const finish = async (
    result: SendMemberEmailResult,
    fields: Record<string, unknown>,
  ): Promise<SendMemberEmailResult> => {
    if (logId) {
      const { error } = await supabase.from('member_emails').update(fields).eq('id', logId);
      if (error) console.error('member-email: ledger update failed:', error.message);
    }
    return result;
  };

  const resendKey = Deno.env.get('RESEND_API_KEY');
  if (!resendKey) {
    // The landmine, made loud: secrets are injected at function-deploy time, so a
    // function deployed before the secret existed runs blind to it.
    console.error(
      `member-email: RESEND_API_KEY is not set in this function's runtime — ` +
        `kind=${kind} ref=${refKey} NOT SENT. Add the secret, then redeploy the function.`,
    );
    return finish({ status: 'skipped_no_key' }, { status: 'skipped_no_key' });
  }

  try {
    const response = await fetch(RESEND_ENDPOINT, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${resendKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ from: BRAND.fromEmail, to, subject, html }),
    });

    const bodyText = await response.text();
    if (!response.ok) {
      const error = `Resend ${response.status}: ${bodyText.slice(0, 500)}`;
      console.error(`member-email: send failed kind=${kind} ref=${refKey} — ${error}`);
      return finish({ status: 'failed', error }, { status: 'failed', error });
    }

    let resendId: string | null = null;
    try {
      resendId = (JSON.parse(bodyText) as { id?: string }).id ?? null;
    } catch {
      // A 2xx with an unparseable body still means Resend accepted it.
    }

    console.log(`member-email: sent kind=${kind} ref=${refKey} to=${to} resend_id=${resendId}`);
    return finish(
      { status: 'sent', resendId },
      { status: 'sent', resend_id: resendId, sent_at: new Date().toISOString() },
    );
  } catch (err) {
    const error = err instanceof Error ? err.message : String(err);
    console.error(`member-email: send threw kind=${kind} ref=${refKey} — ${error}`);
    return finish({ status: 'failed', error }, { status: 'failed', error });
  }
}
