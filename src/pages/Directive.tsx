
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
      
      {/* Extra CTA Button */}
      <div className="py-16 text-center">
        <Button 
          className="bg-white text-primary font-bold text-xl px-10 py-6 hover:bg-gray-100"
          onClick={() => window.open('https://AGENCYCOACHING.as.me/standardfit', '_blank')}
        >
          BOOK FREE CALL
        </Button>
      </div>
      
      <DirectiveBusiness />

      {/* Sticky CTA for Mobile */}
      <div className="fixed bottom-0 left-0 right-0 bg-dark-card border-t border-primary-accent/20 p-4 md:hidden z-40">
        <Button 
          className="bg-white text-primary font-bold w-full hover:bg-gray-100"
          onClick={() => window.open('https://AGENCYCOACHING.as.me/standardfit', '_blank')}
        >
          BOOK FREE CALL
        </Button>
      </div>

      <Footer />
    </div>
  );
};

export default Directive;
