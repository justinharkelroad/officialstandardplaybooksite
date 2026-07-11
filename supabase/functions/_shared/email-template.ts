// Shared email template for Standard Playbook
// White card on light-gray page, text wordmark header, tabular-nums on
// numeric cells, no gradient header, no emojis.
// Update branding here and it applies to ALL emails.

export const BRAND = {
  colors: {
    primary:   '#0f172a', // slate-900 — body text, dark buttons
    secondary: '#1e293b', // slate-800 — darker accents
    gray:      '#64748b', // slate-500 — muted text
    red:       '#dc2626', // red-600 — miss/error
    green:     '#10b981', // emerald-500 — pass/success
    yellow:    '#f59e0b', // amber-500 — warning
    lightBg:   '#f8fafc', // slate-50 — page background
    white:     '#ffffff',
    border:    '#e2e8f0', // slate-200 — card + row borders
    eyebrow:   '#94a3b8', // slate-400 — uppercase eyebrow labels
  },
  name: 'Standard Playbook',
  fromEmail: 'Standard Playbook <info@standardplaybook.com>',
};

const P = BRAND.colors;

const FONT_STACK = `-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif`;

export interface EmailTemplateOptions {
  title: string;
  subtitle?: string;
  bodyContent: string;
  footerName?: string;
  // Optional eyebrow above the title (e.g. "WEEKLY DEBRIEF"). Defaults to footerName.
  eyebrow?: string;
}

