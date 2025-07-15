
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
          The 3am Truth Nobody Talks About
        </h1>
        
        <div className="text-xl md:text-2xl text-gray-300 max-w-4xl mx-auto mb-8 animate-fade-up space-y-4" style={{ animationDelay: '0.2s' }}>
          <p className="text-white font-medium">You're not struggling. You're dying.</p>
          
          <p>Dying the slow death of a thousand compromises. Another day pretending your "good enough" is actually good enough while your kids watch you settle for mediocrity.</p>
          
          <p>It's 3:47 AM and you're staring at the ceiling again. Not because you're excited about tomorrow - because you know tomorrow will be exactly like today. And today was exactly like yesterday.</p>
          
          <p>The same excuses. The same results. The same YOU.</p>
          
          <p className="text-primary font-medium">But here's what's keeping you awake:</p>
          
          <p className="text-white font-medium">You know EXACTLY what to do. You just don't do it.</p>
          
          <p>And that knowledge? It's eating you alive.</p>
        </div>

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

        {/* New Five Pillars Introduction */}
        <div className="max-w-4xl mx-auto mb-12 animate-fade-up" style={{ animationDelay: '0.5s' }}>
          <div className="bg-dark-card border-primary/20 rounded-lg p-8 text-center">
            <h3 className="font-rajdhani font-bold text-2xl uppercase tracking-wide text-white mb-4">
              THE STANDARD ISN'T A PROGRAM. IT'S A PROGRESSION.
            </h3>
            <p className="text-xl text-primary font-medium mb-4">
              ACCESS → ASSOCIATION → ACCOUNTABILITY → ACCELERATION → ASCENSION
            </p>
            <p className="text-gray-300 text-lg">
              Most people die with their potential still inside them. We extract it.
            </p>
          </div>
        </div>

        <div className="flex justify-center animate-fade-up" style={{ animationDelay: '0.6s' }}>
          <Button 
            className="btn-primary text-lg px-8 py-4"
            onClick={handleSeeOptions}
          >
            FACE YOUR TRUTH
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
