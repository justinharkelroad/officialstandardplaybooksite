import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import AppAccess from "./pages/AppAccess";
import AppRedirect from "./pages/AppRedirect";
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
import Terms from "./pages/Terms";
import ThankYou from "./pages/ThankYou";
import ChallengeThankYou from "./pages/ChallengeThankYou";
import Links from "./pages/Links";
import NotFound from "./pages/NotFound";
import WelcomeToCoaching from "./pages/WelcomeToCoaching";
import WelcomeBoardroom from "./pages/WelcomeBoardroom";
import ProducerChallengeLanding from "./pages/ProducerChallengeLanding";
import Presentation from "./pages/Presentation";
import NewLanding from "./pages/NewLanding";
import Particles from "./components/Particles";
import ScrollToTop from "./components/ScrollToTop";
import SEOHead from "./components/SEOHead";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <Particles />
      <BrowserRouter>
        <SEOHead />
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<NewLanding />} />
          <Route path="/legacy" element={<Index />} />
          <Route path="/app" element={<AppRedirect />} />
          <Route path="/appinfo" element={<AppAccess />} />
          <Route path="/boardroom" element={<Boardroom />} />
          <Route path="/directive" element={<Directive />} />
          <Route path="/sales-experience" element={<SalesExperience />} />
          <Route path="/producer-power-up" element={<ProducerPowerUp />} />
          <Route path="/owner-challenge" element={<OwnerChallenge />} />
          <Route path="/thechallenge" element={<TheChallenge />} />
          <Route path="/formulaai" element={<FormulaAI />} />
          <Route path="/callscoring" element={<CallScoring />} />
          <Route path="/decision" element={<Decision />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/thank-you" element={<ThankYou />} />
          <Route path="/challenge-thank-you" element={<ChallengeThankYou />} />
          <Route path="/links" element={<Links />} />
          <Route path="/welcometocoaching" element={<WelcomeToCoaching />} />
          <Route path="/welcomeboardroom" element={<WelcomeBoardroom />} />
          <Route path="/PPUC" element={<ProducerChallengeLanding />} />
          <Route path="/presentation" element={<Presentation />} />
          <Route path="/new" element={<NewLanding />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
