import { useRef, useState, useCallback, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import useEmblaCarousel from 'embla-carousel-react';
import standardLogo from '@/assets/standard-word-logo.png';
import lqsImg from '@/assets/lqs.png';
import salesDashImg from '@/assets/sales-dashboard.png';
import winbackImg from '@/assets/winback-hq.png';
import trainingImg from '@/assets/training-videos.png';
import renewalsImg from '@/assets/renewals.png';
import agencyBrainLogo from '@/assets/agency-brain-logo.png';
import marketingRoiImg from '@/assets/marketing-roi.png';
import teamTrainingImg from '@/assets/team-training.png';
import aiRoleplayImg from '@/assets/ai-roleplay-bot.png';
import cancelAuditImg from '@/assets/cancel-audit.png';
import callScoringImg from '@/assets/call-scoring.png';
import salesAnalyticsImg from '@/assets/sales-analytics.png';
import targetSettingImg from '@/assets/target-setting.png';
import habitTrackingImg from '@/assets/habit-tracking.png';

/* ── Fade-in wrapper ── */
const Reveal = ({ children, className = '', delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) => (
  <motion.div
    initial={{ opacity: 0, y: 40 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: '-80px' }}
    transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
    className={className}
  >
    {children}
  </motion.div>
);

/* ══════════════════════════════════════════════════════
   SECTION 1 — THE HOOK (Video Background)
   ══════════════════════════════════════════════════════ */
const HookSection = () => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const textY = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const opacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);

  return (
    <section ref={ref} className="relative h-[200vh]">
      {/* Sticky video container */}
      <div className="sticky top-0 h-screen overflow-hidden flex items-center justify-center">
        {/* Video BG */}
        <video
          autoPlay muted loop playsInline
          className="absolute inset-0 w-full h-full object-cover"
          src="/background.mp4"
        />
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-black/60" />

        {/* Content */}
        <motion.div style={{ y: textY, opacity }} className="relative z-10 text-center px-6 max-w-5xl mx-auto">
          <img src={standardLogo} alt="Standard Playbook" className="mx-auto w-64 md:w-96 mb-12" />
          <h1 className="font-oswald font-bold text-3xl sm:text-5xl md:text-7xl text-white leading-[1.1] tracking-tight">
            You built the agency.<br />
            <span className="text-gray-400">But somewhere along the way,</span><br />
            <span className="text-gray-400">it started building you.</span>
          </h1>
        </motion.div>
      </div>

      {/* Core 4 parallax reveal at bottom of scroll range */}
      <div className="absolute bottom-0 left-0 right-0 h-screen flex items-center justify-center pointer-events-none">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2 }}
          className="text-center px-6"
        >
          <p className="text-sm uppercase tracking-[0.4em] text-blue-400 mb-6 font-medium">The Standard is built on four pillars</p>
          <div className="flex flex-wrap justify-center gap-6 md:gap-12">
            {['BUSINESS', 'BEING', 'BODY', 'BALANCE'].map((word, i) => (
              <motion.span
                key={word}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 + i * 0.15, duration: 0.6 }}
                className="font-oswald font-bold text-3xl md:text-5xl text-white"
              >
                {word}<span className="text-blue-500">.</span>
              </motion.span>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

/* ══════════════════════════════════════════════════════
   SECTION 2 — THE PIVOT (Problem vs Solution)
   ══════════════════════════════════════════════════════ */
const PivotSection = () => (
  <section className="relative py-32 md:py-48 px-6 bg-[#020617]">
    <div className="max-w-4xl mx-auto text-center">
      <Reveal>
        <p className="text-lg md:text-xl text-gray-500 mb-4 uppercase tracking-widest font-medium">The Problem</p>
      </Reveal>
      <Reveal delay={0.1}>
        <h2 className="font-oswald font-bold text-3xl sm:text-5xl md:text-7xl text-white leading-[1.1] mb-8">
          Most agencies run on<br />duct tape and gut feelings.
        </h2>
      </Reveal>
      <Reveal delay={0.2}>
        <p className="font-oswald font-bold text-4xl sm:text-6xl md:text-8xl text-blue-500 mb-16">
          Yours won't.
        </p>
      </Reveal>

      {/* Glowing divider */}
      <Reveal delay={0.3}>
        <div className="relative mx-auto w-full max-w-xl h-px mb-16">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-500 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-500 to-transparent blur-md" />
        </div>
      </Reveal>

      <Reveal delay={0.4}>
        <p className="text-sm uppercase tracking-[0.3em] text-gray-500 mb-6">Introducing</p>
        <img src={agencyBrainLogo} alt="Agency Brain" className="mx-auto w-[80%] md:w-[600px] lg:w-[720px] mb-6" />
        <p className="text-gray-400 text-lg mt-4 max-w-2xl mx-auto">
          The operating system that turns chaos into clarity. Your pipeline, your team, your retention — all in one place.
        </p>
      </Reveal>
    </div>
  </section>
);

/* ══════════════════════════════════════════════════════
   SECTION 3 — THE OPERATING SYSTEM (Agency Brain)
   ══════════════════════════════════════════════════════ */
const brainCards = [
  { headline: 'Stop Guessing.', sub: 'See every lead, every stage, every dollar — in real time.', img: lqsImg, label: 'Pipeline Intelligence' },
  { headline: 'Total Visibility.', sub: 'Know exactly where your team stands every single day.', img: salesDashImg, label: 'Sales Dashboard' },
  { headline: 'Stop the Bleed.', sub: 'Catch cancellations before they cost you.', img: winbackImg, label: 'Winback HQ' },
  { headline: 'Stay Ahead.', sub: 'Proactively manage renewals so nothing slips.', img: renewalsImg, label: 'Renewal Tracking' },
  { headline: 'Track Your ROI.', sub: 'See exactly what your marketing spend is producing — leads, quotes, premium, commission.', img: marketingRoiImg, label: 'Marketing ROI' },
  { headline: 'Sales Breakdown.', sub: 'Drill into premium, items, policies, and points — by date, source, or bundle.', img: salesAnalyticsImg, label: 'Sales Analytics' },
  { headline: 'Score Every Call.', sub: 'AI-powered call audits with execution checklists and talk-to-listen ratios.', img: callScoringImg, label: 'Call Scoring' },
  { headline: 'Train Your Team.', sub: 'A full training library with structured bootcamps — accessible right inside the app.', img: teamTrainingImg, label: 'Team Training' },
  { headline: 'Practice Makes Perfect.', sub: 'AI roleplay bot lets your producers sharpen their pitch anytime, anywhere.', img: aiRoleplayImg, label: 'AI Roleplay Trainer' },
  { headline: 'Cancel Audit.', sub: 'Track cancellations, at-risk premium, and saved dollars — week by week.', img: cancelAuditImg, label: 'Cancel Audit' },
  { headline: 'Set Your Targets.', sub: 'Plan your 90-day action map — quarterly goals broken into daily habits.', img: targetSettingImg, label: 'Target Setting' },
  { headline: 'Build The Habits.', sub: 'Core 4 + Flow tracking: Body, Being, Balance, Business — with team leaderboards.', img: habitTrackingImg, label: 'Habit Tracking' },
];

const AgencyBrainSection = () => {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: 'center', skipSnaps: false });
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [scrollSnaps, setScrollSnaps] = useState<number[]>([]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    setScrollSnaps(emblaApi.scrollSnapList());
    emblaApi.on('select', onSelect);
    onSelect();
    return () => { emblaApi.off('select', onSelect); };
  }, [emblaApi, onSelect]);

  const scrollTo = useCallback((index: number) => emblaApi && emblaApi.scrollTo(index), [emblaApi]);

  return (
    <section className="relative py-24 md:py-40 bg-gradient-to-b from-[#020617] to-black overflow-hidden">
      <div className="px-6">
        <Reveal className="text-center mb-16 md:mb-24">
          <p className="text-sm uppercase tracking-[0.3em] text-blue-400 mb-3">Inside Agency Brain</p>
          <h2 className="font-oswald font-bold text-3xl md:text-6xl text-white">
            Everything your agency needs.<br className="hidden md:block" /> Nothing it doesn't.
          </h2>
        </Reveal>

        {/* Carousel */}
        <div className="max-w-5xl mx-auto">
          <div className="overflow-hidden" ref={emblaRef}>
            <div className="flex">
              {brainCards.map((card) => (
                <div key={card.label} className="flex-[0_0_85%] sm:flex-[0_0_60%] md:flex-[0_0_45%] min-w-0 px-3">
                  <div className="relative group rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-xl p-6 hover:border-blue-500/40 transition-colors duration-500">
                    <p className="text-xs uppercase tracking-widest text-blue-400 mb-2">{card.label}</p>
                    <h3 className="font-oswald font-bold text-2xl text-white mb-2">{card.headline}</h3>
                    <p className="text-gray-400 text-sm mb-6">{card.sub}</p>
                    <div className="relative">
                      <img src={card.img} alt={card.label} className="w-full rounded-xl shadow-2xl shadow-blue-500/10 group-hover:scale-[1.02] transition-transform duration-500" />
                      <div className="absolute -inset-4 bg-blue-500/10 rounded-2xl blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Navigation arrows + dots */}
          <div className="flex items-center justify-center gap-6 mt-8">
            <button
              onClick={() => emblaApi?.scrollPrev()}
              className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center text-white hover:border-blue-500/60 hover:bg-blue-500/10 transition-colors"
              aria-label="Previous slide"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
            </button>

            <div className="flex gap-2">
              {scrollSnaps.map((_, i) => (
                <button
                  key={i}
                  onClick={() => scrollTo(i)}
                  className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                    i === selectedIndex ? 'bg-blue-500 scale-125' : 'bg-white/20 hover:bg-white/40'
                  }`}
                  aria-label={`Go to slide ${i + 1}`}
                />
              ))}
            </div>

            <button
              onClick={() => emblaApi?.scrollNext()}
              className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center text-white hover:border-blue-500/60 hover:bg-blue-500/10 transition-colors"
              aria-label="Next slide"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

/* ══════════════════════════════════════════════════════
   SECTION 4 — THE OFFER LADDER (3 Ways In)
   ══════════════════════════════════════════════════════ */
const offers = [
  {
    tag: 'THE MEMBERSHIP',
    title: 'The Boardroom.',
    description: 'The Standard Membership. Weekly calls. Private network. Core Brain Access.',
    price: '$299/mo',
    cta: 'Join The Boardroom',
    href: '/boardroom',
    img: null,
  },
  {
    tag: 'THE TRAINING',
    title: 'Install The System.',
    description: "Don't just track the team. Train them. An 8-Week Bootcamp integrated into your dashboard.",
    price: null,
    cta: 'Explore The Experience',
    href: '/sales-experience',
    img: trainingImg,
  },
  {
    tag: 'THE PARTNERSHIP',
    title: 'Proximity is Power.',
    description: 'Direct 1:1 Access to Justin. Strategy. Speed. The highest level.',
    price: null,
    cta: 'Apply for Partnership',
    href: 'https://AGENCYCOACHING.as.me/standardfit',
    external: true,
    img: null,
  },
];

const OfferLadderSection = () => (
  <section className="relative py-24 md:py-40 px-6 bg-black">
    <Reveal className="text-center mb-16 md:mb-24 max-w-3xl mx-auto">
      <p className="text-sm uppercase tracking-[0.3em] text-blue-400 mb-3">Choose Your Path</p>
      <h2 className="font-oswald font-bold text-3xl md:text-6xl text-white">
        Three ways in.<br />One standard.
      </h2>
    </Reveal>

    <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
      {offers.map((offer, i) => (
        <Reveal key={offer.tag} delay={i * 0.12}>
          <div className="group relative rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-xl p-8 flex flex-col h-full hover:border-blue-500/40 transition-colors duration-500">
            {/* Hover glow */}
            <div className="absolute -inset-px rounded-2xl bg-gradient-to-b from-blue-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10 blur-xl" />

            <p className="text-xs uppercase tracking-widest text-blue-400 mb-4">{offer.tag}</p>
            <h3 className="font-oswald font-bold text-2xl md:text-3xl text-white mb-3">{offer.title}</h3>
            <p className="text-gray-400 mb-6 flex-grow">{offer.description}</p>

            {offer.img && (
              <img src={offer.img} alt={offer.title} className="w-full rounded-xl mb-6 shadow-lg shadow-blue-500/5" />
            )}

            {offer.price && (
              <p className="font-oswald font-bold text-3xl text-white mb-6">{offer.price}</p>
            )}

            {/* Notification card for Partnership */}
            {offer.tag === 'THE PARTNERSHIP' && (
              <div className="rounded-xl border border-white/10 bg-white/[0.05] p-4 mb-6 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center shrink-0">
                  <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
                </div>
                <div>
                  <p className="text-white text-sm font-semibold">New Video Message</p>
                  <p className="text-gray-500 text-xs">Justin just sent a strategy breakdown</p>
                </div>
              </div>
            )}

            <a
              href={offer.href}
              {...(offer.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
              className="block w-full text-center bg-white text-black font-bold text-base py-4 rounded-full hover:bg-gray-200 transition-colors duration-200 active:scale-[0.98]"
            >
              {offer.cta}
            </a>
          </div>
        </Reveal>
      ))}
    </div>
  </section>
);

/* ══════════════════════════════════════════════════════
   PAGE
   ══════════════════════════════════════════════════════ */
const NewLanding = () => (
  <div className="bg-black min-h-screen text-white overflow-x-hidden">
    <HookSection />
    <PivotSection />
    <AgencyBrainSection />
    <OfferLadderSection />

    {/* Minimal footer */}
    <footer className="py-12 px-6 text-center border-t border-white/5 bg-black">
      <img src={standardLogo} alt="Standard Playbook" className="mx-auto w-32 mb-4 opacity-50" />
      <p className="text-gray-600 text-sm">© {new Date().getFullYear()} Standard Playbook. All rights reserved.</p>
    </footer>
  </div>
);

export default NewLanding;
