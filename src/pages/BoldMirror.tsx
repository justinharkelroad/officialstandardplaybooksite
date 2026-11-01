import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowDown, ArrowRight, Check, Facebook, Linkedin } from "lucide-react";
import standardLogo from "@/assets/standard-word-logo.png";
import { captureMirrorAttribution } from "@/lib/mirrorAttribution";
import {
  MIRROR_QUICK_ITEMS,
  MIRROR_SALES_HERO,
  MIRROR_SALES_PILLARS,
  MIRROR_SALES_STEPS,
  MIRROR_SALES_DOSSIER,
  MIRROR_SALES_STORY,
  MIRROR_SALES_TESTIMONIALS,
  MIRROR_SALES_OFFER,
  MIRROR_SALES_FAQ,
} from "@/data/mirrorChallengeCopy";
import VslPlayer from "@/components/vsl/VslPlayer";
import { VSL_VIDEOS } from "@/config/vsl";
import { MIRROR_CREDIT_TERMS, RESULTS_DISCLAIMER } from "@/config/offers";
import { trackFunnel, trackVslEvent } from "@/lib/funnel/track";
import "./BoldMirror.css";

const ink = "#0A0A0B";
const paper = "#F4F2EE";
const body =
  'Inter, -apple-system, BlinkMacSystemFont, "Helvetica Neue", Arial, sans-serif';
const ratingLabels = [
  "We don't have this",
  "We've started but it's inconsistent",
  "It exists and runs most of the time",
  "Solid system, team follows it",
  "Dialed in, measured, and improving",
];

// Enrollment and payment stay in the current Agency Brain provisioning flow.
function ChallengeLink({
  children = MIRROR_SALES_HERO.primaryCta,
  className = "",
}: {
  children?: React.ReactNode;
  className?: string;
}) {
  return (
    <a
      className={`mirror-button ${className}`}
      href="https://myagencybrain.com/themirrorchallenge"
      onClick={() =>
        trackFunnel("initiate_checkout", {
          offer: "mirror",
          amount: 197,
          contentName: "Mirror Challenge",
        })
      }
    >
      {children}
      <ArrowRight size={18} aria-hidden="true" />
    </a>
  );
}

function ScorePreview() {
  const values = [30, 20, 17, 19, 13];
  return (
    <figure
      className="mirror-score-preview"
      aria-label="Example Mirror score of 99 out of 160"
    >
      <div className="mirror-preview-heading">
        <span>The Mirror</span>
        <span>Sample agency</span>
      </div>
      <div className="mirror-preview-score">
        99<span>/ 160</span>
      </div>
      <p className="mirror-preview-note">32 systems. One honest picture.</p>
      <div className="mirror-preview-pillars">
        {MIRROR_SALES_PILLARS.map((pillar, i) => (
          <div key={pillar.id}>
            <div className="mirror-preview-label">
              <span>{pillar.title}</span>
              <span>
                {values[i]} / {pillar.count * 5}
              </span>
            </div>
            <div className="mirror-preview-track">
              <span
                style={{ width: `${(values[i] / (pillar.count * 5)) * 100}%` }}
              />
            </div>
          </div>
        ))}
      </div>
      <figcaption>
        Illustrative score. Your Mirror is built from your own ratings and
        answers.
      </figcaption>
    </figure>
  );
}

