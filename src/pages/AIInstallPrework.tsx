import { useEffect, useMemo, useState, type ReactNode } from "react";

import standardLogo from "@/assets/standard-word-logo.png";

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

const PLATFORM_CONFIG: Record<
  AIInstallPlatform,
  {
    label: string;
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
    readinessItems: ChecklistItem[];
  }
> = {
  claude: {
    label: "Claude",
    pageTitle: "Claude Pre-Work | The Agency AI Install",
    description:
      "Get your computer ready for the workshop. You will install the app, create one folder, load it with your raw material, and prove it works. Do this early in the week, not the night before.",
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
        {" "}subscription, billed by Anthropic (roughly $20 and up per month, not included in the
        $997). If you can sign in on the desktop app, you are set.
      </>
    ),
    setupSteps: [
      {
        title: "Download Claude and sign in.",
        copy:
          "Click Download Claude above. Install the desktop app, open it, and sign in with the account you will use during the workshop.",
      },
      {
        title: "Create your workshop folder.",
        copy: (
          <>
            Open Finder on a Mac or File Explorer on Windows. Open Documents and create a new
            folder named <strong>MY BIZ BRAIN</strong>. (That is what Justin&apos;s is called. One
            folder, this name, so the room moves together.)
          </>
        ),
      },
      {
        title: "Copy in the starter pack.",
        copy: (
          <>
            Download the <a href="/aiinstall/ai-install-claude-starter-pack.zip">starter pack</a> and copy its files into{" "}
            <strong>MY BIZ BRAIN</strong>, keeping the folder structure. The README inside takes
            2 minutes and tells you exactly where things go.
          </>
        ),
      },
      {
        title: "Open the folder in Cowork.",
        copy: (
          <>
            Open the Claude desktop app and start a <strong>Cowork</strong> task. When it asks which
            folder to work in, connect <strong>Documents &gt; MY BIZ BRAIN</strong> and allow access.
            You should see your starter pack files listed.
          </>
        ),
      },
    ],
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
        id: "proof",
        title: "I passed the READY.txt test.",
        copy: "The app created the file and I can see it inside my folder.",
      },
      {
        id: "context",
        title: "My raw material and the starter pack are in the folder.",
        copy:
          "Writing samples, team roster, projects, agency basics, tools list, and the starter pack files.",
      },
      {
        id: "privacy",
        title: "No passwords or account keys are in the folder.",
        copy:
          "Login credentials live in your password manager, not in the brain. (That is the only thing to pull out.)",
      },
    ],
  },
  codex: {
    label: "Codex",
    pageTitle: "Codex Pre-Work | The Agency AI Install",
    description:
      "Get your computer ready for the workshop. You will install the app, create one folder, load it with your raw material, and prove it works. Do this early in the week, not the night before.",
    ogImage: "/og/ai-install-codex-prework.png",
    starterPackUrl: "/aiinstall/ai-install-codex-starter-pack.zip",
    downloadUrl: "https://chatgpt.com/download/",
    downloadLabel: "Download ChatGPT",
    officialGuideUrl: "https://help.openai.com/en/articles/20001275-chatgpt-work-and-codex",
    officialGuideLabel: "Official Codex guide",
    alternatePath: "/aiinstall/prework/claude",
    alternateLabel: "Using Claude instead?",
    requirements:
      "Before you begin: Codex requires a ChatGPT plan that includes it, billed by OpenAI (not included in the $997). A free account will not run what we build on day two. If you are unsure your plan includes Codex, open the app and check before Monday the 24th; if you cannot see Codex, upgrade or write Mary.",
    setupSteps: [
      {
        title: "Download ChatGPT and sign in.",
        copy:
          "Click Download ChatGPT above. Install the desktop app, open it, and sign in with the account you will use during the workshop.",
      },
      {
        title: "Create your workshop folder.",
        copy: (
          <>
            Open Finder on a Mac or File Explorer on Windows. Open Documents and create a new
            folder named <strong>MY BIZ BRAIN</strong>. (That is what Justin&apos;s is called. One
            folder, this name, so the room moves together.)
          </>
        ),
      },
      {
        title: "Copy in the starter pack.",
        copy: (
          <>
            Download the <a href="/aiinstall/ai-install-codex-starter-pack.zip">starter pack</a> and copy its files into{" "}
            <strong>MY BIZ BRAIN</strong>, keeping the folder structure. The README inside takes
            2 minutes and tells you exactly where things go.
          </>
        ),
      },
      {
        title: "Open the folder in Codex.",
        copy: (
          <>
            Open ChatGPT, use the menu in the top left to select <strong>Codex</strong>, and choose
            the <strong>Documents &gt; MY BIZ BRAIN</strong> folder. Allow access. You should see
            your starter pack files listed.
          </>
        ),
      },
    ],
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
        id: "proof",
        title: "I passed the READY.txt test.",
        copy: "The app created the file and I can see it inside my folder.",
      },
      {
        id: "context",
        title: "My raw material and the starter pack are in the folder.",
        copy:
          "Writing samples, team roster, projects, agency basics, tools list, and the starter pack files.",
      },
      {
        id: "privacy",
        title: "No passwords or account keys are in the folder.",
        copy:
          "Login credentials live in your password manager, not in the brain. (That is the only thing to pull out.)",
      },
    ],
  },
};

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

const TEST_PROMPT =
  "Inside the open MY BIZ BRAIN folder, create a file named READY.txt containing\nexactly: AI Install [FIRST NAME] [LAST NAME] ready for August 26.";

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
  const [copied, setCopied] = useState(false);

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
                Get your computer ready for the workshop. You will install the app, create one
                folder, load it with your raw material, and prove it works. Do this early in the
                week, not the night before.
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
              <h2>Install the app and connect your folder.</h2>
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
                {selectedPlatform === "claude" ? (
                  <>Open Cowork with your <strong>MY BIZ BRAIN</strong> folder connected.</>
                ) : (
                  <>Open Codex with your <strong>MY BIZ BRAIN</strong> folder selected.</>
                )} Copy the instruction below, paste it into the chat, and send it. If READY.txt
                shows up in your folder, your setup works. That file is also how we confirm your
                seat, so leave it there.
              </p>
            </div>
            <div className="aip-prompt">
              <pre><code>{TEST_PROMPT}</code></pre>
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
              something analyzed. Folders full of dumps make a slower, dumber brain.
            </p>
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
              the four cards above were setup steps. Your progress stays in this browser.
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
              <h2>{isReady ? "One last step: prove it to Mary." : "Finish this before day one."}</h2>
              {isReady ? (
                <div className="aip-finish__instructions">
                  <p>
                    Take one screenshot: your <strong>MY BIZ BRAIN</strong> folder open inside
                    <strong>{selectedPlatform === "claude" ? " Cowork" : " Codex"}</strong>, READY.txt
                    visible. Reply to your welcome email with it. Mary confirms every seat
                    personally, and your seat is confirmed when she replies. Submit the same
                    screenshot through the <a href="/aiinstall/ready">pre-work confirmation form</a>.
                  </p>
                  <p>
                    Deadline: <strong>end of day Monday, August 24.</strong> Pre-work not confirmed
                    by then means your seat moves to a later date. The room builds, it does not wait.
                  </p>
                </div>
              ) : null}
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
