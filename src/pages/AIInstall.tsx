import { useEffect, type ReactNode } from "react";

import standardLogo from "@/assets/standard-word-logo.png";
import playbookIcon from "@/assets/sp-icon-black.png";
import playbookIconBlue from "@/assets/sp-icon-blue.png";

import "./AIInstall.css";

const STRIPE_LINK = "[STRIPE LINK]";
const PAGE_TITLE = "The Agency AI Install | Standard Playbook";
const PAGE_DESCRIPTION =
  "A live two-day build, August 26-27. Agency owners and managers build their AI co-working brain start to finish with Justin Harkelroad. Claude or Codex. $997 all in.";
const PAGE_URL = "https://standardplaybook.com/aiinstall";
const OG_IMAGE = "https://standardplaybook.com/og/ai-install.png";

function setMetaTag(name: string, content: string, attribute: "name" | "property" = "name") {
  let element = document.querySelector(`meta[${attribute}="${name}"]`) as HTMLMetaElement | null;

  if (!element) {
    element = document.createElement("meta");
    element.setAttribute(attribute, name);
    document.head.appendChild(element);
  }

  element.content = content;
}

function setCanonicalUrl(url: string) {
  let element = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;

  if (!element) {
    element = document.createElement("link");
    element.rel = "canonical";
    document.head.appendChild(element);
  }

  element.href = url;
}

const chips = [
  "$997 all in",
  <>August 26-27 &middot; 1 to 5 PM Eastern</>,
  "Built in Claude or Codex",
  "Limited capacity",
  "30-day check-up included",
];

const buildSteps = [
  {
    number: "CARD 1",
    title: "EARN THE SEAT",
    copy: (
      <>
        <strong>Pre-work, gated.</strong> Before day one: subscription live, app installed, folder
        created, real writing samples and team roster gathered. About 90 minutes on your own. No
        pre-work, no seat. Build time is build time.
      </>
    ),
  },
  {
    number: "CARD 2",
    title: "DAY ONE",
    copy: (
      <>
        <strong>Build the brain.</strong> Phases 1 through 6, live: who you are, your voice, your
        rules, your content system, your team, your active projects. Every file lands in your
        folder before you log off.
      </>
    ),
  },
  {
    number: "CARD 3",
    title: "DAY TWO",
    copy: (
      <>
        <strong>Make it run.</strong> Phases 7 and 8: the memory system and master file, then your
        skill library. Then the part nobody else teaches: your first scheduled task, a live
        dashboard, and a brain that updates itself.
      </>
    ),
  },
];

const schedule = [
  {
    title: "BEFORE DAY ONE",
    copy: "The pre-work checklist arrives the day you enroll. Everything staged, tested, and confirmed so we never stop the room to fix a login.",
  },
  {
    title: "DAY ONE",
    date: "AUG 26",
    copy: "Four hours live on Zoom, 1 to 5 PM Eastern. Phases 1 to 6. You build in your own folder the whole time, with checkpoints at every phase so nobody gets left.",
  },
  {
    title: "DAY TWO",
    date: "AUG 27",
    copy: "Four hours live, 1 to 5 PM Eastern. Memory, master file, skills, then automation: your morning brief runs before you wake up the next day.",
  },
  {
    title: "THE CHECK-UP",
    copy: "One group check-up call the last week of September. What stuck, what stalled, what to build next. We fix it live and you leave with the upkeep rhythm installed.",
  },
];

