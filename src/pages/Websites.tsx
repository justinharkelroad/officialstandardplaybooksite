import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import standardLogo from '@/assets/standard-word-logo.png';
import WebsitesInquiryModal from '@/components/WebsitesInquiryModal';

const sf = '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", "Helvetica Neue", Helvetica, Arial, sans-serif';

const Reveal = ({ children, className = '', delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: '-60px' }}
    transition={{ duration: 0.6, delay, ease: [0.25, 0.46, 0.45, 0.94] }}
    className={className}
  >
    {children}
  </motion.div>
);

/* ══════════════════════════════════════════════════════
   DISCLOSURE (accordion)
   ══════════════════════════════════════════════════════ */
const Disclosure = ({
  label,
  children,
  tone = 'dark',
}: {
  label: string;
  children: React.ReactNode;
  tone?: 'dark' | 'light';
}) => {
  const [open, setOpen] = useState(false);
  const border = tone === 'dark' ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.1)';
  const labelColor = tone === 'dark' ? 'rgba(255,255,255,0.85)' : '#1d1d1f';
  const chevronColor = tone === 'dark' ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.4)';
  return (
    <div style={{ borderTop: `1px solid ${border}`, marginTop: 20 }}>
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          fontFamily: sf,
          width: '100%',
          background: 'transparent',
          border: 'none',
          padding: '16px 0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          cursor: 'pointer',
          color: labelColor,
          fontSize: 15,
          fontWeight: 500,
          letterSpacing: '-0.01em',
        }}
        aria-expanded={open}
      >
        <span>{label}</span>
        <motion.span
          animate={{ rotate: open ? 45 : 0 }}
          transition={{ duration: 0.2 }}
          style={{
            display: 'inline-block',
            fontSize: 22,
            lineHeight: 1,
            color: chevronColor,
            fontWeight: 300,
          }}
        >
          +
        </motion.span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.25, 0.46, 0.45, 0.94] }}
            style={{ overflow: 'hidden' }}
          >
            <div style={{ paddingBottom: 20 }}>{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

/* ══════════════════════════════════════════════════════
   NAV
   ══════════════════════════════════════════════════════ */
const Nav = () => (
  <nav
    className="fixed top-0 left-0 right-0 z-50"
    style={{
      height: 48,
      background: 'rgba(0, 0, 0, 0.8)',
      backdropFilter: 'saturate(180%) blur(20px)',
      WebkitBackdropFilter: 'saturate(180%) blur(20px)',
      fontFamily: sf,
    }}
  >
    <div className="max-w-[980px] mx-auto h-full px-6 flex items-center justify-center">
      <Link
        to="/"
        className="text-white/80 hover:text-white transition-colors"
        style={{ fontSize: 12, fontWeight: 400, letterSpacing: '-0.01em' }}
      >
        Home
      </Link>
    </div>
  </nav>
);

/* ══════════════════════════════════════════════════════
   HERO
   ══════════════════════════════════════════════════════ */
const Hero = () => (
  <section
    className="flex items-center justify-center text-center"
    style={{
      background: '#000',
      minHeight: '60vh',
      paddingTop: 48,
      fontFamily: sf,
    }}
  >
    <div className="px-6 max-w-[980px] mx-auto py-20">
      <Reveal>
        <img src={standardLogo} alt="Standard Playbook" className="mx-auto w-36 md:w-48 mb-8 brightness-0 invert opacity-80" />
      </Reveal>
      <Reveal delay={0.1}>
        <h1
          style={{
            fontFamily: sf,
            fontSize: 'clamp(36px, 6vw, 56px)',
            fontWeight: 600,
            lineHeight: 1.07,
            letterSpacing: '-0.28px',
            color: '#fff',
            margin: 0,
          }}
        >
          Agency websites,<br />built right.
        </h1>
      </Reveal>
      <Reveal delay={0.2}>
        <p
          style={{
            fontFamily: sf,
            fontSize: 'clamp(17px, 2.5vw, 21px)',
            fontWeight: 400,
            lineHeight: 1.38,
            letterSpacing: '0.231px',
            color: 'rgba(255,255,255,0.6)',
            marginTop: 16,
            maxWidth: 600,
            marginLeft: 'auto',
            marginRight: 'auto',
          }}
        >
          One flat build price. One small monthly fee.
        </p>
      </Reveal>
    </div>
  </section>
);

/* ══════════════════════════════════════════════════════
   PRICING (Starter + Custom)
   ══════════════════════════════════════════════════════ */
const starterIncluded = [
  '5 core pages (Home, About, Contact, + 2 service pages)',
  'Mobile-responsive design, matched to your branding',
  'Fast, secure hosting with automatic SSL',
  'Click-to-call phone numbers on every page',
  'SEO basics — meta titles, descriptions, schema',
  'Google Analytics setup',
];

const Pricing = ({ onOpenInquiry }: { onOpenInquiry: () => void }) => (
  <section style={{ background: '#000', padding: '0 24px 80px', fontFamily: sf }}>
    <div className="max-w-[980px] mx-auto">
      <div className="grid md:grid-cols-2 gap-6">
        {/* Starter */}
        <Reveal>
          <div
            style={{
              background: '#1d1d1f',
              borderRadius: 20,
              padding: '48px 36px',
              border: '1px solid rgba(45,110,255,0.3)',
              height: '100%',
              position: 'relative',
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: 3,
                background: 'linear-gradient(90deg, #2997ff, #0071e3)',
              }}
            />
            <p style={{ fontSize: 14, fontWeight: 500, color: '#2997ff', letterSpacing: '0.04em', textTransform: 'uppercase', marginBottom: 8 }}>
              Starter
            </p>
            <h3 style={{ fontSize: 48, fontWeight: 600, color: '#fff', letterSpacing: '-0.5px', margin: 0 }}>
              $1,000
            </h3>
            <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.5)', margin: '4px 0 0' }}>
              one-time build &nbsp;·&nbsp; + $75/mo maintenance
            </p>

            <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.75)', lineHeight: 1.5, marginTop: 28 }}>
              A professional agency website, live in weeks — with a lead form
              that emails new submissions straight to you.
            </p>

            <Disclosure label="What's included in the build">
              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                {starterIncluded.map((f) => (
                  <li
                    key={f}
                    style={{
                      fontSize: 14,
                      color: 'rgba(255,255,255,0.75)',
                      lineHeight: 1.5,
                      padding: '8px 0',
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: 10,
                    }}
                  >
                    <span style={{ color: '#2997ff', flexShrink: 0, marginTop: 2 }}>&#10003;</span>
                    {f}
                  </li>
                ))}
                <li
                  style={{
                    fontSize: 14,
                    color: 'rgba(255,255,255,0.9)',
                    lineHeight: 1.5,
                    padding: '10px 12px',
                    marginTop: 8,
                    background: 'rgba(41,151,255,0.08)',
                    border: '1px solid rgba(41,151,255,0.2)',
                    borderRadius: 8,
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: 10,
                  }}
                >
                  <span style={{ color: '#2997ff', flexShrink: 0, marginTop: 2 }}>&#10003;</span>
                  <span>
                    <strong style={{ color: '#fff' }}>Lead-form email process.</strong>{' '}
                    We set up a contact form on your site so every new lead is
                    emailed directly to you — no portal, no login, just a
                    notification in your inbox.
                  </span>
                </li>
              </ul>
            </Disclosure>

            <Disclosure label="About the $75/mo maintenance">
              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                {[
                  'Hosting, SSL, and uptime monitoring',
                  'Up to 4 content change requests per month',
                  'Requests must be submitted by email',
                  'We respond and complete changes within 48 hours',
                ].map((item) => (
                  <li
                    key={item}
                    style={{
                      fontSize: 14,
                      color: 'rgba(255,255,255,0.75)',
                      lineHeight: 1.5,
                      padding: '8px 0',
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: 10,
                    }}
                  >
                    <span style={{ color: '#2997ff', flexShrink: 0, marginTop: 2 }}>&#10003;</span>
                    {item}
                  </li>
                ))}
              </ul>
              <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', marginTop: 10, lineHeight: 1.5 }}>
                Additional requests beyond 4/month are billed at $50 each.
              </p>
            </Disclosure>

            <button
              onClick={onOpenInquiry}
              style={{
                fontFamily: sf,
                fontSize: 15,
                fontWeight: 500,
                color: '#fff',
                background: '#0071e3',
                border: 'none',
                borderRadius: 980,
                padding: '12px 28px',
                marginTop: 28,
                cursor: 'pointer',
                alignSelf: 'flex-start',
                transition: 'background 0.2s',
              }}
              onMouseEnter={e => (e.currentTarget.style.background = '#0077ed')}
              onMouseLeave={e => (e.currentTarget.style.background = '#0071e3')}
            >
              Get started
            </button>
          </div>
        </Reveal>

        {/* Custom */}
        <Reveal delay={0.1}>
          <div
            style={{
              background: '#1d1d1f',
              borderRadius: 20,
              padding: '48px 36px',
              border: '1px solid rgba(255,255,255,0.08)',
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <p style={{ fontSize: 14, fontWeight: 500, color: 'rgba(255,255,255,0.5)', letterSpacing: '0.04em', textTransform: 'uppercase', marginBottom: 8 }}>
              Custom
            </p>
            <h3 style={{ fontSize: 48, fontWeight: 600, color: '#fff', letterSpacing: '-0.5px', margin: 0 }}>
              Custom options
            </h3>
            <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.5)', margin: '4px 0 0' }}>
              available on request
            </p>

            <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.75)', lineHeight: 1.5, marginTop: 28 }}>
              Need more pages, bilingual content, a blog, booking, a portal,
              or something else entirely? Tell us what you're thinking and
              we'll send a custom quote.
            </p>

            <ul style={{ listStyle: 'none', padding: 0, margin: '20px 0 0' }}>
              {[
                'Multi-location or bilingual builds',
                'Blog, resource, or careers sections',
                'Appointment booking or client portals',
                'Custom integrations and design',
              ].map((f) => (
                <li
                  key={f}
                  style={{
                    fontSize: 14,
                    color: 'rgba(255,255,255,0.75)',
                    lineHeight: 1.5,
                    padding: '8px 0',
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: 10,
                  }}
                >
                  <span style={{ color: 'rgba(255,255,255,0.5)', flexShrink: 0, marginTop: 2 }}>&#10003;</span>
                  {f}
                </li>
              ))}
            </ul>

            <div style={{ flex: 1 }} />

            <button
              onClick={onOpenInquiry}
              style={{
                fontFamily: sf,
                fontSize: 15,
                fontWeight: 500,
                color: '#fff',
                background: 'transparent',
                border: '1px solid rgba(255,255,255,0.3)',
                borderRadius: 980,
                padding: '12px 28px',
                marginTop: 28,
                cursor: 'pointer',
                alignSelf: 'flex-start',
                transition: 'all 0.2s',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = 'rgba(255,255,255,0.1)';
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.5)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = 'transparent';
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.3)';
              }}
            >
              Request a quote
            </button>
          </div>
        </Reveal>
      </div>
    </div>
  </section>
);

