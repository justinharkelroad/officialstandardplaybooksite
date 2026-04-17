import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Navigation from '@/components/Navigation';
import SEOHead from '@/components/SEOHead';
import DirectiveApplicationModal from '@/components/DirectiveApplicationModal';
import StandardFitModal from '@/components/StandardFitModal';

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
   HERO — BLACK, PLACEHOLDER FOR B&W IMAGE
   ══════════════════════════════════════════════════════ */
const HeroSection = () => (
  <section
    className="relative flex items-center justify-center text-center"
    style={{
      background: '#000',
      minHeight: '70vh',
      paddingTop: 48,
    }}
  >
    <div className="px-6 max-w-[980px] mx-auto">
      <Reveal>
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
          Make the decision.
        </h1>
      </Reveal>
      <Reveal delay={0.15}>
        <p
          style={{
            fontFamily: sf,
            fontSize: 'clamp(18px, 3vw, 21px)',
            fontWeight: 400,
            lineHeight: 1.19,
            letterSpacing: '0.231px',
            color: 'rgba(255,255,255,0.7)',
            marginTop: 16,
          }}
        >
          Every program. One place. Choose what fits your agency.
        </p>
      </Reveal>
    </div>
  </section>
);

/* ══════════════════════════════════════════════════════
   SHARED CARD PIECES
   ══════════════════════════════════════════════════════ */
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

/* ══════════════════════════════════════════════════════
   COACHING PROGRAMS DATA
   ══════════════════════════════════════════════════════ */
type ActionSingle = { kind: 'link'; cta: string; href: string; external?: boolean };
type ActionDual = { kind: 'dual'; primary: { cta: string; href: string }; secondary: { cta: string; href: string } };
type ActionDirective = { kind: 'directive' };
type ActionSoldOut = { kind: 'sold-out' };
type Action = ActionSingle | ActionDual | ActionDirective | ActionSoldOut;

interface Program {
  label: string;
  title: string;
  description: string;
  details: string[];
  price: string | null;
  soldOut: boolean;
  action: Action;
}

const coachingPrograms: Program[] = [
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
    price: '$2,000/mo',
    soldOut: true,
    action: { kind: 'sold-out' },
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
    price: '$1,500/mo',
    soldOut: false,
    action: { kind: 'link', cta: 'Secure Now', href: 'https://buy.stripe.com/bJe6oHdhk6iy7K035y4Vy08', external: true },
  },
  {
    label: 'Membership',
    title: 'The Boardroom',
    description: 'Monthly coaching + accountability for owners who want steady momentum.',
    details: [
      'Live monthly group coaching with Justin',
      'Hot-seat problem solving with other owners',
      'Lvl 1 Agency Brain platform access',
      'Team training library + scripts',
      'Ongoing accountability between calls',
      'Private Boardroom community access',
    ],
    price: '$299/mo',
    soldOut: false,
    action: { kind: 'link', cta: 'Join The Boardroom', href: 'https://buy.stripe.com/aFa9AT4KOayO0hycG84Vy0l', external: true },
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
    price: '$4,500 PIF  /  $625 weekly',
    soldOut: false,
    action: {
      kind: 'dual',
      primary: { cta: 'Secure PIF', href: 'https://link.fastpaydirect.com/payment-link/67b9e4c1020837472ed0b709' },
      secondary: { cta: 'Secure Weekly', href: 'https://link.fastpaydirect.com/payment-link/67b9e53c156a771b286e2ca6' },
    },
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
    action: { kind: 'link', cta: 'Start the Challenge', href: 'https://myagencybrain.com/six-week-challenge', external: true },
  },
];

/* ══════════════════════════════════════════════════════
   COACHING CARD
   ══════════════════════════════════════════════════════ */
