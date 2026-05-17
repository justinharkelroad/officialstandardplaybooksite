import { motion } from 'framer-motion';
import { Calendar, Copy, ExternalLink, Video } from 'lucide-react';
import { useState } from 'react';
import BoldNav from '@/components/BoldNav';
import { getNextOccurrence, formatOccurrence, type CallId } from '@/lib/callSchedule';

/* ── Bold tokens (match BoldBoardroom) ─────────────────── */
const display = '"Anton", "Archivo Black", "Oswald", Impact, sans-serif';
const body = 'Inter, -apple-system, BlinkMacSystemFont, "Helvetica Neue", Arial, sans-serif';
const ink = '#0A0A0B';
const paper = '#F4F2EE';
const blue = '#2997FF';

const STORAGE = 'https://puidotfmyrouxezsorlt.supabase.co/storage/v1/object/public/public';

interface Call {
  id: CallId;
  title: string;
  tagline: string;
  cadenceLabel: string;
  cadenceWeek: number;
  meetingId: string;
  registerUrl: string;
  logoUrl: string;
  dominant?: boolean;
}

const CALLS: Call[] = [
  {
    id: 'agencybrain',
    title: 'Standard × AgencyBrain',
    tagline: 'Workflow, automations, and operational lift.',
    cadenceLabel: '3rd Wednesday Monthly',
    cadenceWeek: 3,
    meetingId: '856 9609 1645',
    registerUrl: 'https://us06web.zoom.us/meeting/register/Tw3bEqWhQ5OZWfulbi0JFw',
    logoUrl: `${STORAGE}/${encodeURIComponent('Standard Agencybrain Logo.png')}`,
  },
  {
    id: 'boardroom',
    title: 'The Standard Boardroom',
    tagline: 'Monthly mastermind. Real numbers, real wins, real accountability.',
    cadenceLabel: '2nd Wednesday Monthly',
    cadenceWeek: 2,
    meetingId: '862 3263 2504',
    registerUrl: 'https://us06web.zoom.us/meeting/register/tZIvdOuurTkvGtB3DFPus_VohU6a22LFlb8t',
    logoUrl: `${STORAGE}/${encodeURIComponent('Standard Boardroom Logo.png')}`,
    dominant: true,
  },
  {
    id: 'ai',
    title: 'Standard × AI',
    tagline: 'AI tools, prompts, and the new playbook for sales + service.',
    cadenceLabel: '4th Wednesday Monthly',
    cadenceWeek: 4,
    meetingId: '852 6788 7373',
    registerUrl: 'https://us06web.zoom.us/meeting/register/wXNHPvTaTR6PcTImd_ZnNg',
    logoUrl: `${STORAGE}/${encodeURIComponent('Standard Ai Training Logo.png')}`,
  },
];

const PERSONAL_ROOM = {
  title: "Justin's Standard Meeting Room",
  pmi: '571 693 9535',
  joinUrl: 'https://us06web.zoom.us/s/5716939535?pwd=S21iem9oT0xrTjk5TldMMHdRcks0QT09#success',
};

