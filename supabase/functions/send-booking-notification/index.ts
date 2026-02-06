import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

interface BookingLead {
  full_name: string;
  email: string;
  cell_phone: string;
  primary_carrier: string;
  whats_working: string;
  whats_not_working: string;
  desired_outcome: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const lead: BookingLead = await req.json();

    if (!lead.full_name || !lead.email) {
      throw new Error("Missing required fields");
    }

    const emailResponse = await resend.emails.send({
      from: "Standard Playbook <booking@send.standardplaybook.com>",
      to: ["info@standardplaybook.com"],
      subject: `New Booking Lead: ${lead.full_name}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h1 style="color: #1a1a2e; border-bottom: 2px solid #4a6cf7; padding-bottom: 10px;">New Booking Lead</h1>
          
          <div style="background: #f8f9fa; border-radius: 8px; padding: 20px; margin: 20px 0;">
            <h2 style="color: #333; margin-top: 0;">Contact Information</h2>
            <p><strong>Name:</strong> ${lead.full_name}</p>
            <p><strong>Email:</strong> <a href="mailto:${lead.email}">${lead.email}</a></p>
            <p><strong>Cell Phone:</strong> <a href="tel:${lead.cell_phone}">${lead.cell_phone}</a></p>
          </div>

          <div style="background: #f8f9fa; border-radius: 8px; padding: 20px; margin: 20px 0;">
            <h2 style="color: #333; margin-top: 0;">Team Details</h2>
            <p><strong>Primary Carrier:</strong> ${lead.primary_carrier}</p>
            
            <h3 style="color: #4a6cf7;">What's Working</h3>
            <p>${lead.whats_working}</p>
            
            <h3 style="color: #e74c3c;">What's Not Working</h3>
            <p>${lead.whats_not_working}</p>
            
            <h3 style="color: #2ecc71;">Desired Outcome</h3>
            <p>${lead.desired_outcome}</p>
          </div>

          <p style="color: #666; font-size: 12px; margin-top: 30px;">
            This lead completed the booking onboarding form and is scheduling a call.
          </p>
        </div>
      `,
    });

    console.log("Booking notification sent:", emailResponse);

    return new Response(JSON.stringify(emailResponse), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (error: any) {
    console.error("Error sending booking notification:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }
};

serve(handler);
