import { useCallback, useEffect, useState } from "react";

import { MemberAuthProvider, useAuth } from "@/app/lib/auth";
import { supabase } from "@/integrations/supabase/client";

import "./AIInstall.css";
import "./AIInstallReady.css";
import "./AIInstallReadyList.css";

interface ReadyRow {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  platform: "claude" | "codex";
  screenshot_path: string;
  submitted_at: string;
  notify_error: string | null;
}

/**
 * Admin view of READY submissions.
 *
 * The route sits under /aiinstall so the URL reads the way Justin specified,
 * but the gate is the member app's existing one: MemberAuthProvider plus the
 * is_admin flag, backed by the same is_admin_member() policy that guards the
 * table itself. There is no second auth system here.
 */
export default function AIInstallReadyList() {
  return (
    <MemberAuthProvider>
      <ReadyListGate />
    </MemberAuthProvider>
  );
}

function ReadyListGate() {
  const { loading, member, isAdmin } = useAuth();

  if (loading) {
    return (
      <Frame>
        <p className="air-lede">Checking access.</p>
      </Frame>
    );
  }

  if (!member) {
    return (
      <Frame>
        <h1 className="air-title">Sign in</h1>
        <p className="air-lede">This list is for Standard Playbook admins.</p>
        <a className="aii-cta" href="/login">
          Go to login
        </a>
      </Frame>
    );
  }

  if (!isAdmin) {
    return (
      <Frame>
        <h1 className="air-title">No access</h1>
        <p className="air-lede">
          Your account is signed in but is not an admin. Ask Justin to enable it.
        </p>
      </Frame>
    );
  }

  return <ReadyList />;
}

function ReadyList() {
  const [rows, setRows] = useState<ReadyRow[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<"all" | "claude" | "codex">("all");

  useEffect(() => {
    let cancelled = false;

    (async () => {
      const { data, error: readError } = await supabase
        .from("ai_install_ready_submissions")
        .select("id, first_name, last_name, email, platform, screenshot_path, submitted_at, notify_error")
        .order("submitted_at", { ascending: false });

      if (cancelled) return;
      if (readError) {
        setError(readError.message);
        setRows([]);
        return;
      }
      setRows((data ?? []) as ReadyRow[]);
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  // The bucket is private, so a link is minted on demand rather than stored.
  const openScreenshot = useCallback(async (path: string) => {
    const { data, error: signError } = await supabase.storage
      .from("ai-install-ready")
      .createSignedUrl(path, 60 * 10);

    if (signError || !data?.signedUrl) {
      setError(signError?.message ?? "Could not open that screenshot.");
      return;
    }
    window.open(data.signedUrl, "_blank", "noopener");
  }, []);

  const visible = (rows ?? []).filter((r) => filter === "all" || r.platform === filter);
  const claude = (rows ?? []).filter((r) => r.platform === "claude").length;
  const codex = (rows ?? []).filter((r) => r.platform === "codex").length;

  return (
    <Frame>
      <p className="air-eyebrow">The Agency AI Install</p>
      <h1 className="air-title">
        Pre-work<span> confirmed</span>
      </h1>

      <div className="arl-counts">
        <span className="arl-count">
          <strong>{rows ? rows.length : 0}</strong> total
        </span>
        <span className="arl-count">
          <strong>{claude}</strong> Claude
        </span>
        <span className="arl-count">
          <strong>{codex}</strong> Codex
        </span>
        <span className="arl-count arl-count--muted">
          <strong>{Math.max(0, 50 - (rows?.length ?? 0))}</strong> seats unconfirmed
        </span>
      </div>

      <div className="arl-filters">
        {(["all", "claude", "codex"] as const).map((value) => (
          <button
            key={value}
            type="button"
            className={`arl-filter${filter === value ? " arl-filter--on" : ""}`}
            onClick={() => setFilter(value)}
          >
            {value === "all" ? "All" : value === "claude" ? "Claude" : "Codex"}
          </button>
        ))}
      </div>

      {error && (
        <p className="air-error" role="alert">
          {error}
        </p>
      )}

      {rows === null ? (
        <p className="air-lede">Loading.</p>
      ) : visible.length === 0 ? (
        <p className="air-lede">No submissions yet.</p>
      ) : (
        <div className="arl-scroll">
          <table className="arl-table">
            <thead>
              <tr>
                <th scope="col">Submitted</th>
                <th scope="col">Name</th>
                <th scope="col">Email</th>
                <th scope="col">Platform</th>
                <th scope="col">Screenshot</th>
              </tr>
            </thead>
            <tbody>
              {visible.map((row) => (
                <tr key={row.id}>
                  <td className="arl-date">{formatDate(row.submitted_at)}</td>
                  <td>
                    {row.first_name} {row.last_name}
                    {row.notify_error && (
                      <span className="arl-flag" title={row.notify_error}>
                        email failed
                      </span>
                    )}
                  </td>
                  <td className="arl-email">
                    <a href={`mailto:${row.email}`}>{row.email}</a>
                  </td>
                  <td>
                    <span className={`arl-platform arl-platform--${row.platform}`}>
                      {row.platform === "claude" ? "Claude" : "Codex"}
                    </span>
                  </td>
                  <td>
                    <button
                      type="button"
                      className="arl-link"
                      onClick={() => openScreenshot(row.screenshot_path)}
                    >
                      Open
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Frame>
  );
}

function Frame({ children }: { children: React.ReactNode }) {
  return (
    <div className="aii-page air-page">
      <main className="aii-shell air-main">{children}</main>
    </div>
  );
}

function formatDate(value: string): string {
  try {
    return new Date(value).toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
      timeZone: "America/New_York",
    });
  } catch {
    return value;
  }
}
