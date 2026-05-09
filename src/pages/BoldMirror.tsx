import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Facebook, Linkedin } from 'lucide-react';
import standardLogo from '@/assets/standard-word-logo.png';
import mirrorCoverImg from '@/assets/mirror-cover.png';

const display = '"Anton", "Archivo Black", "Oswald", Impact, sans-serif';
const editorial = '"Archivo Black", "Anton", Impact, sans-serif';
const body = 'Inter, -apple-system, BlinkMacSystemFont, "Helvetica Neue", Arial, sans-serif';

const ink = '#0A0A0B';
const paper = '#F4F2EE';
const blue = '#2080FF';

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

/* ══════════════════════════════════════════════════════
   LOGO HEADER (no nav — ad landing)
   ══════════════════════════════════════════════════════ */
const LogoHeader = () => (
  <header
    style={{
      background: paper,
      padding: '20px 24px',
      borderBottom: `1px solid ${ink}`,
      position: 'sticky', top: 0, zIndex: 50,
    }}
    className="flex items-center justify-center"
  >
    <Link to="/" aria-label="Standard Playbook">
      <img src={standardLogo} alt="Standard Playbook"
        style={{ height: 22, filter: 'brightness(0)' }} />
    </Link>
  </header>
);

/* ══════════════════════════════════════════════════════
   HERO
   ══════════════════════════════════════════════════════ */
const Hero = ({ onStart }: { onStart: () => void }) => (
  <section style={{ background: paper, paddingTop: 60, paddingBottom: 80, position: 'relative', overflow: 'hidden' }}>
    <div className="px-6 md:px-10 max-w-[1440px] mx-auto relative">
      <Reveal>
        <p style={{
          fontFamily: body, fontSize: 12, fontWeight: 600, letterSpacing: '0.18em',
          color: ink, textTransform: 'uppercase', marginBottom: 24,
        }}>
          / Free Agency Assessment
        </p>
      </Reveal>

      <div className="grid grid-cols-12 gap-6 items-start">
        <Reveal className="col-span-12 relative z-20">
          <h1 style={{
            fontFamily: display,
            fontSize: 'clamp(56px, 14vw, 240px)',
            lineHeight: 0.86, letterSpacing: '-0.02em',
            color: ink, margin: 0, textTransform: 'uppercase', fontWeight: 400,
          }}>
            SCORE YOUR<br />
            <span className="md:pl-[6vw] inline-block">AGENCY</span><br />
            <span className="md:pl-[14vw] inline-block" style={{ color: blue }}>HONESTLY.</span>
          </h1>
        </Reveal>
      </div>

      <div className="grid grid-cols-12 gap-6 mt-12">
        <Reveal delay={0.2} className="col-span-12 md:col-span-7">
          <p style={{
            fontFamily: body, fontSize: 'clamp(16px, 1.6vw, 20px)', fontWeight: 400, lineHeight: 1.55,
            color: ink, opacity: 0.85, maxWidth: 680,
          }}>
            5 pillars. 32 subcategories. One number that tells you the truth. Most agency owners score under 100.
          </p>
        </Reveal>
        <Reveal delay={0.3} className="col-span-12 md:col-span-5 flex md:justify-end items-start gap-3 flex-wrap">
          <a href="#how-it-works"
            style={{
              fontFamily: body, fontSize: 13, fontWeight: 600, letterSpacing: '0.12em',
              color: ink, textTransform: 'uppercase', textDecoration: 'none',
              padding: '14px 26px', border: `1.5px solid ${ink}`, transition: 'all .25s',
            }}
            className="hover:bg-black hover:text-white">
            Learn More
          </a>
          <button onClick={onStart}
            style={{
              fontFamily: body, fontSize: 13, fontWeight: 700, letterSpacing: '0.12em',
              color: '#fff', background: ink, textTransform: 'uppercase',
              padding: '15px 28px', border: `1.5px solid ${ink}`, cursor: 'pointer', transition: 'all .25s',
            }}
            className="hover:bg-[#2080FF] hover:border-[#2080FF]">
            Start Scoring →
          </button>
        </Reveal>
      </div>
    </div>
  </section>
);

/* ══════════════════════════════════════════════════════
   MARQUEE
   ══════════════════════════════════════════════════════ */
