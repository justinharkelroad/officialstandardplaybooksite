import { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Facebook, Linkedin } from 'lucide-react';
import standardLogo from '@/assets/standard-word-logo.png';

import MirrorPillarBars, { type PillarRow } from '@/components/mirror/MirrorPillarBars';
import MirrorTierCard from '@/components/mirror/MirrorTierCard';

import {
  PILLAR_LABELS,
  PILLAR_MAX,
  PILLAR_ORDER,
  type PillarKey,
} from '@/data/mirrorQuestions';
import {
  DIAGNOSTIC_MATRIX,
  TIER_LABELS,
  tierFromScore,
  type Tier,
} from '@/data/mirrorDiagnostics';
import { closerWordFor, routeForResult, secondaryBookingFor } from '@/lib/mirrorScoring';
import { supabase } from '@/integrations/supabase/client';

const display = '"Anton", "Archivo Black", "Oswald", Impact, sans-serif';
const editorial = '"Archivo Black", "Anton", Impact, sans-serif';
const body = 'Inter, -apple-system, BlinkMacSystemFont, "Helvetica Neue", Arial, sans-serif';

const ink = '#0A0A0B';
const paper = '#F4F2EE';
const blue = '#2997FF';

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

interface Submission {
  id?: string;
  email: string;
  full_name: string | null;
  total_score: number;
  tier: Tier;
  weakest_pillar: PillarKey;
  pillar_scores: Record<PillarKey, number>;
}

/* ── Header (compact dark nav) ─────────────────────────── */
const ResultsNav = () => (
  <nav
    style={{
      background: ink,
      borderBottom: `1px solid ${paper}1a`,
      height: 56,
      fontFamily: body,
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      zIndex: 50,
    }}
  >
    <div className="h-full px-6 md:px-10 flex items-center justify-between max-w-[1440px] mx-auto">
      <Link to="/" aria-label="Standard Playbook">
        <img src={standardLogo} alt="Standard Playbook"
          style={{ height: 22, filter: 'brightness(0) invert(1)' }} />
      </Link>
      <Link
        to="/mirror"
        style={{
          fontFamily: body,
          fontSize: 13,
          fontWeight: 500,
          letterSpacing: '0.06em',
          color: paper,
          textTransform: 'uppercase',
          textDecoration: 'none',
        }}
        className="hover:opacity-60 transition-opacity"
      >
        ← The Mirror
      </Link>
    </div>
  </nav>
);

/* ── Marquee (matches Bold pattern, ink/paper inverted for results page) ── */
const Marquee = ({ rotate, bg, color, dot, phrase }: { rotate: number; bg: string; color: string; dot: string; phrase: string }) => (
  <div style={{
    background: bg, color, transform: `rotate(${rotate}deg)`,
    padding: '14px 0', whiteSpace: 'nowrap', overflow: 'hidden',
    width: '120%', marginLeft: '-10%',
    borderTop: `1px solid ${color}33`, borderBottom: `1px solid ${color}33`,
  }}>
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: 28, animation: 'sp-marquee-r 32s linear infinite' }}>
      {Array.from({ length: 14 }).map((_, i) => (
        <span key={i} style={{ display: 'inline-flex', alignItems: 'center', gap: 28 }}>
          <span style={{ fontFamily: editorial, fontSize: 'clamp(22px, 3.4vw, 44px)', letterSpacing: '0.04em', fontWeight: 400 }}>{phrase}</span>
          <span aria-hidden style={{ display: 'inline-block', width: 18, height: 18, borderRadius: 999, background: dot, flexShrink: 0 }} />
        </span>
      ))}
    </div>
  </div>
);

const MarqueeBands = ({ phrase }: { phrase: string }) => (
  <div style={{ background: ink, padding: '40px 0', position: 'relative', overflow: 'hidden' }}>
    <Marquee rotate={-3} bg={paper} color={ink} dot={blue} phrase={phrase} />
    <div style={{ marginTop: -24 }}>
      <Marquee rotate={2.5} bg={ink} color={paper} dot={paper} phrase={phrase} />
    </div>
    <style>{`
      @keyframes sp-marquee-r {
        from { transform: translateX(0); }
        to { transform: translateX(-50%); }
      }
    `}</style>
  </div>
);

