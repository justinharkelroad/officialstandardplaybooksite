
import { Button } from '@/components/ui/button';
import VideoPlayer from '@/components/VideoPlayer';
import { ArrowRight } from 'lucide-react';
import { useState, useEffect } from 'react';

interface HeroSectionProps {
  onScrollToSection: (sectionId: string) => void;
}

const HeroSection = ({ onScrollToSection }: HeroSectionProps) => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth - 0.5) * 20,
        y: (e.clientY / window.innerHeight - 0.5) * 20
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <section id="hero" className="relative min-h-screen flex items-center justify-center overflow-hidden pt-32">
      {/* Parallax Background Elements */}
      <div 
        className="absolute inset-0 opacity-20"
        style={{
          transform: `translate(${mousePosition.x * 0.5}px, ${mousePosition.y * 0.5}px)`
        }}
      >
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-primary-accent/10 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 text-center relative z-10">
        <h1 className="font-rajdhani font-bold text-4xl md:text-6xl lg:text-7xl uppercase tracking-wide text-white mb-6 animate-fade-up">
          Raise Your Standard.
          <br />
          <span className="text-gradient">Live the Playbook.</span>
        </h1>
        
        <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto mb-12 animate-fade-up" style={{ animationDelay: '0.2s' }}>
          Elite coaching for entrepreneurs who refuse to settle. Transform your business, 
          elevate your mindset, and join the ranks of high performers.
        </p>

        {/* Video Frame with Background Glow */}
        <div className="relative max-w-4xl mx-auto mb-12 animate-fade-up" style={{ animationDelay: '0.4s' }}>
          <div className="video-glow absolute -inset-4"></div>
          <div className="relative aspect-video bg-dark-card rounded-lg overflow-hidden">
            <VideoPlayer 
              videoId="gy-8UNhToW8"
              title="Demo Video"
              className="w-full h-full rounded-lg"
            />
          </div>
        </div>

        <div className="animate-fade-up" style={{ animationDelay: '0.6s' }}>
          <Button 
            onClick={() => onScrollToSection('offers')}
            className="btn-primary text-lg px-8 py-4"
          >
            SEE OPTIONS
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
