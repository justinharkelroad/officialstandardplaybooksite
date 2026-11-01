import { assertEquals, assertMatch, assertStringIncludes } from "jsr:@std/assert@1";
import { escapeHtml } from "../_shared/email-template.ts";
import {
  EIGHT_WEEK_LINKS,
  invoiceSubscriptionId,
  isRenewalInvoice,
  nextChargeDate,
  paymentEmail,
  paymentNotice,
  purchaseEmail,
  purchaseFromSession,
} from "./logic.ts";

const created = Date.UTC(2026, 10, 2, 15) / 1000; // Mon Nov 2 2026

Deno.test("only paid checkouts on the two 8-Week links count", () => {
  const base = { id: "cs_1", payment_status: "paid", customer_details: { email: "a@b.co", name: "Ann Owner" } };
  assertEquals(purchaseFromSession({ ...base, payment_link: EIGHT_WEEK_LINKS.weekly, subscription: "sub_1" }, created)?.plan, "weekly");
  assertEquals(purchaseFromSession({ ...base, payment_link: { id: EIGHT_WEEK_LINKS.pif } }, created)?.plan, "pif");
  assertEquals(purchaseFromSession({ ...base, payment_link: "plink_boardroom" }, created), null);
  assertEquals(purchaseFromSession({ ...base, payment_status: "unpaid", payment_link: EIGHT_WEEK_LINKS.weekly }, created), null);
});

Deno.test("finds the subscription on old and new invoice shapes", () => {
  assertEquals(invoiceSubscriptionId({ id: "in_1", subscription: "sub_old" }), "sub_old");
  assertEquals(invoiceSubscriptionId({ id: "in_2", parent: { subscription_details: { subscription: "sub_new" } } }), "sub_new");
  assertEquals(isRenewalInvoice({ id: "in_3", billing_reason: "subscription_create" }), false);
  assertEquals(isRenewalInvoice({ id: "in_4", billing_reason: "subscription_cycle" }), true);
});

Deno.test("emails go out at payment 8 (cancel now) and after (overcharged), not before", () => {
  assertEquals([1, 2, 7].map(paymentNotice), [null, null, null]);
  assertEquals(paymentNotice(8), "cancel_now");
  assertEquals(paymentNotice(9), "overcharged");
});

Deno.test("cancel-now email names the buyer, the deadline and links the subscription", () => {
  const next = nextChargeDate({ id: "in_8", lines: { data: [{ period: { end: created + 56 * 86400 } }] } }, created + 49 * 86400);
  const email = paymentEmail({ fullName: "Ann <b>Owner</b>", email: "a@b.co", subscriptionId: "sub_123" }, 8, next, escapeHtml)!;
  assertEquals(email.subject, "Cancel now: Ann <b>Owner</b>'s 8-Week subscription (8 of 8 paid)");
  assertEquals(email.title.includes("<b>"), false);
  assertEquals(email.bodyHtml.includes("<b>Owner"), false);
  assertStringIncludes(email.bodyHtml, "https://dashboard.stripe.com/subscriptions/sub_123");
  assertStringIncludes(email.bodyHtml, "8 of 8");
  assertMatch(email.subtitle, /Cancel before Monday, December 28/);
});

Deno.test("purchase email says when the cancel reminder will come", () => {
  const weekly = purchaseFromSession({
    id: "cs_1",
    payment_status: "paid",
    payment_link: EIGHT_WEEK_LINKS.weekly,
    subscription: "sub_1",
    amount_total: 62500,
    currency: "usd",
    customer_details: { email: "a@b.co", name: "Ann Owner", phone: "+12605550100" },
  }, created)!;
  const email = purchaseEmail(weekly, escapeHtml);
  assertEquals(email.subject, "New 8-Week purchase: Ann Owner (weekly)");
  assertStringIncludes(email.bodyHtml, "$625.00");
  assertStringIncludes(email.bodyHtml, "Monday, December 21");
  const pif = purchaseEmail({ ...weekly, plan: "pif", subscriptionId: null, amountTotal: 450000 }, escapeHtml);
  assertStringIncludes(pif.bodyHtml, "Nothing to cancel");
});