const CoachingCard = ({ program, onDirectiveClick }: { program: Program; onDirectiveClick: () => void }) => {
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

      <div className="flex items-center gap-3 flex-wrap">
        {program.action.kind === 'sold-out' ? (
          <span style={{
            fontFamily: sf, fontSize: 14, fontWeight: 600, letterSpacing: '-0.224px',
            color: '#ff3b30', textTransform: 'uppercase',
          }}>
            Currently Unavailable
          </span>
        ) : program.action.kind === 'directive' ? (
          <button onClick={onDirectiveClick} style={{
            fontFamily: sf, fontSize: 17, fontWeight: 400, color: '#fff', background: '#0071e3',
            border: '1px solid transparent', borderRadius: 8, padding: '8px 20px', cursor: 'pointer',
          }} className="hover:brightness-110 transition-all">
            Apply Now
          </button>
        ) : program.action.kind === 'dual' ? (
          <>
            <a
              href={program.action.primary.href}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                fontFamily: sf, fontSize: 17, fontWeight: 400, color: '#fff', background: '#0071e3',
                border: '1px solid transparent', borderRadius: 8, padding: '8px 20px', textDecoration: 'none',
              }}
              className="hover:brightness-110 transition-all"
            >
              {program.action.primary.cta}
            </a>
            <a
              href={program.action.secondary.href}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                fontFamily: sf, fontSize: 17, fontWeight: 400, color: '#0071e3', background: 'transparent',
                border: '1px solid #0071e3', borderRadius: 8, padding: '8px 20px', textDecoration: 'none',
              }}
              className="hover:bg-[#0071e3]/5 transition-all"
            >
              {program.action.secondary.cta}
            </a>
          </>
        ) : (
          <a
            href={program.action.href}
            {...(program.action.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
            style={{
              fontFamily: sf, fontSize: 17, fontWeight: 400, color: '#fff', background: '#0071e3',
              border: '1px solid transparent', borderRadius: 8, padding: '8px 20px', textDecoration: 'none',
            }}
            className="hover:brightness-110 transition-all"
          >
            {program.action.cta}
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

/* ══════════════════════════════════════════════════════
   PROGRAMS SECTION — LIGHT GRAY
   ══════════════════════════════════════════════════════ */
const ProgramsSection = () => {
  const [directiveModalOpen, setDirectiveModalOpen] = useState(false);

  return (
    <section id="programs" style={{ background: '#f5f5f7', padding: '120px 24px' }}>
      <div className="max-w-[980px] mx-auto">
        <Reveal>
          <div className="text-center mb-16">
            <p style={{
              fontFamily: sf, fontSize: 14, fontWeight: 600, lineHeight: 1.29,
              letterSpacing: '-0.224px', color: 'rgba(0,0,0,0.48)',
              textTransform: 'uppercase', marginBottom: 12,
            }}>
              Coaching Programs
            </p>
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
              No contracts. Just the right move for where your agency is right now.
            </p>
          </div>
        </Reveal>

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
      </div>

      <DirectiveApplicationModal open={directiveModalOpen} onOpenChange={setDirectiveModalOpen} />
    </section>
  );
};

/* ══════════════════════════════════════════════════════
   CALL SCORING — BLACK SECTION
   ══════════════════════════════════════════════════════ */
const callScoringTiers = {
  '30': {
    calls: '30 Calls Per Month',
    price: '$299',
    link: 'https://buy.stripe.com/6oU5kDelodL0d4k5dG4Vy09',
  },
  '50': {
    calls: '50 Calls Per Month',
    price: '$399',
    link: 'https://buy.stripe.com/6oU7sLb9c7mC9S8cG84Vy0a',
  },
  '100': {
    calls: '100 Calls Per Month',
    price: '$499',
    link: 'https://buy.stripe.com/aFacN59147mC7K035y4Vy0b',
  },
} as const;

type TierKey = keyof typeof callScoringTiers;

const universalBenefits = [
  'Fully customize the scoring',
  'Add team members & managers',
  'No contract',
  'No commitment',
];

const CallScoringSection = () => {
  const [tier, setTier] = useState<TierKey>('50');
  const active = callScoringTiers[tier];

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = '/Example_Sales_Call_Result.pdf';
    link.download = 'Example_Sales_Call_Result.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <section style={{ background: '#000', padding: '120px 24px' }}>
      <div className="max-w-[980px] mx-auto">
        <Reveal>
          <div className="text-center mb-16">
            <p style={{
              fontFamily: sf, fontSize: 14, fontWeight: 600, lineHeight: 1.29,
              letterSpacing: '-0.224px', color: 'rgba(255,255,255,0.48)',
              textTransform: 'uppercase', marginBottom: 12,
            }}>
              AI Software
            </p>
            <h2 style={{
              fontFamily: sf, fontSize: 'clamp(32px, 5vw, 56px)', fontWeight: 600,
              lineHeight: 1.07, letterSpacing: '-0.28px', color: '#fff',
            }}>
              Standard Call Scoring.
            </h2>
            <p style={{
              fontFamily: sf, fontSize: 17, fontWeight: 400, lineHeight: 1.47,
              letterSpacing: '-0.374px', color: 'rgba(255,255,255,0.6)', marginTop: 8,
            }}>
              Replace long call reviews with fast, AI-powered scoring.
            </p>

            <button
              onClick={handleDownload}
              style={{
                fontFamily: sf, fontSize: 14, fontWeight: 400, color: '#2997ff',
                background: 'transparent', border: '1px solid #2997ff', borderRadius: 980,
                padding: '8px 20px', cursor: 'pointer', marginTop: 24,
              }}
              className="hover:bg-[#2997ff]/10 transition-all"
            >
              See example call score result &#8594;
            </button>
          </div>
        </Reveal>

        {/* Benefits row */}
        <Reveal delay={0.1}>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16 max-w-[720px] mx-auto">
            {universalBenefits.map((benefit) => (
              <div
                key={benefit}
                style={{
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(255,255,255,0.06)',
                  borderRadius: 12,
                  padding: '16px 12px',
                  textAlign: 'center',
                }}
              >
                <span style={{
                  fontFamily: sf, fontSize: 14, fontWeight: 400, lineHeight: 1.43,
                  letterSpacing: '-0.224px', color: 'rgba(255,255,255,0.8)',
                }}>
                  {benefit}
                </span>
              </div>
            ))}
          </div>
        </Reveal>

        {/* Pricing selector */}
        <Reveal delay={0.2}>
          <div
            style={{
              background: 'rgba(255,255,255,0.04)',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
              border: '1px solid rgba(255,255,255,0.06)',
              borderRadius: 16,
              padding: 40,
              maxWidth: 560,
              margin: '0 auto',
            }}
          >
            <div className="text-center">
              <p style={{
                fontFamily: sf, fontSize: 14, fontWeight: 600, lineHeight: 1.29,
                letterSpacing: '-0.224px', color: 'rgba(255,255,255,0.48)',
                textTransform: 'uppercase', marginBottom: 20,
              }}>
                Choose your volume
              </p>

              {/* Segmented control */}
              <div
                className="flex items-center justify-center gap-1 mb-10"
                style={{
                  background: 'rgba(255,255,255,0.06)',
                  borderRadius: 980,
                  padding: 4,
                  width: 'fit-content',
                  margin: '0 auto 32px',
                }}
                role="tablist"
              >
                {(Object.keys(callScoringTiers) as TierKey[]).map((key) => (
                  <button
                    key={key}
                    role="tab"
                    aria-selected={key === tier}
                    onClick={() => setTier(key)}
                    style={{
                      fontFamily: sf, fontSize: 14,
                      fontWeight: key === tier ? 600 : 400,
                      letterSpacing: '-0.224px',
                      color: key === tier ? '#1d1d1f' : 'rgba(255,255,255,0.6)',
                      background: key === tier ? '#fff' : 'transparent',
                      border: 'none',
                      borderRadius: 980,
                      padding: '8px 20px',
                      cursor: 'pointer',
                      transition: 'all 0.3s',
                    }}
                  >
                    {key} calls
                  </button>
                ))}
              </div>

              <motion.div
                key={tier}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
              >
                <p style={{
                  fontFamily: sf, fontSize: 14, fontWeight: 400,
                  letterSpacing: '-0.224px', color: 'rgba(255,255,255,0.48)',
                  marginBottom: 8,
                }}>
                  {active.calls}
                </p>
                <div className="flex items-end justify-center" style={{ marginBottom: 32 }}>
                  <span style={{
                    fontFamily: sf, fontSize: 72, fontWeight: 600,
                    lineHeight: 1, letterSpacing: '-0.5px', color: '#fff',
                  }}>
                    {active.price}
                  </span>
                  <span style={{
                    fontFamily: sf, fontSize: 21, fontWeight: 400,
                    letterSpacing: '0.231px', color: 'rgba(255,255,255,0.48)',
                    marginLeft: 4, marginBottom: 12,
                  }}>
                    /month
                  </span>
                </div>
              </motion.div>

              {/* Promo code */}
              <div
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: 10,
                  background: 'rgba(41,151,255,0.08)',
                  border: '1px solid rgba(41,151,255,0.3)',
                  borderRadius: 980,
                  padding: '8px 16px',
                  marginBottom: 20,
                }}
              >
                <span style={{
                  fontFamily: sf, fontSize: 12, fontWeight: 400,
                  letterSpacing: '-0.12px', color: 'rgba(255,255,255,0.7)',
                }}>
                  Use code
                </span>
                <span style={{
                  fontFamily: sf, fontSize: 13, fontWeight: 600,
                  letterSpacing: '0.4px', color: '#2997ff',
                }}>
                  STANDARD2026
                </span>
                <span style={{
                  fontFamily: sf, fontSize: 12, fontWeight: 400,
                  letterSpacing: '-0.12px', color: 'rgba(255,255,255,0.7)',
                }}>
                  for 50% off first month
                </span>
              </div>

              <a
                href={active.link}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  fontFamily: sf, fontSize: 17, fontWeight: 400,
                  color: '#fff', background: '#0071e3',
                  border: '1px solid transparent', borderRadius: 980,
                  padding: '12px 28px', textDecoration: 'none',
                  display: 'block',
                  width: 'fit-content',
                  margin: '0 auto',
                }}
                className="hover:brightness-110 transition-all"
              >
                Secure Now
              </a>

              <p style={{
                fontFamily: sf, fontSize: 12, fontWeight: 400,
                letterSpacing: '-0.12px', color: 'rgba(255,255,255,0.36)',
                marginTop: 20,
              }}>
                Month-to-month. No contract.
              </p>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
};

