import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import useEmblaCarousel from 'embla-carousel-react';
import { useState, useCallback, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import BookingModal from '@/components/BookingModal';
import standardLogo from '@/assets/standard-word-logo.png';
import agencyBrainLogo from '@/assets/agency-brain-logo.png';

const STORAGE_BASE = 'https://puidotfmyrouxezsorlt.supabase.co/storage/v1/object/public/public';
const salesExpDashImg = `${STORAGE_BASE}/Sales%20Experience%20Dashboard.png`;
const teamMeetingImg = `${STORAGE_BASE}/Team%20%26%20Meeting%20Hub.png`;
const trainingModulesImg = `${STORAGE_BASE}/Training%20Modules%20w%20Feedback.png`;
const salesProcessCardImg = `${STORAGE_BASE}/Sales%20Process%20Card.png`;
const accountabilityCardImg = `${STORAGE_BASE}/Accountability%20Metrics%20Card.png`;
const consequenceLadderCardImg = `${STORAGE_BASE}/Consequence%20Ladder%20Card.png`;

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
   SCROLLYTELLING HERO — 4 Fades over sticky video
   ══════════════════════════════════════════════════════ */
const ScrollytellingHero = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ['start start', 'end end'] });

  const lerp = (p: number, start: number, end: number) =>
    Math.max(0, Math.min(1, (p - start) / (end - start)));

  // Video fades out before Fade 4
  const videoOpacity = useTransform(scrollYProgress, (p) => {
    if (p < 0.45) return 1;
    if (p >= 0.56) return 0;
    return 1 - lerp(p, 0.45, 0.56);
  });

  // Blue bg fades in bridging into Fade 4
  const blueBgOpacity = useTransform(scrollYProgress, (p) => {
    if (p < 0.50) return 0;
    if (p >= 0.58) return 1;
    return lerp(p, 0.50, 0.58);
  });

  // Fade 1: Hook + CTA — visible 0–8%, fades out by 14%
  const fade1 = useTransform(scrollYProgress, (p) => {
    if (p <= 0.08) return 1;
    if (p >= 0.14) return 0;
    return 1 - lerp(p, 0.08, 0.14);
  });

  // Fade 2: The Problem — in 16–22%, holds, out 32–38%
  const fade2 = useTransform(scrollYProgress, (p) => {
    if (p < 0.16) return 0;
    if (p < 0.22) return lerp(p, 0.16, 0.22);
    if (p <= 0.32) return 1;
    if (p >= 0.38) return 0;
    return 1 - lerp(p, 0.32, 0.38);
  });

  // Fade 3: The Promise — in 40–46%, holds, out 50–56%
  const fade3 = useTransform(scrollYProgress, (p) => {
    if (p < 0.40) return 0;
    if (p < 0.46) return lerp(p, 0.40, 0.46);
    if (p <= 0.50) return 1;
    if (p >= 0.56) return 0;
    return 1 - lerp(p, 0.50, 0.56);
  });

  // Fade 4: The Guarantee — in 58–64%, holds, out 72–78%
  const fade4 = useTransform(scrollYProgress, (p) => {
    if (p < 0.58) return 0;
    if (p < 0.64) return lerp(p, 0.58, 0.64);
    if (p <= 0.72) return 1;
    if (p >= 0.78) return 0;
    return 1 - lerp(p, 0.72, 0.78);
  });

  // Fade 5: Deliverables — in 80–86%, holds, out 92–97%
  const fade5 = useTransform(scrollYProgress, (p) => {
    if (p < 0.80) return 0;
    if (p < 0.86) return lerp(p, 0.80, 0.86);
    if (p <= 0.92) return 1;
    if (p >= 0.97) return 0;
    return 1 - lerp(p, 0.92, 0.97);
  });

  return (
    <section ref={containerRef} className="relative" style={{ height: '600vh' }}>
      <div style={{ position: 'sticky', top: 0, height: '100vh', overflow: 'hidden' }}>
        {/* Video background */}
        <motion.div style={{ opacity: videoOpacity }} className="absolute inset-0" aria-hidden="true">
          <video autoPlay muted loop playsInline className="absolute inset-0 w-full h-full object-cover" src="https://puidotfmyrouxezsorlt.supabase.co/storage/v1/object/public/public/8%20week%20background.mp4" />
          <div className="absolute inset-0 bg-black/50" />
        </motion.div>

        {/* Blue background layer */}
        <motion.div style={{ opacity: blueBgOpacity }} className="absolute inset-0 bg-gradient-to-b from-[#020617] to-black" aria-hidden="true" />

        {/* ── Fade 1: Hook + CTA ── */}
        <motion.div style={{ opacity: fade1 }} className="absolute inset-0 flex items-center justify-center">
          <div className="text-center px-6 max-w-5xl mx-auto">
            <img src={standardLogo} alt="Standard Playbook" className="mx-auto w-48 md:w-72 mb-10 drop-shadow-2xl" />
            <h1 className="font-oswald font-bold text-3xl sm:text-5xl md:text-7xl text-white leading-[1.1] tracking-tight mb-4 drop-shadow-[0_4px_24px_rgba(0,0,0,0.8)] uppercase">
              Stop managing chaos.
            </h1>
            <p className="font-oswald font-bold text-2xl sm:text-4xl md:text-5xl text-gray-300 mb-10 drop-shadow-[0_4px_24px_rgba(0,0,0,0.8)] uppercase">
              Start running a system.
            </p>
            <div className="pointer-events-auto">
              <BookingModal
                trigger={
                  <Button className="btn-primary text-lg px-10 py-6">
                    Book Your Strategy Call
                  </Button>
                }
              />
            </div>
          </div>
        </motion.div>

        {/* ── Fade 2: The Problem ── */}
        <motion.div style={{ opacity: fade2 }} className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="max-w-4xl mx-auto text-center px-6">
            <p className="text-lg md:text-xl text-gray-400 mb-4 uppercase tracking-widest font-medium">The Problem</p>
            <h2 className="font-oswald font-bold text-3xl sm:text-5xl md:text-7xl text-white leading-[1.1] mb-8 drop-shadow-[0_4px_24px_rgba(0,0,0,0.8)]">
              Great month. Bad month.<br />Great month. Bad month.
            </h2>
            <p className="font-oswald font-bold text-2xl sm:text-4xl md:text-5xl text-blue-500 drop-shadow-[0_4px_24px_rgba(0,0,0,0.6)]">
              That's not a sales team.<br />That's a coin flip.
            </p>
          </div>
        </motion.div>

        {/* ── Fade 3: The Promise ── */}
        <motion.div style={{ opacity: fade3 }} className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="max-w-4xl mx-auto text-center px-6">
            <p className="text-lg md:text-xl text-gray-400 mb-4 uppercase tracking-widest font-medium">The Promise</p>
            <h2 className="font-oswald font-bold text-3xl sm:text-5xl md:text-7xl text-white leading-[1.1] mb-8 drop-shadow-[0_4px_24px_rgba(0,0,0,0.8)]">
              In 8 weeks, you'll have certainty.
            </h2>
            <p className="font-oswald text-xl sm:text-2xl md:text-3xl text-gray-300 leading-relaxed">
              A process. A scorecard.<br />A rhythm. A guarantee.
            </p>
          </div>
        </motion.div>

        {/* ── Fade 4: The Guarantee ── */}
        <motion.div style={{ opacity: fade4 }} className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="max-w-4xl mx-auto text-center px-6">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full border-4 border-yellow-300 shadow-2xl mb-8">
              <div className="text-center">
                <div className="text-lg font-bold text-black">100%</div>
                <div className="text-[10px] font-semibold text-black uppercase">Guarantee</div>
              </div>
            </div>
            <h2 className="font-oswald font-bold text-3xl sm:text-5xl md:text-6xl text-white leading-[1.1] mb-6 drop-shadow-[0_4px_24px_rgba(0,0,0,0.8)]">
              If you don't have a clear path,<br />I'll give you your money back.
            </h2>
             <p className="font-oswald text-xl sm:text-2xl md:text-3xl text-blue-400">
               But so far for over one year, God has blessed us enough to bat 1000%! 😉
             </p>
          </div>
        </motion.div>
        {/* ── Fade 5: Deliverables ── */}
        <motion.div style={{ opacity: fade5 }} className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="max-w-6xl mx-auto px-6">
            <div className="text-center mb-10">
              <p className="text-sm uppercase tracking-[0.3em] text-blue-400 mb-3">What You'll Walk Away With</p>
              <h2 className="font-oswald font-bold text-3xl md:text-5xl text-white">
                Three Systems. Zero Guesswork.
              </h2>
            </div>
            <div className="flex flex-col md:flex-row items-center justify-center gap-4">
              {[
                { title: 'Sales Process', sub: 'A documented, repeatable call framework your entire team follows — no more winging it.', img: salesProcessCardImg },
                { title: 'Accountability Framework', sub: 'Daily tracking, weekly scorecards, and graded calls that keep every producer on pace.', img: accountabilityCardImg },
                { title: 'Consequence Ladder', sub: 'A clear escalation path so underperformance is addressed — not ignored.', img: consequenceLadderCardImg },
              ].map((item, i, arr) => (
                <div key={item.title} className="flex flex-col md:flex-row items-center">
                  <div className="rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-xl p-6 md:p-8 text-center max-w-xs mx-auto">
                    <h3 className="font-oswald font-bold text-xl md:text-2xl text-white mb-3">{item.title}</h3>
                    <img src={item.img} alt={item.title} className="w-full rounded-xl shadow-2xl shadow-blue-500/10 mb-3" />
                    <p className="text-gray-400 text-sm leading-relaxed">{item.sub}</p>
                  </div>
                  {i < arr.length - 1 && (
                    <div className="flex items-center justify-center py-4 md:py-0 md:px-2">
                      <motion.div animate={{ x: [0, 10, 0] }} transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}>
                        <svg className="w-8 h-8 md:w-10 md:h-10 text-blue-500 rotate-90 md:rotate-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                        </svg>
                      </motion.div>
                    </div>
                  )}
                </div>
              ))}
            </div>
            <p className="font-oswald text-xl sm:text-2xl md:text-3xl text-blue-400 text-center max-w-4xl mx-auto mt-12 leading-relaxed">
              Your inconsistency is directly connected to your lack of clarity in the process &amp; follow through, I promise you. You will be able to hold your current team accountable AND hire a new team member into complete and clear structure for maybe the 1st time ever.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