function QuickMirror() {
  const [ratings, setRatings] = useState<Record<string, number>>({});
  const rated = MIRROR_QUICK_ITEMS.filter(
    (item) => ratings[item.itemId]
  ).length;
  const score = Object.values(ratings).reduce((sum, value) => sum + value, 0);
  return (
    <section
      id="quick-mirror"
      className="mirror-section"
      aria-labelledby="quick-title"
    >
      <div className="mirror-section-heading">
        <h2 id="quick-title">
          Five questions.
          <br />
          <span>Be honest.</span>
        </h2>
        <p>
          One system from each pillar. Rate each one where it actually is, not
          where you want it to be.
        </p>
      </div>
      <ol className="mirror-quick-list">
        {MIRROR_QUICK_ITEMS.map((item, i) => (
          <li key={item.itemId}>
            <div className="mirror-question-number" aria-hidden="true">
              0{i + 1}
            </div>
            <div className="mirror-question-copy">
              <p className="mirror-small-label">{item.pillar}</p>
              <h3>{item.title}</h3>
              <p>{item.question}</p>
            </div>
            <fieldset className="mirror-rating">
              <legend className="sr-only">Rate {item.title}</legend>
              <div className="mirror-rating-options">
                {ratingLabels.map((label, n) => (
                  <label key={label} title={label}>
                    <input
                      type="radio"
                      name={`quick-${item.itemId}`}
                      value={n + 1}
                      checked={ratings[item.itemId] === n + 1}
                      onChange={() =>
                        setRatings((prev) => ({
                          ...prev,
                          [item.itemId]: n + 1,
                        }))
                      }
                      aria-label={`${n + 1} of 5: ${label}`}
                    />
                    <span>{n + 1}</span>
                  </label>
                ))}
              </div>
              <p>
                {ratings[item.itemId]
                  ? ratingLabels[ratings[item.itemId] - 1]
                  : "1 = not in place · 5 = dialed in"}
              </p>
            </fieldset>
            {ratings[item.itemId] > 0 && (
              <p className="mirror-at-five">
                <strong>At a 5:</strong> {item.atFive}
              </p>
            )}
          </li>
        ))}
      </ol>
      <div className="mirror-quick-result">
        <div role="status" aria-live="polite">
          {rated === 5 ? (
            <>
              <p className="mirror-result-score">
                Your quick Mirror: {score} of 25
              </p>
              <p>
                That is 5 of 32. The other 27 are where owners find the
                surprises.
              </p>
            </>
          ) : (
            <p>
              Rate all five to see your score. {rated > 0 && `(${rated} of 5)`}
            </p>
          )}
        </div>
        {rated === 5 && <ChallengeLink>Get all 32 for $197</ChallengeLink>}
      </div>
      <Link className="mirror-text-link" to="/mirror/score">
        Prefer the full free assessment? Score all 32 systems{" "}
        <ArrowRight size={16} aria-hidden="true" />
      </Link>
    </section>
  );
}

