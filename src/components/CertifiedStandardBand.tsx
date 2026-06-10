import { type ReactNode } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

import { CERTIFIED_STANDARD_CHECKOUT_URL, CERTIFIED_STANDARD_PATH } from '@/data/certifiedStandard';

const display = '"Anton", "Archivo Black", "Oswald", Impact, sans-serif';
const editorial = '"Archivo Black", "Anton", Impact, sans-serif';
const body = 'Inter, -apple-system, BlinkMacSystemFont, "Helvetica Neue", Arial, sans-serif';
const ink = '#0A0A0B';
const paper = '#F4F2EE';
const blue = '#2997FF';
const Reveal = ({ children, className = '', delay = 0 }: { children: ReactNode; className?: string; delay?: number }) => (
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

const tracks: { num: string; title: string; count: string; modules: string[] }[] = [
  {
    num: '01',
    title: 'THE HOOK',
    count: '5 modules',
    modules: ['Auto Data Lead Hook', 'Home Data Lead Hook', 'Win-Back Hook', 'X-Date / Requote Hook', 'Cross-Sell Hook'],
  },
  {
    num: '02',
    title: 'THE OBJECTION',
    count: '3 modules',
    modules: ['"I didn\'t request a quote"', '"I don\'t have time"', '"I\'m not interested"'],
  },
  {
    num: '03',
    title: 'DISCOVERY & COVERAGE',
    count: '5 modules',
    modules: ['Rapport = Trust', 'The 3-Question Gap', 'Umbrella Focus', 'Assuming vs. Asking', 'Walk the Block'],
  },
  {
    num: '04',
    title: 'THE CLOSE',
    count: '4 modules',
    modules: ['Stalls and Maybes', 'Payment & Start-Date Friction', 'Price, Savings & Coverage Value', 'Decision-Maker & Loyalty Objections'],
  },
  {
    num: '05',
    title: 'THE STANDARD',
    count: '5 modules',
    modules: ['Why Coverage Conversations Matter', 'Post-Sale Follow-Through', 'Follow-Up Is Your Lifeblood', '3 Buckets = Simplicity', 'Closers Playbook & Objection Sheet'],
  },
];

const stats: { value: string; label: string }[] = [
  { value: '24', label: 'training modules' },
  { value: '18', label: 'live AI voice roleplays' },
  { value: '85', label: 'scored quiz prompts' },
  { value: '80%', label: 'certification gate' },
];

const CertifiedStandardBand = () => (
  <section style={{ background: ink, padding: '120px 24px' }}>
    <div className="max-w-[1280px] mx-auto">
      <Reveal delay={0}>
        <p
          style={{
            fontFamily: body,
            fontSize: 12,
            fontWeight: 600,
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
            color: blue,
            margin: '0 0 24px',
          }}
        >
          / Certified Standard
        </p>
      </Reveal>

      <Reveal delay={0.05}>
        <h2
          style={{
            fontFamily: display,
            fontSize: 'clamp(40px, 7vw, 110px)',
            lineHeight: 0.95,
            textTransform: 'uppercase',
            fontWeight: 400,
            color: paper,
            margin: 0,
          }}
        >
          TRAIN THE WHOLE CALL.
          <br />
          HELLO TO BIND.
        </h2>
      </Reveal>

      <Reveal delay={0.1}>
        <p
          style={{
            fontFamily: body,
            fontSize: 16,
            lineHeight: 1.65,
            color: paper,
            opacity: 0.85,
            maxWidth: 560,
            margin: '24px 0 0',
          }}
        >
          One-off AI training for your producers. $399 per seat, one time. No coaching program. No subscription. No application. Buy it today — your producers train this week.
        </p>
      </Reveal>

      <Reveal delay={0.15}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '1px',
            marginTop: 56,
          }}
        >
          {tracks.map((track) => (
            <article
              key={track.num}
              style={{
                border: `1px solid ${paper}1a`,
                padding: '28px 24px',
              }}
            >
              <div
                style={{
                  fontFamily: editorial,
                  fontSize: 18,
                  color: blue,
                  marginBottom: 12,
                }}
              >
                {track.num}
              </div>
              <h3
                style={{
                  fontFamily: display,
                  fontSize: 'clamp(20px, 2.2vw, 28px)',
                  textTransform: 'uppercase',
                  color: paper,
                  fontWeight: 400,
                  lineHeight: 1.05,
                  margin: 0,
                }}
              >
                {track.title}
              </h3>
              <div
                style={{
                  fontFamily: body,
                  fontSize: 11,
                  fontWeight: 600,
                  letterSpacing: '0.16em',
                  textTransform: 'uppercase',
                  color: paper,
                  opacity: 0.5,
                  margin: '16px 0 14px',
                }}
              >
                {track.count}
              </div>
              <div
                style={{
                  fontFamily: body,
                  fontSize: 13,
                  lineHeight: 1.7,
                  color: paper,
                  opacity: 0.7,
                }}
              >
                {track.modules.map((module) => (
                  <div key={module}>{module}</div>
                ))}
              </div>
            </article>
          ))}
        </div>
      </Reveal>

      <Reveal delay={0.2}>
        <div
          style={{
            borderTop: `1px solid ${paper}1a`,
            borderBottom: `1px solid ${paper}1a`,
            padding: '24px 0',
            marginTop: 40,
            display: 'flex',
            flexWrap: 'wrap',
            gap: 24,
          }}
        >
          {stats.map((stat) => (
            <div
              key={stat.label}
              style={{
                flex: '1 1 140px',
                minWidth: 140,
              }}
            >
              <div
                style={{
                  fontFamily: display,
                  fontSize: 'clamp(32px, 4vw, 56px)',
                  color: paper,
                  lineHeight: 1,
                }}
              >
                {stat.value}
              </div>
              <div
                style={{
                  fontFamily: body,
                  fontSize: 11,
                  textTransform: 'uppercase',
                  color: paper,
                  opacity: 0.6,
                  letterSpacing: '0.12em',
                  marginTop: 8,
                }}
              >
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </Reveal>

      <Reveal delay={0.25}>
        <p
          style={{
            fontFamily: body,
            fontSize: 15,
            color: paper,
            opacity: 0.85,
            margin: '40px 0 0',
            maxWidth: 640,
          }}
        >
          Every practice call saved as a transcript. Every quiz scored to an 80% gate. You see exactly who&apos;s certified.
        </p>
      </Reveal>

      <Reveal delay={0.3}>
        <div
          style={{
            marginTop: 32,
            display: 'flex',
            gap: 16,
            alignItems: 'center',
            flexWrap: 'wrap',
          }}
        >
          <Link
            to={`${CERTIFIED_STANDARD_PATH}?src=home-band`}
            style={{
              background: paper,
              color: ink,
              fontFamily: body,
              fontSize: 13,
              fontWeight: 700,
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              padding: '16px 32px',
              display: 'inline-block',
              textDecoration: 'none',
            }}
            className="hover:bg-[#2997FF] hover:text-white transition-colors"
          >
            See the Full Curriculum →
          </Link>
          <a
            href={`${CERTIFIED_STANDARD_CHECKOUT_URL}?src=home-band`}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              fontFamily: body,
              fontSize: 13,
              fontWeight: 700,
              color: paper,
              textDecoration: 'underline',
            }}
            className="hover:text-[#2997FF] transition-colors"
          >
            Get Certified · $399
          </a>
        </div>
      </Reveal>

      <Reveal delay={0.35}>
        <p
          style={{
            fontFamily: body,
            fontSize: 13,
            color: paper,
            opacity: 0.6,
            margin: '24px 0 0',
          }}
        >
          Want daily accountability on top of the certification? That&apos;s the{' '}
          <a href="#programs" style={{ color: paper, textDecoration: 'underline' }}>
            6 Week Producer Challenge ↓
          </a>
        </p>
      </Reveal>
    </div>
  </section>
);

export default CertifiedStandardBand;
