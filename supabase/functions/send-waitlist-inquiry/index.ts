import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

interface WaitlistInquiry {
  // "directive" or "momentum".
  program?: string;
  full_name: string;
  email: string;
  cell_phone?: string;
  agency_name?: string;
  state?: string;
  question: string;
}

const PROGRAM_NAMES: Record<string, string> = {
  directive: "The Directive",
  momentum: "Momentum",
};

const programLabel = (program?: string) =>
  (program && PROGRAM_NAMES[program]) || "The Directive";

/**
 * Who receives a "more information" inquiry from a waitlist member.
 * Defaults to Justin's shared inbox plus Mary. Override with the
 * WAITLIST_INQUIRY_RECIPIENTS secret (comma-separated) to change the list
 * later without a code change.
 */
function recipients(): string[] {
  const configured = Deno.env.get("WAITLIST_INQUIRY_RECIPIENTS")?.trim();
  if (configured) {
    const list = configured.split(",").map((s) => s.trim()).filter(Boolean);
    if (list.length) return list;
  }
  return ["info@standardplaybook.com", "mary@standardplaybook.com"];
}

const esc = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const inquiry: WaitlistInquiry = await req.json();

    if (!inquiry.full_name || !inquiry.email || !inquiry.question) {
      throw new Error("Missing required fields");
    }

    const program = programLabel(inquiry.program);

    const emailResponse = await resend.emails.send({
      from: "Standard Playbook <booking@standardplaybook.com>",
      to: recipients(),
      reply_to: inquiry.email,
      subject: `${program} waitlist — more info request from ${inquiry.full_name}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h1 style="color: #1a1a2e; border-bottom: 2px solid #4a6cf7; padding-bottom: 10px;">More information requested — ${program}</h1>

          <div style="background: #f8f9fa; border-radius: 8px; padding: 20px; margin: 20px 0;">
            <h2 style="color: #333; margin-top: 0;">Their question</h2>
            <p>${esc(inquiry.question)}</p>
          </div>

          <div style="background: #f8f9fa; border-radius: 8px; padding: 20px; margin: 20px 0;">
            <h2 style="color: #333; margin-top: 0;">Who's asking</h2>
            <p><strong>Name:</strong> ${esc(inquiry.full_name)}</p>
            <p><strong>Email:</strong> <a href="mailto:${esc(inquiry.email)}">${esc(inquiry.email)}</a></p>
            <p><strong>Cell Phone:</strong> ${inquiry.cell_phone ? `<a href="tel:${esc(inquiry.cell_phone)}">${esc(inquiry.cell_phone)}</a>` : 'Not provided.'}</p>
            <p><strong>Agency Name:</strong> ${inquiry.agency_name ? esc(inquiry.agency_name) : 'Not provided.'}</p>
            <p><strong>State:</strong> ${inquiry.state ? esc(inquiry.state) : 'Not provided.'}</p>
            <p><strong>Program:</strong> ${program}</p>
          </div>

          <p style="color: #666; font-size: 12px; margin-top: 30px;">
            Reply to this email to answer them directly. Sent from the ${program} waitlist confirmation on the website.
          </p>
        </div>
      `,
    });

    console.log("Waitlist inquiry sent:", emailResponse);

    return new Response(JSON.stringify(emailResponse), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (error: any) {
    console.error("Error sending waitlist inquiry:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }
};

serve(handler);
