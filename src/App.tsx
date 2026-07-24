import { lazy, Suspense } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import Index from "./pages/Index";
import AppAccess from "./pages/AppAccess";
import TheTool from "./pages/TheTool";

// Member app (Standard Playbook client portal) — lazy so the marketing
// bundle is unaffected.
const MemberLogin = lazy(() => import("./app/LoginRoute"));
const ResetPassword = lazy(() => import("./app/pages/ResetPassword"));
const MemberApp = lazy(() => import("./app/MemberAppRoutes"));
const AIInstall = lazy(() => import("./pages/AIInstall"));
import Boardroom from "./pages/Boardroom";
import Directive from "./pages/Directive";
import SalesExperience from "./pages/SalesExperience";
import ProducerPowerUp from "./pages/ProducerPowerUp";
import OwnerChallenge from "./pages/OwnerChallenge";
import TheChallenge from "./pages/TheChallenge";
import FormulaAI from "./pages/FormulaAI";
import CallScoring from "./pages/CallScoring";
import Decision from "./pages/Decision";
import Contact from "./pages/Contact";
import Privacy from "./pages/Privacy";
import DataDeletion from "./pages/DataDeletion";
import Terms from "./pages/Terms";
import ThankYou from "./pages/ThankYou";
import ChallengeThankYou from "./pages/ChallengeThankYou";
import Links from "./pages/Links";
import About from "./pages/About";
import Partnership from "./pages/Partnership";
import Blog from "./pages/Blog";
import BlogPost from "./pages/BlogPost";
import NotFound from "./pages/NotFound";
import WelcomeToCoaching from "./pages/WelcomeToCoaching";
import WelcomeBoardroom from "./pages/WelcomeBoardroom";
import ProducerChallengeLanding from "./pages/ProducerChallengeLanding";
import Presentation from "./pages/Presentation";
import NewLanding from "./pages/NewLanding";
import StandardFit from "./pages/StandardFit";
import AIWalkthrough from "./pages/AIWalkthrough";
import AppleMockup from "./pages/AppleMockup";
import BoldMockup from "./pages/BoldMockup";
import BoldSalesExperience from "./pages/BoldSalesExperience";
import SalesExperienceOnePager from "./pages/SalesExperienceOnePager";
import BoldDirective from "./pages/BoldDirective";
import BoldBoardroom from "./pages/BoldBoardroom";
import BoldAbout from "./pages/BoldAbout";
import BoldProducerChallenge from "./pages/BoldProducerChallenge";
import BoldTraining from "./pages/BoldTraining";
import BoldEightWeekApply from "./pages/BoldEightWeekApply";
import BoldContact from "./pages/BoldContact";
import BoldMirror from "./pages/BoldMirror";
import BoldMirrorScore from "./pages/BoldMirrorScore";
import BoldMirrorResults from "./pages/BoldMirrorResults";
import EightWeekApply from "./pages/EightWeekApply";
import Websites from "./pages/Websites";
import TeamTraining from "./pages/TeamTraining";
import SalesProcess from "./pages/SalesProcess";
import Calls from "./pages/Calls";
import ZoomRedirect from "./pages/ZoomRedirect";
import BoldStandard90 from "./pages/BoldStandard90";
import BoldCertifiedStandard from "./pages/BoldCertifiedStandard";
import BoldTeamStandard from "./pages/BoldTeamStandard";
import Ascension from "./pages/Ascension";
import Particles from "./components/Particles";
import ScrollToTop from "./components/ScrollToTop";
import SEOHead from "./components/SEOHead";

const queryClient = new QueryClient();

