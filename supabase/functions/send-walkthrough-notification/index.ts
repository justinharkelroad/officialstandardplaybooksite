import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

// Agency Brain house CRM: each lead from this form also goes into the CRM as warm, through
// Agency Brain's crm-lead-intake function (matched against who is already there, never doubled).
// Best effort: skipped until AGENCYBRAIN_LEAD_INTAKE_SECRET is set, and a failure never fails the form.
const AGENCYBRAIN_LEAD_URL = Deno.env.get("AGENCYBRAIN_LEAD_INTAKE_URL")?.trim() ||
  "https://wjqyccbytctqwceuhzhk.supabase.co/functions/v1/crm-lead-intake";

async function sendToAgencyBrain(lead: Record<string, unknown>): Promise<string> {
  const secret = Deno.env.get("AGENCYBRAIN_LEAD_INTAKE_SECRET")?.trim();
  if (!secret) return "skipped";
  try {
    const res = await fetch(AGENCYBRAIN_LEAD_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-lead-intake-secret": secret },
      body: JSON.stringify(lead),
      signal: AbortSignal.timeout(5000),
    });
    if (!res.ok) {
      console.error("Agency Brain lead:", res.status, (await res.text()).slice(0, 200));
      return `failed_${res.status}`;
    }
    return "sent";
  } catch (error) {
    console.error("Agency Brain lead:", error instanceof Error ? error.message : error);
    return "failed";
  }
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { full_name, email, cell_phone, text_ok } = await req.json();

    if (!full_name || !email) {
      throw new Error("Missing required fields");
    }

    const crmLead = sendToAgencyBrain({ form: "ai_walkthrough", name: full_name, email, phone: cell_phone, text_ok: text_ok === true });

    const emailResponse = await resend.emails.send({
      from: "Standard Playbook <booking@standardplaybook.com>",
      to: ["info@standardplaybook.com"],
      subject: `AI Walkthrough Lead: ${full_name}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h1 style="color: #1a1a2e; border-bottom: 2px solid #4a6cf7; padding-bottom: 10px;">New AI Walkthrough Download</h1>
          
          <div style="background: #f8f9fa; border-radius: 8px; padding: 20px; margin: 20px 0;">
            <h2 style="color: #333; margin-top: 0;">Contact Information</h2>
            <p><strong>Name:</strong> ${full_name}</p>
            <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
            <p><strong>Phone:</strong> <a href="tel:${cell_phone}">${cell_phone}</a></p>
          </div>

          <p style="color: #666; font-size: 12px; margin-top: 30px;">
            This lead downloaded the AI Brain Walkthrough PDF from /ai-walk-through.
          </p>
        </div>
      `,
    });

    console.log("Walkthrough notification sent:", emailResponse);

    await crmLead;

    return new Response(JSON.stringify(emailResponse), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (error: any) {
    console.error("Error sending walkthrough notification:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }
};

serve(handler);
