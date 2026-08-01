import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "com.standardplaybook.app",
  appName: "Standard Playbook",
  webDir: "dist-mobile",
  backgroundColor: "#F7F5F1",
  plugins: {
    SystemBars: {
      insetsHandling: "css",
      style: "DEFAULT",
      hidden: false,
    },
  },
};

export default config;
