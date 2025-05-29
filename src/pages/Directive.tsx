
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import DirectiveHero from '@/components/sections/DirectiveHero';
import DirectiveProblem from '@/components/sections/DirectiveProblem';
import DirectiveSolution from '@/components/sections/DirectiveSolution';
import DirectiveBusiness from '@/components/sections/DirectiveBusiness';

const Directive = () => {
  return (
    <div className="min-h-screen">
      <Navigation />
      
      <DirectiveHero />
      <DirectiveProblem />
      <DirectiveSolution />
      <DirectiveBusiness />

      {/* Sticky CTA for Mobile */}
      <div className="fixed bottom-0 left-0 right-0 bg-dark-card border-t border-primary-accent/20 p-4 md:hidden z-40">
        <Button 
          className="btn-primary w-full bg-primary-accent hover:bg-primary-light"
          onClick={() => window.open('https://link.fastpaydirect.com/payment-link/670ff5735146ea77a16c5106', '_blank')}
        >
          Join The Directive
        </Button>
      </div>

      <Footer />
    </div>
  );
};

export default Directive;
