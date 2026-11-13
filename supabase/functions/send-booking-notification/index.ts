import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
const NOTIFICATION_RECIPIENTS = ["mary@standardplaybook.com", "info@standardplaybook.com"];

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

interface BookingLead {
  source?: string;
  session_id?: string;
  full_name: string;
  email: string;
  cell_phone: string;
  primary_carrier: string;
  whats_working: string;
  whats_not_working: string;
  desired_outcome: string;
}

const escapeHtml = (value: string) => value.replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]!));

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const lead: BookingLead = await req.json();

    for (const field of ['full_name', 'email', 'cell_phone', 'primary_carrier', 'whats_working', 'whats_not_working', 'desired_outcome'] as const) {
      const value = lead?.[field];
      const max = field === 'email' ? 254 : field === 'full_name' || field === 'primary_carrier' ? 200 : field === 'cell_phone' ? 50 : 20000;
      if (typeof value !== 'string' || !value.trim() || value.length > max) throw new Error('Incomplete prep form');
      lead[field] = value.trim();
    }
    lead.email = lead.email.toLowerCase();
    if (!/^[^@\s]+@[^@\s]+\.[a-z]{2,}$/.test(lead.email)) throw new Error('Invalid email');
    const source = lead.source ?? 'booking';
    const submission_key = lead.session_id ?? 'legacy';
    if (typeof submission_key !== 'string' || !/^[a-zA-Z0-9_-]{3,100}$/.test(submission_key)) throw new Error('Invalid submission reference');
    if (typeof source !== 'string' || !/^[a-z0-9-]{1,80}$/.test(source)) throw new Error('Invalid source');
    const secret = Deno.env.get('AGENCYBRAIN_LEAD_INTAKE_SECRET')?.trim();
    if (!secret) throw new Error('CRM intake is not configured');
    const crmResponse = await fetch(Deno.env.get('AGENCYBRAIN_LEAD_INTAKE_URL')?.trim() ||
      'https://wjqyccbytctqwceuhzhk.supabase.co/functions/v1/crm-lead-intake', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-lead-intake-secret': secret },
      body: JSON.stringify({ form: 'booking_prep', source, submission_key, name: lead.full_name, email: lead.email,
        phone: lead.cell_phone, primary_carrier: lead.primary_carrier, whats_working: lead.whats_working,
        whats_not_working: lead.whats_not_working, desired_outcome: lead.desired_outcome }),
      signal: AbortSignal.timeout(10000),
    });
    if (!crmResponse.ok) throw new Error('CRM intake rejected the form');
    const receipt = await crmResponse.json();
    if (receipt.ok !== true || typeof receipt.receipt_id !== 'string' || !/^[a-f0-9-]{36}$/.test(receipt.receipt_id)) {
      throw new Error('CRM intake did not confirm receipt');
    }

    const notification = {
      from: "Standard Playbook <booking@standardplaybook.com>",
      subject: `New Booking Lead: ${lead.full_name}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h1 style="color: #1a1a2e; border-bottom: 2px solid #4a6cf7; padding-bottom: 10px;">New Booking Lead</h1>
          
          <div style="background: #f8f9fa; border-radius: 8px; padding: 20px; margin: 20px 0;">
            <h2 style="color: #333; margin-top: 0;">Contact Information</h2>
            <p><strong>Name:</strong> ${escapeHtml(lead.full_name)}</p>
            <p><strong>Email:</strong> <a href="mailto:${escapeHtml(lead.email)}">${escapeHtml(lead.email)}</a></p>
            <p><strong>Cell Phone:</strong> <a href="tel:${escapeHtml(lead.cell_phone)}">${escapeHtml(lead.cell_phone)}</a></p>
          </div>

          <div style="background: #f8f9fa; border-radius: 8px; padding: 20px; margin: 20px 0;">
            <h2 style="color: #333; margin-top: 0;">Team Details</h2>
            <p><strong>Primary Carrier:</strong> ${escapeHtml(lead.primary_carrier)}</p>
            
            <h3 style="color: #4a6cf7;">What's Working</h3>
            <p>${escapeHtml(lead.whats_working)}</p>
            
            <h3 style="color: #e74c3c;">What's Not Working</h3>
            <p>${escapeHtml(lead.whats_not_working)}</p>
            
            <h3 style="color: #2ecc71;">Desired Outcome</h3>
            <p>${escapeHtml(lead.desired_outcome)}</p>
          </div>

          <p style="color: #666; font-size: 12px; margin-top: 30px;">
            This lead completed the booking onboarding form and is scheduling a call.
          </p>
        </div>
      `,
    };

    let notify = 'failed';
    try {
      const response = await fetch("https://api.resend.com/emails/batch", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${Deno.env.get("RESEND_API_KEY")}`,
          "Idempotency-Key": `booking-prep-${receipt.receipt_id}`,
        },
        body: JSON.stringify(NOTIFICATION_RECIPIENTS.map(to => ({ ...notification, to: [to] }))),
        signal: AbortSignal.timeout(10000),
      });
      notify = response.ok ? 'sent' : 'failed';
      if (!response.ok) console.error('Booking notification rejected:', response.status);
    } catch (error) {
      console.error('Booking email failed after CRM receipt was saved');
    }
    return new Response(JSON.stringify({ ok: true, crm: 'saved', notify }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (error: any) {
    console.error("Error sending booking notification:", error);
    return new Response(
      JSON.stringify({ error: "We could not confirm your form was received. Please contact info@standardplaybook.com so we can help." }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }
};

serve(handler);
