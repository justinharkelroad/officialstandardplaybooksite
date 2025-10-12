import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import HeroSection from '@/components/sections/HeroSection';
import VideoFlowSection from '@/components/sections/VideoFlowSection';
import OutcomeSection from '@/components/sections/OutcomeSection';
import CommunityTechSection from '@/components/sections/CommunityTechSection';
import OffersGrid from '@/components/sections/OffersGrid';
import TestimonialsSection from '@/components/sections/TestimonialsSection';
import ClosingCTA from '@/components/sections/ClosingCTA';
import StickyCTA from '@/components/StickyCTA';
import PromoBanner from '@/components/PromoBanner';
import { useLocation } from 'react-router-dom';
import { useEffect } from 'react';

const Index = () => {
  const location = useLocation();

  useEffect(() => {
    // Check if we need to scroll to pricing section after navigation
    if (location.state?.scrollToPricing) {
      const timer = setTimeout(() => {
        scrollToSection('pricing');
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [location.state]);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen">
      <Navigation />
      <PromoBanner />
      <HeroSection onScrollToSection={scrollToSection} />
      <VideoFlowSection />
      <OutcomeSection />
      <CommunityTechSection />
      <OffersGrid />
      <TestimonialsSection />
      <ClosingCTA />
      <StickyCTA />
      <Footer />
    </div>
  );
};

export default Index;
