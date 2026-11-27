import { useEffect, useMemo, useState, type ReactNode } from "react";

import standardLogo from "@/assets/standard-word-logo.png";
import { getAiInstallCohortLabels } from "@/lib/aiInstallCohort";

import "./AIInstall.css";
import "./AIInstallPrework.css";

export type AIInstallPlatform = "claude" | "codex";

interface AIInstallPreworkProps {
  platform?: AIInstallPlatform;
}

interface ChecklistItem {
  id: string;
  title: string;
  copy: ReactNode;
}

interface SetupStep {
  title: string;
  copy: ReactNode;
}

const COHORT = getAiInstallCohortLabels();
const PRICE_NOTE = COHORT.price
  ? `not included in the ${COHORT.price}`
  : "not included in the workshop price";

const PAGE_DESCRIPTION =
  "Get your computer ready for the workshop. You will install the app, create one folder, connect your tools, load your raw material, and prove it works. Do this early, not the night before.";

const PLATFORM_CONFIG: Record<
  AIInstallPlatform,
  {
    label: string;
    workspace: string;
    pageTitle: string;
    description: string;
    ogImage: string;
    starterPackUrl: string;
    downloadUrl: string;
    downloadLabel: string;
    officialGuideUrl: string;
    officialGuideLabel: string;
    alternatePath: string;
    alternateLabel: string;
    requirements: ReactNode;
    setupSteps: SetupStep[];
    pluginInstall: ReactNode;
    connectedPrompt: string;
    pluginPrompt: string;
    readinessItems: ChecklistItem[];
  }
