import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Facebook, Linkedin } from 'lucide-react';
import BoldNav from '@/components/BoldNav';
import ContentMeta from '@/components/ContentMeta';

import standardLogo from '@/assets/standard-word-logo.png';
import agencyBrainLogo from '@/assets/agency-brain-logo.png';
import profileImg from '@/assets/profile-image.png';

/* ── Bold editorial type stack ─────────────────────────── */
const display = '"Anton", "Archivo Black", "Oswald", Impact, sans-serif';
const editorial = '"Archivo Black", "Anton", Impact, sans-serif';
const body = 'Inter, -apple-system, BlinkMacSystemFont, "Helvetica Neue", Arial, sans-serif';

/* ── Brand colors ──────────────────────────────────────── */
const ink = '#0A0A0B';
const paper = '#F4F2EE';
const blue = '#2997FF';

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

/* ══════════════════════════════════════════════════════
   HERO
   ══════════════════════════════════════════════════════ */
const Hero = () => (
  <section style={{ background: paper, paddingTop: 56 + 24, paddingBottom: 60, position: 'relative', overflow: 'hidden' }}>
    <div className="px-6 md:px-10 max-w-[1440px] mx-auto relative">
      <Reveal>
        <p style={{
          fontFamily: body, fontSize: 12, fontWeight: 600, letterSpacing: '0.18em',
          color: ink, textTransform: 'uppercase', marginBottom: 24,
        }}>
          / About
        </p>
      </Reveal>

      <div className="grid grid-cols-12 gap-6 items-start relative">
        <Reveal className="col-span-12 md:col-span-9 relative z-20">
          <h1 style={{
            fontFamily: display,
            fontSize: 'clamp(48px, 12vw, 220px)',
            lineHeight: 0.86, letterSpacing: '-0.02em',
            color: ink, margin: 0, textTransform: 'uppercase', fontWeight: 400,
          }}>
            BUILT BY<br />
            <span className="md:pl-[6vw] inline-block">OPERATORS,</span><br />
            <span className="md:pl-[14vw] inline-block" style={{ color: blue }}>NOT GURUS.</span>
          </h1>
        </Reveal>

        <Reveal delay={0.15} className="col-span-12 md:col-span-3 relative z-10 mt-12 md:mt-0 max-w-[60%] md:max-w-none mx-auto md:mx-0">
          <motion.div
            initial={{ rotate: 6, y: 20 }}
            animate={{ rotate: 6 }}
            className="md:[transform:rotate(10deg)]"
            style={{
              position: 'relative', aspectRatio: '3 / 4',
              background: ink, overflow: 'hidden',
              boxShadow: '0 36px 70px -18px rgba(0,0,0,0.55)',
            }}>
            <img src={profileImg} alt="Justin Harkelroad"
              style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'grayscale(100%) contrast(1.1)' }} />
          </motion.div>
        </Reveal>
      </div>

      <div className="grid grid-cols-12 gap-6 mt-12">
        <Reveal delay={0.25} className="col-span-12 md:col-span-7">
          <p style={{
            fontFamily: body, fontSize: 'clamp(16px, 1.6vw, 20px)', fontWeight: 400, lineHeight: 1.55,
            color: ink, opacity: 0.85, maxWidth: 680,
          }}>
            We're not just another coaching company. We're the catalyst for elite agency owners who refuse to settle for ordinary results.
          </p>
        </Reveal>
        <Reveal delay={0.35} className="col-span-12 md:col-span-5 flex md:justify-end items-start gap-3 flex-wrap">
          <Link to="/#programs"
            style={{
              fontFamily: body, fontSize: 13, fontWeight: 600, letterSpacing: '0.12em',
              color: ink, textTransform: 'uppercase', textDecoration: 'none',
              padding: '14px 26px', border: `1.5px solid ${ink}`, transition: 'all .25s',
            }}
            className="hover:bg-black hover:text-white">
            See Programs
          </Link>
          <Link to="/contact"
            style={{
              fontFamily: body, fontSize: 13, fontWeight: 700, letterSpacing: '0.12em',
              color: '#fff', background: ink, textTransform: 'uppercase', textDecoration: 'none',
              padding: '15px 28px', border: `1.5px solid ${ink}`, transition: 'all .25s',
            }}
            className="hover:bg-[#2997FF] hover:border-[#2997FF]">
            Get In Touch
          </Link>
        </Reveal>
      </div>
    </div>
  </section>
);

