import Player from "@vimeo/player";
import {
  ArrowDownToLine,
  Check,
  ChevronRight,
  CircleUserRound,
  Clock3,
  FileArchive,
  FileText,
  LockKeyhole,
  LogOut,
  Play,
  ShieldCheck,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState, type FormEvent } from "react";

import standardLogo from "@/assets/standard-word-logo.png";
import { supabase } from "@/integrations/supabase/client";
import {
  getAiInstallPortalDownload,
  loadAiInstallPortalStatus,
  recordAiInstallPortalSignOut,
  recordAiInstallVideoEvent,
  requestAiInstallPortalLink,
  type AiInstallPortalProgress,
  type AiInstallPortalStatus,
  type AiInstallVideoId,
} from "@/lib/aiInstallPortal";

import "./AIInstallPortal.css";

const COMMON_RESOURCES = [
  { id: "day-1-guide", title: "Day 1 Build Guide", detail: "20-page workshop guide", kind: "PDF" },
  { id: "day-2-guide", title: "Day 2 Build Guide", detail: "27-page workshop guide", kind: "PDF" },
  { id: "skills-guide", title: "Standard Playbook Skills", detail: "Skills reference guide", kind: "PDF" },
] as const;

const PLATFORM_RESOURCES = {
  claude: [
    { id: "claude-prework", title: "Claude Pre-work Pack", detail: "Folder setup and starter files", kind: "ZIP" },
    { id: "claude-skills", title: "Claude Skills Library", detail: "Complete skill files for Claude", kind: "ZIP" },
  ],
  codex: [
    { id: "codex-prework", title: "Codex Pre-work Pack", detail: "Includes AGENTS-STARTER.md", kind: "ZIP" },
    { id: "codex-skills", title: "Codex Skills Library", detail: "Complete skill files for Codex", kind: "ZIP" },
  ],
} as const;

type Resource = (typeof COMMON_RESOURCES)[number] | (typeof PLATFORM_RESOURCES.claude)[number] | (typeof PLATFORM_RESOURCES.codex)[number];