const Marquee = ({ rotate = -3, bg = ink, color = paper, dot = blue, phrase = 'THE MIRROR · 32 QUESTIONS · 5 PILLARS · ONE HONEST SCORE' }: { rotate?: number; bg?: string; color?: string; dot?: string; phrase?: string }) => (
  <div style={{
    background: bg, color, transform: `rotate(${rotate}deg)`,
    padding: '14px 0', whiteSpace: 'nowrap', overflow: 'hidden',
    width: '120%', marginLeft: '-10%',
    borderTop: `1px solid ${color}33`, borderBottom: `1px solid ${color}33`,
  }}>
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: 28, animation: 'sp-marquee 32s linear infinite' }}>
      {Array.from({ length: 14 }).map((_, i) => (
        <span key={i} style={{ display: 'inline-flex', alignItems: 'center', gap: 28 }}>
          <span style={{ fontFamily: editorial, fontSize: 'clamp(22px, 3.4vw, 44px)', letterSpacing: '0.04em', fontWeight: 400 }}>{phrase}</span>
          <span aria-hidden style={{ display: 'inline-block', width: 18, height: 18, borderRadius: 999, background: dot, flexShrink: 0 }} />
        </span>
      ))}
    </div>
  </div>
);

const MarqueeBands = ({ phrase }: { phrase?: string }) => (
  <div style={{ background: paper, padding: '40px 0', position: 'relative', overflow: 'hidden' }}>
    <Marquee rotate={-3} bg={ink} color={paper} dot={blue} phrase={phrase} />
    <div style={{ marginTop: -24 }}>
      <Marquee rotate={2.5} bg={paper} color={ink} dot={ink} phrase={phrase} />
    </div>
    <style>{`
      @keyframes sp-marquee {
        from { transform: translateX(0); }
        to { transform: translateX(-50%); }
      }
    `}</style>
  </div>
);

/* ══════════════════════════════════════════════════════
   THE 5 PILLARS
   ══════════════════════════════════════════════════════ */
const pillars = [
  {
    num: '01',
    name: 'Culture & Team',
    detail: '10 subcategories. The people side — values, role specialization, recognition, recruiting.',
  },
  {
    num: '02',
    name: 'Systems & Rhythm',
    detail: '6 subcategories. The cadence — huddles, scoreboards, 1:1s, monthly recap.',
  },
  {
    num: '03',
    name: 'Training & Scripts',
    detail: '6 subcategories. The playbook — scripts, scoring calls, ongoing training, video vault.',
  },
  {
    num: '04',
    name: 'Marketing & Lead Flow',
    detail: '6 subcategories. The fuel — CRM discipline, marketing plan, lead distribution, follow-up.',
  },
  {
    num: '05',
    name: 'Owner Command',
    detail: '4 subcategories. The dashboard — new sale review, marketing ROI, commissions, cancellations.',
  },
];

