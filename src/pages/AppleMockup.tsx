import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import DirectiveApplicationModal from '@/components/DirectiveApplicationModal';
import BookingModal from '@/components/BookingModal';
import StandardFitModal from '@/components/StandardFitModal';

import standardLogo from '@/assets/standard-word-logo.png';
import agencyBrainLogo from '@/assets/agency-brain-logo.png';
import teamTrainingImg from '@/assets/team-training.png';
import aiRoleplayImg from '@/assets/ai-roleplay-bot.png';
import salesDashImg from '@/assets/sales-dashboard.png';
import salesAnalyticsImg from '@/assets/sales-analytics.png';
import lqsImg from '@/assets/lqs.png';
import marketingRoiImg from '@/assets/marketing-roi.png';
import callScoringImg from '@/assets/call-scoring.png';
import renewalsImg from '@/assets/renewals.png';
import cancelAuditImg from '@/assets/cancel-audit.png';
import winbackImg from '@/assets/winback-hq.png';
import habitTrackingImg from '@/assets/habit-tracking.png';
import targetSettingImg from '@/assets/target-setting.png';

/* ── Apple typography helpers ── */
const sf = '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", "Helvetica Neue", Helvetica, Arial, sans-serif';
const AGENCYBRAIN_CHECKOUT_URL = 'https://wjqyccbytctqwceuhzhk.supabase.co/functions/v1/create-agencybrain-checkout';
const AGENCYBRAIN_SUCCESS_URL = 'https://myagencybrain.com/agencybrain-checkout-success?session_id={CHECKOUT_SESSION_ID}';

type AgencyBrainPlanId = 'agencybrain_core' | 'agencybrain_pro';

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
   APPLE-STYLE NAVIGATION
   ══════════════════════════════════════════════════════ */
