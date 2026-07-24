import { useEffect, useMemo, useState } from "react";

import standardLogo from "@/assets/standard-word-logo.png";
import playbookIcon from "@/assets/sp-icon-black.png";
import playbookIconBlue from "@/assets/sp-icon-blue.png";

import "./AIInstall.css";
import "./AIInstallPrework.css";

export type AIInstallPlatform = "claude" | "codex";

interface AIInstallPreworkProps {
  platform?: AIInstallPlatform;
}

interface ChecklistItem {
  id: string;
  title: string;
  copy: string;
}

interface SetupStep {
  title: string;
  copy: string;
}

const PLATFORM_CONFIG: Record<
  AIInstallPlatform,
  {
    label: string;
    pageTitle: string;
    description: string;
    downloadUrl: string;
    downloadLabel: string;
    officialGuideUrl: string;
    officialGuideLabel: string;
    alternatePath: string;
    alternateLabel: string;
    requirements: string;
    setupSteps: SetupStep[];
  }
> = {
  claude: {
    label: "Claude",
    pageTitle: "Claude Pre-Work | The Agency AI Install",
    description:
      "Install Claude Desktop, confirm local folder access, and stage the source files required for The Agency AI Install.",
    downloadUrl: "https://claude.com/download",
    downloadLabel: "Download Claude",
    officialGuideUrl: "https://code.claude.com/docs/en/desktop-quickstart",
    officialGuideLabel: "Official Claude guide",
    alternatePath: "/aiinstall/prework/codex",
    alternateLabel: "Using Codex instead?",
    requirements:
      "Claude Code in the desktop app requires a Claude Pro, Max, Team, or Enterprise plan.",
    setupSteps: [
      {
        title: "Install Claude Desktop.",
        copy:
          "Download the current desktop app for macOS or Windows. Open it and sign in with the Anthropic account you will use during both workshop days.",
      },
      {
        title: "Open the Code tab.",
        copy:
          "Choose Code at the top of Claude Desktop. If the app asks you to upgrade or sign in again, finish that now and restart the app.",
      },
      {
        title: "Choose Local and select your folder.",
        copy:
          "Create a folder in Documents named Agency AI Brain. In the Code tab, choose Local, select that folder, and allow Claude to work inside it.",
      },
    ],
  },
  codex: {
    label: "Codex",
    pageTitle: "Codex Pre-Work | The Agency AI Install",
    description:
      "Install the ChatGPT desktop app, confirm Codex local folder access, and stage the source files required for The Agency AI Install.",
    downloadUrl: "https://chatgpt.com/download/",
    downloadLabel: "Download ChatGPT",
    officialGuideUrl: "https://help.openai.com/en/articles/20001275-chatgpt-work-and-codex",
    officialGuideLabel: "Official Codex guide",
    alternatePath: "/aiinstall/prework/claude",
    alternateLabel: "Using Claude instead?",
    requirements:
      "Codex is included across ChatGPT plans. A paid plan is recommended so workshop usage is not constrained by lower limits.",
    setupSteps: [
      {
        title: "Install the current ChatGPT desktop app.",
        copy:
          "Download the app for macOS or Windows. Open it and sign in with the ChatGPT account you will use during both workshop days.",
      },
      {
        title: "Switch to Codex.",
        copy:
          "Use the menu in the top left of the desktop app and select Codex. Do not use a normal Chat conversation for this setup.",
      },
      {
        title: "Open your local folder.",
        copy:
          "Create a folder in Documents named Agency AI Brain. Start a local Codex chat, open that folder, and approve access when the app asks.",
      },
    ],
  },
};

const CONTEXT_ITEMS: ChecklistItem[] = [
  {
    id: "writing",
    title: "Five real writing samples",
    copy:
      "Bring emails, team messages, SOPs, social posts, or other writing that actually sounds like you. Remove customer information first.",
  },
  {
    id: "team",
    title: "One team roster",
    copy:
      "List each person's name, role, responsibilities, reporting line, and the context you wish your AI coworker already understood.",
  },
  {
    id: "projects",
    title: "Your active projects",
    copy:
      "For each project, note the intended outcome, owner, deadline, current status, and the obstacle slowing it down.",
  },
  {
    id: "rules",
    title: "Your operating preferences",
    copy:
      "Write down communication rules, non-negotiables, recurring decisions, and anything you repeatedly explain to your team.",
  },
];

