import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

const CallScoringCTA = () => {
  const handleCTA = () => {
    const pricingSection = document.getElementById('pricing');
    if (pricingSection) {
      pricingSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="py-20 relative">
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary/20 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="font-rajdhani font-bold text-5xl md:text-6xl uppercase tracking-wide text-white mb-6">
            Ready To Streamline Your
            <br />
            <span className="text-gradient">Coaching Process?</span>
          </h2>
          
          <p className="text-xl md:text-2xl text-gray-300 mb-12">
            Join the insurance agencies transforming their teams one scored call at a time
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              className="bg-primary text-white font-bold text-xl px-12 py-6 hover:bg-primary/90"
              onClick={handleCTA}
            >
              START NOW
              <ArrowRight className="w-6 h-6 ml-2" />
            </Button>
            <Button 
              variant="outline"
              className="border-primary/50 text-white font-bold text-xl px-12 py-6 hover:bg-primary/10 bg-transparent"
              onClick={() => window.open('https://AGENCYCOACHING.as.me/standardfit', '_blank')}
            >
              BOOK A DEMO
            </Button>
          </div>

          <p className="text-gray-400 mt-8">
            No credit card required for demo calls • Cancel anytime • Full support included
          </p>
        </div>
      </div>
    </section>
  );
};

export default CallScoringCTA;