const outcomes = [
  {
    title: "A working co-working brain.",
    copy: "Your folder, your files: about-me, voice, preferences, team, projects, memory, master file. Permanent, portable, yours.",
  },
  {
    title: "Your voice, extracted.",
    copy: "Pulled from your real writing, not a description of you. Drafts that sound like you wrote them, because it learned from what you wrote.",
  },
  {
    title: "A morning brief that runs itself.",
    copy: "Your first scheduled task goes live in the room. Priorities pulled from your projects and calendar, waiting when you wake up.",
  },
  {
    title: "One live dashboard.",
    copy: "A page you reopen any time that pulls fresh status on your week instead of a stale answer.",
  },
  {
    title: "Your team, loaded.",
    copy: 'Every person, role, and context in the system, so "draft a message for Sarah" comes out right the first time.',
  },
  {
    title: "The skill library.",
    copy: "Pre-built skills installed, plus your first custom skill file written for something only your agency does.",
  },
  {
    title: "The 30-day check-up.",
    copy: "One live group call the last week of September. Momentum audit, stall repair, next build picked.",
  },
  {
    title: "The handout and the recordings.",
    copy: "The full written build guide, plus both session recordings sent within 7 days of the workshop, so your manager can rebuild any piece of it.",
  },
];

const faqs = [
  {
    question: "Do I need to be technical?",
    answer:
      "No. If you can make a folder and copy a file, you can do this build. The pre-work checklist walks you through every setup step before day one, and there is live tech help in the room both days.",
  },
  {
    question: "Claude or Codex, which one?",
    answer:
      "Your pick. You declare it when you enroll. The build is identical: same folder, same files, same phases. Justin demos in Claude and names the Codex difference at every checkpoint.",
  },
  {
    question: "What do I need before day one?",
    answer:
      "Your own AI subscription (Claude Pro, Max, or Team, or a ChatGPT plan that includes Codex; billed by the provider, roughly $20 and up per month, not included in the $997), a computer, and the completed pre-work. That is it.",
  },
  {
    question: "What if I cannot attend live?",
    answer:
      "Come live. This is a build, not a broadcast, and the checkpoints only work if you are in the room. Both recordings are sent within 7 days, but they are for review and rebuilding, not a substitute for the seats.",
  },
  {
    question: "Is my business information safe?",
    answer:
      "The brain is a folder of files on YOUR computer. Nothing is uploaded to Justin, and nobody in the room sees your files. What you build is yours, before, during, and after.",
  },
  {
    question: "What does the $997 cover?",
    answer:
      "Both live build days, the full written build guide, the 30-day check-up call, and both session recordings sent within 7 days. One price, nothing else to buy from us.",
  },
];

function EnrollButton({ inverted = false }: { inverted?: boolean }) {
  return (
    <a className={`aii-cta${inverted ? " aii-cta--inverted" : ""}`} href={STRIPE_LINK}>
      Enroll for $997
    </a>
  );
}

function SectionTitle({ children }: { children: ReactNode }) {
  return <h2 className="aii-section-title">{children}</h2>;
}