const READINESS_ITEMS: ChecklistItem[] = [
  {
    id: "plan",
    title: "My account and plan are active.",
    copy: "I can sign in without a password reset, billing issue, or administrator approval.",
  },
  {
    id: "app",
    title: "The desktop app is installed and updated.",
    copy: "I opened the app after installation and completed any available update.",
  },
  {
    id: "folder",
    title: "Agency AI Brain opens as a local folder.",
    copy: "The app can see the folder in Documents and is allowed to work inside it.",
  },
  {
    id: "proof",
    title: "READY.txt exists inside the folder.",
    copy: "The platform created the test file and I can open it from Finder or File Explorer.",
  },
  {
    id: "context",
    title: "My source pack is staged.",
    copy: "Writing samples, team roster, active projects, and operating preferences are ready.",
  },
  {
    id: "privacy",
    title: "Sensitive customer data is removed.",
    copy: "No passwords, API keys, payment information, SSNs, policy numbers, claim files, or customer PII are included.",
  },
];

const TEST_PROMPT =
  "Inside the open Agency AI Brain folder, create a file named READY.txt containing exactly: AI Install pre-work connection confirmed.";

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

function inferPlatform(): AIInstallPlatform {
  return window.location.pathname.toLowerCase().endsWith("/claude") ? "claude" : "codex";
}