const PillarsSection = () => (
  <section id="how-it-works" style={{ background: paper, padding: '40px 24px 120px', borderTop: `1px solid ${ink}` }}>
    <div className="max-w-[1280px] mx-auto">
      <div className="grid grid-cols-12 gap-6 items-end mb-16 mt-16">
        <Reveal className="col-span-12 md:col-span-8">
          <p style={{
            fontFamily: body, fontSize: 12, fontWeight: 600, letterSpacing: '0.18em',
            color: ink, textTransform: 'uppercase', marginBottom: 12,
          }}>
            / The Pillars
          </p>
          <h2 style={{
            fontFamily: display, fontSize: 'clamp(44px, 7vw, 100px)',
            lineHeight: 0.95, letterSpacing: '-0.01em', color: ink,
            textTransform: 'uppercase', margin: 0, fontWeight: 400,
          }}>
            FIVE PILLARS.<br />
            <span style={{ color: blue }}>ONE NUMBER.</span>
          </h2>
        </Reveal>
        <Reveal delay={0.1} className="col-span-12 md:col-span-4">
          <p style={{
            fontFamily: body, fontSize: 14, fontWeight: 400, lineHeight: 1.65,
            color: ink, opacity: 0.7,
          }}>
            Every agency runs on the same five pillars. The Mirror scores all 32 subcategories on a 1-5 scale and reveals which pillar is the bottleneck.
          </p>
        </Reveal>
      </div>

      <div style={{ borderTop: `1px solid ${ink}` }}>
        {pillars.map((p, i) => (
          <Reveal key={p.num} delay={i * 0.06}>
            <div style={{ borderBottom: `1px solid ${ink}`, padding: '36px 0' }}>
              <div className="grid grid-cols-12 gap-6 items-baseline">
                <div className="col-span-2 md:col-span-1">
                  <span style={{
                    fontFamily: editorial, fontSize: 'clamp(20px, 2vw, 26px)',
                    color: blue, letterSpacing: '-0.01em', fontWeight: 400,
                  }}>
                    {p.num}
                  </span>
                </div>
                <div className="col-span-10 md:col-span-6">
                  <h3 style={{
                    fontFamily: display, fontSize: 'clamp(28px, 4vw, 56px)',
                    lineHeight: 0.95, letterSpacing: '-0.01em', color: ink,
                    textTransform: 'uppercase', margin: 0, fontWeight: 400,
                  }}>
                    {p.name}
                  </h3>
                </div>
                <div className="col-span-12 md:col-span-5">
                  <p style={{
                    fontFamily: body, fontSize: 15, fontWeight: 400, lineHeight: 1.55,
                    color: ink, opacity: 0.75,
                  }}>
                    {p.detail}
                  </p>
                </div>
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </div>
  </section>
);

/* ══════════════════════════════════════════════════════
   WHAT YOU GET — display numerals grid
   ══════════════════════════════════════════════════════ */
const WhatYouGet = () => (
  <section style={{ background: ink, color: paper, padding: '120px 24px' }}>
    <div className="max-w-[1280px] mx-auto">
      <Reveal>
        <p style={{
          fontFamily: body, fontSize: 12, fontWeight: 600, letterSpacing: '0.18em',
          color: paper, opacity: 0.6, textTransform: 'uppercase', marginBottom: 24,
        }}>
          / What You Get
        </p>
      </Reveal>
      <Reveal delay={0.05}>
        <h2 style={{
          fontFamily: display, fontSize: 'clamp(36px, 6vw, 84px)',
          lineHeight: 0.95, letterSpacing: '-0.01em', color: paper,
          textTransform: 'uppercase', margin: 0, fontWeight: 400, marginBottom: 64,
        }}>
          A NUMBER.<br />A DIAGNOSIS.<br />
          <span style={{ color: blue }}>A NEXT MOVE.</span>
        </h2>
      </Reveal>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-0" style={{ borderTop: `1px solid ${paper}33` }}>
        {[
          { num: '01', title: 'Your Tier Score', detail: 'A single number out of 160 — Foundation, Developing, Established, Advanced, or Elite.' },
          { num: '02', title: 'Weakest Pillar', detail: 'Which of the 5 pillars is dragging your number down — and why.' },
          { num: '03', title: 'Full Mirror PDF', detail: 'The complete 32-subcategory breakdown emailed to you for reference.' },
          { num: '04', title: '7-Day Breakdown', detail: 'A personalized email sequence walking you through your tier × pillar in detail.' },
        ].map((item, i) => (
          <Reveal key={i} delay={i * 0.07}>
            <div style={{
              padding: '40px 24px',
              borderBottom: `1px solid ${paper}33`,
              borderRight: i % 2 === 0 ? `1px solid ${paper}33` : 'none',
            }}
              className={i % 2 === 0 ? 'md:!border-r' : ''}
            >
              <p style={{
                fontFamily: body, fontSize: 12, fontWeight: 700, letterSpacing: '0.16em',
                color: blue, textTransform: 'uppercase', marginBottom: 14,
              }}>
                {item.num}
              </p>
              <h3 style={{
                fontFamily: display, fontSize: 'clamp(28px, 4vw, 48px)',
                lineHeight: 0.95, letterSpacing: '-0.01em', color: paper,
                textTransform: 'uppercase', margin: 0, fontWeight: 400, marginBottom: 16,
              }}>
                {item.title}
              </h3>
              <p style={{
                fontFamily: body, fontSize: 15, fontWeight: 400, lineHeight: 1.55,
                color: paper, opacity: 0.75, maxWidth: 460,
              }}>
                {item.detail}
              </p>
            </div>
          </Reveal>
        ))}
      </div>
    </div>
  </section>
);

/* ══════════════════════════════════════════════════════
   AUTHORITY BLOCK — Justin positioning
   ══════════════════════════════════════════════════════ */
const AuthoritySection = () => (
  <section style={{ background: paper, padding: '120px 24px' }}>
    <div className="max-w-[1280px] mx-auto">
      <div className="grid grid-cols-12 gap-10 items-start">
        <Reveal className="col-span-12 md:col-span-5">
          <div style={{
            background: '#fff', padding: '14px 14px 22px', maxWidth: 360,
            transform: 'rotate(-4deg)',
            boxShadow: '0 30px 60px -20px rgba(0,0,0,0.45)',
            transition: 'transform .4s ease',
            margin: '0 auto',
          }}
            className="hover:!rotate-0">
            <div style={{ aspectRatio: '4/5', background: '#0A0A0B', overflow: 'hidden' }}>
              <img src={mirrorCoverImg} alt="The Mirror Workbook"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
            <p style={{
              fontFamily: body, fontSize: 11, fontWeight: 600, letterSpacing: '0.12em',
              color: ink, textTransform: 'uppercase', marginTop: 12, textAlign: 'center', opacity: 0.7,
            }}>
              The Mirror · Workbook · Vol. 01
            </p>
          </div>
        </Reveal>

        <Reveal delay={0.15} className="col-span-12 md:col-span-7">
          <p style={{
            fontFamily: body, fontSize: 12, fontWeight: 600, letterSpacing: '0.18em',
            color: ink, textTransform: 'uppercase', marginBottom: 24,
          }}>
            / Built By An Operator
          </p>
          <h2 style={{
            fontFamily: display, fontSize: 'clamp(36px, 5.4vw, 72px)',
            lineHeight: 0.95, letterSpacing: '-0.01em', color: ink,
            textTransform: 'uppercase', margin: 0, fontWeight: 400, marginBottom: 24,
          }}>
            THE MIRROR IS THE MIRROR.
          </h2>
          <p style={{
            fontFamily: body, fontSize: 'clamp(16px, 1.4vw, 18px)', fontWeight: 400, lineHeight: 1.6,
            color: ink, opacity: 0.85, maxWidth: 620,
          }}>
            I spent 20 years inside Allstate building, breaking, and rebuilding agencies. The Mirror is the diagnostic I run on every agency I sit down with — same 32 subcategories, same scoring discipline, same honest number. No coaching pitch. Just the truth about where you're at.
          </p>
        </Reveal>
      </div>
    </div>
  </section>
);

/* ══════════════════════════════════════════════════════
   GIANT CTA — SCORE.
   ══════════════════════════════════════════════════════ */
const GiantCTA = ({ onStart }: { onStart: () => void }) => (
  <section onClick={onStart}
    style={{
      background: ink, padding: '100px 24px 70px',
      cursor: 'pointer', borderTop: `1px solid ${ink}`,
    }}
    role="button" aria-label="Start scoring">
    <div className="max-w-[1440px] mx-auto text-center">
      <Reveal>
        <p style={{
          fontFamily: body, fontSize: 12, fontWeight: 600, letterSpacing: '0.18em',
          color: paper, opacity: 0.5, textTransform: 'uppercase', marginBottom: 24,
        }}>
          / Take The Assessment
        </p>
      </Reveal>
      <Reveal delay={0.05}>
        <h2 style={{
          fontFamily: display, fontSize: 'clamp(72px, 22vw, 360px)',
          lineHeight: 0.82, letterSpacing: '-0.03em', color: paper,
          textTransform: 'uppercase', margin: 0, fontWeight: 400,
        }}>
          SCORE.
        </h2>
      </Reveal>
      <Reveal delay={0.15}>
        <p style={{
          fontFamily: body, fontSize: 14, fontWeight: 500, letterSpacing: '0.06em',
          color: paper, opacity: 0.7, marginTop: 32, textTransform: 'uppercase',
        }}>
          Click anywhere &nbsp;→&nbsp; 32 questions · 6 minutes · honest number
        </p>
      </Reveal>
    </div>
  </section>
);

/* ══════════════════════════════════════════════════════
   FOOTER
   ══════════════════════════════════════════════════════ */
const BoldFooter = () => (
  <footer style={{ background: ink, color: paper, padding: '60px 24px 30px' }}>
    <div className="max-w-[1280px] mx-auto">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-10 pb-12" style={{ borderBottom: `1px solid ${paper}1a` }}>
        <div className="col-span-2">
          <img src={standardLogo} alt="Standard Playbook"
            style={{ height: 22, filter: 'brightness(0) invert(1)', marginBottom: 18 }} />
          <p style={{
            fontFamily: body, fontSize: 16, lineHeight: 1.5, marginBottom: 22,
            maxWidth: 380, opacity: 0.85,
          }}>
            High-performance coaching for insurance agency owners. Raise your standard and live the playbook.
          </p>
          <div className="flex items-center gap-4">
            <a href="https://www.facebook.com/profile.php?id=61560049427918"
              target="_blank" rel="noopener noreferrer" aria-label="Facebook"
              style={{ color: paper, opacity: 0.6, transition: 'opacity 0.2s' }}
              className="hover:opacity-100">
              <Facebook className="w-5 h-5" />
            </a>
            <a href="https://www.linkedin.com/in/justinhark/"
              target="_blank" rel="noopener noreferrer" aria-label="LinkedIn"
              style={{ color: paper, opacity: 0.6, transition: 'opacity 0.2s' }}
              className="hover:opacity-100">
              <Linkedin className="w-5 h-5" />
            </a>
          </div>
        </div>

        {[
          { title: 'Programs', items: [
            { label: 'Boardroom', href: '/#programs' },
            { label: 'Directive', href: '/directive' },
            { label: '8-Week', href: '/sales-experience' },
            { label: 'Training', href: '/training' },
          ]},
          { title: 'Company', items: [
            { label: 'About', href: '/about' },
            { label: 'Contact', href: '/contact' },
            { label: 'Privacy', href: '/privacy' },
            { label: 'Terms', href: '/terms' },
          ]},
        ].map((col) => (
          <div key={col.title}>
            <p style={{
              fontFamily: body, fontSize: 12, fontWeight: 600, letterSpacing: '0.16em',
              opacity: 0.5, textTransform: 'uppercase', marginBottom: 14,
            }}>
              {col.title}
            </p>
            <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
              {col.items.map((it) => (
                <li key={it.label} style={{ marginBottom: 8 }}>
                  <Link to={it.href} style={{ fontFamily: body, fontSize: 14, color: paper, opacity: 0.85, textDecoration: 'none' }} className="hover:opacity-100">
                    {it.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="pt-8 text-center">
        <p style={{ fontFamily: body, fontSize: 11, opacity: 0.5, letterSpacing: '0.08em' }}>
          © {new Date().getFullYear()} STANDARD PLAYBOOK INC. ALL RIGHTS RESERVED.
        </p>
      </div>
    </div>
  </footer>
);

/* ══════════════════════════════════════════════════════
   MOBILE STICKY CTA
   ══════════════════════════════════════════════════════ */
const MobileStickyCTA = ({ onStart }: { onStart: () => void }) => (
  <div className="fixed bottom-0 left-0 right-0 md:hidden z-40"
    style={{ background: ink, padding: '12px 16px', borderTop: `1px solid ${paper}33` }}>
    <button onClick={onStart}
      style={{
        fontFamily: body, fontSize: 13, fontWeight: 700, letterSpacing: '0.14em',
        color: ink, background: paper, padding: '14px 0', width: '100%',
        border: 'none', cursor: 'pointer', textTransform: 'uppercase',
      }}>
      Start Scoring
    </button>
  </div>
);

/* ══════════════════════════════════════════════════════
   PAGE
   ══════════════════════════════════════════════════════ */
const BoldMirror = () => {
  const navigate = useNavigate();

  // Persist UTMs from URL into sessionStorage so they survive the assessment flow.
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const params = new URLSearchParams(window.location.search);
    const utmKeys = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content'];
    const utms: Record<string, string> = {};
    let any = false;
    utmKeys.forEach((k) => {
      const v = params.get(k);
      if (v) { utms[k] = v; any = true; }
    });
    if (any) {
      try { sessionStorage.setItem('mirror_utms', JSON.stringify(utms)); } catch {}
    }
    // Meta Pixel PageView
    try { (window as any).fbq?.('track', 'PageView'); } catch {}
  }, []);

  const onStart = () => navigate('/mirror/score');

  return (
    <div style={{ background: paper, fontFamily: body, color: ink }}>
      <LogoHeader />
      <Hero onStart={onStart} />
      <MarqueeBands phrase="THE MIRROR · 32 QUESTIONS · 5 PILLARS · ONE HONEST SCORE" />
      <PillarsSection />
      <WhatYouGet />
      <AuthoritySection />
      <MarqueeBands phrase="MOST AGENCIES SCORE UNDER 100 · WHERE WILL YOU LAND" />
      <GiantCTA onStart={onStart} />
      <BoldFooter />
      <MobileStickyCTA onStart={onStart} />
    </div>
  );
};

export default BoldMirror;
