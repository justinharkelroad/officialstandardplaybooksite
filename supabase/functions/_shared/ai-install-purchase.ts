export type AiInstallToolChoice = "claude" | "codex" | "undecided";

interface CheckoutCustomField {
  key?: string | null;
  label?: {
    custom?: string | null;
  } | null;
  text?: {
    value?: string | null;
  } | null;
  dropdown?: {
    value?: string | null;
  } | null;
  numeric?: {
    value?: string | null;
  } | null;
}

export interface AiInstallCheckoutSession {
  id: string;
  payment_link?: string | { id?: string | null } | null;
  payment_intent?: string | { id?: string | null } | null;
  payment_status?: string | null;
  customer_email?: string | null;
  customer_details?: {
    email?: string | null;
    name?: string | null;
    phone?: string | null;
  } | null;
  collected_information?: {
    individual_name?: string | null;
    business_name?: string | null;
  } | null;
  custom_fields?: CheckoutCustomField[] | null;
  amount_total?: number | null;
  currency?: string | null;
  created?: number | null;
  /**
   * Carries the Meta pixel handoff written by src/lib/metaCheckout.ts:
   * v1-<eventId>-<fbpTime>-<fbpRand>-<fbcTime>-<fbclid>. Absent for purchases
   * that did not originate from a tracked click on /aiinstall.
   */
  client_reference_id?: string | null;
}

export interface AiInstallPurchase {
  stripeCheckoutSessionId: string;
  stripePaymentIntentId: string | null;
  stripePaymentLinkId: string | null;
  email: string;
  fullName: string | null;
  businessName: string | null;
  phone: string | null;
  toolChoice: AiInstallToolChoice;
  toolChoiceRaw: string | null;
  amountTotal: number | null;
  currency: string | null;
  paymentStatus: string;
  purchasedAt: string;
  /** Raw Meta pixel handoff, decoded by _shared/meta-capi.ts. */
  clientReferenceId: string | null;
}

export interface AiInstallEmailResources {
  zoomRegistrationUrl?: string | null;
  zoomUrl?: string | null;
  calendarUrl?: string | null;
  claudeStarterPackUrl?: string | null;
  codexStarterPackUrl?: string | null;
  claudePreworkUrl?: string | null;
  codexPreworkUrl?: string | null;
  readyUrl?: string | null;
}

export interface AiInstallEmail {
  subject: string;
  html: string;
}

const TOOL_FIELD_KEY = "whatwillyouuseclaudeorcodexchatgpt";

export function objectId(
  value: string | { id?: string | null } | null | undefined,
): string | null {
  if (typeof value === "string") return value;
  return value?.id ?? null;
}

export function normalizeToolChoice(
  value: string | null | undefined,
): AiInstallToolChoice {
  const normalized = String(value ?? "").trim().toLowerCase();
  if (/\b(claude|anthropic)\b/.test(normalized)) return "claude";
  if (/\b(codex|chatgpt|openai|chat gpt)\b/.test(normalized)) return "codex";
  return "undecided";
}

export function readToolChoice(
  customFields: CheckoutCustomField[] | null | undefined,
): string | null {
  const field = customFields?.find((candidate) => {
    const key = String(candidate.key ?? "").toLowerCase().replace(
      /[^a-z0-9]/g,
      "",
    );
    const label = String(candidate.label?.custom ?? "").toLowerCase();
    return key === TOOL_FIELD_KEY ||
      (label.includes("claude") && label.includes("codex"));
  });

  const value = field?.text?.value ?? field?.dropdown?.value ??
    field?.numeric?.value;
  const trimmed = String(value ?? "").trim();
  return trimmed || null;
}

export function isPaidAiInstallEvent(
  eventType: string,
  session: AiInstallCheckoutSession,
): boolean {
  if (eventType === "checkout.session.async_payment_succeeded") return true;
  return eventType === "checkout.session.completed" &&
    session.payment_status === "paid";
}