/* ══════════════════════════════════════════════════════
   MARQUEE
   ══════════════════════════════════════════════════════ */
const Marquee = ({ rotate = -3, bg = ink, color = paper, dot = blue, phrase = 'STANDARD PLAYBOOK' }: { rotate?: number; bg?: string; color?: string; dot?: string; phrase?: string }) => (
  <div style={{
    background: bg, color, transform: `rotate(${rotate}deg)`,
    padding: '14px 0', whiteSpace: 'nowrap', overflow: 'hidden',
    width: '120%', marginLeft: '-10%',
    borderTop: `1px solid ${color}33`, borderBottom: `1px solid ${color}33`,
  }}>
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: 28, animation: 'sp-marquee 28s linear infinite' }}>
      {Array.from({ length: 20 }).map((_, i) => (
        <span key={i} style={{ display: 'inline-flex', alignItems: 'center', gap: 28 }}>
          <span style={{ fontFamily: editorial, fontSize: 'clamp(22px, 3.4vw, 44px)', letterSpacing: '0.04em', fontWeight: 400 }}>{phrase}</span>
          <span aria-hidden style={{ display: 'inline-block', width: 18, height: 18, borderRadius: 999, background: dot, flexShrink: 0 }} />
        </span>
      ))}
    </div>
  </div>
);

const MarqueeBands = () => (
  <div style={{ background: paper, padding: '40px 0', position: 'relative', overflow: 'hidden' }}>
    <Marquee rotate={-3} bg={ink} color={paper} dot={blue} phrase="FORT WAYNE · INDIANA" />
    <div style={{ marginTop: -24 }}>
      <Marquee rotate={2.5} bg={paper} color={ink} dot={ink} phrase="STANDARD PLAYBOOK" />
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
   FOUNDER
   ══════════════════════════════════════════════════════ */
const FounderSection = () => (
  <section style={{ background: paper, padding: '120px 24px' }}>
    <div className="max-w-[1280px] mx-auto">
      <Reveal>
        <p style={{
          fontFamily: body, fontSize: 12, fontWeight: 600, letterSpacing: '0.18em',
          color: ink, textTransform: 'uppercase', marginBottom: 28,
        }}>
          / Founder
        </p>
      </Reveal>

      <div className="grid grid-cols-12 gap-8 items-start">
        <Reveal className="col-span-12 md:col-span-5">
          <div style={{
            background: '#fff', padding: '14px 14px 22px',
            boxShadow: '0 30px 60px -20px rgba(0,0,0,0.35)',
            transform: 'rotate(-3deg)',
            maxWidth: 460, marginInline: 'auto',
          }}>
            <div style={{ aspectRatio: '4 / 5', overflow: 'hidden', background: '#eee' }}>
              <img src={profileImg} alt="Justin Harkelroad"
                style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'grayscale(100%) contrast(1.1)' }} />
            </div>
            <p style={{
              fontFamily: body, fontSize: 11, fontWeight: 700, letterSpacing: '0.16em',
              color: ink, textTransform: 'uppercase', marginTop: 14, textAlign: 'center',
            }}>
              Justin Harkelroad · Founder
            </p>
          </div>
        </Reveal>

        <Reveal delay={0.1} className="col-span-12 md:col-span-7">
          <p style={{
            fontFamily: body, fontSize: 11, fontWeight: 700, letterSpacing: '0.18em',
            color: blue, textTransform: 'uppercase', marginBottom: 14,
          }}>
            Founder & Head Coach
          </p>
          <h2 style={{
            fontFamily: display,
            fontSize: 'clamp(36px, 5.5vw, 80px)',
            lineHeight: 0.95, letterSpacing: '-0.01em', color: ink,
            textTransform: 'uppercase', margin: 0, fontWeight: 400, marginBottom: 28,
          }}>
            20 YEARS IN<br />THE TRENCHES.
          </h2>

          <div className="space-y-5" style={{
            fontFamily: body, fontSize: 16, fontWeight: 400, lineHeight: 1.65,
            color: ink, opacity: 0.85,
          }}>
            <p>
              Justin founded The Standard Playbook with a clear mission: to give insurance agency owners and producers the coaching, systems, and accountability they need to build high-performing agencies — not just survive, but lead.
            </p>
            <p>
              With deep experience in the insurance industry, Justin works directly with agency owners through 1:1 coaching (The Directive), group masterminds (The Boardroom), and technology-powered training platforms. His hands-on approach combines strategic business coaching with AI and technology implementation — including custom AI agent buildouts and call scoring systems.
            </p>
            <p>
              Based in Fort Wayne, Indiana, Justin and the Standard Playbook team serve insurance agencies nationwide, helping owners and their teams build systematic approaches to sales, leadership, and growth.
            </p>
          </div>
        </Reveal>
      </div>
    </div>
  </section>
);