export default function AIInstallPortal() {
  const [checkingSession, setCheckingSession] = useState(true);
  const [status, setStatus] = useState<AiInstallPortalStatus | null>(null);
  const [accessError, setAccessError] = useState<string | null>(null);
  const loadedSessionRef = useRef<string | null>(null);

  useEffect(() => {
    document.title = "Agency AI Install Portal | Standard Playbook";
    let robots = document.querySelector('meta[name="robots"]') as HTMLMetaElement | null;
    if (!robots) {
      robots = document.createElement("meta");
      robots.name = "robots";
      document.head.appendChild(robots);
    }
    robots.content = "noindex, nofollow, noarchive";
  }, []);

  const loadPortal = useCallback(async (accessToken: string) => {
    if (loadedSessionRef.current === accessToken) return;
    loadedSessionRef.current = accessToken;
    setAccessError(null);
    try {
      setStatus(await loadAiInstallPortalStatus());
    } catch (error) {
      loadedSessionRef.current = null;
      setStatus(null);
      setAccessError(error instanceof Error ? error.message : "We could not open your portal.");
    } finally {
      setCheckingSession(false);
    }
  }, []);

  useEffect(() => {
    let active = true;

    void supabase.auth.getSession().then(({ data }) => {
      if (!active) return;
      if (data.session) void loadPortal(data.session.access_token);
      else setCheckingSession(false);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((event, session) => {
      if (!active) return;
      if (event === "SIGNED_IN" && session) void loadPortal(session.access_token);
      if (event === "SIGNED_OUT") {
        loadedSessionRef.current = null;
        setStatus(null);
        setAccessError(null);
        setCheckingSession(false);
      }
    });

    return () => {
      active = false;
      listener.subscription.unsubscribe();
    };
  }, [loadPortal]);

  if (checkingSession) return <PortalLoading />;
  if (!status) return <PortalGate signedInButDenied={Boolean(accessError)} error={accessError} />;
  return <PortalWorkspace status={status} />;
}

function PortalLoading() {
  return (
    <div className="aip-page aip-gate-page">
      <PortalHeader />
      <main className="aip-gate-stage" aria-live="polite">
        <div className="aip-loader" aria-hidden="true" />
        <p>Opening your private workshop space.</p>
      </main>
    </div>
  );
}

function PortalGate({ signedInButDenied, error }: { signedInButDenied: boolean; error: string | null }) {
  const [email, setEmail] = useState("");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setSending(true);
    setFormError(null);
    try {
      await requestAiInstallPortalLink(email);
      setSent(true);
    } catch (requestError) {
      setFormError(requestError instanceof Error ? requestError.message : "Could not request a link.");
    } finally {
      setSending(false);
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    window.location.assign("/aiinstall/portal");
  };

  return (
    <div className="aip-page aip-gate-page">
      <PortalHeader />
      <main className="aip-gate-stage">
        <div className="aip-gate-backdrop" aria-hidden="true">
          <span>DAY 01</span>
          <span>DAY 02</span>
          <span>FILES</span>
        </div>

        <section className="aip-access-dialog" aria-labelledby="portal-access-title">
          <div className="aip-access-mark"><LockKeyhole size={22} strokeWidth={1.8} /></div>
          <p className="aip-label">Private attendee portal</p>
          <h1 id="portal-access-title">Your AI install.<br /><em>All in one place.</em></h1>

          {signedInButDenied ? (
            <div className="aip-denied" role="alert">
              <p>{error ?? "This signed-in email does not have active portal access."}</p>
              <button type="button" className="aip-text-button" onClick={signOut}>
                Use a different email <ChevronRight size={15} />
              </button>
            </div>
          ) : sent ? (
            <div className="aip-sent" role="status">
              <span><Check size={18} /></span>
              <div>
                <strong>Check your inbox.</strong>
                <p>If {email.trim()} has access, your secure sign-in link is on the way.</p>
              </div>
              <button type="button" className="aip-text-button" onClick={() => setSent(false)}>
                Try another email
              </button>
            </div>
          ) : (
            <form className="aip-access-form" onSubmit={submit}>
              <label htmlFor="portal-email">Email used for your AI Install seat</label>
              <div className="aip-input-row">
                <input
                  id="portal-email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="you@youragency.com"
                />
                <button type="submit" disabled={sending}>
                  {sending ? "Sending" : "Email my access"}
                  {!sending && <ChevronRight size={18} />}
                </button>
              </div>
              {formError && <p className="aip-form-error" role="alert">{formError}</p>}
            </form>
          )}

          <div className="aip-access-foot">
            <ShieldCheck size={17} />
            <span>No password. Access is tied to an approved email address.</span>
          </div>
        </section>
      </main>
    </div>
  );
}

function PortalWorkspace({ status }: { status: AiInstallPortalStatus }) {
  const progressById = useMemo(
    () => new Map(status.progress.map((item) => [item.content_id, item])),
    [status.progress],
  );
  const [localProgress, setLocalProgress] = useState<Record<string, number>>(() =>
    Object.fromEntries(status.progress.map((item) => [item.content_id, item.max_progress])),
  );
  const [downloadId, setDownloadId] = useState<string | null>(null);
  const [downloadError, setDownloadError] = useState<string | null>(null);

  const resources = useMemo<Resource[]>(() => {
    const platform = status.access.platform;
    const specific = platform === "both"
      ? [...PLATFORM_RESOURCES.claude, ...PLATFORM_RESOURCES.codex]
      : [...PLATFORM_RESOURCES[platform]];
    return [...COMMON_RESOURCES, ...specific];
  }, [status.access.platform]);

  const download = async (resource: Resource) => {
    setDownloadId(resource.id);
    setDownloadError(null);
    try {
      const url = await getAiInstallPortalDownload(resource.id);
      window.location.assign(url);
    } catch (error) {
      setDownloadError(error instanceof Error ? error.message : "Could not prepare that download.");
    } finally {
      setDownloadId(null);
    }
  };

  const signOut = async () => {
    try {
      await recordAiInstallPortalSignOut();
    } catch {
      // A failed analytics write should not prevent sign-out.
    }
    await supabase.auth.signOut();
    window.location.assign("/aiinstall/portal");
  };

  const platformLabel = status.access.platform === "both"
    ? "Claude + Codex"
    : status.access.platform === "claude" ? "Claude" : "Codex";
  const preworkHref = status.access.platform === "claude"
    ? "/aiinstall/prework/claude"
    : "/aiinstall/prework/codex";

  return (
    <div className="aip-page">
      <PortalHeader email={status.access.email} onSignOut={signOut} />
      <main>
        <section className="aip-hero">
          <div className="aip-shell aip-hero-grid">
            <div className="aip-hero-copy">
              <p className="aip-label">Agency AI Install / private replay</p>
              <h1>Build it.<br />Train it.<br /><em>Use it.</em></h1>
              <p className="aip-hero-lede">
                Your two workshop days, build guides, pre-work files, and Standard skills are organized below.
              </p>
            </div>
            <div className="aip-hero-rail">
              <div className="aip-identity-card">
                <CircleUserRound size={28} strokeWidth={1.4} />
                <div><span>Access for</span><strong>{status.access.full_name || status.access.email}</strong></div>
              </div>
              <dl>
                <div><dt>Build platform</dt><dd>{platformLabel}</dd></div>
                <div><dt>Workshop</dt><dd>2 days</dd></div>
                <div><dt>Resource files</dt><dd>{resources.length}</dd></div>
              </dl>
              <a href={preworkHref} className="aip-inline-link">Open the pre-work checklist <ChevronRight size={16} /></a>
            </div>
          </div>
        </section>

        <section className="aip-replays" aria-labelledby="replays-title">
          <div className="aip-shell">
            <div className="aip-section-head">
              <div><p className="aip-index">01 / Replays</p><h2 id="replays-title">The two-day build</h2></div>
              <p>Watch in order. Your furthest viewing point is saved to this email.</p>
            </div>

            <div className="aip-video-stack">
              {status.videos.map((video, index) => (
                <WorkshopVideo
                  key={video.id}
                  video={video}
                  index={index + 1}
                  saved={progressById.get(video.id)}
                  localPercent={localProgress[video.id] ?? 0}
                  onProgress={(percent) => setLocalProgress((current) => ({ ...current, [video.id]: percent }))}
                />
              ))}
            </div>
          </div>
        </section>

        <section className="aip-resources" aria-labelledby="resources-title">
          <div className="aip-shell aip-resources-grid">
            <div className="aip-resources-intro">
              <p className="aip-index">02 / Build files</p>
              <h2 id="resources-title">Everything<br />within reach.</h2>
              <p>Downloads expire after five minutes. Requesting one creates a private, single-purpose link.</p>
            </div>
            <div className="aip-resource-list">
              {resources.map((resource, index) => (
                <button
                  type="button"
                  className="aip-resource-row"
                  key={resource.id}
                  disabled={downloadId === resource.id}
                  onClick={() => void download(resource)}
                >
                  <span className="aip-resource-number">{String(index + 1).padStart(2, "0")}</span>
                  <span className="aip-resource-icon">{resource.kind === "PDF" ? <FileText /> : <FileArchive />}</span>
                  <span className="aip-resource-copy"><strong>{resource.title}</strong><small>{resource.detail}</small></span>
                  <span className="aip-resource-kind">{resource.kind}</span>
                  <span className="aip-download-action">
                    {downloadId === resource.id ? "Preparing" : "Download"}<ArrowDownToLine size={17} />
                  </span>
                </button>
              ))}
              {downloadError && <p className="aip-form-error" role="alert">{downloadError}</p>}
            </div>
          </div>
        </section>

        <footer className="aip-footer">
          <div className="aip-shell">
            <img src={standardLogo} alt="Standard Playbook" />
            <p>Private workshop material for registered attendees.</p>
          </div>
        </footer>
      </main>
    </div>
  );
}

function WorkshopVideo({
  video,
  index,
  saved,
  localPercent,
  onProgress,
}: {
  video: AiInstallPortalStatus["videos"][number];
  index: number;
  saved?: AiInstallPortalProgress;
  localPercent: number;
  onProgress: (percent: number) => void;
}) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const lastBucket = useRef(Math.floor((saved?.max_progress ?? 0) / 10) * 10);
  const played = useRef(Boolean(saved?.started_at));
  const currentPercent = useRef(localPercent);
  const progressCallback = useRef(onProgress);

  useEffect(() => {
    currentPercent.current = localPercent;
    progressCallback.current = onProgress;
  }, [localPercent, onProgress]);

  useEffect(() => {
    if (!iframeRef.current) return;
    const player = new Player(iframeRef.current);

    const handlePlay = () => {
      if (played.current) return;
      played.current = true;
      void recordAiInstallVideoEvent({ contentId: video.id, event: "play", progressPercent: currentPercent.current });
    };
    const handleTime = ({ percent }: { percent: number }) => {
      const rounded = Math.max(0, Math.min(99, Math.round(percent * 100)));
      progressCallback.current(rounded);
      const bucket = Math.floor(rounded / 10) * 10;
      if (bucket >= 10 && bucket > lastBucket.current) {
        lastBucket.current = bucket;
        void recordAiInstallVideoEvent({ contentId: video.id, event: "progress", progressPercent: bucket });
      }
    };
    const handleEnded = () => {
      lastBucket.current = 100;
      progressCallback.current(100);
      void recordAiInstallVideoEvent({ contentId: video.id, event: "complete", progressPercent: 100 });
    };

    player.on("play", handlePlay);
    player.on("timeupdate", handleTime);
    player.on("ended", handleEnded);
    return () => {
      player.off("play", handlePlay);
      player.off("timeupdate", handleTime);
      player.off("ended", handleEnded);
    };
  }, [video.id]);

  const percent = Math.max(saved?.max_progress ?? 0, localPercent);
  const isComplete = Boolean(saved?.completed_at) || percent >= 100;

  return (
    <article className="aip-video-card">
      <div className="aip-video-frame">
        <iframe
          ref={iframeRef}
          src={`https://player.vimeo.com/video/${video.vimeo_id}?title=0&byline=0&portrait=0&dnt=1`}
          title={video.title}
          allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media"
          allowFullScreen
        />
      </div>
      <div className="aip-video-meta">
        <span className="aip-day-number">DAY {String(index).padStart(2, "0")}</span>
        <div>
          <h3>{index === 1 ? "Build the brain" : "Make it run"}</h3>
          <p>{index === 1 ? "Foundation, voice, rules, content, team, and active projects." : "Memory, master file, skills, and your working operating rhythm."}</p>
        </div>
        <div className={`aip-progress${isComplete ? " aip-progress-complete" : ""}`}>
          <div className="aip-progress-label"><span>{isComplete ? <><Check size={14} /> Complete</> : <><Play size={13} fill="currentColor" /> {percent}% watched</>}</span><Clock3 size={15} /></div>
          <div className="aip-progress-track"><span style={{ width: `${percent}%` }} /></div>
        </div>
      </div>
    </article>
  );
}

function PortalHeader({ email, onSignOut }: { email?: string; onSignOut?: () => void }) {
  return (
    <header className="aip-header">
      <div className="aip-shell aip-header-inner">
        <a href="/" aria-label="Standard Playbook home"><img src={standardLogo} alt="Standard Playbook" /></a>
        <span className="aip-header-title">Agency AI Install</span>
        {email && onSignOut ? (
          <button type="button" onClick={onSignOut} className="aip-signout" title={`Signed in as ${email}`}>
            <span>{email}</span><LogOut size={16} />
          </button>
        ) : <span className="aip-private"><LockKeyhole size={14} /> Private access</span>}
      </div>
    </header>
  );
}
