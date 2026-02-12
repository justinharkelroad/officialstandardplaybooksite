import { useRef, useState, useCallback, useEffect } from 'react';
import DirectiveApplicationModal from '@/components/DirectiveApplicationModal';
import { Volume2, VolumeX, Check, RotateCcw } from 'lucide-react';
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
   SECTIONS 1+2 — MERGED SCROLLYTELLING HERO
   Video stays sticky while three text segments scroll over it
   ══════════════════════════════════════════════════════ */
const ScrollytellingHero = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ['start start', 'end end'] });

  // Helper: linearly interpolate and clamp between 0 and 1
  const lerp = (p: number, start: number, end: number) =>
    Math.max(0, Math.min(1, (p - start) / (end - start)));

  // Video fades out before Segment D (55–68%)
  const videoOpacity = useTransform(scrollYProgress, (p) => {
    if (p < 0.55) return 1;
    if (p >= 0.68) return 0;
    return 1 - lerp(p, 0.55, 0.68);
  });

  // Blue background fades in bridging C→D (62–70%)
  const blueBgOpacity = useTransform(scrollYProgress, (p) => {
    if (p < 0.62) return 0;
    if (p >= 0.70) return 1;
    return lerp(p, 0.62, 0.70);
  });

  // Segment A: fully visible 0–10%, fades to 0 by 18%, stays 0 forever after
  const aOpacity = useTransform(scrollYProgress, (p) => {
    if (p <= 0.10) return 1;
    if (p >= 0.18) return 0;
    return 1 - lerp(p, 0.10, 0.18);
  });

  // Segment B: fades in 22–28%, holds, fades out 42–50%
  const bOpacity = useTransform(scrollYProgress, (p) => {
    if (p < 0.22) return 0;
    if (p < 0.28) return lerp(p, 0.22, 0.28);
    if (p <= 0.42) return 1;
    if (p >= 0.50) return 0;
    return 1 - lerp(p, 0.42, 0.50);
  });

  // Segment C: "The Problem" — fades in 48–54%, holds, fades out 62–68%
  const cOpacity = useTransform(scrollYProgress, (p) => {
    if (p < 0.48) return 0;
    if (p < 0.54) return lerp(p, 0.48, 0.54);
    if (p <= 0.62) return 1;
    if (p >= 0.68) return 0;
    return 1 - lerp(p, 0.62, 0.68);
  });

  // Segment D: "Agency Brain intro" — fades in 70–76%, holds, fades out 88–94%
  const dOpacity = useTransform(scrollYProgress, (p) => {
    if (p < 0.70) return 0;
    if (p < 0.76) return lerp(p, 0.70, 0.76);
    if (p <= 0.88) return 1;
    if (p >= 0.94) return 0;
    return 1 - lerp(p, 0.88, 0.94);
  });

  return (
    <section ref={containerRef} className="relative" style={{ height: '500vh' }}>
      <div style={{ position: 'sticky', top: 0, height: '100vh', overflow: 'hidden' }}>
        {/* Video background */}
        <motion.div
          style={{ opacity: videoOpacity }}
          className="absolute inset-0"
          aria-hidden="true"
        >
          <video
            autoPlay muted loop playsInline
            className="absolute inset-0 w-full h-full object-cover"
            src="/background.mp4"
          />
          <div className="absolute inset-0 bg-black/50" />
        </motion.div>

        {/* Blue background layer — fades in before Segment D */}
        <motion.div
          style={{ opacity: blueBgOpacity }}
          className="absolute inset-0 bg-gradient-to-b from-[#020617] to-black"
          aria-hidden="true"
        />

        {/* ── Segment A: Logo + Hook ── */}
        <motion.div
          style={{ opacity: aOpacity }}
          className="absolute inset-0 flex items-center justify-center pointer-events-none"
        >
          <div className="text-center px-6 max-w-5xl mx-auto">
            <a
              href="https://AGENCYCOACHING.as.me/standardfit"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block mb-6 px-5 py-2 border-2 border-primary bg-transparent font-oswald font-bold text-sm md:text-base uppercase tracking-[0.15em] text-primary hover:bg-primary hover:text-white transition-all duration-300 pointer-events-auto"
            >
              Book a Discovery Call
            </a>
            <img src={standardLogo} alt="Standard Playbook" className="mx-auto w-64 md:w-96 mb-12 drop-shadow-2xl" />
            <h1 className="font-oswald font-bold text-3xl sm:text-5xl md:text-7xl text-white leading-[1.1] tracking-tight drop-shadow-[0_4px_24px_rgba(0,0,0,0.8)]">
              You built the agency.<br />
              <span className="text-gray-300">But somewhere along the way,</span><br />
              <span className="text-gray-300">it started building you.</span>
            </h1>
          </div>
        </motion.div>

        {/* ── Segment B: Core 4 Pillars ── */}
        <motion.div
          style={{ opacity: bOpacity }}
          className="absolute inset-0 flex items-center justify-center pointer-events-none"
        >
          <div className="text-center px-6">
            <p className="text-sm uppercase tracking-[0.4em] text-blue-400 mb-6 font-medium drop-shadow-lg">The Standard is built on four pillars</p>
            <div className="flex flex-wrap justify-center gap-6 md:gap-12">
              {['BUSINESS', 'BEING', 'BODY', 'BALANCE'].map((word) => (
                <span key={word} className="font-oswald font-bold text-3xl md:text-5xl text-white drop-shadow-[0_4px_24px_rgba(0,0,0,0.8)]">
                  {word}<span className="text-blue-500">.</span>
                </span>
              ))}
            </div>
          </div>
        </motion.div>

        {/* ── Segment C: The Problem ── */}
        <motion.div
          style={{ opacity: cOpacity }}
          className="absolute inset-0 flex items-center justify-center pointer-events-none"
        >
          <div className="max-w-4xl mx-auto text-center px-6">
            <p className="text-lg md:text-xl text-gray-400 mb-4 uppercase tracking-widest font-medium">The Problem</p>
            <h2 className="font-oswald font-bold text-3xl sm:text-5xl md:text-7xl text-white leading-[1.1] mb-8 drop-shadow-[0_4px_24px_rgba(0,0,0,0.8)]">
              Most agencies run on<br />duct tape and gut feelings.
            </h2>
            <p className="font-oswald font-bold text-4xl sm:text-6xl md:text-8xl text-blue-500 drop-shadow-[0_4px_24px_rgba(0,0,0,0.6)]">
              Yours won't.
            </p>
          </div>
        </motion.div>

        {/* ── Segment D: Agency Brain Intro ── */}
        <motion.div
          style={{ opacity: dOpacity }}
          className="absolute inset-0 flex items-center justify-center pointer-events-none"
        >
          <div className="max-w-4xl mx-auto text-center px-6">
            <div className="relative mx-auto w-full max-w-xl h-px mb-12">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-500 to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-500 to-transparent blur-md" />
            </div>
            <p className="text-sm uppercase tracking-[0.3em] text-gray-500 mb-6">Introducing</p>
            <img src={agencyBrainLogo} alt="Agency Brain" className="mx-auto w-[80%] md:w-[600px] lg:w-[720px] mb-6" />
            <p className="text-gray-400 text-lg mt-4 max-w-2xl mx-auto">
              The operating system that turns chaos into clarity. Your pipeline, your team, your retention — all in one place.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

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
  const [slideStyles, setSlideStyles] = useState<React.CSSProperties[]>([]);

  const computeStyles = useCallback(() => {
    if (!emblaApi) return;
    const engine = emblaApi.internalEngine();
    const scrollProgress = emblaApi.scrollProgress();
    const slides = emblaApi.slideNodes();
    const styles: React.CSSProperties[] = slides.map((_, index) => {
      let diff = emblaApi.scrollSnapList()[index] - scrollProgress;

      // Handle loop wrapping
      if (engine.options.loop) {
        const snapCount = emblaApi.scrollSnapList().length;
        // Find the shortest distance considering loop
        if (diff > 0.5) diff -= 1;
        if (diff < -0.5) diff += 1;
      }

      const absDiff = Math.abs(diff);
      const scale = Math.max(0.65, 1 - absDiff * 0.35);
      const opacity = Math.max(0.3, 1 - absDiff * 0.7);
      const translateZ = -absDiff * 250;
      const translateX = diff * 15; // slight pull toward center
      const zIndex = 100 - Math.round(absDiff * 100);

      return {
        transform: `perspective(1200px) translateX(${translateX}%) scale(${scale}) translateZ(${translateZ}px)`,
        opacity,
        zIndex,
        transition: 'transform 0.4s ease-out, opacity 0.4s ease-out',
      };
    });
    setSlideStyles(styles);
  }, [emblaApi]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    setScrollSnaps(emblaApi.scrollSnapList());
    emblaApi.on('select', onSelect);
    emblaApi.on('scroll', computeStyles);
    emblaApi.on('reInit', computeStyles);
    onSelect();
    computeStyles();
    return () => {
      emblaApi.off('select', onSelect);
      emblaApi.off('scroll', computeStyles);
      emblaApi.off('reInit', computeStyles);
    };
  }, [emblaApi, onSelect, computeStyles]);

  const scrollTo = useCallback((index: number) => emblaApi && emblaApi.scrollTo(index), [emblaApi]);

  return (
    <section className="relative z-20 py-24 md:py-40 bg-gradient-to-b from-[#020617] to-black overflow-hidden">
      <div className="px-6">
        <Reveal className="text-center mb-16 md:mb-24">
          <p className="text-sm uppercase tracking-[0.3em] text-blue-400 mb-3">Inside Agency Brain</p>
          <h2 className="font-oswald font-bold text-3xl md:text-6xl text-white">
            Everything your agency needs.<br className="hidden md:block" /> Nothing it doesn't.
          </h2>
        </Reveal>

        {/* Coverflow Carousel */}
        <div className="max-w-6xl mx-auto">
          <div className="overflow-visible" ref={emblaRef} style={{ perspective: '1200px' }}>
            <div className="flex" style={{ transformStyle: 'preserve-3d' }}>
              {brainCards.map((card, index) => (
                <div
                  key={card.label}
                  className="flex-[0_0_80%] sm:flex-[0_0_55%] md:flex-[0_0_45%] min-w-0 px-3"
                  style={slideStyles[index] || {}}
                >
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
    video: 'https://puidotfmyrouxezsorlt.supabase.co/storage/v1/object/public/public/Boardroom card video.mp4',
    benefits: [
      '2 Hour Group Boardroom Call',
      'Boardroom Level AgencyBrain Access',
      'Team Training Access',
      'I AM THE STANDARD T-Shirt',
      'I AM THE STANDARD Wristband',
      'Standard Playbook Pen',
      '20 AI Calls Scored Per Month',
      '24/7 Video Messaging for Coaching from Justin',
    ],
  },
  {
    tag: 'THE PROGRAM',
    title: '8 Week Experience.',
    description: "If you struggle with accountability and have months that are great and months that aren't, it's a reflection of your reality. Change it in 8 weeks. I literally guarantee it.",
    price: null,
    cta: 'Secure The Experience',
    href: '/sales-experience',
    img: trainingImg,
    video: 'https://puidotfmyrouxezsorlt.supabase.co/storage/v1/object/public/public/The Standard This is the 8 week experience.mp4',
    benefits: [
      '8-Week Sales Manager Training System',
      '8x 45-Minute Coaching Calls',
      'Full AgencyBrain Access for 8 Weeks',
      'Call Scoring Integration',
      'Delivered Accountability Framework',
      'Delivered Consequence Letter Framework',
      'Sales Process System',
      'Team Training Modules During Program',
      'Boardroom Call Access for Owner & Key Employee',
    ],
  },
  {
    tag: 'THE DIRECTIVE',
    title: 'Proximity is Power.',
    description: 'Direct 1:1 Access to Justin. Strategy. Speed. The highest level.',
    price: null,
    cta: 'Apply for Directive',
    href: '#directive-apply',
    isDirective: true,
    img: null,
    video: 'https://puidotfmyrouxezsorlt.supabase.co/storage/v1/object/public/public/1v1.mp4',
    benefits: [
      'Everything in Boardroom',
      '100 AI Call Scores Per Month',
      'Full AgencyBrain Access',
      '80% Off 6-Week Challenge',
      '1 Two-Hour 1-on-1 Coaching Call',
      '24/7 Access to Justin',
      'Support for New Hire Interviews',
      'AgencyBrain Customization',
    ],
  },
];

const OfferLadderSection = () => {
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);
  const [mutedStates, setMutedStates] = useState<boolean[]>(offers.map(() => true));
  const [flippedStates, setFlippedStates] = useState<boolean[]>(offers.map(() => false));
  const [directiveModalOpen, setDirectiveModalOpen] = useState(false);

  const toggleSound = (index: number) => {
    const video = videoRefs.current[index];
    if (!video) return;
    video.muted = !video.muted;
    setMutedStates(prev => prev.map((m, i) => i === index ? video.muted : m));
  };

  const toggleFlip = (index: number) => {
    setFlippedStates(prev => prev.map((f, i) => i === index ? !f : f));
  };

  return (
  <section className="relative z-20 py-24 md:py-40 px-6 bg-black">
    <Reveal className="text-center mb-16 md:mb-24 max-w-3xl mx-auto">
      <p className="text-sm uppercase tracking-[0.3em] text-blue-400 mb-3">Choose Your Path</p>
      <h2 className="font-oswald font-bold text-3xl md:text-6xl text-white">
        Three ways in.<br />One standard.
      </h2>
      <p className="text-blue-400 text-sm md:text-base mt-4 tracking-wide">No Commitments or Contracts...Ever</p>
    </Reveal>

    <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
      {offers.map((offer, i) => (
        <Reveal key={offer.tag} delay={i * 0.12}>
          {/* 3D flip wrapper */}
          <div style={{ perspective: '1200px' }} className="h-full">
            <div
              className="relative w-full transition-transform duration-[600ms]"
              style={{
                transformStyle: 'preserve-3d',
                transform: flippedStates[i] ? 'rotateY(180deg)' : 'rotateY(0deg)',
              }}
            >
              {/* ══ FRONT FACE ══ */}
              <div
                style={{
                  backfaceVisibility: 'hidden',
                  WebkitBackfaceVisibility: 'hidden',
                  pointerEvents: flippedStates[i] ? 'none' : 'auto',
                }}
              >
                <div className="group relative rounded-2xl border border-white/10 overflow-hidden flex flex-col hover:border-blue-500/40 transition-colors duration-500">
                  <div className="absolute -inset-px rounded-2xl bg-gradient-to-b from-blue-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10 blur-xl" />

                  {offer.video ? (
                    <div className="relative min-h-[480px]">
                      <video
                        ref={el => { videoRefs.current[i] = el; }}
                        src={offer.video}
                        poster={offer.img || undefined}
                        autoPlay muted loop playsInline
                        className="absolute inset-0 w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-black/60" />
                      <button
                        onClick={() => toggleSound(i)}
                        className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full bg-black/50 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white hover:bg-black/70 transition-colors"
                        aria-label={mutedStates[i] ? 'Unmute' : 'Mute'}
                      >
                        {mutedStates[i] ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                      </button>
                      <div className="relative z-10 p-8 flex flex-col min-h-[480px] justify-end">
                        <p className="text-xs uppercase tracking-widest text-blue-400 mb-4">{offer.tag}</p>
                        <h3 className="font-oswald font-bold text-2xl md:text-3xl text-white mb-3">{offer.title}</h3>
                        <p className="text-gray-300 mb-4 flex-grow">{offer.description}</p>
                        <button
                          onClick={() => toggleFlip(i)}
                          className="text-blue-400 text-sm font-medium mb-4 hover:text-blue-300 transition-colors text-left cursor-pointer"
                        >
                          See What's Included →
                        </button>
                        {offer.isDirective ? (
                          <button
                            onClick={() => setDirectiveModalOpen(true)}
                            className="block w-full text-center bg-white text-black font-bold text-base py-4 rounded-full hover:bg-gray-200 transition-colors duration-200 active:scale-[0.98]"
                          >
                            {offer.cta}
                          </button>
                        ) : (
                          <a
                            href={offer.href}
                            className="block w-full text-center bg-white text-black font-bold text-base py-4 rounded-full hover:bg-gray-200 transition-colors duration-200 active:scale-[0.98]"
                          >
                            {offer.cta}
                          </a>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="bg-white/[0.03] backdrop-blur-xl p-8 flex flex-col">
                      <p className="text-xs uppercase tracking-widest text-blue-400 mb-4">{offer.tag}</p>
                      <h3 className="font-oswald font-bold text-2xl md:text-3xl text-white mb-3">{offer.title}</h3>
                      <p className="text-gray-400 mb-4 flex-grow">{offer.description}</p>
                      {offer.img && (
                        <img src={offer.img} alt={offer.title} className="w-full rounded-xl mb-6 shadow-lg shadow-blue-500/5" />
                      )}
                      {offer.price && (
                        <p className="font-oswald font-bold text-3xl text-white mb-6">{offer.price}</p>
                      )}
                      {offer.tag === 'THE DIRECTIVE' && (
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
                      <button
                        onClick={() => toggleFlip(i)}
                        className="text-blue-400 text-sm font-medium mb-4 hover:text-blue-300 transition-colors text-left cursor-pointer"
                      >
                        See What's Included →
                      </button>
                      {offer.isDirective ? (
                        <button
                          onClick={() => setDirectiveModalOpen(true)}
                          className="block w-full text-center bg-white text-black font-bold text-base py-4 rounded-full hover:bg-gray-200 transition-colors duration-200 active:scale-[0.98]"
                        >
                          {offer.cta}
                        </button>
                      ) : (
                        <a
                          href={offer.href}
                          className="block w-full text-center bg-white text-black font-bold text-base py-4 rounded-full hover:bg-gray-200 transition-colors duration-200 active:scale-[0.98]"
                        >
                          {offer.cta}
                        </a>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* ══ BACK FACE ══ */}
              <div
                className="absolute inset-0 w-full h-full overflow-y-auto"
                style={{
                  backfaceVisibility: 'hidden',
                  WebkitBackfaceVisibility: 'hidden',
                  transform: 'rotateY(180deg)',
                  pointerEvents: flippedStates[i] ? 'auto' : 'none',
                }}
              >
                <div className="rounded-2xl border border-blue-500/30 bg-[#0a0f1e] p-6 md:p-8 flex flex-col min-h-full">
                  <div className="flex items-center justify-between mb-6">
                    <p className="text-xs uppercase tracking-widest text-blue-400">{offer.tag}</p>
                    <button
                      onClick={() => toggleFlip(i)}
                      className="w-9 h-9 rounded-full border border-white/20 flex items-center justify-center text-white hover:border-blue-500/60 hover:bg-blue-500/10 transition-colors cursor-pointer"
                      aria-label="Flip back"
                    >
                      <RotateCcw className="w-4 h-4" />
                    </button>
                  </div>
                  <h3 className="font-oswald font-bold text-xl md:text-2xl text-white mb-2">{offer.title}</h3>
                  <p className="text-blue-400 font-semibold text-sm uppercase tracking-wider mb-6">What's Included</p>

                  <ul className="space-y-3 flex-grow mb-6">
                    {offer.benefits.map((benefit) => (
                      <li key={benefit} className="flex items-start gap-3">
                        <span className="flex-shrink-0 w-5 h-5 rounded-full bg-blue-500/20 flex items-center justify-center mt-0.5">
                          <Check className="w-3 h-3 text-blue-400" />
                        </span>
                        <span className="text-gray-300 text-sm">{benefit}</span>
                      </li>
                    ))}
                  </ul>

                  {offer.isDirective ? (
                    <button
                      onClick={() => setDirectiveModalOpen(true)}
                      className="block w-full text-center bg-white text-black font-bold text-base py-4 rounded-full hover:bg-gray-200 transition-colors duration-200 active:scale-[0.98]"
                    >
                      {offer.cta}
                    </button>
                  ) : (
                    <a
                      href={offer.href}
                      className="block w-full text-center bg-white text-black font-bold text-base py-4 rounded-full hover:bg-gray-200 transition-colors duration-200 active:scale-[0.98]"
                    >
                      {offer.cta}
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      ))}
    </div>

    <DirectiveApplicationModal open={directiveModalOpen} onOpenChange={setDirectiveModalOpen} />
  </section>
  );
};

/* ══════════════════════════════════════════════════════
   SECTION 5 — PRODUCER CHALLENGE BANNER (Flip Card)
   ══════════════════════════════════════════════════════ */
const challengeBenefits = [
  '30 Training Modules',
  '30 Daily Action Reports Sent to You',
  '6 Weekly Discovery Flow Reflections',
  'Core 4 Framework (Body, Being, Balance, Business)',
  'Agency Brain Access',
  'Daily Accountability System',
  'Sales Process Training Modules',
  'Direct Visibility into Producer Growth',
  'Rolling Enrollment (Sign Up Friday, Start Monday)',
];

const ProducerChallengeBar = () => {
  const [flipped, setFlipped] = useState(false);
  const [muted, setMuted] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);

  const toggleSound = () => {
    const v = videoRef.current;
    if (!v) return;
    v.muted = !v.muted;
    setMuted(v.muted);
  };

  return (
    <section className="relative z-20 px-6 pb-24 md:pb-40 bg-black">
      <div className="max-w-6xl mx-auto">
        <div style={{ perspective: '1200px' }}>
          <div
            className="relative w-full transition-transform duration-[600ms]"
            style={{
              transformStyle: 'preserve-3d',
              transform: flipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
            }}
          >
            {/* ══ FRONT FACE ══ */}
            <div
              style={{
                backfaceVisibility: 'hidden',
                WebkitBackfaceVisibility: 'hidden',
                pointerEvents: flipped ? 'none' : 'auto',
              }}
            >
              <div className="group relative rounded-2xl border border-white/10 overflow-hidden hover:border-blue-500/40 transition-colors duration-500">
                {/* Cropped video background */}
                <div className="relative h-[280px] md:h-[360px]">
                  <video
                    ref={videoRef}
                    src="https://puidotfmyrouxezsorlt.supabase.co/storage/v1/object/public/public/The Challenge Card.mp4"
                    autoPlay muted loop playsInline
                    className="absolute inset-0 w-full h-full object-cover object-top"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-black/60" />

                  {/* Sound toggle */}
                  <button
                    onClick={toggleSound}
                    className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full bg-black/50 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white hover:bg-black/70 transition-colors"
                    aria-label={muted ? 'Unmute' : 'Mute'}
                  >
                    {muted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                  </button>

                  {/* Content overlay */}
                  <div className="relative z-10 h-full flex flex-col items-center justify-end text-center px-6 pb-8 md:pb-10">
                    <p className="text-xs uppercase tracking-widest text-blue-400 mb-2">The Challenge</p>
                    <h3 className="font-oswald font-bold text-2xl md:text-4xl text-white mb-2">6 Week Producer Challenge</h3>
                    <p className="text-gray-300 text-sm md:text-base max-w-2xl mb-3">
                      Transform your producer from reactive chaos to systematic execution — in 42 days.
                    </p>
                    <p className="font-oswald font-bold text-xl md:text-2xl text-white mb-4">$299 <span className="text-gray-400 text-sm font-normal">/ per producer</span></p>
                    <div className="flex flex-col items-center gap-3">
                      <a
                        href="https://createthestandard.com/credit-card-page"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block bg-white text-black font-bold text-base px-10 py-3 rounded-full hover:bg-gray-200 transition-colors duration-200 active:scale-[0.98]"
                      >
                        Buy a Seat
                      </a>
                      <button
                        onClick={() => setFlipped(true)}
                        className="text-blue-400 text-sm font-medium hover:text-blue-300 transition-colors cursor-pointer"
                      >
                        See What's Included →
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* ══ BACK FACE ══ */}
            <div
              className="absolute inset-0 w-full h-full overflow-y-auto"
              style={{
                backfaceVisibility: 'hidden',
                WebkitBackfaceVisibility: 'hidden',
                transform: 'rotateY(180deg)',
                pointerEvents: flipped ? 'auto' : 'none',
              }}
            >
              <div className="rounded-2xl border border-blue-500/30 bg-[#0a0f1e] p-6 md:p-10 flex flex-col min-h-full">
                <div className="flex items-center justify-between mb-6">
                  <p className="text-xs uppercase tracking-widest text-blue-400">The Challenge</p>
                  <button
                    onClick={() => setFlipped(false)}
                    className="w-9 h-9 rounded-full border border-white/20 flex items-center justify-center text-white hover:border-blue-500/60 hover:bg-blue-500/10 transition-colors cursor-pointer"
                    aria-label="Flip back"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>
                </div>
                <h3 className="font-oswald font-bold text-xl md:text-2xl text-white mb-2">6 Week Producer Challenge</h3>
                <p className="text-blue-400 font-semibold text-sm uppercase tracking-wider mb-6">What's Included</p>

                <ul className="space-y-3 flex-grow mb-6 max-w-xl">
                  {challengeBenefits.map((b) => (
                    <li key={b} className="flex items-start gap-3">
                      <span className="flex-shrink-0 w-5 h-5 rounded-full bg-blue-500/20 flex items-center justify-center mt-0.5">
                        <Check className="w-3 h-3 text-blue-400" />
                      </span>
                      <span className="text-gray-300 text-sm">{b}</span>
                    </li>
                  ))}
                </ul>

                <a
                  href="https://createthestandard.com/credit-card-page"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block w-full md:w-auto text-center bg-white text-black font-bold text-base px-10 py-4 rounded-full hover:bg-gray-200 transition-colors duration-200 active:scale-[0.98]"
                >
                  Buy a Seat
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

/* ══════════════════════════════════════════════════════
   PAGE
   ══════════════════════════════════════════════════════ */
const NewLanding = () => (
  <div className="bg-black min-h-screen text-white">
    <ScrollytellingHero />
    <AgencyBrainSection />
    <OfferLadderSection />
    <ProducerChallengeBar />

    {/* Minimal footer */}
    <footer className="relative z-20 py-12 px-6 text-center border-t border-white/5 bg-black">
      <img src={standardLogo} alt="Standard Playbook" className="mx-auto w-32 mb-4 opacity-50" />
      <p className="text-gray-600 text-sm">© {new Date().getFullYear()} Standard Playbook. All rights reserved.</p>
    </footer>
  </div>
);

export default NewLanding;