/* ══════════════════════════════════════════════════════
   MISSION — editorial staircase
   ══════════════════════════════════════════════════════ */
const MissionSection = () => (
  <section style={{ background: ink, color: paper, padding: '120px 24px' }}>
    <div className="max-w-[1280px] mx-auto">
      <Reveal>
        <p style={{
          fontFamily: body, fontSize: 12, fontWeight: 600, letterSpacing: '0.18em',
          color: paper, opacity: 0.6, textTransform: 'uppercase', marginBottom: 28,
        }}>
          / The Mission
        </p>
      </Reveal>
      <Reveal delay={0.1}>
        <h2 style={{
          fontFamily: display, fontSize: 'clamp(40px, 8vw, 130px)',
          lineHeight: 0.92, letterSpacing: '-0.01em', color: paper,
          textTransform: 'uppercase', margin: 0, fontWeight: 400,
        }}>
          ELEVATE THE<br />
          <span className="md:pl-[6vw] inline-block">STANDARD OF</span><br />
          <span className="md:pl-[12vw] inline-block" style={{ color: blue }}>ENTREPRENEURSHIP.</span>
        </h2>
      </Reveal>
      <div className="grid grid-cols-12 gap-8 mt-14">
        <Reveal delay={0.15} className="col-span-12 md:col-span-7">
          <p style={{
            fontFamily: body, fontSize: 'clamp(17px, 1.6vw, 22px)', fontWeight: 400, lineHeight: 1.55,
            color: paper, opacity: 0.85,
          }}>
            World-class coaching, proven systems, and an elite community for ambitious business leaders who are committed to excellence.
          </p>
        </Reveal>
        <Reveal delay={0.2} className="col-span-12 md:col-span-5">
          <p style={{
            fontFamily: body, fontSize: 16, fontWeight: 400, lineHeight: 1.6,
            color: paper, opacity: 0.65, maxWidth: 460,
          }}>
            Ordinary advice produces ordinary results. The Standard Playbook is a comprehensive system for extraordinary entrepreneurs who demand extraordinary outcomes — built with the latest in AI and technology to give agencies a measurable competitive advantage.
          </p>
        </Reveal>
      </div>
    </div>
  </section>
);

/* ══════════════════════════════════════════════════════
   VALUES — bold list rows
   ══════════════════════════════════════════════════════ */
const values = [
  { num: '01', label: 'Excellence', sub: 'We hold ourselves and our clients to the highest standards. Mediocrity is not an option.' },
  { num: '02', label: 'Community', sub: 'We believe in the power of connection. Success is amplified when shared with the right people.' },
  { num: '03', label: 'Integrity', sub: "We do what we say we'll do. Our word is our bond, and trust is the foundation of everything." },
  { num: '04', label: 'Results', sub: 'We\'re obsessed with outcomes. Every strategy, system, and conversation is designed to drive results.' },
];

