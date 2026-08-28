import {
  Check,
  Eye,
  FileUp,
  Link2,
  ListPlus,
  LoaderCircle,
  LockKeyhole,
  Mail,
  RefreshCcw,
  Send,
  ShieldOff,
  Square,
  UserPlus,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState, type ChangeEvent, type FormEvent } from "react";

import { MemberAuthProvider, useAuth } from "@/app/lib/auth";
import {
  parseAiInstallBulkInvites,
  type AiInstallBulkInvite,
} from "@/lib/aiInstallBulkInvites";
import {
  grantAiInstallPortalAccess,
  loadAiInstallPortalAdminRows,
  resendAiInstallPortalLink,
  setAiInstallPortalAccessActive,
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
  const [filter, setFilter] = useState<"all" | "active" | "revoked">("all");

  const refresh = useCallback(async () => {
    setError(null);
    try {
      setRows(await loadAiInstallPortalAdminRows());
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
  const readyCount = (rows ?? []).filter((row) => row.ready_submitted_at).length;

  const mutate = async (row: AiInstallPortalAdminRow, action: "toggle" | "resend") => {
    setBusyId(`${row.id}:${action}`);
    setError(null);
    setNotice(null);
    try {
      if (action === "toggle") {
        await setAiInstallPortalAccessActive(row.id, !row.is_active);
        setNotice(`${row.email} ${row.is_active ? "revoked" : "reactivated"}.`);
      } else {
        const result = await resendAiInstallPortalLink(row.id);
        if (result.magic_link?.status === "sent") setNotice(`A fresh link was sent to ${row.email}.`);
        else throw new Error(result.magic_link?.error ?? "The sign-in link was not sent.");
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
          <div><span>Ready confirmed</span><strong>{readyCount}</strong></div>
        </section>

        <GrantAccessForm
          onGranted={async (message) => {
            setNotice(message);
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
            <div><p>Attendee ledger</p><h2>Email access and engagement</h2></div>
            <div className="aipa-filters">
              {(["all", "active", "revoked"] as const).map((value) => (
                <button type="button" key={value} className={filter === value ? "is-active" : ""} onClick={() => setFilter(value)}>{value}</button>
              ))}
              <button type="button" onClick={() => void refresh()} aria-label="Refresh access list"><RefreshCcw size={15} /></button>
            </div>
          </div>

          {notice && <p className="aipa-notice" role="status"><Check size={16} />{notice}</p>}
          {error && <p className="aipa-error" role="alert">{error}</p>}

          {rows === null ? (
            <div className="aipa-empty"><LoaderCircle className="aipa-spin" /><p>Loading attendees.</p></div>
          ) : visible.length === 0 ? (
            <div className="aipa-empty"><p>No access records match this view.</p></div>
          ) : (
            <div className="aipa-table-wrap">
              <table className="aipa-table">
                <thead><tr><th>Attendee</th><th>Access</th><th>Activity</th><th>Day 1</th><th>Day 2</th><th>Files</th><th>Ready</th><th><span className="sr-only">Actions</span></th></tr></thead>
                <tbody>
                  {visible.map((row) => (
                    <tr key={row.id} className={!row.is_active ? "is-revoked" : ""}>
                      <td><strong>{row.full_name || "Name not added"}</strong><a href={`mailto:${row.email}`}>{row.email}</a></td>
                      <td><span className={`aipa-status ${row.is_active ? "is-on" : "is-off"}`}>{row.is_active ? "Active" : "Revoked"}</span><small>{platformName(row.platform)}</small></td>
                      <td><strong>{row.first_login_at ? `${row.login_count} visit${row.login_count === 1 ? "" : "s"}` : "Never opened"}</strong><small>{row.last_login_at ? formatDate(row.last_login_at) : linkDelivery(row)}</small></td>
                      <td><ProgressCell value={row.progress["day-1"]?.max_progress ?? 0} complete={Boolean(row.progress["day-1"]?.completed_at)} /></td>
                      <td><ProgressCell value={row.progress["day-2"]?.max_progress ?? 0} complete={Boolean(row.progress["day-2"]?.completed_at)} /></td>
                      <td><strong>{row.downloads.count}</strong><small>{row.downloads.last_at ? formatDate(row.downloads.last_at) : "No downloads"}</small></td>
                      <td>{row.ready_submitted_at ? <span className="aipa-ready"><Check size={14} />Yes</span> : <span className="aipa-muted">No</span>}</td>
                      <td>
                        <div className="aipa-row-actions">
                          <button type="button" disabled={!row.is_active || busyId !== null} onClick={() => void mutate(row, "resend")} title="Resend sign-in link"><Mail size={15} />{busyId === `${row.id}:resend` ? "Sending" : "Resend"}</button>
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

interface BulkInviteOutcome {
  email: string;
  status: "sent" | "failed";
  error?: string;
}

function BulkInviteForm({ onCompleted }: { onCompleted: (message: string) => Promise<void> }) {
  const [source, setSource] = useState("");
  const [fileName, setFileName] = useState<string | null>(null);
  const [platform, setPlatform] = useState<AiInstallPortalPlatform>("codex");
  const [expiresAt, setExpiresAt] = useState("");
  const [sending, setSending] = useState(false);
  const [processed, setProcessed] = useState(0);
  const [currentEmail, setCurrentEmail] = useState<string | null>(null);
  const [outcomes, setOutcomes] = useState<BulkInviteOutcome[]>([]);
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

  const sendInvites = async () => {
    if (parsed.invites.length === 0 || sending) return;
    stopRequestedRef.current = false;
    setSending(true);
    setProcessed(0);
    setCurrentEmail(null);
    setOutcomes([]);

    const nextOutcomes: BulkInviteOutcome[] = [];
    for (const invite of parsed.invites) {
      if (stopRequestedRef.current) break;
      setCurrentEmail(invite.email);
      let outcome: BulkInviteOutcome;
      try {
        const result = await sendBulkInvite(invite);
        if (result.magic_link?.status !== "sent") {
          throw new Error(result.magic_link?.error ?? "The sign-in link was not sent.");
        }
        outcome = { email: invite.email, status: "sent" };
      } catch (sendError) {
        outcome = {
          email: invite.email,
          status: "failed",
          error: sendError instanceof Error ? sendError.message : "Invite failed.",
        };
      }
      nextOutcomes.push(outcome);
      setOutcomes([...nextOutcomes]);
      setProcessed(nextOutcomes.length);
    }

    setCurrentEmail(null);
    setSending(false);
    const sentCount = nextOutcomes.filter((outcome) => outcome.status === "sent").length;
    const failedCount = nextOutcomes.length - sentCount;
    const stopped = nextOutcomes.length < parsed.invites.length;
    await onCompleted(
      stopped
        ? `Bulk invite stopped: ${sentCount} sent and ${failedCount} failed.`
        : `Bulk invite complete: ${sentCount} sent and ${failedCount} failed.`,
    );
  };

  const sentCount = outcomes.filter((outcome) => outcome.status === "sent").length;
  const failed = outcomes.filter((outcome) => outcome.status === "failed");
  const preview = parsed.invites.slice(0, 5);

  return (
    <section className="aipa-bulk" aria-labelledby="bulk-invite-title">
      <div className="aipa-bulk-head">
        <div className="aipa-bulk-title">
          <ListPlus size={24} />
          <div><p>Bulk access</p><h2 id="bulk-invite-title">Invite an email list</h2></div>
        </div>
        <p className="aipa-bulk-help">Paste addresses or upload a CSV. Nothing sends until you confirm the preview.</p>
      </div>

      <div className="aipa-bulk-grid">
        <div className="aipa-bulk-source">
          <label htmlFor="bulk-invite-source">Email list or CSV content</label>
          <textarea
            id="bulk-invite-source"
            value={source}
            disabled={sending}
            onChange={(event) => changeSource(event.target.value)}
            placeholder={"alex@agency.com\nJordan Lee <jordan@agency.com>\nowner@thirdagency.com"}
          />
          <div className="aipa-bulk-file-row">
            <label className="aipa-file-button" htmlFor="bulk-invite-file"><FileUp size={15} /> Upload CSV<input ref={fileInputRef} id="bulk-invite-file" type="file" accept=".csv,text/csv" disabled={sending} onChange={(event) => void uploadCsv(event)} /></label>
            <span>{fileName ?? "CSV columns: email, name, platform, expires"}</span>
            {source && <button type="button" disabled={sending} onClick={clear}>Clear</button>}
          </div>
          {fileError && <p className="aipa-inline-error" role="alert">{fileError}</p>}
        </div>

        <div className="aipa-bulk-settings">
          <label><span>Default platform</span><select value={platform} disabled={sending} onChange={(event) => { setPlatform(event.target.value as AiInstallPortalPlatform); resetRun(); }}><option value="codex">Codex</option><option value="claude">Claude</option><option value="both">Claude + Codex</option></select></label>
          <label><span>Default expiration</span><input type="datetime-local" value={expiresAt} disabled={sending} onChange={(event) => { setExpiresAt(event.target.value); resetRun(); }} /></label>
          <p>CSV platform and expiration values override these defaults for that row.</p>
        </div>

        <div className="aipa-bulk-preview" aria-live="polite">
          <div className="aipa-preview-count"><strong>{parsed.invites.length}</strong><span>ready to invite</span></div>
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
          {parsed.overflowCount > 0 && <p className="aipa-inline-error">This run is limited to 100 unique emails. {parsed.overflowCount} additional address{parsed.overflowCount === 1 ? "" : "es"} will not send.</p>}

          {sending ? (
            <div className="aipa-bulk-progress">
              <div><LoaderCircle className="aipa-spin" /><span>Sending {processed + 1} of {parsed.invites.length}<small>{currentEmail}</small></span></div>
              <button type="button" onClick={() => { stopRequestedRef.current = true; }}><Square size={13} /> Stop after current</button>
            </div>
          ) : (
            <button type="button" className="aipa-bulk-send" disabled={parsed.invites.length === 0} onClick={() => void sendInvites()}><Send size={16} />{parsed.invites.length > 0 ? `Send ${parsed.invites.length} invite${parsed.invites.length === 1 ? "" : "s"}` : "Add an email list"}</button>
          )}

          {outcomes.length > 0 && !sending && (
            <div className="aipa-bulk-results" role="status">
              <strong>{sentCount} sent</strong><span>{failed.length} failed</span>
              {failed.map((outcome) => <p key={outcome.email}>{outcome.email}: {outcome.error}</p>)}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

function sendBulkInvite(invite: AiInstallBulkInvite) {
  return grantAiInstallPortalAccess({
    email: invite.email,
    fullName: invite.fullName,
    platform: invite.platform,
    expiresAt: invite.expiresAt,
  });
}

function GrantAccessForm({ onGranted, onError }: { onGranted: (message: string) => Promise<void>; onError: (message: string | null) => void }) {
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
      if (result.magic_link?.status !== "sent") throw new Error(result.magic_link?.error ?? "Access was created, but the email was not sent.");
      const grantedEmail = email.trim();
      setEmail(""); setFullName(""); setExpiresAt("");
      await onGranted(`Access granted and sign-in link sent to ${grantedEmail}.`);
    } catch (grantError) {
      onError(grantError instanceof Error ? grantError.message : "Could not grant access.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="aipa-grant">
      <div className="aipa-grant-intro"><UserPlus size={24} /><div><p>Grant a seat</p><h2>Add email access</h2></div></div>
      <form onSubmit={submit}>
        <label><span>Email address</span><input type="email" required autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="owner@agency.com" /></label>
        <label><span>Name</span><input type="text" autoComplete="name" value={fullName} onChange={(event) => setFullName(event.target.value)} placeholder="Optional" /></label>
        <label><span>Platform</span><select value={platform} onChange={(event) => setPlatform(event.target.value as AiInstallPortalPlatform)}><option value="codex">Codex</option><option value="claude">Claude</option><option value="both">Claude + Codex</option></select></label>
        <label><span>Expires</span><input type="datetime-local" value={expiresAt} onChange={(event) => setExpiresAt(event.target.value)} /></label>
        <button type="submit" disabled={submitting}>{submitting ? <LoaderCircle className="aipa-spin" /> : <Mail size={16} />}{submitting ? "Granting" : "Grant + email link"}</button>
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

function linkDelivery(row: AiInstallPortalAdminRow) {
  if (row.last_magic_link_error) return "Last email failed";
  if (row.last_magic_link_sent_at) return `Link sent ${formatDate(row.last_magic_link_sent_at)}`;
  return "No link sent";
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric", hour: "numeric", minute: "2-digit" }).format(new Date(value));
}
