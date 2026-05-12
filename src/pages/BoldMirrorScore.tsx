import { useEffect, useMemo, useState, useCallback, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import standardLogo from '@/assets/standard-word-logo.png';

import MirrorStarRating from '@/components/mirror/MirrorStarRating';
import MirrorProgressBar from '@/components/mirror/MirrorProgressBar';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';

import {
  ANCHOR_HIGH,
  ANCHOR_LOW,
  DISCIPLINE_REMINDER,
  MIRROR_QUESTIONS,
  TOTAL_QUESTIONS,
} from '@/data/mirrorQuestions';
import { scoreAssessment, type QuestionScores } from '@/lib/mirrorScoring';
import { captureMirrorAttribution, readMirrorAttribution } from '@/lib/mirrorAttribution';
import { supabase } from '@/integrations/supabase/client';

const display = '"Anton", "Archivo Black", "Oswald", Impact, sans-serif';
const body = 'Inter, -apple-system, BlinkMacSystemFont, "Helvetica Neue", Arial, sans-serif';

const ink = '#0A0A0B';
const paper = '#F4F2EE';
const blue = '#2997FF';

/* ── Sticky header ─────────────────────────────────────── */
const StickyHeader = ({
  progress,
  questionNum,
  totalQuestions,
  onExit,
  onBack,
  showBack,
}: {
  progress: number;
  questionNum: number;
  totalQuestions: number;
  onExit: () => void;
  onBack: () => void;
  showBack: boolean;
}) => (
  <div
    className="fixed top-0 left-0 right-0 z-40"
    style={{ background: paper, borderBottom: `1px solid ${ink}1a` }}
  >
    <div className="max-w-[720px] mx-auto px-5 md:px-6 py-3 flex items-center justify-between">
      <Link to="/mirror" aria-label="Standard Playbook">
        <img src={standardLogo} alt="Standard Playbook" style={{ height: 16, filter: 'brightness(0)' }} />
      </Link>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <button
          type="button"
          onClick={onBack}
          aria-label="Back"
          disabled={!showBack}
          style={{
            fontFamily: body,
            fontSize: 12,
            fontWeight: 600,
            letterSpacing: '0.12em',
            color: ink,
            textTransform: 'uppercase',
            background: 'transparent',
            border: 'none',
            cursor: showBack ? 'pointer' : 'default',
            opacity: showBack ? 0.85 : 0.25,
            padding: '6px 0',
          }}
        >
          ← Back
        </button>
        <button
          type="button"
          onClick={onExit}
          aria-label="Exit"
          style={{
            fontFamily: body,
            fontSize: 12,
            fontWeight: 600,
            letterSpacing: '0.12em',
            color: ink,
            textTransform: 'uppercase',
            background: 'transparent',
            border: 'none',
            cursor: 'pointer',
            padding: '6px 0',
          }}
        >
          × Exit
        </button>
      </div>
    </div>

    <MirrorProgressBar progress={progress} />

    <div className="max-w-[720px] mx-auto px-5 md:px-6 py-2 flex items-center justify-end">
      <p
        style={{
          fontFamily: body,
          fontSize: 11,
          fontWeight: 600,
          letterSpacing: '0.16em',
          color: ink,
          opacity: 0.55,
          textTransform: 'uppercase',
          margin: 0,
        }}
      >
        / Question {questionNum} of {totalQuestions}
      </p>
    </div>
  </div>
);

/* ── Per-question screen ───────────────────────────────── */
const QuestionScreen = ({
  index,
  current,
  onRate,
}: {
  index: number;
  current: number | null;
  onRate: (n: number, advance: boolean) => void;
}) => {
  const q = MIRROR_QUESTIONS[index];

  return (
    <motion.div
      key={`q-${q.id}`}
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      className="max-w-[720px] mx-auto px-5 md:px-6"
      style={{ paddingTop: 130, paddingBottom: 64 }}
    >
      <p
        style={{
          fontFamily: body,
          fontSize: 11,
          fontWeight: 700,
          letterSpacing: '0.18em',
          color: blue,
          textTransform: 'uppercase',
          margin: 0,
          marginBottom: 18,
        }}
      >
        Pillar {q.pillarNumber} / {q.pillarLabel}
      </p>

      <h2
        style={{
          fontFamily: display,
          fontSize: 'clamp(40px, 7vw, 76px)',
          lineHeight: 0.95,
          letterSpacing: '-0.01em',
          color: ink,
          textTransform: 'uppercase',
          margin: 0,
          fontWeight: 400,
        }}
      >
        {q.subcategory}
      </h2>

      <p
        style={{
          fontFamily: body,
          fontStyle: 'italic',
          fontSize: 'clamp(18px, 2.4vw, 22px)',
          fontWeight: 400,
          lineHeight: 1.45,
          color: ink,
          opacity: 0.85,
          margin: 0,
          marginTop: 28,
          maxWidth: 640,
        }}
      >
        {q.opener}
      </p>

      <p
        style={{
          fontFamily: body,
          fontSize: 'clamp(17px, 2.2vw, 21px)',
          fontWeight: 500,
          lineHeight: 1.4,
          color: ink,
          opacity: 0.95,
          margin: 0,
          marginTop: 24,
          marginBottom: 44,
          maxWidth: 640,
        }}
      >
        {q.question}
      </p>

      <MirrorStarRating
        value={current}
        onRate={(n) => onRate(n, false)}
        onAdvance={(n) => onRate(n, true)}
        lowAnchor={ANCHOR_LOW}
        highAnchor={ANCHOR_HIGH}
      />

      <p
        style={{
          fontFamily: body,
          fontStyle: 'italic',
          fontSize: 13,
          fontWeight: 400,
          lineHeight: 1.5,
          color: ink,
          opacity: 0.55,
          margin: 0,
          marginTop: 28,
          textAlign: 'center',
          maxWidth: 480,
          marginLeft: 'auto',
          marginRight: 'auto',
        }}
      >
        {DISCIPLINE_REMINDER}
      </p>
    </motion.div>
  );
};

/* ── Email + qualification capture (final step) ─────────── */
type CarrierValue =
  | 'allstate'
  | 'state_farm'
  | 'farmers'
  | 'american_family'
  | 'independent'
  | 'other';

const CARRIERS: { value: CarrierValue; label: string }[] = [
  { value: 'allstate', label: 'Allstate' },
  { value: 'state_farm', label: 'State Farm' },
  { value: 'farmers', label: 'Farmers' },
  { value: 'american_family', label: 'American Family' },
  { value: 'independent', label: 'Independent' },
  { value: 'other', label: 'Other' },
];

const CARRIER_VALUES: ReadonlySet<CarrierValue> = new Set(CARRIERS.map((c) => c.value));

/* Bottom-border-only field styling */
const lineFieldStyle: React.CSSProperties = {
  fontFamily: body,
  fontSize: 16,
  fontWeight: 400,
  lineHeight: 1.4,
  color: ink,
  background: 'transparent',
  border: 'none',
  borderBottom: `1.5px solid ${ink}`,
  borderRadius: 0,
  padding: '12px 0',
  width: '100%',
  outline: 'none',
  transition: 'border-color 0.2s',
  boxSizing: 'border-box',
  WebkitAppearance: 'none',
};

const labelStyle: React.CSSProperties = {
  fontFamily: body,
  fontSize: 12,
  fontWeight: 500,
  letterSpacing: '0.14em',
  color: ink,
  opacity: 0.7,
  textTransform: 'uppercase',
  display: 'block',
  marginBottom: 6,
};

const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
  e.currentTarget.style.borderBottomColor = blue;
};
const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
  e.currentTarget.style.borderBottomColor = ink;
};

