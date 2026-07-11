// Member app route tree, mounted lazily at /app/* so none of this code is in
// the marketing bundle. Paths here are relative to /app.
import { Navigate, Route, Routes } from "react-router-dom";
import { MemberAuthProvider } from "@/app/lib/auth";
import { RequireAdmin, RequireMember } from "@/app/components/guards";
import AppShell from "@/app/components/AppShell";
import AdminPage from "@/app/pages/AdminPage";
import PersonalGrowthDashboard from "@/app/pages/PersonalGrowthDashboard";
import Core4 from "@/app/pages/Core4";
import MonthlyMissions from "@/app/pages/MonthlyMissions";

export default function MemberAppRoutes() {
  return (
    <MemberAuthProvider>
      <Routes>
        <Route element={<RequireMember />}>
          <Route element={<AppShell />}>
            <Route index element={<PersonalGrowthDashboard />} />
            <Route path="core4" element={<Core4 />} />
            <Route path="monthly-missions" element={<MonthlyMissions />} />
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
