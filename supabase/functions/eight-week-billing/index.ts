// Supabase Edge Functions bundle pinned npm: imports directly.
// deno-lint-ignore no-import-prefix
import Stripe from "npm:stripe@^22.0.0";
// deno-lint-ignore no-import-prefix
import { createClient, type SupabaseClient } from "npm:@supabase/supabase-js@2.95.3";
// deno-lint-ignore no-import-prefix
import { Resend } from "npm:resend@4.0.0";
import { buildEmailHtml, escapeHtml } from "../_shared/email-template.ts";
import { getSupabaseServiceKey } from "../_shared/supabaseKeys.ts";
import {
  type CheckoutSessionLike,
  type EightWeekPurchase,
  type InvoiceLike,
  invoiceSubscriptionId,
  isRenewalInvoice,
  nextChargeDate,
  paymentEmail,
  purchaseEmail,
  purchaseFromSession,
} from "./logic.ts";

/**
 * 8-Week billing emails (Stripe webhook).
 *
 * The weekly 8-Week link is a Stripe subscription, and Stripe payment links
 * can't stop after a set number of charges. So:
 *   - checkout.session.completed for either 8-Week link: record the purchase
 *     and email the team (buyer, plan, link to the subscription).
 *   - invoice.paid for a recorded weekly subscription: count the payment.
 *     When the 8th payment clears (week 7), email "cancel now". Any payment
 *     after that emails an overcharge alert.
 * Everything else Stripe sends (other products' invoices) is acknowledged
 * and ignored.
 *
 * If an email fails, the function returns 500 so Stripe retries the event;
 * the payment row is rolled back first so the retry counts it again.
 *
 * Secrets: STRIPE_EIGHT_WEEK_WEBHOOK_SECRET (signing secret of this
 * function's Stripe webhook endpoint), RESEND_API_KEY (shared), optional
 * EIGHT_WEEK_NOTIFY_TO (comma-separated; defaults to info@standardplaybook.com).
 */

const FROM = "Standard Playbook <booking@standardplaybook.com>";
const DEFAULT_TO = "info@standardplaybook.com";

type Email = ReturnType<typeof purchaseEmail>;

async function sendEmail(email: Email, replyTo: string | null): Promise<void> {
  const apiKey = Deno.env.get("RESEND_API_KEY")?.trim();
  if (!apiKey) throw new Error("RESEND_API_KEY is not set");
  const to = (Deno.env.get("EIGHT_WEEK_NOTIFY_TO") || DEFAULT_TO).split(",").map((s) => s.trim()).filter(Boolean);
  const { error } = await new Resend(apiKey).emails.send({
    from: FROM,
    to,
    ...(replyTo ? { replyTo } : {}),
    subject: email.subject,
    html: buildEmailHtml({ title: email.title, subtitle: email.subtitle, bodyContent: email.bodyHtml, eyebrow: "8-Week billing" }),
  });
  if (error) throw new Error(`Resend: ${error.message}`);
}

async function handleCheckout(db: SupabaseClient, purchase: EightWeekPurchase): Promise<Response> {
  const { data: row, error } = await db
    .from("eight_week_purchases")
    .upsert({
      stripe_checkout_session_id: purchase.sessionId,
      stripe_payment_link_id: purchase.paymentLinkId,
      stripe_subscription_id: purchase.subscriptionId,
      plan: purchase.plan,
      email: purchase.email,
      full_name: purchase.fullName,
      phone: purchase.phone,
      amount_total: purchase.amountTotal,
      currency: purchase.currency,
      purchased_at: purchase.purchasedAt,
    }, { onConflict: "stripe_checkout_session_id" })
    .select("id, purchase_email_sent_at")
    .single();
  if (error || !row) throw new Error(`Could not record the purchase: ${error?.message ?? "no row"}`);

  // Stripe can deliver the same event twice; email once.
  if (row.purchase_email_sent_at) return Response.json({ received: true, duplicate: true });

  await sendEmail(purchaseEmail(purchase, escapeHtml), purchase.email);
  await db.from("eight_week_purchases").update({ purchase_email_sent_at: new Date().toISOString() }).eq("id", row.id);
  return Response.json({ received: true, recorded: purchase.plan });
}

