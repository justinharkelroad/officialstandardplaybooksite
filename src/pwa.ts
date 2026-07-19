const INSTALL_DISPLAY_MODES = ["standalone", "fullscreen", "minimal-ui"] as const;

function isInstalledWebApp(): boolean {
  const iosStandalone = (navigator as Navigator & { standalone?: boolean }).standalone === true;
  return iosStandalone || INSTALL_DISPLAY_MODES.some((mode) => window.matchMedia(`(display-mode: ${mode})`).matches);
}

function stampInstalledMode(): void {
  if (isInstalledWebApp()) {
    document.documentElement.setAttribute("data-installed-app", "true");
  } else {
    document.documentElement.removeAttribute("data-installed-app");
  }
}

export function initializeInstalledWebApp(): void {
  if (window.location.pathname === "/login" || window.location.pathname.startsWith("/app")) {
    document.title = "Standard Playbook";
  }

  stampInstalledMode();

  INSTALL_DISPLAY_MODES.forEach((mode) => {
    window.matchMedia(`(display-mode: ${mode})`).addEventListener?.("change", stampInstalledMode);
  });

  if (import.meta.env.PROD && "serviceWorker" in navigator) {
    window.addEventListener("load", () => {
      navigator.serviceWorker.register("/service-worker.js", { scope: "/" }).catch((error: unknown) => {
        console.warn("Standard Playbook service worker registration failed.", error);
      });
    });
  }
}