function RouteParticles() {
  const { pathname } = useLocation();
  const isMemberSurface =
    pathname === "/login" || pathname === "/reset-password" || pathname === "/app" || pathname.startsWith("/app/");
  const isCleanLandingPage = pathname === "/aiinstall";
  return isMemberSurface || isCleanLandingPage ? null : <Particles />;
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <RouteParticles />
        <SEOHead />
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<BoldMockup />} />
          <Route path="/bold" element={<BoldMockup />} />
          <Route path="/apple" element={<AppleMockup />} />
          <Route path="/legacy" element={<NewLanding />} />
          <Route path="/login" element={<Suspense fallback={null}><MemberLogin /></Suspense>} />
          <Route path="/reset-password" element={<Suspense fallback={null}><ResetPassword /></Suspense>} />
          <Route path="/app/*" element={<Suspense fallback={null}><MemberApp /></Suspense>} />
          <Route path="/appinfo" element={<AppAccess />} />
          <Route path="/thetool" element={<TheTool />} />
          <Route path="/boardroom" element={<BoldBoardroom />} />
          <Route path="/legacy-boardroom" element={<Boardroom />} />
          <Route path="/directive" element={<BoldDirective />} />
          <Route path="/legacy-directive" element={<Directive />} />
          <Route path="/sales-experience" element={<SalesExperienceOnePager />} />
          <Route path="/8-week" element={<BoldSalesExperience autoOpenBooking />} />
          <Route path="/apple-sales-experience" element={<SalesExperience />} />
          <Route path="/8-week-apply" element={<BoldEightWeekApply />} />
          <Route path="/legacy-8-week-apply" element={<EightWeekApply />} />
          <Route path="/producer-power-up" element={<ProducerPowerUp />} />
          <Route path="/owner-challenge" element={<OwnerChallenge />} />
          <Route path="/the-challenge" element={<BoldProducerChallenge />} />
          <Route path="/thechallenge" element={<Navigate to="/the-challenge" replace />} />
          <Route path="/legacy-the-challenge" element={<TheChallenge />} />
          <Route path="/formulaai" element={<FormulaAI />} />
          <Route path="/callscoring" element={<CallScoring />} />
          <Route path="/decision" element={<Decision />} />
          <Route path="/about" element={<BoldAbout />} />
          <Route path="/legacy-about" element={<About />} />
          <Route path="/partnership" element={<Partnership />} />
          <Route path="/contact" element={<BoldContact />} />
          <Route path="/legacy-contact" element={<Contact />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/data-deletion" element={<DataDeletion />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/thank-you" element={<ThankYou />} />
          <Route path="/challenge-thank-you" element={<ChallengeThankYou />} />
          <Route path="/links" element={<Links />} />
          <Route path="/welcometocoaching" element={<WelcomeToCoaching />} />
          <Route path="/welcomeboardroom" element={<WelcomeBoardroom />} />
          <Route path="/PPUC" element={<ProducerChallengeLanding />} />
          <Route path="/presentation" element={<Presentation />} />
          <Route path="/new" element={<NewLanding />} />
          <Route path="/fit" element={<StandardFit />} />
          <Route path="/ai-walk-through" element={<AIWalkthrough />} />
          <Route path="/apple-mockup" element={<Navigate to="/" replace />} />
          <Route path="/websites" element={<Websites />} />
          <Route path="/training" element={<BoldTraining />} />
          <Route path="/legacy-training" element={<TeamTraining />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:slug" element={<BlogPost />} />
          <Route path="/salesprocess" element={<SalesProcess />} />
          <Route path="/calls" element={<Calls />} />
          <Route path="/zoom" element={<ZoomRedirect />} />
          <Route path="/standard90" element={<BoldStandard90 />} />
          <Route path="/standard-90" element={<Navigate to="/standard90" replace />} />
          <Route path="/ascension" element={<Ascension />} />
          <Route path="/aiinstall" element={<Suspense fallback={null}><AIInstall /></Suspense>} />
          <Route path="/certified-standard" element={<BoldCertifiedStandard />} />
          <Route path="/team-standard" element={<BoldTeamStandard />} />
          <Route path="/teamstandard" element={<Navigate to="/team-standard" replace />} />
          <Route path="/certified" element={<Navigate to="/certified-standard" replace />} />
          <Route path="/mirror" element={<BoldMirror />} />
          <Route path="/mirror/score" element={<BoldMirrorScore />} />
          <Route path="/mirror/results" element={<BoldMirrorResults />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
