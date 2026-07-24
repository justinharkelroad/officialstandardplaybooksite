import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "com.standardplaybook.app",
  appName: "Standard Playbook",
  webDir: "dist-mobile",
  backgroundColor: "#F7F5F1",
  plugins: {
    Keyboard: {
      resize: "body",
      resizeOnFullScreen: true,
    },
    SplashScreen: {
      launchAutoHide: true,
      launchShowDuration: 800,
      backgroundColor: "#F7F5F1",
      showSpinner: false,
    },
  },
};

export default config;
