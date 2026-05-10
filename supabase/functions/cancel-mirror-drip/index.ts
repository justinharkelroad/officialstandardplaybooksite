// cancel-mirror-drip — single-file Edge Function for Lovable Cloud.
// Cancels a Mirror lead's pending Resend drip sends by email and updates the
// mirror_drip_sends ledger. Idempotent — calling with no queued rows no-ops.

import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");

const supa = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
  { auth: { persistSession: false } },
);

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

interface CancelRequest {
  email: string;
  reason?: string;
}

interface DripRow {
  id: string;
  resend_id: string | null;
  day_offset: number;
  scheduled_at: string | null;
}

interface CancelResult {
  id: string;
  resend_id: string | null;
  day_offset: number;
  ok: boolean;
  status: "cancelled" | "failed";
  detail?: string;
}

// Same throttle as send-mirror-notification — Resend caps at 5 req/sec.
const RESEND_PER_CALL_DELAY_MS = 250;
const sleep = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));

async function cancelOneAtResend(resendId: string): Promise<{ ok: boolean; status: number; detail?: string }> {
  if (!RESEND_API_KEY) {
    return { ok: false, status: 0, detail: "RESEND_API_KEY missing in env" };
  }
  try {
    // Resend's cancel endpoint is POST /emails/{id}/cancel — there is no DELETE.
    const res = await fetch(`https://api.resend.com/emails/${encodeURIComponent(resendId)}/cancel`, {
      method: "POST",
      headers: { Authorization: `Bearer ${RESEND_API_KEY}` },
    });
    if (res.ok) return { ok: true, status: res.status };
    // 404 = already sent / never existed at Resend. Treat as "nothing to cancel".
    if (res.status === 404) return { ok: true, status: 404, detail: "not_found_at_resend" };
    let body = "";
    try { body = await res.text(); } catch { /* ignore */ }
    // 422 "Email is not scheduled" means the email already sent (or scheduling
    // failed at send time). Either way there's nothing to cancel — treat as a
    // no-op success so the ledger row gets cleaned up.
    if (res.status === 422 && /not\s+scheduled/i.test(body)) {
      return { ok: true, status: 422, detail: "already_sent_or_not_scheduled" };
    }
    return { ok: false, status: res.status, detail: body || `HTTP ${res.status}` };
  } catch (err: any) {
    return { ok: false, status: 0, detail: err?.message ?? String(err) };
  }
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const body: CancelRequest = await req.json();
    const rawEmail = (body?.email ?? "").trim().toLowerCase();
    const reason = body?.reason ?? "manual";

    if (!rawEmail) {
      return new Response(
        JSON.stringify({ error: "email is required" }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } },
      );
    }

    const nowIso = new Date().toISOString();

    // Pull all queued, future-scheduled rows for this email.
    const { data: rows, error: queryErr } = await supa
      .from("mirror_drip_sends")
      .select("id, resend_id, day_offset, scheduled_at")
      .eq("email", rawEmail)
      .eq("status", "queued")
      .gt("scheduled_at", nowIso);

    if (queryErr) {
      console.error("mirror_drip_sends query failed:", queryErr);
      return new Response(
        JSON.stringify({ error: "query failed", detail: queryErr.message }),
        { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } },
      );
    }

    const pending: DripRow[] = (rows ?? []) as DripRow[];

    if (pending.length === 0) {
      console.log(`cancel-mirror-drip: nothing pending for ${rawEmail}`);
      return new Response(
        JSON.stringify({ ok: true, email: rawEmail, cancelled: 0, failed: 0, results: [] }),
        { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } },
      );
    }

    const results: CancelResult[] = [];

    for (let i = 0; i < pending.length; i++) {
      const row = pending[i];

      if (!row.resend_id) {
        // No Resend id stored — can't cancel at Resend. Mark cancelled in our ledger anyway.
        const { error: updateErr } = await supa
          .from("mirror_drip_sends")
          .update({
            status: "cancelled",
            cancelled_at: new Date().toISOString(),
            cancel_reason: `${reason}:no_resend_id`,
          })
          .eq("id", row.id);
        if (updateErr) {
          console.error(`mirror_drip_sends update failed (no resend_id) id=${row.id}:`, updateErr);
          results.push({
            id: row.id,
            resend_id: null,
            day_offset: row.day_offset,
            ok: false,
            status: "failed",
            detail: `db update failed: ${updateErr.message}`,
          });
        } else {
          results.push({
            id: row.id,
            resend_id: null,
            day_offset: row.day_offset,
            ok: true,
            status: "cancelled",
            detail: "no_resend_id",
          });
        }
        if (i < pending.length - 1) await sleep(RESEND_PER_CALL_DELAY_MS);
        continue;
      }

      const cancelRes = await cancelOneAtResend(row.resend_id);

      if (cancelRes.ok) {
        const { error: updateErr } = await supa
          .from("mirror_drip_sends")
          .update({
            status: "cancelled",
            cancelled_at: new Date().toISOString(),
            cancel_reason: cancelRes.detail
              && cancelRes.detail !== ""
              && (cancelRes.detail === "not_found_at_resend" ||
                  cancelRes.detail === "already_sent_or_not_scheduled")
              ? `${reason}:${cancelRes.detail}`
              : reason,
          })
          .eq("id", row.id);
        if (updateErr) {
          console.error(`mirror_drip_sends update failed id=${row.id}:`, updateErr);
          results.push({
            id: row.id,
            resend_id: row.resend_id,
            day_offset: row.day_offset,
            ok: false,
            status: "failed",
            detail: `cancelled at Resend but db update failed: ${updateErr.message}`,
          });
        } else {
          results.push({
            id: row.id,
            resend_id: row.resend_id,
            day_offset: row.day_offset,
            ok: true,
            status: "cancelled",
            detail: cancelRes.detail,
          });
        }
      } else {
        console.error(`Resend DELETE failed id=${row.resend_id} status=${cancelRes.status}: ${cancelRes.detail}`);
        const { error: updateErr } = await supa
          .from("mirror_drip_sends")
          .update({
            status: "failed",
            send_error: `cancel failed (HTTP ${cancelRes.status}): ${cancelRes.detail ?? ""}`,
          })
          .eq("id", row.id);
        if (updateErr) {
          console.error(`mirror_drip_sends failure-mark failed id=${row.id}:`, updateErr);
        }
        results.push({
          id: row.id,
          resend_id: row.resend_id,
          day_offset: row.day_offset,
          ok: false,
          status: "failed",
          detail: cancelRes.detail,
        });
      }

      if (i < pending.length - 1) await sleep(RESEND_PER_CALL_DELAY_MS);
    }

    const cancelled = results.filter((r) => r.ok).length;
    const failed = results.filter((r) => !r.ok).length;

    console.log(
      `cancel-mirror-drip: ${rawEmail} cancelled=${cancelled} failed=${failed} reason=${reason}`,
    );

    return new Response(
      JSON.stringify({ ok: true, email: rawEmail, cancelled, failed, results }),
      { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } },
    );
  } catch (error: any) {
    console.error("cancel-mirror-drip error:", error);
    return new Response(
      JSON.stringify({ error: error?.message ?? String(error) }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } },
    );
  }
};

serve(handler);
