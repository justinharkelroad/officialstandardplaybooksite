import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import standardLogo from '@/assets/standard-word-logo.png';

/* ── Bold editorial type stack ─────────────────────────── */
const display = '"Anton", "Archivo Black", "Oswald", Impact, sans-serif';
const body = 'Inter, -apple-system, BlinkMacSystemFont, "Helvetica Neue", Arial, sans-serif';

/* ── Brand colors ──────────────────────────────────────── */
const ink = '#0A0A0B';
const paper = '#F4F2EE';
const blue = '#2997FF';

/**
 * The two waitlist-only programs. Both share one form, one table
 * (`directive_applications`, tagged by `program`) and one notification
 * function; the copy below is all that differs. (Justin, 2026-11-11.)
 */
export type WaitlistProgram = 'directive' | 'momentum';

const PROGRAMS: Record<WaitlistProgram, { name: string; eyebrow: string; intro: string }> = {
  directive: {
    name: 'The Directive',
    eyebrow: '/ The Directive',
    intro:
      "The Directive is full right now. Join the waitlist and we'll reach out personally when a seat opens.",
  },
  momentum: {
    name: 'Momentum',
    eyebrow: '/ Momentum',
    intro:
      "Momentum is full right now. Join the waitlist and we'll reach out personally when a seat opens.",
  },
};

interface WaitlistModalProps {
  program: WaitlistProgram;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const inputStyle: React.CSSProperties = {
  fontFamily: body,
  fontSize: 16,
  fontWeight: 400,
  lineHeight: 1.4,
  color: ink,
  background: 'transparent',
  border: `1.5px solid ${ink}`,
  borderRadius: 0,
  padding: '14px 16px',
  width: '100%',
  outline: 'none',
  transition: 'border-color 0.2s, background 0.2s',
  boxSizing: 'border-box',
  WebkitAppearance: 'none',
};

const labelStyle: React.CSSProperties = {
  fontFamily: body,
  fontSize: 11,
  fontWeight: 700,
  letterSpacing: '0.16em',
  color: ink,
  textTransform: 'uppercase',
  display: 'block',
  marginBottom: 8,
};

const onFocus = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
  e.currentTarget.style.borderColor = blue;
  e.currentTarget.style.background = '#fff';
};
const onBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
  e.currentTarget.style.borderColor = ink;
  e.currentTarget.style.background = 'transparent';
};

const buttonStyle = (disabled: boolean): React.CSSProperties => ({
  fontFamily: body,
  fontSize: 13,
  fontWeight: 700,
  letterSpacing: '0.14em',
  color: paper,
  background: ink,
  border: `1.5px solid ${ink}`,
  borderRadius: 0,
  padding: '16px 0',
  width: '100%',
  cursor: disabled ? 'default' : 'pointer',
  opacity: disabled ? 0.5 : 1,
  transition: 'all 0.2s',
  textTransform: 'uppercase',
});

const emptyForm = {
  full_name: '',
  email: '',
  cell_phone: '',
  agency_name: '',
  state: '',
  message: '',
};