/* ── Footer (dark, mirrors BoldFooter) ─────────────────── */
const BoldFooter = () => (
  <footer style={{ background: ink, color: paper, padding: '60px 24px 30px', borderTop: `1px solid ${paper}1a` }}>
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

/* ── Page ──────────────────────────────────────────────── */
const BoldMirrorResults = () => {
  const [searchParams] = useSearchParams();
  const id = searchParams.get('id');
  const fallbackScore = searchParams.get('score');
  const fallbackTier = searchParams.get('tier') as Tier | null;
  const fallbackPillar = searchParams.get('pillar') as PillarKey | null;

  const [submission, setSubmission] = useState<Submission | null>(null);
  const [loading, setLoading] = useState<boolean>(Boolean(id));
  const [loadError, setLoadError] = useState<string | null>(null);

  // Meta Pixel PageView
  useEffect(() => {
    try { (window as any).fbq?.('track', 'PageView'); } catch {}
  }, []);

  useEffect(() => {
    let cancelled = false;
    if (!id) {
      // No id — render in fallback mode using URL params (or empty zero state).
      if (fallbackScore && fallbackTier && fallbackPillar) {
        // Build a synthetic submission from URL params (no per-pillar breakdown available).
        const totalScore = Number(fallbackScore);
        setSubmission({
          email: '',
          full_name: null,
          total_score: totalScore,
          tier: fallbackTier,
          weakest_pillar: fallbackPillar,
          pillar_scores: {
            culture_team: 0,
            systems_rhythm: 0,
            training_scripts: 0,
            marketing_lead_flow: 0,
            owner_command: 0,
          },
        });
      }
      setLoading(false);
      return;
    }

    (async () => {
      setLoading(true);
      try {
        // @ts-expect-error mirror_submissions table types regenerate after migration.
        const { data, error } = await supabase
          .from('mirror_submissions')
          .select('id, email, full_name, total_score, tier, weakest_pillar, pillar_scores')
          .eq('id', id)
          .maybeSingle();
        if (cancelled) return;
        if (error) throw error;
        if (!data) {
          setLoadError('We couldn\'t find that result.');
        } else {
          setSubmission(data as unknown as Submission);
        }
      } catch (err: any) {
        if (cancelled) return;
        console.error('Failed to load submission', err);
        setLoadError('Something went wrong loading your results.');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => { cancelled = true; };
  }, [id, fallbackScore, fallbackTier, fallbackPillar]);

  const pillarRows: PillarRow[] = useMemo(() => {
    if (!submission) return [];
    return PILLAR_ORDER.map((key) => ({
      key,
      name: PILLAR_LABELS[key],
      score: submission.pillar_scores[key] ?? 0,
      max: PILLAR_MAX[key],
    }));
  }, [submission]);

  const route = useMemo(() => {
    if (!submission) return null;
    return routeForResult(submission.tier, submission.weakest_pillar);
  }, [submission]);

  const secondary = useMemo(() => (route ? secondaryBookingFor(route) : null), [route]);

  const closerWord = useMemo(() => {
    if (!submission) return 'JOIN.';
    return closerWordFor(submission.tier, submission.weakest_pillar);
  }, [submission]);

  const diagnosticCopy = useMemo(() => {
    if (!submission) return '';
    return DIAGNOSTIC_MATRIX[submission.tier]?.[submission.weakest_pillar] ?? '';
  }, [submission]);

  if (loading) {
    return (
      <div style={{ background: ink, color: paper, fontFamily: body, minHeight: '100vh' }}>
        <ResultsNav />
        <div className="max-w-[1280px] mx-auto px-6 py-32 text-center">
          <p style={{ fontFamily: body, fontSize: 14, letterSpacing: '0.16em', textTransform: 'uppercase', opacity: 0.55 }}>
            Loading your Mirror…
          </p>
        </div>
      </div>
    );
  }

  if (!submission) {
    return (
      <div style={{ background: ink, color: paper, fontFamily: body, minHeight: '100vh' }}>
        <ResultsNav />
        <div className="max-w-[720px] mx-auto px-6 py-32 text-center">
          <h1 style={{
            fontFamily: display, fontSize: 'clamp(40px, 6vw, 72px)',
            lineHeight: 0.95, color: paper, textTransform: 'uppercase', fontWeight: 400,
          }}>
            We couldn't load your results.
          </h1>
          <p style={{ fontFamily: body, fontSize: 16, color: paper, opacity: 0.7, marginTop: 16 }}>
            {loadError ?? "Try retaking the assessment."}
          </p>
          <Link
            to="/mirror/score"
            style={{
              display: 'inline-block',
              marginTop: 36,
              fontFamily: body, fontSize: 13, fontWeight: 700, letterSpacing: '0.14em',
              color: ink, background: paper, textTransform: 'uppercase',
              padding: '15px 28px', textDecoration: 'none',
            }}
          >
            Retake the Mirror →
          </Link>
        </div>
      </div>
    );
  }

  const tierLabel = TIER_LABELS[submission.tier] ?? submission.tier;
  const inferredTier = tierFromScore(submission.total_score);
  const displayTier = tierLabel ?? TIER_LABELS[inferredTier];

  return (
    <div style={{ background: ink, color: paper, fontFamily: body, minHeight: '100vh' }}>
      <ResultsNav />

      {/* ───── Hero score reveal ───── */}
      <section style={{ background: ink, padding: '120px 24px 80px' }}>
        <div className="max-w-[1280px] mx-auto">
          <Reveal>
            <p style={{
              fontFamily: body, fontSize: 12, fontWeight: 600, letterSpacing: '0.18em',
              color: paper, opacity: 0.6, textTransform: 'uppercase', marginBottom: 32,
            }}>
              / Your Mirror
            </p>
          </Reveal>

          <div className="grid grid-cols-12 gap-8 items-end">
            <Reveal className="col-span-12 md:col-span-7">
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 24, flexWrap: 'wrap' }}>
                <span style={{
                  fontFamily: display,
                  fontSize: 'clamp(120px, 24vw, 280px)',
                  lineHeight: 0.82,
                  letterSpacing: '-0.04em',
                  color: paper,
                  fontWeight: 400,
                }}>
                  {submission.total_score}
                </span>
                <span style={{
                  fontFamily: body, fontSize: 'clamp(20px, 2vw, 28px)',
                  fontWeight: 500, color: paper, opacity: 0.6,
                }}>
                  / 160
                </span>
              </div>
            </Reveal>

            <Reveal delay={0.1} className="col-span-12 md:col-span-5">
              <p style={{
                fontFamily: body, fontSize: 12, fontWeight: 700, letterSpacing: '0.18em',
                color: paper, opacity: 0.55, textTransform: 'uppercase', marginBottom: 6,
              }}>
                Your Tier
              </p>
              <h1 style={{
                fontFamily: display, fontSize: 'clamp(40px, 6vw, 80px)',
                lineHeight: 0.92, letterSpacing: '-0.01em', color: blue,
                textTransform: 'uppercase', margin: 0, fontWeight: 400,
              }}>
                {displayTier}
              </h1>
              <p style={{
                fontFamily: body, fontSize: 14, fontWeight: 400, lineHeight: 1.55,
                color: paper, opacity: 0.7, marginTop: 14, maxWidth: 360,
              }}>
                {submission.full_name ? `Honest read, ${submission.full_name.trim().split(' ')[0]}.` : 'Honest read.'} The number is what the number is — what matters is the next move.
              </p>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ───── Pillar breakdown ───── */}
      <section style={{ background: ink, padding: '40px 24px 80px' }}>
        <div className="max-w-[1080px] mx-auto">
          <Reveal>
            <p style={{
              fontFamily: body, fontSize: 12, fontWeight: 600, letterSpacing: '0.18em',
              color: paper, opacity: 0.6, textTransform: 'uppercase', marginBottom: 12,
            }}>
              / Pillar Breakdown
            </p>
            <h2 style={{
              fontFamily: display, fontSize: 'clamp(36px, 5vw, 64px)',
              lineHeight: 0.95, letterSpacing: '-0.01em', color: paper,
              textTransform: 'uppercase', margin: 0, fontWeight: 400, marginBottom: 32,
            }}>
              Where the score came from.
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <MirrorPillarBars rows={pillarRows} weakestKey={submission.weakest_pillar} onInk />
          </Reveal>
        </div>
      </section>

      {/* ───── Diagnostic card ───── */}
      <section style={{ background: ink, padding: '60px 24px 100px' }}>
        <div className="max-w-[1080px] mx-auto">
          <Reveal>
            <MirrorTierCard
              pillarName={PILLAR_LABELS[submission.weakest_pillar]}
              copy={diagnosticCopy}
            />
          </Reveal>

          {route && (
            <Reveal delay={0.15}>
              <div style={{ marginTop: 36, display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 24 }}>
                {route.ctaKind === 'external' ? (
                  <a
                    href={route.ctaHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: 'inline-block',
                      fontFamily: body, fontSize: 14, fontWeight: 700, letterSpacing: '0.14em',
                      color: paper, background: 'transparent', textTransform: 'uppercase',
                      padding: '18px 28px', border: `1.5px solid ${paper}`, textDecoration: 'none',
                      transition: 'all .25s',
                    }}
                    className="hover:bg-[#2997FF] hover:border-[#2997FF]"
                  >
                    {route.ctaLabel} →
                  </a>
                ) : (
                  <Link
                    to={route.ctaHref}
                    style={{
                      display: 'inline-block',
                      fontFamily: body, fontSize: 14, fontWeight: 700, letterSpacing: '0.14em',
                      color: paper, background: 'transparent', textTransform: 'uppercase',
                      padding: '18px 28px', border: `1.5px solid ${paper}`, textDecoration: 'none',
                      transition: 'all .25s',
                    }}
                    className="hover:bg-[#2997FF] hover:border-[#2997FF]"
                  >
                    {route.ctaLabel} →
                  </Link>
                )}

                {secondary && (
                  <a
                    href={secondary.ctaHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: 'inline-block',
                      fontFamily: body, fontSize: 14, fontWeight: 700, letterSpacing: '0.14em',
                      color: paper, background: 'transparent', textTransform: 'uppercase',
                      padding: '18px 28px', border: `1.5px solid ${paper}88`, textDecoration: 'none',
                      transition: 'all .25s',
                    }}
                    className="hover:bg-[#2997FF] hover:border-[#2997FF] hover:!text-white"
                  >
                    {secondary.ctaLabel} →
                  </a>
                )}
              </div>
            </Reveal>
          )}

          {submission.email && (
            <Reveal delay={0.2}>
              <p
                style={{
                  fontFamily: body, fontSize: 14, fontWeight: 400, lineHeight: 1.6,
                  color: paper, opacity: 0.65, marginTop: 56, maxWidth: 640,
                }}
              >
                Your full Mirror PDF and 7-day personalized breakdown have been sent to{' '}
                <span style={{ color: paper, opacity: 1, fontWeight: 600 }}>{submission.email}</span>.
              </p>
            </Reveal>
          )}
        </div>
      </section>

      <MarqueeBands phrase={`THE STANDARD · ${tierLabel.toUpperCase()} · ${PILLAR_LABELS[submission.weakest_pillar].toUpperCase()}`} />

      {/* ───── Giant CTA closer ───── */}
      <section
        onClick={() => {
          if (!route) return;
          if (route.ctaKind === 'external') {
            window.open(route.ctaHref, '_blank', 'noopener,noreferrer');
          } else {
            window.location.assign(route.ctaHref);
          }
        }}
        style={{
          background: ink, padding: '100px 24px 70px',
          cursor: route ? 'pointer' : 'default', borderTop: `1px solid ${ink}`,
        }}
        role="button"
        aria-label={route?.ctaLabel ?? 'Take the next step'}
      >
        <div className="max-w-[1440px] mx-auto text-center">
          <Reveal>
            <p style={{
              fontFamily: body, fontSize: 12, fontWeight: 600, letterSpacing: '0.18em',
              color: paper, opacity: 0.5, textTransform: 'uppercase', marginBottom: 24,
            }}>
              / Your Move
            </p>
          </Reveal>
          <Reveal delay={0.05}>
            <h2 style={{
              fontFamily: display, fontSize: 'clamp(72px, 22vw, 360px)',
              lineHeight: 0.82, letterSpacing: '-0.03em', color: paper,
              textTransform: 'uppercase', margin: 0, fontWeight: 400,
            }}>
              {closerWord}
            </h2>
          </Reveal>
          <Reveal delay={0.15}>
            <p style={{
              fontFamily: body, fontSize: 14, fontWeight: 500, letterSpacing: '0.06em',
              color: paper, opacity: 0.7, marginTop: 32, textTransform: 'uppercase',
            }}>
              Click anywhere &nbsp;→&nbsp; {route?.ctaLabel ?? 'Take the next step'}
            </p>
          </Reveal>
          {secondary && (
            <Reveal delay={0.2}>
              <div style={{ marginTop: 32 }}>
                <a
                  href={secondary.ctaHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  style={{
                    display: 'inline-block',
                    fontFamily: body, fontSize: 13, fontWeight: 700, letterSpacing: '0.14em',
                    color: paper, background: 'transparent', textTransform: 'uppercase',
                    padding: '14px 24px', border: `1.5px solid ${paper}88`, textDecoration: 'none',
                    transition: 'all .25s',
                  }}
                  className="hover:bg-[#2997FF] hover:border-[#2997FF] hover:!text-white"
                >
                  Or {secondary.ctaLabel} →
                </a>
              </div>
            </Reveal>
          )}
        </div>
      </section>

      <BoldFooter />
    </div>
  );
};

export default BoldMirrorResults;
