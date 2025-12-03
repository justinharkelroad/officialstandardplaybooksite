
import { Button } from '@/components/ui/button';

interface HeroSectionProps {
  onScrollToSection?: (sectionId: string) => void;
}

const HeroSection = ({ onScrollToSection }: HeroSectionProps) => {
  const handleSeeOptions = () => {
    if (onScrollToSection) {
      onScrollToSection('offers');
    }
  };

  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden pt-32 pb-12">
      {/* Clean dark background with subtle gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-[hsl(220,30%,10%)] via-dark-bg to-dark-bg" />

      <div className="container mx-auto px-4 text-center relative z-10 max-w-5xl">
        <h1 className="font-oswald font-bold text-5xl md:text-7xl lg:text-8xl uppercase tracking-tight leading-[1.1] text-white mb-8 animate-fade-slide">
          <span className="block">RAISE YOUR <span className="text-primary">STANDARD</span>.</span>
          <span className="block">RUN YOUR AGENCY LIKE A PRO.</span>
        </h1>
        
        <p className="text-lg md:text-xl text-gray-400 max-w-3xl mx-auto mb-12 animate-fade-slide font-normal" style={{ animationDelay: '200ms' }}>
          The Standard Playbook gives insurance agencies a concrete operating system: standards, coaching, and tools.
        </p>

        {/* Dual CTA Buttons */}
        <div className="flex flex-col sm:flex-row justify-center gap-4 mb-4 animate-fade-slide" style={{ animationDelay: '400ms' }}>
          <Button 
            className="bg-primary text-white font-bold text-xl px-12 py-6 hover:bg-primary-light rounded-pill button-press accent-glow"
            onClick={() => window.open('https://AGENCYCOACHING.as.me/standardfit', '_blank')}
          >
            BOOK FREE CALL
          </Button>
          <Button 
            variant="outline"
            className="border-2 border-primary text-primary font-bold text-xl px-12 py-6 hover:bg-primary hover:text-white rounded-pill button-press"
            onClick={handleSeeOptions}
          >
            EXPLORE PROGRAMS
          </Button>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