/* Custom carrier dropdown — not a native <select> so it matches the bold brand */
const CarrierSelect = ({
  value,
  onChange,
}: {
  value: CarrierValue | '';
  onChange: (v: CarrierValue) => void;
}) => {
  const [open, setOpen] = useState(false);
  const [focused, setFocused] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDocClick = (e: MouseEvent) => {
      if (!wrapperRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false);
        triggerRef.current?.focus();
      }
    };
    document.addEventListener('mousedown', onDocClick);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDocClick);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  const selected = CARRIERS.find((c) => c.value === value);

  return (
    <div ref={wrapperRef} style={{ position: 'relative' }}>
      <button
        ref={triggerRef}
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen((s) => !s)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={{
          ...lineFieldStyle,
          borderBottomColor: focused || open ? blue : ink,
          textAlign: 'left',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 12,
        }}
      >
        <span style={{ color: selected ? ink : `${ink}80`, fontWeight: 400 }}>
          {selected?.label ?? 'Select your carrier'}
        </span>
        <svg
          width="14"
          height="14"
          viewBox="0 0 14 14"
          fill="none"
          aria-hidden
          style={{
            flexShrink: 0,
            transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
            transition: 'transform 0.2s ease',
          }}
        >
          <path d="M3 5 L7 9 L11 5" stroke={ink} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {open && (
        <ul
          role="listbox"
          aria-label="Carrier"
          style={{
            position: 'absolute',
            top: 'calc(100% + 6px)',
            left: 0,
            right: 0,
            background: '#fff',
            border: `1px solid ${ink}`,
            zIndex: 60,
            margin: 0,
            padding: 0,
            listStyle: 'none',
            maxHeight: 320,
            overflowY: 'auto',
            boxShadow: '0 14px 32px -16px rgba(0,0,0,0.35)',
          }}
        >
          {CARRIERS.map((c, i) => {
            const isSelected = c.value === value;
            return (
              <li key={c.value} role="option" aria-selected={isSelected}>
                <button
                  type="button"
                  onClick={() => {
                    onChange(c.value);
                    setOpen(false);
                    triggerRef.current?.focus();
                  }}
                  style={{
                    display: 'block',
                    width: '100%',
                    textAlign: 'left',
                    fontFamily: body,
                    fontSize: 16,
                    fontWeight: 400,
                    lineHeight: 1.4,
                    color: ink,
                    background: isSelected ? `${blue}14` : 'transparent',
                    border: 'none',
                    borderBottom: i === CARRIERS.length - 1 ? 'none' : `1px solid ${ink}1a`,
                    padding: '14px 16px',
                    cursor: 'pointer',
                    transition: 'background 0.15s',
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = `${blue}14`; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = isSelected ? `${blue}14` : 'transparent'; }}
                >
                  {c.label}
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

const formatPhone = (raw: string): string => {
  const digits = raw.replace(/\D/g, '').slice(0, 10);
  if (digits.length < 4) return digits;
  if (digits.length < 7) return `${digits.slice(0, 3)}-${digits.slice(3)}`;
  return `${digits.slice(0, 3)}-${digits.slice(3, 6)}-${digits.slice(6)}`;
};

const validateCapture = (fullName: string, email: string, phone: string, carrier: string) => {
  const fullNameOk = fullName.trim().length >= 2;
  const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
  const phoneOk = phone.replace(/\D/g, '').length === 10;
  const carrierOk = CARRIER_VALUES.has(carrier as CarrierValue);
  return { fullNameOk, emailOk, phoneOk, carrierOk, allValid: fullNameOk && emailOk && phoneOk && carrierOk };
};

const CaptureScreen = ({
  fullName,
  email,
  phone,
  carrier,
  setFullName,
  setEmail,
  setPhone,
  setCarrier,
  onSubmit,
  submitting,
  error,
}: {
  fullName: string;
  email: string;
  phone: string;
  carrier: CarrierValue | '';
  setFullName: (s: string) => void;
  setEmail: (s: string) => void;
  setPhone: (s: string) => void;
  setCarrier: (v: CarrierValue) => void;
  onSubmit: () => void;
  submitting: boolean;
  error: string | null;
}) => {
  const { allValid } = validateCapture(fullName, email, phone, carrier);
  const disabled = submitting || !allValid;

  return (
    <motion.div
      key="capture"
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="max-w-[560px] mx-auto px-5 md:px-6"
      style={{ paddingTop: 130, paddingBottom: 80 }}
    >
      <h2
        style={{
          fontFamily: display,
          fontSize: 'clamp(48px, 8vw, 84px)',
          lineHeight: 0.95,
          letterSpacing: '-0.01em',
          color: ink,
          textTransform: 'uppercase',
          margin: 0,
          fontWeight: 400,
        }}
      >
        ALMOST THERE.
      </h2>
      <p
        style={{
          fontFamily: body,
          fontSize: 'clamp(16px, 1.8vw, 19px)',
          fontWeight: 400,
          lineHeight: 1.55,
          color: ink,
          opacity: 0.85,
          margin: 0,
          marginTop: 18,
        }}
      >
        Where should we send your results?
      </p>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (!disabled) onSubmit();
        }}
        style={{ marginTop: 36 }}
      >
        <div style={{ marginBottom: 28 }}>
          <label htmlFor="mirror_full_name" style={labelStyle}>
            Full name
          </label>
          <input
            id="mirror_full_name"
            name="full_name"
            type="text"
            autoComplete="name"
            required
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            onFocus={handleFocus}
            onBlur={handleBlur}
            style={lineFieldStyle}
          />
        </div>

        <div style={{ marginBottom: 28 }}>
          <label htmlFor="mirror_email" style={labelStyle}>
            Email
          </label>
          <input
            id="mirror_email"
            name="email"
            type="email"
            inputMode="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onFocus={handleFocus}
            onBlur={handleBlur}
            style={lineFieldStyle}
          />
        </div>

        <div style={{ marginBottom: 28 }}>
          <label htmlFor="mirror_phone" style={labelStyle}>
            Phone
          </label>
          <input
            id="mirror_phone"
            name="phone"
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            required
            maxLength={12}
            placeholder="555-555-5555"
            value={phone}
            onChange={(e) => setPhone(formatPhone(e.target.value))}
            onFocus={handleFocus}
            onBlur={handleBlur}
            style={lineFieldStyle}
          />
        </div>

        <div style={{ marginBottom: 36 }}>
          <label style={labelStyle}>Carrier</label>
          <CarrierSelect value={carrier} onChange={setCarrier} />
        </div>

        {error && (
          <p
            style={{
              fontFamily: body,
              fontSize: 13,
              color: '#C8102E',
              marginBottom: 16,
            }}
          >
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={disabled}
          style={{
            fontFamily: body,
            fontSize: 14,
            fontWeight: 700,
            letterSpacing: '0.14em',
            color: '#fff',
            background: ink,
            textTransform: 'uppercase',
            padding: '18px 28px',
            border: `1.5px solid ${ink}`,
            width: '100%',
            cursor: disabled ? 'not-allowed' : 'pointer',
            opacity: disabled ? 0.4 : 1,
            transition: 'all .25s',
          }}
          className={disabled ? '' : 'hover:bg-[#2997FF] hover:border-[#2997FF]'}
        >
          {submitting ? 'Calculating…' : 'See My Score →'}
        </button>

        <p
          style={{
            fontFamily: body,
            fontSize: 12,
            fontWeight: 400,
            lineHeight: 1.55,
            color: ink,
            opacity: 0.6,
            margin: 0,
            marginTop: 18,
          }}
        >
          We'll send your full Mirror PDF and 7-day breakdown. Unsubscribe anytime.
        </p>
      </form>
    </motion.div>
  );
};

/* ── Page ──────────────────────────────────────────────── */
const BoldMirrorScore = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(0); // 0..31 = question index, 32 = capture
  const [answers, setAnswers] = useState<QuestionScores>({});
  const [exitOpen, setExitOpen] = useState(false);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [carrier, setCarrier] = useState<CarrierValue | ''>('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isCapture = step >= TOTAL_QUESTIONS;

  // Meta Pixel PageView
  useEffect(() => {
    // Re-capture attribution here in case visitor deep-linked or the Meta in-app
    // browser dropped sessionStorage between /mirror and /mirror/score.
    captureMirrorAttribution();
    try { (window as any).fbq?.('track', 'PageView'); } catch {}
  }, []);

  // Meta Pixel: InitiateCheckout when first question rendered.
  useEffect(() => {
    try { (window as any).fbq?.('track', 'InitiateCheckout'); } catch {}
  }, []);

  // Scroll to top on step change so each question is fresh.
  useEffect(() => {
    if (typeof window === 'undefined') return;
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
  }, [step]);

  const progress = useMemo(() => {
    if (isCapture) return 1;
    // step 0 = pre-rate q1 (0/32); upon advance to step 1 we've answered q1, so progress = 1/32.
    // We model progress as (answered count) / 32 for the bar feel, which matches "rate to advance".
    const answered = Object.keys(answers).length;
    return answered / TOTAL_QUESTIONS;
  }, [answers, isCapture]);

  const currentNum = isCapture ? TOTAL_QUESTIONS : step + 1;

  const handleRate = useCallback(
    (n: number, advance: boolean) => {
      if (isCapture) return;
      const q = MIRROR_QUESTIONS[step];
      setAnswers((prev) => ({ ...prev, [q.id]: n }));
      if (advance) {
        // Idempotent advance: if a stale callback fires after we've already
        // moved past this question, do nothing instead of double-advancing.
        setStep((s) => (s === step ? s + 1 : s));
      }
    },
    [isCapture, step],
  );

  const handleBack = useCallback(() => {
    setStep((s) => Math.max(0, s - 1));
  }, []);

  const showBack = step > 0;

  const onConfirmExit = () => {
    setExitOpen(false);
    navigate('/mirror');
  };

  const requestExit = () => setExitOpen(true);

  const handleSubmit = useCallback(async () => {
    setError(null);
    const v = validateCapture(fullName, email, phone, carrier);
    if (!v.fullNameOk) {
      setError('Please enter your full name.');
      return;
    }
    if (!v.emailOk) {
      setError('Please enter a valid email address.');
      return;
    }
    if (!v.phoneOk) {
      setError('Please enter a valid 10-digit US phone number.');
      return;
    }
    if (!v.carrierOk) {
      setError('Please select your carrier.');
      return;
    }
    if (Object.keys(answers).length < TOTAL_QUESTIONS) {
      setError('Looks like a question was skipped. Please go back and complete all 32.');
      return;
    }

    setSubmitting(true);

    const result = scoreAssessment(answers);

    // Re-capture right before submit (final chance to grab fbclid/gclid from URL)
    // then read the merged attribution record.
    captureMirrorAttribution();
    const attribution = readMirrorAttribution();

    const ua = typeof navigator !== 'undefined' ? navigator.userAgent : '';
    const isMobile = /Mobile|Android|iPhone|iPad|iPod/.test(ua);

    const payload = {
      email: email.trim().toLowerCase(),
      full_name: fullName.trim(),
      phone: phone.trim(),
      carrier: carrier as CarrierValue,
      total_score: result.totalScore,
      tier: result.tier,
      weakest_pillar: result.weakestPillar,
      pillar_scores: result.pillarScores,
      question_scores: answers,
      utm_source: attribution.utm_source,
      utm_medium: attribution.utm_medium,
      utm_campaign: attribution.utm_campaign,
      utm_content: attribution.utm_content,
      fbclid: attribution.fbclid,
      gclid: attribution.gclid,
      referrer: attribution.referrer,
      landing_path: attribution.landing_path,
      device_type: isMobile ? 'mobile' : 'desktop',
      user_agent: ua.slice(0, 500),
    };

    try {
      // @ts-expect-error mirror_submissions table is created via migration; types regen later.
      const { data, error: insertErr } = await supabase
        .from('mirror_submissions')
        .insert(payload)
        .select('id')
        .single();

      if (insertErr) throw insertErr;
      const submissionId = (data as any)?.id as string | undefined;

      // Fire Edge Function (non-blocking — don't fail the user-facing flow if it errors).
      try {
        await supabase.functions.invoke('send-mirror-notification', {
          body: { ...payload, id: submissionId },
        });
      } catch (fnErr) {
        console.error('send-mirror-notification failed', fnErr);
      }

      // Meta Pixel Lead event.
      try { (window as any).fbq?.('track', 'Lead', { content_name: 'Mirror Assessment' }); } catch {}
      try { (window as any).fbq?.('trackCustom', 'MirrorLead', { content_name: 'Mirror Assessment' }); } catch {}

      if (submissionId) {
        navigate(`/mirror/results?id=${submissionId}`);
      } else {
        // Fall back to passing the score in the URL so the results page can still render.
        navigate(`/mirror/results?score=${result.totalScore}&tier=${result.tier}&pillar=${result.weakestPillar}`);
      }
    } catch (err: any) {
      console.error('Mirror submission failed', err);
      setError('Something went wrong saving your score. Please try again.');
      setSubmitting(false);
    }
  }, [answers, email, fullName, phone, carrier, navigate]);

  return (
    <div style={{ background: paper, fontFamily: body, color: ink, minHeight: '100vh' }}>
      <StickyHeader
        progress={progress}
        questionNum={currentNum}
        totalQuestions={TOTAL_QUESTIONS}
        onExit={requestExit}
        onBack={handleBack}
        showBack={showBack}
      />

      <AnimatePresence mode="wait">
        {isCapture ? (
          <CaptureScreen
            key="capture"
            fullName={fullName}
            email={email}
            phone={phone}
            carrier={carrier}
            setFullName={setFullName}
            setEmail={setEmail}
            setPhone={setPhone}
            setCarrier={setCarrier}
            onSubmit={handleSubmit}
            submitting={submitting}
            error={error}
          />
        ) : (
          <QuestionScreen
            key={`q-${step}`}
            index={step}
            current={answers[MIRROR_QUESTIONS[step].id] ?? null}
            onRate={handleRate}
          />
        )}
      </AnimatePresence>

      <Dialog open={exitOpen} onOpenChange={setExitOpen}>
        <DialogContent style={{ background: paper, color: ink, fontFamily: body }}>
          <DialogHeader>
            <DialogTitle
              style={{
                fontFamily: display,
                fontSize: 32,
                lineHeight: 0.95,
                letterSpacing: '-0.01em',
                color: ink,
                textTransform: 'uppercase',
                fontWeight: 400,
              }}
            >
              Lose your progress?
            </DialogTitle>
            <DialogDescription
              style={{
                fontFamily: body,
                fontSize: 15,
                color: ink,
                opacity: 0.8,
                marginTop: 8,
              }}
            >
              Your answers won't be saved. If you exit now, you'll start over the next time you come back.
            </DialogDescription>
          </DialogHeader>
          <div style={{ display: 'flex', gap: 12, marginTop: 16, flexWrap: 'wrap' }}>
            <button
              type="button"
              onClick={() => setExitOpen(false)}
              style={{
                fontFamily: body,
                fontSize: 13,
                fontWeight: 700,
                letterSpacing: '0.14em',
                color: '#fff',
                background: ink,
                textTransform: 'uppercase',
                padding: '14px 22px',
                border: `1.5px solid ${ink}`,
                cursor: 'pointer',
                flex: 1,
              }}
            >
              Keep going
            </button>
            <button
              type="button"
              onClick={onConfirmExit}
              style={{
                fontFamily: body,
                fontSize: 13,
                fontWeight: 600,
                letterSpacing: '0.14em',
                color: ink,
                background: 'transparent',
                textTransform: 'uppercase',
                padding: '14px 22px',
                border: `1.5px solid ${ink}`,
                cursor: 'pointer',
                flex: 1,
              }}
            >
              Exit
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default BoldMirrorScore;
