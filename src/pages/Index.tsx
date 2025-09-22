import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import HeroSection from '@/components/sections/HeroSection';
import OffersGrid from '@/components/sections/OffersGrid';
import TestimonialsSection from '@/components/sections/TestimonialsSection';
import FivePillarsSection from '@/components/sections/FivePillarsSection';
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
      <HeroSection onScrollToSection={scrollToSection} />
      
      <OffersGrid />
      <TestimonialsSection />
      <FivePillarsSection />
      <Footer />
    </div>
  );
};

export default Index;