export default function AIInstall() {
  useEffect(() => {
    document.title = PAGE_TITLE;
    setMetaTag("description", PAGE_DESCRIPTION);
    setMetaTag("robots", "index, follow");
    setMetaTag(
      "keywords",
      "insurance agency AI, AI workshop, Claude for insurance agencies, Codex for insurance agencies, agency systems",
    );
    setMetaTag("theme-color", "#F4F2EE");
    setMetaTag("og:title", PAGE_TITLE, "property");
    setMetaTag("og:description", PAGE_DESCRIPTION, "property");
    setMetaTag("og:type", "website", "property");
    setMetaTag("og:url", PAGE_URL, "property");
    setMetaTag("og:image", OG_IMAGE, "property");
    setMetaTag("twitter:title", PAGE_TITLE);
    setMetaTag("twitter:description", PAGE_DESCRIPTION);
    setMetaTag("twitter:image", OG_IMAGE);
    setCanonicalUrl(PAGE_URL);
  }, []);

  return (
    <div className="aii-page">
      <a className="aii-skip-link" href="#aii-main">
        Skip to content
      </a>
      <header className="aii-header">
        <div className="aii-shell aii-header__inner">
          <a href="/" aria-label="Standard Playbook home">
            <img className="aii-wordmark" src={standardLogo} alt="STANDARD" />
          </a>
          <span className="aii-header__tag">STANDARD PLAYBOOK</span>
        </div>
      </header>

      <main id="aii-main">
        <section className="aii-hero">
          <img
            className="aii-hero__watermark"
            src={playbookIconBlue}
            alt=""
            aria-hidden="true"
          />
          <div className="aii-shell aii-hero__inner">
            <p className="aii-kicker">LIVE TWO-DAY BUILD &middot; AUGUST 26-27</p>
            <h1 className="aii-hero__title">
              <span className="aii-hero__line">The Agency</span>
              {" "}
              <span className="aii-hero__line aii-hero__line--offset">
                AI <span>Install</span>.
              </span>
            </h1>
            <p className="aii-hero__subhead">
              Two days on Zoom, side by side with Justin, building your agency's AI co-working brain
              from a blank folder to a running system. Built in Claude or in OpenAI's Codex, your
              pick, same build. Not a course about AI. A build. You leave with it working.
            </p>
            <div className="aii-chips" aria-label="Workshop details">
              {chips.map((chip, index) => (
                <span className="aii-chip" key={index}>
                  {chip}
                </span>
              ))}
            </div>
            <EnrollButton />
          </div>
        </section>

        <div className="aii-marquee-wrap" aria-hidden="true">
          <div className="aii-marquee">
            {[0, 1].map((group) => (
              <div className="aii-marquee__group" key={group}>
                {Array.from({ length: 6 }).map((_, index) => (
                  <span className="aii-marquee__item" key={index}>
                    <span>THE AGENCY AI INSTALL</span>
                    <i />
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>

        <section className="aii-section">
          <div className="aii-shell aii-problem-grid">
            <article>
              <h2 className="aii-split-title">
                THE <span>PROBLEM</span>.
              </h2>
              <p>
                You bought the tools. ChatGPT is open in a tab right now. You have watched the
                demos, saved the prompts, told your team "we need to use AI more." And your agency
                still runs out of your head.
              </p>
              <p>
                Every AI tip you have tried died the same way: no system underneath it. The tool
                answered a question and forgot you existed.
              </p>
              <p className="aii-strong-line">
                You do not have an AI problem. You have an install problem.
              </p>
            </article>
            <article>
              <h2 className="aii-split-title">
                THE <span>PROMISE</span>.
              </h2>
              <p>
                Two working days, building live. Day one your brain learns who you are, how you
                talk, who your people are, and what you are working on. Day two it starts working
                while you sleep: a morning brief, a live dashboard, memory that keeps itself
                current.
              </p>
              <p>
                This is the exact 8-phase build Justin runs his own businesses on. Done with you,
                not taught at you. Fall behind a step and we catch you in the room, not in a replay.
              </p>
            </article>
          </div>
        </section>

        <section className="aii-statement" aria-label="The folder is the brain">
          <div className="aii-shell">
            <p>
              The brain is not the chatbot. The brain is the files.{" "}
              <span>The folder IS the brain.</span> Build it once and it carries your week.
            </p>
          </div>
        </section>

        <section className="aii-section">
          <div className="aii-shell">
            <SectionTitle>
              HOW IT <span>WORKS</span>.
            </SectionTitle>
            <div className="aii-how-grid">
              {buildSteps.map((step) => (
                <article className="aii-how-card" key={step.number}>
                  <p className="aii-card-label">
                    <span>{step.number}</span> &middot; {step.title}:
                  </p>
                  <p>{step.copy}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="aii-section">
          <div className="aii-shell">
            <SectionTitle>
              THE <span>BUILD</span> SCHEDULE.
            </SectionTitle>
            <div className="aii-schedule">
              {schedule.map((item) => (
                <article className="aii-schedule__item" key={item.title}>
                  <h3>
                    {item.title}
                    {item.date && (
                      <>
                        {" "}
                        &middot; {item.date}
                      </>
                    )}
                  </h3>
                  <p>{item.copy}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="aii-section aii-phases">
          <div className="aii-shell">
            <div className="aii-phase-stat">
              <span className="aii-phase-stat__number">8</span>
              <span className="aii-phase-stat__label">phases, one working system</span>
            </div>
            <p className="aii-phases__copy">
              About you. Your voice. Your rules. Your content. Your team. Your projects. Your
              memory. Your skills. The same eight phases behind the brain that runs Justin's
              coaching practice, his software company, and his conference. Compressed into two
              working days, built in your folder, for your agency.
            </p>
            <EnrollButton />
          </div>
        </section>

        <section className="aii-section">
          <div className="aii-shell">
            <SectionTitle>
              WHAT YOU WALK <span>AWAY</span> WITH.
            </SectionTitle>
            <div className="aii-outcomes">
              {outcomes.map((outcome) => (
                <article className="aii-outcome" key={outcome.title}>
                  <h3>{outcome.title}</h3>
                  <p>{outcome.copy}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="aii-section">
          <div className="aii-shell aii-fit-grid">
            <article>
              <h2 className="aii-split-title">
                THIS IS FOR <span>YOU</span> IF.
              </h2>
              <p>
                You own or manage an insurance agency and the whole operation still lives in your
                head. You are willing to do 90 minutes of pre-work and show up live for two
                afternoons. You want a system you own on your own computer, not another subscription
                dashboard you will stop opening in a month.
              </p>
            </article>
            <article>
              <h2 className="aii-split-title">
                THIS IS <span>NOT</span> FOR YOU IF.
              </h2>
              <p>
                You want to watch and decide later. This room builds; it does not watch. If the
                pre-work is not done, you do not build, and your seat moves to a later date. And if
                you are looking for someone to promise your revenue goes up because you bought AI,
                that promise does not exist here.
              </p>
            </article>
          </div>
        </section>

        <section className="aii-section">
          <div className="aii-shell aii-about">
            <SectionTitle>
              WHO IS <span>BUILDING</span> WITH YOU.
            </SectionTitle>
            <p>
              Justin Harkelroad has spent 20 years inside of the insurance business. He coaches
              agency owners nationwide, builds his own software, and runs an annual conference. All
              three run on the co-working brain he built for himself, the same 8-phase build you are
              installing in this room. He is not teaching a theory. He is handing you the thing he
              uses every morning.
            </p>
          </div>
        </section>

        <section className="aii-statement aii-statement--cta">
          <div className="aii-shell">
            <p>
              Two afternoons. One system, <span>built</span>. Running the morning after.
            </p>
            <EnrollButton inverted />
          </div>
        </section>

        <section className="aii-section">
          <div className="aii-shell">
            <SectionTitle>
              QUESTIONS, ANSWERED <span>STRAIGHT</span>.
            </SectionTitle>
            <div className="aii-faqs">
              {faqs.map((faq) => (
                <article className="aii-faq" key={faq.question}>
                  <h3>{faq.question}</h3>
                  <p>{faq.answer}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="aii-final">
          <div className="aii-shell">
            <h2>
              Nobody is coming to install this for <span>you</span>.
            </h2>
            <p>
              You have known AI matters for two years. The install has been the missing piece the
              whole time. Two afternoons, and it is done.
            </p>
            <EnrollButton />
            <small>
              August 26-27 &middot; 1 to 5 PM Eastern &middot; Limited capacity
            </small>
          </div>
        </section>
      </main>

      <footer className="aii-footer">
        <div className="aii-shell">
          <div className="aii-footer__mark">
            <img src={playbookIcon} alt="" aria-hidden="true" loading="lazy" />
            <span>YOU VERSUS YOU.</span>
          </div>
          <p>
            $997 covers both live build days, the written build guide, the 30-day check-up call, and
            both session recordings (sent within 7 days of the workshop). Every phase is
            checkpointed live in the room, so if you do the pre-work and show up for both days, you
            leave with the build done. Requires your own AI subscription (Claude Pro, Max, or Team,
            or a ChatGPT plan that includes Codex; billed by the provider, not included) and the
            pre-work completed; unfinished pre-work moves your seat to a later date. Seats are
            limited. No income or sales results are promised or implied.
          </p>
        </div>
      </footer>
    </div>
  );
}
