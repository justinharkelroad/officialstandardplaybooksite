
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import VideoPlayer from '@/components/VideoPlayer';

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
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-32">
      {/* Background with subtle overlay */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-primary-accent/10 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 text-center relative z-10">
        <h1 className="font-rajdhani font-bold text-4xl md:text-6xl lg:text-7xl uppercase tracking-wide text-white mb-6 animate-fade-up">
          <span className="text-white">RAISE YOUR STANDARD.</span>
          <br />
          <span className="text-blue-400">LIVE THE PLAYBOOK.</span>
        </h1>
        
        <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto mb-12 animate-fade-up" style={{ animationDelay: '0.2s' }}>
          Elite coaching for entrepreneurs who refuse to settle. Transform your business, elevate your mindset, and join the ranks of high performers.
        </p>

        {/* Video Frame */}
        <div className="relative max-w-4xl mx-auto mb-12 animate-fade-up" style={{ animationDelay: '0.3s' }}>
          <div className="video-glow absolute -inset-4"></div>
          <div className="relative aspect-video bg-dark-card rounded-lg overflow-hidden">
            <VideoPlayer 
              videoId="gy-8UNhToW8"
              title="Demo Video"
              className="w-full h-full rounded-lg"
            />
          </div>
        </div>

        <div className="flex justify-center animate-fade-up" style={{ animationDelay: '0.4s' }}>
          <Button 
            className="btn-primary text-lg px-8 py-4"
            onClick={handleSeeOptions}
          >
            SEE OPTIONS
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
