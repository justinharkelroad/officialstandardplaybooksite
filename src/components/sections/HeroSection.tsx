
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
      {/* Full-bleed background with video-like effect */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-b from-dark-bg via-dark-bg/95 to-dark-bg" />
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-[32rem] h-[32rem] bg-primary-accent/15 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        </div>
      </div>

      <div className="container mx-auto px-4 text-center relative z-10 max-w-6xl">
        <h1 className="font-oswald font-bold text-5xl md:text-7xl lg:text-8xl uppercase tracking-tight leading-none text-white mb-8 animate-fade-slide">
          <span className="block">YOU ARE THE #1 ASSET</span>
          <span className="block relative inline-block">
            TO YOUR AGENCY
            <span className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-primary-accent animate-accent-glow" />
          </span>
        </h1>
        
        <div className="text-xl md:text-2xl text-gray-300 max-w-4xl mx-auto mb-12 animate-fade-slide" style={{ animationDelay: '200ms' }}>
          <p className="text-white font-medium leading-relaxed">JOIN AGENCY OWNERS ACROSS THE COUNTRY WHO HAVE CHOSEN TO CREATE FREEDOM IN THEIR LIVES BY REALIZING THEY MUST BE THE EXAMPLE FOR THEIR TEAMS, THEIR FAMILIES AND THEMSELVES.</p>
        </div>

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
            className="border-2 border-primary text-white font-bold text-xl px-12 py-6 hover:bg-primary hover:text-white rounded-pill button-press"
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