> = {
  claude: {
    label: "Claude",
    workspace: "Cowork",
    pageTitle: "Claude Pre-Work | The Agency AI Install",
    description: PAGE_DESCRIPTION,
    ogImage: "/og/ai-install-claude-prework.png",
    starterPackUrl: "/aiinstall/ai-install-claude-starter-pack.zip",
    downloadUrl: "https://claude.com/download",
    downloadLabel: "Download Claude",
    officialGuideUrl:
      "https://support.claude.com/en/articles/13345190-get-started-with-claude-cowork",
    officialGuideLabel: "Official Cowork guide",
    alternatePath: "/aiinstall/prework/codex",
    alternateLabel: "Using Codex instead?",
    requirements: (
      <>
        Before you begin: Cowork requires a Claude <strong>Pro, Max, Team, or Enterprise</strong>
        {" "}subscription, billed by Anthropic (roughly $20 and up per month, {PRICE_NOTE}). If
        you can sign in on the desktop app, you are set.
      </>
    ),
    setupSteps: [
      {
        title: "Download Claude and sign in.",
        copy:
          "Click Download Claude above. Install the desktop app, open it, and sign in with the account you will use during the workshop.",
      },
      {
        title: "Create your folder and open it.",
        copy: (
          <>
            In Documents, create a new folder named <strong>MY BIZ BRAIN</strong>. One folder, this
            name, so the room moves together. Then start a <strong>Cowork</strong> task in the
            Claude app, connect <strong>Documents &gt; MY BIZ BRAIN</strong>, and allow access.
          </>
        ),
      },
      {
        title: "Connect AgencyBrain.",
        copy: (
          <>
            In AgencyBrain, open <strong>Settings</strong>, then{" "}
            <strong>Claude &amp; ChatGPT</strong>, and follow the setup guide. This is how the
            workshop steps reach your app. Cannot connect? Use the plugin route below.
          </>
        ),
      },
      {
        title: "Connect calendar and email.",
        copy:
          "In Claude, open Customize, then Connectors, and connect the calendar and email you run the agency on. You approve each one. Nothing gets sent without your say.",
      },
    ],
    pluginInstall: (
      <>
        In Claude, open <strong>Customize</strong>, then <strong>Plugins</strong>, choose{" "}
        <strong>Add</strong>, then <strong>Upload plugin</strong>, and pick the plugin file you
        downloaded. Do not unzip it first.
      </>
    ),
    connectedPrompt:
      "Use AgencyBrain to run the AI Install readiness step. I am using Claude Cowork.",
    pluginPrompt: "/ai-install:ready",
    readinessItems: [
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
        title: "Cowork can open my MY BIZ BRAIN folder.",
        copy: "I connected the folder inside Documents and allowed access.",
      },
      {
        id: "connected",
        title: "My tools are connected.",
        copy:
          "AgencyBrain is connected, or the AI Install plugin is installed. My calendar and email are connected.",
      },
      {
        id: "context",
        title: "My raw material is in the folder, and passwords are out.",
        copy:
          "Writing samples, team roster, projects, agency basics, and tools list. No passwords or account keys. Those live in your password manager.",
      },
      {
        id: "proof",
        title: "I passed the readiness step.",
        copy: "The app reported every item OK, created READY.txt, and I can see it in my folder.",
      },
    ],
  },
  codex: {
    label: "Codex",
    workspace: "Codex",
    pageTitle: "Codex Pre-Work | The Agency AI Install",
    description: PAGE_DESCRIPTION,
    ogImage: "/og/ai-install-codex-prework.png",
    starterPackUrl: "/aiinstall/ai-install-codex-starter-pack.zip",
    downloadUrl: "https://chatgpt.com/download/",
    downloadLabel: "Download ChatGPT",
    officialGuideUrl: "https://help.openai.com/en/articles/20001275-chatgpt-work-and-codex",
    officialGuideLabel: "Official Codex guide",
    alternatePath: "/aiinstall/prework/claude",
    alternateLabel: "Using Claude instead?",
    requirements: (
      <>
        Before you begin: Codex requires a ChatGPT plan that includes it, billed by OpenAI (
        {PRICE_NOTE}). A free account will not run what we build on day two. If you are unsure your
        plan includes Codex, open the app and check well before your pre-work deadline. If you
        cannot see Codex, upgrade your plan.
      </>
    ),
    setupSteps: [
      {
        title: "Download ChatGPT and sign in.",
        copy:
          "Click Download ChatGPT above. Install the desktop app, open it, and sign in with the account you will use during the workshop.",
      },
      {
        title: "Create your folder and open it.",
        copy: (
          <>
            In Documents, create a new folder named <strong>MY BIZ BRAIN</strong>. One folder, this
            name, so the room moves together. Then open ChatGPT, use the menu in the top left to
            select <strong>Codex</strong>, choose <strong>Documents &gt; MY BIZ BRAIN</strong>, and
            allow access.
          </>
        ),
      },
      {
        title: "Connect AgencyBrain.",
        copy: (
          <>
            In AgencyBrain, open <strong>Settings</strong>, then{" "}
            <strong>Claude &amp; ChatGPT</strong>, and follow the setup guide. One setup covers
            ChatGPT and Codex. This is how the workshop steps reach your app. Cannot connect? Use
            the plugin route below.
          </>
        ),
      },
      {
        title: "Connect calendar and email.",
        copy:
          "In ChatGPT settings, open the connected apps list and connect the calendar and email you run the agency on. You approve each one. Nothing gets sent without your say.",
      },
    ],
    pluginInstall: (
      <>
        Open the plugin file&apos;s README and follow its install steps for Codex. Once installed,
        you start a step by typing its name with a dollar sign in front.
      </>
    ),
    connectedPrompt: "Use AgencyBrain to run the AI Install readiness step. I am using Codex.",
    pluginPrompt: "$ready",
    readinessItems: [
      {
        id: "plan",
        title: "My account and plan are active.",
        copy: "I can sign in, and my plan includes Codex.",
      },
      {
        id: "app",
        title: "The desktop app is installed and updated.",
        copy: "I opened the app after installation and completed any available update.",
      },
      {
        id: "folder",
        title: "Codex can open my MY BIZ BRAIN folder.",
        copy: "I selected the folder inside Documents and allowed access.",
      },
      {
        id: "connected",
        title: "My tools are connected.",
        copy:
          "AgencyBrain is connected, or the AI Install plugin is installed. My calendar and email are connected.",
      },
      {
        id: "context",
        title: "My raw material is in the folder, and passwords are out.",
        copy:
          "Writing samples, team roster, projects, agency basics, and tools list. No passwords or account keys. Those live in your password manager.",
      },
      {
        id: "proof",
        title: "I passed the readiness step.",
        copy: "The app reported every item OK, created READY.txt, and I can see it in my folder.",
      },
    ],
  },
};

const CONNECTED_BENEFITS = [
  "The workshop steps arrive inside your app. Nothing to download, nothing to update.",
  "Your starter files are added for you during the readiness step.",
  "Project numbers, the morning brief, and the weekly dashboard read your real AgencyBrain numbers.",
];

