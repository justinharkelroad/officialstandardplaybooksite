import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";
import { sequenceForTier } from "./templates/index.ts";
import { getDiagnosticParagraph } from "./data/mirrorDiagnostics.ts";
import type {
  MirrorEmail,
  MirrorEmailContext,
  MirrorPillar,
  MirrorTier,
} from "./templates/_shared.ts";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));
const BREVO_API_KEY = Deno.env.get("BREVO_API_KEY");
// Optional: Brevo automation list ID for the Mirror sequence. Configured in Brevo;
// passed through here so Justin can wire the actual list when ready.
const BREVO_MIRROR_LIST_ID = Deno.env.get("BREVO_MIRROR_LIST_ID");

const FROM_ADDRESS = "Standard Playbook <booking@standardplaybook.com>";
const INTERNAL_NOTIFICATION_TO = "justin@hfiagencies.com";
const MIRROR_PDF_URL = "https://standardplaybook.com/mirror-workbook.pdf";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

interface MirrorSubmission {
  id?: string;
  email: string;
  full_name: string;
  phone: string;
  carrier:
    | "allstate"
    | "state_farm"
    | "farmers"
    | "american_family"
    | "independent"
    | "other";
  total_score: number;
  tier: MirrorTier;
  weakest_pillar: MirrorPillar;
  pillar_scores: Record<string, number>;
  question_scores: Record<string, number>;
  utm_source?: string | null;
  utm_medium?: string | null;
  utm_campaign?: string | null;
  utm_content?: string | null;
  device_type?: string | null;
  user_agent?: string | null;
}

const CARRIER_LABELS: Record<MirrorSubmission["carrier"], string> = {
  allstate: "Allstate",
  state_farm: "State Farm",
  farmers: "Farmers",
  american_family: "American Family",
  independent: "Independent",
  other: "Other",
};

function splitName(full: string): { first: string; last: string } {
  const trimmed = (full ?? "").trim();
  if (!trimmed) return { first: "", last: "" };
  const idx = trimmed.indexOf(" ");
  if (idx === -1) return { first: trimmed, last: "" };
  return { first: trimmed.slice(0, idx), last: trimmed.slice(idx + 1).trim() };
}

const PILLAR_LABELS: Record<MirrorPillar, string> = {
  culture_team: "Culture & Team",
  systems_rhythm: "Systems & Rhythm",
  training_scripts: "Training & Scripts",
  marketing_lead_flow: "Marketing & Lead Flow",
  owner_command: "Owner Command",
};

const TIER_LABELS: Record<MirrorTier, string> = {
  foundation: "Foundation",
  developing: "Developing",
  established: "Established",
  advanced: "Advanced",
  elite: "Elite",
};

/* ── Body → HTML rendering ──────────────────────────────── */

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

/** Render inline markdown: **bold**, *italics*, [text](url). */
function renderInline(s: string): string {
  let t = escapeHtml(s);
  t = t.replace(
    /\[([^\]]+)\]\(([^)]+)\)/g,
    '<a href="$2" style="color:#2080FF;text-decoration:underline;">$1</a>',
  );
  t = t.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
  t = t.replace(/(^|[\s(])\*([^*]+)\*(?=[\s).,;!?]|$)/g, "$1<em>$2</em>");
  return t;
}

function renderBodyToHtml(body: string): string {
  const paragraphs = body.split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean);
  return paragraphs
    .map((p) => {
      const inner = p
        .split("\n")
        .map((line) => renderInline(line.trim()))
        .join("<br>");
      return `<p style="margin:0 0 18px;line-height:1.6;font-size:16px;color:#0A0A0B;">${inner}</p>`;
    })
    .join("\n");
}

