import { createRoot } from 'react-dom/client'

const root = createRoot(document.getElementById("root")!);
const pathname = window.location.pathname.replace(/\/+$/, "") || "/";

if (pathname === "/aiinstall") {
  import("./pages/AIInstall.tsx").then(({ default: AIInstall }) => {
    root.render(<AIInstall />);
  });
} else if (pathname === "/aiinstall/prework/claude" || pathname === "/aiinstall/prework/codex") {
  import("./pages/AIInstallPrework.tsx").then(({ default: AIInstallPrework }) => {
    const platform = pathname.endsWith("/claude") ? "claude" : "codex";
    root.render(<AIInstallPrework platform={platform} />);
  });
} else {
  Promise.all([
    import("./App.tsx"),
    import("./index.css"),
    import("./pwa.ts"),
  ]).then(([{ default: App }, , { initializeInstalledWebApp }]) => {
    initializeInstalledWebApp();
    root.render(<App />);
  });
}