export function extractAiInstallPurchase(
  session: AiInstallCheckoutSession,
  eventCreatedSeconds: number,
): AiInstallPurchase {
  const email = String(
    session.customer_details?.email ?? session.customer_email ?? "",
  ).trim().toLowerCase();

  if (!email) {
    throw new Error("Stripe Checkout Session is missing the purchaser email");
  }

  const rawToolChoice = readToolChoice(session.custom_fields);
  const sessionCreated = session.created ?? eventCreatedSeconds;

  return {
    stripeCheckoutSessionId: session.id,
    stripePaymentIntentId: objectId(session.payment_intent),
    stripePaymentLinkId: objectId(session.payment_link),
    email,
    fullName: cleanOptional(session.collected_information?.individual_name) ??
      cleanOptional(session.customer_details?.name),
    businessName: cleanOptional(session.collected_information?.business_name),
    phone: cleanOptional(session.customer_details?.phone),
    toolChoice: normalizeToolChoice(rawToolChoice),
    toolChoiceRaw: rawToolChoice,
    amountTotal: session.amount_total ?? null,
    currency: cleanOptional(session.currency)?.toLowerCase() ?? null,
    paymentStatus: String(session.payment_status ?? "paid"),
    purchasedAt: new Date(sessionCreated * 1000).toISOString(),
    clientReferenceId: cleanOptional(session.client_reference_id),
  };
}

