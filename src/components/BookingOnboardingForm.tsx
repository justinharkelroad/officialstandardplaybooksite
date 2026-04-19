import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import standardLogo from '@/assets/standard-word-logo.png';

const sf = '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", "Helvetica Neue", Helvetica, Arial, sans-serif';

interface BookingOnboardingFormProps {
  onComplete: () => void;
  source?: string;
  onCompleteRedirectUrl?: string;
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

const generateSessionId = () => {
  return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

const getOrCreateSessionId = (source: string) => {
  const key = `${SESSION_KEY_PREFIX}-${source}`;
  let sessionId = localStorage.getItem(key);
  if (!sessionId) {
    sessionId = generateSessionId();
    localStorage.setItem(key, sessionId);
  }
  return sessionId;
};

const inputStyle: React.CSSProperties = {
  fontFamily: sf,
  fontSize: 17,
  fontWeight: 400,
  lineHeight: 1.47,
  letterSpacing: '-0.374px',
  color: '#1d1d1f',
  background: '#f5f5f7',
  border: '1px solid rgba(0,0,0,0.1)',
  borderColor: 'rgba(0,0,0,0.1)',
  borderRadius: 8,
  padding: '10px 14px',
  width: '100%',
  outline: 'none',
  transition: 'border-color 0.2s',
  boxSizing: 'border-box' as const,
  WebkitAppearance: 'none' as const,
};

const labelStyle: React.CSSProperties = {
  fontFamily: sf,
  fontSize: 14,
  fontWeight: 600,
  lineHeight: 1.29,
  letterSpacing: '-0.224px',
  color: '#1d1d1f',
  display: 'block',
  marginBottom: 6,
};

const captionStyle: React.CSSProperties = {
  fontFamily: sf,
  fontSize: 12,
  fontWeight: 400,
  lineHeight: 1.33,
  letterSpacing: '-0.12px',
  color: 'rgba(0,0,0,0.36)',
  marginTop: 4,
};

const handleFocus = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
  e.currentTarget.style.borderColor = '#0071e3';
};

const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
  e.currentTarget.style.borderColor = 'rgba(0,0,0,0.08)';
};