/* ── Card ──────────────────────────────────────────────── */
const CallCard = ({ call }: { call: Call }) => {
  const occ = getNextOccurrence(call.id, call.cadenceWeek);
  const dateLine = formatOccurrence(occ);
  const [copied, setCopied] = useState(false);

  const dominant = !!call.dominant;

  const copyId = async () => {
    try {
      await navigator.clipboard.writeText(call.meetingId);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch { /* noop */ }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className={`group relative flex flex-col rounded-2xl overflow-hidden border transition-all duration-300 ${
        dominant
          ? 'md:scale-[1.04] md:-my-2 z-10'
          : 'md:my-4'
      }`}
      style={{
        background: dominant
          ? `linear-gradient(180deg, #14171c 0%, #0d1014 100%)`
          : '#101216',
        borderColor: dominant ? `${blue}66` : '#22262d',
        boxShadow: dominant
          ? `0 30px 80px -30px ${blue}66, 0 0 0 1px ${blue}33 inset`
          : '0 12px 30px -20px rgba(0,0,0,0.6)',
      }}
    >
      {dominant && (
        <div
          className="absolute top-0 left-0 right-0 text-center py-2"
          style={{
            fontFamily: body, fontSize: 11, fontWeight: 700,
            letterSpacing: '0.18em', textTransform: 'uppercase',
            color: ink, background: blue,
          }}
        >
          ★ Flagship Monthly Call
        </div>
      )}

      <div className={`flex flex-col items-center text-center px-7 ${dominant ? 'pt-14 pb-9' : 'pt-9 pb-8'}`}>
        {/* Logo */}
        <div
          className={`flex items-center justify-center rounded-xl overflow-hidden mb-6 ${
            dominant ? 'w-36 h-36' : 'w-28 h-28'
          }`}
          style={{ background: '#0a0c10', border: `1px solid ${dominant ? `${blue}44` : '#22262d'}` }}
        >
          <img
            src={call.logoUrl}
            alt={`${call.title} logo`}
            className="w-full h-full object-contain p-3"
            loading="lazy"
          />
        </div>

        {/* Cadence pill */}
        <div
          className="inline-block mb-3 px-3 py-1 rounded-full"
          style={{
            fontFamily: body, fontSize: 10, fontWeight: 700,
            letterSpacing: '0.16em', textTransform: 'uppercase',
            color: blue, background: `${blue}1f`, border: `1px solid ${blue}44`,
          }}
        >
          {call.cadenceLabel}
        </div>

        {/* Title */}
        <h2
          style={{
            fontFamily: display,
            fontSize: dominant ? 30 : 24,
            lineHeight: 1.05,
            letterSpacing: '-0.01em',
            color: paper,
            textTransform: 'uppercase',
            marginBottom: 10,
          }}
        >
          {call.title}
        </h2>

        <p style={{
          fontFamily: body, fontSize: 14, lineHeight: 1.5,
          color: '#a8aeb8', maxWidth: 320, marginBottom: 24,
        }}>
          {call.tagline}
        </p>

        {/* Next meeting */}
        <div
          className="w-full rounded-lg px-4 py-3 mb-4 flex items-start gap-2.5 text-left"
          style={{ background: '#0a0c10', border: '1px solid #22262d' }}
        >
          <Calendar className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: blue }} />
          <div>
            <div style={{
              fontFamily: body, fontSize: 10, fontWeight: 700,
              letterSpacing: '0.14em', textTransform: 'uppercase',
              color: '#7a8090', marginBottom: 2,
            }}>
              Next Meeting
            </div>
            <div style={{
              fontFamily: body, fontSize: 13.5, fontWeight: 600, color: paper, lineHeight: 1.35,
            }}>
              {dateLine}
              {occ.isOverride && (
                <span style={{ color: blue, fontWeight: 700, marginLeft: 6 }}>· Special</span>
              )}
            </div>
          </div>
        </div>

        {/* Meeting ID */}
        <button
          onClick={copyId}
          className="w-full rounded-lg px-4 py-3 mb-5 flex items-center justify-between gap-2 transition-colors"
          style={{ background: '#0a0c10', border: '1px solid #22262d', cursor: 'pointer' }}
          aria-label="Copy meeting ID"
        >
          <div className="text-left">
            <div style={{
              fontFamily: body, fontSize: 10, fontWeight: 700,
              letterSpacing: '0.14em', textTransform: 'uppercase',
              color: '#7a8090', marginBottom: 2,
            }}>
              Meeting ID
            </div>
            <div className="select-all" style={{
              fontFamily: body, fontSize: 14, fontWeight: 600, color: paper, letterSpacing: '0.02em',
            }}>
              {call.meetingId}
            </div>
          </div>
          <Copy className="w-4 h-4 flex-shrink-0" style={{ color: copied ? blue : '#7a8090' }} />
        </button>

        {/* CTA */}
        <a
          href={call.registerUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full inline-flex items-center justify-center gap-2 rounded-full transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
          style={{
            background: dominant ? blue : paper,
            color: ink,
            fontFamily: body,
            fontSize: dominant ? 15 : 14,
            fontWeight: 700,
            letterSpacing: '0.04em',
            textTransform: 'uppercase',
            padding: dominant ? '16px 24px' : '14px 22px',
            boxShadow: dominant ? `0 12px 30px -10px ${blue}99` : 'none',
          }}
        >
          Register on Zoom
          <ExternalLink className="w-4 h-4" />
        </a>
      </div>
    </motion.div>
  );
};

