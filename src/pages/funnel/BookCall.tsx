import { useEffect, useRef, useState } from 'react';
import SEOHead from '@/components/SEOHead';
import { FunnelFooter, FunnelHeader } from '@/components/funnel/FunnelChrome';
import StandardFitModal from '@/components/StandardFitModal';
import { captureMirrorAttribution } from '@/lib/mirrorAttribution';
import { submitFunnelLead } from '@/lib/funnel/track';
import type { LeadSummary } from '@/lib/funnel/leadSummary';
import './Funnel.css';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const FIT_CALENDAR = 'https://agencycoaching.as.me/standardfit';

const formatPhone = (value: string) => {
  const d = value.replace(/\D/g, '').slice(0, 10);
  if (d.length <= 3) return d ? `(${d}` : '';
  if (d.length <= 6) return `(${d.slice(0, 3)}) ${d.slice(3)}`;
  return `(${d.slice(0, 3)}) ${d.slice(3, 6)}-${d.slice(6)}`;
};

type Values = Record<string, string>;
type Choice = { value: string; label: string };
type Step =
  | { kind: 'text'; field: string; prompt: (v: Values) => string; placeholder: string; inputType?: 'email' | 'tel' | 'text'; validate: (raw: string) => string | null; transform?: (raw: string) => string }
  | { kind: 'choice'; field: string; prompt: (v: Values) => string; options: Choice[] };

const required = (label: string) => (raw: string) => (raw.trim() ? null : `Enter your ${label}.`);

const STEPS: Step[] = [
  { kind: 'text', field: 'name', prompt: () => "Before you book with Justin, a few quick things so he walks in ready. First, what's your name?", placeholder: 'Your name', validate: required('name') },
  { kind: 'text', field: 'agency', prompt: (v) => `Good to meet you, ${v.name || 'there'}. What's your agency called?`, placeholder: 'Agency name', validate: required('agency name') },
  { kind: 'choice', field: 'teamSize', prompt: () => 'How big is your team?', options: [
    { value: 'solo', label: 'Just me' }, { value: '1-3', label: '1 to 3 producers' }, { value: '4-10', label: '4 to 10' }, { value: '10+', label: '10+' },
  ] },
  { kind: 'choice', field: 'coachingSoftware', prompt: () => 'Are you looking more for coaching, software, or both?', options: [
    { value: 'coaching', label: 'Coaching' }, { value: 'software', label: 'Software' }, { value: 'both', label: 'Both' },
  ] },
  { kind: 'choice', field: 'focus', prompt: () => "What's the one thing you most want to fix?", options: [
    { value: 'sales', label: 'Sales consistency' }, { value: 'accountability', label: 'Team accountability' }, { value: 'systems', label: 'Systems and process' }, { value: 'growth', label: 'Growth' }, { value: 'other', label: 'Something else' },
  ] },
  { kind: 'choice', field: 'budget', prompt: () => 'What budget are you working with?', options: [
    { value: 'under500', label: 'Under $500/mo' }, { value: '500-1500', label: '$500 to $1,500/mo' }, { value: '1500-3000', label: '$1,500 to $3,000/mo' }, { value: '3000+', label: '$3,000+/mo' }, { value: 'unsure', label: 'Not sure yet' },
  ] },
  { kind: 'text', field: 'email', prompt: () => "Almost done. What's the best email to confirm your call?", placeholder: 'you@agency.com', inputType: 'email', validate: (r) => (EMAIL_RE.test(r.trim()) ? null : 'Enter a valid email.') },
  { kind: 'text', field: 'phone', prompt: () => 'And a cell number, so the team can reach you?', placeholder: '(555) 555-5555', inputType: 'tel', transform: formatPhone, validate: (r) => (r.replace(/\D/g, '').length >= 10 ? null : 'Enter a 10-digit phone number.') },
];

const labelFor = (step: Step, value: string) =>
  step.kind === 'choice' ? step.options.find((o) => o.value === value)?.label ?? value : value;