const WaitlistModal = ({ program, open, onOpenChange }: WaitlistModalProps) => {
  const copy = PROGRAMS[program];
  const [form, setForm] = useState(emptyForm);
  const [submitting, setSubmitting] = useState(false);
  const [stage, setStage] = useState<'form' | 'done'>('form');

  // "Would you like more information?" inquiry on the confirmation screen.
  const [inquiryOpen, setInquiryOpen] = useState(false);
  const [inquiry, setInquiry] = useState('');
  const [inquirySending, setInquirySending] = useState(false);
  const [inquirySent, setInquirySent] = useState(false);

  const formatPhone = (value: string) => {
    const digits = value.replace(/\D/g, '').slice(0, 10);
    if (digits.length <= 3) return digits;
    if (digits.length <= 6) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
    return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
  };

  const resetAll = () => {
    setForm(emptyForm);
    setStage('form');
    setInquiryOpen(false);
    setInquiry('');
    setInquirySent(false);
  };

  const handleOpenChange = (next: boolean) => {
    if (!next) {
      // Give the close animation a beat before wiping state.
      setTimeout(resetAll, 200);
    }
    onOpenChange(next);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.full_name.trim() || !form.email.trim()) {
      toast.error('Please fill in your name and email.');
      return;
    }
    setSubmitting(true);
    const payload = {
      program,
      full_name: form.full_name.trim(),
      email: form.email.trim(),
      cell_phone: form.cell_phone.trim(),
      agency_name: form.agency_name.trim(),
      state: form.state.trim(),
      message: form.message.trim(),
    };
    try {
      const { error } = await supabase.from('directive_applications').insert(payload);
      if (error) throw error;

      await supabase.functions.invoke('send-directive-notification', { body: payload });

      setStage('done');
    } catch (err) {
      console.error(err);
      toast.error('Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleInquiry = async () => {
    if (!inquiry.trim()) {
      toast.error('Add a quick note about what you would like to know.');
      return;
    }
    setInquirySending(true);
    try {
      const { error } = await supabase.functions.invoke('send-waitlist-inquiry', {
        body: {
          program,
          full_name: form.full_name.trim(),
          email: form.email.trim(),
          cell_phone: form.cell_phone.trim(),
          agency_name: form.agency_name.trim(),
          state: form.state.trim(),
          question: inquiry.trim(),
        },
      });
      if (error) throw error;
      setInquirySent(true);
      toast.success('Sent. Justin and the team will get back to you.');
    } catch (err) {
      console.error(err);
      toast.error('Could not send that. Please try again.');
    } finally {
      setInquirySending(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent
        className="sm:max-w-[520px] max-h-[92vh] overflow-y-auto p-0"
        style={{
          background: paper,
          color: ink,
          borderRadius: 0,
          border: `1.5px solid ${ink}`,
          boxShadow: '0 30px 80px -10px rgba(0,0,0,0.5)',
          fontFamily: body,
          gap: 0,
        }}
      >
        <DialogTitle className="sr-only">Join the {copy.name} waitlist</DialogTitle>

        <div style={{ padding: '32px 28px 28px' }}>
          <style>{`
            .bold-form-w input, .bold-form-w textarea {
              color: ${ink} !important;
              background: transparent !important;
              border-color: ${ink} !important;
            }
            .bold-form-w input::placeholder, .bold-form-w textarea::placeholder {
              color: ${ink} !important;
              opacity: 0.35 !important;
            }
            .bold-form-w input:focus, .bold-form-w textarea:focus {
              border-color: ${blue} !important;
              background: #fff !important;
              box-shadow: none !important;
              outline: none !important;
            }
          `}</style>

          {/* Header */}
          <div className="flex items-center justify-between" style={{ marginBottom: 24 }}>
            <img src={standardLogo} alt="Standard Playbook" style={{ height: 18, filter: 'brightness(0)' }} />
            <span
              style={{
                fontFamily: body,
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: '0.16em',
                color: ink,
                opacity: 0.55,
                textTransform: 'uppercase',
              }}
            >
              Waitlist
            </span>
          </div>

          {stage === 'form' ? (
            <>
              <p
                style={{
                  fontFamily: body,
                  fontSize: 11,
                  fontWeight: 700,
                  letterSpacing: '0.18em',
                  color: blue,
                  textTransform: 'uppercase',
                  marginBottom: 10,
                }}
              >
                {copy.eyebrow}
              </p>
              <h2
                style={{
                  fontFamily: display,
                  fontSize: 'clamp(36px, 6vw, 56px)',
                  lineHeight: 0.95,
                  letterSpacing: '-0.01em',
                  color: ink,
                  textTransform: 'uppercase',
                  margin: 0,
                  fontWeight: 400,
                }}
              >
                Join the{'\n'}waitlist.
              </h2>
              <p
                style={{
                  fontFamily: body,
                  fontSize: 14,
                  fontWeight: 400,
                  lineHeight: 1.55,
                  color: ink,
                  opacity: 0.7,
                  marginTop: 12,
                  maxWidth: 400,
                }}
              >
                {copy.intro}
              </p>

              <div style={{ height: 1, background: ink, opacity: 0.15, margin: '24px 0 20px' }} />

              <form onSubmit={handleSubmit} className="bold-form-w" style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
                <div>
                  <label style={labelStyle}>Full Name *</label>
                  <input
                    type="text"
                    placeholder="John Smith"
                    value={form.full_name}
                    onChange={(e) => setForm((f) => ({ ...f, full_name: e.target.value }))}
                    style={inputStyle}
                    onFocus={onFocus}
                    onBlur={onBlur}
                    maxLength={100}
                    required
                  />
                </div>
                <div>
                  <label style={labelStyle}>Agency Name</label>
                  <input
                    type="text"
                    placeholder="Your agency"
                    value={form.agency_name}
                    onChange={(e) => setForm((f) => ({ ...f, agency_name: e.target.value }))}
                    style={inputStyle}
                    onFocus={onFocus}
                    onBlur={onBlur}
                    maxLength={150}
                  />
                </div>
                <div>
                  <label style={labelStyle}>State</label>
                  <input
                    type="text"
                    placeholder="e.g. Ohio"
                    value={form.state}
                    onChange={(e) => setForm((f) => ({ ...f, state: e.target.value }))}
                    style={inputStyle}
                    onFocus={onFocus}
                    onBlur={onBlur}
                    maxLength={60}
                  />
                </div>
                <div>
                  <label style={labelStyle}>Cell Phone</label>
                  <input
                    type="tel"
                    placeholder="(555) 123-4567"
                    value={form.cell_phone}
                    onChange={(e) => setForm((f) => ({ ...f, cell_phone: formatPhone(e.target.value) }))}
                    style={inputStyle}
                    onFocus={onFocus}
                    onBlur={onBlur}
                  />
                </div>
                <div>
                  <label style={labelStyle}>Email *</label>
                  <input
                    type="email"
                    placeholder="john@agency.com"
                    value={form.email}
                    onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                    style={inputStyle}
                    onFocus={onFocus}
                    onBlur={onBlur}
                    maxLength={255}
                    required
                  />
                </div>
                <div>
                  <label style={labelStyle}>Why {copy.name}? What would you want to talk about?</label>
                  <textarea
                    placeholder="Tell us about your goals and what you'd like to cover when a spot opens…"
                    value={form.message}
                    onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
                    style={{ ...inputStyle, minHeight: 110, resize: 'none' }}
                    onFocus={onFocus}
                    onBlur={onBlur}
                    maxLength={1000}
                  />
                </div>
                <button
                  type="submit"
                  disabled={submitting}
                  style={{ ...buttonStyle(submitting), marginTop: 12 }}
                  className={!submitting ? 'hover:bg-[#2997FF] hover:border-[#2997FF]' : ''}
                >
                  {submitting ? 'Submitting…' : 'Join the Waitlist →'}
                </button>
              </form>
            </>
          ) : (
            /* ── Confirmation: on the list + Boardroom step one + ask for more info ── */
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <p
                style={{
                  fontFamily: body,
                  fontSize: 11,
                  fontWeight: 700,
                  letterSpacing: '0.18em',
                  color: blue,
                  textTransform: 'uppercase',
                  marginBottom: 10,
                }}
              >
                {copy.eyebrow}
              </p>
              <h2
                style={{
                  fontFamily: display,
                  fontSize: 'clamp(32px, 5.5vw, 48px)',
                  lineHeight: 0.95,
                  letterSpacing: '-0.01em',
                  color: ink,
                  textTransform: 'uppercase',
                  margin: 0,
                  fontWeight: 400,
                }}
              >
                You're on{'\n'}the list.
              </h2>
              <p
                style={{
                  fontFamily: body,
                  fontSize: 14,
                  lineHeight: 1.55,
                  color: ink,
                  opacity: 0.7,
                  marginTop: 12,
                  maxWidth: 400,
                }}
              >
                We'll reach out personally when a seat in {copy.name} opens.
              </p>

              {/* Boardroom = the way in */}
              <div
                style={{
                  marginTop: 24,
                  border: `1.5px solid ${ink}`,
                  background: '#fff',
                  padding: '20px',
                }}
              >
                <p
                  style={{
                    fontFamily: body,
                    fontSize: 11,
                    fontWeight: 700,
                    letterSpacing: '0.16em',
                    color: blue,
                    textTransform: 'uppercase',
                    margin: 0,
                  }}
                >
                  Start here
                </p>
                <h3
                  style={{
                    fontFamily: display,
                    fontSize: 22,
                    lineHeight: 1,
                    letterSpacing: '-0.01em',
                    color: ink,
                    textTransform: 'uppercase',
                    margin: '8px 0 0',
                    fontWeight: 400,
                  }}
                >
                  The Boardroom
                </h3>
                <p style={{ fontFamily: body, fontSize: 13.5, lineHeight: 1.55, color: ink, opacity: 0.75, margin: '8px 0 14px' }}>
                  The way into Standard is the weekly Boardroom. Every week you get on a group coaching
                  call with Justin, learn the systems, and start moving now — the best way to move up the
                  waitlist while you wait for a seat.
                </p>
                <Link
                  to="/boardroom"
                  onClick={() => onOpenChange(false)}
                  className="hover:bg-[#2997FF] hover:border-[#2997FF] hover:text-[#F4F2EE]"
                  style={{
                    display: 'inline-block',
                    fontFamily: body,
                    fontSize: 12,
                    fontWeight: 700,
                    letterSpacing: '0.14em',
                    color: ink,
                    background: 'transparent',
                    border: `1.5px solid ${ink}`,
                    borderRadius: 0,
                    padding: '12px 18px',
                    textTransform: 'uppercase',
                    textDecoration: 'none',
                    transition: 'all 0.2s',
                  }}
                >
                  See the Boardroom →
                </Link>
              </div>

              {/* Would you like more information? → emails Justin + the team */}
              <div style={{ marginTop: 20 }}>
                {!inquiryOpen && !inquirySent && (
                  <button
                    type="button"
                    onClick={() => setInquiryOpen(true)}
                    style={{
                      fontFamily: body,
                      fontSize: 13,
                      fontWeight: 700,
                      letterSpacing: '0.04em',
                      color: ink,
                      background: 'transparent',
                      border: 'none',
                      padding: 0,
                      cursor: 'pointer',
                      textDecoration: 'underline',
                      textUnderlineOffset: 3,
                    }}
                  >
                    I'd like more information →
                  </button>
                )}

                {inquiryOpen && !inquirySent && (
                  <div className="bold-form-w">
                    <label style={labelStyle}>What would you like to know?</label>
                    <textarea
                      placeholder="Ask anything — pricing, fit, timing, what a seat looks like…"
                      value={inquiry}
                      onChange={(e) => setInquiry(e.target.value)}
                      style={{ ...inputStyle, minHeight: 100, resize: 'none' }}
                      onFocus={onFocus}
                      onBlur={onBlur}
                      maxLength={1000}
                    />
                    <button
                      type="button"
                      onClick={handleInquiry}
                      disabled={inquirySending}
                      style={{ ...buttonStyle(inquirySending), marginTop: 14 }}
                      className={!inquirySending ? 'hover:bg-[#2997FF] hover:border-[#2997FF]' : ''}
                    >
                      {inquirySending ? 'Sending…' : 'Send to Justin →'}
                    </button>
                  </div>
                )}

                {inquirySent && (
                  <p style={{ fontFamily: body, fontSize: 13.5, lineHeight: 1.55, color: ink, opacity: 0.75, margin: 0 }}>
                    Got it — your question is on its way to Justin and the team. Watch your inbox at{' '}
                    <strong>{form.email.trim() || 'your email'}</strong>.
                  </p>
                )}
              </div>

              <button
                type="button"
                onClick={() => handleOpenChange(false)}
                style={{ ...buttonStyle(false), marginTop: 24 }}
                className="hover:bg-[#2997FF] hover:border-[#2997FF]"
              >
                Done
              </button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default WaitlistModal;
