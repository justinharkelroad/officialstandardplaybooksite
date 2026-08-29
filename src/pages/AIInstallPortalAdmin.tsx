import {
  Check,
  Copy,
  Eye,
  FileUp,
  Link2,
  ListPlus,
  LoaderCircle,
  LockKeyhole,
  KeyRound,
  RefreshCcw,
  RotateCcw,
  ShieldOff,
  Square,
  ToggleLeft,
  ToggleRight,
  UserPlus,
  Video,
  X,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState, type ChangeEvent, type FormEvent } from "react";

import { MemberAuthProvider, useAuth } from "@/app/lib/auth";
import {
  parseAiInstallBulkInvites,
  type AiInstallBulkInvite,
} from "@/lib/aiInstallBulkInvites";
import {
  grantAiInstallPortalAccess,
  getAiInstallTestimonialReviewUrl,
  issueAiInstallPortalActivationCode,
  loadAiInstallPortalAdminRows,
  resetAiInstallPortalActivity,
  setAiInstallPortalAccessActive,
  setAiInstallTestimonialPromptEnabled,
  type AiInstallPortalAdminRow,
  type AiInstallPortalPlatform,
} from "@/lib/aiInstallPortal";

import "./AIInstallPortal.css";
import "./AIInstallPortalAdmin.css";

export default function AIInstallPortalAdmin() {
  useEffect(() => {
    document.title = "AI Install Access Control | Standard Playbook";
    let robots = document.querySelector('meta[name="robots"]') as HTMLMetaElement | null;
    if (!robots) {
      robots = document.createElement("meta");
      robots.name = "robots";
      document.head.appendChild(robots);
    }
    robots.content = "noindex, nofollow, noarchive";
  }, []);

  return (
    <MemberAuthProvider>
      <AdminGate />
    </MemberAuthProvider>
  );
}

function AdminGate() {
  const { loading, member, isAdmin } = useAuth();

  if (loading) return <AdminMessage title="Checking admin access" detail="One moment." loading />;
  if (!member) return <AdminMessage title="Admin sign-in required" detail="Use your Standard Playbook admin account." href="/login" />;
  if (!isAdmin) return <AdminMessage title="No admin access" detail="This account is signed in but does not have administrator access." />;
  return <AdminWorkspace />;
}

function AdminMessage({ title, detail, href, loading = false }: { title: string; detail: string; href?: string; loading?: boolean }) {
  return (
    <div className="aip-page aipa-message-page">
      <main className="aipa-message">
        {loading ? <LoaderCircle className="aipa-spin" /> : <LockKeyhole />}
        <h1>{title}</h1>
        <p>{detail}</p>
        {href && <a href={href}>Go to login</a>}
      </main>
    </div>
  );
}