const BoldMirror = () => {
  useEffect(() => {
    captureMirrorAttribution();
    const pixel = (
      window as Window & { fbq?: (action: string, event: string) => void }
    ).fbq;
    try {
      pixel?.("track", "PageView");
    } catch {
      /* Tracking must not block the page. */
    }
    trackFunnel("view_content", {
      contentName: "Mirror",
      videoId: VSL_VIDEOS.mirror.id,
    });
  }, []);

  return (
    <div className="mirror-page">
      <header className="mirror-header">
        <Link to="/" aria-label="Standard Playbook">
          <img src={standardLogo} alt="Standard Playbook" />
        </Link>
        <a href="#offer">
          The Mirror Challenge <span>$197</span>
        </a>
      </header>
      <main>
        <section className="mirror-vsl" aria-label="Mirror Challenge video">
          <VslPlayer video={VSL_VIDEOS.mirror} onEvent={trackVslEvent} />
          <p className="mirror-vsl-note">{RESULTS_DISCLAIMER}</p>
        </section>
        <section className="mirror-hero" aria-labelledby="mirror-title">
          <div>
            <p className="mirror-eyebrow">
              The Mirror Challenge for agency owners
            </p>
            <h1 id="mirror-title">
              You think you
              <br className="mirror-desktop-break" /> know your agency.
              <br />
              <span>Prove it.</span>
            </h1>
            <p className="mirror-hero-intro">{MIRROR_SALES_HERO.intro}</p>
            <div className="mirror-actions">
              <ChallengeLink />
              <a className="mirror-secondary" href="#quick-mirror">
                {MIRROR_SALES_HERO.secondaryCta}
                <ArrowDown size={17} aria-hidden="true" />
              </a>
            </div>
            <p className="mirror-hero-anchor">{MIRROR_SALES_HERO.anchor}</p>
          </div>
          <ScorePreview />
        </section>
        <div className="mirror-facts" aria-label="Challenge at a glance">
          <span>8 weeks</span>
          <span>32 systems</span>
          <span>5 pillars</span>
          <span>$197 one time</span>
        </div>
        <QuickMirror />
        <section
          className="mirror-section mirror-dark"
          aria-labelledby="pillars-title"
        >
          <div className="mirror-section-heading">
            <h2 id="pillars-title">
              Five pillars.
              <br />
              <span>Thirty-two systems.</span>
            </h2>
            <p>
              Every item comes with what a 5 looks like and three questions
              written to get past the easy answer.
            </p>
          </div>
          <ul className="mirror-pillar-list">
            {MIRROR_SALES_PILLARS.map((pillar) => (
              <li key={pillar.id}>
                <div>
                  <h3>{pillar.title}</h3>
                  <span>{pillar.count} systems</span>
                </div>
                <p>{pillar.line}</p>
                <blockquote>{pillar.question}</blockquote>
              </li>
            ))}
          </ul>
        </section>
        <section
          id="how-it-works"
          className="mirror-section"
          aria-labelledby="steps-title"
        >
          <div className="mirror-section-heading">
            <h2 id="steps-title">
              How the
              <br />
              <span>eight weeks run.</span>
            </h2>
            <p>
              Four systems a week. Space to look closer. A short reflection to
              close each week.
            </p>
          </div>
          <ol className="mirror-steps">
            {MIRROR_SALES_STEPS.map((step, i) => (
              <li key={step.title}>
                <div className="mirror-step-image">
                  <img
                    src={step.image}
                    alt={step.imageAlt}
                    width={step.width}
                    height={step.height}
                    loading="lazy"
                  />
                </div>
                <div className="mirror-step-copy">
                  <span className="mirror-small-label">Step {i + 1}</span>
                  <h3>{step.title}</h3>
                  <p>{step.body}</p>
                </div>
              </li>
            ))}
          </ol>
        </section>
        <section
          className="mirror-section mirror-dark mirror-dossier"
          aria-labelledby="dossier-title"
        >
          <figure>
            <img
              src={MIRROR_SALES_DOSSIER.image}
              alt={MIRROR_SALES_DOSSIER.imageAlt}
              width={1800}
              height={2500}
              loading="lazy"
            />
            <figcaption>{MIRROR_SALES_DOSSIER.caption}</figcaption>
          </figure>
          <div>
            <h2 id="dossier-title">
              What you
              <br />
              <span>walk away with.</span>
            </h2>
            <p>{MIRROR_SALES_DOSSIER.intro}</p>
            <ul className="mirror-check-list">
              {MIRROR_SALES_DOSSIER.points.map((point) => (
                <li key={point}>
                  <Check size={19} aria-hidden="true" />
                  <span>{point}</span>
                </li>
              ))}
            </ul>
            <ChallengeLink />
          </div>
        </section>
        <section
          className="mirror-section mirror-story"
          aria-labelledby="story-title"
        >
          <div>
            <p className="mirror-eyebrow">Built by an operator</p>
            <h2 id="story-title">
              The same Mirror
              <br />
              <span>we work through.</span>
            </h2>
          </div>
          <div>
            {MIRROR_SALES_STORY.paragraphs.map((p) => (
              <p key={p}>{p}</p>
            ))}
            <p className="mirror-signature">
              {MIRROR_SALES_STORY.signature}
              <span>{MIRROR_SALES_STORY.role}</span>
            </p>
          </div>
        </section>
        <section
          className="mirror-section mirror-testimonials"
          aria-labelledby="owners-title"
        >
          <h2 id="owners-title">
            Owners are
            <br />
            <span>already running it.</span>
          </h2>
          <div>
            {MIRROR_SALES_TESTIMONIALS.map((quote) => (
              <figure key={quote.name}>
                <blockquote>
                  {quote.paragraphs.map((p) => (
                    <p key={p}>{p}</p>
                  ))}
                </blockquote>
                <figcaption>
                  <strong>{quote.name}</strong>
                  <span>{quote.agency}</span>
                </figcaption>
              </figure>
            ))}
          </div>
        </section>
        <section
          id="offer"
          className="mirror-section mirror-dark mirror-offer"
          aria-labelledby="offer-title"
        >
          <div>
            <h2 id="offer-title">
              One payment.
              <br />
              <span>Eight weeks.</span>
            </h2>
            <p className="mirror-price">$197</p>
            <p>{MIRROR_SALES_OFFER.priceNote}</p>
            <p className="mirror-credit">{MIRROR_CREDIT_TERMS}</p>
          </div>
          <div>
            <ul className="mirror-check-list">
              {MIRROR_SALES_OFFER.includes.map((point) => (
                <li key={point}>
                  <Check size={19} aria-hidden="true" />
                  <span>{point}</span>
                </li>
              ))}
            </ul>
            <p>{MIRROR_SALES_OFFER.startNote}</p>
            <ChallengeLink />
            <p className="mirror-purchase-note">
              Continue to Agency Brain to enroll and pay securely through
              Stripe. After payment, you will receive an email to set your
              password.
            </p>
            <p className="mirror-purchase-note">
              Already have Agency Brain? The challenge is included.{" "}
              <a href="https://myagencybrain.com/themirrorchallenge">
                Open it in Agency Brain.
              </a>
            </p>
          </div>
        </section>
        <section className="mirror-section" aria-labelledby="faq-title">
          <h2 id="faq-title">
            Questions,
            <br />
            <span>answered.</span>
          </h2>
          <div className="mirror-faq">
            {MIRROR_SALES_FAQ.map((faq) => (
              <details key={faq.q}>
                <summary>
                  {faq.q}
                  <span aria-hidden="true">+</span>
                </summary>
                <p>{faq.a}</p>
              </details>
            ))}
          </div>
        </section>
        <section className="mirror-close">
          <h2>
            Find out what
            <br />
            is actually true.
          </h2>
          <ChallengeLink />
          <a
            className="mirror-text-link"
            href="https://myagencybrain.com/themirrorchallenge#sample-title"
          >
            Not ready? Get the free Systems &amp; Rhythm workbook{" "}
            <ArrowRight size={16} aria-hidden="true" />
          </a>
        </section>
      </main>
      <BoldFooter />
      <div className="mirror-sticky">
        <ChallengeLink>Start the challenge · $197</ChallengeLink>
      </div>
    </div>
  );
};

