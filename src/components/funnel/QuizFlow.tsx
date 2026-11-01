import { useEffect, useRef, useState } from 'react';
import { QUIZ_QUESTIONS, type QuizAnswers, type QuizQuestionId } from '@/config/quiz';
import { isCompleteAnswers } from '@/lib/funnel/prescribe';
import { readAnswers, readContact, saveAnswers, saveContact } from '@/lib/funnel/funnelState';
import type { FunnelContact } from '@/lib/funnel/track';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

const emptyContact: FunnelContact = { name: '', email: '', phone: '', agency: '' };

const formatPhone = (value: string) => {
  const d = value.replace(/\D/g, '').slice(0, 10);
  if (d.length <= 3) return d ? `(${d}` : '';
  if (d.length <= 6) return `(${d.slice(0, 3)}) ${d.slice(3)}`;
  return `(${d.slice(0, 3)}) ${d.slice(3, 6)}-${d.slice(6)}`;
};

function contactErrors(c: FunnelContact): Partial<Record<keyof FunnelContact, string>> {
  const errors: Partial<Record<keyof FunnelContact, string>> = {};
  if (!c.name.trim()) errors.name = 'Enter your name.';
  if (!EMAIL_RE.test(c.email.trim())) errors.email = 'Enter a valid email.';
  if (c.phone.replace(/\D/g, '').length < 10) errors.phone = 'Enter a 10-digit phone number.';
  if (!c.agency.trim()) errors.agency = 'Enter your agency name.';
  return errors;
}

interface QuizFlowProps {
  /** Shown on the contact step, above the fields. */
  contactTitle: string;
  contactNote: string;
  submitLabel: string;
  onComplete: (answers: QuizAnswers, contact: FunnelContact) => void;
  /** Called when an answer is picked, for step-level analytics later. */
  onStep?: (step: number) => void;
}

/**
 * Questions 1-5 one per screen, then the contact step. Shared by the
 * /decision quiz and the /book booking form. Answers already given in this
 * tab are kept, so a quiz taker who books doesn't answer twice.
 */
const QuizFlow = ({ contactTitle, contactNote, submitLabel, onComplete, onStep }: QuizFlowProps) => {
  const [answers, setAnswers] = useState<Partial<QuizAnswers>>(() => readAnswers() ?? {});
  const [contact, setContact] = useState<FunnelContact>(() => readContact() ?? emptyContact);
  const [step, setStep] = useState(() => {
    const saved = readAnswers();
    if (isCompleteAnswers(saved)) return QUIZ_QUESTIONS.length;
    const firstOpen = QUIZ_QUESTIONS.findIndex((q) => !saved?.[q.id]);
    return firstOpen === -1 ? 0 : firstOpen;
  });
  const [showErrors, setShowErrors] = useState(false);
  const headingRef = useRef<HTMLHeadingElement>(null);

  const total = QUIZ_QUESTIONS.length + 1;
  const onContactStep = step >= QUIZ_QUESTIONS.length;

  useEffect(() => {
    headingRef.current?.focus({ preventScroll: false });
    window.scrollTo({ top: 0 });
  }, [step]);

  const pick = (id: QuizQuestionId, value: string) => {
    const next = { ...answers, [id]: value } as Partial<QuizAnswers>;
    setAnswers(next);
    saveAnswers(next);
    onStep?.(step + 1);
    // A short beat so the selection registers before the next screen.
    window.setTimeout(() => setStep((s) => Math.min(s + 1, QUIZ_QUESTIONS.length)), 160);
  };

  const errors = contactErrors(contact);
  const update = (field: keyof FunnelContact, value: string) => {
    const next = { ...contact, [field]: field === 'phone' ? formatPhone(value) : value };
    setContact(next);
    saveContact(next);
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (Object.keys(errors).length || !isCompleteAnswers(answers)) {
      setShowErrors(true);
      return;
    }
    const clean = {
      name: contact.name.trim(),
      email: contact.email.trim().toLowerCase(),
      phone: contact.phone.trim(),
      agency: contact.agency.trim(),
    };
    saveContact(clean);
    onComplete(answers, clean);
  };

  const progress = Math.round(((step + (onContactStep ? 0.5 : 0)) / total) * 100);

  return (
    <div className="fn-stepper">
      <div className="fn-progress" aria-hidden="true">
        <div className="fn-progress__track">
          <div className="fn-progress__fill" style={{ width: `${Math.max(progress, 6)}%` }} />
        </div>
        <span className="fn-progress__label">{Math.min(step + 1, total)} / {total}</span>
      </div>

      {!onContactStep ? (
        (() => {
          const q = QUIZ_QUESTIONS[step];
          return (
            <fieldset style={{ border: 0, margin: 0, padding: 0 }}>
              <legend style={{ padding: 0 }}>
                <h1 ref={headingRef} tabIndex={-1} className="fn-question" style={{ outline: 'none' }}>{q.title}</h1>
              </legend>
              <div className="fn-options">
                {q.options.map((o) => (
                  <button
                    key={o.value}
                    type="button"
                    className={`fn-option${answers[q.id] === o.value ? ' is-selected' : ''}`}
                    aria-pressed={answers[q.id] === o.value}
                    onClick={() => pick(q.id, o.value)}
                  >
                    {o.label}
                  </button>
                ))}
              </div>
            </fieldset>
          );
        })()
      ) : (
        <form noValidate onSubmit={submit}>
          <h1 ref={headingRef} tabIndex={-1} className="fn-question" style={{ outline: 'none' }}>{contactTitle}</h1>
          <p className="fn-form-note" style={{ marginBottom: 22 }}>{contactNote}</p>
          <div className="fn-fields">
            {([
              ['name', 'Your name', 'text', 'name'],
              ['email', 'Email', 'email', 'email'],
              ['phone', 'Cell phone', 'tel', 'tel'],
              ['agency', 'Agency name', 'text', 'organization'],
            ] as const).map(([field, label, type, autoComplete]) => {
              const error = showErrors ? errors[field] : undefined;
              return (
                <div className="fn-field" key={field}>
                  <label htmlFor={`fn-${field}`}>{label}</label>
                  <input
                    id={`fn-${field}`}
                    type={type}
                    inputMode={type === 'tel' ? 'tel' : type === 'email' ? 'email' : undefined}
                    autoComplete={autoComplete}
                    value={contact[field]}
                    aria-invalid={Boolean(error)}
                    aria-describedby={error ? `fn-${field}-error` : undefined}
                    onChange={(e) => update(field, e.target.value)}
                  />
                  {error && <p id={`fn-${field}-error`} className="fn-field__error">{error}</p>}
                </div>
              );
            })}
            <button type="submit" className="fn-btn fn-btn--blue fn-btn--block">{submitLabel}</button>
          </div>
        </form>
      )}

      {step > 0 && (
        <div className="fn-step-nav">
          <button type="button" className="fn-back" onClick={() => setStep((s) => Math.max(s - 1, 0))}>
            ← Back
          </button>
        </div>
      )}
    </div>
  );
};

export default QuizFlow;
