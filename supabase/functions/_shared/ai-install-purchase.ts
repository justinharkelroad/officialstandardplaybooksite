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
}

export interface AiInstallEmailResources {
  zoomUrl?: string | null;
  calendarUrl?: string | null;
  claudePreworkUrl?: string | null;
  codexPreworkUrl?: string | null;
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

  const resourceRows = [
    ...selectedPrework,
    resources.calendarUrl
      ? {
        label: "Add the workshop to your calendar",
        url: resources.calendarUrl,
      }
      : null,
    resources.zoomUrl
      ? { label: "Open the live Zoom room", url: resources.zoomUrl }
      : null,
  ].filter((resource): resource is { label: string; url: string } =>
    resource !== null
  ).map((resource) => resourceButton(resource.label, resource.url)).join("");
  const resourceSection = resourceRows
    ? `<tr>
              <td style="padding:24px;">
                ${resourceRows}
              </td>
            </tr>`
    : "";
  const nextStepCopy = resourceRows
    ? "Your available workshop links are below."
    : "We’ll send your workshop access and preparation details separately.";

  const subject = "You’re in: The Agency AI Install";
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
      Your purchase is confirmed for The Agency AI Install.
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
              <td style="padding:0 24px 8px;font-size:16px;line-height:1.6;">
                <p style="margin:0 0 16px;">${
      escapeHtml(firstName)
    }, your seat is confirmed.</p>
                <p style="margin:0 0 16px;">August 26–27, 1–5 PM Eastern. Your selected build path is <strong>${
      escapeHtml(toolLabel)
    }</strong>.</p>
                <p style="margin:0;">${escapeHtml(nextStepCopy)}</p>
              </td>
            </tr>
            ${resourceSection}
            <tr>
              <td style="padding:20px 24px;border-top:1px solid #d6d3cd;color:#686765;font-size:12px;line-height:1.5;">
                Sent to ${
      escapeHtml(purchase.email)
    } after your Stripe purchase. Reply to this email if you need help.
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
