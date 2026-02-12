import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

interface DirectiveApplication {
  full_name: string;
  email: string;
  cell_phone: string;
  agency_name: string;
  message: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const app: DirectiveApplication = await req.json();

    if (!app.full_name || !app.email) {
      throw new Error("Missing required fields");
    }

    const emailResponse = await resend.emails.send({
      from: "Standard Playbook <booking@standardplaybook.com>",
      to: ["info@standardplaybook.com"],
      subject: `New Directive Application: ${app.full_name}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h1 style="color: #1a1a2e; border-bottom: 2px solid #4a6cf7; padding-bottom: 10px;">New Directive Application</h1>
          
          <div style="background: #f8f9fa; border-radius: 8px; padding: 20px; margin: 20px 0;">
            <h2 style="color: #333; margin-top: 0;">Contact Information</h2>
            <p><strong>Name:</strong> ${app.full_name}</p>
            <p><strong>Email:</strong> <a href="mailto:${app.email}">${app.email}</a></p>
            <p><strong>Cell Phone:</strong> <a href="tel:${app.cell_phone}">${app.cell_phone}</a></p>
            <p><strong>Agency Name:</strong> ${app.agency_name}</p>
          </div>

          <div style="background: #f8f9fa; border-radius: 8px; padding: 20px; margin: 20px 0;">
            <h2 style="color: #333; margin-top: 0;">Their Message</h2>
            <p>${app.message || 'No message provided.'}</p>
          </div>

          <p style="color: #666; font-size: 12px; margin-top: 30px;">
            This application was submitted via the Directive application form on the website.
          </p>
        </div>
      `,
    });

    console.log("Directive notification sent:", emailResponse);

    return new Response(JSON.stringify(emailResponse), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (error: any) {
    console.error("Error sending directive notification:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }
};

serve(handler);
