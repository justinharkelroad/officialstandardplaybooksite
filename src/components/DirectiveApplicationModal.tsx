import { useState } from 'react';
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
const blue = '#2080FF';

interface DirectiveApplicationModalProps {
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

const DirectiveApplicationModal = ({ open, onOpenChange }: DirectiveApplicationModalProps) => {
  const [form, setForm] = useState({ full_name: '', email: '', cell_phone: '', agency_name: '', message: '' });
  const [submitting, setSubmitting] = useState(false);

  const formatPhone = (value: string) => {
    const digits = value.replace(/\D/g, '').slice(0, 10);
    if (digits.length <= 3) return digits;
    if (digits.length <= 6) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
    return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.full_name.trim() || !form.email.trim()) {
      toast.error('Please fill in your name and email.');
      return;
    }
    setSubmitting(true);
    try {
      const { error } = await supabase.from('directive_applications').insert({
        full_name: form.full_name.trim(),
        email: form.email.trim(),
        cell_phone: form.cell_phone.trim(),
        agency_name: form.agency_name.trim(),
        message: form.message.trim(),
      });
      if (error) throw error;

      await supabase.functions.invoke('send-directive-notification', {
        body: {
          full_name: form.full_name.trim(),
          email: form.email.trim(),
          cell_phone: form.cell_phone.trim(),
          agency_name: form.agency_name.trim(),
          message: form.message.trim(),
        },
      });

      toast.success("Application submitted! We'll be in touch soon.");
      setForm({ full_name: '', email: '', cell_phone: '', agency_name: '', message: '' });
      onOpenChange(false);
    } catch (err) {
      console.error(err);
      toast.error('Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
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
        <DialogTitle className="sr-only">Apply for The Directive</DialogTitle>

        <div style={{ padding: '32px 28px 28px' }}>
          <style>{`
            .bold-form-d input, .bold-form-d textarea {
              color: ${ink} !important;
              background: transparent !important;
              border-color: ${ink} !important;
            }
            .bold-form-d input::placeholder, .bold-form-d textarea::placeholder {
              color: ${ink} !important;
              opacity: 0.35 !important;
            }
            .bold-form-d input:focus, .bold-form-d textarea:focus {
              border-color: ${blue} !important;
              background: #fff !important;
              box-shadow: none !important;
              outline: none !important;
            }
          `}</style>

          {/* Header */}
          <div className="flex items-center justify-between" style={{ marginBottom: 24 }}>
            <img src={standardLogo} alt="Standard Playbook"
              style={{ height: 18, filter: 'brightness(0)' }} />
            <span style={{
              fontFamily: body, fontSize: 11, fontWeight: 700, letterSpacing: '0.16em',
              color: ink, opacity: 0.55, textTransform: 'uppercase',
            }}>
              Application
            </span>
          </div>

          {/* Headline */}
          <p style={{
            fontFamily: body, fontSize: 11, fontWeight: 700, letterSpacing: '0.18em',
            color: blue, textTransform: 'uppercase', marginBottom: 10,
          }}>
            / The Directive
          </p>
          <h2 style={{
            fontFamily: display,
            fontSize: 'clamp(36px, 6vw, 56px)',
            lineHeight: 0.95,
            letterSpacing: '-0.01em',
            color: ink,
            textTransform: 'uppercase',
            margin: 0,
            fontWeight: 400,
          }}>
            Apply for{'\n'}1:1 Coaching.
          </h2>
          <p style={{
            fontFamily: body, fontSize: 14, fontWeight: 400, lineHeight: 1.55,
            color: ink, opacity: 0.7, marginTop: 12, maxWidth: 380,
          }}>
            Submit your application and we'll reach out personally. Limited slots.
          </p>

          <div style={{ height: 1, background: ink, opacity: 0.15, margin: '24px 0 20px' }} />

          <form onSubmit={handleSubmit} className="bold-form-d"
            style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            <div>
              <label style={labelStyle}>Full Name *</label>
              <input type="text" placeholder="John Smith"
                value={form.full_name}
                onChange={e => setForm(f => ({ ...f, full_name: e.target.value }))}
                style={inputStyle} onFocus={onFocus} onBlur={onBlur}
                maxLength={100} required />
            </div>
            <div>
              <label style={labelStyle}>Email *</label>
              <input type="email" placeholder="john@agency.com"
                value={form.email}
                onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                style={inputStyle} onFocus={onFocus} onBlur={onBlur}
                maxLength={255} required />
            </div>
            <div>
              <label style={labelStyle}>Cell Phone</label>
              <input type="tel" placeholder="(555) 123-4567"
                value={form.cell_phone}
                onChange={e => setForm(f => ({ ...f, cell_phone: formatPhone(e.target.value) }))}
                style={inputStyle} onFocus={onFocus} onBlur={onBlur} />
            </div>
            <div>
              <label style={labelStyle}>Agency Name</label>
              <input type="text" placeholder="Your agency"
                value={form.agency_name}
                onChange={e => setForm(f => ({ ...f, agency_name: e.target.value }))}
                style={inputStyle} onFocus={onFocus} onBlur={onBlur}
                maxLength={150} />
            </div>
            <div>
              <label style={labelStyle}>Why The Directive?</label>
              <textarea placeholder="Tell us about your goals…"
                value={form.message}
                onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                style={{ ...inputStyle, minHeight: 110, resize: 'none' }}
                onFocus={onFocus} onBlur={onBlur}
                maxLength={1000} />
            </div>
            <button
              type="submit"
              disabled={submitting}
              style={{
                fontFamily: body, fontSize: 13, fontWeight: 700, letterSpacing: '0.14em',
                color: paper, background: ink,
                border: `1.5px solid ${ink}`, borderRadius: 0,
                padding: '16px 0', width: '100%',
                cursor: submitting ? 'default' : 'pointer',
                opacity: submitting ? 0.5 : 1,
                transition: 'all 0.2s', textTransform: 'uppercase',
                marginTop: 12,
              }}
              className={!submitting ? 'hover:bg-[#2080FF] hover:border-[#2080FF]' : ''}
            >
              {submitting ? 'Submitting…' : 'Submit Application →'}
            </button>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DirectiveApplicationModal;