/* ── Page ──────────────────────────────────────────────── */
const Calls = () => {
  const [copied, setCopied] = useState(false);
  const copyPMI = async () => {
    try {
      await navigator.clipboard.writeText(PERSONAL_ROOM.pmi);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch { /* noop */ }
  };

  return (
    <div style={{ background: ink, minHeight: '100vh', color: paper }}>
      <BoldNav />

      {/* Hero */}
      <section className="px-6 pt-32 pb-8 md:pt-40 md:pb-12 max-w-[1280px] mx-auto text-center">
        <div
          className="inline-block px-3 py-1 rounded-full mb-5"
          style={{
            fontFamily: body, fontSize: 10, fontWeight: 700,
            letterSpacing: '0.18em', textTransform: 'uppercase',
            color: blue, background: `${blue}1f`, border: `1px solid ${blue}44`,
          }}
        >
          Monthly Recurring Calls
        </div>
        <h1
          style={{
            fontFamily: display,
            fontSize: 'clamp(40px, 7vw, 84px)',
            lineHeight: 0.95,
            letterSpacing: '-0.02em',
            textTransform: 'uppercase',
            marginBottom: 18,
          }}
        >
          The <span style={{ color: blue }}>Standard</span> Cadence
        </h1>
        <p style={{
          fontFamily: body, fontSize: 17, lineHeight: 1.55,
          color: '#a8aeb8', maxWidth: 620, margin: '0 auto',
        }}>
          Register once for each Zoom — you'll get a calendar invite and reminders. Bookmark this page so you can always come back for the next meeting.
        </p>
      </section>

      {/* 3-up grid */}
      <section className="px-6 pb-14 max-w-[1280px] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-5 md:items-center">
          {CALLS.map((c) => <CallCard key={c.id} call={c} />)}
        </div>
      </section>

      {/* Personal Room */}
      <section className="px-6 pb-24 max-w-[1280px] mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="rounded-2xl border px-6 md:px-10 py-7 md:py-8 flex flex-col md:flex-row md:items-center gap-6"
          style={{ background: '#101216', borderColor: '#22262d' }}
        >
          <div
            className="w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ background: `${blue}1f`, border: `1px solid ${blue}44` }}
          >
            <Video className="w-7 h-7" style={{ color: blue }} />
          </div>

          <div className="flex-1 min-w-0">
            <div style={{
              fontFamily: body, fontSize: 10, fontWeight: 700,
              letterSpacing: '0.16em', textTransform: 'uppercase',
              color: '#7a8090', marginBottom: 4,
            }}>
              Drop-in / 1-on-1
            </div>
            <h3 style={{
              fontFamily: display, fontSize: 24, lineHeight: 1.1,
              textTransform: 'uppercase', letterSpacing: '-0.01em', marginBottom: 6,
            }}>
              {PERSONAL_ROOM.title}
            </h3>
            <button
              onClick={copyPMI}
              className="inline-flex items-center gap-2"
              style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: 0 }}
              aria-label="Copy PMI"
            >
              <span style={{
                fontFamily: body, fontSize: 13, color: '#a8aeb8',
              }}>
                PMI:
              </span>
              <span className="select-all" style={{
                fontFamily: body, fontSize: 14, fontWeight: 600, color: paper, letterSpacing: '0.02em',
              }}>
                {PERSONAL_ROOM.pmi}
              </span>
              <Copy className="w-3.5 h-3.5" style={{ color: copied ? blue : '#7a8090' }} />
            </button>
          </div>

          <a
            href={PERSONAL_ROOM.joinUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 rounded-full transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] flex-shrink-0"
            style={{
              background: blue, color: ink,
              fontFamily: body, fontSize: 14, fontWeight: 700,
              letterSpacing: '0.04em', textTransform: 'uppercase',
              padding: '14px 26px',
              boxShadow: `0 12px 30px -10px ${blue}99`,
            }}
          >
            Join Justin's Room
            <ExternalLink className="w-4 h-4" />
          </a>
        </motion.div>
      </section>

      {/* Footer */}
      <footer style={{ borderTop: `1px solid ${paper}1a`, padding: '24px' }}>
        <p style={{
          fontFamily: body, fontSize: 11, opacity: 0.5,
          letterSpacing: '0.08em', textAlign: 'center',
        }}>
          © {new Date().getFullYear()} STANDARD PLAYBOOK INC. ALL RIGHTS RESERVED.
        </p>
      </footer>
    </div>
  );
};

export default Calls;
