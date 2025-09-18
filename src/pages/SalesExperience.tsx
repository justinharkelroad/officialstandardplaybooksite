
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import SalesHero from '@/components/sections/SalesHero';
import SalesBoxedFeatures from '@/components/sections/SalesBoxedFeatures';
import SalesButtonCTA from '@/components/sections/SalesButtonCTA';
import SalesCallCTA from '@/components/sections/SalesCallCTA';
import SalesSuccessStory from '@/components/sections/SalesSuccessStory';
import SalesPayment from '@/components/sections/SalesPayment';
import SalesFramework from '@/components/sections/SalesFramework';
import SalesFAQ from '@/components/sections/SalesFAQ';
import { Button } from '@/components/ui/button';

const SalesExperience = () => {
  const scrollToPayment = () => {
    const paymentSection = document.getElementById('payment');
    if (paymentSection) {
      paymentSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen">
      <Navigation />
      
      <SalesHero onScrollToPayment={scrollToPayment} />
      <SalesButtonCTA onScrollToPayment={scrollToPayment} />
      <SalesBoxedFeatures />
      <SalesSuccessStory />
      <SalesCallCTA />
      <SalesPayment />
      <SalesFramework />
      <SalesFAQ />

      {/* Sticky CTA for Mobile */}
      <div className="fixed bottom-0 left-0 right-0 bg-dark-card border-t border-primary/20 p-4 md:hidden z-40">
        <Button 
          onClick={scrollToPayment}
          className="btn-primary w-full"
        >
          Start 8-Week Sales Management Training
        </Button>
      </div>

      <Footer />
    </div>
  );
};

export default SalesExperience;
