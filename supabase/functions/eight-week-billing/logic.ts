/**
 * Pure helpers for eight-week-billing: which Stripe objects are 8-Week
 * purchases, how many weekly payments have cleared, and the email copy.
 * Kept free of I/O so they can be unit tested.
 */

/** Stripe payment links (looked up in the live account, 2026-11-01). */
export const EIGHT_WEEK_LINKS = {
  weekly: "plink_1UX5vpFB8ViubgHoz4rYDo0H", // $625/week subscription
  pif: "plink_1UX5vMFB8ViubgHoCxvhKrbB", // $4,500 one time
} as const;

export type EightWeekPlan = keyof typeof EIGHT_WEEK_LINKS;

/** The weekly plan is done after this many payments. */
export const TOTAL_WEEKLY_PAYMENTS = 8;

const DAY_MS = 24 * 60 * 60 * 1000;

/** Stripe fields can be an id string or an expanded object. */
export function objectId(value: unknown): string | null {
  if (typeof value === "string") return value || null;
  if (value && typeof value === "object" && typeof (value as { id?: unknown }).id === "string") {
    return (value as { id: string }).id;
  }
  return null;
}

export function planForLink(paymentLinkId: string | null): EightWeekPlan | null {
  if (paymentLinkId === EIGHT_WEEK_LINKS.weekly) return "weekly";
  if (paymentLinkId === EIGHT_WEEK_LINKS.pif) return "pif";
  return null;
}

export interface CheckoutSessionLike {
  id: string;
  payment_link?: unknown;
  payment_status?: string;
  subscription?: unknown;
  amount_total?: number | null;
  currency?: string | null;
  customer_details?: { email?: string | null; name?: string | null; phone?: string | null } | null;
  customer_email?: string | null;
}

export interface EightWeekPurchase {
  sessionId: string;
  paymentLinkId: string;
  plan: EightWeekPlan;
  subscriptionId: string | null;
  email: string | null;
  fullName: string | null;
  phone: string | null;
  amountTotal: number | null;
  currency: string | null;
  purchasedAt: string;
}

/** The purchase from a completed checkout, or null when it isn't a paid 8-Week checkout. */
export function purchaseFromSession(session: CheckoutSessionLike, createdUnix: number): EightWeekPurchase | null {
  const paymentLinkId = objectId(session.payment_link);
  const plan = planForLink(paymentLinkId);
  if (!plan || !paymentLinkId) return null;
  if (session.payment_status && session.payment_status !== "paid") return null;
  const details = session.customer_details ?? {};
  return {
    sessionId: session.id,
    paymentLinkId,
    plan,
    subscriptionId: objectId(session.subscription),
    email: details.email ?? session.customer_email ?? null,
    fullName: details.name ?? null,
    phone: details.phone ?? null,
    amountTotal: session.amount_total ?? null,
    currency: session.currency ?? null,
    purchasedAt: new Date(createdUnix * 1000).toISOString(),
  };
}

export interface InvoiceLike {
  id: string;
  billing_reason?: string | null;
  amount_paid?: number | null;
  subscription?: unknown;
  parent?: { subscription_details?: { subscription?: unknown } | null } | null;
  status_transitions?: { paid_at?: number | null } | null;
  lines?: { data?: { period?: { end?: number | null } | null }[] } | null;
}

/** The subscription on an invoice, across Stripe API versions (it moved under `parent` in 2025). */
export function invoiceSubscriptionId(invoice: InvoiceLike): string | null {
  return objectId(invoice.subscription) ?? objectId(invoice.parent?.subscription_details?.subscription);
}

/**
 * Renewal payments only. The first payment is collected at checkout and is
 * counted from the purchase itself.
 */
export const isRenewalInvoice = (invoice: InvoiceLike) => invoice.billing_reason === "subscription_cycle";

/** When the next weekly charge will be attempted (end of the period just paid). */
export function nextChargeDate(invoice: InvoiceLike, paidAtUnix: number): Date {
  const end = invoice.lines?.data?.[0]?.period?.end;
  return end ? new Date(end * 1000) : new Date(paidAtUnix * 1000 + 7 * DAY_MS);
}

/** What to tell the team after weekly payment `paymentNumber` clears. */
export function paymentNotice(paymentNumber: number): "cancel_now" | "overcharged" | null {
  if (paymentNumber === TOTAL_WEEKLY_PAYMENTS) return "cancel_now";
  if (paymentNumber > TOTAL_WEEKLY_PAYMENTS) return "overcharged";
  return null;
}

export const subscriptionUrl = (subscriptionId: string) => `https://dashboard.stripe.com/subscriptions/${subscriptionId}`;

const money = (cents: number | null, currency: string | null) =>
  cents === null ? null : `$${(cents / 100).toLocaleString("en-US", { minimumFractionDigits: 2 })}${currency && currency !== "usd" ? ` ${currency.toUpperCase()}` : ""}`;

const day = (d: Date) =>
  d.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", timeZone: "America/Indiana/Indianapolis" });

