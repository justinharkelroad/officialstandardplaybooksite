import {
  Check,
  Eye,
  Link2,
  LoaderCircle,
  LockKeyhole,
  Mail,
  RefreshCcw,
  ShieldOff,
  UserPlus,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useState, type FormEvent } from "react";

import { MemberAuthProvider, useAuth } from "@/app/lib/auth";
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
