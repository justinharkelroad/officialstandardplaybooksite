import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import useEmblaCarousel from 'embla-carousel-react';
import { ChevronLeft, ChevronRight, Facebook, Linkedin } from 'lucide-react';
import BoldNav from '@/components/BoldNav';
import ContentMeta from '@/components/ContentMeta';

import VideoArchitectDemo from '@/components/training/VideoArchitectDemo';
import ComprehensionDemo from '@/components/training/ComprehensionDemo';
import ContentGeneratorDemo from '@/components/training/ContentGeneratorDemo';

import standardLogo from '@/assets/standard-word-logo.png';

/* ── Bold editorial type stack ─────────────────────────── */
const display = '"Anton", "Archivo Black", "Oswald", Impact, sans-serif';
const editorial = '"Archivo Black", "Anton", Impact, sans-serif';
const body = 'Inter, -apple-system, BlinkMacSystemFont, "Helvetica Neue", Arial, sans-serif';

/* ── Brand colors ──────────────────────────────────────── */
const ink = '#0A0A0B';
const paper = '#F4F2EE';
const blue = '#2997FF';

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

/* ── Reveal helper ─────────────────────────────────────── */
const Reveal = ({ children, className = '', delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) => (
  <motion.div
    initial={{ opacity: 0, y: 16 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: '0px 0px -10% 0px' }}
    transition={{ duration: 0.6, delay, ease: EASE }}
    className={className}
  >
    {children}
  </motion.div>
);

/* ══════════════════════════════════════════════════════
   HERO
   ══════════════════════════════════════════════════════ */
const Hero = () => (
  <section style={{ background: paper, paddingTop: 56 + 24, paddingBottom: 60 }}>
    <div className="px-6 md:px-10 max-w-[1440px] mx-auto">
      <Reveal>
        <p style={{
          fontFamily: body, fontSize: 12, fontWeight: 600, letterSpacing: '0.18em',
          color: ink, textTransform: 'uppercase', marginBottom: 24,
        }}>
          / Team Training · Inside Agency Brain
        </p>
      </Reveal>
      <Reveal>
        <h1 style={{
          fontFamily: display,
          fontSize: 'clamp(44px, 11vw, 200px)',
          lineHeight: 0.86, letterSpacing: '-0.02em',
          color: ink, margin: 0, textTransform: 'uppercase', fontWeight: 400,
        }}>
          TRAIN YOUR<br />
          <span className="md:pl-[6vw] inline-block">WHOLE TEAM.</span><br />
          <span className="md:pl-[14vw] inline-block" style={{ color: blue }}>ONE PLATFORM.</span>
        </h1>
      </Reveal>
      <div className="grid grid-cols-12 gap-6 mt-12">
        <Reveal delay={0.1} className="col-span-12 md:col-span-7">
          <p style={{
            fontFamily: body, fontSize: 'clamp(16px, 1.6vw, 22px)', fontWeight: 400, lineHeight: 1.55,
            color: ink, opacity: 0.85, maxWidth: 760,
          }}>
            A complete on-demand training library — sales, service, management, AI, and the Agency Brain product itself. Plus the only platform that lets you build your own training from any video. Built into every Agency Brain account.
          </p>
        </Reveal>
        <Reveal delay={0.15} className="col-span-12 md:col-span-5 flex md:justify-end items-start gap-3 flex-wrap">
          <a href="#library"
            style={{
              fontFamily: body, fontSize: 13, fontWeight: 600, letterSpacing: '0.12em',
              color: ink, textTransform: 'uppercase', textDecoration: 'none',
              padding: '14px 26px', border: `1.5px solid ${ink}`, transition: 'all .25s',
            }}
            className="hover:bg-black hover:text-white">
            See The Library
          </a>
          <Link to="/#programs"
            style={{
              fontFamily: body, fontSize: 13, fontWeight: 700, letterSpacing: '0.12em',
              color: '#fff', background: ink, textTransform: 'uppercase', textDecoration: 'none',
              padding: '15px 28px', border: `1.5px solid ${ink}`, transition: 'all .25s',
            }}
            className="hover:bg-[#2997FF] hover:border-[#2997FF]">
            Get Agency Brain →
          </Link>
        </Reveal>
      </div>
    </div>
  </section>
);

/* ══════════════════════════════════════════════════════
   MARQUEE
   ══════════════════════════════════════════════════════ */
const Marquee = ({ rotate = -3, bg = ink, color = paper, dot = blue, phrase = 'TEAM TRAINING' }: { rotate?: number; bg?: string; color?: string; dot?: string; phrase?: string }) => (
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
    <Marquee rotate={-3} bg={ink} color={paper} dot={blue} phrase="A LIBRARY · NOT A COURSE" />
    <div style={{ marginTop: -24 }}>
      <Marquee rotate={2.5} bg={paper} color={ink} dot={ink} phrase="TEAM TRAINING" />
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
   DIFFERENTIATOR
   ══════════════════════════════════════════════════════ */
const DifferentiatorSection = () => (
  <section style={{ background: paper, padding: '120px 24px' }}>
    <div className="max-w-[1280px] mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-0" style={{ borderTop: `1px solid ${ink}` }}>
        {[
          { num: '01', heading: 'A growing library + your own', body: 'A structured library out of the box, growing as the work surfaces it — plus the ability to build your own.' },
          { num: '02', heading: 'Built by an operator', body: 'Justin Harkelroad — 20 years in the agency seat. Built and sold three.' },
          { num: '03', heading: 'Real word tracks', body: 'Scripts, rebuttals, and full call sequences. Not theory.' },
        ].map((c, i) => (
          <Reveal key={c.num} delay={i * 0.06}>
            <div style={{
              padding: '40px 24px', height: '100%',
              borderBottom: `1px solid ${ink}`,
              borderRight: i < 2 ? `1px solid ${ink}` : 'none',
            }}
              className="md:!border-r"
            >
              <span style={{
                fontFamily: editorial, fontSize: 22, color: ink,
                opacity: 0.4, letterSpacing: '-0.01em',
              }}>
                {c.num}
              </span>
              <h3 style={{
                fontFamily: display, fontSize: 'clamp(20px, 2.4vw, 28px)',
                lineHeight: 1.05, letterSpacing: '-0.01em', color: ink,
                textTransform: 'uppercase', margin: 0, fontWeight: 400, marginTop: 16,
              }}>
                {c.heading}
              </h3>
              <p style={{
                fontFamily: body, fontSize: 15, fontWeight: 400, lineHeight: 1.6,
                color: ink, opacity: 0.7, marginTop: 14,
              }}>
                {c.body}
              </p>
            </div>
          </Reveal>
        ))}
      </div>
      <Reveal delay={0.2}>
        <p style={{
          fontFamily: body, fontSize: 'clamp(16px, 1.6vw, 21px)', fontWeight: 400, lineHeight: 1.55,
          color: ink, opacity: 0.7, marginTop: 56, maxWidth: 760, textAlign: 'center', marginInline: 'auto',
        }}>
          Most "training libraries" are recycled motivation. This one was built inside a working Allstate agency by the operator who runs it. Every lesson is something his own team uses on Monday morning.
        </p>
      </Reveal>
    </div>
  </section>
);

/* ══════════════════════════════════════════════════════
   THE LIBRARY — single hero track + categories
   ══════════════════════════════════════════════════════ */
const HERO_TRACK = {
  number: 'Track',
  title: 'Standard Sequence Sales',
  description: 'The 6-step sales system that turns every quoted household into a written policy.',
  bullets: [
    'Producer hooks by lead type — auto, home, winback, x-date, cross-sell',
    'Rapport, trust, and the discovery questions that surface real need',
    'The coverage conversation — 3-question gap method, umbrella focus, walk-the-block',
    'The TTT framework — Tempo, Tone, Timing',
    'Follow-up cadence that actually closes',
    'Objection rebuttals at every stage of the call',
  ],
};

const CATEGORIES = [
  { name: 'Sales', description: 'Standard sequence, objection library, discovery method, sales mastery, follow-up cadence.' },
  { name: 'Service', description: 'Service process, mini reviews, life insurance conversations, communication training.' },
  { name: 'Agency Management', description: 'Lead manager, recruiting ritual, requote and winback process, coaching vs. compliance, knowing your numbers.' },
  { name: 'AI & Technology', description: 'ElevenLabs voice bots, advanced voice prompting, NotebookLM training, building your own AI brain.' },
  { name: 'Product Training', description: 'Agency Brain for managers (Sequencing, Weekly Debrief). Agency Brain for staff (LQS Roadmap, AI Sales Roleplay Trainer, Flowing).' },
  { name: 'Boardroom Recordings', description: 'Monthly coaching call recaps — real client struggles, tactics, accountability frameworks.' },
  { name: '+ More on the way', description: "New tracks ship as the work surfaces them. Boardroom calls. New objections. New AI workflows. The library doesn't sit still." },
];

const TRAINING_NOTEBOOKS = [
  { number: '01', image: '/1.png', title: 'The Quoted Households Math', description: 'Reverse math that turns a monthly hope number into a daily non-negotiable.' },
  { number: '02', image: '/2.png', title: 'Cancellation Requests', description: 'A service call frame for prepared, calm retention conversations.' },
  { number: '03', image: '/3.png', title: 'The Three Buckets Method', description: 'A field-edition framework for organizing a producer sales day.' },
  { number: '04', image: '/4.png', title: 'Leading With Liability', description: 'The three-question approach to closing coverage gaps.' },
  { number: '05', image: '/5.png', title: 'Talk Like You Already Won', description: 'Tone, tempo, and timing for phone conversations that earn the close.' },
  { number: '06', image: '/6.png', title: 'Customer Winback Process', description: 'A deployable process for reopening terminated customer relationships.' },
  { number: '07', image: '/7.png', title: 'Renewals & Rate Increases', description: 'A service frame for making clients feel heard before making recommendations.' },
  { number: '08', image: '/8.png', title: 'From Hello To Closed', description: 'The standard six-step call sequence and the mindset behind it.' },
  { number: '09', image: '/9.png', title: 'The Question Bank', description: 'Carrier-agnostic discovery questions for P&C producers.' },
  { number: '10', image: '/10.png', title: 'The Objection Playbook', description: 'Opening objections sequenced by how they surface on live calls.' },
  { number: '11', image: '/11.png', title: 'More Processes Coming Soon', description: 'The library keeps expanding as the insurance game changes.' },
];

const NotebookCarousel = () => {
  const [emblaRef, emblaApi] = useEmblaCarousel({ align: 'start', loop: false, containScroll: 'trimSnaps' });
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [scrollSnaps, setScrollSnaps] = useState<number[]>([]);
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
    setCanScrollPrev(emblaApi.canScrollPrev());
    setCanScrollNext(emblaApi.canScrollNext());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    setScrollSnaps(emblaApi.scrollSnapList());
    onSelect();
    emblaApi.on('select', onSelect);
    emblaApi.on('reInit', onSelect);
    return () => {
      emblaApi.off('select', onSelect);
      emblaApi.off('reInit', onSelect);
    };
  }, [emblaApi, onSelect]);

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);
  const scrollTo = useCallback((index: number) => emblaApi?.scrollTo(index), [emblaApi]);

  return (
    <Reveal delay={0.14}>
      <div style={{ marginTop: 54 }}>
        <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div>
            <p style={{
              fontFamily: body, fontSize: 11, fontWeight: 700, letterSpacing: '0.18em',
              color: blue, textTransform: 'uppercase', marginBottom: 12,
            }}>
              Notebook Library
            </p>
            <h3 style={{
              fontFamily: display, fontSize: 'clamp(30px, 4.2vw, 60px)',
              lineHeight: 0.96, letterSpacing: '-0.01em', color: paper,
              textTransform: 'uppercase', margin: 0, fontWeight: 400,
            }}>
              Built as tracks.<br />
              <span style={{ color: `${paper}99` }}>Browsed like shelves.</span>
            </h3>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={scrollPrev}
              disabled={!canScrollPrev}
              aria-label="Previous notebooks"
              style={{
                width: 44, height: 44, border: `1px solid ${paper}33`, borderRadius: 999,
                color: paper, background: canScrollPrev ? `${paper}0d` : 'transparent',
                opacity: canScrollPrev ? 1 : 0.35, display: 'inline-flex',
                alignItems: 'center', justifyContent: 'center', transition: 'all .25s ease',
              }}
              className="hover:border-[#2997FF] hover:text-[#2997FF] active:scale-[0.97] disabled:hover:border-white/20 disabled:hover:text-white"
            >
              <ChevronLeft className="h-5 w-5" strokeWidth={1.8} />
            </button>
            <button
              type="button"
              onClick={scrollNext}
              disabled={!canScrollNext}
              aria-label="Next notebooks"
              style={{
                width: 44, height: 44, border: `1px solid ${paper}33`, borderRadius: 999,
                color: paper, background: canScrollNext ? `${paper}0d` : 'transparent',
                opacity: canScrollNext ? 1 : 0.35, display: 'inline-flex',
                alignItems: 'center', justifyContent: 'center', transition: 'all .25s ease',
              }}
              className="hover:border-[#2997FF] hover:text-[#2997FF] active:scale-[0.97] disabled:hover:border-white/20 disabled:hover:text-white"
            >
              <ChevronRight className="h-5 w-5" strokeWidth={1.8} />
            </button>
          </div>
        </div>

        <div ref={emblaRef} style={{
          overflow: 'hidden', marginTop: 34, marginInline: '-12px',
          WebkitMaskImage: 'linear-gradient(90deg, transparent 0, #000 28px, #000 calc(100% - 28px), transparent 100%)',
          maskImage: 'linear-gradient(90deg, transparent 0, #000 28px, #000 calc(100% - 28px), transparent 100%)',
        }}>
          <div className="flex">
            {TRAINING_NOTEBOOKS.map((notebook) => (
              <div key={notebook.number} className="min-w-0 flex-[0_0_86%] px-3 sm:flex-[0_0_50%] lg:flex-[0_0_33.333%]">
                <article style={{
                  height: '100%', borderTop: `1px solid ${paper}26`,
                  paddingTop: 18, display: 'flex', flexDirection: 'column',
                }}>
                  <div style={{
                    minHeight: 'clamp(300px, 38vw, 510px)', display: 'flex',
                    alignItems: 'center', justifyContent: 'center',
                    background: `linear-gradient(180deg, ${paper}0d, ${paper}05)`,
                    border: `1px solid ${paper}1a`, overflow: 'hidden', position: 'relative',
                  }}>
                    <img
                      src={notebook.image}
                      alt={`${notebook.title} notebook`}
                      loading={notebook.number === '01' ? 'eager' : 'lazy'}
                      onError={(event) => {
                        event.currentTarget.style.display = 'none';
                      }}
                      style={{
                        width: 'min(86%, 360px)', maxHeight: '470px',
                        objectFit: 'contain', filter: 'drop-shadow(0 24px 34px rgba(0,0,0,0.42))',
                      }}
                    />
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '44px 1fr', gap: 14, paddingTop: 18 }}>
                    <span style={{
                      fontFamily: editorial, fontSize: 17, color: blue,
                      letterSpacing: '-0.01em', lineHeight: 1,
                    }}>
                      {notebook.number}
                    </span>
                    <div>
                      <h4 style={{
                        fontFamily: display, fontSize: 'clamp(21px, 2vw, 30px)',
                        lineHeight: 1, letterSpacing: '-0.01em', color: paper,
                        textTransform: 'uppercase', margin: 0, fontWeight: 400,
                      }}>
                        {notebook.title}
                      </h4>
                      <p style={{
                        fontFamily: body, fontSize: 14, fontWeight: 400, lineHeight: 1.55,
                        color: paper, opacity: 0.68, marginTop: 9, marginBottom: 0,
                      }}>
                        {notebook.description}
                      </p>
                    </div>
                  </div>
                </article>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-7 flex flex-wrap items-center gap-2">
          {scrollSnaps.map((_, index) => (
            <button
              key={index}
              type="button"
              onClick={() => scrollTo(index)}
              aria-label={`Go to notebook group ${index + 1}`}
              style={{
                width: index === selectedIndex ? 28 : 8,
                height: 8, borderRadius: 999, border: 0,
                background: index === selectedIndex ? blue : `${paper}33`,
                transition: 'all .25s ease',
              }}
            />
          ))}
        </div>
      </div>
    </Reveal>
  );
};

