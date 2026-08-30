import { useEffect, useState, type FormEvent, type ReactNode } from "react";

import standardLogo from "@/assets/standard-word-logo.png";
import playbookIcon from "@/assets/sp-icon-black.png";
import playbookIconBlue from "@/assets/sp-icon-blue.png";
import { supabase } from "@/integrations/supabase/client";

import "./AIInstall.css";

const PAGE_TITLE = "Agency AI Install Waitlist | Standard Playbook";
const PAGE_DESCRIPTION =
  "Join the waitlist for the next Agency AI Install: a live two-day build for insurance agency owners using Claude or Codex, with an ongoing replay and resource portal.";
const PAGE_URL = "https://standardplaybook.com/aiinstall";
const OG_IMAGE = "https://standardplaybook.com/og/ai-install-portal.png";

const chips = [
  "First live build complete",
  "Next date announced to the waitlist first",
  "Built in Claude or Codex",
  "Two live working days",
  "Replay and resource portal included",
];

const firstBuildWins = [
  {
    title: "A real business brain folder.",
    copy: "About, voice, preferences, team, active projects, memory, and skills—organized as files the owner controls.",
  },
  {
    title: "Voice that came from real writing.",
    copy: "The system learned from emails, posts, and messages instead of a vague prompt asking AI to sound more human.",
  },
  {
    title: "The agency loaded into context.",
    copy: "People, roles, current work, priorities, and operating rules stopped living only in the owner's head.",
  },
  {
    title: "Memory that can be maintained.",
    copy: "The build included a master file and a repeatable rhythm for keeping the brain current as the business changes.",
  },
  {
    title: "A morning brief and live dashboard.",
    copy: "The room moved beyond chat and put AI to work on recurring priorities, project status, and the next right actions.",
  },
  {
    title: "Reusable agency skills.",
    copy: "Participants installed a working skill library and learned how to build a skill for work specific to their agency.",
  },
];

const buildSteps = [
  {
    number: "CARD 1",
    title: "PREP THE BRAIN",
    copy: (
      <>
        <strong>Pre-work before the room.</strong> Install Claude or Codex, create the folder, bring
        real writing samples, and stage the business context the build needs.
      </>
    ),
  },
  {
    number: "CARD 2",
    title: "BUILD THE FOUNDATION",
    copy: (
      <>
        <strong>Day one is context.</strong> Who you are, how you sound, how you work, who is on the
        team, and which projects matter now. Every phase lands in your own folder.
      </>
    ),
  },
  {
    number: "CARD 3",
    title: "MAKE IT WORK",
    copy: (
      <>
        <strong>Day two is leverage.</strong> Memory, the master file, reusable skills, scheduled
        work, and a live dashboard you can reopen when the week gets noisy.
      </>
    ),
  },
];

const nextSteps = [
  {
    title: "JOIN THE WAITLIST",
    copy: "Add your name and email. There is no payment and no date commitment yet.",
  },
  {
    title: "GET THE DATE FIRST",
    copy: "The waitlist receives the next schedule, format, price, and seat release before public registration.",
  },
  {
    title: "CLAIM YOUR SEAT",
    copy: "When registration opens, choose Claude or Codex and decide whether the live build fits your calendar.",
  },
  {
    title: "BUILD, THEN KEEP IT",
    copy: "Complete the pre-work, build live for two days, and keep the guides, recordings, and files in your attendee portal.",
  },
];

const outcomes = [
  {
    title: "The files on your computer.",
    copy: "The brain lives in a folder you control. It is portable, inspectable, and not trapped inside another dashboard.",
  },
  {
    title: "The complete build path.",
    copy: "A written sequence takes you from raw business material to a working context, memory, and skill system.",
  },
  {
    title: "Work that starts before you ask.",
    copy: "The goal is not a better answer in a chat window. It is recurring work that arrives with the right context already attached.",
  },
  {
    title: "A system your team can understand.",
    copy: "Roles, projects, language, and operating rules become visible files instead of invisible owner knowledge.",
  },
  {
    title: "Replays beside the right files.",
    copy: "Day one and day two recordings live in the portal with the exact guides and downloads used during each build.",
  },
  {
    title: "A place to come back to.",
    copy: "Sign in later to review a lesson, download a platform-specific file again, or rebuild a part that changed.",
  },
];

