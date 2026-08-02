import { useEffect, useState, type FormEvent } from "react";

import standardLogo from "@/assets/standard-word-logo.png";
import playbookIcon from "@/assets/sp-icon-black.png";
import { supabase } from "@/integrations/supabase/client";

// The READY page hangs off /aiinstall, so it inherits that page's tokens and
// base styles verbatim rather than restating them. Only form-specific rules
// live in the second sheet.
import "./AIInstall.css";
import "./AIInstallReady.css";

const PAGE_TITLE = "Confirm Your Pre-work | The Agency AI Install";
const PAGE_DESCRIPTION =
  "Confirm your AI Install pre-work is done. First name, last name, email, your platform, and one screenshot. Deadline: end of day Monday, August 24.";
const PAGE_URL = "https://standardplaybook.com/aiinstall/ready";
const DEADLINE = "End of day Monday, August 24";
const MAX_BYTES = 10 * 1024 * 1024;
const SUBMIT_TIMEOUT_MS = 30_000;

class TimeoutError extends Error {}

/** Resolves the promise, or rejects with TimeoutError once the deadline passes. */
function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    const timer = setTimeout(() => reject(new TimeoutError()), ms);
    promise.then(
      (value) => {
        clearTimeout(timer);
        resolve(value);
      },
      (error) => {
        clearTimeout(timer);
        reject(error);
      },
    );
  });
}

function setMetaTag(name: string, content: string, attribute: "name" | "property" = "name") {
  let element = document.querySelector(`meta[${attribute}="${name}"]`) as HTMLMetaElement | null;

  if (!element) {
    element = document.createElement("meta");
    element.setAttribute(attribute, name);
    document.head.appendChild(element);
  }

  element.content = content;
}

type Platform = "claude" | "codex";