export function buildEmailHtml(options: EmailTemplateOptions): string {
  const { title, subtitle, bodyContent, footerName, eyebrow } = options;
  const headerRight = eyebrow ?? footerName ?? '';

  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="color-scheme" content="light only">
  <meta name="supported-color-schemes" content="light only">
  <style>
    @media only screen and (max-width: 600px) {
      .pb-outer { padding: 16px 8px !important; }
      .pb-section-pad { padding-left: 16px !important; padding-right: 16px !important; }
      .pb-hero-title { font-size: 22px !important; }
      .pb-header-right { text-align: left !important; padding-top: 12px !important; display: block !important; width: 100% !important; }
      .pb-header-left { display: block !important; width: 100% !important; }
      .pb-tile-row { border-spacing: 0 !important; }
      .pb-tile-row td { display: block !important; width: 100% !important; box-sizing: border-box !important; margin-bottom: 8px !important; }
      .pb-hide-sm { display: none !important; }
    }
  </style>
</head>
<body style="font-family: ${FONT_STACK}; line-height: 1.6; color: ${P.primary}; margin: 0; padding: 0; background-color: ${P.lightBg};">
  <div class="pb-outer" style="max-width: 640px; margin: 0 auto; padding: 24px 16px;">

    <!-- Card -->
    <div style="background: ${P.white}; border: 1px solid ${P.border}; border-radius: 16px; overflow: hidden;">

      <!-- Header: wordmark left, eyebrow right -->
      <div class="pb-section-pad" style="padding: 24px 28px; border-bottom: 1px solid ${P.border};">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse: collapse;">
          <tr>
            <td class="pb-header-left" style="vertical-align: middle;" width="50%">
              <span style="font-family: ${FONT_STACK}; font-size: 17px; font-weight: 700; letter-spacing: -0.01em; color: ${P.primary};">${BRAND.name}</span>
            </td>
            <td class="pb-header-right" style="vertical-align: middle; text-align: right; font-family: ${FONT_STACK}; font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.14em; color: ${P.eyebrow};" width="50%">
              ${escapeHtml(headerRight)}
            </td>
          </tr>
        </table>
      </div>

      <!-- Hero: title + subtitle -->
      <div class="pb-section-pad" style="padding: 28px 28px 8px 28px; text-align: center;">
        <h1 class="pb-hero-title" style="margin: 0; font-family: ${FONT_STACK}; font-size: 24px; font-weight: 700; color: ${P.primary}; letter-spacing: -0.01em; line-height: 1.2;">${title}</h1>
        ${subtitle ? `<p style="margin: 10px 0 0 0; font-family: ${FONT_STACK}; font-size: 14px; color: ${P.gray}; line-height: 1.5;">${subtitle}</p>` : ''}
      </div>

      <!-- Body -->
      <div class="pb-section-pad" style="padding: 20px 28px 28px 28px; font-family: ${FONT_STACK}; font-size: 14px; color: ${P.primary};">
        ${bodyContent}
      </div>

    </div>

    <!-- Footer -->
    <div style="text-align: center; font-family: ${FONT_STACK}; font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.14em; color: ${P.eyebrow}; margin-top: 20px; padding: 0 16px;">
      Powered by ${BRAND.name}${footerName ? ` &middot; ${escapeHtml(footerName)}` : ''}
    </div>

  </div>
</body>
</html>`;
}

export function escapeHtml(s: string): string {
  return String(s ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

// Pre-built components for common sections
export const EmailComponents = {

  // Summary / highlight box — uses a subtle slate panel
  summaryBox: (text: string) => `
    <div style="background: ${P.lightBg}; border: 1px solid ${P.border}; padding: 14px 16px; border-radius: 12px; margin-bottom: 16px; color: ${P.primary};">
      <strong style="font-weight: 600;">${text}</strong>
    </div>
  `,

  // AI Feedback section — eyebrow label + clean subsection (no left-border accent)
  aiFeedback: (feedback: string) => feedback ? `
    <div style="margin-top: 20px; padding: 16px 18px; background: ${P.lightBg}; border: 1px solid ${P.border}; border-radius: 12px;">
      <p style="margin: 0 0 8px 0; font-family: ${FONT_STACK}; font-size: 10px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.18em; color: ${P.eyebrow};">What The Data Shows</p>
      <div style="white-space: pre-line; color: ${P.primary}; font-size: 14px; line-height: 1.6;">${feedback}</div>
    </div>
  ` : '',

  // Stats table — no emojis, Pass/Miss in colored text, tabular-nums on numbers
  statsTable: (rows: Array<{
    metric: string;
    actual: number;
    target: number;
    passed: boolean;
    percentage: number;
    hasDiscrepancy?: boolean;
    discrepancyNote?: string;
  }>) => {
    const rowsHtml = rows.map(p => {
      const color = p.passed ? P.green : P.red;
      const label = p.passed ? 'Pass' : 'Miss';
      const indicator = p.hasDiscrepancy ? '*' : '';
      return `<tr>
        <td style="padding: 12px 8px; border-bottom: 1px solid ${BRAND.colors.border}; color: ${BRAND.colors.primary};">${p.metric}${indicator}</td>
        <td style="padding: 12px 8px; border-bottom: 1px solid ${BRAND.colors.border}; text-align: center; font-variant-numeric: tabular-nums; color: ${BRAND.colors.primary};">${p.actual}</td>
        <td style="padding: 12px 8px; border-bottom: 1px solid ${BRAND.colors.border}; text-align: center; font-variant-numeric: tabular-nums; color: ${BRAND.colors.gray};">${p.target}</td>
        <td style="padding: 12px 8px; border-bottom: 1px solid ${BRAND.colors.border}; text-align: center; color: ${color}; font-weight: 600; font-variant-numeric: tabular-nums;">${label} &middot; ${p.percentage}%</td>
      </tr>`;
    }).join('');

    const discrepancies = rows.filter(d => d.hasDiscrepancy && d.discrepancyNote);
    const footnote = discrepancies.length > 0 ? `
      <div style="margin-top: 16px; padding: 12px 14px; background-color: #fffbeb; border: 1px solid #fcd34d; border-radius: 10px;">
        <p style="margin: 0 0 6px 0; font-family: ${FONT_STACK}; font-size: 10px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.16em; color: #92400e;">
          Tracking Gaps Detected
        </p>
        <ul style="margin: 0; padding-left: 16px; color: #a16207; font-size: 12px; line-height: 1.6;">
          ${discrepancies.map(d => `<li>* ${d.metric}: ${d.discrepancyNote}</li>`).join('')}
        </ul>
      </div>
    ` : '';

    return `
      <table role="presentation" style="width: 100%; border-collapse: collapse; font-family: ${FONT_STACK};">
        <thead>
          <tr>
            <th style="padding: 10px 8px; text-align: left; font-size: 10px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.12em; color: ${P.eyebrow}; border-bottom: 1px solid ${P.border};">Metric</th>
            <th style="padding: 10px 8px; text-align: center; font-size: 10px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.12em; color: ${P.eyebrow}; border-bottom: 1px solid ${P.border};">Actual</th>
            <th style="padding: 10px 8px; text-align: center; font-size: 10px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.12em; color: ${P.eyebrow}; border-bottom: 1px solid ${P.border};">Target</th>
            <th style="padding: 10px 8px; text-align: center; font-size: 10px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.12em; color: ${P.eyebrow}; border-bottom: 1px solid ${P.border};">Result</th>
          </tr>
        </thead>
        <tbody>
          ${rowsHtml}
        </tbody>
      </table>
      ${footnote}
    `;
  },

  // Button — slate-900 dark pill
  button: (text: string, url: string) => `
    <div style="text-align: center; margin: 24px 0;">
      <a href="${url}" style="background: ${P.primary}; color: ${P.white}; padding: 12px 24px; border-radius: 10px; text-decoration: none; font-weight: 600; display: inline-block; font-family: ${FONT_STACK}; font-size: 14px; letter-spacing: 0.01em;">${text}</a>
    </div>
  `,

  // Info text
  infoText: (text: string) => `
    <p style="color: ${P.gray}; font-size: 13px; margin: 14px 0; line-height: 1.6;">${text}</p>
  `,

  // Paragraph
  paragraph: (text: string) => `
    <p style="margin: 14px 0; color: ${P.primary}; font-size: 14px; line-height: 1.6;">${text}</p>
  `,

  // Additional information fields (label + value, no pass/fail)
  additionalFields: (fields: Array<{ label: string; value: string }>) => {
    if (!fields || fields.length === 0) return '';

    const rowsHtml = fields.map(f => `<tr>
      <td style="padding: 10px 12px; border-bottom: 1px solid ${P.border}; font-weight: 500; color: ${P.gray}; font-size: 13px;">${f.label}</td>
      <td style="padding: 10px 12px; border-bottom: 1px solid ${P.border}; text-align: right; color: ${P.primary}; font-size: 14px; font-variant-numeric: tabular-nums;">${f.value}</td>
    </tr>`).join('');

    return `
      <div style="margin-top: 20px;">
        <p style="margin: 0 0 10px 0; font-family: ${FONT_STACK}; font-size: 10px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.18em; color: ${P.eyebrow};">Additional Information</p>
        <table role="presentation" style="width: 100%; border-collapse: collapse; background: ${P.lightBg}; border: 1px solid ${P.border}; border-radius: 12px; overflow: hidden;">
          <tbody>
            ${rowsHtml}
          </tbody>
        </table>
      </div>
    `;
  },

  // Warning box for discrepancies or other alerts — amber, no emoji
  warningBox: (title: string, items: string[], footer?: string) => `
    <div style="margin-top: 16px; padding: 14px 16px; background-color: #fffbeb; border: 1px solid #fcd34d; border-radius: 12px;">
      <p style="margin: 0 0 8px 0; font-family: ${FONT_STACK}; font-size: 10px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.18em; color: #92400e;">
        ${title}
      </p>
      <ul style="margin: 0; padding-left: 18px; color: #a16207; font-size: 13px; line-height: 1.6;">
        ${items.map(item => `<li>${item}</li>`).join('')}
      </ul>
      ${footer ? `<p style="margin: 8px 0 0 0; font-size: 11px; color: #a16207;">${footer}</p>` : ''}
    </div>
  `,

  // Bulleted list with a section title
  bulletList: (title: string, items: string[]) => {
    if (!items || items.length === 0) return '';
    return `
      <div style="margin-top: 20px;">
        <p style="margin: 0 0 8px 0; font-family: ${FONT_STACK}; font-size: 10px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.18em; color: ${P.eyebrow};">${title}</p>
        <ul style="margin: 0; padding-left: 18px; color: ${P.primary}; font-size: 14px; line-height: 1.7;">
          ${items.map(item => `<li style="margin-bottom: 4px;">${item}</li>`).join('')}
        </ul>
      </div>
    `;
  },

  // List with colored status labels (for reviewed commitments)
  statusList: (title: string, items: Array<{ text: string; status: string; statusColor: string }>) => {
    if (!items || items.length === 0) return '';
    return `
      <div style="margin-top: 20px;">
        <p style="margin: 0 0 8px 0; font-family: ${FONT_STACK}; font-size: 10px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.18em; color: ${P.eyebrow};">${title}</p>
        <ul style="margin: 0; padding-left: 18px; font-size: 14px; line-height: 1.7;">
          ${items.map(item => `<li style="margin-bottom: 6px; color: ${P.primary};">${item.text} &mdash; <span style="color: ${item.statusColor}; font-weight: 600;">${item.status}</span></li>`).join('')}
        </ul>
      </div>
    `;
  },
};