const BoldFooter = () => (
  <footer style={{ background: ink, color: paper, padding: "60px 24px 30px" }}>
    <div className="max-w-[1280px] mx-auto">
      <div
        className="grid grid-cols-2 md:grid-cols-4 gap-10 pb-12"
        style={{ borderBottom: `1px solid ${paper}1a` }}
      >
        <div className="col-span-2">
          <img
            src={standardLogo}
            alt="Standard Playbook"
            style={{
              height: 22,
              filter: "brightness(0) invert(1)",
              marginBottom: 18,
            }}
          />
          <p
            style={{
              fontFamily: body,
              fontSize: 16,
              lineHeight: 1.5,
              marginBottom: 22,
              maxWidth: 380,
              opacity: 0.85,
            }}
          >
            High-performance coaching for insurance agency owners. Raise your
            standard and live the playbook.
          </p>
          <div className="flex items-center gap-4">
            <a
              href="https://www.facebook.com/profile.php?id=61560049427918"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
              style={{ color: paper, opacity: 0.6, transition: "opacity 0.2s" }}
              className="hover:opacity-100"
            >
              <Facebook className="w-5 h-5" />
            </a>
            <a
              href="https://www.linkedin.com/in/justinhark/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
              style={{ color: paper, opacity: 0.6, transition: "opacity 0.2s" }}
              className="hover:opacity-100"
            >
              <Linkedin className="w-5 h-5" />
            </a>
          </div>
        </div>

        {[
          {
            title: "Programs",
            items: [
              { label: "Boardroom", href: "/#programs" },
              { label: "Directive", href: "/directive" },
              { label: "8-Week", href: "/sales-experience" },
              { label: "Training", href: "/training" },
            ],
          },
          {
            title: "Company",
            items: [
              { label: "About", href: "/about" },
              { label: "Contact", href: "/contact" },
              { label: "Privacy", href: "/privacy" },
              { label: "Terms", href: "/terms" },
            ],
          },
        ].map((col) => (
          <div key={col.title}>
            <p
              style={{
                fontFamily: body,
                fontSize: 12,
                fontWeight: 600,
                letterSpacing: "0.16em",
                opacity: 0.5,
                textTransform: "uppercase",
                marginBottom: 14,
              }}
            >
              {col.title}
            </p>
            <ul style={{ listStyle: "none", margin: 0, padding: 0 }}>
              {col.items.map((it) => (
                <li key={it.label} style={{ marginBottom: 8 }}>
                  <Link
                    to={it.href}
                    style={{
                      fontFamily: body,
                      fontSize: 14,
                      color: paper,
                      opacity: 0.85,
                      textDecoration: "none",
                    }}
                    className="hover:opacity-100"
                  >
                    {it.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="pt-8 text-center">
        <p
          style={{
            fontFamily: body,
            fontSize: 11,
            opacity: 0.5,
            letterSpacing: "0.08em",
          }}
        >
          © {new Date().getFullYear()} STANDARD PLAYBOOK INC. ALL RIGHTS
          RESERVED.
        </p>
      </div>
    </div>
  </footer>
);

export default BoldMirror;
