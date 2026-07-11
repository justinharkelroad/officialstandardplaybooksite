// Member app route tree, mounted lazily at /app/* so none of this code is in
// the marketing bundle. Paths here are relative to /app.
import { Navigate, Route, Routes } from "react-router-dom";
import { MemberAuthProvider } from "@/app/lib/auth";
import { RequireAdmin, RequireMember } from "@/app/components/guards";
import AppShell from "@/app/components/AppShell";
import HubPage from "@/app/pages/HubPage";
import AdminPage from "@/app/pages/AdminPage";

export default function MemberAppRoutes() {
  return (
    <MemberAuthProvider>
      <Routes>
        <Route element={<RequireMember />}>
          <Route element={<AppShell />}>
            <Route index element={<HubPage />} />
            <Route element={<RequireAdmin />}>
              <Route path="admin" element={<AdminPage />} />
            </Route>
          </Route>
        </Route>
        <Route path="*" element={<Navigate to="/app" replace />} />
      </Routes>
    </MemberAuthProvider>
  );
}