const CONTEXT_ITEMS: ChecklistItem[] = [
  {
    id: "writing",
    title: "5 to 10 examples of your writing",
    copy:
      "Team emails, texts to producers, a client email, a social post. Real ones, not your polished ones. This is how the brain learns your voice.",
  },
  {
    id: "team",
    title: "Your team roster",
    copy:
      "Each person: name, role, how long they have been with you, licenses held (P&C, L&H, or not yet), and one honest line about them.",
  },
  {
    id: "projects",
    title: "Your active projects",
    copy:
      "What you are actually working on, and the one number that matters on each.",
  },
  {
    id: "agency",
    title: "Agency basics",
    copy:
      "Your carrier or carriers, rough book size, staff count, lines of business.",
  },
  {
    id: "tools",
    title: "The tools you pay for",
    copy:
      "Every subscription and tool the agency currently pays for. One list. This becomes fuel on day one.",
  },
];

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
  const readinessItems = config.readinessItems;
  const storageKey = `ai-install-prework:${selectedPlatform}`;
  const [completed, setCompleted] = useState<string[]>([]);
  const [copied, setCopied] = useState<"connected" | "plugin" | null>(null);

  useEffect(() => {
    const pageUrl = `https://standardplaybook.com/aiinstall/prework/${selectedPlatform}`;
    const imageUrl = `https://standardplaybook.com${config.ogImage}`;

    document.title = config.pageTitle;
    setMetaTag("description", config.description);
    setMetaTag("robots", "noindex, nofollow");
    setMetaTag("theme-color", "#FFFFFF");
    setMetaTag("og:title", config.pageTitle, "property");
    setMetaTag("og:description", config.description, "property");
    setMetaTag("og:type", "website", "property");
    setMetaTag("og:url", pageUrl, "property");
    setMetaTag("og:image", imageUrl, "property");
    setMetaTag("twitter:card", "summary_large_image");
    setMetaTag("twitter:title", config.pageTitle);
    setMetaTag("twitter:description", config.description);
    setMetaTag("twitter:image", imageUrl);
    setCanonicalUrl(pageUrl);

    try {
      const saved = window.localStorage.getItem(storageKey);
      const parsed = saved ? JSON.parse(saved) : [];
      const validIds = new Set(readinessItems.map((item) => item.id));
      setCompleted(
        Array.isArray(parsed)
          ? parsed.filter((item): item is string => typeof item === "string" && validIds.has(item))
          : [],
      );
    } catch {
      setCompleted([]);
    }
  }, [
    config.description,
    config.ogImage,
    config.pageTitle,
    readinessItems,
    selectedPlatform,
    storageKey,
  ]);

  const completedCount = completed.length;
  const totalCount = readinessItems.length;
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

  const copyPrompt = async (route: "connected" | "plugin") => {
    try {
      await navigator.clipboard.writeText(
        route === "connected" ? config.connectedPrompt : config.pluginPrompt,
      );
      setCopied(route);
      window.setTimeout(() => setCopied(null), 1800);
    } catch {
      setCopied(null);
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
              <p className="aii-kicker">{COHORT.beforeDayOne} &middot; ABOUT 90 MINUTES</p>
              <h1 className="aip-title">
                <span>{config.label}</span> Pre-Work.
              </h1>
              <p className="aip-hero__subhead">
                Get your computer ready for the workshop. You will install the app, create one
                folder, connect your tools, load your raw material, and prove it works. Do this
                early, not the night before.
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
                  className="aip-button aip-button--secondary"
                  href={config.officialGuideUrl}
                  target="_blank"
                  rel="noreferrer"
                >
                  {config.officialGuideLabel}
                </a>
              </div>
            </div>

            <aside className="aip-status" aria-label="Checklist progress">
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
              <h2>Install the app and connect your tools.</h2>
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

            <div className="aip-routes">
              <article className="aip-route aip-route--connected">
                <p className="aip-route__tag">CONNECTED TO AGENCYBRAIN</p>
                <h3>What connected owners get.</h3>
                <ul>
                  {CONNECTED_BENEFITS.map((benefit) => (
                    <li key={benefit}>{benefit}</li>
                  ))}
                </ul>
                <p className="aip-route__note">
                  The connection is open to owners on AgencyBrain Plus, Pro, or 1:1 Coaching, and to
                  Boardroom members on any plan.
                </p>
              </article>

              <article className="aip-route aip-route--plugin">
                <p className="aip-route__tag">CANNOT CONNECT? THE PLUGIN ROUTE</p>
                <h3>Same steps, installed by hand.</h3>
                <ol>
                  <li>
                    Sign in to your <a href="/aiinstall/portal">AI Install portal</a> and download
                    the AI Install plugin for {config.label}.
                  </li>
                  <li>{config.pluginInstall}</li>
                  <li>
                    Download the <a href={config.starterPackUrl}>starter pack</a> and copy its files
                    into <strong>MY BIZ BRAIN</strong>, keeping the folders as they are.
                  </li>
                </ol>
                <p className="aip-route__note">
                  The plugin runs every workshop step. It does not bring in your AgencyBrain numbers,
                  so you type those in yourself.
                </p>
              </article>
            </div>
          </div>
        </section>

        <section className="aip-section aip-materials">
          <div className="aii-shell">
            <div className="aip-section__heading">
              <span>02</span>
              <h2>Add the information we will use during the workshop.</h2>
            </div>
            <p className="aip-section__intro">
              Put these inside MY BIZ BRAIN. None of it has to look pretty. Notes, Word docs,
              exported emails, whatever you have. The workshop is where raw material becomes a
              system.
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
            <p className="aip-materials__rule">
              One rule of craft: the brain runs on context, not databases. Samples, lists, and
              summaries go IN the folder. Raw exports and data dumps stay where they live (your
              desktop, your Drive); during the build you will point the brain at them when you want
              something analyzed. Folders full of dumps make a slower, dumber brain. Passwords and
              account keys never go in the folder.
            </p>
          </div>
        </section>

        <section className="aip-section aip-proof">
          <div className="aii-shell aip-proof__grid">
            <div>
              <div className="aip-section__heading">
                <span>03</span>
                <h2>Run the readiness step.</h2>
              </div>
              <p>
                Open {config.workspace} with your <strong>MY BIZ BRAIN</strong> folder connected.
                Copy the line for your route, paste it into the chat, and send it. The app checks
                your folder, tells you anything that is missing, and creates READY.txt when
                everything is in place. That file is also how we confirm your seat, so leave it
                there.
              </p>
            </div>
            <div className="aip-prompt-stack">
              <div className="aip-prompt">
                <p className="aip-prompt__label">Connected to AgencyBrain</p>
                <pre><code>{config.connectedPrompt}</code></pre>
                <button type="button" onClick={() => void copyPrompt("connected")}>
                  {copied === "connected" ? "Copied" : "Copy this line"}
                </button>
              </div>
              <div className="aip-prompt">
                <p className="aip-prompt__label">Using the plugin</p>
                <pre><code>{config.pluginPrompt}</code></pre>
                <button type="button" onClick={() => void copyPrompt("plugin")}>
                  {copied === "plugin" ? "Copied" : "Copy this line"}
                </button>
              </div>
            </div>
          </div>
        </section>

        <section className="aip-section aip-checklist">
          <div className="aii-shell">
            <div className="aip-section__heading">
              <span>04</span>
              <h2>Final check.</h2>
            </div>
            <p className="aip-section__intro">
              Check each line on the computer you will bring. These are the six readiness checks;
              the four cards at the top were setup steps. Your progress stays in this browser.
            </p>
            <div className="aip-checklist__items">
              {readinessItems.map((item) => {
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
              <h2>{isReady ? "One last step: send the screenshot." : "Finish this before day one."}</h2>
              {isReady ? (
                <div className="aip-finish__instructions">
                  <p>
                    Take one screenshot: your <strong>MY BIZ BRAIN</strong> folder open inside{" "}
                    <strong>{config.workspace}</strong>, READY.txt visible. Submit it through the{" "}
                    <a href="/aiinstall/ready">pre-work confirmation form</a>. Your seat is
                    confirmed when the screenshot is reviewed.
                  </p>
                  <p>
                    {COHORT.deadline ? (
                      <>
                        Deadline: <strong>{COHORT.deadline}.</strong> Pre-work not confirmed by then
                        means your seat moves to a later date. The room builds, it does not wait.
                      </>
                    ) : (
                      <>
                        Your deadline arrives with your workshop dates. Pre-work not confirmed by
                        then means your seat moves to a later date. The room builds, it does not
                        wait.
                      </>
                    )}
                  </p>
                </div>
              ) : null}
            </div>
            <div className="aip-finish__aside">
              <span>{COHORT.schedule}</span>
              <a href={config.alternatePath}>{config.alternateLabel}</a>
            </div>
          </div>
        </section>
      </main>

      <footer className="aii-footer aip-footer">
        <div className="aii-shell">
          <div className="aii-footer__mark">
            <span>YOU VERSUS YOU.</span>
          </div>
          <p>
            Bring the same computer you used for pre-work. Keep it plugged in, updated, and ready
            to work inside your MY BIZ BRAIN folder.
          </p>
        </div>
      </footer>
    </div>
  );
}
