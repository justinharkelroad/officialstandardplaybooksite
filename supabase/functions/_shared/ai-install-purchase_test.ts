import {
  type AiInstallCheckoutSession,
  extractAiInstallPurchase,
  isPaidAiInstallEvent,
  normalizeToolChoice,
  readToolChoice,
  renderAiInstallPurchaseEmail,
  validateEmailResources,
} from "./ai-install-purchase.ts";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

function assertEquals(
  actual: unknown,
  expected: unknown,
  message: string,
): void {
  const actualJson = JSON.stringify(actual);
  const expectedJson = JSON.stringify(expected);
  if (actualJson !== expectedJson) {
    throw new Error(
      `${message}\nExpected: ${expectedJson}\nActual: ${actualJson}`,
    );
  }
}

const session: AiInstallCheckoutSession = {
  id: "cs_live_ai_install",
  payment_link: "plink_1TwibDFB8ViubgHoQZU473el",
  payment_intent: { id: "pi_123" },
  payment_status: "paid",
  customer_details: {
    email: "BUYER@EXAMPLE.COM ",
    name: "Fallback Name",
    phone: "317-555-0100",
  },
  collected_information: {
    individual_name: "Alex <Owner>",
    business_name: "Alex & Co.",
  },
  custom_fields: [{
    key: "whatwillyouuseclaudeorcodexchatgpt",
    label: { custom: "What will you use: Claude or Codex (chatgpt)?" },
    text: { value: "ChatGPT / Codex" },
  }],
  amount_total: 99700,
  currency: "USD",
  created: 1784952000,
};

Deno.test("normalizes the free-text Claude or Codex answer", () => {
  assertEquals(
    normalizeToolChoice("Anthropic Claude"),
    "claude",
    "Claude should normalize",
  );
  assertEquals(
    normalizeToolChoice("Chat GPT with Codex"),
    "codex",
    "Codex should normalize",
  );
  assertEquals(
    normalizeToolChoice("not sure"),
    "undecided",
    "Unknown values should remain undecided",
  );
});

Deno.test("reads the live Stripe custom field", () => {
  assertEquals(
    readToolChoice(session.custom_fields),
    "ChatGPT / Codex",
    "Tool field should be found",
  );
});

Deno.test("only fulfills completed sessions after payment", () => {
  assert(
    isPaidAiInstallEvent("checkout.session.completed", session),
    "Paid card checkout should fulfill",
  );
  assert(
    !isPaidAiInstallEvent("checkout.session.completed", {
      ...session,
      payment_status: "unpaid",
    }),
    "Unpaid delayed checkout should wait",
  );
  assert(
    isPaidAiInstallEvent("checkout.session.async_payment_succeeded", {
      ...session,
      payment_status: "unpaid",
    }),
    "Async success event should fulfill",
  );
});

Deno.test("extracts purchaser data without retaining the full Stripe payload", () => {
  const purchase = extractAiInstallPurchase(session, 1784952001);
  assertEquals(
    purchase.stripePaymentLinkId,
    "plink_1TwibDFB8ViubgHoQZU473el",
    "Payment Link ID",
  );
  assertEquals(purchase.stripePaymentIntentId, "pi_123", "Payment Intent ID");
  assertEquals(
    purchase.email,
    "buyer@example.com",
    "Email should be normalized",
  );
  assertEquals(purchase.fullName, "Alex <Owner>", "Collected name should win");
  assertEquals(
    purchase.businessName,
    "Alex & Co.",
    "Business name should be retained",
  );
  assertEquals(purchase.toolChoice, "codex", "Tool selection should normalize");
  assertEquals(
    purchase.amountTotal,
    99700,
    "Amount should be retained in cents",
  );
});