const LibrarySection = () => (
  <section id="library" style={{ background: ink, color: paper, padding: '120px 24px' }}>
    <div className="max-w-[1280px] mx-auto">
      <Reveal>
        <p style={{
          fontFamily: body, fontSize: 12, fontWeight: 600, letterSpacing: '0.18em',
          color: paper, opacity: 0.6, textTransform: 'uppercase', marginBottom: 28,
        }}>
          / The Library
        </p>
      </Reveal>
      <Reveal delay={0.05}>
        <h2 style={{
          fontFamily: display, fontSize: 'clamp(44px, 7vw, 100px)',
          lineHeight: 0.95, letterSpacing: '-0.01em', color: paper,
          textTransform: 'uppercase', margin: 0, fontWeight: 400,
        }}>
          A LIBRARY.<br />
          <span style={{ color: blue }}>NOT A COURSE.</span>
        </h2>
      </Reveal>
      <Reveal delay={0.1}>
        <p style={{
          fontFamily: body, fontSize: 'clamp(16px, 1.6vw, 21px)', fontWeight: 400, lineHeight: 1.55,
          color: paper, opacity: 0.75, maxWidth: 760, marginTop: 24,
        }}>
          Each track is a structured path — not a video dump. Producers, service reps, and managers each find their lane on day one. New tracks land as the work surfaces them.
        </p>
      </Reveal>

      <NotebookCarousel />

      {/* HERO TRACK CARD */}
      <Reveal delay={0.15}>
        <article style={{
          marginTop: 56,
          background: `${paper}0d`,
          border: `1.5px solid ${paper}33`,
          padding: 'clamp(28px, 4vw, 44px)',
          maxWidth: 980, marginInline: 'auto',
        }}>
          <span style={{
            fontFamily: body, fontSize: 11, fontWeight: 700, letterSpacing: '0.18em',
            color: blue, textTransform: 'uppercase',
          }}>
            {HERO_TRACK.number}
          </span>
          <h3 style={{
            fontFamily: display, fontSize: 'clamp(28px, 4.5vw, 56px)',
            lineHeight: 1, letterSpacing: '-0.01em', color: paper,
            textTransform: 'uppercase', margin: 0, fontWeight: 400, marginTop: 14, marginBottom: 16,
          }}>
            {HERO_TRACK.title}
          </h3>
          <p style={{
            fontFamily: body, fontSize: 'clamp(15px, 1.4vw, 18px)', fontWeight: 400, lineHeight: 1.55,
            color: paper, opacity: 0.85, marginBottom: 28,
          }}>
            {HERO_TRACK.description}
          </p>
          <ul style={{
            listStyle: 'none', margin: 0, padding: 0,
            display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '0 32px',
          }}>
            {HERO_TRACK.bullets.map((b) => (
              <li key={b} style={{
                fontFamily: body, fontSize: 14, fontWeight: 400, lineHeight: 1.5,
                color: paper, opacity: 0.9, padding: '10px 0',
                borderBottom: `1px solid ${paper}1a`,
                display: 'flex', alignItems: 'flex-start', gap: 10,
              }}>
                <span style={{
                  display: 'inline-block', width: 6, height: 6, background: blue,
                  marginTop: 8, flexShrink: 0,
                }} />
                {b}
              </li>
            ))}
          </ul>
        </article>
      </Reveal>

      <Reveal delay={0.2}>
        <p style={{
          fontFamily: body, fontSize: 13, fontWeight: 700, letterSpacing: '0.16em',
          color: paper, opacity: 0.55, textTransform: 'uppercase',
          textAlign: 'center', marginTop: 24,
        }}>
          This is what every track looks like.
        </p>
      </Reveal>

      {/* CATEGORIES */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-0 mt-20"
        style={{ borderTop: `1px solid ${paper}33` }}
      >
        {CATEGORIES.map((cat, i) => {
          const isMore = cat.name.startsWith('+');
          return (
            <Reveal key={cat.name} delay={i * 0.06}>
              <div style={{
                padding: '36px 24px', height: '100%',
                borderBottom: `1px solid ${paper}33`,
                borderRight: `1px solid ${paper}33`,
              }}
                className="lg:[&:nth-child(3n)]:!border-r-0 md:max-lg:[&:nth-child(2n)]:!border-r-0"
              >
                <h4 style={{
                  fontFamily: display, fontSize: 'clamp(22px, 2.4vw, 30px)',
                  lineHeight: 1.05, letterSpacing: '-0.01em',
                  color: isMore ? blue : paper,
                  textTransform: 'uppercase', margin: 0, fontWeight: 400,
                  display: 'inline-flex', alignItems: 'center', gap: 12,
                }}>
                  {cat.name}
                  {isMore && (
                    <span aria-hidden style={{
                      display: 'inline-block', width: 10, height: 10, borderRadius: '50%',
                      background: blue, animation: 'sp-pulse 2s ease-in-out infinite',
                    }} />
                  )}
                </h4>
                <p style={{
                  fontFamily: body, fontSize: 14, fontWeight: 400, lineHeight: 1.6,
                  color: paper, opacity: 0.75, marginTop: 12,
                }}>
                  {cat.description}
                </p>
              </div>
            </Reveal>
          );
        })}
      </div>

      <Reveal delay={0.2}>
        <p style={{
          fontFamily: editorial, fontSize: 'clamp(20px, 2.4vw, 28px)',
          lineHeight: 1.2, letterSpacing: '-0.01em', color: paper,
          textTransform: 'uppercase', textAlign: 'center', marginTop: 56, opacity: 0.85,
        }}>
          Every role. Every situation.<br />
          <span style={{ color: blue }}>One library that keeps growing.</span>
        </p>
      </Reveal>

      <style>{`
        @keyframes sp-pulse {
          0%, 100% { transform: scale(1); opacity: 1; box-shadow: 0 0 0 0 ${blue}66; }
          50% { transform: scale(1.15); opacity: 0.8; box-shadow: 0 0 0 8px ${blue}00; }
        }
      `}</style>
    </div>
  </section>
);

/* ══════════════════════════════════════════════════════
   TWO LIBRARIES IN ONE
   ══════════════════════════════════════════════════════ */
const TwoLibrariesSection = () => (
  <section style={{ background: paper, padding: '120px 24px' }}>
    <div className="max-w-[1280px] mx-auto">
      <Reveal>
        <p style={{
          fontFamily: body, fontSize: 12, fontWeight: 600, letterSpacing: '0.18em',
          color: ink, textTransform: 'uppercase', marginBottom: 28,
        }}>
          / Two Libraries In One
        </p>
      </Reveal>
      <Reveal delay={0.05}>
        <h2 style={{
          fontFamily: display, fontSize: 'clamp(40px, 7vw, 100px)',
          lineHeight: 0.95, letterSpacing: '-0.01em', color: ink,
          textTransform: 'uppercase', margin: 0, fontWeight: 400,
        }}>
          OURS.<br />
          <span style={{ color: blue }}>+ THE ONE YOU BUILD.</span>
        </h2>
      </Reveal>

      <div className="grid grid-cols-12 gap-8 mt-16">
        <Reveal delay={0.1} className="col-span-12 md:col-span-7">
          <div className="space-y-5" style={{
            fontFamily: body, fontSize: 'clamp(16px, 1.5vw, 19px)', fontWeight: 400, lineHeight: 1.6,
            color: ink, opacity: 0.85,
          }}>
            <p>
              Agency Brain ships with the full Standard Playbook training — operator-built tracks for sales, service, agency management, AI, and more.
            </p>
            <p>
              Plus the training builder, so you can write your own lessons, build your own quizzes, and structure your own tracks specific to your agency.
            </p>
            <p>
              You're not picking between off-the-shelf or build-your-own. You get both, on every plan, no add-on.
            </p>
          </div>
        </Reveal>
        <Reveal delay={0.15} className="col-span-12 md:col-span-5">
          <div style={{
            background: ink, color: paper, padding: '28px 24px',
          }}>
            <p style={{
              fontFamily: body, fontSize: 11, fontWeight: 700, letterSpacing: '0.16em',
              color: blue, textTransform: 'uppercase', marginBottom: 14,
            }}>
              ★ The Bottom Line
            </p>
            <p style={{
              fontFamily: display, fontSize: 'clamp(22px, 2.6vw, 32px)',
              lineHeight: 1.05, letterSpacing: '-0.01em', color: paper,
              textTransform: 'uppercase', margin: 0, fontWeight: 400,
            }}>
              Use ours.<br />Build yours.<br />
              <span style={{ color: blue }}>Or both.</span>
            </p>
            <p style={{
              fontFamily: body, fontSize: 13, fontWeight: 500, letterSpacing: '0.04em',
              color: paper, opacity: 0.7, marginTop: 18, textTransform: 'uppercase',
            }}>
              Most agencies do.
            </p>
          </div>
        </Reveal>
      </div>
    </div>
  </section>
);

/* ══════════════════════════════════════════════════════
   BUILD YOUR OWN — VideoArchitectDemo
   ══════════════════════════════════════════════════════ */
const BuildYourOwnSection = () => (
  <section style={{ background: paper, padding: '120px 24px', borderTop: `1px solid ${ink}` }}>
    <div className="max-w-[1280px] mx-auto">
      <Reveal>
        <p style={{
          fontFamily: body, fontSize: 12, fontWeight: 600, letterSpacing: '0.18em',
          color: ink, textTransform: 'uppercase', marginBottom: 28,
        }}>
          / Build Your Own
        </p>
      </Reveal>
      <Reveal delay={0.05}>
        <h2 style={{
          fontFamily: display, fontSize: 'clamp(40px, 7vw, 100px)',
          lineHeight: 0.95, letterSpacing: '-0.01em', color: ink,
          textTransform: 'uppercase', margin: 0, fontWeight: 400, marginBottom: 24,
        }}>
          ANY VIDEO.<br />
          <span style={{ color: blue }}>A TEAM TRAINING.</span>
        </h2>
      </Reveal>
      <Reveal delay={0.1}>
        <p style={{
          fontFamily: body, fontSize: 'clamp(16px, 1.6vw, 21px)', fontWeight: 400, lineHeight: 1.55,
          color: ink, opacity: 0.85, maxWidth: 760, marginBottom: 56,
        }}>
          The Video Training Architect lets you drop in any video — a sales trainer you found, a leadership clip, a 30-second social post, a screen recording — and instantly convert it into a structured, insurance-specific training session. Discussion prompts. Application exercises. Stand-and-deliver execution. All generated for you.
        </p>
      </Reveal>

      <Reveal delay={0.15}>
        <VideoArchitectDemo />
      </Reveal>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-0 mt-16" style={{ borderTop: `1px solid ${ink}` }}>
        {[
          { num: '01', title: 'Upload', body: 'Drop in any MP4, link, or screen recording. Sales content, leadership clip, social post — anything.' },
          { num: '02', title: 'The system structures it', body: 'The Video Training Architect analyzes the content through an insurance-specific lens and extracts the teaching points, frameworks, and selling principles.' },
          { num: '03', title: 'Deliver it', body: 'Your team gets a clean meeting structure: training focus, discussion prompts, application exercises, and stand-and-deliver execution. Use it on Zoom or in person.' },
        ].map((s, i) => (
          <Reveal key={s.num} delay={i * 0.07}>
            <div style={{
              padding: '40px 24px', height: '100%',
              borderBottom: `1px solid ${ink}`,
              borderRight: i < 2 ? `1px solid ${ink}` : 'none',
            }}
              className="md:!border-r"
            >
              <span style={{
                fontFamily: editorial, fontSize: 'clamp(36px, 5vw, 56px)', fontWeight: 400,
                lineHeight: 0.85, letterSpacing: '-0.04em', color: blue,
              }}>
                {s.num}
              </span>
              <h3 style={{
                fontFamily: display, fontSize: 'clamp(22px, 2.6vw, 32px)',
                lineHeight: 1, letterSpacing: '-0.01em', color: ink,
                textTransform: 'uppercase', margin: 0, fontWeight: 400, marginTop: 16,
              }}>
                {s.title}
              </h3>
              <p style={{
                fontFamily: body, fontSize: 14, fontWeight: 400, lineHeight: 1.55,
                color: ink, opacity: 0.7, marginTop: 12,
              }}>
                {s.body}
              </p>
            </div>
          </Reveal>
        ))}
      </div>

      <Reveal delay={0.2}>
        <p style={{
          fontFamily: editorial, fontSize: 'clamp(20px, 2.4vw, 28px)',
          lineHeight: 1.2, letterSpacing: '-0.01em', color: ink,
          textTransform: 'uppercase', textAlign: 'center', marginTop: 56,
        }}>
          Stop consuming. <span style={{ color: blue }}>Start building.</span>
        </p>
      </Reveal>
    </div>
  </section>
);

/* ══════════════════════════════════════════════════════
   AI COMPREHENSION
   ══════════════════════════════════════════════════════ */
const AIComprehensionSection = () => (
  <section style={{ background: ink, color: paper, padding: '120px 24px' }}>
    <div className="max-w-[1280px] mx-auto">
      <Reveal>
        <p style={{
          fontFamily: body, fontSize: 12, fontWeight: 600, letterSpacing: '0.18em',
          color: paper, opacity: 0.6, textTransform: 'uppercase', marginBottom: 28,
        }}>
          / Comprehension, Not Completion
        </p>
      </Reveal>
      <Reveal delay={0.05}>
        <h2 style={{
          fontFamily: display, fontSize: 'clamp(40px, 7vw, 100px)',
          lineHeight: 0.95, letterSpacing: '-0.01em', color: paper,
          textTransform: 'uppercase', margin: 0, fontWeight: 400, marginBottom: 24,
        }}>
          THEY CAN'T FAKE<br />
          <span style={{ color: blue }}>THEIR WAY THROUGH.</span>
        </h2>
      </Reveal>
      <Reveal delay={0.1}>
        <p style={{
          fontFamily: body, fontSize: 'clamp(16px, 1.6vw, 21px)', fontWeight: 400, lineHeight: 1.55,
          color: paper, opacity: 0.8, maxWidth: 760, marginBottom: 56,
        }}>
          Every quiz includes mandatory reflection questions. Producers and service reps answer in their own words. The AI grades the answer on a four-part rubric — specificity, comprehension, actionability, alignment — and tells you who actually engaged with the lesson and who coasted.
        </p>
      </Reveal>

      <Reveal delay={0.15}>
        <ComprehensionDemo />
      </Reveal>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-0 mt-16" style={{ borderTop: `1px solid ${paper}33` }}>
        {[
          { num: '01', title: 'Open answers, AI-graded', body: "No multiple-choice loopholes. Producers explain in their own words. The AI scores the answer 0 to 10 and flags vague or off-topic responses against the actual lesson content." },
          { num: '02', title: 'Specific feedback, not a score', body: "The manager dashboard shows the score plus what was missed — \"didn't reference the lesson,\" \"too generic,\" \"skipped the framework\" — with the specific lesson highlights they should have hit." },
          { num: '03', title: 'Trained on agency context', body: "The evaluator knows what a coverage conversation sounds like, what a real discovery answer looks like, what a producer should say to a price objection. Generic LMS bots can't grade this. Ours does." },
        ].map((s, i) => (
          <Reveal key={s.num} delay={i * 0.07}>
            <div style={{
              padding: '40px 24px', height: '100%',
              borderBottom: `1px solid ${paper}33`,
              borderRight: i < 2 ? `1px solid ${paper}33` : 'none',
            }}
              className="md:!border-r"
            >
              <span style={{
                fontFamily: editorial, fontSize: 'clamp(36px, 5vw, 56px)', fontWeight: 400,
                lineHeight: 0.85, letterSpacing: '-0.04em', color: blue,
              }}>
                {s.num}
              </span>
              <h3 style={{
                fontFamily: display, fontSize: 'clamp(20px, 2.4vw, 28px)',
                lineHeight: 1.05, letterSpacing: '-0.01em', color: paper,
                textTransform: 'uppercase', margin: 0, fontWeight: 400, marginTop: 16,
              }}>
                {s.title}
              </h3>
              <p style={{
                fontFamily: body, fontSize: 14, fontWeight: 400, lineHeight: 1.55,
                color: paper, opacity: 0.75, marginTop: 12,
              }}>
                {s.body}
              </p>
            </div>
          </Reveal>
        ))}
      </div>

      <Reveal delay={0.2}>
        <p style={{
          fontFamily: editorial, fontSize: 'clamp(20px, 2.4vw, 28px)',
          lineHeight: 1.2, letterSpacing: '-0.01em', color: paper,
          textTransform: 'uppercase', textAlign: 'center', marginTop: 56,
        }}>
          Most platforms track completion. <span style={{ color: blue }}>This one tracks understanding.</span>
        </p>
      </Reveal>
    </div>
  </section>
);

/* ══════════════════════════════════════════════════════
   AI CONTENT GENERATOR
   ══════════════════════════════════════════════════════ */
const AIContentSection = () => (
  <section style={{ background: paper, padding: '120px 24px' }}>
    <div className="max-w-[1280px] mx-auto">
      <Reveal>
        <p style={{
          fontFamily: body, fontSize: 12, fontWeight: 600, letterSpacing: '0.18em',
          color: ink, textTransform: 'uppercase', marginBottom: 28,
        }}>
          / Plus & Pro · AI Content Generator
        </p>
      </Reveal>
      <Reveal delay={0.05}>
        <h2 style={{
          fontFamily: display, fontSize: 'clamp(40px, 7vw, 100px)',
          lineHeight: 0.95, letterSpacing: '-0.01em', color: ink,
          textTransform: 'uppercase', margin: 0, fontWeight: 400, marginBottom: 24,
        }}>
          SKIP THE<br />
          <span style={{ color: blue }}>BLANK PAGE.</span>
        </h2>
      </Reveal>
      <Reveal delay={0.1}>
        <p style={{
          fontFamily: body, fontSize: 'clamp(16px, 1.6vw, 21px)', fontWeight: 400, lineHeight: 1.55,
          color: ink, opacity: 0.85, maxWidth: 760, marginBottom: 56,
        }}>
          Every Agency Brain plan includes the training builder — write your own lessons, build your own quizzes, structure your own tracks. Plus and Pro add the AI Content Generator <em>inside</em> the builder. Type a topic and get a full lesson. Upload a lesson and get a quiz. Paste any content and rewrite it clearer, more concise, more actionable, or beginner-friendly in one click.
        </p>
      </Reveal>

      <Reveal delay={0.15}>
        <ContentGeneratorDemo />
      </Reveal>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-0 mt-16" style={{ borderTop: `1px solid ${ink}` }}>
        {[
          { num: '01', title: 'Full lessons from a topic', body: 'Type what you want to teach. The AI returns a structured lesson — clear, practical, under 600 words, ready to assign.' },
          { num: '02', title: 'Quizzes from the lesson', body: 'Five to twelve multiple-choice questions, four options each, one right answer. Generated against the lesson you just wrote.' },
          { num: '03', title: 'Rewrites in four modes', body: 'Take any draft and rewrite it Clearer, Concise, Actionable, or Beginner-Friendly. Hand a rough idea, get back something your team can read on Monday.' },
        ].map((s, i) => (
          <Reveal key={s.num} delay={i * 0.07}>
            <div style={{
              padding: '40px 24px', height: '100%',
              borderBottom: `1px solid ${ink}`,
              borderRight: i < 2 ? `1px solid ${ink}` : 'none',
            }}
              className="md:!border-r"
            >
              <span style={{
                fontFamily: editorial, fontSize: 'clamp(36px, 5vw, 56px)', fontWeight: 400,
                lineHeight: 0.85, letterSpacing: '-0.04em', color: blue,
              }}>
                {s.num}
              </span>
              <h3 style={{
                fontFamily: display, fontSize: 'clamp(20px, 2.4vw, 28px)',
                lineHeight: 1.05, letterSpacing: '-0.01em', color: ink,
                textTransform: 'uppercase', margin: 0, fontWeight: 400, marginTop: 16,
              }}>
                {s.title}
              </h3>
              <p style={{
                fontFamily: body, fontSize: 14, fontWeight: 400, lineHeight: 1.55,
                color: ink, opacity: 0.7, marginTop: 12,
              }}>
                {s.body}
              </p>
            </div>
          </Reveal>
        ))}
      </div>

      <Reveal delay={0.2}>
        <p style={{
          fontFamily: editorial, fontSize: 'clamp(20px, 2.4vw, 28px)',
          lineHeight: 1.2, letterSpacing: '-0.01em', color: ink,
          textTransform: 'uppercase', textAlign: 'center', marginTop: 56,
        }}>
          Every plan lets you build. <span style={{ color: blue }}>Plus and Pro do the first draft.</span>
        </p>
      </Reveal>
    </div>
  </section>
);

/* ══════════════════════════════════════════════════════
   HOW IT WORKS
   ══════════════════════════════════════════════════════ */
const HowItWorksSection = () => (
  <section style={{ background: ink, color: paper, padding: '120px 24px' }}>
    <div className="max-w-[1280px] mx-auto">
      <Reveal>
        <p style={{
          fontFamily: body, fontSize: 12, fontWeight: 600, letterSpacing: '0.18em',
          color: paper, opacity: 0.6, textTransform: 'uppercase', marginBottom: 28,
        }}>
          / How It Works
        </p>
      </Reveal>
      <Reveal delay={0.05}>
        <h2 style={{
          fontFamily: display, fontSize: 'clamp(40px, 7vw, 100px)',
          lineHeight: 0.95, letterSpacing: '-0.01em', color: paper,
          textTransform: 'uppercase', margin: 0, fontWeight: 400, marginBottom: 56,
        }}>
          BUILT FOR HOW<br />AGENCIES TRAIN.
        </h2>
      </Reveal>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-0" style={{ borderTop: `1px solid ${paper}33` }}>
        {[
          { num: '01', title: 'Role-based access', body: "Producers see producer training. Service reps see service training. Owners and managers unlock the management layer. Nobody gets buried in content that isn't theirs." },
          { num: '02', title: 'On demand. Every device.', body: 'Stream from the dashboard, on the desk, on a phone between calls. Nothing to install. No separate login.' },
          { num: '03', title: 'Built into the platform', body: 'Training lives next to the workflows, the call scoring, the sequences, and the LQS Roadmap. Watch a lesson on Mini Reviews — then run one in the same window.' },
        ].map((s, i) => (
          <Reveal key={s.num} delay={i * 0.07}>
            <div style={{
              padding: '40px 24px', height: '100%',
              borderBottom: `1px solid ${paper}33`,
              borderRight: i < 2 ? `1px solid ${paper}33` : 'none',
            }}
              className="md:!border-r"
            >
              <span style={{
                fontFamily: editorial, fontSize: 22, color: paper,
                opacity: 0.4, letterSpacing: '-0.01em',
              }}>
                {s.num}
              </span>
              <h3 style={{
                fontFamily: display, fontSize: 'clamp(20px, 2.4vw, 28px)',
                lineHeight: 1.05, letterSpacing: '-0.01em', color: paper,
                textTransform: 'uppercase', margin: 0, fontWeight: 400, marginTop: 16,
              }}>
                {s.title}
              </h3>
              <p style={{
                fontFamily: body, fontSize: 14, fontWeight: 400, lineHeight: 1.55,
                color: paper, opacity: 0.75, marginTop: 12,
              }}>
                {s.body}
              </p>
            </div>
          </Reveal>
        ))}
      </div>
    </div>
  </section>
);

/* ══════════════════════════════════════════════════════
   SAMPLE LESSONS
   ══════════════════════════════════════════════════════ */
const SAMPLE_LESSONS = [
  {
    trackLabel: 'Standard Sequence Sales',
    title: 'The 3-Question Approach',
    quote: 'How much do you think your house is worth? If you flipped your house upside down and shook it, what is all the stuff that falls out worth? If you had to wrap a number around all your financial assets — IRA, 401k, savings — what would that number be?',
  },
  {
    trackLabel: 'Objection Library',
    title: '"It\'s too expensive" — Option 3',
    quote: "I hear you on the price, and I don't want to keep you if you're busy. But before we hang up — do you have just one minute for me to show you how we might reduce that cost or uncover any hidden discounts? If it's still not a fit, I completely understand.",
  },
  {
    trackLabel: 'Sales Mastery',
    title: 'Tone, Tempo, Timing',
    quote: "The pause is where the decision happens. The reason decisions don't happen for you is because you don't give them space to pause and think and respond.",
  },
];

const SampleLessonsSection = () => (
  <section style={{ background: paper, padding: '120px 24px' }}>
    <div className="max-w-[1280px] mx-auto">
      <Reveal>
        <p style={{
          fontFamily: body, fontSize: 12, fontWeight: 600, letterSpacing: '0.18em',
          color: ink, textTransform: 'uppercase', marginBottom: 28,
        }}>
          / Sample Lessons
        </p>
      </Reveal>
      <Reveal delay={0.05}>
        <h2 style={{
          fontFamily: display, fontSize: 'clamp(40px, 7vw, 100px)',
          lineHeight: 0.95, letterSpacing: '-0.01em', color: ink,
          textTransform: 'uppercase', margin: 0, fontWeight: 400, marginBottom: 24,
        }}>
          REAL WORDS.<br />MONDAY MORNING.
        </h2>
      </Reveal>
      <Reveal delay={0.1}>
        <p style={{
          fontFamily: body, fontSize: 16, fontWeight: 400, lineHeight: 1.55,
          color: ink, opacity: 0.7, marginBottom: 56, maxWidth: 600,
        }}>
          Not summaries. The real language a producer hears on Monday morning.
        </p>
      </Reveal>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {SAMPLE_LESSONS.map((l, i) => (
          <Reveal key={l.title} delay={i * 0.08}>
            <article style={{
              border: `1px solid ${ink}`, padding: '32px 24px', height: '100%',
              display: 'flex', flexDirection: 'column', gap: 16,
            }}>
              <p style={{
                fontFamily: body, fontSize: 11, fontWeight: 700, letterSpacing: '0.16em',
                color: blue, textTransform: 'uppercase',
              }}>
                {l.trackLabel}
              </p>
              <h4 style={{
                fontFamily: display, fontSize: 'clamp(20px, 2.2vw, 26px)',
                lineHeight: 1.1, letterSpacing: '-0.01em', color: ink,
                textTransform: 'uppercase', margin: 0, fontWeight: 400,
              }}>
                {l.title}
              </h4>
              <blockquote style={{
                fontFamily: body, fontSize: 15, fontWeight: 400, lineHeight: 1.6,
                color: ink, opacity: 0.8, fontStyle: 'italic',
                borderLeft: `3px solid ${blue}`, paddingLeft: 14, margin: 0,
              }}>
                "{l.quote}"
              </blockquote>
            </article>
          </Reveal>
        ))}
      </div>
    </div>
  </section>
);

/* ══════════════════════════════════════════════════════
   ALWAYS GROWING
   ══════════════════════════════════════════════════════ */
const AlwaysGrowingSection = () => (
  <section style={{ background: paper, padding: '120px 24px', borderTop: `1px solid ${ink}` }}>
    <div className="max-w-[1280px] mx-auto">
      <Reveal>
        <p style={{
          fontFamily: body, fontSize: 12, fontWeight: 600, letterSpacing: '0.18em',
          color: ink, textTransform: 'uppercase', marginBottom: 28,
        }}>
          / Still Building
        </p>
      </Reveal>
      <Reveal delay={0.05}>
        <h2 style={{
          fontFamily: display, fontSize: 'clamp(40px, 7vw, 100px)',
          lineHeight: 0.95, letterSpacing: '-0.01em', color: ink,
          textTransform: 'uppercase', margin: 0, fontWeight: 400,
        }}>
          NEW LESSONS<br />ON THE REGULAR.
        </h2>
      </Reveal>
      <Reveal delay={0.1}>
        <p style={{
          fontFamily: body, fontSize: 'clamp(16px, 1.6vw, 21px)', fontWeight: 400, lineHeight: 1.55,
          color: ink, opacity: 0.85, maxWidth: 720, marginTop: 28,
        }}>
          The library grows from real coaching work — every Boardroom session, every objection that surfaces in a 1:1, every product update inside Agency Brain. When the field changes, the training catches up.
        </p>
      </Reveal>
      <Reveal delay={0.15}>
        <p style={{
          fontFamily: body, fontSize: 12, fontWeight: 500, letterSpacing: '0.06em',
          color: ink, opacity: 0.5, textTransform: 'uppercase', marginTop: 18,
        }}>
          Latest additions are flagged inside the platform.
        </p>
      </Reveal>
    </div>
  </section>
);

/* ══════════════════════════════════════════════════════
   PLANS — sequential column animation
   ══════════════════════════════════════════════════════ */
type PlanItem = { node: React.ReactNode; emphasis: boolean };
type Plan = { name: string; price: string; eyebrow: string; highlighted: boolean; items: PlanItem[] };

const PLANS: Plan[] = [
  {
    name: 'Core', price: '$299', eyebrow: 'Software-Only Foundation', highlighted: false,
    items: [
      { node: 'Full training library — every track', emphasis: false },
      { node: 'Training builder — write your own lessons, quizzes, and tracks', emphasis: false },
      { node: 'AI comprehension grading on every quiz', emphasis: false },
      { node: 'Video Training Architect', emphasis: false },
      { node: 'Role-based access for your team', emphasis: false },
      { node: '20 AI calls / month', emphasis: false },
    ],
  },
  {
    name: 'Plus', price: '$449', eyebrow: 'Full Software Access', highlighted: true,
    items: [
      { node: 'Everything in Core', emphasis: false },
      { node: <><strong>AI Content Generator inside the builder</strong> — generate lessons, quizzes, and rewrites with AI instead of starting from a blank page</>, emphasis: true },
      { node: '50 AI calls / month', emphasis: false },
    ],
  },
  {
    name: 'Pro', price: '$599', eyebrow: 'Top Tier', highlighted: false,
    items: [
      { node: 'Everything in Plus', emphasis: false },
      { node: 'AI Sales Roleplay Bot', emphasis: true },
      { node: 'HR Suite', emphasis: true },
      { node: '2-hour 1:1 onboarding (recorded for your team)', emphasis: true },
      { node: 'Priority support', emphasis: false },
      { node: '100 AI calls / month', emphasis: false },
    ],
  },
];

const COLUMN_GAP_MS = 200;
const ITEM_STAGGER_MS = 60;
const ITEM_DURATION_S = 0.25;

const PlansSection = () => {
  const reduced = !!useReducedMotion();
  const columnStartDelays: number[] = [];
  let cursor = 0;
  for (const p of PLANS) {
    columnStartDelays.push(cursor);
    cursor += p.items.length * ITEM_STAGGER_MS + COLUMN_GAP_MS;
  }

  return (
    <section style={{ background: ink, color: paper, padding: '120px 24px' }}>
      <div className="max-w-[1280px] mx-auto">
        <Reveal>
          <p style={{
            fontFamily: body, fontSize: 12, fontWeight: 600, letterSpacing: '0.18em',
            color: paper, opacity: 0.6, textTransform: 'uppercase', marginBottom: 28,
          }}>
            / What's In Each Plan
          </p>
        </Reveal>
        <Reveal delay={0.05}>
          <h2 style={{
            fontFamily: display, fontSize: 'clamp(40px, 7vw, 100px)',
            lineHeight: 0.95, letterSpacing: '-0.01em', color: paper,
            textTransform: 'uppercase', margin: 0, fontWeight: 400, marginBottom: 56,
          }}>
            SAME LIBRARY.<br />MORE TOOLS THE<br />HIGHER YOU GO.
          </h2>
        </Reveal>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '0px 0px -10% 0px' }}
        >
          {PLANS.map((p, ci) => (
            <div key={p.name} style={{
              border: p.highlighted ? `1.5px solid ${blue}` : `1px solid ${paper}33`,
              padding: '32px 24px', height: '100%',
              background: p.highlighted ? `${blue}10` : 'transparent',
              boxShadow: p.highlighted ? '0 24px 60px -28px rgba(32,128,255,0.45)' : 'none',
              transform: p.highlighted ? 'translateY(-12px)' : 'none',
              display: 'flex', flexDirection: 'column', gap: 18,
            }}>
              <div className="flex items-center gap-2 flex-wrap">
                <p style={{
                  fontFamily: body, fontSize: 11, fontWeight: 700, letterSpacing: '0.16em',
                  color: paper, opacity: 0.6, textTransform: 'uppercase',
                }}>
                  {p.eyebrow}
                </p>
                {p.highlighted && (
                  <span style={{
                    fontFamily: body, fontSize: 10, fontWeight: 700, letterSpacing: '0.16em',
                    color: ink, background: blue, textTransform: 'uppercase',
                    padding: '3px 8px', lineHeight: 1.4,
                  }}>
                    Most Popular
                  </span>
                )}
              </div>
              <h3 style={{
                fontFamily: display, fontSize: 'clamp(36px, 5vw, 56px)',
                lineHeight: 1, letterSpacing: '-0.01em',
                color: p.highlighted ? blue : paper,
                textTransform: 'uppercase', margin: 0, fontWeight: 400,
              }}>
                {p.name}
              </h3>
              <p style={{
                fontFamily: display, fontSize: 'clamp(28px, 3.4vw, 42px)',
                lineHeight: 1, letterSpacing: '-0.02em', color: paper,
                margin: 0, fontWeight: 400,
              }}>
                {p.price}<span style={{
                  fontFamily: body, fontSize: 14, fontWeight: 500, letterSpacing: '0.06em',
                  color: paper, opacity: 0.55, marginLeft: 6, textTransform: 'uppercase',
                }}>/mo</span>
              </p>
              <ul style={{
                listStyle: 'none', margin: 0, padding: 0,
                borderTop: `1px solid ${paper}33`,
              }}>
                {p.items.map((item, ii) => {
                  const delayS = reduced ? 0 : (columnStartDelays[ci] + ii * ITEM_STAGGER_MS) / 1000;
                  return (
                    <motion.li
                      key={ii}
                      style={{
                        fontFamily: body, fontSize: 14, fontWeight: 400, lineHeight: 1.5,
                        color: paper, opacity: 0.85, padding: '12px 0',
                        borderBottom: `1px solid ${paper}1a`,
                        display: 'flex', alignItems: 'flex-start', gap: 10,
                      }}
                      variants={
                        reduced
                          ? { hidden: { opacity: 1 }, visible: { opacity: 1 } }
                          : {
                              hidden: { opacity: 0 },
                              visible: { opacity: 1, transition: { duration: ITEM_DURATION_S, delay: delayS, ease: EASE } },
                            }
                      }
                    >
                      <motion.span
                        aria-hidden
                        style={{
                          width: 8, height: 8, background: item.emphasis ? blue : paper,
                          marginTop: 7, flexShrink: 0,
                        }}
                        variants={
                          reduced
                            ? { hidden: { scale: 1, opacity: 1 }, visible: { scale: 1, opacity: 1 } }
                            : item.emphasis
                              ? {
                                  hidden: { scale: 0, opacity: 0, boxShadow: `0 0 0 0 ${blue}00` },
                                  visible: {
                                    scale: [0, 1.25, 1],
                                    opacity: [0, 1, 1],
                                    boxShadow: [`0 0 0 0 ${blue}00`, `0 0 0 0 ${blue}00`, `0 0 0 6px ${blue}55`, `0 0 0 0 ${blue}00`],
                                    transition: { duration: 0.6, delay: delayS, times: [0, 0.4, 0.7, 1], ease: EASE },
                                  },
                                }
                              : {
                                  hidden: { scale: 0, opacity: 0 },
                                  visible: {
                                    scale: [0, 1.15, 1],
                                    opacity: [0, 1, 1],
                                    transition: { duration: ITEM_DURATION_S, delay: delayS, ease: EASE },
                                  },
                                }
                        }
                      />
                      <span>{item.node}</span>
                    </motion.li>
                  );
                })}
              </ul>
              <Link to="/#programs"
                style={{
                  fontFamily: body, fontSize: 12, fontWeight: 700, letterSpacing: '0.14em',
                  color: p.highlighted ? ink : paper,
                  background: p.highlighted ? paper : 'transparent',
                  textTransform: 'uppercase', textDecoration: 'none',
                  padding: '14px 0', textAlign: 'center', marginTop: 'auto',
                  border: `1.5px solid ${paper}`, transition: 'all .25s',
                }}
                className="hover:bg-[#2997FF] hover:border-[#2997FF] hover:text-white">
                Choose {p.name} →
              </Link>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

/* ══════════════════════════════════════════════════════
   GIANT CTA — TRAIN.
   ══════════════════════════════════════════════════════ */
const GiantCTA = () => (
  <Link to="/#programs" style={{ display: 'block', textDecoration: 'none' }}
    aria-label="Get Agency Brain">
    <section style={{
      background: paper, color: ink, padding: '100px 24px 70px',
      cursor: 'pointer', borderTop: `1px solid ${ink}`,
    }}>
      <div className="max-w-[1440px] mx-auto text-center">
        <Reveal>
          <p style={{
            fontFamily: body, fontSize: 12, fontWeight: 600, letterSpacing: '0.18em',
            color: ink, opacity: 0.5, textTransform: 'uppercase', marginBottom: 24,
          }}>
            / Ships With The Product
          </p>
        </Reveal>
        <Reveal delay={0.05}>
          <h2 style={{
            fontFamily: display, fontSize: 'clamp(72px, 22vw, 360px)',
            lineHeight: 0.82, letterSpacing: '-0.03em', color: ink,
            textTransform: 'uppercase', margin: 0, fontWeight: 400,
          }}>
            TRAIN.
          </h2>
        </Reveal>
        <Reveal delay={0.15}>
          <p style={{
            fontFamily: body, fontSize: 14, fontWeight: 500, letterSpacing: '0.06em',
            color: ink, opacity: 0.7, marginTop: 32, textTransform: 'uppercase',
          }}>
            Click anywhere &nbsp;→&nbsp; Pick a plan and start
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
            style={{ height: 22, filter: 'invert(1)', marginBottom: 18 }} />
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
            { label: 'Producer Challenge', href: '/the-challenge' },
          ]},
          { title: 'Company', items: [
            { label: 'About', href: '/about' },
            { label: 'Training', href: '/training' },
            { label: 'Contact', href: '/contact' },
            { label: 'Privacy', href: '/privacy' },
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
const BoldTraining = () => {
  useEffect(() => {
    document.title = 'Team Training — The Standard Playbook';
  }, []);

  return (
    <div style={{ background: paper, fontFamily: body, color: ink }}>
      <BoldNav />
      <Hero />
      <MarqueeBands />
      <DifferentiatorSection />
      <LibrarySection />
      <TwoLibrariesSection />
      <BuildYourOwnSection />
      <AIComprehensionSection />
      <AIContentSection />
      <HowItWorksSection />
      <SampleLessonsSection />
      <AlwaysGrowingSection />
      <PlansSection />
      <GiantCTA />
      <BoldFooter />
      <ContentMeta lastUpdated="March 2026" />
    </div>
  );
};

export default BoldTraining;