const portalFeatures = [
  "Day 1 and Day 2 workshop replays",
  "Claude- or Codex-specific pre-work",
  "The exact Day 1 and Day 2 build guides",
  "Platform-specific skills libraries",
  "Saved viewing progress and repeat access",
];

const faqs = [
  {
    question: "When is the next Agency AI Install?",
    answer:
      "The next date is being planned now. Join the waitlist and you will receive the date, schedule, price, and registration link before the event is released publicly.",
  },
  {
    question: "Does joining the waitlist reserve a seat?",
    answer:
      "No. The waitlist gives you first notice and the first registration opportunity. You will be able to review the full details before deciding.",
  },
  {
    question: "Do I need to be technical?",
    answer:
      "No. If you can create a folder and move a file, you can do the build. The pre-work handles setup before day one, and the live room uses checkpoints so problems get caught early.",
  },
  {
    question: "Can I use Claude or Codex?",
    answer:
      "Yes. The foundation is the same: your folder, your context, your memory, and your skills. The setup files and some workflow details are tailored to the platform you choose.",
  },
  {
    question: "Is this a course or a live build?",
    answer:
      "It is a live working event. You build in your own folder while Justin builds with you. The recordings are there for review afterward, not as a substitute for doing the work in the room.",
  },
  {
    question: "What happens after the live event?",
    answer:
      "Your files stay on your computer, and you receive secure portal access for the replays, pre-work, build guides, and platform-specific downloads so you can come back whenever you need them.",
  },
  {
    question: "Is my business information safe?",
    answer:
      "Your business brain is built as files on your computer. Other attendees do not see your folder, and the portal holds workshop resources rather than your private agency files.",
  },
  {
    question: "What will the next event cost?",
    answer:
      "Pricing has not been announced for the next build. The waitlist will receive the full offer details before registration opens. Joining the waitlist is free.",
  },
];