const ValuesSection = () => (
  <section style={{ background: paper, padding: '120px 24px' }}>
    <div className="max-w-[1280px] mx-auto">
      <div className="grid grid-cols-12 gap-6 items-end mb-16">
        <Reveal className="col-span-12 md:col-span-8">
          <p style={{
            fontFamily: body, fontSize: 12, fontWeight: 600, letterSpacing: '0.18em',
            color: ink, textTransform: 'uppercase', marginBottom: 12,
          }}>
            / Our Values
          </p>
          <h2 style={{
            fontFamily: display, fontSize: 'clamp(44px, 7vw, 100px)',
            lineHeight: 0.95, letterSpacing: '-0.01em', color: ink,
            textTransform: 'uppercase', margin: 0, fontWeight: 400,
          }}>
            FOUR NON-<br />NEGOTIABLES.
          </h2>
        </Reveal>
        <Reveal delay={0.1} className="col-span-12 md:col-span-4">
          <p style={{
            fontFamily: body, fontSize: 14, fontWeight: 400, lineHeight: 1.65,
            color: ink, opacity: 0.7,
          }}>
            The standards we hold ourselves to before we hold them to anyone else.
          </p>
        </Reveal>
      </div>

      <ul style={{ listStyle: 'none', margin: 0, padding: 0, borderTop: `1px solid ${ink}` }}>
        {values.map((v, i) => (
          <Reveal key={v.num} delay={i * 0.06}>
            <li style={{
              borderBottom: `1px solid ${ink}`,
              padding: '32px 16px',
              display: 'grid',
              gridTemplateColumns: '60px 1fr 2fr',
              gap: 24,
              alignItems: 'center',
            }}
              className="hover:bg-black/[0.03] transition-colors"
            >
              <span style={{
                fontFamily: editorial, fontSize: 22, color: ink,
                opacity: 0.4, letterSpacing: '-0.01em',
              }}>
                {v.num}
              </span>
              <h4 style={{
                fontFamily: display, fontSize: 'clamp(28px, 4vw, 56px)',
                lineHeight: 1, letterSpacing: '-0.01em', color: ink,
                textTransform: 'uppercase', margin: 0, fontWeight: 400,
              }}>
                {v.label}
              </h4>
              <p style={{
                fontFamily: body, fontSize: 15, fontWeight: 400, lineHeight: 1.55,
                color: ink, opacity: 0.7,
              }}>
                {v.sub}
              </p>
            </li>
          </Reveal>
        ))}
      </ul>
    </div>
  </section>
);

/* ══════════════════════════════════════════════════════
   STORY — newsprint columns
   ══════════════════════════════════════════════════════ */