const BookingOnboardingForm = ({ onComplete, source = 'eight-week', onCompleteRedirectUrl }: BookingOnboardingFormProps) => {
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
        await supabase
          .from('booking_leads')
          .update({ ...data, source })
          .eq('session_id', sessionId);
      } else {
        await supabase
          .from('booking_leads')
          .insert({ session_id: sessionId, source, ...data });
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
    const formatted = formatPhoneNumber(e.target.value);
    updateField('cell_phone', formatted);
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

  const isStep2Valid = () => {
    return (
      formData.primary_carrier.trim() !== '' &&
      formData.whats_working.trim() !== '' &&
      formData.whats_not_working.trim() !== '' &&
      formData.desired_outcome.trim() !== '' &&
      formData.committed === true
    );
  };

  const handleNext = () => {
    if (isStep1Valid()) setStep(2);
  };

  const handleBack = () => setStep(1);

  const handleComplete = async () => {
    if (!isStep2Valid()) return;
    try {
      await supabase
        .from('booking_leads')
        .update({ completed: true, source })
        .eq('session_id', sessionId);

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
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '40vh' }}>
        <div style={{ width: 24, height: 24, border: '2px solid rgba(0,0,0,0.08)', borderTopColor: '#0071e3', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  const primaryButtonStyle: React.CSSProperties = {
    fontFamily: sf,
    fontSize: 17,
    fontWeight: 400,
    color: '#fff',
    background: '#0071e3',
    border: '1px solid transparent',
    borderRadius: 980,
    padding: '12px 0',
    width: '100%',
    cursor: 'pointer',
    transition: 'all 0.2s',
  };

  const secondaryButtonStyle: React.CSSProperties = {
    fontFamily: sf,
    fontSize: 17,
    fontWeight: 400,
    color: '#0071e3',
    background: 'transparent',
    border: '1px solid #0071e3',
    borderRadius: 980,
    padding: '12px 0',
    width: '100%',
    cursor: 'pointer',
    transition: 'all 0.2s',
  };

  return (
    <div style={{ padding: 24, fontFamily: sf, color: '#1d1d1f' }}>
      <style>{`
        .apple-form input, .apple-form textarea, .apple-form select {
          color: #1d1d1f !important;
          background: #f5f5f7 !important;
          border-color: rgba(0,0,0,0.1) !important;
        }
        .apple-form input::placeholder, .apple-form textarea::placeholder {
          color: rgba(0,0,0,0.3) !important;
        }
        .apple-form input:focus, .apple-form textarea:focus, .apple-form select:focus {
          border-color: #0071e3 !important;
          box-shadow: none !important;
          outline: none !important;
          ring: none !important;
        }
      `}</style>
      {/* Progress */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
          <span style={{ ...captionStyle, color: 'rgba(0,0,0,0.36)' }}>Step {step} of 2</span>
          {isSaving && (
            <span style={{ ...captionStyle, color: 'rgba(0,0,0,0.36)' }}>Saving...</span>
          )}
        </div>
        <div style={{ height: 4, background: '#f5f5f7', borderRadius: 2, overflow: 'hidden' }}>
          <div style={{ height: '100%', width: `${step * 50}%`, background: '#0071e3', borderRadius: 2, transition: 'width 0.3s' }} />
        </div>

        <div style={{ textAlign: 'center', marginTop: 16 }}>
          {step === 1 && source === 'standard-fit' ? (
            <>
              <img src={standardLogo} alt="Standard Playbook" style={{ height: 32, margin: '0 auto 8px', display: 'block', filter: 'brightness(0)' }} />
              <h2 style={{ fontSize: 28, fontWeight: 600, lineHeight: 1.14, letterSpacing: '0.196px', color: '#1d1d1f' }}>
                Background Info for Call
              </h2>
            </>
          ) : (
            <h2 style={{ fontSize: 28, fontWeight: 600, lineHeight: 1.14, letterSpacing: '0.196px', color: '#1d1d1f' }}>
              {step === 1 ? 'Contact Information' : 'Tell Us About You'}
            </h2>
          )}
        </div>
      </div>

      {step === 1 ? (
        <div className="apple-form" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div>
            <label style={labelStyle}>Full Name *</label>
            <input
              type="text"
              placeholder="John Smith"
              value={formData.full_name}
              onChange={(e) => updateField('full_name', e.target.value)}
              style={inputStyle}
              onFocus={handleFocus}
              onBlur={handleBlur}
            />
          </div>
          <div>
            <label style={labelStyle}>Email *</label>
            <input
              type="email"
              placeholder="john@agency.com"
              value={formData.email}
              onChange={(e) => updateField('email', e.target.value)}
              style={inputStyle}
              onFocus={handleFocus}
              onBlur={handleBlur}
            />
          </div>
          <div>
            <label style={labelStyle}>Cell Phone *</label>
            <input
              type="tel"
              placeholder="(555) 123-4567"
              value={formData.cell_phone}
              onChange={handlePhoneChange}
              maxLength={14}
              style={inputStyle}
              onFocus={handleFocus}
              onBlur={handleBlur}
            />
            <p style={captionStyle}>Please enter your personal cell phone, NOT your agency phone number</p>
          </div>
          <button
            onClick={handleNext}
            disabled={!isStep1Valid()}
            style={{
              ...primaryButtonStyle,
              opacity: isStep1Valid() ? 1 : 0.36,
              cursor: isStep1Valid() ? 'pointer' : 'default',
              marginTop: 8,
            }}
          >
            Next
          </button>
        </div>
      ) : (
        <div className="apple-form" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div>
            <label style={labelStyle}>Primary Carrier *</label>
            <input
              type="text"
              placeholder="e.g., State Farm, Allstate"
              value={formData.primary_carrier}
              onChange={(e) => updateField('primary_carrier', e.target.value)}
              style={inputStyle}
              onFocus={handleFocus}
              onBlur={handleBlur}
            />
          </div>
          <div>
            <label style={labelStyle}>What is WORKING right now inside of your agency? *</label>
            <textarea
              placeholder="Describe what's working well..."
              value={formData.whats_working}
              onChange={(e) => updateField('whats_working', e.target.value)}
              style={{ ...inputStyle, minHeight: 80, resize: 'none' }}
              onFocus={handleFocus}
              onBlur={handleBlur}
            />
          </div>
          <div>
            <label style={labelStyle}>What is NOT WORKING inside of your agency? *</label>
            <textarea
              placeholder="Describe what's not working..."
              value={formData.whats_not_working}
              onChange={(e) => updateField('whats_not_working', e.target.value)}
              style={{ ...inputStyle, minHeight: 80, resize: 'none' }}
              onFocus={handleFocus}
              onBlur={handleBlur}
            />
          </div>
          <div>
            <label style={labelStyle}>Why do you want to book this 45-minute call? *</label>
            <textarea
              placeholder="What do you hope to achieve?"
              value={formData.desired_outcome}
              onChange={(e) => updateField('desired_outcome', e.target.value)}
              style={{ ...inputStyle, minHeight: 80, resize: 'none' }}
              onFocus={handleFocus}
              onBlur={handleBlur}
            />
          </div>
          <div>
            <label style={labelStyle}>Are you committed to showing up for the call? *</label>
            <select
              value={formData.committed === null ? '' : formData.committed ? 'yes' : 'no'}
              onChange={(e) => updateField('committed', e.target.value === 'yes')}
              style={{ ...inputStyle, appearance: 'none', backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'12\' height=\'12\' viewBox=\'0 0 12 12\'%3E%3Cpath fill=\'%231d1d1f\' d=\'M6 8L1 3h10z\'/%3E%3C/svg%3E")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 14px center', paddingRight: 40 }}
              onFocus={handleFocus}
              onBlur={handleBlur}
            >
              <option value="" disabled>Select an option</option>
              <option value="yes">Yes</option>
              <option value="no">No</option>
            </select>
            {formData.committed === false && (
              <p style={{ ...captionStyle, color: '#ff3b30', marginTop: 6 }}>
                We only work with people who are 100% committed to showing up.
              </p>
            )}
          </div>
          <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
            <button onClick={handleBack} style={secondaryButtonStyle}>
              Back
            </button>
            <button
              onClick={handleComplete}
              disabled={!isStep2Valid()}
              style={{
                ...primaryButtonStyle,
                opacity: isStep2Valid() ? 1 : 0.36,
                cursor: isStep2Valid() ? 'pointer' : 'default',
              }}
            >
              Continue to Booking
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookingOnboardingForm;
