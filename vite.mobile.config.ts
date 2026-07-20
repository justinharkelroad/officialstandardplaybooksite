import { copyFileSync, existsSync, readFileSync, rmSync } from "node:fs";
import path from "node:path";
import { defineConfig, type Plugin } from "vite";
import react from "@vitejs/plugin-react-swc";

function readReleaseEnvironment() {
  return Object.fromEntries(
    readFileSync(path.resolve(__dirname, ".env"), "utf8")
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter((line) => line && !line.startsWith("#") && line.includes("="))
      .map((line) => {
        const separator = line.indexOf("=");
        return [line.slice(0, separator), line.slice(separator + 1).replace(/^['"]|['"]$/g, "")];
      }),
  );
}

function capacitorIndex(): Plugin {
  return {
    name: "capacitor-index",
    closeBundle() {
      const mobileHtml = path.resolve(__dirname, "dist-mobile/mobile.html");
      const indexHtml = path.resolve(__dirname, "dist-mobile/index.html");
      if (!existsSync(mobileHtml)) {
        throw new Error("The mobile build did not emit mobile.html.");
      }
      copyFileSync(mobileHtml, indexHtml);
      rmSync(mobileHtml);
    },
  };
}

export default defineConfig(() => {
  const releaseEnvironment = readReleaseEnvironment();
  const publicKeys = [
    "VITE_SUPABASE_PROJECT_ID",
    "VITE_SUPABASE_URL",
    "VITE_SUPABASE_PUBLISHABLE_KEY",
    "VITE_ELEVENLABS_AGENT_ID",
  ];

  return {
    plugins: [react(), capacitorIndex()],
    // Never copy the website's marketing-heavy public/ directory into the
    // native binary. Member assets enter through explicit source imports.
    publicDir: false,
    define: Object.fromEntries(
      publicKeys.map((key) => [`import.meta.env.${key}`, JSON.stringify(releaseEnvironment[key] ?? "")]),
    ),
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    build: {
      outDir: "dist-mobile",
      emptyOutDir: true,
      rollupOptions: {
        input: path.resolve(__dirname, "mobile.html"),
      },
    },
  };
});