function wrapEmail(preheader: string, bodyHtml: string): string {
  return `<!doctype html>
<html>
  <body style="margin:0;padding:0;background:#F4F2EE;">
    <span style="display:none!important;visibility:hidden;opacity:0;color:transparent;height:0;width:0;font-size:1px;line-height:1px;mso-hide:all;">${escapeHtml(preheader)}</span>
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#F4F2EE;">
      <tr>
        <td align="center" style="padding:32px 16px;">
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:560px;background:#FFFFFF;">
            <tr>
              <td style="padding:32px 28px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;color:#0A0A0B;">
                ${bodyHtml}
                <p style="margin:24px 0 0;font-size:11px;line-height:1.5;color:#0A0A0B;opacity:0.55;">
                  Standard Playbook · Fort Wayne, IN<br/>
                  You're receiving this because you took The Mirror at standardplaybook.com/mirror.
                </p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}

/* ── Brevo (optional) ──────────────────────────────────── */

async function pushToBrevo(s: MirrorSubmission) {
  if (!BREVO_API_KEY) {
    console.log("BREVO_API_KEY not set — skipping Brevo push");
    return;
  }
  const { first, last } = splitName(s.full_name);
  const hasPhone = Boolean(s.phone && s.phone.trim());

  const tags = [
    `tier:${s.tier}`,
    `pillar:${s.weakest_pillar}`,
    `carrier:${s.carrier}`,
    `has_phone:${hasPhone}`,
    "source:mirror",
    s.utm_source ? `utm_source:${s.utm_source}` : null,
    s.utm_campaign ? `utm_campaign:${s.utm_campaign}` : null,
  ].filter(Boolean) as string[];

  try {
    const body: Record<string, unknown> = {
      email: s.email,
      attributes: {
        FIRSTNAME: first,
        LASTNAME: last,
        FULLNAME: s.full_name,
        SMS: s.phone ?? "",
        PHONE: s.phone ?? "",
        CARRIER: s.carrier,
        MIRROR_SCORE: s.total_score,
        MIRROR_TIER: s.tier,
        MIRROR_WEAKEST: s.weakest_pillar,
        MIRROR_TAGS: tags.join(","),
        UTM_SOURCE: s.utm_source ?? "",
        UTM_MEDIUM: s.utm_medium ?? "",
        UTM_CAMPAIGN: s.utm_campaign ?? "",
        UTM_CONTENT: s.utm_content ?? "",
      },
      updateEnabled: true,
    };
    if (BREVO_MIRROR_LIST_ID) {
      body.listIds = [Number(BREVO_MIRROR_LIST_ID)];
    }

    const res = await fetch("https://api.brevo.com/v3/contacts", {
      method: "POST",
      headers: {
        "api-key": BREVO_API_KEY,
        "content-type": "application/json",
        accept: "application/json",
      },
      body: JSON.stringify(body),
    });
    if (!res.ok) {
      const text = await res.text();
      console.error("Brevo upsert failed", res.status, text);
    }
  } catch (err) {
    console.error("Brevo push error", err);
  }
}

/* ── User-facing drip via Resend scheduled_at ──────────── */

interface ScheduledSendResult {
  daysOffset: number;
  subject: string;
  scheduledAt: string | null;
  ok: boolean;
  id?: string;
  error?: string;
}

function buildContext(s: MirrorSubmission): MirrorEmailContext {
  const { first } = splitName(s.full_name);
  return {
    firstName: first || s.full_name || "there",
    fullName: s.full_name,
    score: s.total_score,
    tier: s.tier,
    tierName: TIER_LABELS[s.tier] ?? s.tier,
    weakestPillar: s.weakest_pillar,
    weakestPillarName: PILLAR_LABELS[s.weakest_pillar] ?? s.weakest_pillar,
    diagnosticParagraph: getDiagnosticParagraph(s.tier, s.weakest_pillar),
    pdfDownloadUrl: MIRROR_PDF_URL,
  };
}

async function sendDrip(s: MirrorSubmission): Promise<ScheduledSendResult[]> {
  const ctx = buildContext(s);
  const sequence = sequenceForTier(s.tier);
  if (sequence.length === 0) {
    console.warn(`No drip sequence configured for tier=${s.tier}`);
    return [];
  }

  const now = Date.now();
  const DAY_MS = 24 * 60 * 60 * 1000;

  const sends = sequence.map(async (entry): Promise<ScheduledSendResult> => {
    let email: MirrorEmail;
    try {
      email = entry.build(ctx);
    } catch (err: any) {
      return {
        daysOffset: entry.daysOffset,
        subject: "(template failed)",
        scheduledAt: null,
        ok: false,
        error: `template build failed: ${err?.message ?? String(err)}`,
      };
    }

    const html = wrapEmail(email.preheader, renderBodyToHtml(email.body));
    const scheduledAt = entry.daysOffset > 0
      ? new Date(now + entry.daysOffset * DAY_MS).toISOString()
      : null;

    const payload: Record<string, unknown> = {
      from: FROM_ADDRESS,
      to: [s.email],
      subject: email.subject,
      html,
      headers: {
        "X-Mirror-Tier": s.tier,
        "X-Mirror-Pillar": s.weakest_pillar,
        "X-Mirror-Score": String(s.total_score),
        "X-Mirror-Day": String(entry.daysOffset),
        "X-Mirror-Submission-Id": s.id ?? "",
      },
      tags: [
        { name: "mirror_tier", value: s.tier },
        { name: "mirror_pillar", value: s.weakest_pillar },
        { name: "mirror_day", value: `day_${entry.daysOffset}` },
        { name: "source", value: "mirror_drip" },
      ],
    };
    if (scheduledAt) payload.scheduled_at = scheduledAt;

    try {
      // The SDK's send accepts scheduled_at on supported plans.
      // deno-lint-ignore no-explicit-any
      const res: any = await (resend.emails.send as any)(payload);
      const id = res?.data?.id ?? res?.id;
      if (res?.error) {
        return {
          daysOffset: entry.daysOffset,
          subject: email.subject,
          scheduledAt,
          ok: false,
          error: typeof res.error === "string" ? res.error : JSON.stringify(res.error),
        };
      }
      return { daysOffset: entry.daysOffset, subject: email.subject, scheduledAt, ok: true, id };
    } catch (err: any) {
      return {
        daysOffset: entry.daysOffset,
        subject: email.subject,
        scheduledAt,
        ok: false,
        error: err?.message ?? String(err),
      };
    }
  });

  const results = await Promise.all(sends);
  return results;
}

/* ── HTTP handler ──────────────────────────────────────── */

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const s: MirrorSubmission = await req.json();

    if (
      !s.email ||
      typeof s.total_score !== "number" ||
      !s.tier ||
      !s.weakest_pillar ||
      !s.full_name ||
      !s.phone ||
      !s.carrier
    ) {
      throw new Error("Missing required fields");
    }

    const tierLabel = TIER_LABELS[s.tier] ?? s.tier;
    const pillarLabel = PILLAR_LABELS[s.weakest_pillar] ?? s.weakest_pillar;
    const pillarRows = Object.entries(s.pillar_scores)
      .map(([k, v]) =>
        `<li><strong>${PILLAR_LABELS[k as MirrorPillar] ?? k}:</strong> ${v}</li>`
      )
      .join("");

    const utmBlock = (s.utm_source || s.utm_campaign || s.utm_medium || s.utm_content)
      ? `
        <h2 style="color: #333; margin-top: 0;">Attribution</h2>
        <p><strong>Source:</strong> ${s.utm_source ?? "—"}</p>
        <p><strong>Medium:</strong> ${s.utm_medium ?? "—"}</p>
        <p><strong>Campaign:</strong> ${s.utm_campaign ?? "—"}</p>
        <p><strong>Content:</strong> ${s.utm_content ?? "—"}</p>
      `
      : "";

    /* 1) Internal notification — same as before. */
    const internal = await resend.emails.send({
      from: FROM_ADDRESS,
      to: [INTERNAL_NOTIFICATION_TO],
      subject: `New Mirror Submission: ${s.full_name} — ${tierLabel} (${s.total_score}/160)`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h1 style="color: #1a1a2e; border-bottom: 2px solid #2080FF; padding-bottom: 10px;">New Mirror Submission</h1>

          <div style="background: #f8f9fa; border-radius: 8px; padding: 20px; margin: 20px 0;">
            <h2 style="color: #333; margin-top: 0;">Score</h2>
            <p style="font-size: 28px; margin: 4px 0;"><strong>${s.total_score}</strong> / 160</p>
            <p><strong>Tier:</strong> ${tierLabel}</p>
            <p><strong>Weakest pillar:</strong> ${pillarLabel}</p>
          </div>

          <div style="background: #f8f9fa; border-radius: 8px; padding: 20px; margin: 20px 0;">
            <h2 style="color: #333; margin-top: 0;">Contact</h2>
            <p><strong>Name:</strong> ${s.full_name}</p>
            <p><strong>Email:</strong> <a href="mailto:${s.email}">${s.email}</a></p>
            <p><strong>Phone:</strong> <a href="tel:${s.phone}">${s.phone}</a></p>
            <p><strong>Carrier:</strong> ${CARRIER_LABELS[s.carrier] ?? s.carrier}</p>
            <p><strong>Device:</strong> ${s.device_type ?? "—"}</p>
          </div>

          <div style="background: #f8f9fa; border-radius: 8px; padding: 20px; margin: 20px 0;">
            <h2 style="color: #333; margin-top: 0;">Pillar Breakdown</h2>
            <ul>${pillarRows}</ul>
          </div>

          <div style="background: #f8f9fa; border-radius: 8px; padding: 20px; margin: 20px 0;">
            ${utmBlock}
          </div>

          <p style="color: #666; font-size: 12px; margin-top: 30px;">
            Submission ID: ${s.id ?? "—"}<br/>
            UA: ${s.user_agent ?? "—"}
          </p>
        </div>
      `,
    });

    /* 2) User-facing drip — fan out scheduled sends in parallel. */
    const dripResults = await sendDrip(s);

    /* 3) Optional Brevo upsert. No-op if BREVO_API_KEY isn't set. */
    await pushToBrevo(s);

    const dripSummary = {
      total: dripResults.length,
      ok: dripResults.filter((r) => r.ok).length,
      failed: dripResults.filter((r) => !r.ok).length,
      results: dripResults,
    };
    console.log("Mirror notification sent. Drip:", dripSummary);

    return new Response(
      JSON.stringify({ ok: true, internal, drip: dripSummary }),
      { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } },
    );
  } catch (error: any) {
    console.error("Error sending mirror notification:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } },
    );
  }
};

serve(handler);
