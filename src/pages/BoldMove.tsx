import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import { ArrowRight, Volume2 } from 'lucide-react';

import BoldNav from '@/components/BoldNav';

/* ── Type stacks ───────────────────────────────────────── */
const display = '"Anton", "Archivo Black", "Oswald", Impact, sans-serif';
const body = 'Inter, -apple-system, BlinkMacSystemFont, "Helvetica Neue", Arial, sans-serif';

/* ── Brand colors ──────────────────────────────────────── */
const ink = '#0A0A0B';
const paper = '#F4F2EE';
const standardRed = '#E5484D';

const VIDEO_SRC = '/video/brands-commercial.mp4';
const VIDEO_POSTER = '/video/brands-commercial-poster.jpg';

/* ══════════════════════════════════════════════════════
   THE THREE DOORS — same order, copy and look as the film's end card
   ══════════════════════════════════════════════════════ */
type Door = {
  id: string;
  name: string;
  logo: string;
  logoWidth: number;
  descriptor: string;
  url: string;
  href: string;
  internal?: boolean;
  bg: string;
  fg: string;
  accent: string;
  border: string;
};

const doors: Door[] = [
  {
    id: 'standard-playbook',
    name: 'Standard Playbook',
    logo: '/brands/standard-playbook.png',
    logoWidth: 250,
    descriptor: 'High-performance coaching for insurance agency owners.',
    url: 'standardplaybook.com',
    href: '/',
    internal: true,
    bg: '#E4E0D8',
    fg: ink,
    accent: ink,
    border: ink,
  },
  {
    id: 'agency-brain',
    name: 'Agency Brain',
    logo: '/brands/agency-brain.png',
    logoWidth: 250,
    descriptor: 'The agency operating system',
    url: 'myagencybrain.com/info',
    href: 'https://myagencybrain.com/info',
    bg: '#0A0A0A',
    fg: '#FAFAFA',
    accent: '#EF4444',
    border: '#0A0A0A',
  },
  {
    id: 'live-call-coach',
    name: 'Live Call Coach',
    logo: '/brands/live-call-coach.png',
    logoWidth: 270,
    descriptor: 'Live coaching for insurance calls',
    url: 'livecallcoach.ai',
    href: 'https://livecallcoach.ai',
    bg: '#0A0A0A',
    fg: '#FAFAFA',
    accent: '#E8792B',
    border: '#E8792B',
  },
];

/* ── Hero video ────────────────────────────────────────── */
const HeroVideo = ({ onEnded }: { onEnded: () => void }) => {
  const ref = useRef<HTMLVideoElement>(null);
  const reduceMotion = useReducedMotion();
  const [muted, setMuted] = useState(true);

  // Autoplay muted (the only autoplay browsers allow). Skip autoplay for reduced-motion users.
  useEffect(() => {
    const v = ref.current;
    if (!v || reduceMotion) return;
    v.muted = true;
    v.play().catch(() => {});
  }, [reduceMotion]);

  const playWithSound = () => {
    const v = ref.current;
    if (!v) return;
    v.muted = false;
    setMuted(false);
    v.currentTime = 0;
    v.play().catch(() => {});
  };

  return (
    <div
      style={{
        position: 'relative',
        background: ink,
        padding: 'clamp(4px, 0.8vw, 10px)',
        boxShadow: '0 40px 80px -24px rgba(0,0,0,0.55)',
      }}
    >
      <div style={{ position: 'relative', width: '100%', aspectRatio: '16 / 9', background: '#000', overflow: 'hidden' }}>
        <video
          ref={ref}
          src={VIDEO_SRC}
          poster={VIDEO_POSTER}
          muted
          playsInline
          controls
          preload="auto"
          title="Standard Playbook, Agency Brain and Live Call Coach"
          onVolumeChange={(e) => setMuted(e.currentTarget.muted)}
          onEnded={onEnded}
          className="absolute inset-0 w-full h-full"
          style={{ border: 0, objectFit: 'cover' }}
        />
        {muted && (
          <button
            type="button"
            onClick={playWithSound}
            data-cta="move-video-sound"
            className="absolute flex items-center gap-2 hover:opacity-90 transition-opacity"
            style={{
              top: 'clamp(10px, 2vw, 22px)',
              right: 'clamp(10px, 2vw, 22px)',
              background: standardRed,
              color: '#fff',
              fontFamily: body,
              fontWeight: 700,
              fontSize: 'clamp(12px, 1.2vw, 15px)',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              padding: 'clamp(8px, 1vw, 12px) clamp(12px, 1.4vw, 18px)',
              border: 'none',
              cursor: 'pointer',
              boxShadow: '0 8px 24px -8px rgba(0,0,0,0.6)',
            }}
          >
            <Volume2 size={16} strokeWidth={2.5} />
            <span className="hidden sm:inline">Watch with sound</span>
            <span className="sm:hidden">Sound</span>
          </button>
        )}
      </div>
    </div>
  );
};

