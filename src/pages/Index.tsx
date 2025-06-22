
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import SoftwareSection from '@/components/SoftwareSection';
import HeroSection from '@/components/sections/HeroSection';
import AISection from '@/components/sections/AISection';
import OffersGrid from '@/components/sections/OffersGrid';
import DIYAccessSection from '@/components/sections/DIYAccessSection';
import PricingSection from '@/components/sections/PricingSection';
import TestimonialsSection from '@/components/sections/TestimonialsSection';
import AITrainingBanner from '@/components/sections/AITrainingBanner';
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
      <AITrainingBanner />
      <HeroSection onScrollToSection={scrollToSection} />
      <SoftwareSection />
      <AISection />
      <OffersGrid />
      <DIYAccessSection />
      <PricingSection />
      <TestimonialsSection />
      <Footer />
    </div>
  );
};

export default Index;