function setMetaTag(name: string, content: string, attribute: "name" | "property" = "name") {
  let element = document.querySelector(
    "meta[" + attribute + '="' + name + '"]',
  ) as HTMLMetaElement | null;

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

function WaitlistLink({
  inverted = false,
  children = "Get the next date first",
}: {
  inverted?: boolean;
  children?: ReactNode;
}) {
  return (
    <a className={"aii-cta" + (inverted ? " aii-cta--inverted" : "")} href="#waitlist">
      {children}
    </a>
  );
}

function WaitlistForm() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [website, setWebsite] = useState("");
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setMessage("");

    if (website) {
      setStatus("success");
      return;
    }

    const normalizedName = fullName.trim();
    const normalizedEmail = email.trim().toLowerCase();
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!normalizedName || !emailPattern.test(normalizedEmail)) {
      setStatus("error");
      setMessage("Enter your name and a valid email address.");
      return;
    }

    setStatus("submitting");

    try {
      const sessionId =
        "ai-install-waitlist-" +
        Date.now().toString(36) +
        "-" +
        Math.random().toString(36).slice(2, 10);
      const { error } = await supabase.from("booking_leads").insert({
        session_id: sessionId,
        source: "ai-install-waitlist",
        full_name: normalizedName,
        email: normalizedEmail,
        completed: true,
        desired_outcome: "Join the next Agency AI Install live build.",
      });

      if (error) throw error;

      const trackedWindow = window as typeof window & {
        fbq?: (...args: unknown[]) => void;
      };
      trackedWindow.fbq?.("track", "Lead", {
        content_name: "Agency AI Install Waitlist",
        source: "ai-install-waitlist",
      });

      setFullName("");
      setEmail("");
      setStatus("success");
    } catch (error) {
      console.error("AI Install waitlist submission failed", error);
      setStatus("error");
      setMessage("We could not save your spot on the list. Try again in a moment.");
    }
  };

  if (status === "success") {
    return (
      <div className="aii-waitlist__success" role="status" aria-live="polite">
        <span>YOU'RE ON THE LIST.</span>
        <p>When the next dates are set, you will hear about them before public registration opens.</p>
      </div>
    );
  }

  return (
    <form className="aii-waitlist__form" onSubmit={handleSubmit} noValidate>
      <div className="aii-waitlist__field">
        <label htmlFor="ai-install-waitlist-name">Full name</label>
        <input
          id="ai-install-waitlist-name"
          name="full_name"
          type="text"
          autoComplete="name"
          required
          value={fullName}
          onChange={(event) => setFullName(event.target.value)}
          placeholder="Your name"
        />
      </div>
      <div className="aii-waitlist__field">
        <label htmlFor="ai-install-waitlist-email">Email</label>
        <input
          id="ai-install-waitlist-email"
          name="email"
          type="email"
          inputMode="email"
          autoComplete="email"
          required
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="you@youragency.com"
        />
      </div>
      <div className="aii-honeypot" aria-hidden="true">
        <label htmlFor="ai-install-waitlist-website">Website</label>
        <input
          id="ai-install-waitlist-website"
          name="website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          value={website}
          onChange={(event) => setWebsite(event.target.value)}
        />
      </div>
      <button className="aii-cta aii-cta--inverted" type="submit" disabled={status === "submitting"}>
        {status === "submitting" ? "Adding you to the list" : "Join the next build waitlist"}
      </button>
      {status === "error" && (
        <p className="aii-waitlist__error" role="alert">
          {message}
        </p>
      )}
      <p className="aii-waitlist__privacy">
        No payment. No date commitment. We will only use this to contact you about the next Agency
        AI Install.
      </p>
    </form>
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
      "insurance agency AI, AI workshop waitlist, Claude for insurance agencies, Codex for insurance agencies, agency systems",
    );
    setMetaTag("theme-color", "#F4F2EE");
    setMetaTag("og:title", PAGE_TITLE, "property");
    setMetaTag("og:description", PAGE_DESCRIPTION, "property");
    setMetaTag("og:type", "website", "property");
    setMetaTag("og:url", PAGE_URL, "property");
    setMetaTag("og:image", OG_IMAGE, "property");
    setMetaTag("twitter:card", "summary_large_image");
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
          <a className="aii-header__cta" href="#waitlist">
            Join the waitlist
          </a>
        </div>
      </header>

      <main id="aii-main">
        <section className="aii-hero">
          <div className="aii-shell aii-hero__inner">
            <p className="aii-kicker">FIRST BUILD COMPLETE &middot; NEXT LIVE DATE COMING</p>
            <div className="aii-hero__copy">
              <h1 className="aii-hero__title">
                <span className="aii-hero__line">The Agency</span>
                <span className="aii-hero__line">
                  AI <span>Install</span>.
                </span>
              </h1>
              <p className="aii-hero__subhead">
                The first room built working agency brains instead of collecting another stack of
                prompts. The next two-day live build is being planned now.
              </p>
              <WaitlistLink />
              <p className="aii-hero__note">No date or payment yet. The waitlist hears first.</p>
            </div>
            <div className="aii-hero__visual">
              <img
                className="aii-hero__media-mark"
                src={playbookIconBlue}
                alt=""
                aria-hidden="true"
              />
              <div className="aii-hero__video-frame">
                <div className="aii-hero__poster-wrap">
                  <img
                    className="aii-hero__poster"
                    src="/og/ai-install-portal.png"
                    alt="The Agency AI Install—replays, pre-work, and downloads"
                  />
                </div>
              </div>
            </div>
            <div className="aii-chips" aria-label="Next workshop details">
              {chips.map((chip) => (
                <span className="aii-chip" key={chip}>
                  {chip}
                </span>
              ))}
            </div>
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

        <section className="aii-section aii-first-build">
          <div className="aii-shell">
            <div className="aii-proof-intro">
              <SectionTitle>
                THE FIRST ROOM <span>BUILT THIS</span>.
              </SectionTitle>
              <p>
                In the first Agency AI Install, we moved from blank folders to working systems. The
                room built the eight-part foundation Justin uses, then connected it to recurring
                work people could use the next morning.
              </p>
            </div>
            <div className="aii-outcomes">
              {firstBuildWins.map((outcome) => (
                <article className="aii-outcome" key={outcome.title}>
                  <h3>{outcome.title}</h3>
                  <p>{outcome.copy}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="aii-section">
          <div className="aii-shell aii-problem-grid">
            <article>
              <h2 className="aii-split-title">
                THE <span>PROBLEM</span>.
              </h2>
              <p>
                ChatGPT is open in a tab. You have saved prompts and watched demos. But the agency
                still runs out of your head because the tool has no durable context underneath it.
              </p>
              <p>
                Every useful answer starts over. It does not know your people, your voice, your
                projects, or the rules you actually operate by.
              </p>
              <p className="aii-strong-line">
                You do not have an AI problem. You have an install problem.
              </p>
            </article>
            <article>
              <h2 className="aii-split-title">
                THE <span>NEXT ROOM</span>.
              </h2>
              <p>
                The next event will use the same live build format: pre-work before the room, two
                focused working days, and checkpoints that keep everyone moving through the same
                eight phases.
              </p>
              <p>
                You leave with files on your computer, not a promise to watch modules later. Then
                the replays, guides, and platform-specific downloads stay available in your secure
                attendee portal.
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
              HOW THE LIVE <span>BUILD WORKS</span>.
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
              WHAT HAPPENS <span>NEXT</span>.
            </SectionTitle>
            <div className="aii-schedule">
              {nextSteps.map((item) => (
                <article className="aii-schedule__item" key={item.title}>
                  <h3>{item.title}</h3>
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
              memory. Your skills. The same foundation behind the brain that runs Justin's coaching
              practice, software company, and conference—built in your folder for your agency.
            </p>
            <WaitlistLink />
          </div>
        </section>

        <section className="aii-section">
          <div className="aii-shell">
            <SectionTitle>
              WHAT YOU <span>KEEP</span>.
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

        <section className="aii-portal-proof">
          <div className="aii-shell aii-portal-grid">
            <div>
              <p className="aii-kicker">AFTER THE LIVE ROOM</p>
              <h2>
                YOUR BUILD DOESN'T DISAPPEAR AFTER <span>DAY TWO</span>.
              </h2>
              <p className="aii-portal-copy">
                Attendees keep the business brain files on their own computer and receive a secure
                portal for the workshop material. Sign back in to review a lesson, download a guide
                again, or pick the build back up months later.
              </p>
              <a className="aii-portal-link" href="/aiinstall/portal">
                Already attended? Open the portal
              </a>
            </div>
            <ol className="aii-portal-list">
              {portalFeatures.map((feature, index) => (
                <li key={feature}>
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <strong>{feature}</strong>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section className="aii-section">
          <div className="aii-shell aii-fit-grid">
            <article>
              <h2 className="aii-split-title">
                THIS IS FOR <span>YOU</span> IF.
              </h2>
              <p>
                You own or manage an insurance agency, too much of the operation still lives in
                your head, and you are willing to do the pre-work and build live instead of watching
                from the sidelines.
              </p>
            </article>
            <article>
              <h2 className="aii-split-title">
                THIS IS <span>NOT</span> FOR YOU IF.
              </h2>
              <p>
                You want a bag of prompts, a passive course, or a promise that buying AI guarantees
                revenue. The install only works when you bring the real business context and do the
                build.
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
              Justin Harkelroad has spent 20 years inside the insurance business. He coaches agency
              owners, builds his own software, and runs his businesses on the co-working brain he
              installs in this room. He is not teaching a theory. He is building the same system
              beside you.
            </p>
          </div>
        </section>

        <section className="aii-waitlist" id="waitlist" aria-labelledby="aii-waitlist-title">
          <div className="aii-shell aii-waitlist__grid">
            <div className="aii-waitlist__copy">
              <p className="aii-kicker">NEXT LIVE BUILD</p>
              <h2 id="aii-waitlist-title">
                GET THE DATE BEFORE THE ROOM <span>OPENS</span>.
              </h2>
              <p>
                The next Agency AI Install is being planned now. Join the list and we will send you
                the date, format, price, and registration link before it is announced publicly.
              </p>
            </div>
            <WaitlistForm />
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
              THE NEXT ROOM IS COMING. <span>HEAR FIRST</span>.
            </h2>
            <p>
              No stale event date. No checkout for an event that already happened. Just the first
              chance to see the next build and decide if you want in.
            </p>
            <WaitlistLink>Join the waitlist</WaitlistLink>
            <small>Free to join &middot; No payment &middot; No seat reserved until registration opens</small>
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
            Joining the waitlist does not purchase or reserve a seat. Dates, capacity, schedule,
            pricing, platform requirements, and registration policies will be provided before the
            next event opens. Participation requires your own eligible Claude or ChatGPT
            subscription. No income or sales results are promised or implied.
          </p>
        </div>
      </footer>
    </div>
  );
}
