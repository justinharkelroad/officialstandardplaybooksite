import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import standardLogo from "@/assets/standard-word-logo.png";
import PasswordField from "@/app/components/auth/PasswordField";
import { supabase } from "@/integrations/supabase/client";
import "@/app/app.css";
import { getStoredSpTheme } from "@/app/lib/theme";
import { cn } from "@/lib/utils";

const INACTIVE_MESSAGE = "Your access is inactive — contact Justin.";
type LoginMode = "login" | "forgot" | "sent";

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mode, setMode] = useState<LoginMode>(() =>
    new URLSearchParams(window.location.search).get("reset") === "1" ? "forgot" : "login",
  );
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const busyRef = useRef(false);

  useEffect(() => {
    document.title = mode === "login"
      ? "Member Login — Standard Playbook"
      : "Reset Password — Standard Playbook";
  }, [mode]);

  const changeMode = (nextMode: LoginMode) => {
    setMode(nextMode);
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (busyRef.current) return;
    busyRef.current = true;
    setSubmitting(true);
    setError(null);

    try {
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });
      if (signInError || !data.session) {
        setError(signInError?.message ?? "Sign in failed");
        return;
      }

      // Membership + kill-switch check: no members row or inactive -> out.
      const { data: member } = await supabase
        .from("members")
        .select("id, is_active")
        .eq("id", data.session.user.id)
        .maybeSingle();

      if (!member || !member.is_active) {
        await supabase.auth.signOut();
        setError(INACTIVE_MESSAGE);
        return;
      }

      const from = (location.state as { from?: string } | null)?.from;
      navigate(from && from.startsWith("/app") ? from : "/app", { replace: true });
    } finally {
      busyRef.current = false;
      setSubmitting(false);
    }
  };

  const handleResetRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (busyRef.current) return;
    busyRef.current = true;
    setSubmitting(true);
    setError(null);

    try {
      const redirectTo = new URL("/reset-password", window.location.origin).toString();
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(email.trim(), {
        redirectTo,
      });

      if (resetError) {
        setError(resetError.message);
        return;
      }

      setMode("sent");
    } finally {
      busyRef.current = false;
      setSubmitting(false);
    }
  };

  return (
    <div className={cn("member-app flex min-h-screen w-full items-center justify-center overflow-x-hidden px-6 py-10", getStoredSpTheme() === "dark" && "dark")}>
      <div className="sp-auth-panel w-full max-w-md">
        <div className="mb-10">
          <img
            src={standardLogo}
            alt="Standard Playbook"
            className="mb-6 h-6 w-auto invert dark:invert-0"
          />
          <h1 className="sp-display text-[clamp(48px,9vw,84px)] text-foreground">
            {mode === "login" ? "Member" : mode === "sent" ? "Check Your" : "Reset"}
            <br />
            {mode === "login" ? "Login" : mode === "sent" ? "Email" : "Password"}
          </h1>
          <p className="sp-label mt-4 max-w-xs text-[10px] leading-relaxed text-foreground/60">
            {mode === "login"
              ? "Accounts are created by Justin. There is no self-signup."
              : mode === "sent"
                ? "If a member account matches that email, a secure reset link is on its way."
                : "Enter the email connected to your member account. We’ll send a secure reset link."}
          </p>
        </div>

        {mode === "sent" ? (
          <div className="space-y-4" aria-live="polite">
            <div className="border-[1.5px] border-foreground bg-card p-4">
              <p className="font-[Inter] text-sm leading-relaxed text-foreground/75">
                Check your inbox and spam folder. For your security, the link expires and can only be used to set a new password.
              </p>
            </div>
            <button type="button" className="sp-btn-ink w-full" onClick={() => changeMode("login")}>
              Back to sign in
            </button>
            <button
              type="button"
              className="sp-label min-h-11 w-full text-[10px] text-foreground/65 underline underline-offset-4 hover:text-foreground"
              onClick={() => changeMode("forgot")}
            >
              Send another link
            </button>
          </div>
        ) : (
        <form onSubmit={mode === "login" ? handleSubmit : handleResetRequest} className="space-y-5">
          <div>
            <label htmlFor="email" className="sp-label mb-1.5 block text-[10px] text-foreground/70">
              Email
            </label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full border-[1.5px] border-foreground bg-card px-4 py-3 font-[Inter] text-base text-foreground outline-none transition-colors focus:border-[#2997FF] sm:text-sm"
            />
          </div>
          {mode === "login" && (
            <>
            <PasswordField
              id="password"
              label="Password"
              autoComplete="current-password"
              value={password}
              onChange={setPassword}
              required
            />
            <button
              type="button"
              onClick={() => changeMode("forgot")}
              className="sp-label -mt-3 min-h-11 w-full text-right text-[10px] text-foreground/65 underline underline-offset-4 hover:text-foreground"
            >
              Forgot password?
            </button>
            </>
          )}
          {error && (
            <p role="alert" className="sp-label text-[11px] text-[#2997FF]">
              {error}
            </p>
          )}
          <button type="submit" className="sp-btn-ink w-full" disabled={submitting}>
            {submitting
              ? mode === "login" ? "Signing in…" : "Sending link…"
              : mode === "login" ? "Sign in" : "Send reset link"}
          </button>
          {mode === "forgot" && (
            <button
              type="button"
              onClick={() => changeMode("login")}
              className="sp-label min-h-11 w-full text-[10px] text-foreground/65 underline underline-offset-4 hover:text-foreground"
            >
              Back to sign in
            </button>
          )}
        </form>
        )}
      </div>
    </div>
  );
}