const StorySection = () => (
  <section style={{ background: paper, padding: '120px 24px', borderTop: `1px solid ${ink}` }}>
    <div className="max-w-[1280px] mx-auto">
      <Reveal>
        <p style={{
          fontFamily: body, fontSize: 12, fontWeight: 600, letterSpacing: '0.18em',
          color: ink, textTransform: 'uppercase', marginBottom: 28,
        }}>
          / Our Story
        </p>
      </Reveal>
      <Reveal delay={0.05}>
        <h2 style={{
          fontFamily: display, fontSize: 'clamp(44px, 7vw, 100px)',
          lineHeight: 0.95, letterSpacing: '-0.01em', color: ink,
          textTransform: 'uppercase', margin: 0, fontWeight: 400, marginBottom: 56,
        }}>
          HOW WE GOT<br />HERE.
        </h2>
      </Reveal>

      <div className="grid grid-cols-12 gap-8">
        <Reveal delay={0.1} className="col-span-12 md:col-span-7">
          <div className="space-y-6" style={{
            fontFamily: body, fontSize: 17, fontWeight: 400, lineHeight: 1.7,
            color: ink, opacity: 0.85,
          }}>
            <p>
              The Standard Playbook was born from a simple observation: most business coaching focuses on tactics without addressing the foundational elements that truly drive success. We saw entrepreneurs struggling not because they lacked knowledge, but because they lacked the right framework, community, and accountability to execute consistently.
            </p>
            <p>
              Justin spent years in the trenches — building, coaching, and scaling insurance agencies. He experienced firsthand the isolation, challenges, and breakthrough moments that define the entrepreneurial journey. This real-world experience became the foundation for a different kind of coaching company — one built specifically for the insurance industry.
            </p>
            <p>
              We don't just teach theory; we share battle-tested strategies that have been proven in the marketplace. Our approach combines high-level strategic thinking with practical implementation support — including AI-powered tools like{' '}
              <Link to="/callscoring" style={{ color: blue, textDecoration: 'underline', fontWeight: 600 }}>
                call scoring
              </Link>{' '}
              and custom agent buildouts — all delivered within a community of peers who share your ambition and commitment to excellence.
            </p>
            <p>
              Today, The Standard Playbook works directly with insurance agency owners and their teams nationwide. The{' '}
              <a href="https://www.independentagent.com" target="_blank" rel="noopener noreferrer"
                style={{ color: blue, textDecoration: 'underline', fontWeight: 600 }}>
                independent insurance agency
              </a>{' '}
              model is built for growth — and we help owners realize that potential.
            </p>
          </div>
        </Reveal>

        <Reveal delay={0.2} className="col-span-12 md:col-span-5">
          <div style={{
            background: ink, color: paper, padding: '36px 28px',
            position: 'sticky', top: 80,
          }}>
            <p style={{
              fontFamily: body, fontSize: 11, fontWeight: 700, letterSpacing: '0.16em',
              color: blue, textTransform: 'uppercase', marginBottom: 14,
            }}>
              ★ The Difference
            </p>
            <p style={{
              fontFamily: display, fontSize: 'clamp(24px, 2.6vw, 32px)',
              lineHeight: 1.05, letterSpacing: '-0.01em', color: paper,
              textTransform: 'uppercase', margin: 0, fontWeight: 400, marginBottom: 18,
            }}>
              We don't<br />teach theory.<br />
              <span style={{ color: blue }}>We ship plays.</span>
            </p>
            <p style={{
              fontFamily: body, fontSize: 14, fontWeight: 400, lineHeight: 1.6,
              color: paper, opacity: 0.8,
            }}>
              Every framework pressure-tested inside a real agency before it ships to yours. Every system installed, not just explained.
            </p>
          </div>
        </Reveal>
      </div>
    </div>
  </section>
);

/* ══════════════════════════════════════════════════════
   BRANDS — Standard Playbook + Agency Brain
   ══════════════════════════════════════════════════════ */