/* ══════════════════════════════════════════════════════
   NOT SURE — CTA BLOCK
   ══════════════════════════════════════════════════════ */
const NotSureSection = () => {
  const [fitModalOpen, setFitModalOpen] = useState(false);

  return (
    <section style={{ background: '#f5f5f7', padding: '100px 24px' }}>
      <div className="max-w-[980px] mx-auto text-center">
        <Reveal>
          <p style={{
            fontFamily: sf, fontSize: 'clamp(28px, 4vw, 40px)', fontWeight: 600,
            lineHeight: 1.1, letterSpacing: '-0.28px', color: '#1d1d1f', marginBottom: 12,
          }}>
            Not sure where to start?
          </p>
          <p style={{
            fontFamily: sf, fontSize: 17, fontWeight: 400, lineHeight: 1.47,
            letterSpacing: '-0.374px', color: 'rgba(0,0,0,0.48)', marginBottom: 24,
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
        </Reveal>
      </div>
    </section>
  );
};

/* ══════════════════════════════════════════════════════
   APPLE FOOTER
   ══════════════════════════════════════════════════════ */
const AppleFooter = () => (
  <footer style={{ background: '#f5f5f7', borderTop: '1px solid rgba(0,0,0,0.08)', padding: '20px 24px' }}>
    <div className="max-w-[980px] mx-auto">
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <p style={{
          fontFamily: sf, fontSize: 12, fontWeight: 400, lineHeight: 1.33,
          letterSpacing: '-0.12px', color: 'rgba(0,0,0,0.48)',
        }}>
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
                  fontFamily: sf, fontSize: 12, fontWeight: 400,
                  letterSpacing: '-0.12px', color: 'rgba(0,0,0,0.48)', textDecoration: 'none',
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
const Decision = () => (
  <div style={{ fontFamily: sf, background: '#000' }}>
    <SEOHead />
    <Navigation />
    <HeroSection />
    <ProgramsSection />
    <CallScoringSection />
    <NotSureSection />
    <AppleFooter />
  </div>
);

export default Decision;
