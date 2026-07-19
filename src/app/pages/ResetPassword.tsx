import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import standardLogo from "@/assets/standard-word-logo.png";
import PasswordField from "@/app/components/auth/PasswordField";
import "@/app/app.css";
import { getStoredSpTheme } from "@/app/lib/theme";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";

const MIN_PASSWORD_LENGTH = 8;

function getLinkError(): string | null {
  const search = new URLSearchParams(window.location.search);
  const hash = new URLSearchParams(window.location.hash.replace(/^#/, ""));
  const description = search.get("error_description") ?? hash.get("error_description");
  return description ? description.replace(/\+/g, " ") : null;
}

export default function ResetPassword() {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [checkingLink, setCheckingLink] = useState(true);
  const [hasSession, setHasSession] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [complete, setComplete] = useState(false);
  const [error, setError] = useState<string | null>(getLinkError);

  useEffect(() => {
    document.title = "Choose a New Password — Standard Playbook";
    let active = true;

    const initializeRecovery = async () => {
      const params = new URLSearchParams(window.location.search);
      const tokenHash = params.get("token_hash");
      const recoveryType = params.get("type");

      if (tokenHash && recoveryType === "recovery") {
        const { data, error: verifyError } = await supabase.auth.verifyOtp({
          token_hash: tokenHash,
          type: "recovery",
        });
        if (!active) return;
        if (verifyError || !data.session) {
          setError("This reset link is invalid or has expired. Request a fresh link to continue.");
          setHasSession(false);
        } else {
          window.history.replaceState({}, "", "/reset-password");
          setHasSession(true);
          setError(null);
        }
        setCheckingLink(false);
        return;
      }

      const { data, error: sessionError } = await supabase.auth.getSession();
      if (!active) return;
      setHasSession(Boolean(data.session));
      if (sessionError) setError(sessionError.message);
      setCheckingLink(false);
    };

    void initializeRecovery();

    const { data: listener } = supabase.auth.onAuthStateChange((event, session) => {
      if (!active) return;
      if (event === "PASSWORD_RECOVERY" || session) {
        setHasSession(Boolean(session));
        setCheckingLink(false);
      }
    });

    return () => {
      active = false;
      listener.subscription.unsubscribe();
    };
  }, []);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);

    if (password.length < MIN_PASSWORD_LENGTH) {
      setError(`Use at least ${MIN_PASSWORD_LENGTH} characters.`);
      return;
    }
    if (password !== confirmation) {
      setError("The passwords do not match.");
      return;
    }

    setSubmitting(true);
    try {
      const { error: updateError } = await supabase.auth.updateUser({ password });
      if (updateError) {
        setError(updateError.message);
        return;
      }
      setComplete(true);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className={cn("member-app flex min-h-screen w-full items-center justify-center overflow-x-hidden px-6 py-10", getStoredSpTheme() === "dark" && "dark")}>
      <div className="sp-auth-panel w-full max-w-md">
        <div className="mb-10">
          <img src={standardLogo} alt="Standard Playbook" className="mb-6 h-6 w-auto invert dark:invert-0" />
          <h1 className="sp-display text-[clamp(48px,9vw,84px)] text-foreground">
            {complete ? "Password" : "Choose New"}
            <br />
            {complete ? "Updated" : "Password"}
          </h1>
          <p className="sp-label mt-4 max-w-sm text-[10px] leading-relaxed text-foreground/60">
            {complete
              ? "Your new password is ready. Continue into your Standard Playbook."
              : "Use at least eight characters. A longer, unique password is strongest."}
          </p>
        </div>

        {checkingLink ? (
          <p className="sp-label text-[11px] text-foreground/65" role="status">Verifying secure link…</p>
        ) : complete ? (
          <button type="button" className="sp-btn-ink w-full" onClick={() => navigate("/app", { replace: true })}>
            Continue to app
          </button>
        ) : !hasSession ? (
          <div className="space-y-5">
            <p role="alert" className="border-[1.5px] border-foreground bg-card p-4 font-[Inter] text-sm leading-relaxed text-foreground/75">
              {error ?? "This reset link is invalid or has expired. Request a fresh link to continue."}
            </p>
            <button type="button" className="sp-btn-ink w-full" onClick={() => navigate("/login?reset=1", { replace: true })}>
              Request new link
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <PasswordField id="new-password" label="New password" autoComplete="new-password" value={password} onChange={setPassword} minLength={MIN_PASSWORD_LENGTH} required />
            <PasswordField id="confirm-password" label="Confirm new password" autoComplete="new-password" value={confirmation} onChange={setConfirmation} minLength={MIN_PASSWORD_LENGTH} required />
            {error && <p role="alert" className="sp-label text-[11px] text-[#2997FF]">{error}</p>}
            <button type="submit" className="sp-btn-ink w-full" disabled={submitting}>
              {submitting ? "Updating password…" : "Update password"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