/* ══════════════════════════════════════════════════════
   AGENCY BRAIN SHOWCASE — Curated 8-week tools
   ══════════════════════════════════════════════════════ */
const brainCards = [
  { headline: 'Total Visibility.', sub: 'Know exactly where your team stands every single day.', img: salesExpDashImg, label: 'Sales Experience Dashboard' },
  { headline: 'Team & Meeting Hub.', sub: 'Centralized meeting management, team collaboration, and communication all in one place.', img: teamMeetingImg, label: 'Team & Meeting Hub' },
  { headline: 'Training & Feedback.', sub: 'Structured Training Modules unlocked every Monday and Wednesday with the feedback discovery flow fed back to the manager on Friday.', img: trainingModulesImg, label: 'Training Modules & Feedback' },
];

const AgencyBrainShowcase = () => {
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
      if (engine.options.loop) {
        if (diff > 0.5) diff -= 1;
        if (diff < -0.5) diff += 1;
      }
      const absDiff = Math.abs(diff);
      const scale = Math.max(0.65, 1 - absDiff * 0.35);
      const opacity = Math.max(0.3, 1 - absDiff * 0.7);
      const translateZ = -absDiff * 250;
      const translateX = diff * 15;
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
        <Reveal className="text-center mb-6">
          <img src={agencyBrainLogo} alt="Agency Brain" className="mx-auto w-48 md:w-72 mb-4" />
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            These are the tools you'll use every day inside the 8-week program.
          </p>
        </Reveal>

        <div className="max-w-6xl mx-auto">
          <div className="overflow-visible" ref={emblaRef} style={{ perspective: '1200px' }}>
            <div className="flex" style={{ transformStyle: 'preserve-3d' }}>
              {brainCards.map((card, index) => (
                <div
                  key={card.label}
                  className="flex-[0_0_80%] sm:flex-[0_0_60%] md:flex-[0_0_50%] min-w-0 px-3"
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

          {/* Nav */}
          <div className="flex items-center justify-center gap-6 mt-8">
            <button onClick={() => emblaApi?.scrollPrev()} className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center text-white hover:border-blue-500/60 hover:bg-blue-500/10 transition-colors" aria-label="Previous">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
            </button>
            <div className="flex gap-2">
              {scrollSnaps.map((_, i) => (
                <button key={i} onClick={() => scrollTo(i)} className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${i === selectedIndex ? 'bg-blue-500 scale-125' : 'bg-white/20 hover:bg-white/40'}`} aria-label={`Slide ${i + 1}`} />
              ))}
            </div>
            <button onClick={() => emblaApi?.scrollNext()} className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center text-white hover:border-blue-500/60 hover:bg-blue-500/10 transition-colors" aria-label="Next">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

/* ══════════════════════════════════════════════════════
   SUCCESS STORY
   ══════════════════════════════════════════════════════ */
const SuccessStory = () => (
  <section className="relative z-20 py-24 md:py-40 px-6 bg-black">
    <div className="max-w-4xl mx-auto">
      <Reveal className="text-center mb-12">
        <p className="text-sm uppercase tracking-[0.3em] text-blue-400 mb-3">Success Story</p>
        <h2 className="font-oswald font-bold text-3xl md:text-5xl text-white mb-4">
          "He paid attention to my culture first."
        </h2>
        <p className="text-gray-400 text-lg">Dan Westrick — Allstate Agency Owner</p>
      </Reveal>
      <Reveal delay={0.15}>
        <div className="relative max-w-sm mx-auto">
          <div className="video-glow absolute -inset-4" />
          <div className="relative rounded-2xl overflow-hidden border border-white/10" style={{ aspectRatio: '9/16' }}>
            <iframe
              src="https://fast.wistia.net/embed/iframe/p5r3aelfj0?autoPlay=false&fullscreenButton=true&playButton=true&smallPlayButton=true&volumeControl=true&controlsVisibleOnLoad=true"
              title="Dan Westrick Success Story"
              allow="autoplay; fullscreen"
              allowFullScreen
              frameBorder="0"
              scrolling="no"
              className="w-full h-full"
              style={{ aspectRatio: '9/16' }}
            />
          </div>
        </div>
      </Reveal>
    </div>
  </section>
);

/* ══════════════════════════════════════════════════════
   WHAT'S INCLUDED — 4 bold lines
   ══════════════════════════════════════════════════════ */
const lines = [
  '8 weekly coaching calls.',
  'Graded calls every week.',
  'Your sales process, documented.',
  'Your accountability system, deployed.',
];

const IncludedSection = () => (
  <section className="relative z-20 py-24 md:py-40 px-6 bg-gradient-to-b from-black to-[#020617]">
    <div className="max-w-3xl mx-auto text-center">
      <Reveal>
        <p className="text-sm uppercase tracking-[0.3em] text-blue-400 mb-6">What's Included</p>
      </Reveal>
      {lines.map((line, i) => (
        <Reveal key={i} delay={i * 0.1}>
          <p className="font-oswald font-bold text-2xl sm:text-3xl md:text-4xl text-white mb-4 leading-tight">
            {line}
          </p>
        </Reveal>
      ))}
    </div>
  </section>
);

/* ══════════════════════════════════════════════════════
   FINAL CTA
   ══════════════════════════════════════════════════════ */
const FinalCTA = () => (
  <section className="relative z-20 py-24 md:py-40 px-6 bg-[#020617]">
    <div className="max-w-3xl mx-auto text-center">
      <Reveal>
        <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full border-4 border-yellow-300 shadow-2xl mb-8">
          <div className="text-center">
            <div className="text-lg font-bold text-black">100%</div>
            <div className="text-[10px] font-semibold text-black uppercase">Guarantee</div>
          </div>
        </div>
      </Reveal>
      <Reveal delay={0.1}>
        <h2 className="font-oswald font-bold text-3xl sm:text-5xl md:text-6xl text-white leading-[1.1] mb-6">
          If you don't see the value after 8 weeks,<br />I'll give you your money back.
        </h2>
        <p className="text-xl text-gray-400 mb-10">
          All I ask is you <span className="text-blue-400 font-semibold">commit to the work.</span>
        </p>
      </Reveal>
      <Reveal delay={0.2}>
        <BookingModal
          trigger={
            <Button className="btn-primary text-lg px-10 py-6">
              Book Your Strategy Call
            </Button>
          }
        />
      </Reveal>
    </div>
  </section>
);

/* ══════════════════════════════════════════════════════
   PAGE
   ══════════════════════════════════════════════════════ */
const SalesExperience = () => (
  <div className="bg-black min-h-screen text-white" style={{ overflowX: 'clip' }}>
    <ScrollytellingHero />
    <AgencyBrainShowcase />
    <SuccessStory />
    <IncludedSection />
    <FinalCTA />

    {/* Minimal footer */}
    <footer className="relative z-20 py-12 px-6 text-center border-t border-white/5 bg-[#020617]">
      <img src={standardLogo} alt="Standard Playbook" className="mx-auto w-32 mb-4 opacity-50" />
      <p className="text-gray-600 text-sm">© {new Date().getFullYear()} Standard Playbook. All rights reserved.</p>
    </footer>

    {/* Sticky CTA for Mobile */}
    <div className="fixed bottom-0 left-0 right-0 bg-black/95 backdrop-blur-lg border-t border-white/10 p-4 md:hidden z-40">
      <BookingModal
        trigger={
          <Button className="btn-primary w-full">
            Book A Call
          </Button>
        }
      />
    </div>
  </div>
);

export default SalesExperience;
