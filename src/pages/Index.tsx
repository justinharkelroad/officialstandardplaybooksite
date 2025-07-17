import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import SoftwareSection from '@/components/SoftwareSection';
import HeroSection from '@/components/sections/HeroSection';
import AISection from '@/components/sections/AISection';
import OffersGrid from '@/components/sections/OffersGrid';
import DIYAccessSection from '@/components/sections/DIYAccessSection';
import PricingSection from '@/components/sections/PricingSection';
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
      <SoftwareSection />
      <AISection />
      
      {/* CTA Button above Choose Your Path section */}
      <div className="py-16 text-center">
        <Button 
          className="bg-white text-primary font-bold text-xl px-10 py-6 hover:bg-gray-100"
          onClick={() => window.open('https://AGENCYCOACHING.as.me/standardfit', '_blank')}
        >
          BOOK FREE CALL
        </Button>
      </div>
      
      <OffersGrid />
      <DIYAccessSection />
      <PricingSection />
      <TestimonialsSection />
      <FivePillarsSection />
      <Footer />
    </div>
  );
};

export default Index;