const AppleNav = () => {
  const [mobileOpen, setMobileOpen] = useState(false);

  const navLinks = [
    { label: 'Agency Brain', href: '#agency-brain' },
    { label: 'Programs', href: '#programs' },
    { label: '8-Week', to: '/sales-experience' },
    { label: 'Training', to: '/training' },
    { label: 'Contact', to: '/contact' },
    { label: 'Nutrition', href: 'https://standardnutrition.app', external: true },
  ];

  return (
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
        {/* Desktop — centered links */}
        <div className="hidden md:flex items-center gap-10">
          {navLinks.map((link) =>
            link.to ? (
              <Link
                key={link.label}
                to={link.to}
                className="text-white/80 hover:text-white transition-colors"
                style={{ fontSize: 12, fontWeight: 400, letterSpacing: '-0.01em' }}
              >
                {link.label}
              </Link>
            ) : (
              <a
                key={link.label}
                href={link.href}
                {...(link.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                className="text-white/80 hover:text-white transition-colors"
                style={{ fontSize: 12, fontWeight: 400, letterSpacing: '-0.01em' }}
              >
                {link.label}
              </a>
            )
          )}
        </div>

        {/* Mobile hamburger */}
        <button className="md:hidden text-white/80 ml-auto" onClick={() => setMobileOpen(!mobileOpen)}>
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {mobileOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile menu overlay */}
      {mobileOpen && (
        <div
          className="md:hidden"
          style={{
            background: 'rgba(0, 0, 0, 0.95)',
            backdropFilter: 'saturate(180%) blur(20px)',
            padding: '20px 24px',
          }}
        >
          {navLinks.map((link) =>
            link.to ? (
              <Link
                key={link.label}
                to={link.to}
                className="block py-3 text-white/80 hover:text-white transition-colors border-b border-white/5"
                style={{ fontSize: 17, fontWeight: 400, letterSpacing: '-0.374px' }}
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </Link>
            ) : (
              <a
                key={link.label}
                href={link.href}
                {...(link.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                className="block py-3 text-white/80 hover:text-white transition-colors border-b border-white/5"
                style={{ fontSize: 17, fontWeight: 400, letterSpacing: '-0.374px' }}
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </a>
            )
          )}
        </div>
      )}
    </nav>
  );
};

/* ══════════════════════════════════════════════════════
   HERO — BLACK BACKGROUND, CINEMATIC
   ══════════════════════════════════════════════════════ */
const HeroSection = () => {
  const [fitModalOpen, setFitModalOpen] = useState(false);

  return (
    <section
      className="relative flex items-center justify-center text-center"
      style={{
        background: '#000',
        minHeight: '100vh',
        paddingTop: 48,
        backgroundImage: 'linear-gradient(rgba(0,0,0,0.55), rgba(0,0,0,0.7)), url(/hero.jpg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className="px-6 max-w-[980px] mx-auto">
        <Reveal>
          <img
            src={standardLogo}
            alt="Standard Playbook"
            className="mx-auto brightness-0 invert"
            style={{ width: 'clamp(200px, 40vw, 340px)', marginBottom: 40 }}
          />
        </Reveal>
        <Reveal delay={0.1}>
          <h1
            style={{
              fontFamily: sf,
              fontSize: 'clamp(40px, 7vw, 56px)',
              fontWeight: 600,
              lineHeight: 1.07,
              letterSpacing: '-0.28px',
              color: '#fff',
              margin: 0,
            }}
          >
            Raise your standard.
          </h1>
        </Reveal>
        <Reveal delay={0.2}>
          <p
            style={{
              fontFamily: sf,
              fontSize: 'clamp(18px, 3vw, 21px)',
              fontWeight: 400,
              lineHeight: 1.19,
              letterSpacing: '0.231px',
              color: 'rgba(255,255,255,0.7)',
              marginTop: 12,
            }}
          >
            Coaching, systems, and software for insurance agency owners who refuse to settle.
          </p>
        </Reveal>

        <Reveal delay={0.3}>
          <div className="flex items-center justify-center gap-4 mt-8">
            <a
              href="#programs"
              style={{
                fontFamily: sf,
                fontSize: 17,
                fontWeight: 400,
                color: '#2997ff',
                border: '1px solid #2997ff',
                borderRadius: 980,
                padding: '8px 20px',
                textDecoration: 'none',
                transition: 'all 0.3s',
              }}
              className="hover:bg-[#2997ff]/10"
            >
              Learn more
            </a>
            <button
              onClick={() => setFitModalOpen(true)}
              style={{
                fontFamily: sf,
                fontSize: 17,
                fontWeight: 400,
                color: '#fff',
                background: '#0071e3',
                border: '1px solid transparent',
                borderRadius: 8,
                padding: '8px 20px',
                cursor: 'pointer',
                transition: 'all 0.3s',
              }}
              className="hover:brightness-110"
            >
              Book a Call
            </button>
          </div>
        </Reveal>

        <StandardFitModal open={fitModalOpen} onOpenChange={setFitModalOpen} />
      </div>
    </section>
  );
};

/* ══════════════════════════════════════════════════════
   FOUR PILLARS — LIGHT GRAY SECTION
   ══════════════════════════════════════════════════════ */
const PillarsSection = () => (
  <section style={{ background: '#f5f5f7', padding: '120px 24px' }}>
    <div className="max-w-[980px] mx-auto text-center">
      <Reveal>
        <p
          style={{
            fontFamily: sf,
            fontSize: 14,
            fontWeight: 600,
            lineHeight: 1.29,
            letterSpacing: '-0.224px',
            color: 'rgba(0,0,0,0.48)',
            textTransform: 'uppercase',
            marginBottom: 12,
          }}
        >
          The Foundation
        </p>
        <h2
          style={{
            fontFamily: sf,
            fontSize: 'clamp(32px, 5vw, 40px)',
            fontWeight: 600,
            lineHeight: 1.1,
            letterSpacing: 'normal',
            color: '#1d1d1f',
          }}
        >
          Built on four pillars.
        </h2>
      </Reveal>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-16">
        {[
          { name: 'Business', desc: 'Systems, pipeline, revenue — the engine that drives your agency forward.' },
          { name: 'Being', desc: 'Mindset, identity, and leadership — God built you to discover your purpose.' },
          { name: 'Body', desc: 'Physical energy and discipline — your body is the vehicle for everything else.' },
          { name: 'Balance', desc: 'Family, rest, purpose — success without fulfillment is the ultimate failure.' },
        ].map((pillar, i) => (
          <Reveal key={pillar.name} delay={i * 0.1}>
            <div className="text-center">
              <h3
                style={{
                  fontFamily: sf,
                  fontSize: 28,
                  fontWeight: 600,
                  lineHeight: 1.14,
                  letterSpacing: '0.196px',
                  color: '#1d1d1f',
                  marginBottom: 8,
                }}
              >
                {pillar.name}
              </h3>
              <p
                style={{
                  fontFamily: sf,
                  fontSize: 14,
                  fontWeight: 400,
                  lineHeight: 1.43,
                  letterSpacing: '-0.224px',
                  color: 'rgba(0,0,0,0.48)',
                  textAlign: 'left',
                }}
              >
                {pillar.desc}
              </p>
            </div>
          </Reveal>
        ))}
      </div>
    </div>
  </section>
);

/* ══════════════════════════════════════════════════════
   AGENCY BRAIN HERO — BLACK SECTION
   ══════════════════════════════════════════════════════ */
const AgencyBrainHero = () => (
  <section
    id="agency-brain"
    className="flex items-center justify-center text-center"
    style={{ background: '#000', padding: '120px 24px' }}
  >
    <div className="max-w-[980px] mx-auto">
      <Reveal>
        <p
          style={{
            fontFamily: sf,
            fontSize: 14,
            fontWeight: 600,
            letterSpacing: '-0.224px',
            color: 'rgba(255,255,255,0.48)',
            textTransform: 'uppercase',
            marginBottom: 12,
          }}
        >
          Introducing
        </p>
      </Reveal>
      <Reveal delay={0.1}>
        <img
          src={agencyBrainLogo}
          alt="Agency Brain"
          className="mx-auto w-[80%] md:w-[500px] mb-6"
          style={{ filter: 'brightness(1.1)' }}
        />
      </Reveal>
      <Reveal delay={0.2}>
        <p
          style={{
            fontFamily: sf,
            fontSize: 'clamp(18px, 3vw, 21px)',
            fontWeight: 400,
            lineHeight: 1.19,
            letterSpacing: '0.231px',
            color: 'rgba(255,255,255,0.7)',
            maxWidth: 600,
            margin: '0 auto',
          }}
        >
          The operating system that turns chaos into clarity.
          Your pipeline, your team, your retention — all in one place.
        </p>
      </Reveal>

      <Reveal delay={0.3}>
        <div className="flex items-center justify-center gap-4 mt-8">
          <a
            href="#features"
            style={{
              fontFamily: sf,
              fontSize: 17,
              fontWeight: 400,
              color: '#2997ff',
              border: '1px solid #2997ff',
              borderRadius: 980,
              padding: '8px 20px',
              textDecoration: 'none',
              transition: 'all 0.3s',
            }}
            className="hover:bg-[#2997ff]/10"
          >
            Learn more
          </a>
        </div>
      </Reveal>
    </div>
  </section>
);

/* ══════════════════════════════════════════════════════
   FEATURE SHOWCASE — TABBED SINGLE-SECTION
   12 features collapsed into 4 category tabs with
   a hero screenshot + feature selector inside each.
   ══════════════════════════════════════════════════════ */
const featureCategories = [
  {
    tab: 'Sales & Pipeline',
    features: [
      { headline: 'Total Visibility.', sub: 'Know exactly where your team stands every single day.', img: salesDashImg, label: 'Dashboard' },
      { headline: 'Sales Breakdown.', sub: 'Drill into premium, items, policies, and points — by date, source, or bundle.', img: salesAnalyticsImg, label: 'Analytics' },
      { headline: 'Stop Guessing.', sub: 'See every lead, every stage, every dollar — in real time.', img: lqsImg, label: 'Pipeline' },
      { headline: 'Track Your ROI.', sub: 'See exactly what your marketing spend is producing — leads, quotes, premium, commission.', img: marketingRoiImg, label: 'Marketing' },
    ],
  },
  {
    tab: 'Team Development',
    features: [
      { headline: 'Train Your Team.', sub: 'A full training library with structured bootcamps — accessible right inside the app.', img: teamTrainingImg, label: 'Training' },
      { headline: 'Practice Makes Perfect.', sub: 'AI roleplay bot lets your producers sharpen their pitch anytime, anywhere.', img: aiRoleplayImg, label: 'AI Roleplay' },
      { headline: 'Score Every Call.', sub: 'AI-powered call audits with execution checklists and talk-to-listen ratios.', img: callScoringImg, label: 'Call Scoring' },
    ],
  },
  {
    tab: 'Retention',
    features: [
      { headline: 'Stay Ahead.', sub: 'Proactively manage renewals so nothing slips through the cracks.', img: renewalsImg, label: 'Renewals' },
      { headline: 'Cancel Audit.', sub: 'Track cancellations, at-risk premium, and saved dollars — week by week.', img: cancelAuditImg, label: 'Cancellations' },
      { headline: 'Stop the Bleed.', sub: 'Catch cancellations before they cost you. Automated winback workflows.', img: winbackImg, label: 'Winback' },
    ],
  },
  {
    tab: 'Habits & Goals',
    features: [
      { headline: 'Build The Habits.', sub: 'Core 4 + Flow tracking: Body, Being, Balance, Business — with team leaderboards.', img: habitTrackingImg, label: 'Habits' },
      { headline: 'Set Your Targets.', sub: 'Plan your 90-day action map — quarterly goals broken into daily habits.', img: targetSettingImg, label: 'Targets' },
    ],
  },
];

const FeatureShowcase = () => {
  const [activeCat, setActiveCat] = useState(0);
  const [activeFeature, setActiveFeature] = useState(0);

  const category = featureCategories[activeCat];
  const feature = category.features[activeFeature];

  const handleCatChange = (index: number) => {
    setActiveCat(index);
    setActiveFeature(0);
  };

  return (
    <section id="features" style={{ background: '#000', padding: '100px 24px 120px' }}>
      <div className="max-w-[980px] mx-auto">
        {/* Section header */}
        <Reveal>
          <div className="text-center mb-12">
            <h2
              style={{
                fontFamily: sf,
                fontSize: 'clamp(32px, 5vw, 40px)',
                fontWeight: 600,
                lineHeight: 1.1,
                color: '#fff',
              }}
            >
              Everything your agency needs.
            </h2>
            <p
              style={{
                fontFamily: sf,
                fontSize: 17,
                fontWeight: 400,
                lineHeight: 1.47,
                letterSpacing: '-0.374px',
                color: 'rgba(255,255,255,0.48)',
                marginTop: 8,
              }}
            >
              Nothing it doesn't.
            </p>
          </div>
        </Reveal>

        {/* Category tabs — pill row */}
        <Reveal delay={0.1}>
          <div
            className="flex items-center justify-center gap-2 flex-wrap mb-12"
            role="tablist"
          >
            {featureCategories.map((cat, i) => (
              <button
                key={cat.tab}
                role="tab"
                aria-selected={i === activeCat}
                onClick={() => handleCatChange(i)}
                style={{
                  fontFamily: sf,
                  fontSize: 14,
                  fontWeight: i === activeCat ? 600 : 400,
                  letterSpacing: '-0.224px',
                  color: i === activeCat ? '#fff' : 'rgba(255,255,255,0.48)',
                  background: i === activeCat ? '#1d1d1f' : 'transparent',
                  border: i === activeCat ? '1px solid rgba(255,255,255,0.12)' : '1px solid transparent',
                  borderRadius: 980,
                  padding: '8px 20px',
                  cursor: 'pointer',
                  transition: 'all 0.3s',
                }}
                className="hover:text-white"
              >
                {cat.tab}
              </button>
            ))}
          </div>
        </Reveal>

        {/* Hero showcase area */}
        <motion.div
          key={`${activeCat}-${activeFeature}`}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          <div
            style={{
              background: 'rgba(255,255,255,0.04)',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
              border: '1px solid rgba(255,255,255,0.06)',
              borderRadius: 12,
              overflow: 'hidden',
            }}
          >
            {/* Text + image layout */}
            <div className="grid grid-cols-1 md:grid-cols-2 items-center">
              {/* Copy side */}
              <div style={{ padding: '48px 40px' }}>
                <p
                  style={{
                    fontFamily: sf,
                    fontSize: 12,
                    fontWeight: 600,
                    lineHeight: 1.33,
                    letterSpacing: '-0.12px',
                    color: '#0071e3',
                    textTransform: 'uppercase',
                    marginBottom: 12,
                  }}
                >
                  {category.tab}
                </p>
                <h3
                  style={{
                    fontFamily: sf,
                    fontSize: 'clamp(28px, 4vw, 40px)',
                    fontWeight: 600,
                    lineHeight: 1.1,
                    color: '#fff',
                    marginBottom: 12,
                  }}
                >
                  {feature.headline}
                </h3>
                <p
                  style={{
                    fontFamily: sf,
                    fontSize: 17,
                    fontWeight: 400,
                    lineHeight: 1.47,
                    letterSpacing: '-0.374px',
                    color: 'rgba(255,255,255,0.6)',
                  }}
                >
                  {feature.sub}
                </p>
              </div>

              {/* Screenshot side */}
              <div style={{ padding: '24px 24px 0', display: 'flex', justifyContent: 'center', alignItems: 'flex-end' }}>
                <img
                  src={feature.img}
                  alt={feature.label}
                  style={{
                    width: '100%',
                    maxWidth: 420,
                    borderRadius: '8px 8px 0 0',
                  }}
                />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Feature selector pills — below the showcase */}
        <div className="flex items-center justify-center gap-3 mt-6 flex-wrap">
          {category.features.map((f, i) => (
            <button
              key={f.label}
              onClick={() => setActiveFeature(i)}
              style={{
                fontFamily: sf,
                fontSize: 12,
                fontWeight: i === activeFeature ? 600 : 400,
                letterSpacing: '-0.12px',
                color: i === activeFeature ? '#fff' : 'rgba(255,255,255,0.36)',
                background: 'transparent',
                border: 'none',
                borderBottom: i === activeFeature ? '2px solid #0071e3' : '2px solid transparent',
                padding: '8px 16px',
                cursor: 'pointer',
                transition: 'all 0.3s',
              }}
              className="hover:text-white/60"
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};

/* ══════════════════════════════════════════════════════
   PROGRAMS — TABBED: COACHING / SOFTWARE
   ══════════════════════════════════════════════════════ */

/* --- Shared card detail list --- */
const DetailList = ({ details, expanded }: { details: string[]; expanded: boolean }) => (
  <motion.div
    initial={false}
    animate={{ height: expanded ? 'auto' : 0, opacity: expanded ? 1 : 0 }}
    transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
    style={{ overflow: 'hidden', flex: expanded ? 1 : undefined }}
  >
    <ul style={{ margin: 0, padding: 0, listStyle: 'none', marginBottom: 24 }}>
      {details.map((detail) => (
        <li
          key={detail}
          style={{
            fontFamily: sf, fontSize: 14, fontWeight: 400, lineHeight: 1.43, letterSpacing: '-0.224px',
            color: '#1d1d1f', padding: '6px 0', borderBottom: '1px solid rgba(0,0,0,0.06)',
            display: 'flex', alignItems: 'center', gap: 8,
          }}
        >
          <span style={{ color: '#0071e3', fontSize: 14, flexShrink: 0 }}>&#10003;</span>
          {detail}
        </li>
      ))}
    </ul>
  </motion.div>
);

/* --- Coaching programs --- */
const coachingPrograms = [
  {
    label: '1:1 Coaching',
    title: 'Partnership',
    description: 'The highest level — full-access private coaching, custom strategy, and direct line to Justin.',
    details: [
      'Everything in Directive +',
      'Unlimited private access to Justin',
      'Custom agency growth roadmap',
      'Full Agency Brain Pro buildout',
      'On-call support for your entire team',
      'Priority scheduling, no waitlist',
    ],
    price: null,
    soldOut: true,
    action: 'sold-out' as const,
  },
  {
    label: '1:1 Coaching',
    title: 'The Directive',
    description: 'High-touch 1:1 implementation and pressure-tested accountability.',
    details: [
      'Everything included in Boardroom +',
      'Monthly 2-hour private sessions with Justin',
      'Custom Agency Brain buildout for your agency',
      'Direct access between sessions',
      'Custom strategy + accountability plan',
      'Priority support for your entire team',
    ],
    price: 'Application Only',
    soldOut: false,
    action: 'directive' as const,
  },
  {
    label: 'Membership',
    title: 'The Boardroom',
    description: 'Monthly coaching + accountability for owners who want steady momentum.',
    details: [
      'Live monthly group coaching with Justin',
      'Hot-seat problem solving with other owners',
      'AgencyBrain Core Access',
      'Team training library + scripts',
      'Ongoing accountability between calls',
      'Private Boardroom community access',
    ],
    price: '$299/mo',
    soldOut: false,
    action: 'link' as const,
    href: 'https://buy.stripe.com/aFa9AT4KOayO0hycG84Vy0l',
    cta: 'Join The Boardroom',
  },
  {
    label: 'Manager Training',
    title: '8 Week Experience',
    description: 'For teams stuck in "great month / bad month" cycles.',
    details: [
      '8 live coaching calls over 8 weeks',
      'Complete sales management system install',
      'Accountability + consequence ladder framework',
      'Full Agency Brain access for your team',
      'Team training library + scripts',
      'Manager playbook + scripts',
      'Post-program strategy session',
    ],
    price: null,
    soldOut: false,
    action: 'link' as const,
    href: '/sales-experience',
    cta: 'Learn More',
  },
  {
    label: 'Team Sprint',
    title: '6 Week Producer Challenge',
    description: 'For owners who need producers executing now, not "eventually."',
    details: [
      '30 Training Modules',
      '7 Sunday Target Setting Modules',
      'Direct Reflection & Action Item Takeaways',
      'Agency Owner/Mgr have full view of takeaways',
      'Sales Process Training',
      'Daily Habit Training',
    ],
    price: '$299 per producer',
    soldOut: false,
    action: 'link' as const,
    href: 'https://myagencybrain.com/six-week-challenge',
    cta: 'Start the Challenge',
  },
];

/* --- Software plans --- */
const softwarePlans = [
  {
    planId: 'agencybrain_core' as AgencyBrainPlanId,
    label: 'Limited AI Features',
    title: 'Agency Brain Core',
    description: 'Software-only access to the operating system for your agency — dashboards, training, accountability, and team management.',
    details: [
      'Sales dashboard + analytics',
      'Pipeline intelligence',
      'Team training library',
      'Renewal tracking',
      'Cancel audit + winback',
      'Habit tracking + target setting',
      'Phone report analytics',
      '20 AI call scoring credits per month',
      'Unlimited users',
    ],
    price: '$299/mo',
    cta: 'Start Core',
  },
  {
    planId: 'agencybrain_pro' as AgencyBrainPlanId,
    label: 'Full AI Feature Access',
    title: 'Agency Brain Pro',
    description: 'Full software access with Hunter Calls, expanded call scoring, AI roleplay, and the complete Agency Brain toolkit.',
    details: [
      'Everything in Core +',
      '100 AI call scoring credits per month',
      'AI roleplay trainer',
      'Business metrics analyzation tool',
      'Marketing ROI tracking',
      'Phone report analytics',
      'Advanced sales analytics',
      'Priority support',
      'Full 1:1 client-level platform access',
      'Unlimited users',
    ],
    price: '$599/mo',
    cta: 'Start Pro',
    featured: true,
  },
];

/* --- Coaching card --- */
const CoachingCard = ({ program, onDirectiveClick }: { program: typeof coachingPrograms[0]; onDirectiveClick: () => void }) => {
  const [expanded, setExpanded] = useState(false);
  const isSoldOut = program.soldOut;

  return (
    <div
      style={{
        background: '#fff',
        borderRadius: 12,
        padding: 32,
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        position: 'relative',
        overflow: 'hidden',
        opacity: isSoldOut ? 0.85 : 1,
      }}
    >
      {/* SOLD OUT banner */}
      {isSoldOut && (
        <div style={{
          position: 'absolute', top: 20, right: -32,
          background: '#ff3b30', color: '#fff',
          fontFamily: sf, fontSize: 11, fontWeight: 700, letterSpacing: '0.5px', textTransform: 'uppercase',
          padding: '6px 40px', transform: 'rotate(45deg)',
          boxShadow: '0 2px 8px rgba(255,59,48,0.3)',
        }}>
          Sold Out
        </div>
      )}

      <p style={{
        fontFamily: sf, fontSize: 12, fontWeight: 600, lineHeight: 1.33, letterSpacing: '-0.12px',
        color: isSoldOut ? '#ff3b30' : '#0071e3', textTransform: 'uppercase', marginBottom: 8,
      }}>
        {program.label}
      </p>
      <h3 style={{
        fontFamily: sf, fontSize: 28, fontWeight: 600, lineHeight: 1.14,
        letterSpacing: '0.196px', color: '#1d1d1f', marginBottom: 8,
      }}>
        {program.title}
      </h3>
      <p style={{
        fontFamily: sf, fontSize: 17, fontWeight: 400, lineHeight: 1.47, letterSpacing: '-0.374px',
        color: 'rgba(0,0,0,0.48)', marginBottom: expanded ? 16 : 24, flex: expanded ? undefined : 1,
      }}>
        {program.description}
      </p>

      <DetailList details={program.details} expanded={expanded} />

      {program.price && (
        <p style={{
          fontFamily: sf, fontSize: 21, fontWeight: 600, lineHeight: 1.19,
          letterSpacing: '0.231px', color: '#1d1d1f', marginBottom: 16,
        }}>
          {program.price}
        </p>
      )}

      <div className="flex items-center gap-4 flex-wrap">
        {isSoldOut ? (
          <span style={{
            fontFamily: sf, fontSize: 14, fontWeight: 600, letterSpacing: '-0.224px',
            color: '#ff3b30', textTransform: 'uppercase',
          }}>
            Currently Unavailable
          </span>
        ) : program.action === 'directive' ? (
          <button onClick={onDirectiveClick} style={{
            fontFamily: sf, fontSize: 17, fontWeight: 400, color: '#fff', background: '#0071e3',
            border: '1px solid transparent', borderRadius: 8, padding: '8px 20px', cursor: 'pointer',
          }} className="hover:brightness-110 transition-all">
            Apply Now
          </button>
        ) : (
          <a
            href={program.href}
            {...(program.href?.startsWith('/') ? {} : { target: '_blank', rel: 'noopener noreferrer' })}
            style={{
              fontFamily: sf, fontSize: 17, fontWeight: 400, color: '#fff', background: '#0071e3',
              border: '1px solid transparent', borderRadius: 8, padding: '8px 20px', textDecoration: 'none',
            }} className="hover:brightness-110 transition-all">
            {program.cta}
          </a>
        )}

        <button
          onClick={() => setExpanded(!expanded)}
          style={{
            fontFamily: sf, fontSize: 14, fontWeight: 400, lineHeight: 1.43, letterSpacing: '-0.224px',
            color: '#0066cc', background: 'none', border: 'none', cursor: 'pointer', padding: 0,
          }}
          className="hover:underline"
        >
          {expanded ? 'Less' : 'Learn more'} {expanded ? '\u2303' : '>'}
        </button>
      </div>
    </div>
  );
};

/* --- Software card --- */
const SoftwareCard = ({ plan }: { plan: typeof softwarePlans[0] }) => {
  const [expanded, setExpanded] = useState(false);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);

  const startCheckout = async () => {
    setIsCheckingOut(true);
    setCheckoutError(null);

    try {
      const response = await fetch(AGENCYBRAIN_CHECKOUT_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          plan_id: plan.planId,
          success_url: AGENCYBRAIN_SUCCESS_URL,
          cancel_url: window.location.href,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data?.url) {
        throw new Error(data?.error || 'Unable to start checkout.');
      }

      window.location.href = data.url;
    } catch (error) {
      setCheckoutError(error instanceof Error ? error.message : 'Unable to start checkout.');
      setIsCheckingOut(false);
    }
  };

  return (
    <div
      style={{
        background: '#fff',
        borderRadius: 12,
        padding: 32,
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        border: plan.featured ? '2px solid #0071e3' : 'none',
      }}
    >
      {plan.featured && (
        <p style={{
          fontFamily: sf, fontSize: 11, fontWeight: 700, letterSpacing: '0.5px', textTransform: 'uppercase',
          color: '#fff', background: '#0071e3', borderRadius: 980, padding: '4px 12px',
          display: 'inline-block', width: 'fit-content', marginBottom: 12,
        }}>
          Most Popular
        </p>
      )}
      <p style={{
        fontFamily: sf, fontSize: 12, fontWeight: 600, lineHeight: 1.33, letterSpacing: '-0.12px',
        color: '#0071e3', textTransform: 'uppercase', marginBottom: 8,
      }}>
        {plan.label}
      </p>
      <h3 style={{
        fontFamily: sf, fontSize: 28, fontWeight: 600, lineHeight: 1.14,
        letterSpacing: '0.196px', color: '#1d1d1f', marginBottom: 8,
      }}>
        {plan.title}
      </h3>
      <p style={{
        fontFamily: sf, fontSize: 17, fontWeight: 400, lineHeight: 1.47, letterSpacing: '-0.374px',
        color: 'rgba(0,0,0,0.48)', marginBottom: expanded ? 16 : 24, flex: expanded ? undefined : 1,
      }}>
        {plan.description}
      </p>

      <DetailList details={plan.details} expanded={expanded} />

      <p style={{
        fontFamily: sf, fontSize: 40, fontWeight: 600, lineHeight: 1.07, letterSpacing: '-0.28px',
        color: '#1d1d1f', marginBottom: 4,
      }}>
        {plan.price}
      </p>
      <p style={{
        fontFamily: sf, fontSize: 12, fontWeight: 400, letterSpacing: '-0.12px',
        color: 'rgba(0,0,0,0.36)', marginBottom: 20,
      }}>
        per month
      </p>

      <div className="flex items-center gap-4 flex-wrap">
        <button
          type="button"
          onClick={startCheckout}
          disabled={isCheckingOut}
          style={{
            fontFamily: sf, fontSize: 17, fontWeight: 400,
            color: plan.featured ? '#fff' : '#0071e3',
            background: plan.featured ? '#0071e3' : 'transparent',
            border: plan.featured ? '1px solid transparent' : '1px solid #0071e3',
            borderRadius: 8, padding: '8px 20px', textDecoration: 'none',
            cursor: isCheckingOut ? 'not-allowed' : 'pointer',
            opacity: isCheckingOut ? 0.7 : 1,
          }}
          className="hover:brightness-110 transition-all"
        >
          {isCheckingOut ? 'Opening checkout...' : plan.cta}
        </button>

        <button
          onClick={() => setExpanded(!expanded)}
          style={{
            fontFamily: sf, fontSize: 14, fontWeight: 400, lineHeight: 1.43, letterSpacing: '-0.224px',
            color: '#0066cc', background: 'none', border: 'none', cursor: 'pointer', padding: 0,
          }}
          className="hover:underline"
        >
          {expanded ? 'Less' : 'Learn more'} {expanded ? '\u2303' : '>'}
        </button>
      </div>

      {checkoutError && (
        <p style={{
          fontFamily: sf, fontSize: 13, fontWeight: 400, lineHeight: 1.38,
          color: '#b42318', marginTop: 12,
        }}>
          {checkoutError}
        </p>
      )}
    </div>
  );
};

/* --- Programs section with tabs --- */
const ProgramsSection = () => {
  const [activeTab, setActiveTab] = useState<'coaching' | 'software'>('coaching');
  const [directiveModalOpen, setDirectiveModalOpen] = useState(false);
  const [fitModalOpen, setFitModalOpen] = useState(false);

  const SHOW_SOFTWARE_TAB = true;
  const tabs = [
    { key: 'coaching' as const, label: 'Coaching Programs' },
    ...(SHOW_SOFTWARE_TAB ? [{ key: 'software' as const, label: 'Software Only' }] : []),
  ];

  return (
    <section id="programs" style={{ background: '#f5f5f7', padding: '120px 24px' }}>
      <div className="max-w-[980px] mx-auto">
        <Reveal>
          <div className="text-center mb-10">
            <h2 style={{
              fontFamily: sf, fontSize: 'clamp(32px, 5vw, 56px)', fontWeight: 600,
              lineHeight: 1.07, letterSpacing: '-0.28px', color: '#1d1d1f',
            }}>
              Pick your path.
            </h2>
            <p style={{
              fontFamily: sf, fontSize: 17, fontWeight: 400, lineHeight: 1.47,
              letterSpacing: '-0.374px', color: 'rgba(0,0,0,0.48)', marginTop: 8,
            }}>
              {SHOW_SOFTWARE_TAB ? 'Coaching with Agency Brain included, or the software on its own.' : 'No contracts. Just the right move for where your agency is right now.'}
            </p>
          </div>
        </Reveal>

        {/* Tab switcher — hidden when only one tab */}
        {tabs.length > 1 && <Reveal delay={0.1}>
          <div className="flex items-center justify-center gap-2 mb-12" role="tablist">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                role="tab"
                aria-selected={activeTab === tab.key}
                onClick={() => setActiveTab(tab.key)}
                style={{
                  fontFamily: sf, fontSize: 14, fontWeight: activeTab === tab.key ? 600 : 400,
                  letterSpacing: '-0.224px',
                  color: activeTab === tab.key ? '#1d1d1f' : 'rgba(0,0,0,0.48)',
                  background: activeTab === tab.key ? '#fff' : 'transparent',
                  border: 'none', borderRadius: 980, padding: '8px 24px', cursor: 'pointer',
                  transition: 'all 0.3s',
                  boxShadow: activeTab === tab.key ? 'rgba(0,0,0,0.08) 0 2px 8px' : 'none',
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </Reveal>}

        {/* Tab content */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          {activeTab === 'coaching' ? (
            <>
              {/* Top row: Partnership + Directive (1:1 tiers) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                {coachingPrograms.slice(0, 2).map((program) => (
                  <CoachingCard key={program.title} program={program} onDirectiveClick={() => setDirectiveModalOpen(true)} />
                ))}
              </div>
              {/* Bottom row: Boardroom, 8 Week, 6 Week */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {coachingPrograms.slice(2).map((program) => (
                  <CoachingCard key={program.title} program={program} onDirectiveClick={() => setDirectiveModalOpen(true)} />
                ))}
              </div>
              <div style={{
                textAlign: 'center', marginTop: 24, padding: '16px 24px',
                background: '#fff', borderRadius: 8,
              }}>
                <p style={{
                  fontFamily: sf, fontSize: 17, fontWeight: 600, lineHeight: 1.47,
                  letterSpacing: '-0.374px', color: '#1d1d1f',
                }}>
                  All coaching programs include some level of Agency Brain access.
                </p>
              </div>
            </>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-[720px] mx-auto">
              {softwarePlans.map((plan) => (
                <SoftwareCard key={plan.title} plan={plan} />
              ))}
            </div>
          )}
        </motion.div>

        {/* Bottom CTA */}
        <Reveal>
          <div className="text-center mt-16">
            <p style={{
              fontFamily: sf, fontSize: 21, fontWeight: 600, lineHeight: 1.19,
              letterSpacing: '0.231px', color: '#1d1d1f', marginBottom: 8,
            }}>
              Not sure where to start?
            </p>
            <p style={{
              fontFamily: sf, fontSize: 17, fontWeight: 400, lineHeight: 1.47,
              letterSpacing: '-0.374px', color: 'rgba(0,0,0,0.48)', marginBottom: 20,
            }}>
              Book a quick strategy call. We'll map your best first move.
            </p>
            <button
              onClick={() => setFitModalOpen(true)}
              style={{
                fontFamily: sf, fontSize: 17, fontWeight: 400, color: '#fff', background: '#0071e3',
                border: '1px solid transparent', borderRadius: 980, padding: '12px 28px', cursor: 'pointer',
              }}
              className="hover:brightness-110 transition-all"
            >
              Book Your Strategy Call
            </button>
            <StandardFitModal open={fitModalOpen} onOpenChange={setFitModalOpen} />
          </div>
        </Reveal>
      </div>

      <DirectiveApplicationModal open={directiveModalOpen} onOpenChange={setDirectiveModalOpen} />
    </section>
  );
};

/* ══════════════════════════════════════════════════════
   PROBLEM STATEMENT — BLACK SECTION
   ══════════════════════════════════════════════════════ */
const ProblemSection = () => (
  <section style={{ background: '#000', padding: '120px 24px' }}>
    <div className="max-w-[980px] mx-auto text-center">
      <Reveal>
        <p
          style={{
            fontFamily: sf,
            fontSize: 14,
            fontWeight: 600,
            letterSpacing: '-0.224px',
            color: 'rgba(255,255,255,0.48)',
            textTransform: 'uppercase',
            marginBottom: 16,
          }}
        >
          The Problem
        </p>
      </Reveal>
      <Reveal delay={0.1}>
        <h2
          style={{
            fontFamily: sf,
            fontSize: 'clamp(32px, 6vw, 56px)',
            fontWeight: 600,
            lineHeight: 1.07,
            letterSpacing: '-0.28px',
            color: '#fff',
          }}
        >
          Most agencies run on duct tape and gut feelings.
        </h2>
      </Reveal>
      <Reveal delay={0.2}>
        <p
          style={{
            fontFamily: sf,
            fontSize: 'clamp(28px, 5vw, 40px)',
            fontWeight: 600,
            lineHeight: 1.1,
            color: '#0071e3',
            marginTop: 20,
          }}
        >
          Yours won't.
        </p>
      </Reveal>
    </div>
  </section>
);

/* ══════════════════════════════════════════════════════
   FOOTER — MINIMAL APPLE STYLE
   ══════════════════════════════════════════════════════ */
const AppleFooter = () => (
  <footer style={{ background: '#f5f5f7', borderTop: '1px solid rgba(0,0,0,0.08)', padding: '20px 24px' }}>
    <div className="max-w-[980px] mx-auto">
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <p
          style={{
            fontFamily: sf,
            fontSize: 12,
            fontWeight: 400,
            lineHeight: 1.33,
            letterSpacing: '-0.12px',
            color: 'rgba(0,0,0,0.48)',
          }}
        >
          Copyright &copy; {new Date().getFullYear()} Standard Playbook Inc. All rights reserved.
        </p>
        <div className="flex items-center gap-6">
          {[
            { label: 'Privacy', to: '/privacy' },
            { label: 'Terms', to: '/terms' },
            { label: 'Contact', to: '/contact' },
          ].map((link, i) => (
            <span key={link.label} className="flex items-center gap-6">
              {i > 0 && (
                <span style={{ color: 'rgba(0,0,0,0.12)', fontSize: 10 }}>|</span>
              )}
              <Link
                to={link.to}
                style={{
                  fontFamily: sf,
                  fontSize: 12,
                  fontWeight: 400,
                  letterSpacing: '-0.12px',
                  color: 'rgba(0,0,0,0.48)',
                  textDecoration: 'none',
                }}
                className="hover:text-[#1d1d1f] transition-colors"
              >
                {link.label}
              </Link>
            </span>
          ))}
        </div>
      </div>
    </div>
  </footer>
);

/* ══════════════════════════════════════════════════════
   PAGE
   ══════════════════════════════════════════════════════ */
const AppleMockup = () => (
  <div style={{ fontFamily: sf, background: '#000' }}>
    <AppleNav />
    <HeroSection />
    <PillarsSection />
    <ProblemSection />
    <AgencyBrainHero />
    <FeatureShowcase />
    <ProgramsSection />
    <AppleFooter />
  </div>
);

export default AppleMockup;
