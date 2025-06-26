
import { Button } from '@/components/ui/button';

interface ChallengeHeroProps {
  title: string;
  subtitle: string;
  backgroundImage: string;
  onEnrollClick: () => void;
  showEnrollButton?: boolean;
}

const ChallengeHero = ({ 
  title, 
  subtitle, 
  backgroundImage, 
  onEnrollClick, 
  showEnrollButton = true 
}: ChallengeHeroProps) => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-32">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0">
        <img 
          src={backgroundImage}
          alt="Challenge Hero"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-primary/60"></div>
      </div>

      <div className="container mx-auto px-4 text-center relative z-10">
        <h1 className="font-rajdhani font-bold text-4xl md:text-6xl lg:text-7xl uppercase tracking-wide text-white mb-6 animate-fade-up">
          {title}
        </h1>
        
        <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto mb-12 animate-fade-up" style={{ animationDelay: '0.2s' }}>
          {subtitle}
        </p>

        {showEnrollButton && (
          <div className="animate-fade-up" style={{ animationDelay: '0.4s' }}>
            <Button 
              onClick={onEnrollClick}
              className="btn-primary text-lg px-8 py-4"
            >
              Enroll Now
            </Button>
          </div>
        )}
      </div>
    </section>
  );
};

export default ChallengeHero;
