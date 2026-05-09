import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));
const BREVO_API_KEY = Deno.env.get("BREVO_API_KEY");
// Optional: Brevo automation list ID for the Mirror sequence. Configured in Brevo;
// passed through here so Justin can wire the actual list when ready.
const BREVO_MIRROR_LIST_ID = Deno.env.get("BREVO_MIRROR_LIST_ID");

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
  tier: "foundation" | "developing" | "established" | "advanced" | "elite";
  weakest_pillar:
    | "culture_team"
    | "systems_rhythm"
    | "training_scripts"
    | "marketing_lead_flow"
    | "owner_command";
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

const PILLAR_LABELS: Record<MirrorSubmission["weakest_pillar"], string> = {
  culture_team: "Culture & Team",
  systems_rhythm: "Systems & Rhythm",
  training_scripts: "Training & Scripts",
  marketing_lead_flow: "Marketing & Lead Flow",
  owner_command: "Owner Command",
};

const TIER_LABELS: Record<MirrorSubmission["tier"], string> = {
  foundation: "Foundation",
  developing: "Developing",
  established: "Established",
  advanced: "Advanced",
  elite: "Elite",
};

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
      .map(([k, v]) => `<li><strong>${PILLAR_LABELS[k as MirrorSubmission["weakest_pillar"]] ?? k}:</strong> ${v}</li>`)
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

    const emailResponse = await resend.emails.send({
      from: "Standard Playbook <booking@standardplaybook.com>",
      to: ["justin@hfiagencies.com"],
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

    // Push to Brevo (non-blocking — don't fail the user-facing response if Brevo is down).
    await pushToBrevo(s);

    console.log("Mirror notification sent:", emailResponse);

    return new Response(JSON.stringify({ ok: true, email: emailResponse }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (error: any) {
    console.error("Error sending mirror notification:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } },
    );
  }
};

serve(handler);
