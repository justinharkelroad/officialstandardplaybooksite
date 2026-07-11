import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import "@/app/app.css";
import { getStoredSpTheme } from "@/app/lib/theme";
import { cn } from "@/lib/utils";

const INACTIVE_MESSAGE = "Your access is inactive — contact Justin.";

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const busyRef = useRef(false);

  useEffect(() => {
    document.title = "Member Login — Standard Playbook";
  }, []);

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

  return (
    <div className={cn("member-app flex min-h-screen items-center justify-center px-6", getStoredSpTheme() === "dark" && "dark")}>
      <div className="w-full max-w-md">
        <div className="mb-10">
          <p className="sp-label mb-3 text-[11px] text-[#2997FF]">
            Standard Playbook · Member App
          </p>
          <h1 className="sp-display text-[clamp(48px,9vw,84px)] text-foreground">
            Member
            <br />
            Login
          </h1>
          <p className="sp-label mt-4 max-w-xs text-[10px] leading-relaxed text-foreground/60">
            Accounts are created by Justin. There is no self-signup.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
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
              className="w-full border-[1.5px] border-foreground bg-card px-4 py-3 font-[Inter] text-sm text-foreground outline-none transition-colors focus:border-[#2997FF]"
            />
          </div>
          <div>
            <label htmlFor="password" className="sp-label mb-1.5 block text-[10px] text-foreground/70">
              Password
            </label>
            <input
              id="password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full border-[1.5px] border-foreground bg-card px-4 py-3 font-[Inter] text-sm text-foreground outline-none transition-colors focus:border-[#2997FF]"
            />
          </div>
          {error && (
            <p role="alert" className="sp-label text-[11px] text-[#2997FF]">
              {error}
            </p>
          )}
          <button type="submit" className="sp-btn-ink w-full" disabled={submitting}>
            {submitting ? "Signing in…" : "Sign in"}
          </button>
        </form>
      </div>
    </div>
  );
}