const BrandsSection = () => (
  <section style={{ background: ink, color: paper, padding: '120px 24px' }}>
    <div className="max-w-[1280px] mx-auto">
      <Reveal>
        <p style={{
          fontFamily: body, fontSize: 12, fontWeight: 600, letterSpacing: '0.18em',
          color: paper, opacity: 0.6, textTransform: 'uppercase', marginBottom: 28,
        }}>
          / Our Brands
        </p>
      </Reveal>
      <Reveal delay={0.05}>
        <h2 style={{
          fontFamily: display, fontSize: 'clamp(40px, 7vw, 100px)',
          lineHeight: 0.95, letterSpacing: '-0.01em', color: paper,
          textTransform: 'uppercase', margin: 0, fontWeight: 400, marginBottom: 56,
        }}>
          ONE COMPANY.<br />TWO BRANDS.
        </h2>
      </Reveal>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Reveal delay={0.1}>
          <div style={{
            border: `1px solid ${paper}33`,
            padding: '36px 28px', height: '100%',
          }}>
            <img src={standardLogo} alt="Standard Playbook"
              style={{ height: 24, marginBottom: 28 }} />
            <h3 style={{
              fontFamily: display, fontSize: 'clamp(22px, 2.6vw, 30px)',
              lineHeight: 1.05, letterSpacing: '-0.01em', color: paper,
              textTransform: 'uppercase', margin: 0, fontWeight: 400, marginBottom: 14,
            }}>
              Coaching & Training
            </h3>
            <p style={{
              fontFamily: body, fontSize: 15, fontWeight: 400, lineHeight: 1.6,
              color: paper, opacity: 0.8,
            }}>
              Our coaching brand — encompassing all coaching programs (Boardroom, Directive, Partnership), challenges (Producer Power-Up, Owner Challenge), and the 8 Week Sales Experience training.
            </p>
          </div>
        </Reveal>

        <Reveal delay={0.15}>
          <div style={{
            border: `1px solid ${paper}33`,
            padding: '36px 28px', height: '100%',
          }}>
            <img src={agencyBrainLogo} alt="Agency Brain"
              style={{ height: 28, marginBottom: 24 }} />
            <h3 style={{
              fontFamily: display, fontSize: 'clamp(22px, 2.6vw, 30px)',
              lineHeight: 1.05, letterSpacing: '-0.01em', color: paper,
              textTransform: 'uppercase', margin: 0, fontWeight: 400, marginBottom: 14,
            }}>
              Technology Platform
            </h3>
            <p style={{
              fontFamily: body, fontSize: 15, fontWeight: 400, lineHeight: 1.6,
              color: paper, opacity: 0.8,
            }}>
              Our technology brand — powering the training app, AI call scoring, AI roleplay, and the digital tools that support every coaching program.
            </p>
          </div>
        </Reveal>
      </div>

      <Reveal delay={0.2}>
        <p style={{
          fontFamily: body, fontSize: 12, fontWeight: 500, letterSpacing: '0.06em',
          color: paper, opacity: 0.45, textTransform: 'uppercase', marginTop: 28, textAlign: 'center',
        }}>
          Both brands fully owned and operated by Standard Playbook INC · Fort Wayne, Indiana
        </p>
      </Reveal>
    </div>
  </section>
);

/* ══════════════════════════════════════════════════════
   GIANT CTA
   ══════════════════════════════════════════════════════ */
const GiantCTA = () => (
  <Link to="/#programs"
    style={{ display: 'block', textDecoration: 'none' }}
    aria-label="See our programs">
    <section
      style={{
        background: paper, color: ink, padding: '100px 24px 70px',
        cursor: 'pointer', borderTop: `1px solid ${ink}`,
      }}>
      <div className="max-w-[1440px] mx-auto text-center">
        <Reveal>
          <p style={{
            fontFamily: body, fontSize: 12, fontWeight: 600, letterSpacing: '0.18em',
            color: ink, opacity: 0.5, textTransform: 'uppercase', marginBottom: 24,
          }}>
            / The Standard
          </p>
        </Reveal>
        <Reveal delay={0.05}>
          <h2 style={{
            fontFamily: display, fontSize: 'clamp(72px, 22vw, 360px)',
            lineHeight: 0.82, letterSpacing: '-0.03em', color: ink,
            textTransform: 'uppercase', margin: 0, fontWeight: 400,
          }}>
            RAISE.
          </h2>
        </Reveal>
        <Reveal delay={0.15}>
          <p style={{
            fontFamily: body, fontSize: 14, fontWeight: 500, letterSpacing: '0.06em',
            color: ink, opacity: 0.7, marginTop: 32, textTransform: 'uppercase',
          }}>
            Click anywhere &nbsp;→&nbsp; See the programs
          </p>
        </Reveal>
      </div>
    </section>
  </Link>
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
            style={{ height: 22, marginBottom: 18 }} />
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
            { label: 'Boardroom', href: '/boardroom' },
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
   PAGE
   ══════════════════════════════════════════════════════ */
const BoldAbout = () => (
  <div style={{ background: paper, fontFamily: body, color: ink }}>
    <BoldNav />
    <Hero />
    <MarqueeBands />
    <FounderSection />
    <MissionSection />
    <ValuesSection />
    <StorySection />
    <BrandsSection />
    <GiantCTA />
    <BoldFooter />
    <ContentMeta lastUpdated="March 2026" />
  </div>
);

export default BoldAbout;
