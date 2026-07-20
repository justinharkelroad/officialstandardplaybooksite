import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import LoginRoute from "@/app/LoginRoute";
import MemberAppRoutes from "@/app/MemberAppRoutes";
import NativeBootstrap from "@/mobile/NativeBootstrap";

const queryClient = new QueryClient();

function getMissingMobileEnvironment(): string[] {
  const required = {
    VITE_SUPABASE_URL: import.meta.env.VITE_SUPABASE_URL,
    VITE_SUPABASE_PUBLISHABLE_KEY: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
    VITE_ELEVENLABS_AGENT_ID: import.meta.env.VITE_ELEVENLABS_AGENT_ID,
  };

  return Object.entries(required)
    .filter(([, value]) => typeof value !== "string" || value.trim() === "")
    .map(([key]) => key);
}

function ConfigurationError({ missing }: { missing: string[] }) {
  return (
    <main className="mobile-configuration-error" role="alert">
      <div>
        <p className="sp-label">Configuration required</p>
        <h1 className="sp-display">Standard Playbook can’t start.</h1>
        <p>The app build is missing: {missing.join(", ")}. No secret values were displayed.</p>
        <p>Contact app support and include the build version.</p>
      </div>
    </main>
  );
}

export default function MobileApp() {
  const missing = getMissingMobileEnvironment();
  if (missing.length) return <ConfigurationError missing={missing} />;

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <NativeBootstrap />
          <Routes>
            <Route path="/login" element={<LoginRoute />} />
            <Route path="/app/*" element={<MemberAppRoutes />} />
            <Route path="*" element={<Navigate to="/app" replace />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
}
