import { Button } from '@/components/ui/button';
import { useScrollReveal } from '@/hooks/useScrollReveal';

const ClosingCTA = () => {
  const { ref, isVisible } = useScrollReveal();

  return (
    <section 
      ref={ref as React.RefObject<HTMLElement>}
      className={`py-20 relative transition-all duration-500 ${isVisible ? 'opacity-100' : 'opacity-0'}`}
    >
      {/* Full-width band with accent glow background */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-primary/5 to-primary/10 accent-glow-intense" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="font-oswald font-bold text-4xl md:text-6xl uppercase tracking-tight text-white mb-8">
            READY TO RAISE YOUR STANDARD?
          </h2>
          <p className="text-xl text-gray-300 mb-12 max-w-2xl mx-auto">
            Join agency owners across the country who have chosen to create freedom in their lives.
          </p>
          <Button 
            className="bg-primary text-white font-bold text-base sm:text-xl px-8 sm:px-16 py-4 sm:py-8 hover:bg-primary-light rounded-pill button-press accent-glow animate-accent-glow"
            onClick={() => window.open('https://AGENCYCOACHING.as.me/standardfit', '_blank')}
          >
            BOOK YOUR FREE CALL
          </Button>
        </div>
      </div>
    </section>
  );
};

export default ClosingCTA;
