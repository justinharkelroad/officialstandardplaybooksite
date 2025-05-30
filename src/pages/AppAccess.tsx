
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import AppAccessHero from '@/components/sections/AppAccessHero';
import AppAccessPricing from '@/components/sections/AppAccessPricing';
import AppAccessProblem from '@/components/sections/AppAccessProblem';
import AppAccessSolution from '@/components/sections/AppAccessSolution';
import AppAccessDemo from '@/components/sections/AppAccessDemo';
import AppAccessFAQ from '@/components/sections/AppAccessFAQ';

const AppAccess = () => {
  const scrollToPricing = () => {
    const pricingSection = document.getElementById('pricing');
    if (pricingSection) {
      pricingSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen">
      <Navigation />
      
      <AppAccessHero onGetStartedClick={scrollToPricing} />
      <AppAccessPricing />
      <AppAccessProblem />
      <AppAccessSolution />
      <AppAccessDemo />
      <AppAccessFAQ />

      {/* Sticky CTA for Mobile */}
      <div className="fixed bottom-0 left-0 right-0 bg-dark-card border-t border-primary/20 p-4 md:hidden z-40">
        <Button className="btn-primary w-full">
          Get Started - App Access Only
        </Button>
      </div>

      <Footer />
    </div>
  );
};

export default AppAccess;