Deno.test("renders the functional email with the correct branch and escaped buyer data", () => {
  const purchase = {
    ...extractAiInstallPurchase(session, 1784952001),
    fullName: "<Alex>",
  };
  const email = renderAiInstallPurchaseEmail(purchase, {
    zoomRegistrationUrl: "https://example.com/register",
    zoomUrl: "https://example.com/zoom",
    calendarUrl: "https://example.com/calendar",
    claudeStarterPackUrl: "https://example.com/claude-starter-pack.zip",
    codexStarterPackUrl: "https://example.com/codex-starter-pack.zip",
    claudePreworkUrl: "https://example.com/claude",
    codexPreworkUrl: "https://example.com/codex",
    readyUrl: "https://example.com/ready",
  });

  assertEquals(
    email.subject,
    "You're in. Here's your pre-work.",
    "Revised subject line should render",
  );

  assert(
    email.html.includes("https://example.com/codex"),
    "Codex link should be present",
  );
  assert(
    !email.html.includes("https://example.com/claude"),
    "Claude link should be omitted for Codex buyers",
  );
  assert(
    email.html.includes("https://example.com/register"),
    "Zoom registration should be present",
  );
  assert(
    email.html.includes("Register for the live Zoom workshop"),
    "Zoom button should use the registration step",
  );
  assert(
    !email.html.includes("https://example.com/zoom"),
    "Direct Zoom room should not replace the registration URL",
  );
  assert(
    email.html.includes("https://example.com/codex-starter-pack.zip"),
    "Codex starter pack link should be present",
  );
  assert(
    !email.html.includes("https://example.com/claude-starter-pack.zip"),
    "Claude starter pack should be omitted for Codex buyers",
  );
  assert(
    email.html.includes("https://example.com/ready") &&
      email.html.includes("A screenshot is required"),
    "Email should require the screenshot form",
  );
  assert(
    email.html.includes("MY BIZ BRAIN"),
    "Email should use the canonical workshop folder name",
  );
  assert(
    email.html.includes(
      "All purchases are nonrefundable. Your seat may be transferred to another person before August 24. If your pre-work is incomplete by August 24, your registration moves to a future workshop.",
    ),
    "Email should include the approved registration policy verbatim",
  );
  assert(
    email.html.includes("mary@standardplaybook.com") &&
      email.html.includes("info@standardplaybook.com"),
    "Email should include both setup support addresses",
  );
  assert(
    email.html.includes("September 24, 2026, 1:00 PM to 2:00 PM EST"),
    "Email should include the confirmed check-up call",
  );
  assert(
    !/[\u2013\u2014]/.test(email.html),
    "Rendered email should not contain raw en or em dashes",
  );
  assert(
    email.html.includes("&lt;Alex&gt;"),
    "Buyer name must be HTML escaped",
  );
  assert(!email.html.includes("<Alex>"), "Unsafe buyer HTML must not appear");
});

Deno.test("rejects missing or non-HTTPS resource URLs", () => {
  let rejected = false;
  try {
    validateEmailResources({
      zoomRegistrationUrl: "http://example.com/register",
      zoomUrl: "http://example.com/zoom",
      calendarUrl: "https://example.com/calendar",
      claudeStarterPackUrl: "https://example.com/claude-starter-pack.zip",
      codexStarterPackUrl: "https://example.com/codex-starter-pack.zip",
      claudePreworkUrl: "https://example.com/claude",
      codexPreworkUrl: "https://example.com/codex",
      readyUrl: "https://example.com/ready",
    });
  } catch {
    rejected = true;
  }
  assert(rejected, "HTTP resource URLs should be rejected");
});

Deno.test("renders the welcome instructions even when optional resources are not ready", () => {
  const purchase = extractAiInstallPurchase(session, 1784952001);
  const resources = {};
  validateEmailResources(resources);
  const email = renderAiInstallPurchaseEmail(purchase, resources);

  assert(
    email.html.includes("Purchase confirmed"),
    "Purchase confirmation should remain present",
  );
  assert(
    email.html.includes(
      "A screenshot is required",
    ),
    "Welcome instructions should keep screenshot confirmation required",
  );
  assert(
    !email.html.includes("undefined") && !email.html.includes("[ZOOM LINK]"),
    "No empty or placeholder resource links should render",
  );
});

Deno.test("shows both pre-work tracks when the buyer has not chosen a platform", () => {
  const purchase = {
    ...extractAiInstallPurchase(session, 1784952001),
    toolChoice: "undecided" as const,
  };
  const email = renderAiInstallPurchaseEmail(purchase, {
    claudePreworkUrl: "https://example.com/claude",
    codexPreworkUrl: "https://example.com/codex",
    claudeStarterPackUrl: "https://example.com/claude-starter-pack.zip",
    codexStarterPackUrl: "https://example.com/codex-starter-pack.zip",
  });

  assert(
    email.html.includes("https://example.com/claude"),
    "Undecided buyers should get the Claude track",
  );
  assert(
    email.html.includes("https://example.com/codex"),
    "Undecided buyers should get the Codex track",
  );
  assert(
    email.html.includes("https://example.com/claude-starter-pack.zip"),
    "Undecided buyers should get the Claude starter pack",
  );
  assert(
    email.html.includes("https://example.com/codex-starter-pack.zip"),
    "Undecided buyers should get the Codex starter pack",
  );
});
