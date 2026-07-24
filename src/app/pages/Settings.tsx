import { useEffect, useState } from "react";
import { App } from "@capacitor/app";
import {
  ExternalLink,
  Info,
  LifeBuoy,
  Mail,
  ShieldCheck,
  Trash2,
} from "lucide-react";
import { isNativePlatform } from "@/mobile/nativePlatform";

type NativeAppInfo = {
  version: string;
  build: string;
};

const supportLinks = [
  {
    href: "mailto:info@standardplaybook.com?subject=Standard%20Playbook%20app%20support",
    label: "Email app support",
    detail: "info@standardplaybook.com",
    icon: Mail,
  },
  {
    href: "https://standardplaybook.com/privacy",
    label: "Privacy Policy",
    detail: "How Standard Playbook handles your information",
    icon: ShieldCheck,
  },
  {
    href: "https://standardplaybook.com/data-deletion",
    label: "Account & data deletion",
    detail: "Request deletion of your account and associated data",
    icon: Trash2,
  },
];

export default function Settings() {
  const [appInfo, setAppInfo] = useState<NativeAppInfo | null>(null);

  useEffect(() => {
    if (!isNativePlatform()) return;
    void App.getInfo().then(({ version, build }) => {
      setAppInfo({ version, build });
    });
  }, []);

  return (
    <div className="space-y-8 pb-10">
      <header className="border-b-[1.5px] border-foreground pb-5">
        <p className="sp-label text-[10px] text-[#2997FF]">Account</p>
        <h1 className="sp-display mt-2 text-[clamp(42px,8vw,76px)] text-foreground">
          Settings &amp; Support
        </h1>
        <p className="mt-4 max-w-2xl text-sm leading-6 text-foreground/65 sm:text-base">
          Standard Playbook is a login-only companion for existing coaching
          members. Use the options below for help or privacy requests.
        </p>
      </header>

      <section aria-labelledby="support-heading">
        <h2
          id="support-heading"
          className="sp-label mb-3 text-[10px] text-foreground/50"
        >
          Support &amp; privacy
        </h2>
        <div className="border-[1.5px] border-foreground bg-card">
          {supportLinks.map(({ href, label, detail, icon: Icon }, index) => (
            <a
              key={href}
              href={href}
              className="group flex min-h-20 items-center gap-4 border-foreground px-4 py-4 transition-colors hover:bg-foreground hover:text-background sm:px-5 [&:not(:last-child)]:border-b"
            >
              <span className="flex h-10 w-10 shrink-0 items-center justify-center border border-current">
                <Icon className="h-4 w-4" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-sm font-bold uppercase tracking-[0.06em]">
                  {label}
                </span>
                <span className="mt-1 block text-xs leading-5 opacity-60">
                  {detail}
                </span>
              </span>
              {index === 0 ? (
                <Mail className="h-4 w-4 shrink-0 opacity-50" />
              ) : (
                <ExternalLink className="h-4 w-4 shrink-0 opacity-50" />
              )}
            </a>
          ))}
        </div>
      </section>

      <section
        aria-labelledby="about-heading"
        className="border-[1.5px] border-foreground p-5"
      >
        <div className="flex items-start gap-4">
          <Info className="mt-0.5 h-5 w-5 shrink-0 text-[#2997FF]" />
          <div>
            <h2
              id="about-heading"
              className="sp-label text-[10px] text-foreground/50"
            >
              About this app
            </h2>
            <p className="mt-2 text-sm font-semibold text-foreground">
              Standard Playbook
              {appInfo ? ` ${appInfo.version} (${appInfo.build})` : ""}
            </p>
            <p className="mt-2 text-xs leading-5 text-foreground/60">
              When contacting support, include the app version shown here and a
              brief description of what happened. Never send your password.
            </p>
          </div>
        </div>
      </section>

      <div className="flex items-center gap-2 text-xs text-foreground/45">
        <LifeBuoy className="h-4 w-4" />
        <span>Standard Playbook INC · standardplaybook.com</span>
      </div>
    </div>
  );
}
