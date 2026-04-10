import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import standardLogo from '@/assets/standard-word-logo.png';

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
          Website Build &<br />Management Services
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
          Service Framework & Pricing
        </p>
      </Reveal>
    </div>
  </section>
);

/* ══════════════════════════════════════════════════════
   PRICING TIERS
   ══════════════════════════════════════════════════════ */
const starterFeatures = [
  '5 pages (Home, About/Contact, + 3 service pages)',
  'Lead capture form with email notification',
  'Mobile responsive design',
  'Basic SEO (meta titles & descriptions)',
  'Google Analytics setup',
  '1 office location',
  'English only',
  '1 round of revisions',
];

const completeFeatures = [
  'All 10 standard pages',
  'Lead capture form with email notification',
  'Mobile responsive design',
  'Full SEO with schema markup & sitemaps',
  'Google Analytics setup',
  'All office locations',
  'Bilingual (English & Spanish)',
  'Testimonials & community pages',
  'Careers & promotions pages',
  '2 rounds of revisions',
];

const PricingTiers = () => (
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
              border: '1px solid rgba(255,255,255,0.08)',
              height: '100%',
            }}
          >
            <p style={{ fontSize: 14, fontWeight: 500, color: 'rgba(255,255,255,0.5)', letterSpacing: '0.04em', textTransform: 'uppercase', marginBottom: 8 }}>
              Starter
            </p>
            <h3 style={{ fontSize: 48, fontWeight: 600, color: '#fff', letterSpacing: '-0.5px', marginBottom: 32 }}>
              $1,000
            </h3>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              {starterFeatures.map((f) => (
                <li
                  key={f}
                  style={{
                    fontSize: 15,
                    color: 'rgba(255,255,255,0.75)',
                    lineHeight: 1.5,
                    padding: '8px 0',
                    borderBottom: '1px solid rgba(255,255,255,0.06)',
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: 10,
                  }}
                >
                  <span style={{ color: '#2997ff', flexShrink: 0, marginTop: 2 }}>&#10003;</span>
                  {f}
                </li>
              ))}
            </ul>
          </div>
        </Reveal>

        {/* Complete */}
        <Reveal delay={0.1}>
          <div
            style={{
              background: '#1d1d1f',
              borderRadius: 20,
              padding: '48px 36px',
              border: '1px solid rgba(45,110,255,0.3)',
              height: '100%',
              position: 'relative',
              overflow: 'hidden',
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
              Complete
            </p>
            <h3 style={{ fontSize: 48, fontWeight: 600, color: '#fff', letterSpacing: '-0.5px', marginBottom: 32 }}>
              $2,000
            </h3>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              {completeFeatures.map((f) => (
                <li
                  key={f}
                  style={{
                    fontSize: 15,
                    color: 'rgba(255,255,255,0.75)',
                    lineHeight: 1.5,
                    padding: '8px 0',
                    borderBottom: '1px solid rgba(255,255,255,0.06)',
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: 10,
                  }}
                >
                  <span style={{ color: '#2997ff', flexShrink: 0, marginTop: 2 }}>&#10003;</span>
                  {f}
                </li>
              ))}
            </ul>
          </div>
        </Reveal>
      </div>
    </div>
  </section>
);

/* ══════════════════════════════════════════════════════
   INCLUDED IN EVERY BUILD
   ══════════════════════════════════════════════════════ */
const everyBuildItems = [
  'Professional, custom-designed website matching your agency branding',
  'Hosted on fast, secure infrastructure with automatic SSL certificate',
  'Click-to-call phone numbers on every page (mobile optimized)',
  'Lead capture form \u2014 new submissions emailed directly to you',
  'Search engine optimization so customers in your area can find you',
  'Google Analytics tracking to monitor visitor activity',
];

const IncludedInEveryBuild = () => (
  <section style={{ background: '#000', padding: '80px 24px', fontFamily: sf }}>
    <div className="max-w-[780px] mx-auto">
      <Reveal>
        <h2
          style={{
            fontSize: 'clamp(28px, 5vw, 40px)',
            fontWeight: 600,
            color: '#fff',
            letterSpacing: '-0.3px',
            textAlign: 'center',
            marginBottom: 48,
          }}
        >
          What's included in every build.
        </h2>
      </Reveal>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
        {everyBuildItems.map((item, i) => (
          <Reveal key={item} delay={i * 0.05}>
            <div
              style={{
                padding: '20px 0',
                borderBottom: '1px solid rgba(255,255,255,0.08)',
                display: 'flex',
                alignItems: 'flex-start',
                gap: 14,
              }}
            >
              <span style={{ color: '#2997ff', fontSize: 18, flexShrink: 0, marginTop: 1 }}>&#10003;</span>
              <p style={{ fontSize: 17, color: 'rgba(255,255,255,0.8)', lineHeight: 1.47, margin: 0 }}>
                {item}
              </p>
            </div>
          </Reveal>
        ))}
      </div>
    </div>
  </section>
);

/* ══════════════════════════════════════════════════════
   MONTHLY MANAGEMENT
   ══════════════════════════════════════════════════════ */
const MonthlyManagement = () => (
  <section style={{ background: '#1d1d1f', padding: '80px 24px', fontFamily: sf }}>
    <div className="max-w-[780px] mx-auto text-center">
      <Reveal>
        <p style={{ fontSize: 14, fontWeight: 500, color: '#2997ff', letterSpacing: '0.04em', textTransform: 'uppercase', marginBottom: 12 }}>
          Monthly Website Management
        </p>
        <h2 style={{ fontSize: 'clamp(36px, 6vw, 56px)', fontWeight: 600, color: '#fff', letterSpacing: '-0.5px', marginBottom: 16 }}>
          $100/month
        </h2>
        <p style={{ fontSize: 17, color: 'rgba(255,255,255,0.6)', lineHeight: 1.47, maxWidth: 540, marginLeft: 'auto', marginRight: 'auto', marginBottom: 40 }}>
          A 12-month service agreement is required. Your monthly management fee covers:
        </p>
      </Reveal>
      <Reveal delay={0.1}>
        <div style={{ textAlign: 'left', maxWidth: 480, marginLeft: 'auto', marginRight: 'auto' }}>
          {[
            'Hosting, SSL, and uptime monitoring',
            'Up to 4 content update requests per month',
            'Priority support via email',
          ].map((item) => (
            <div
              key={item}
              style={{
                padding: '16px 0',
                borderBottom: '1px solid rgba(255,255,255,0.08)',
                display: 'flex',
                alignItems: 'center',
                gap: 14,
              }}
            >
              <span style={{ color: '#2997ff', fontSize: 16, flexShrink: 0 }}>&#10003;</span>
              <p style={{ fontSize: 17, color: 'rgba(255,255,255,0.8)', lineHeight: 1.47, margin: 0 }}>
                {item}
              </p>
            </div>
          ))}
        </div>
      </Reveal>
    </div>
  </section>
);

/* ══════════════════════════════════════════════════════
   WHAT COUNTS AS ONE REQUEST
   ══════════════════════════════════════════════════════ */
const requestExamples: [string, string][] = [
  ['Swap the promo banner image', 'Swap the promo banner + rewrite the About page'],
  ['Update office hours', 'Update hours + add 3 community photos'],
  ['Add one community event photo', 'Add new photos across multiple pages'],
  ['Update one job listing', 'Rewrite all service page copy'],
  ['Change a phone number sitewide', 'Redesign the home page'],
];

const WhatCountsAsOneRequest = () => (
  <section style={{ background: '#000', padding: '80px 24px', fontFamily: sf }}>
    <div className="max-w-[780px] mx-auto">
      <Reveal>
        <h2
          style={{
            fontSize: 'clamp(28px, 5vw, 40px)',
            fontWeight: 600,
            color: '#fff',
            letterSpacing: '-0.3px',
            textAlign: 'center',
            marginBottom: 12,
          }}
        >
          What counts as one request.
        </h2>
        <p style={{ fontSize: 17, color: 'rgba(255,255,255,0.6)', lineHeight: 1.47, textAlign: 'center', maxWidth: 600, marginLeft: 'auto', marginRight: 'auto', marginBottom: 40 }}>
          Each request is a single, small content change to one section or one page.
        </p>
      </Reveal>

      <Reveal delay={0.1}>
        {/* Table header */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            borderRadius: '12px 12px 0 0',
            overflow: 'hidden',
          }}
        >
          <div style={{ background: '#0071e3', padding: '14px 20px' }}>
            <p style={{ fontSize: 14, fontWeight: 600, color: '#fff', margin: 0 }}>This is ONE request</p>
          </div>
          <div style={{ background: '#0071e3', padding: '14px 20px', borderLeft: '1px solid rgba(255,255,255,0.15)' }}>
            <p style={{ fontSize: 14, fontWeight: 600, color: '#fff', margin: 0 }}>This is MULTIPLE requests</p>
          </div>
        </div>
        {/* Table rows */}
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
            <div style={{ padding: '14px 20px' }}>
              <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.75)', margin: 0, lineHeight: 1.5 }}>{one}</p>
            </div>
            <div style={{ padding: '14px 20px', borderLeft: '1px solid rgba(255,255,255,0.06)' }}>
              <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.75)', margin: 0, lineHeight: 1.5 }}>{multiple}</p>
            </div>
          </div>
        ))}
        <div
          style={{
            background: '#1d1d1f',
            borderRadius: '0 0 12px 12px',
            padding: '20px',
            borderTop: '1px solid rgba(255,255,255,0.08)',
          }}
        >
          <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.6)', margin: 0, lineHeight: 1.6 }}>
            Additional requests beyond 4 per month are billed at <strong style={{ color: '#fff' }}>$50 each</strong>.
            <br />
            Requests are submitted by email and completed within 2-3 business days.
          </p>
        </div>
      </Reveal>
    </div>
  </section>
);

