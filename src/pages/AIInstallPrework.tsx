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
      "Get Claude Desktop and your Agency AI Brain folder ready for The Agency AI Install.",
    downloadUrl: "https://claude.com/download",
    downloadLabel: "Download Claude",
    officialGuideUrl: "https://code.claude.com/docs/en/desktop-quickstart",
    officialGuideLabel: "Official Claude guide",
    alternatePath: "/aiinstall/prework/codex",
    alternateLabel: "Using Codex instead?",
    requirements:
      "Before you begin: the Code feature in Claude Desktop requires a Claude Pro, Max, Team, or Enterprise plan.",
    setupSteps: [
      {
        title: "Download Claude and sign in.",
        copy:
          "Click Download Claude above. Install the app, open it, and sign in with the account you will use during both workshop days.",
      },
      {
        title: "Create your workshop folder.",
        copy:
          "Open Finder on a Mac or File Explorer on Windows. Open Documents and create a new folder named Agency AI Brain.",
      },
      {
        title: "Connect Claude to the folder.",
        copy:
          "Open Claude Desktop and click Code at the top. Choose Local, select Documents > Agency AI Brain, and allow access if Claude asks.",
      },
    ],
  },
  codex: {
    label: "Codex",
    pageTitle: "Codex Pre-Work | The Agency AI Install",
    description:
      "Get Codex and your Agency AI Brain folder ready for The Agency AI Install.",
    downloadUrl: "https://chatgpt.com/download/",
    downloadLabel: "Download ChatGPT",
    officialGuideUrl: "https://help.openai.com/en/articles/20001275-chatgpt-work-and-codex",
    officialGuideLabel: "Official Codex guide",
    alternatePath: "/aiinstall/prework/claude",
    alternateLabel: "Using Claude instead?",
    requirements:
      "Before you begin: Codex is available with ChatGPT. We recommend a paid plan because free accounts may reach their usage limit during the workshop.",
    setupSteps: [
      {
        title: "Download ChatGPT and sign in.",
        copy:
          "Click Download ChatGPT above. Install the app, open it, and sign in with the account you will use during both workshop days.",
      },
      {
        title: "Create your workshop folder.",
        copy:
          "Open Finder on a Mac or File Explorer on Windows. Open Documents and create a new folder named Agency AI Brain.",
      },
      {
        title: "Connect Codex to the folder.",
        copy:
          "Open ChatGPT, use the menu in the top left to select Codex, and choose the Agency AI Brain folder. Allow access if Codex asks.",
      },
    ],
  },
};

const CONTEXT_ITEMS: ChecklistItem[] = [
  {
    id: "writing",
    title: "Five examples of your writing",
    copy:
      "Add emails, team messages, step-by-step instructions, or social posts that sound like you. Remove names and private customer information first.",
  },
  {
    id: "team",
    title: "A list of your team members",
    copy:
      "Include each person's name, job, main responsibilities, and who they report to. Add anything important you want the AI to understand about your team.",
  },
  {
    id: "projects",
    title: "A list of what you are working on",
    copy:
      "For each project, include the goal, who is responsible, the deadline, what has been completed, and what is getting in the way.",
  },
  {
    id: "rules",
    title: "How you like work to be done",
    copy:
      "Write down how you prefer to communicate, rules your team must follow, and anything you find yourself explaining repeatedly.",
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
    title: "The app can open my Agency AI Brain folder.",
    copy: "I selected the folder inside Documents and allowed the app to use it.",
  },
  {
    id: "proof",
    title: "I can see the READY.txt test file.",
    copy: "The app created the file and I can see it inside my Agency AI Brain folder.",
  },
  {
    id: "context",
    title: "I added information about me and my agency.",
    copy: "My writing examples, team list, current projects, and work preferences are inside the folder.",
  },
  {
    id: "privacy",
    title: "I removed private and sensitive information.",
    copy: "The folder has no passwords, secret access keys, payment details, Social Security numbers, policy numbers, claim files, or private customer information.",
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
                Get your computer ready for the workshop. We will help you install the app, create
                one folder, and add the examples we will use to build your AI system.
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
              <h2>Install the app and create your workshop folder.</h2>
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
                <h2>Make sure the app can use your folder.</h2>
              </div>
              <p>
                Open {config.label} with your Agency AI Brain folder selected. Copy the instruction
                below, paste it into the message box, and send it. If the app asks for permission
                to create the file, click Allow.
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
              <h2>Add the information we will use during the workshop.</h2>
            </div>
            <p className="aip-section__intro">
              Put these items inside your Agency AI Brain folder. They do not need to look perfect.
              Notes, Word documents, PDFs, and copied-and-pasted text are all fine.
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
              <h2>Final check: make sure you are ready.</h2>
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
            to work inside your Agency AI Brain folder.
          </p>
        </div>
      </footer>
    </div>
  );
}