/* ── One door (a full-width row button) ────────────────── */
const DoorRow = ({ door, index, highlight }: { door: Door; index: number; highlight: boolean }) => {
  const content = (
    <div
      className="group flex flex-col md:flex-row md:items-center md:justify-between gap-5 md:gap-8 transition-transform duration-300 hover:-translate-y-1"
      style={{
        position: 'relative',
        background: door.bg,
        color: door.fg,
        border: `2px solid ${door.border}`,
        padding: 'clamp(22px, 3vw, 36px) clamp(20px, 3vw, 44px)',
        boxShadow: highlight ? `0 0 0 3px ${standardRed}, 0 18px 40px -18px rgba(0,0,0,0.5)` : '0 18px 40px -22px rgba(0,0,0,0.45)',
        transitionProperty: 'transform, box-shadow',
      }}
    >
      {/* The Standard Line on top of every door, as in the film */}
      <span
        aria-hidden
        style={{
          position: 'absolute', left: -2, right: -2, top: -2, height: 6,
          background: standardRed, boxShadow: '0 0 14px rgba(229,72,77,0.55)',
        }}
      />
      <div className="flex flex-col gap-3">
        {/* The SP lockup has white letters, so it sits in an ink band as on the site and in the film */}
        <span
          className="self-start"
          style={door.internal ? { background: ink, padding: '8px 12px', lineHeight: 0 } : { lineHeight: 0 }}
        >
          <img
            src={door.logo}
            alt={door.name}
            style={{ width: door.logoWidth, maxWidth: '70vw', height: 'auto' }}
          />
        </span>
        <p
          style={{
            fontFamily: body,
            fontSize: door.internal ? 16 : 13,
            fontWeight: door.internal ? 500 : 600,
            letterSpacing: door.internal ? '0' : '0.18em',
            textTransform: door.internal ? 'none' : 'uppercase',
            color: door.internal ? '#2B2B2E' : door.accent === '#EF4444' ? '#C9C9CC' : door.accent,
            maxWidth: 420,
          }}
        >
          {door.descriptor}
        </p>
      </div>
      <div className="flex items-center gap-4 md:gap-5">
        <span
          style={{
            fontFamily: body,
            fontWeight: 700,
            fontSize: 'clamp(19px, 3.2vw, 44px)',
            letterSpacing: '-0.02em',
            lineHeight: 1.05,
            whiteSpace: 'nowrap',
          }}
        >
          {door.url}
        </span>
        <span
          className="shrink-0 flex items-center justify-center transition-transform duration-300 group-hover:translate-x-1"
          style={{
            width: 'clamp(40px, 4vw, 56px)',
            height: 'clamp(40px, 4vw, 56px)',
            background: door.internal ? ink : door.accent === '#EF4444' ? '#FAFAFA' : door.accent,
            color: door.internal ? paper : ink,
          }}
        >
          <ArrowRight size={24} strokeWidth={2.5} />
        </span>
      </div>
    </div>
  );

  const cta = `move-${door.id}`;
  const label = `Go to ${door.name} at ${door.url}`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.6, delay: 0.08 * index, ease: [0.22, 1, 0.36, 1] }}
    >
      {door.internal ? (
        <Link to={door.href} data-cta={cta} aria-label={label} className="block focus-visible:outline-offset-4">
          {content}
        </Link>
      ) : (
        <a href={door.href} data-cta={cta} aria-label={label} className="block focus-visible:outline-offset-4">
          {content}
        </a>
      )}
    </motion.div>
  );
};

/* ══════════════════════════════════════════════════════
   PAGE
   ══════════════════════════════════════════════════════ */
const BoldMove = () => {
  const [ended, setEnded] = useState(false);
  const doorsRef = useRef<HTMLDivElement>(null);

  const handleEnded = () => {
    setEnded(true);
    const el = doorsRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    // Bring the doors into view when the film finishes, unless they are already on screen.
    if (rect.top > window.innerHeight * 0.75) {
      window.scrollTo({ top: window.scrollY + rect.top - 96, behavior: 'smooth' });
    }
  };

  return (
    <div style={{ background: paper, color: ink, fontFamily: body, minHeight: '100vh' }}>
      <BoldNav />

      <main style={{ paddingTop: 56 }}>
        {/* ── Hero: the film ── */}
        <section className="px-4 md:px-10" style={{ paddingTop: 'clamp(28px, 5vw, 64px)' }}>
          <div className="max-w-[1280px] mx-auto">
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              style={{
                fontSize: 12,
                fontWeight: 600,
                letterSpacing: '0.18em',
                textTransform: 'uppercase',
                marginBottom: 18,
              }}
            >
              <span style={{ color: '#1B6FC2' }}>/</span> Justin Harkelroad
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            >
              <HeroVideo onEnded={handleEnded} />
            </motion.div>
          </div>
        </section>

        {/* ── The three doors ── */}
        <section
          className="px-4 md:px-10"
          style={{ paddingTop: 'clamp(48px, 7vw, 96px)', paddingBottom: 'clamp(64px, 8vw, 120px)' }}
        >
          <div ref={doorsRef} className="max-w-[1280px] mx-auto">
            <h1
              style={{
                fontFamily: display,
                fontSize: 'clamp(48px, 9.5vw, 132px)',
                lineHeight: 0.92,
                letterSpacing: '-0.01em',
                textTransform: 'uppercase',
                marginBottom: 'clamp(24px, 3.5vw, 44px)',
              }}
            >
              Pick your next move.
            </h1>
            <div className="flex flex-col gap-5 md:gap-6">
              {doors.map((d, i) => (
                <DoorRow key={d.id} door={d} index={i} highlight={ended} />
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer style={{ borderTop: `1px solid ${ink}`, padding: '24px 16px', textAlign: 'center' }}>
        <p style={{ fontSize: 11, letterSpacing: '0.16em', textTransform: 'uppercase', color: '#4A4A4F' }}>
          © 2026 Standard Playbook Inc. All rights reserved.
        </p>
      </footer>
    </div>
  );
};

export default BoldMove;