export function renderAiInstallPurchaseEmail(
  purchase: AiInstallPurchase,
  resources: AiInstallEmailResources,
): AiInstallEmail {
  const firstName = purchase.fullName?.split(/\s+/)[0] || "there";
  const selectedPrework = purchase.toolChoice === "claude"
    ? resources.claudePreworkUrl
      ? [{ label: "Open Claude pre-work", url: resources.claudePreworkUrl }]
      : []
    : purchase.toolChoice === "codex"
    ? resources.codexPreworkUrl
      ? [{ label: "Open Codex pre-work", url: resources.codexPreworkUrl }]
      : []
    : [
      resources.claudePreworkUrl
        ? { label: "Open Claude pre-work", url: resources.claudePreworkUrl }
        : null,
      resources.codexPreworkUrl
        ? { label: "Open Codex pre-work", url: resources.codexPreworkUrl }
        : null,
    ].filter((resource): resource is { label: string; url: string } =>
      resource !== null
    );

  const preworkButtons = selectedPrework
    .map((resource) => resourceButton(resource.label, resource.url))
    .join("");
  const zoomButton = resources.zoomRegistrationUrl
    ? resourceButton(
      "Register for the live Zoom workshop",
      resources.zoomRegistrationUrl,
    )
    : "";
  const calendarButton = resources.calendarUrl
    ? resourceButton("Add both days to your calendar", resources.calendarUrl)
    : "";
  const selectedStarterPacks = purchase.toolChoice === "claude"
    ? resources.claudeStarterPackUrl
      ? [{
        label: "Download the Claude starter pack",
        url: resources.claudeStarterPackUrl,
      }]
      : []
    : purchase.toolChoice === "codex"
    ? resources.codexStarterPackUrl
      ? [{
        label: "Download the Codex starter pack",
        url: resources.codexStarterPackUrl,
      }]
      : []
    : [
      resources.claudeStarterPackUrl
        ? {
          label: "Download the Claude starter pack",
          url: resources.claudeStarterPackUrl,
        }
        : null,
      resources.codexStarterPackUrl
        ? {
          label: "Download the Codex starter pack",
          url: resources.codexStarterPackUrl,
        }
        : null,
    ].filter((resource): resource is { label: string; url: string } =>
      resource !== null
    );
  const starterPackButtons = selectedStarterPacks
    .map((resource) => resourceButton(resource.label, resource.url))
    .join("");
  const readyButton = resources.readyUrl
    ? resourceButton("Submit your required screenshot", resources.readyUrl)
    : "";
  const preworkInstruction = purchase.toolChoice === "undecided"
    ? "Pick the platform you will use in the room and follow that track:"
    : `You selected ${
      purchase.toolChoice === "claude" ? "Claude" : "Codex"
    }. Follow this track:`;
  const claudeConnectorNote = purchase.toolChoice === "codex"
    ? ""
    : `<li style="margin:0 0 8px;">Optional for Claude: connect Google Drive in the app settings. It is not required, but it gives your brain more to work with on day one.</li>`;

  const subject = "You're in. Here's your pre-work.";
  const toolLabel = purchase.toolChoice === "undecided"
    ? "Claude or Codex"
    : purchase.toolChoice === "claude"
    ? "Claude"
    : "Codex";

  return {
    subject,
    html: `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="color-scheme" content="light only">
    <title>${escapeHtml(subject)}</title>
  </head>
  <body style="margin:0;background:#f4f2ee;color:#0a0a0b;font-family:Arial,Helvetica,sans-serif;">
    <div style="display:none;max-height:0;overflow:hidden;opacity:0;">
      Block August 26-27 and finish your 90-minute pre-work by Monday, August 24.
    </div>
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#f4f2ee;">
      <tr>
        <td align="center" style="padding:24px 12px;">
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:640px;background:#ffffff;border:1px solid #0a0a0b;">
            <tr>
              <td style="padding:22px 24px;border-bottom:1px solid #0a0a0b;font-size:12px;font-weight:700;letter-spacing:.18em;text-transform:uppercase;">
                Standard Playbook
              </td>
            </tr>
            <tr>
              <td style="padding:40px 24px 18px;">
                <p style="margin:0 0 12px;color:#2997ff;font-size:12px;font-weight:700;letter-spacing:.16em;text-transform:uppercase;">Purchase confirmed</p>
                <h1 style="margin:0;font-size:38px;line-height:1;letter-spacing:-.03em;text-transform:uppercase;">The Agency AI Install</h1>
              </td>
            </tr>
            <tr>
              <td style="padding:0 24px 28px;font-size:16px;line-height:1.6;">
                <p style="margin:0 0 16px;">Welcome, ${
      escapeHtml(firstName)
    }.</p>
                <p style="margin:0 0 16px;">You just bought two afternoons that end with a working AI co-working brain, built by you, in the room with me, and running before you wake up Friday the 28th.</p>
                <p style="margin:0;">Here is everything you need, and the one thing I need from you.</p>
              </td>
            </tr>
            <tr>
              <td style="padding:28px 24px;border-top:1px solid #d6d3cd;font-size:16px;line-height:1.6;">
                <p style="margin:0 0 14px;color:#2997ff;font-size:12px;font-weight:700;letter-spacing:.16em;text-transform:uppercase;">The details</p>
                <p style="margin:0 0 6px;"><strong>Day one:</strong> Wednesday, August 26, 2026, 1:00 PM to 5:00 PM Eastern</p>
                <p style="margin:0 0 6px;"><strong>Day two:</strong> Thursday, August 27, 2026, 1:00 PM to 5:00 PM Eastern</p>
                <p style="margin:0 0 6px;"><strong>Where:</strong> live on Zoom; register with the button below</p>
                <p style="margin:0 0 6px;"><strong>Check-up call:</strong> September 24, 2026, 1:00 PM to 2:00 PM EST</p>
                <p style="margin:0 0 18px;"><strong>Recordings:</strong> both sessions, sent within 7 days after we wrap</p>
                ${zoomButton}
                ${calendarButton}
                <p style="margin:18px 0 0;"><strong>Put both days on your calendar right now.</strong> Blocked, not penciled.</p>
              </td>
            </tr>
            <tr>
              <td style="padding:28px 24px;border-top:1px solid #d6d3cd;font-size:16px;line-height:1.6;">
                <p style="margin:0 0 14px;color:#2997ff;font-size:12px;font-weight:700;letter-spacing:.16em;text-transform:uppercase;">What this is</p>
                <p style="margin:0 0 16px;"><strong>This is a build, not a webinar.</strong> You will work the entire time, in your own folder, on your own business. Camera on, folder open. I build on screen, you build with me, and we checkpoint at every phase so nobody gets left behind.</p>
                <p style="margin:0 0 16px;">Day one, your brain learns who you are: your story, your voice pulled from your real writing, your rules, your team, and your projects.</p>
                <p style="margin:0;">Day two, we make it permanent and put it to work: the memory system, your skill library, and your first automations. Before we log off Thursday, your morning brief is scheduled to run Friday morning whether you open your laptop or not.</p>
              </td>
            </tr>
            <tr>
              <td style="padding:28px 24px;border-top:1px solid #d6d3cd;font-size:16px;line-height:1.6;">
                <p style="margin:0 0 14px;color:#2997ff;font-size:12px;font-weight:700;letter-spacing:.16em;text-transform:uppercase;">Your pre-work | about 90 minutes | due Monday, August 24</p>
                <p style="margin:0 0 16px;"><strong>No pre-work, no build.</strong> The room moves fast because everyone shows up staged. Do this early in the week, not Sunday night.</p>
                <p style="margin:0 0 12px;">${
      escapeHtml(preworkInstruction)
    }</p>
                ${preworkButtons}
                <p style="margin:20px 0 10px;">The short version:</p>
                <ul style="margin:0 0 18px;padding-left:22px;">
                  <li style="margin:0 0 8px;">Get your subscription live and the desktop app installed for ${
      escapeHtml(toolLabel)
    }.</li>
                  <li style="margin:0 0 8px;">Create one folder called <strong>MY BIZ BRAIN</strong> and copy in the starter pack.</li>
                  <li style="margin:0 0 8px;">Add 5 to 10 real writing samples, your team roster, active projects, agency basics, and the tools you pay for.</li>
                  <li style="margin:0 0 8px;">Run the READY.txt test on the page. It takes 30 seconds and proves your setup works.</li>
                  ${claudeConnectorNote}
                </ul>
                ${starterPackButtons}
              </td>
            </tr>
            <tr>
              <td style="padding:28px 24px;border-top:1px solid #d6d3cd;font-size:16px;line-height:1.6;">
                <p style="margin:0 0 14px;color:#2997ff;font-size:12px;font-weight:700;letter-spacing:.16em;text-transform:uppercase;">Finish by August 24</p>
                <p style="margin:0 0 16px;">Complete all six readiness checks on your pre-work page. The four numbered cards near the top are setup steps, not the final checklist.</p>
                <p style="margin:0 0 16px;"><strong>A screenshot is required.</strong> After all six checks are complete, take one screenshot showing your MY BIZ BRAIN folder open in Cowork or Codex with READY.txt visible. Submit it through the confirmation form; do not email it unless Mary asks you to.</p>
                ${readyButton}
                <p style="margin:0 0 16px;"><strong>All purchases are nonrefundable. Your seat may be transferred to another person before August 24. If your pre-work is incomplete by August 24, your registration moves to a future workshop.</strong></p>
                <p style="margin:0;">One purchase equals one attendee. Registration is capped at 50 paid seats. After 50 paid seats, registration moves to a waitlist. Free members do not count against the paid-seat cap.</p>
              </td>
            </tr>
            <tr>
              <td style="padding:28px 24px;border-top:1px solid #d6d3cd;font-size:16px;line-height:1.6;">
                <p style="margin:0 0 14px;color:#2997ff;font-size:12px;font-weight:700;letter-spacing:.16em;text-transform:uppercase;">If you get stuck</p>
                <p style="margin:0 0 16px;">For setup help, email <a href="mailto:mary@standardplaybook.com">mary@standardplaybook.com</a> or <a href="mailto:info@standardplaybook.com">info@standardplaybook.com</a>. Mary will also be in the room both days as live tech help.</p>
                <p style="margin:0 0 16px;">Do the pre-work this week, show up Wednesday with your folder open, and two afternoons from now the thing everyone keeps talking about will be running your morning instead of living in a tab.</p>
                <p style="margin:0 0 22px;">See you on the 26th. Let's go.</p>
                <p style="margin:0;">Your Friend &amp; Potential Coach,<br><strong>Justin E Harkelroad</strong><br>Standardplaybook.com<br>(260) 515-1349</p>
              </td>
            </tr>
            <tr>
              <td style="padding:20px 24px;border-top:1px solid #d6d3cd;color:#686765;font-size:12px;line-height:1.5;">
                Sent to ${
      escapeHtml(purchase.email)
    } after your Stripe purchase. For setup help, email mary@standardplaybook.com or info@standardplaybook.com.
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`,
  };
}

export function validateEmailResources(
  resources: AiInstallEmailResources,
): void {
  for (const [name, value] of Object.entries(resources)) {
    if (!value) continue;
    let parsed: URL;
    try {
      parsed = new URL(value);
    } catch {
      throw new Error(`Invalid AI Install resource URL: ${name}`);
    }
    if (parsed.protocol !== "https:") {
      throw new Error(`AI Install resource URL must use HTTPS: ${name}`);
    }
  }
}

function resourceButton(label: string, url: string): string {
  return `
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin:0 0 12px;">
      <tr>
        <td>
          <a href="${
    escapeAttribute(url)
  }" style="display:block;padding:15px 18px;background:#0a0a0b;color:#ffffff;text-decoration:none;font-size:14px;font-weight:700;letter-spacing:.05em;text-transform:uppercase;">
            ${escapeHtml(label)}
          </a>
        </td>
      </tr>
    </table>`;
}

function cleanOptional(value: string | null | undefined): string | null {
  const trimmed = String(value ?? "").trim();
  return trimmed || null;
}

function escapeHtml(value: string): string {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function escapeAttribute(value: string): string {
  return escapeHtml(value);
}