interface Email {
  subject: string;
  title: string;
  subtitle: string;
  bodyHtml: string;
}

type Escape = (s: string) => string;

function rows(escape: Escape, items: [string, string | null | undefined, string?][]) {
  const body = items
    .filter(([, value]) => value)
    .map(([label, value, href]) =>
      `<tr><td style="padding:6px 12px 6px 0;color:#64748b;font-size:13px;white-space:nowrap;vertical-align:top;">${escape(label)}</td><td style="padding:6px 0;font-size:14px;">${
        href ? `<a href="${escape(href)}" style="color:#0f172a;">${escape(value!)}</a>` : escape(value!)
      }</td></tr>`
    )
    .join("");
  return `<table role="presentation" cellpadding="0" cellspacing="0" style="border-collapse:collapse;margin:0 0 20px;">${body}</table>`;
}

function button(escape: Escape, label: string, href: string) {
  return `<p style="margin:8px 0 20px;"><a href="${escape(href)}" style="display:inline-block;padding:12px 20px;background:#0f172a;color:#ffffff;text-decoration:none;border-radius:8px;font-weight:600;font-size:14px;">${escape(label)}</a></p>`;
}

const buyer = (p: Pick<EightWeekPurchase, "fullName" | "email">) => p.fullName || p.email || "Unknown buyer";

/** Sent once per purchase, weekly or pay-in-full. */
export function purchaseEmail(p: EightWeekPurchase, escape: Escape): Email {
  const weekly = p.plan === "weekly";
  const reminderDay = new Date(new Date(p.purchasedAt).getTime() + (TOTAL_WEEKLY_PAYMENTS - 1) * 7 * DAY_MS);
  const contact = rows(escape, [
    ["Name", p.fullName],
    ["Email", p.email, p.email ? `mailto:${p.email}` : undefined],
    ["Phone", p.phone],
    ["Plan", weekly ? "$625 a week for 8 weeks" : "$4,500 paid in full"],
    ["Paid today", money(p.amountTotal, p.currency)],
  ]);
  const next = weekly
    ? `<p style="margin:0 0 12px;font-size:14px;">Payment 1 of 8 is in. Stripe keeps charging every week until the subscription is canceled, so you'll get a "cancel now" email when the 8th payment clears, around ${escape(day(reminderDay))}.</p>` +
      (p.subscriptionId ? button(escape, "Open the subscription in Stripe", subscriptionUrl(p.subscriptionId)) : "")
    : `<p style="margin:0 0 12px;font-size:14px;">Paid in full. Nothing to cancel.</p>`;
  return {
    subject: `New 8-Week purchase: ${buyer(p)} (${weekly ? "weekly" : "paid in full"})`,
    title: escape(`8-Week purchase: ${buyer(p)}`),
    subtitle: escape(weekly ? "$625 a week, payment 1 of 8" : "$4,500 paid in full"),
    bodyHtml: contact + next,
  };
}

/** Sent when the 8th weekly payment clears, and again for any payment after it. */
export function paymentEmail(
  p: Pick<EightWeekPurchase, "fullName" | "email" | "subscriptionId">,
  paymentNumber: number,
  nextCharge: Date,
  escape: Escape,
): Email | null {
  const notice = paymentNotice(paymentNumber);
  if (!notice || !p.subscriptionId) return null;
  const link = subscriptionUrl(p.subscriptionId);
  const details = rows(escape, [
    ["Buyer", buyer(p)],
    ["Email", p.email, p.email ? `mailto:${p.email}` : undefined],
    ["Payments collected", `${paymentNumber} of 8`],
    ["Next charge", day(nextCharge)],
  ]);
  if (notice === "cancel_now") {
    return {
      subject: `Cancel now: ${buyer(p)}'s 8-Week subscription (8 of 8 paid)`,
      title: escape(`Cancel ${buyer(p)}'s 8-Week subscription`),
      subtitle: escape(`All 8 payments are in. Cancel before ${day(nextCharge)} or Stripe charges $625 again.`),
      bodyHtml: details +
        `<p style="margin:0 0 4px;font-size:14px;">In Stripe: open the subscription, choose <strong>Cancel subscription</strong>, then <strong>Immediately</strong>. Their 8 weeks are already paid.</p>` +
        button(escape, "Open the subscription in Stripe", link),
    };
  }
  return {
    subject: `Overcharged: ${buyer(p)} paid 8-Week payment ${paymentNumber}`,
    title: escape(`${buyer(p)} was charged a ${ordinal(paymentNumber)} time`),
    subtitle: escape("The 8-Week subscription wasn't canceled. Cancel it and refund the extra payment."),
    bodyHtml: details + button(escape, "Open the subscription in Stripe", link),
  };
}

function ordinal(n: number) {
  const s = ["th", "st", "nd", "rd"];
  const v = n % 100;
  return `${n}${s[(v - 20) % 10] || s[v] || s[0]}`;
}