async function handleInvoice(db: SupabaseClient, invoice: InvoiceLike, eventCreated: number): Promise<Response> {
  if (!isRenewalInvoice(invoice)) return Response.json({ received: true, ignored: "not_a_renewal" });
  const subscriptionId = invoiceSubscriptionId(invoice);
  if (!subscriptionId) return Response.json({ received: true, ignored: "no_subscription" });

  // Every subscription in the account sends invoice.paid; only act on 8-Week ones.
  const { data: purchase } = await db
    .from("eight_week_purchases")
    .select("id, full_name, email, stripe_subscription_id, cancel_reminder_sent_at")
    .eq("stripe_subscription_id", subscriptionId)
    .maybeSingle();
  if (!purchase) return Response.json({ received: true, ignored: "not_eight_week" });

  const paidAt = invoice.status_transitions?.paid_at ?? eventCreated;
  const { data: inserted, error } = await db
    .from("eight_week_payments")
    .upsert({
      stripe_invoice_id: invoice.id,
      stripe_subscription_id: subscriptionId,
      amount_paid: invoice.amount_paid ?? null,
      paid_at: new Date(paidAt * 1000).toISOString(),
    }, { onConflict: "stripe_invoice_id", ignoreDuplicates: true })
    .select("stripe_invoice_id");
  if (error) throw new Error(`Could not record the payment: ${error.message}`);
  if (!inserted?.length) return Response.json({ received: true, duplicate: true });

  const { count, error: countError } = await db
    .from("eight_week_payments")
    .select("stripe_invoice_id", { count: "exact", head: true })
    .eq("stripe_subscription_id", subscriptionId);
  if (countError || count === null) throw new Error(`Could not count payments: ${countError?.message}`);

  // Payment 1 was collected at checkout; renewals are payments 2, 3, ...
  const paymentNumber = count + 1;
  const email = paymentEmail(
    { fullName: purchase.full_name, email: purchase.email, subscriptionId },
    paymentNumber,
    nextChargeDate(invoice, paidAt),
    escapeHtml,
  );
  if (!email) return Response.json({ received: true, payment: paymentNumber });

  try {
    await sendEmail(email, purchase.email);
  } catch (sendError) {
    // Undo the count so Stripe's retry of this event sends the email.
    await db.from("eight_week_payments").delete().eq("stripe_invoice_id", invoice.id);
    throw sendError;
  }
  if (!purchase.cancel_reminder_sent_at) {
    await db.from("eight_week_purchases").update({ cancel_reminder_sent_at: new Date().toISOString() }).eq("id", purchase.id);
  }
  return Response.json({ received: true, payment: paymentNumber, emailed: true });
}

Deno.serve(async (req: Request): Promise<Response> => {
  if (req.method !== "POST") return Response.json({ error: "Method not allowed" }, { status: 405 });
  const signature = req.headers.get("stripe-signature");
  if (!signature) return Response.json({ error: "Missing stripe-signature header" }, { status: 400 });

  const secret = Deno.env.get("STRIPE_EIGHT_WEEK_WEBHOOK_SECRET")?.trim();
  if (!secret) {
    console.error("eight-week-billing: STRIPE_EIGHT_WEEK_WEBHOOK_SECRET is not set");
    return Response.json({ error: "Not configured" }, { status: 500 });
  }

  // Signature checks are local cryptography; no Stripe API key is needed.
  const stripe = new Stripe("sk_webhook_signature_verification_only");
  const rawBody = await req.text();
  let event: Stripe.Event;
  try {
    event = await stripe.webhooks.constructEventAsync(rawBody, signature, secret, undefined, Stripe.createSubtleCryptoProvider());
  } catch (error) {
    console.error("eight-week-billing: bad signature", error instanceof Error ? error.message : error);
    return Response.json({ error: "Invalid Stripe signature" }, { status: 400 });
  }

  try {
    const db = createClient(Deno.env.get("SUPABASE_URL") ?? "", getSupabaseServiceKey(), {
      auth: { persistSession: false, autoRefreshToken: false },
    });
    if (event.type === "checkout.session.completed") {
      const purchase = purchaseFromSession(event.data.object as unknown as CheckoutSessionLike, event.created);
      if (!purchase) return Response.json({ received: true, ignored: "not_eight_week" });
      return await handleCheckout(db, purchase);
    }
    if (event.type === "invoice.paid") {
      return await handleInvoice(db, event.data.object as unknown as InvoiceLike, event.created);
    }
    return Response.json({ received: true, ignored: event.type });
  } catch (error) {
    console.error("eight-week-billing:", error instanceof Error ? error.message : error);
    return Response.json({ error: "Processing failed; Stripe will retry" }, { status: 500 });
  }
});
