
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
    <section className="relative min-h-[50vh] flex items-center justify-center overflow-hidden pt-24 pb-12">
      {/* Background with subtle overlay */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-primary-accent/10 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 text-center relative z-10">
        <h1 className="font-rajdhani font-bold text-5xl md:text-7xl uppercase tracking-wide text-white mb-6 animate-fade-up">
          YOU ARE THE #1 ASSET TO YOUR AGENCY
        </h1>
        
        <div className="text-xl md:text-2xl text-gray-300 max-w-4xl mx-auto mb-8 animate-fade-up" style={{ animationDelay: '0.2s' }}>
          <p className="text-white font-medium">JOIN AGENCY OWNERS ACROSS THE COUNTRY WHO HAVE CHOSEN TO CREATE FREEDOM IN THEIR LIVES BY REALIZING THEY MUST BE THE EXAMPLE FOR THEIR TEAMS, THEIR FAMILIES AND THEMSELVES.</p>
        </div>

        {/* BOOK FREE CALL Button */}
        <div className="flex justify-center mb-2 animate-fade-up" style={{ animationDelay: '0.3s' }}>
          <Button 
            className="bg-white text-primary font-bold text-xl px-10 py-6 hover:bg-gray-100"
            onClick={() => window.open('https://AGENCYCOACHING.as.me/standardfit', '_blank')}
          >
            BOOK FREE CALL
          </Button>
        </div>

      </div>
    </section>
  );
};

export default HeroSection;