function AdminWorkspace() {
  const [rows, setRows] = useState<AiInstallPortalAdminRow[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [activationCredential, setActivationCredential] = useState<{
    email: string;
    code: string;
  } | null>(null);
  const [testimonialPromptEnabled, setTestimonialPromptEnabled] = useState(true);
  const [filter, setFilter] = useState<"all" | "active" | "revoked">("all");

  const refresh = useCallback(async () => {
    setError(null);
    try {
      const result = await loadAiInstallPortalAdminRows();
      setRows(result.rows);
      setTestimonialPromptEnabled(result.testimonialPromptEnabled);
    } catch (readError) {
      setError(readError instanceof Error ? readError.message : "Could not load portal access.");
      setRows([]);
    }
  }, []);

  useEffect(() => { void refresh(); }, [refresh]);

  const visible = useMemo(() => (rows ?? []).filter((row) => {
    if (filter === "active") return row.is_active;
    if (filter === "revoked") return !row.is_active;
    return true;
  }), [filter, rows]);

  const activeCount = (rows ?? []).filter((row) => row.is_active).length;
  const loggedInCount = (rows ?? []).filter((row) => row.first_login_at).length;
  const testimonialCount = (rows ?? []).filter((row) => row.testimonial).length;

  const toggleTestimonialPrompt = async () => {
    const next = !testimonialPromptEnabled;
    setBusyId("testimonial-prompt");
    setError(null);
    setNotice(null);
    try {
      await setAiInstallTestimonialPromptEnabled(next);
      setTestimonialPromptEnabled(next);
      setNotice(`The testimonial request is now ${next ? "on" : "off"}.`);
    } catch (toggleError) {
      setError(toggleError instanceof Error ? toggleError.message : "Could not update the testimonial request.");
    } finally {
      setBusyId(null);
    }
  };

  const reviewTestimonial = async (row: AiInstallPortalAdminRow) => {
    if (!row.testimonial) return;
    const reviewWindow = window.open("about:blank", "_blank");
    if (reviewWindow) reviewWindow.opener = null;
    setBusyId(`${row.id}:testimonial`);
    setError(null);
    try {
      const url = await getAiInstallTestimonialReviewUrl(row.testimonial.id);
      if (!reviewWindow) throw new Error("Your browser blocked the review window. Allow pop-ups and try again.");
      reviewWindow.location.replace(url);
    } catch (reviewError) {
      reviewWindow?.close();
      setError(reviewError instanceof Error ? reviewError.message : "Could not open the private video.");
    } finally {
      setBusyId(null);
    }
  };

  const mutate = async (row: AiInstallPortalAdminRow, action: "toggle" | "issue" | "reset") => {
    if (action === "reset" && !window.confirm(
      `Clear all tracked activity for ${row.email}? This removes portal sessions, video progress, downloads, and readiness status. Their access and invite history will remain.`,
    )) return;
    if (action === "issue" && !window.confirm(
      `Issue a new one-time activation code for ${row.email}? This temporarily replaces their current Standard Playbook password. Share the code privately so they can create a new password.`,
    )) return;

    setBusyId(`${row.id}:${action}`);
    setError(null);
    setNotice(null);
    try {
      if (action === "toggle") {
        await setAiInstallPortalAccessActive(row.id, !row.is_active);
        setNotice(`${row.email} ${row.is_active ? "revoked" : "reactivated"}.`);
      } else if (action === "issue") {
        const result = await issueAiInstallPortalActivationCode(row.id);
        setActivationCredential({ email: result.email, code: result.activation_code });
        setNotice(`A one-time activation code was created for ${result.email}. No email was sent.`);
      } else {
        await resetAiInstallPortalActivity(row.id);
        setNotice(`${row.email} activity reset.`);
      }
      await refresh();
    } catch (actionError) {
      setError(actionError instanceof Error ? actionError.message : "The action failed.");
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div className="aip-page aipa-page">
      <header className="aipa-header">
        <div>
          <p>Agency AI Install</p>
          <h1>Access control</h1>
        </div>
        <a href="/aiinstall/portal" target="_blank" rel="noreferrer"><Eye size={16} /> Open attendee portal</a>
      </header>

      <main className="aipa-main">
        <section className="aipa-summary" aria-label="Portal access summary">
          <div><span>Total access</span><strong>{rows?.length ?? 0}</strong></div>
          <div><span>Active</span><strong>{activeCount}</strong></div>
          <div><span>Opened portal</span><strong>{loggedInCount}</strong></div>
          <div><span>Testimonials</span><strong>{testimonialCount}</strong></div>
        </section>

        <section className="aipa-testimonial-control" aria-label="Testimonial request setting">
          <div><Video size={23} /><span><strong>Video testimonial request</strong><small>{testimonialPromptEnabled ? "Shown after first sign-in and available from the portal." : "Hidden from attendee portals. Existing videos remain private and available."}</small></span></div>
          <button type="button" className={testimonialPromptEnabled ? "is-on" : ""} disabled={busyId !== null} onClick={() => void toggleTestimonialPrompt()} aria-pressed={testimonialPromptEnabled}>
            {testimonialPromptEnabled ? <ToggleRight size={24} /> : <ToggleLeft size={24} />}
            {busyId === "testimonial-prompt" ? "Saving" : testimonialPromptEnabled ? "Request on" : "Request off"}
          </button>
        </section>

        <GrantAccessForm
          onGranted={async (email, activationCode) => {
            if (activationCode) {
              setActivationCredential({ email, code: activationCode });
              setNotice(`Access granted for ${email}. Copy the one-time activation code below.`);
            } else {
              setNotice(`Access granted for ${email}. They can use their existing Standard Playbook password.`);
            }
            await refresh();
          }}
          onError={setError}
        />

        <BulkInviteForm
          onCompleted={async (message) => {
            setNotice(message);
            await refresh();
          }}
        />

        <section className="aipa-access-section">
          <div className="aipa-section-bar">
            <div><p>Attendee ledger</p><h2>Approved seats and engagement</h2></div>
            <div className="aipa-filters">
              {(["all", "active", "revoked"] as const).map((value) => (
                <button type="button" key={value} className={filter === value ? "is-active" : ""} onClick={() => setFilter(value)}>{value}</button>
              ))}
              <button type="button" onClick={() => void refresh()} aria-label="Refresh access list"><RefreshCcw size={15} /></button>
            </div>
          </div>

          {notice && <p className="aipa-notice" role="status"><Check size={16} />{notice}</p>}
          {error && <p className="aipa-error" role="alert">{error}</p>}
          {activationCredential && (
            <section className="aipa-credential" aria-label="One-time activation code">
              <div>
                <span>One-time activation code for</span>
                <strong>{activationCredential.email}</strong>
                <code>{activationCredential.code}</code>
                <small>This code is shown only here. Share it privately; issuing another code invalidates this one.</small>
              </div>
              <button
                type="button"
                onClick={() => void navigator.clipboard.writeText(activationCredential.code)}
              >
                <Copy size={15} /> Copy code
              </button>
              <button type="button" className="aipa-credential-close" onClick={() => setActivationCredential(null)} aria-label="Hide activation code">
                <X size={16} />
              </button>
            </section>
          )}

          {rows === null ? (
            <div className="aipa-empty"><LoaderCircle className="aipa-spin" /><p>Loading attendees.</p></div>
          ) : visible.length === 0 ? (
            <div className="aipa-empty"><p>No access records match this view.</p></div>
          ) : (
            <div className="aipa-table-wrap">
              <table className="aipa-table">
                <thead><tr><th>Attendee</th><th>Access</th><th>Activity</th><th>Day 1</th><th>Day 2</th><th>Files</th><th>Ready</th><th>Testimonial</th><th><span className="sr-only">Actions</span></th></tr></thead>
                <tbody>
                  {visible.map((row) => (
                    <tr key={row.id} className={!row.is_active ? "is-revoked" : ""}>
                      <td><strong>{row.full_name || "Name not added"}</strong><a href={`mailto:${row.email}`}>{row.email}</a></td>
                      <td><span className={`aipa-status ${row.is_active ? "is-on" : "is-off"}`}>{row.is_active ? "Active" : "Revoked"}</span><small>{platformName(row.platform)}</small></td>
                      <td><strong>{row.first_login_at ? `${row.login_count} session${row.login_count === 1 ? "" : "s"}` : "Never opened"}</strong><small>{row.last_login_at ? formatDate(row.last_login_at) : "Awaiting first sign-in"}</small></td>
                      <td><ProgressCell value={row.progress["day-1"]?.max_progress ?? 0} complete={Boolean(row.progress["day-1"]?.completed_at)} /></td>
                      <td><ProgressCell value={row.progress["day-2"]?.max_progress ?? 0} complete={Boolean(row.progress["day-2"]?.completed_at)} /></td>
                      <td><strong>{row.downloads.count}</strong><small>{row.downloads.last_at ? formatDate(row.downloads.last_at) : "No downloads"}</small></td>
                      <td>{row.ready_submitted_at ? <span className="aipa-ready"><Check size={14} />Yes</span> : <span className="aipa-muted">No</span>}</td>
                      <td>{row.testimonial ? <button type="button" className="aipa-review-video" disabled={busyId !== null} onClick={() => void reviewTestimonial(row)}><Video size={14} />{busyId === `${row.id}:testimonial` ? "Opening" : "Review"}<small>{formatDate(row.testimonial.submitted_at)}</small></button> : <span className="aipa-muted">Not submitted</span>}</td>
                      <td>
                        <div className="aipa-row-actions">
                          <button type="button" disabled={!row.is_active || busyId !== null} onClick={() => void mutate(row, "issue")} title="Issue one-time activation code"><KeyRound size={15} />{busyId === `${row.id}:issue` ? "Issuing" : "Code"}</button>
                          <button type="button" disabled={busyId !== null} onClick={() => void mutate(row, "reset")} className="is-reset" title="Clear tracked activity"><RotateCcw size={15} />{busyId === `${row.id}:reset` ? "Clearing" : "Reset"}</button>
                          <button type="button" disabled={busyId !== null} onClick={() => void mutate(row, "toggle")} className={row.is_active ? "is-danger" : ""} title={row.is_active ? "Revoke access" : "Reactivate access"}>{row.is_active ? <ShieldOff size={15} /> : <Link2 size={15} />}{busyId === `${row.id}:toggle` ? "Saving" : row.is_active ? "Revoke" : "Activate"}</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

interface BulkGrantOutcome {
  email: string;
  status: "granted" | "failed";
  activationCode?: string;
  error?: string;
}

function BulkInviteForm({ onCompleted }: { onCompleted: (message: string) => Promise<void> }) {
  const [source, setSource] = useState("");
  const [fileName, setFileName] = useState<string | null>(null);
  const [platform, setPlatform] = useState<AiInstallPortalPlatform>("codex");
  const [expiresAt, setExpiresAt] = useState("");
  const [granting, setGranting] = useState(false);
  const [processed, setProcessed] = useState(0);
  const [currentEmail, setCurrentEmail] = useState<string | null>(null);
  const [outcomes, setOutcomes] = useState<BulkGrantOutcome[]>([]);
  const [fileError, setFileError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const stopRequestedRef = useRef(false);

  const parsed = useMemo(() => parseAiInstallBulkInvites(source, {
    platform,
    expiresAt: expiresAt || null,
    limit: 100,
  }), [expiresAt, platform, source]);

  const resetRun = () => {
    setProcessed(0);
    setCurrentEmail(null);
    setOutcomes([]);
  };

  const changeSource = (value: string) => {
    setSource(value);
    setFileName(null);
    setFileError(null);
    resetRun();
  };

  const uploadCsv = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setFileError(null);
    resetRun();
    try {
      setSource(await file.text());
      setFileName(file.name);
    } catch {
      setFileError("That CSV file could not be read. Try exporting it again as UTF-8 CSV.");
      setFileName(null);
    }
  };

  const clear = () => {
    setSource("");
    setFileName(null);
    setFileError(null);
    resetRun();
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const grantSeats = async () => {
    if (parsed.invites.length === 0 || granting) return;
    stopRequestedRef.current = false;
    setGranting(true);
    setProcessed(0);
    setCurrentEmail(null);
    setOutcomes([]);

    const nextOutcomes: BulkGrantOutcome[] = [];
    for (const invite of parsed.invites) {
      if (stopRequestedRef.current) break;
      setCurrentEmail(invite.email);
      let outcome: BulkGrantOutcome;
      try {
        const result = await grantBulkAccess(invite);
        outcome = {
          email: invite.email,
          status: "granted",
          activationCode: result.activation_code ?? undefined,
        };
      } catch (grantError) {
        outcome = {
          email: invite.email,
          status: "failed",
          error: grantError instanceof Error ? grantError.message : "Access grant failed.",
        };
      }
      nextOutcomes.push(outcome);
      setOutcomes([...nextOutcomes]);
      setProcessed(nextOutcomes.length);
    }

    setCurrentEmail(null);
    setGranting(false);
    const grantedCount = nextOutcomes.filter((outcome) => outcome.status === "granted").length;
    const failedCount = nextOutcomes.length - grantedCount;
    const stopped = nextOutcomes.length < parsed.invites.length;
    await onCompleted(
      stopped
        ? `Bulk access stopped: ${grantedCount} granted and ${failedCount} failed.`
        : `Bulk access complete: ${grantedCount} granted and ${failedCount} failed.`,
    );
  };

  const grantedCount = outcomes.filter((outcome) => outcome.status === "granted").length;
  const failed = outcomes.filter((outcome) => outcome.status === "failed");
  const activationCredentials = outcomes.filter((outcome) => outcome.activationCode);
  const preview = parsed.invites.slice(0, 5);

  return (
    <section className="aipa-bulk" aria-labelledby="bulk-invite-title">
      <div className="aipa-bulk-head">
        <div className="aipa-bulk-title">
          <ListPlus size={24} />
          <div><p>Bulk access</p><h2 id="bulk-invite-title">Approve an attendee list</h2></div>
        </div>
        <p className="aipa-bulk-help">Paste addresses or upload a CSV. This grants access without sending email.</p>
      </div>

      <div className="aipa-bulk-grid">
        <div className="aipa-bulk-source">
          <label htmlFor="bulk-invite-source">Email list or CSV content</label>
          <textarea
            id="bulk-invite-source"
            value={source}
            disabled={granting}
            onChange={(event) => changeSource(event.target.value)}
            placeholder={"alex@agency.com\nJordan Lee <jordan@agency.com>\nowner@thirdagency.com"}
          />
          <div className="aipa-bulk-file-row">
            <label className="aipa-file-button" htmlFor="bulk-invite-file"><FileUp size={15} /> Upload CSV<input ref={fileInputRef} id="bulk-invite-file" type="file" accept=".csv,text/csv" disabled={granting} onChange={(event) => void uploadCsv(event)} /></label>
            <span>{fileName ?? "CSV columns: email, name, platform, expires"}</span>
            {source && <button type="button" disabled={granting} onClick={clear}>Clear</button>}
          </div>
          {fileError && <p className="aipa-inline-error" role="alert">{fileError}</p>}
        </div>

        <div className="aipa-bulk-settings">
          <label><span>Default platform</span><select value={platform} disabled={granting} onChange={(event) => { setPlatform(event.target.value as AiInstallPortalPlatform); resetRun(); }}><option value="codex">Codex</option><option value="claude">Claude</option><option value="both">Claude + Codex</option></select></label>
          <label><span>Default expiration</span><input type="datetime-local" value={expiresAt} disabled={granting} onChange={(event) => { setExpiresAt(event.target.value); resetRun(); }} /></label>
          <p>CSV platform and expiration values override these defaults for that row.</p>
        </div>

        <div className="aipa-bulk-preview" aria-live="polite">
          <div className="aipa-preview-count"><strong>{parsed.invites.length}</strong><span>ready to approve</span></div>
          <div className="aipa-preview-meta">
            <span>{parsed.duplicateEmails.length} duplicate{parsed.duplicateEmails.length === 1 ? "" : "s"} skipped</span>
            <span>{parsed.issues.length} invalid row{parsed.issues.length === 1 ? "" : "s"} skipped</span>
          </div>

          {preview.length > 0 && (
            <div className="aipa-preview-list">
              {preview.map((invite) => <span key={invite.email}>{invite.fullName || invite.email}<small>{invite.fullName ? invite.email : platformName(invite.platform)}</small></span>)}
              {parsed.invites.length > preview.length && <span className="aipa-preview-more">+{parsed.invites.length - preview.length} more</span>}
            </div>
          )}

          {parsed.issues.length > 0 && (
            <details className="aipa-bulk-issues">
              <summary>Review skipped rows</summary>
              {parsed.issues.slice(0, 8).map((item, index) => <p key={`${item.sourceLine}:${index}`}>Line {item.sourceLine}: {item.message} <small>{item.value}</small></p>)}
              {parsed.issues.length > 8 && <p>{parsed.issues.length - 8} additional rows were skipped.</p>}
            </details>
          )}
          {parsed.overflowCount > 0 && <p className="aipa-inline-error">This run is limited to 100 unique emails. {parsed.overflowCount} additional address{parsed.overflowCount === 1 ? "" : "es"} will not be included.</p>}

          {granting ? (
            <div className="aipa-bulk-progress">
              <div><LoaderCircle className="aipa-spin" /><span>Granting {processed + 1} of {parsed.invites.length}<small>{currentEmail}</small></span></div>
              <button type="button" onClick={() => { stopRequestedRef.current = true; }}><Square size={13} /> Stop after current</button>
            </div>
          ) : (
            <button type="button" className="aipa-bulk-send" disabled={parsed.invites.length === 0} onClick={() => void grantSeats()}><KeyRound size={16} />{parsed.invites.length > 0 ? `Grant ${parsed.invites.length} seat${parsed.invites.length === 1 ? "" : "s"}` : "Add an attendee list"}</button>
          )}

          {outcomes.length > 0 && !granting && (
            <div className="aipa-bulk-results" role="status">
              <strong>{grantedCount} granted</strong><span>{failed.length} failed</span>
              {activationCredentials.length > 0 && (
                <button
                  type="button"
                  onClick={() => void navigator.clipboard.writeText(
                    activationCredentials.map((outcome) => `${outcome.email}: ${outcome.activationCode}`).join("\n"),
                  )}
                >
                  <Copy size={13} /> Copy {activationCredentials.length} new code{activationCredentials.length === 1 ? "" : "s"}
                </button>
              )}
              {outcomes.filter((outcome) => outcome.status === "granted").map((outcome) => (
                <p className="aipa-bulk-credential" key={outcome.email}>
                  {outcome.email}: {outcome.activationCode ?? "use existing password"}
                </p>
              ))}
              {failed.map((outcome) => <p key={outcome.email}>{outcome.email}: {outcome.error}</p>)}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

function grantBulkAccess(invite: AiInstallBulkInvite) {
  return grantAiInstallPortalAccess({
    email: invite.email,
    fullName: invite.fullName,
    platform: invite.platform,
    expiresAt: invite.expiresAt,
  });
}

function GrantAccessForm({ onGranted, onError }: {
  onGranted: (email: string, activationCode: string | null) => Promise<void>;
  onError: (message: string | null) => void;
}) {
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [platform, setPlatform] = useState<AiInstallPortalPlatform>("codex");
  const [expiresAt, setExpiresAt] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setSubmitting(true);
    onError(null);
    try {
      const result = await grantAiInstallPortalAccess({ email, fullName, platform, expiresAt: expiresAt || null });
      const grantedEmail = email.trim();
      setEmail(""); setFullName(""); setExpiresAt("");
      await onGranted(grantedEmail, result.activation_code);
    } catch (grantError) {
      onError(grantError instanceof Error ? grantError.message : "Could not grant access.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="aipa-grant">
      <div className="aipa-grant-intro"><UserPlus size={24} /><div><p>Grant a seat</p><h2>Approve attendee access</h2></div></div>
      <form onSubmit={submit}>
        <label><span>Email address</span><input type="email" required autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="owner@agency.com" /></label>
        <label><span>Name</span><input type="text" autoComplete="name" value={fullName} onChange={(event) => setFullName(event.target.value)} placeholder="Optional" /></label>
        <label><span>Platform</span><select value={platform} onChange={(event) => setPlatform(event.target.value as AiInstallPortalPlatform)}><option value="codex">Codex</option><option value="claude">Claude</option><option value="both">Claude + Codex</option></select></label>
        <label><span>Expires</span><input type="datetime-local" value={expiresAt} onChange={(event) => setExpiresAt(event.target.value)} /></label>
        <button type="submit" disabled={submitting}>{submitting ? <LoaderCircle className="aipa-spin" /> : <KeyRound size={16} />}{submitting ? "Granting" : "Grant seat"}</button>
      </form>
    </section>
  );
}

function ProgressCell({ value, complete }: { value: number; complete: boolean }) {
  const progress = complete ? 100 : Math.round(value);
  return <div className="aipa-progress-cell"><strong>{progress}%</strong><span><i style={{ width: `${progress}%` }} /></span></div>;
}

function platformName(platform: AiInstallPortalPlatform) {
  if (platform === "both") return "Claude + Codex";
  return platform === "claude" ? "Claude" : "Codex";
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric", hour: "numeric", minute: "2-digit" }).format(new Date(value));
}