const BookCall = () => {
  const [values, setValues] = useState<Values>({});
  const [step, setStep] = useState(0);
  const [draft, setDraft] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const sentRef = useRef(false);
  const endRef = useRef<HTMLDivElement>(null);

  const done = step >= STEPS.length;

  useEffect(() => {
    captureMirrorAttribution();
  }, []);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }, [step]);

  // Save the lead once the conversation is complete, before they book.
  useEffect(() => {
    if (!done || sentRef.current) return;
    sentRef.current = true;
    const summary: LeadSummary = {
      prescriptionName: 'Book a Call',
      alternativeName: '',
      offerName: null,
      routeLabel: "Book a Call intake: sent to Justin's calendar",
      answers: STEPS.filter((s) => s.kind === 'choice').map((s) => ({ question: s.prompt(values), answer: labelFor(s, values[s.field] ?? '') })),
    };
    submitFunnelLead({
      kind: 'booking',
      contact: { name: values.name ?? '', email: (values.email ?? '').toLowerCase(), phone: values.phone ?? '', agency: values.agency ?? '' },
      answers: { teamSize: values.teamSize ?? '', coachingSoftware: values.coachingSoftware ?? '', focus: values.focus ?? '', budget: values.budget ?? '' },
      prescription: 'book-call',
      summary,
    });
  }, [done, values]);

  const advance = (field: string, value: string) => {
    setValues((v) => ({ ...v, [field]: value }));
    setDraft('');
    setError(null);
    window.setTimeout(() => setStep((s) => s + 1), 180);
  };

  const submitText = (e: React.FormEvent) => {
    e.preventDefault();
    const current = STEPS[step];
    if (current.kind !== 'text') return;
    const err = current.validate(draft);
    if (err) { setError(err); return; }
    advance(current.field, current.transform ? current.transform(draft) : draft.trim());
  };

  const answered = STEPS.slice(0, Math.min(step, STEPS.length));

  return (
    <main className="funnel-page">
      <SEOHead
        config={{
          title: 'Book a Call | The Standard Playbook',
          description: 'A few quick questions, then grab a time with Justin.',
          canonical: 'https://standardplaybook.com/book-call',
          noindex: true,
        }}
      />
      <FunnelHeader />

      <section className="fn-hero">
        <div className="fn-shell fn-shell--narrow">
          <p className="fn-kicker">/ Book a call</p>
          <h1 className="fn-display fn-h2" style={{ marginBottom: 24 }}>Let's get you with Justin.</h1>

          <div className="bc-log" role="log" aria-live="polite">
            {answered.map((s) => (
              <div key={s.field}>
                <div className="bc-row"><div className="bc-bubble bc-bubble--bot">{s.prompt(values)}</div></div>
                <div className="bc-row bc-row--user"><div className="bc-bubble bc-bubble--user">{s.field === 'phone' ? values[s.field] : labelFor(s, values[s.field] ?? '')}</div></div>
              </div>
            ))}

            {!done ? (
              (() => {
                const current = STEPS[step];
                return (
                  <div>
                    <div className="bc-row"><div className="bc-bubble bc-bubble--bot">{current.prompt(values)}</div></div>
                    {current.kind === 'choice' ? (
                      <div className="bc-choices">
                        {current.options.map((o) => (
                          <button key={o.value} type="button" className="fn-option" onClick={() => advance(current.field, o.value)}>{o.label}</button>
                        ))}
                      </div>
                    ) : (
                      <form className="bc-form" noValidate onSubmit={submitText}>
                        <input
                          className="bc-input"
                          type={current.inputType ?? 'text'}
                          inputMode={current.inputType === 'tel' ? 'tel' : current.inputType === 'email' ? 'email' : undefined}
                          placeholder={current.placeholder}
                          value={draft}
                          autoFocus
                          aria-label={current.placeholder}
                          aria-invalid={Boolean(error)}
                          onChange={(e) => setDraft(current.transform ? current.transform(e.target.value) : e.target.value)}
                        />
                        <button type="submit" className="fn-btn fn-btn--blue">Next</button>
                      </form>
                    )}
                    {error && <p className="fn-field__error" style={{ marginTop: 8 }}>{error}</p>}
                  </div>
                );
              })()
            ) : (
              <div>
                <div className="bc-row"><div className="bc-bubble bc-bubble--bot">Thanks, {values.name}. That's everything Justin needs. Grab a time that works and he'll be ready for you.</div></div>
                <div className="bc-cta">
                  <button type="button" className="fn-btn fn-btn--blue fn-btn--block" onClick={() => setModalOpen(true)}>Grab a time with Justin</button>
                </div>
              </div>
            )}
            <div ref={endRef} />
          </div>
        </div>
      </section>

      <StandardFitModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        source="book-call"
        bookingBaseUrl={FIT_CALENDAR}
        callLengthLabel="45-min"
        programName="Standard"
        prefill={{ full_name: values.name, email: values.email, cell_phone: values.phone }}
      />

      <FunnelFooter />
    </main>
  );
};

export default BookCall;
