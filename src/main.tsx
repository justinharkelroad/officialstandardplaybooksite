import { createRoot } from 'react-dom/client'

const root = createRoot(document.getElementById("root")!);
const pathname = window.location.pathname.replace(/\/+$/, "") || "/";

if (pathname === "/aiinstall") {
  import("./pages/AIInstall.tsx").then(({ default: AIInstall }) => {
    root.render(<AIInstall />);
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
