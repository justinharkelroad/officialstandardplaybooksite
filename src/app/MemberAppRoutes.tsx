// Member app route tree, mounted lazily at /app/* so none of this code is in
// the marketing bundle. Paths here are relative to /app.
import { Navigate, Route, Routes } from "react-router-dom";
import "@/app/app.css";
import { MemberAuthProvider } from "@/app/lib/auth";
import { RequireAdmin, RequireMember } from "@/app/components/guards";
import AppShell from "@/app/components/AppShell";
import ImmersiveFrame from "@/app/components/ImmersiveFrame";
import AdminPage from "@/app/pages/AdminPage";
import PersonalGrowthDashboard from "@/app/pages/PersonalGrowthDashboard";
import Core4 from "@/app/pages/Core4";
import MonthlyMissions from "@/app/pages/MonthlyMissions";
import WeeklyPlaybook from "@/app/pages/WeeklyPlaybook";
import WeeklyDebrief from "@/app/pages/WeeklyDebrief";
import WeeklyReflection from "@/app/pages/WeeklyReflection";
import LifeTargets from "@/app/pages/LifeTargets";
import LifeTargetsBrainstorm from "@/app/pages/LifeTargetsBrainstorm";
import LifeTargetsSelection from "@/app/pages/LifeTargetsSelection";
import LifeTargetsQuarterly from "@/app/pages/LifeTargetsQuarterly";
import LifeTargetsMissions from "@/app/pages/LifeTargetsMissions";
import LifeTargetsDaily from "@/app/pages/LifeTargetsDaily";
import LifeTargetsCascade from "@/app/pages/LifeTargetsCascade";
import LifeTargetsHistory from "@/app/pages/LifeTargetsHistory";
import Flows from "@/app/pages/Flows";
import FlowLibrary from "@/app/pages/flows/FlowLibrary";
import FlowProfile from "@/app/pages/flows/FlowProfile";
import FlowStart from "@/app/pages/flows/FlowStart";
import FlowSession from "@/app/pages/flows/FlowSession";
import FlowComplete from "@/app/pages/flows/FlowComplete";
import FlowView from "@/app/pages/flows/FlowView";
import ThetaTalkTrack from "@/app/pages/ThetaTalkTrack";
import ThetaTalkTrackCreate from "@/app/pages/ThetaTalkTrackCreate";

export default function MemberAppRoutes() {
  return (
    <MemberAuthProvider>
      <Routes>
        <Route element={<RequireMember />}>
          {/* Immersive flow surfaces: full-viewport, no sidebar chrome. */}
          <Route element={<ImmersiveFrame />}>
            <Route path="flows/start/:slug" element={<FlowStart />} />
            <Route path="flows/session/:slug" element={<FlowSession />} />
            <Route path="flows/complete/:sessionId" element={<FlowComplete />} />
            <Route path="flows/view/:sessionId" element={<FlowView />} />
          </Route>

          <Route element={<AppShell />}>
            <Route index element={<PersonalGrowthDashboard />} />
            <Route path="core4" element={<Core4 />} />
            <Route path="monthly-missions" element={<MonthlyMissions />} />
            <Route path="weekly-playbook" element={<WeeklyPlaybook />} />
            <Route path="reflection" element={<WeeklyReflection />} />
            <Route path="debrief" element={<WeeklyDebrief />} />
            <Route path="life-targets" element={<LifeTargets />} />
            <Route path="life-targets/brainstorm" element={<LifeTargetsBrainstorm />} />
            <Route path="life-targets/selection" element={<LifeTargetsSelection />} />
            <Route path="life-targets/quarterly" element={<LifeTargetsQuarterly />} />
            <Route path="life-targets/missions" element={<LifeTargetsMissions />} />
            <Route path="life-targets/daily" element={<LifeTargetsDaily />} />
            <Route path="life-targets/cascade" element={<LifeTargetsCascade />} />
            <Route path="life-targets/history" element={<LifeTargetsHistory />} />
            <Route path="flows" element={<Flows />} />
            <Route path="flows/library" element={<FlowLibrary />} />
            <Route path="flows/profile" element={<FlowProfile />} />
            <Route path="theta-talk-track" element={<ThetaTalkTrack />} />
            <Route path="theta-talk-track/create" element={<ThetaTalkTrackCreate />} />
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