export default function AIInstallPrework({ platform }: AIInstallPreworkProps) {
  const selectedPlatform = platform ?? inferPlatform();
  const config = PLATFORM_CONFIG[selectedPlatform];
  const storageKey = `ai-install-prework:${selectedPlatform}`;
  const [completed, setCompleted] = useState<string[]>([]);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    document.title = config.pageTitle;
    setMetaTag("description", config.description);
    setMetaTag("robots", "noindex, nofollow");
    setMetaTag("theme-color", "#F4F2EE");
    setCanonicalUrl(`https://standardplaybook.com/aiinstall/prework/${selectedPlatform}`);

    try {
      const saved = window.localStorage.getItem(storageKey);
      const parsed = saved ? JSON.parse(saved) : [];
      const validIds = new Set(READINESS_ITEMS.map((item) => item.id));
      setCompleted(
        Array.isArray(parsed)
          ? parsed.filter((item): item is string => typeof item === "string" && validIds.has(item))
          : [],
      );
    } catch {
      setCompleted([]);
    }
  }, [config.description, config.pageTitle, selectedPlatform, storageKey]);

  const completedCount = completed.length;
  const totalCount = READINESS_ITEMS.length;
  const progress = Math.round((completedCount / totalCount) * 100);
  const isReady = completedCount === totalCount;

  const completedSet = useMemo(() => new Set(completed), [completed]);

  const toggleItem = (id: string) => {
    setCompleted((current) => {
      const next = current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id];
      try {
        window.localStorage.setItem(storageKey, JSON.stringify(next));
      } catch {
        // The checklist still works for this visit when storage is unavailable.
      }
      return next;
    });
  };

  const copyPrompt = async () => {
    try {
      await navigator.clipboard.writeText(TEST_PROMPT);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div className={`aii-page aip-page aip-page--${selectedPlatform}`}>
      <a className="aii-skip-link" href="#aip-main">
        Skip to checklist
      </a>

      <header className="aii-header">
        <div className="aii-shell aii-header__inner">
          <a href="/aiinstall" aria-label="Return to The Agency AI Install">
            <img className="aii-wordmark" src={standardLogo} alt="STANDARD" />
          </a>
          <span className="aii-header__tag">AI INSTALL PRE-WORK</span>
        </div>
      </header>

      <main id="aip-main">
        <section className="aip-hero">
          <div className="aii-shell aip-hero__grid">
            <div className="aip-hero__copy">
              <p className="aii-kicker">BEFORE AUGUST 26 &middot; ABOUT 90 MINUTES</p>
              <h1 className="aip-title">
                <span>{config.label}</span> Pre-Work.
              </h1>
              <p className="aip-hero__subhead">
                Install the app, prove local folder access, and stage the files we will turn into
                your agency brain.
              </p>
              <div className="aip-hero__actions">
                <a
                  className="aip-button aip-button--primary"
                  href={config.downloadUrl}
                  target="_blank"
                  rel="noreferrer"
                >
                  {config.downloadLabel}
                </a>
                <a
                  className="aip-button aip-button--text"
                  href={config.officialGuideUrl}
                  target="_blank"
                  rel="noreferrer"
                >
                  {config.officialGuideLabel}
                </a>
              </div>
            </div>

            <aside className="aip-status" aria-label="Checklist progress">
              <img src={playbookIconBlue} alt="" aria-hidden="true" />
              <p>READINESS</p>
              <strong>{progress}%</strong>
              <span>
                {completedCount} of {totalCount} checks complete
              </span>
              <div className="aip-progress" aria-hidden="true">
                <span style={{ width: `${progress}%` }} />
              </div>
            </aside>
          </div>
        </section>

        <section className="aip-section aip-install">
          <div className="aii-shell">
            <div className="aip-section__heading">
              <span>01</span>
              <h2>Install and open the right workspace.</h2>
            </div>
            <p className="aip-requirement">{config.requirements}</p>
            <div className="aip-setup-grid">
              {config.setupSteps.map((step, index) => (
                <article className="aip-setup-card" key={step.title}>
                  <span>0{index + 1}</span>
                  <h3>{step.title}</h3>
                  <p>{step.copy}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="aip-section aip-proof">
          <div className="aii-shell aip-proof__grid">
            <div>
              <div className="aip-section__heading">
                <span>02</span>
                <h2>Prove the folder connection.</h2>
              </div>
              <p>
                Paste this into a local {config.label} session with Agency AI Brain open. Approve
                the file change, then confirm READY.txt appears in the folder.
              </p>
            </div>
            <div className="aip-prompt">
              <p>{TEST_PROMPT}</p>
              <button type="button" onClick={copyPrompt}>
                {copied ? "Copied" : "Copy test prompt"}
              </button>
            </div>
          </div>
        </section>

        <section className="aip-section aip-materials">
          <div className="aii-shell">
            <div className="aip-section__heading">
              <span>03</span>
              <h2>Stage the raw material.</h2>
            </div>
            <p className="aip-section__intro">
              Put these inside Agency AI Brain before the workshop. Plain text, PDF, or Word files
              are fine. Real beats polished.
            </p>
            <div className="aip-materials__grid">
              {CONTEXT_ITEMS.map((item, index) => (
                <article className="aip-material-card" key={item.id}>
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <h3>{item.title}</h3>
                  <p>{item.copy}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="aip-section aip-checklist">
          <div className="aii-shell">
            <div className="aip-section__heading">
              <span>04</span>
              <h2>Earn the seat.</h2>
            </div>
            <p className="aip-section__intro">
              Check each line on the computer you will bring. Your progress stays in this browser.
            </p>
            <div className="aip-checklist__items">
              {READINESS_ITEMS.map((item) => {
                const checked = completedSet.has(item.id);
                return (
                  <label className={`aip-check ${checked ? "is-checked" : ""}`} key={item.id}>
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => toggleItem(item.id)}
                    />
                    <span className="aip-check__box" aria-hidden="true">
                      {checked ? "YES" : ""}
                    </span>
                    <span className="aip-check__copy">
                      <strong>{item.title}</strong>
                      <small>{item.copy}</small>
                    </span>
                  </label>
                );
              })}
            </div>
          </div>
        </section>

        <section className={`aip-finish ${isReady ? "is-ready" : ""}`}>
          <div className="aii-shell aip-finish__grid">
            <div>
              <p>{isReady ? "PRE-WORK COMPLETE" : `${totalCount - completedCount} CHECKS LEFT`}</p>
              <h2>{isReady ? "You are ready to build." : "Finish this before day one."}</h2>
            </div>
            <div className="aip-finish__aside">
              <span>August 26-27 &middot; 1 to 5 PM Eastern</span>
              <a href={config.alternatePath}>{config.alternateLabel}</a>
            </div>
          </div>
        </section>
      </main>

      <footer className="aii-footer aip-footer">
        <div className="aii-shell">
          <div className="aii-footer__mark">
            <img src={playbookIcon} alt="" aria-hidden="true" />
            <span>YOU VERSUS YOU.</span>
          </div>
          <p>
            Bring the same computer you used for pre-work. Keep it plugged in, updated, and ready
            to work inside the local Agency AI Brain folder.
          </p>
        </div>
      </footer>
    </div>
  );
}