/* ══════════════════════════════════════════════════════
   WHAT'S NOT INCLUDED
   ══════════════════════════════════════════════════════ */
const notIncludedItems = [
  'Blog or news system',
  'Online appointment booking',
  'Payment processing or e-commerce',
  'Client portal login',
  'Custom database integrations',
  'Full page redesigns or new page types',
  'Photography, videography, or graphic design',
];

const NotIncluded = () => (
  <section style={{ background: '#1d1d1f', padding: '80px 24px', fontFamily: sf }}>
    <div className="max-w-[780px] mx-auto">
      <Reveal>
        <h2
          style={{
            fontSize: 'clamp(28px, 5vw, 40px)',
            fontWeight: 600,
            color: '#fff',
            letterSpacing: '-0.3px',
            textAlign: 'center',
            marginBottom: 12,
          }}
        >
          What's not included.
        </h2>
        <p style={{ fontSize: 17, color: 'rgba(255,255,255,0.6)', lineHeight: 1.47, textAlign: 'center', maxWidth: 600, marginLeft: 'auto', marginRight: 'auto', marginBottom: 40 }}>
          The following are outside the standard build and monthly management scope. These can be quoted separately if needed.
        </p>
      </Reveal>
      <Reveal delay={0.1}>
        <div
          style={{
            background: '#161617',
            borderRadius: 16,
            padding: '8px 0',
            border: '1px solid rgba(255,255,255,0.08)',
          }}
        >
          {notIncludedItems.map((item, i) => (
            <div
              key={item}
              style={{
                padding: '14px 28px',
                borderBottom: i < notIncludedItems.length - 1 ? '1px solid rgba(255,255,255,0.06)' : 'none',
                display: 'flex',
                alignItems: 'center',
                gap: 12,
              }}
            >
              <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: 14, flexShrink: 0 }}>&#10005;</span>
              <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.6)', margin: 0, lineHeight: 1.5 }}>
                {item}
              </p>
            </div>
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
const Websites = () => (
  <div style={{ fontFamily: sf, background: '#000' }}>
    <Nav />
    <Hero />
    <PricingTiers />
    <IncludedInEveryBuild />
    <MonthlyManagement />
    <WhatCountsAsOneRequest />
    <NotIncluded />
    <Footer />
  </div>
);

export default Websites;
