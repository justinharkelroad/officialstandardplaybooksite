import type { CSSProperties } from 'react';

/**
 * The optional "text me" box on the website's sign-up forms (Justin and Mary, Nov 11, 2026).
 * Unchecked by default; ticking it is the person's written consent to texts, which Agency Brain
 * records as a web form opt-in (crm-lead-intake, text_ok). Wording matches the Privacy Policy's
 * text message section and the Acuity booking checkbox. It inherits the form's text color.
 */
export const TEXT_OPT_IN_LABEL =
  'Yes, text me about my request and any calls I book with The Standard Playbook. Message frequency varies. Message and data rates may apply. Reply STOP to opt out, HELP for help.';

interface TextOptInProps {
  id: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  style?: CSSProperties;
}

const TextOptIn = ({ id, checked, onChange, style }: TextOptInProps) => (
  <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, ...style }}>
    <input
      id={id}
      type="checkbox"
      checked={checked}
      onChange={(e) => onChange(e.target.checked)}
      style={{ marginTop: 3, width: 16, height: 16, flexShrink: 0, cursor: 'pointer', accentColor: 'currentColor' }}
    />
    <label htmlFor={id} style={{ fontSize: 12, lineHeight: 1.5, opacity: 0.8, cursor: 'pointer' }}>
      {TEXT_OPT_IN_LABEL}{' '}
      See our{' '}
      <a href="/privacy" target="_blank" rel="noopener noreferrer" style={{ color: 'inherit', textDecoration: 'underline' }}>
        Privacy Policy
      </a>
      .
    </label>
  </div>
);

export default TextOptIn;
