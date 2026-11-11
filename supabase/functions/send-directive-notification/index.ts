import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

interface WaitlistApplication {
  // "directive" or "momentum" — both waitlists share this function and table.
  program?: string;
  full_name: string;
  email: string;
  cell_phone: string;
  agency_name: string;
  state?: string;
  message: string;
  text_ok?: boolean;
}

const PROGRAM_NAMES: Record<string, string> = {
  directive: "The Directive",
  momentum: "Momentum",
};

const programLabel = (program?: string) =>
  (program && PROGRAM_NAMES[program]) || "The Directive";

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
    const app: WaitlistApplication = await req.json();

    if (!app.full_name || !app.email) {
      throw new Error("Missing required fields");
    }

    const program = programLabel(app.program);

    const crmLead = sendToAgencyBrain({
      form: app.program === "momentum" ? "momentum" : "directive",
      name: app.full_name, email: app.email, phone: app.cell_phone,
      business: app.agency_name, state: app.state, detail: app.message,
      text_ok: app.text_ok === true,
    });

    const emailResponse = await resend.emails.send({
      from: "Standard Playbook <booking@standardplaybook.com>",
      to: ["info@standardplaybook.com"],
      subject: `New ${program} Waitlist Signup: ${app.full_name}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h1 style="color: #1a1a2e; border-bottom: 2px solid #4a6cf7; padding-bottom: 10px;">New ${program} Waitlist Signup</h1>

          <div style="background: #f8f9fa; border-radius: 8px; padding: 20px; margin: 20px 0;">
            <h2 style="color: #333; margin-top: 0;">Contact Information</h2>
            <p><strong>Name:</strong> ${app.full_name}</p>
            <p><strong>Email:</strong> <a href="mailto:${app.email}">${app.email}</a></p>
            <p><strong>Cell Phone:</strong> <a href="tel:${app.cell_phone}">${app.cell_phone}</a></p>
            <p><strong>Agency Name:</strong> ${app.agency_name || 'Not provided.'}</p>
            <p><strong>State:</strong> ${app.state || 'Not provided.'}</p>
            <p><strong>Program:</strong> ${program}</p>
          </div>

          <div style="background: #f8f9fa; border-radius: 8px; padding: 20px; margin: 20px 0;">
            <h2 style="color: #333; margin-top: 0;">Why ${program} / what they want to talk about</h2>
            <p>${app.message || 'No message provided.'}</p>
          </div>

          <p style="color: #666; font-size: 12px; margin-top: 30px;">
            This signup was submitted via the ${program} waitlist form on the website.
          </p>
        </div>
      `,
    });

    console.log("Waitlist notification sent:", emailResponse);

    await crmLead;

    return new Response(JSON.stringify(emailResponse), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (error: any) {
    console.error("Error sending waitlist notification:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }
};

serve(handler);
