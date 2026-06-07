import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import standardLogo from '@/assets/standard-word-logo.png';

/* ── Bold editorial type stack ─────────────────────────── */
const display = '"Anton", "Archivo Black", "Oswald", Impact, sans-serif';
const body = 'Inter, -apple-system, BlinkMacSystemFont, "Helvetica Neue", Arial, sans-serif';

/* ── Brand colors ──────────────────────────────────────── */
const ink = '#0A0A0B';
const paper = '#F4F2EE';
const blue = '#2997FF';

interface BookingOnboardingFormProps {
  onComplete: () => void;
  source?: string;
  onCompleteRedirectUrl?: string;
  /** Call length shown in the form copy (e.g. "45-min", "60-min").
   *  Defaults to "45-min" so existing booking flows are unchanged. */
  callLengthLabel?: string;
}

interface FormData {
  full_name: string;
  email: string;
  cell_phone: string;
  primary_carrier: string;
  whats_working: string;
  whats_not_working: string;
  desired_outcome: string;
  committed: boolean | null;
}

const SESSION_KEY_PREFIX = 'booking-session-id';

const generateSessionId = () =>
  `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

const getOrCreateSessionId = (source: string) => {
  const key = `${SESSION_KEY_PREFIX}-${source}`;
  let sessionId = localStorage.getItem(key);
  if (!sessionId) {
    sessionId = generateSessionId();
    localStorage.setItem(key, sessionId);
  }
  return sessionId;
};

/* ── Bold input/label/button styles ────────────────────── */
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

const captionStyle: React.CSSProperties = {
  fontFamily: body,
  fontSize: 11,
  fontWeight: 500,
  letterSpacing: '0.08em',
  color: ink,
  opacity: 0.55,
  textTransform: 'uppercase',
  marginTop: 6,
};

const handleFocus = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
  e.currentTarget.style.borderColor = blue;
  e.currentTarget.style.background = '#fff';
};
const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
  e.currentTarget.style.borderColor = ink;
  e.currentTarget.style.background = 'transparent';
};

const BookingOnboardingForm = ({ onComplete, source = 'eight-week', onCompleteRedirectUrl, callLengthLabel = '45-min' }: BookingOnboardingFormProps) => {
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [sessionId] = useState(() => getOrCreateSessionId(source));
  const [formData, setFormData] = useState<FormData>({
    full_name: '',
    email: '',
    cell_phone: '',
    primary_carrier: '',
    whats_working: '',
    whats_not_working: '',
    desired_outcome: '',
    committed: null,
  });

  useEffect(() => {
    const loadExistingSession = async () => {
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('booking_leads')
          .select('*')
          .eq('session_id', sessionId)
          .maybeSingle();
        if (data && !error) {
          setFormData({
            full_name: data.full_name || '',
            email: data.email || '',
            cell_phone: data.cell_phone || '',
            primary_carrier: data.primary_carrier || '',
            whats_working: data.whats_working || '',
            whats_not_working: data.whats_not_working || '',
            desired_outcome: data.desired_outcome || '',
            committed: data.committed,
          });
        }
      } catch (error) {
        console.error('Error loading session:', error);
      } finally {
        setIsLoading(false);
      }
    };
    loadExistingSession();
  }, [sessionId]);

  const saveToDatabase = useCallback(async (data: FormData) => {
    setIsSaving(true);
    try {
      const { data: existing } = await supabase
        .from('booking_leads')
        .select('id')
        .eq('session_id', sessionId)
        .maybeSingle();
      if (existing) {
        await supabase.from('booking_leads').update({ ...data, source }).eq('session_id', sessionId);
      } else {
        await supabase.from('booking_leads').insert({ session_id: sessionId, source, ...data });
      }
    } catch (error) {
      console.error('Error saving to database:', error);
    } finally {
      setIsSaving(false);
    }
  }, [sessionId, source]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (formData.full_name || formData.email || formData.cell_phone) {
        saveToDatabase(formData);
      }
    }, 1000);
    return () => clearTimeout(timer);
  }, [formData, saveToDatabase]);

  const updateField = (field: keyof FormData, value: string | boolean | null) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const formatPhoneNumber = (value: string) => {
    const digits = value.replace(/\D/g, '').slice(0, 10);
    if (digits.length === 0) return '';
    if (digits.length <= 3) return `(${digits}`;
    if (digits.length <= 6) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
    return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateField('cell_phone', formatPhoneNumber(e.target.value));
  };

  const isStep1Valid = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^[\d\s\-\(\)\+]{10,}$/;
    return (
      formData.full_name.trim() !== '' &&
      emailRegex.test(formData.email) &&
      phoneRegex.test(formData.cell_phone.replace(/\s/g, ''))
    );
  };

  const isStep2Valid = () => (
    formData.primary_carrier.trim() !== '' &&
    formData.whats_working.trim() !== '' &&
    formData.whats_not_working.trim() !== '' &&
    formData.desired_outcome.trim() !== '' &&
    formData.committed === true
  );

  const handleNext = () => { if (isStep1Valid()) setStep(2); };
  const handleBack = () => setStep(1);

  const handleComplete = async () => {
    if (!isStep2Valid()) return;
    try {
      await supabase.from('booking_leads').update({ completed: true, source }).eq('session_id', sessionId);
      supabase.functions.invoke('send-booking-notification', {
        body: {
          full_name: formData.full_name,
          email: formData.email,
          cell_phone: formData.cell_phone,
          primary_carrier: formData.primary_carrier,
          whats_working: formData.whats_working,
          whats_not_working: formData.whats_not_working,
          desired_outcome: formData.desired_outcome,
        },
      }).catch(err => console.error('Email notification error:', err));
      if (typeof window !== 'undefined' && typeof (window as any).fbq === 'function') {
        (window as any).fbq('track', 'Lead', {
          content_name: 'Strategy Call Pre-Form',
          source,
        });
      }
      if (onCompleteRedirectUrl) {
        window.location.href = onCompleteRedirectUrl;
      } else {
        onComplete();
      }
    } catch (error) {
      console.error('Error completing form:', error);
    }
  };

  if (isLoading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '40vh', background: paper }}>
        <div style={{ width: 28, height: 28, border: `2px solid ${ink}1a`, borderTopColor: blue, borderRadius: '50%', animation: 'sp-spin 0.8s linear infinite' }} />
        <style>{`@keyframes sp-spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  const primaryButtonStyle: React.CSSProperties = {
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
    cursor: 'pointer',
    transition: 'all 0.2s',
    textTransform: 'uppercase',
  };

  const secondaryButtonStyle: React.CSSProperties = {
    fontFamily: body,
    fontSize: 13,
    fontWeight: 700,
    letterSpacing: '0.14em',
    color: ink,
    background: 'transparent',
    border: `1.5px solid ${ink}`,
    borderRadius: 0,
    padding: '16px 0',
    width: '100%',
    cursor: 'pointer',
    transition: 'all 0.2s',
    textTransform: 'uppercase',
  };

  const headlineStyle: React.CSSProperties = {
    fontFamily: display,
    fontSize: 'clamp(36px, 6vw, 56px)',
    lineHeight: 0.95,
    letterSpacing: '-0.01em',
    color: ink,
    textTransform: 'uppercase',
    margin: 0,
    fontWeight: 400,
  };

  return (
    <div style={{ background: paper, color: ink, fontFamily: body, padding: '32px 28px 28px' }}>
      <style>{`
        .bold-form input, .bold-form textarea, .bold-form select {
          color: ${ink} !important;
          background: transparent !important;
          border-color: ${ink} !important;
        }
        .bold-form input::placeholder, .bold-form textarea::placeholder {
          color: ${ink} !important;
          opacity: 0.35 !important;
        }
        .bold-form input:focus, .bold-form textarea:focus, .bold-form select:focus {
          border-color: ${blue} !important;
          background: #fff !important;
          box-shadow: none !important;
          outline: none !important;
        }
      `}</style>

      {/* Header: brand mark + step counter */}
      <div className="flex items-center justify-between" style={{ marginBottom: 24 }}>
        <img src={standardLogo} alt="Standard Playbook"
          style={{ height: 18, filter: 'brightness(0)' }} />
        <span style={{
          fontFamily: body, fontSize: 11, fontWeight: 700, letterSpacing: '0.16em',
          color: ink, opacity: 0.55, textTransform: 'uppercase',
        }}>
          {isSaving ? 'Saving…' : `Step 0${step} / 02`}
        </span>
      </div>

      {/* Hairline progress bar */}
      <div style={{ height: 2, background: `${ink}1a`, marginBottom: 28, position: 'relative' }}>
        <div style={{
          height: '100%', width: `${step * 50}%`, background: blue,
          transition: 'width 0.4s ease',
        }} />
      </div>

      {/* Headline */}
      <p style={{
        fontFamily: body, fontSize: 11, fontWeight: 700, letterSpacing: '0.18em',
        color: blue, textTransform: 'uppercase', marginBottom: 10,
      }}>
        / {step === 1 && source === 'standard-fit' ? 'Background Info' : (step === 1 ? 'Contact' : 'About You')}
      </p>
      <h2 style={headlineStyle}>
        {step === 1
          ? (source === 'standard-fit' ? 'Background\nInfo for Call' : 'Contact\nInformation.')
          : 'Tell Us\nAbout You.'}
      </h2>

      <div style={{ height: 1, background: ink, opacity: 0.15, margin: '24px 0 20px' }} />

      {step === 1 ? (
        <div className="bold-form" style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          <div>
            <label style={labelStyle}>Full Name *</label>
            <input type="text" placeholder="John Smith"
              value={formData.full_name}
              onChange={(e) => updateField('full_name', e.target.value)}
              style={inputStyle} onFocus={handleFocus} onBlur={handleBlur} />
          </div>
          <div>
            <label style={labelStyle}>Email *</label>
            <input type="email" placeholder="john@agency.com"
              value={formData.email}
              onChange={(e) => updateField('email', e.target.value)}
              style={inputStyle} onFocus={handleFocus} onBlur={handleBlur} />
          </div>
          <div>
            <label style={labelStyle}>Cell Phone *</label>
            <input type="tel" placeholder="(555) 123-4567"
              value={formData.cell_phone}
              onChange={handlePhoneChange}
              maxLength={14}
              style={inputStyle} onFocus={handleFocus} onBlur={handleBlur} />
            <p style={captionStyle}>Personal cell — not the agency line</p>
          </div>
          <button
            onClick={handleNext}
            disabled={!isStep1Valid()}
            style={{
              ...primaryButtonStyle,
              opacity: isStep1Valid() ? 1 : 0.35,
              cursor: isStep1Valid() ? 'pointer' : 'default',
              marginTop: 12,
            }}
            className={isStep1Valid() ? 'hover:bg-[#2997FF] hover:border-[#2997FF]' : ''}
          >
            Next →
          </button>
        </div>
      ) : (
        <div className="bold-form" style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          <div>
            <label style={labelStyle}>Primary Carrier *</label>
            <input type="text" placeholder="e.g., State Farm, Allstate"
              value={formData.primary_carrier}
              onChange={(e) => updateField('primary_carrier', e.target.value)}
              style={inputStyle} onFocus={handleFocus} onBlur={handleBlur} />
          </div>
          <div>
            <label style={labelStyle}>What is WORKING right now? *</label>
            <textarea placeholder="Describe what's working well…"
              value={formData.whats_working}
              onChange={(e) => updateField('whats_working', e.target.value)}
              style={{ ...inputStyle, minHeight: 90, resize: 'none' }}
              onFocus={handleFocus} onBlur={handleBlur} />
          </div>
          <div>
            <label style={labelStyle}>What is NOT WORKING? *</label>
            <textarea placeholder="Describe what's not working…"
              value={formData.whats_not_working}
              onChange={(e) => updateField('whats_not_working', e.target.value)}
              style={{ ...inputStyle, minHeight: 90, resize: 'none' }}
              onFocus={handleFocus} onBlur={handleBlur} />
          </div>
          <div>
            <label style={labelStyle}>Why book this {callLengthLabel} call? *</label>
            <textarea placeholder="What do you hope to achieve?"
              value={formData.desired_outcome}
              onChange={(e) => updateField('desired_outcome', e.target.value)}
              style={{ ...inputStyle, minHeight: 90, resize: 'none' }}
              onFocus={handleFocus} onBlur={handleBlur} />
          </div>
          <div>
            <label style={labelStyle}>Committed to showing up? *</label>
            <select
              value={formData.committed === null ? '' : formData.committed ? 'yes' : 'no'}
              onChange={(e) => updateField('committed', e.target.value === 'yes')}
              style={{
                ...inputStyle,
                appearance: 'none',
                backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%230A0A0B' d='M6 8L1 3h10z'/%3E%3C/svg%3E")`,
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'right 16px center',
                paddingRight: 40,
              }}
              onFocus={handleFocus} onBlur={handleBlur}
            >
              <option value="" disabled>Select an option</option>
              <option value="yes">Yes</option>
              <option value="no">No</option>
            </select>
            {formData.committed === false && (
              <p style={{
                fontFamily: body, fontSize: 11, fontWeight: 600, letterSpacing: '0.1em',
                color: '#C8102E', textTransform: 'uppercase', marginTop: 8,
              }}>
                We only work with people who are 100% committed to showing up.
              </p>
            )}
          </div>
          <div style={{ display: 'flex', gap: 12, marginTop: 12 }}>
            <button onClick={handleBack} style={secondaryButtonStyle} className="hover:bg-black hover:text-white">
              ← Back
            </button>
            <button
              onClick={handleComplete}
              disabled={!isStep2Valid()}
              style={{
                ...primaryButtonStyle,
                opacity: isStep2Valid() ? 1 : 0.35,
                cursor: isStep2Valid() ? 'pointer' : 'default',
              }}
              className={isStep2Valid() ? 'hover:bg-[#2997FF] hover:border-[#2997FF]' : ''}
            >
              Continue →
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookingOnboardingForm;
