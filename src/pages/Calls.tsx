import { motion } from 'framer-motion';
import { Copy, ArrowUpRight } from 'lucide-react';
import { useState } from 'react';
import BoldNav from '@/components/BoldNav';
import { getNextOccurrence, formatOccurrence, type CallId } from '@/lib/callSchedule';

/* ── Bold editorial tokens ─────────────────────────────── */
const display = '"Anton", "Archivo Black", "Oswald", Impact, sans-serif';
const editorial = '"Archivo Black", "Anton", Impact, sans-serif';
const body = 'Inter, -apple-system, BlinkMacSystemFont, "Helvetica Neue", Arial, sans-serif';
const ink = '#0A0A0B';
const paper = '#F4F2EE';
const blue = '#2997FF';

const STORAGE = 'https://puidotfmyrouxezsorlt.supabase.co/storage/v1/object/public/public';

/* ── Reveal helper ─────────────────────────────────────── */
const Reveal = ({ children, className = '', delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) => (
  <motion.div
    initial={{ opacity: 0, y: 24 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: '-80px' }}
    transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
    className={className}
  >
    {children}
  </motion.div>
);

interface Call {
  id: CallId;
  index: string;
  title: string;
  titleAccent?: string;
  tagline: string;
  cadenceLabel: string;
  cadenceWeek: number;
  meetingId: string;
  registerUrl: string;
  logoUrl: string;
  dominant?: boolean;
  requiresMembership?: boolean;
}

const CALLS: Call[] = [
  {
    id: 'agencybrain',
    index: '01',
    title: 'Standard ×',
    titleAccent: 'AgencyBrain',
    tagline: 'Workflow, automations, and operational lift for the agency stack.',
    cadenceLabel: '3rd Wednesday Monthly',
    cadenceWeek: 3,
    meetingId: '856 9609 1645',
    registerUrl: 'https://us06web.zoom.us/meeting/register/Tw3bEqWhQ5OZWfulbi0JFw',
    logoUrl: `${STORAGE}/${encodeURIComponent('Standard Agencybrain Logo.png')}`,
  },
  {
    id: 'boardroom',
    index: '02',
    title: 'The Standard',
    titleAccent: 'Boardroom',
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
    index: '03',
    title: 'Standard ×',
    titleAccent: 'AI',
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

/* ── Call Card (editorial sheet) ───────────────────────── */
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
    <div
      className={dominant ? 'md:-my-6 md:scale-[1.04] z-10' : ''}
      style={{
        background: dominant ? ink : paper,
        color: dominant ? paper : ink,
        border: `1.5px solid ${ink}`,
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {dominant && (
        <div
          style={{
            background: blue, color: ink, textAlign: 'center',
            fontFamily: body, fontSize: 10, fontWeight: 800,
            letterSpacing: '0.22em', textTransform: 'uppercase',
            padding: '8px 12px',
          }}
        >
          ★ Flagship Monthly Call
        </div>
      )}

      {/* Cameras required bar */}
      <div
        style={{
          background: dominant ? paper : ink,
          color: dominant ? ink : paper,
          textAlign: 'center',
          fontFamily: body, fontSize: 11, fontWeight: 800,
          letterSpacing: '0.22em', textTransform: 'uppercase',
          padding: '10px 12px',
        }}
      >
        ▶ Cameras Required For Entry
      </div>

      {/* Header strip with index */}
      <div
        style={{
          padding: '18px 24px 16px',
          borderBottom: `1px solid ${dominant ? `${paper}33` : ink}`,
          display: 'flex', alignItems: 'baseline', justifyContent: 'space-between',
        }}
      >
        <span style={{
          fontFamily: editorial, fontSize: 14,
          opacity: dominant ? 0.5 : 0.4, letterSpacing: '-0.01em',
        }}>
          / {call.index}
        </span>
        <span style={{
          fontFamily: body, fontSize: 10, fontWeight: 700,
          letterSpacing: '0.18em', textTransform: 'uppercase',
          color: dominant ? blue : ink, opacity: dominant ? 1 : 0.7,
        }}>
          {call.cadenceLabel}
        </span>
      </div>

      {/* Body */}
      <div style={{ padding: dominant ? '28px 24px 24px' : '24px 24px 20px', flex: 1, display: 'flex', flexDirection: 'column' }}>
        <h2 style={{
          fontFamily: display,
          fontSize: dominant ? 'clamp(32px, 3.6vw, 44px)' : 'clamp(26px, 2.6vw, 32px)',
          lineHeight: 0.92, letterSpacing: '-0.015em',
          textTransform: 'uppercase', margin: 0, fontWeight: 400,
        }}>
          {call.title}<br />
          <span style={{ color: blue }}>{call.titleAccent}</span>
        </h2>

        <p style={{
          fontFamily: body, fontSize: 14, lineHeight: 1.55,
          opacity: dominant ? 0.8 : 0.7,
          margin: '14px 0 22px', flex: 1,
        }}>
          {call.tagline}
        </p>

        {/* Next meeting strip */}
        <div style={{
          borderTop: `1px solid ${dominant ? `${paper}33` : ink}`,
          borderBottom: `1px solid ${dominant ? `${paper}33` : ink}`,
          padding: '14px 0', marginBottom: 14,
        }}>
          <div style={{
            fontFamily: body, fontSize: 10, fontWeight: 700,
            letterSpacing: '0.18em', textTransform: 'uppercase',
            opacity: 0.5, marginBottom: 4,
          }}>
            Next Meeting
          </div>
          <div style={{
            fontFamily: editorial, fontSize: 16, lineHeight: 1.2,
            letterSpacing: '-0.005em', textTransform: 'uppercase',
          }}>
            {dateLine}
            {occ.isOverride && (
              <span style={{ color: blue, marginLeft: 8 }}>· Special</span>
            )}
          </div>
        </div>

        {/* Meeting ID */}
        <button
          onClick={copyId}
          style={{
            background: 'transparent', border: 'none', padding: 0, cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            width: '100%', textAlign: 'left', marginBottom: 22,
          }}
          aria-label="Copy meeting ID"
        >
          <div>
            <div style={{
              fontFamily: body, fontSize: 10, fontWeight: 700,
              letterSpacing: '0.18em', textTransform: 'uppercase',
              opacity: 0.5, marginBottom: 4,
            }}>
              Meeting ID
            </div>
            <div className="select-all" style={{
              fontFamily: body, fontSize: 15, fontWeight: 600, letterSpacing: '0.04em',
            }}>
              {call.meetingId}
            </div>
          </div>
          <Copy className="w-4 h-4" style={{ opacity: copied ? 1 : 0.5, color: copied ? blue : 'currentColor' }} />
        </button>

        {/* CTA */}
        <a
          href={call.registerUrl}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            fontFamily: body, fontSize: 13, fontWeight: 700,
            letterSpacing: '0.14em', textTransform: 'uppercase',
            textDecoration: 'none',
            padding: dominant ? '18px 24px' : '16px 22px',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12,
            background: dominant ? blue : ink,
            color: dominant ? ink : paper,
            transition: 'all .25s',
          }}
          className="hover:opacity-90"
        >
          Register on Zoom
          <ArrowUpRight className="w-5 h-5" />
        </a>
      </div>
    </div>
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
    <div style={{ background: paper, color: ink, fontFamily: body, minHeight: '100vh' }}>
      <BoldNav />

      {/* Hero */}
      <section style={{ background: paper, paddingTop: 56 + 24, paddingBottom: 48, position: 'relative', overflow: 'hidden' }}>
        <div className="px-6 md:px-10 max-w-[1440px] mx-auto">
          <Reveal>
            <p style={{
              fontFamily: body, fontSize: 12, fontWeight: 600, letterSpacing: '0.18em',
              color: ink, textTransform: 'uppercase', marginBottom: 24,
            }}>
              / Monthly Recurring Calls
            </p>
          </Reveal>

          <Reveal>
            <h1 style={{
              fontFamily: display,
              fontSize: 'clamp(56px, 12vw, 200px)',
              lineHeight: 0.86, letterSpacing: '-0.02em',
              color: ink, margin: 0, textTransform: 'uppercase', fontWeight: 400,
            }}>
              THE<br />
              <span className="md:pl-[6vw] inline-block">STANDARD</span><br />
              <span style={{ color: blue }}>CADENCE.</span>
            </h1>
          </Reveal>

          <div className="grid grid-cols-12 gap-6 mt-10">
            <Reveal delay={0.2} className="col-span-12 md:col-span-7">
              <p style={{
                fontFamily: body, fontSize: 'clamp(15px, 1.5vw, 18px)',
                lineHeight: 1.55, color: ink, opacity: 0.8, maxWidth: 640,
              }}>
                Register once per Zoom — you'll get a calendar invite and reminders for every future session. Bookmark this page so you can always find your way back.
              </p>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Marquee strip */}
      <div style={{
        background: ink, color: paper, padding: '14px 0',
        borderTop: `1px solid ${ink}`, borderBottom: `1px solid ${ink}`,
        overflow: 'hidden', whiteSpace: 'nowrap',
      }}>
        <div style={{
          fontFamily: editorial, fontSize: 16, letterSpacing: '0.05em',
          textTransform: 'uppercase', textAlign: 'center',
        }}>
          BOARDROOM <span style={{ color: blue }}>●</span> AGENCYBRAIN <span style={{ color: blue }}>●</span> AI <span style={{ color: blue }}>●</span> EVERY MONTH <span style={{ color: blue }}>●</span> SHOW UP <span style={{ color: blue }}>●</span>
        </div>
      </div>

      {/* 3-up call grid */}
      <section style={{ background: paper, padding: '80px 24px 60px' }}>
        <div className="max-w-[1280px] mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-5 md:items-center">
            {CALLS.map((c, i) => (
              <Reveal key={c.id} delay={i * 0.08}>
                <CallCard call={c} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Personal room — editorial wide card */}
      <section style={{ background: paper, padding: '40px 24px 120px', borderTop: `1px solid ${ink}` }}>
        <div className="max-w-[1280px] mx-auto">
          <Reveal>
            <p style={{
              fontFamily: body, fontSize: 12, fontWeight: 600, letterSpacing: '0.18em',
              color: ink, textTransform: 'uppercase', marginBottom: 24, marginTop: 24,
            }}>
              / Drop-in · 1-on-1
            </p>
          </Reveal>

          <Reveal delay={0.1}>
            <div
              style={{
                background: ink, color: paper,
                border: `1.5px solid ${ink}`,
                padding: '36px 28px',
              }}
              className="grid grid-cols-12 gap-6 items-center"
            >
              <div className="col-span-12 md:col-span-8">
                <p style={{
                  fontFamily: body, fontSize: 11, fontWeight: 700,
                  letterSpacing: '0.18em', textTransform: 'uppercase',
                  color: blue, marginBottom: 12,
                }}>
                  04 / Personal Meeting Room
                </p>
                <h3 style={{
                  fontFamily: display, fontSize: 'clamp(32px, 5vw, 60px)',
                  lineHeight: 0.92, letterSpacing: '-0.015em',
                  textTransform: 'uppercase', color: paper, margin: 0, fontWeight: 400,
                }}>
                  Justin's <span style={{ color: blue }}>standard</span><br />meeting room.
                </h3>

                <button
                  onClick={copyPMI}
                  className="inline-flex items-center gap-2 mt-5"
                  style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: 0, color: paper }}
                  aria-label="Copy PMI"
                >
                  <span style={{
                    fontFamily: body, fontSize: 11, fontWeight: 700,
                    letterSpacing: '0.18em', textTransform: 'uppercase', opacity: 0.6,
                  }}>
                    PMI
                  </span>
                  <span className="select-all" style={{
                    fontFamily: editorial, fontSize: 22, letterSpacing: '0.02em',
                  }}>
                    {PERSONAL_ROOM.pmi}
                  </span>
                  <Copy className="w-4 h-4" style={{ color: copied ? blue : `${paper}99` }} />
                </button>
              </div>

              <div className="col-span-12 md:col-span-4 flex md:justify-end">
                <a
                  href={PERSONAL_ROOM.joinUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    fontFamily: body, fontSize: 13, fontWeight: 700,
                    letterSpacing: '0.14em', textTransform: 'uppercase',
                    textDecoration: 'none',
                    padding: '18px 28px',
                    background: blue, color: ink,
                    display: 'inline-flex', alignItems: 'center', gap: 10,
                    transition: 'all .25s',
                  }}
                  className="hover:opacity-90"
                >
                  Join Justin's Room
                  <ArrowUpRight className="w-5 h-5" />
                </a>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ background: ink, color: paper, padding: '32px 24px' }}>
        <p style={{
          fontFamily: body, fontSize: 11, opacity: 0.5,
          letterSpacing: '0.14em', textAlign: 'center', textTransform: 'uppercase',
        }}>
          © {new Date().getFullYear()} Standard Playbook Inc. All Rights Reserved.
        </p>
      </footer>
    </div>
  );
};

export default Calls;
