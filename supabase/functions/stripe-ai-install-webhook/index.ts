// Supabase Edge Functions bundle pinned npm: imports directly.
// deno-lint-ignore no-import-prefix
import Stripe from "npm:stripe@^22.0.0";
// deno-lint-ignore no-import-prefix
import { createClient } from "npm:@supabase/supabase-js@2.95.3";

import {
  type AiInstallCheckoutSession,
  type AiInstallEmailResources,
  extractAiInstallPurchase,
  isPaidAiInstallEvent,
  objectId,
  renderAiInstallPurchaseEmail,
  validateEmailResources,
} from "../_shared/ai-install-purchase.ts";

const AI_INSTALL_PAYMENT_LINK_ID = Deno.env.get("AI_INSTALL_PAYMENT_LINK_ID") ||
  "plink_1TwibDFB8ViubgHoQZU473el";
const EMAIL_KIND = "purchase_confirmation";
const DEFAULT_FROM = "Standard Playbook <info@standardplaybook.com>";

Deno.serve(async (req: Request): Promise<Response> => {
  if (req.method !== "POST") {
    return Response.json({ error: "Method not allowed" }, { status: 405 });
  }

  const signature = req.headers.get("stripe-signature");
  if (!signature) {
    return Response.json({ error: "Missing stripe-signature header" }, {
      status: 400,
    });
  }

  try {
    const stripeSecretKey = requiredEnv("STRIPE_SECRET_KEY");
    const webhookSecret = Deno.env.get("STRIPE_AI_INSTALL_WEBHOOK_SECRET") ||
      requiredEnv("STRIPE_WEBHOOK_SECRET");
    const stripe = new Stripe(stripeSecretKey);
    const cryptoProvider = Stripe.createSubtleCryptoProvider();
    const rawBody = await req.text();

    let event: Stripe.Event;
    try {
      event = await stripe.webhooks.constructEventAsync(
        rawBody,
        signature,
        webhookSecret,
        undefined,
        cryptoProvider,
      );
    } catch (error) {
      console.error(
        "ai-install-webhook: signature verification failed",
        errorMessage(error),
      );
      return Response.json({ error: "Invalid Stripe signature" }, {
        status: 400,
      });
    }

    if (
      event.type !== "checkout.session.completed" &&
      event.type !== "checkout.session.async_payment_succeeded"
    ) {
      return Response.json({ received: true, ignored: "event_type" });
    }

    const session = event.data.object as unknown as AiInstallCheckoutSession;
    const paymentLinkId = objectId(session.payment_link);
    if (paymentLinkId !== AI_INSTALL_PAYMENT_LINK_ID) {
      return Response.json({ received: true, ignored: "payment_link" });
    }

    if (!isPaidAiInstallEvent(event.type, session)) {
      return Response.json({ received: true, deferred: "awaiting_payment" });
    }

    const purchase = extractAiInstallPurchase(session, event.created);
    const resources = emailResources();
    validateEmailResources(resources);
    const email = renderAiInstallPurchaseEmail(purchase, resources);

    const supabase = createClient(
      requiredEnv("SUPABASE_URL"),
      requiredEnv("SUPABASE_SERVICE_ROLE_KEY"),
      { auth: { persistSession: false, autoRefreshToken: false } },
    );

    const now = new Date().toISOString();
    const { data: purchaseRow, error: purchaseError } = await supabase
      .from("ai_install_purchases")
      .upsert({
        stripe_checkout_session_id: purchase.stripeCheckoutSessionId,
        stripe_payment_intent_id: purchase.stripePaymentIntentId,
        stripe_payment_link_id: purchase.stripePaymentLinkId,
        last_stripe_event_id: event.id,
        email: purchase.email,
        full_name: purchase.fullName,
        business_name: purchase.businessName,
        phone: purchase.phone,
        tool_choice: purchase.toolChoice,
        tool_choice_raw: purchase.toolChoiceRaw,
        amount_total: purchase.amountTotal,
        currency: purchase.currency,
        payment_status: purchase.paymentStatus,
        purchased_at: purchase.purchasedAt,
        updated_at: now,
      }, { onConflict: "stripe_checkout_session_id" })
      .select("id")
      .single();

    if (purchaseError || !purchaseRow?.id) {
      throw new Error(
        `Could not record AI Install purchase: ${
          purchaseError?.message ?? "missing id"
        }`,
      );
    }

    const { error: sendInsertError } = await supabase
      .from("ai_install_email_sends")
      .insert({
        purchase_id: purchaseRow.id,
        kind: EMAIL_KIND,
        recipient_email: purchase.email,
        subject: email.subject,
        status: "pending",
      });

    if (sendInsertError && sendInsertError.code !== "23505") {
      throw new Error(
        `Could not create AI Install email ledger row: ${sendInsertError.message}`,
      );
    }

    const { data: sendRow, error: sendReadError } = await supabase
      .from("ai_install_email_sends")
      .select("id, status, attempt_count, resend_id")
      .eq("purchase_id", purchaseRow.id)
      .eq("kind", EMAIL_KIND)
      .single();

    if (sendReadError || !sendRow?.id) {
      throw new Error(
        `Could not read AI Install email ledger row: ${
          sendReadError?.message ?? "missing id"
        }`,
      );
    }

    if (sendRow.status === "sent") {
      return Response.json({
        received: true,
        duplicate: true,
        purchase_id: purchaseRow.id,
        resend_id: sendRow.resend_id,
      });
    }

    const { error: sendingError } = await supabase
      .from("ai_install_email_sends")
      .update({
        status: "sending",
        attempt_count: Number(sendRow.attempt_count ?? 0) + 1,
        last_attempt_at: now,
        updated_at: now,
        error: null,
      })
      .eq("id", sendRow.id);

    if (sendingError) {
      throw new Error(
        `Could not claim AI Install email send: ${sendingError.message}`,
      );
    }

    const resendKey = Deno.env.get("RESEND_API_KEY");
    if (!resendKey) {
      await supabase
        .from("ai_install_email_sends")
        .update({
          status: "skipped_no_key",
          updated_at: new Date().toISOString(),
        })
        .eq("id", sendRow.id);
      throw new Error("RESEND_API_KEY is not configured");
    }

    const resendResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${resendKey}`,
        "Content-Type": "application/json",
        "Idempotency-Key":
          `ai-install-welcome/${purchase.stripeCheckoutSessionId}`,
      },
      body: JSON.stringify({
        from: Deno.env.get("AI_INSTALL_FROM_EMAIL") || DEFAULT_FROM,
        to: [purchase.email],
        reply_to: Deno.env.get("AI_INSTALL_REPLY_TO") ||
          "info@standardplaybook.com",
        subject: email.subject,
        html: email.html,
        tags: [
          { name: "source", value: "ai_install" },
          { name: "email_kind", value: EMAIL_KIND },
          { name: "tool_choice", value: purchase.toolChoice },
        ],
      }),
    });

    const resendBody = await resendResponse.text();
    if (!resendResponse.ok) {
      const error = `Resend ${resendResponse.status}: ${
        resendBody.slice(0, 500)
      }`;
      await supabase
        .from("ai_install_email_sends")
        .update({
          status: "failed",
          error,
          updated_at: new Date().toISOString(),
        })
        .eq("id", sendRow.id);
      throw new Error(error);
    }

    let resendId: string | null = null;
    try {
      resendId = (JSON.parse(resendBody) as { id?: string }).id ?? null;
    } catch {
      // A 2xx response still means Resend accepted the message.
    }

    const { error: sentUpdateError } = await supabase
      .from("ai_install_email_sends")
      .update({
        status: "sent",
        resend_id: resendId,
        sent_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        error: null,
      })
      .eq("id", sendRow.id);

    if (sentUpdateError) {
      throw new Error(
        `Email sent but ledger update failed: ${sentUpdateError.message}`,
      );
    }

    console.log(
      `ai-install-webhook: fulfilled session=${purchase.stripeCheckoutSessionId} ` +
        `purchase=${purchaseRow.id} resend_id=${resendId ?? "unknown"}`,
    );

    return Response.json({
      received: true,
      purchase_id: purchaseRow.id,
      resend_id: resendId,
    });
  } catch (error) {
    console.error(
      "ai-install-webhook: fulfillment failed",
      errorMessage(error),
    );
    return Response.json({ error: "AI Install fulfillment failed" }, {
      status: 500,
    });
  }
});

function emailResources(): AiInstallEmailResources {
  return {
    zoomUrl: requiredEnv("AI_INSTALL_ZOOM_URL"),
    calendarUrl: requiredEnv("AI_INSTALL_CALENDAR_URL"),
    claudePreworkUrl: requiredEnv("AI_INSTALL_CLAUDE_PREWORK_URL"),
    codexPreworkUrl: requiredEnv("AI_INSTALL_CODEX_PREWORK_URL"),
  };
}

function requiredEnv(name: string): string {
  const value = Deno.env.get(name)?.trim();
  if (!value) throw new Error(`${name} is not configured`);
  return value;
}

function errorMessage(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}
