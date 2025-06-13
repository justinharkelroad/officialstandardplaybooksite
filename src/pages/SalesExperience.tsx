
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import SalesHero from '@/components/sections/SalesHero';
import SalesFeatures from '@/components/sections/SalesFeatures';
import SalesCallCTA from '@/components/sections/SalesCallCTA';
import SalesProblem from '@/components/sections/SalesProblem';
import SalesSolution from '@/components/sections/SalesSolution';
import SalesGuarantee from '@/components/sections/SalesGuarantee';
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
      <SalesFeatures />
      <SalesCallCTA />
      <SalesProblem />
      <SalesSolution />
      <SalesGuarantee />
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