/* ══════════════════════════════════════════════════════
   REQUEST SCOPE (compact)
   ══════════════════════════════════════════════════════ */
const requestExamples: [string, string][] = [
  ['Swap a promo banner image', 'Swap the banner + rewrite a page'],
  ['Update office hours', 'Update hours + add 3 new photos'],
  ['Add one community event photo', 'Add photos across multiple pages'],
  ['Change a phone number sitewide', 'Redesign the home page'],
];

const RequestScope = () => (
  <section style={{ background: '#000', padding: '60px 24px', fontFamily: sf }}>
    <div className="max-w-[780px] mx-auto">
      <Reveal>
        <h2
          style={{
            fontSize: 'clamp(24px, 4vw, 32px)',
            fontWeight: 600,
            color: '#fff',
            letterSpacing: '-0.3px',
            textAlign: 'center',
            marginBottom: 8,
          }}
        >
          What counts as one request.
        </h2>
        <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.5)', lineHeight: 1.47, textAlign: 'center', maxWidth: 560, marginLeft: 'auto', marginRight: 'auto', marginBottom: 32 }}>
          One small content change to one section or page.
        </p>
      </Reveal>

      <Reveal delay={0.1}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            borderRadius: '12px 12px 0 0',
            overflow: 'hidden',
          }}
        >
          <div style={{ background: '#0071e3', padding: '12px 18px' }}>
            <p style={{ fontSize: 13, fontWeight: 600, color: '#fff', margin: 0 }}>One request</p>
          </div>
          <div style={{ background: '#0071e3', padding: '12px 18px', borderLeft: '1px solid rgba(255,255,255,0.15)' }}>
            <p style={{ fontSize: 13, fontWeight: 600, color: '#fff', margin: 0 }}>Multiple requests</p>
          </div>
        </div>
        {requestExamples.map(([one, multiple], i) => (
          <div
            key={i}
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              background: i % 2 === 0 ? '#1d1d1f' : '#161617',
              borderBottom: '1px solid rgba(255,255,255,0.06)',
            }}
          >
            <div style={{ padding: '12px 18px' }}>
              <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.75)', margin: 0, lineHeight: 1.5 }}>{one}</p>
            </div>
            <div style={{ padding: '12px 18px', borderLeft: '1px solid rgba(255,255,255,0.06)' }}>
              <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.75)', margin: 0, lineHeight: 1.5 }}>{multiple}</p>
            </div>
          </div>
        ))}
      </Reveal>
    </div>
  </section>
);