export default function AIInstallReady() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [platform, setPlatform] = useState<Platform | "">("");
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<"idle" | "sending" | "done">("idle");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    document.title = PAGE_TITLE;
    setMetaTag("description", PAGE_DESCRIPTION);
    // A private confirmation form has no business in search results.
    setMetaTag("robots", "noindex, nofollow");
    setMetaTag("theme-color", "#F4F2EE");
    setMetaTag("og:title", PAGE_TITLE, "property");
    setMetaTag("og:description", PAGE_DESCRIPTION, "property");
    setMetaTag("og:url", PAGE_URL, "property");
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (status === "sending") return;

    setError(null);

    if (!firstName.trim()) return setError("Enter your first name.");
    if (!lastName.trim()) return setError("Enter your last name.");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim())) {
      return setError("Enter a valid email address.");
    }
    if (!platform) return setError("Choose Claude or Codex.");
    if (!file) return setError("Attach a screenshot of your completed pre-work.");
    if (file.size > MAX_BYTES) {
      return setError("That image is over 10 MB. Please attach a smaller one.");
    }

    setStatus("sending");

    const body = new FormData();
    body.append("first_name", firstName.trim());
    body.append("last_name", lastName.trim());
    body.append("email", email.trim());
    body.append("platform", platform);
    body.append("screenshot", file);

    try {
      // supabase-js does not expose an abort signal on functions.invoke, and a
      // request that never settles leaves the button stuck on "Sending" with
      // no way to retry. This audience is on phones and hotel wifi, so the
      // call is raced against a deadline and the UI always recovers.
      const { data, error: invokeError } = await withTimeout(
        supabase.functions.invoke("submit-ai-install-ready", { body }),
        SUBMIT_TIMEOUT_MS,
      );

      if (invokeError || (data && (data as { error?: string }).error)) {
        setStatus("idle");
        setError(
          (data as { error?: string } | null)?.error ??
            "We could not save that. Please try again.",
        );
        return;
      }

      setStatus("done");
    } catch (thrown) {
      setStatus("idle");
      setError(
        thrown instanceof TimeoutError
          ? "That took too long. Check your connection and send it again. If you already saw a confirmation, you are set."
          : "We could not reach the server. Please try again.",
      );
    }
  }

  return (
    <div className="aii-page air-page">
      <a className="aii-skip-link" href="#air-main">
        Skip to content
      </a>

      <header className="air-nav">
        <div className="aii-shell air-nav__inner">
          <a href="/" aria-label="Standard Playbook home">
            <img className="aii-wordmark" src={standardLogo} alt="STANDARD" />
          </a>
          <a className="air-nav__back" href="/aiinstall">
            The Agency AI Install
          </a>
        </div>
      </header>

      <main className="aii-shell air-main" id="air-main">
        {status === "done" ? (
          <section className="air-done" aria-live="polite">
            <p className="air-eyebrow">Pre-work received</p>
            <h1 className="air-title">
              Got it. Mary confirms every<span>&nbsp;</span>seat personally and will reply to you.
            </h1>
            <p className="air-lede">
              Nothing else to do right now. If anything is missing from your setup, Mary will
              email you before the room opens.
            </p>
            <div className="air-deadline air-deadline--done">
              <span className="air-deadline__label">Deadline</span>
              <span className="air-deadline__value">{DEADLINE}</span>
            </div>
            <a className="aii-cta air-done__cta" href="/aiinstall">
              Back to the workshop page
            </a>
          </section>
        ) : (
          <>
            <section className="air-intro">
              <p className="air-eyebrow">The Agency AI Install</p>
              <h1 className="air-title">
                Confirm your<span> pre-work</span>
              </h1>
              <p className="air-lede">
                No pre-work, no seat. Build time is build time. Send this once your subscription
                is live, the app is installed, and your folder is created.
              </p>
              <div className="air-deadline">
                <span className="air-deadline__label">Deadline</span>
                <span className="air-deadline__value">{DEADLINE}</span>
              </div>
            </section>

            <form className="air-form" onSubmit={handleSubmit} noValidate>
              <div className="air-row">
                <label className="air-field">
                  <span className="air-label">First name</span>
                  <input
                    className="air-input"
                    type="text"
                    name="first_name"
                    autoComplete="given-name"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    required
                  />
                </label>

                <label className="air-field">
                  <span className="air-label">Last name</span>
                  <input
                    className="air-input"
                    type="text"
                    name="last_name"
                    autoComplete="family-name"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    required
                  />
                </label>
              </div>

              <label className="air-field">
                <span className="air-label">Email</span>
                <input
                  className="air-input"
                  type="email"
                  name="email"
                  autoComplete="email"
                  inputMode="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </label>

              <fieldset className="air-fieldset">
                <legend className="air-label">Platform</legend>
                <div className="air-choices">
                  {(["claude", "codex"] as Platform[]).map((value) => (
                    <label
                      key={value}
                      className={`air-choice${platform === value ? " air-choice--on" : ""}`}
                    >
                      <input
                        type="radio"
                        name="platform"
                        value={value}
                        checked={platform === value}
                        onChange={() => setPlatform(value)}
                        required
                      />
                      <span>{value === "claude" ? "Claude" : "Codex"}</span>
                    </label>
                  ))}
                </div>
              </fieldset>

              <div className="air-field">
                <span className="air-label">Screenshot of your completed pre-work</span>
                <input
                  className="air-file"
                  type="file"
                  name="screenshot"
                  accept="image/*"
                  onChange={(e) => setFile(e.target.files?.[0] ?? null)}
                  required
                />
                <p className="air-hint">
                  {file ? file.name : "PNG, JPG, WEBP or HEIC. Up to 10 MB."}
                </p>
              </div>

              {error && (
                <p className="air-error" role="alert">
                  {error}
                </p>
              )}

              <button className="aii-cta air-submit" type="submit" disabled={status === "sending"}>
                {status === "sending" ? "Sending" : "Confirm my pre-work"}
              </button>
            </form>
          </>
        )}
      </main>

      <footer className="air-footer">
        <div className="aii-shell air-footer__inner">
          <img className="air-footer__mark" src={playbookIcon} alt="" aria-hidden="true" />
          <p>Standard Playbook</p>
        </div>
      </footer>
    </div>
  );
}