/* ══════════════════════════════════════════════════════
   NOT INCLUDED (compact)
   ══════════════════════════════════════════════════════ */
const notIncludedItems = [
  'Blog / news system',
  'Appointment booking',
  'E-commerce or payments',
  'Client portals',
  'Custom database integrations',
  'Full redesigns or new page types',
  'Photography, video, or graphic design',
];

const NotIncluded = () => (
  <section style={{ background: '#1d1d1f', padding: '60px 24px', fontFamily: sf }}>
    <div className="max-w-[780px] mx-auto">
      <Reveal>
        <h2
          style={{
            fontSize: 'clamp(24px, 4vw, 32px)',
            fontWeight: 600,
            color: '#fff',
            letterSpacing: '-0.3px',
            textAlign: 'center',
            marginBottom: 8,
          }}
        >
          What's not included.
        </h2>
        <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.5)', lineHeight: 1.47, textAlign: 'center', maxWidth: 560, marginLeft: 'auto', marginRight: 'auto', marginBottom: 24 }}>
          Outside the standard scope — we can quote any of these separately.
        </p>
      </Reveal>
      <Reveal delay={0.1}>
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 8,
            justifyContent: 'center',
          }}
        >
          {notIncludedItems.map((item) => (
            <span
              key={item}
              style={{
                fontSize: 13,
                color: 'rgba(255,255,255,0.6)',
                background: '#161617',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: 980,
                padding: '8px 14px',
              }}
            >
              {item}
            </span>
          ))}
        </div>
      </Reveal>
    </div>
  </section>
);

/* ══════════════════════════════════════════════════════
   FOOTER
   ══════════════════════════════════════════════════════ */
const Footer = () => (
  <footer style={{ background: '#000', padding: '40px 24px', borderTop: '1px solid rgba(255,255,255,0.08)', fontFamily: sf }}>
    <div className="max-w-[980px] mx-auto text-center">
      <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)', margin: 0 }}>
        &copy; {new Date().getFullYear()} Standard Playbook INC. All rights reserved.
      </p>
    </div>
  </footer>
);

/* ══════════════════════════════════════════════════════
   PAGE
   ══════════════════════════════════════════════════════ */
const Websites = () => {
  const [inquiryOpen, setInquiryOpen] = useState(false);
  return (
    <div style={{ fontFamily: sf, background: '#000' }}>
      <Nav />
      <Hero />
      <Pricing onOpenInquiry={() => setInquiryOpen(true)} />
      <RequestScope />
      <NotIncluded />
      <Footer />
      <WebsitesInquiryModal open={inquiryOpen} onOpenChange={setInquiryOpen} />
    </div>
  );
};

export default Websites;
