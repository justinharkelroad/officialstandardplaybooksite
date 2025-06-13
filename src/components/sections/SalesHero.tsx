
import { Button } from '@/components/ui/button';
import VideoPlayer from '@/components/VideoPlayer';
import { Target, ArrowRight } from 'lucide-react';

interface SalesHeroProps {
  onScrollToPayment: () => void;
}

const SalesHero = ({ onScrollToPayment }: SalesHeroProps) => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/10 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-primary-accent/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '3s' }} />
      </div>

      <div className="container mx-auto px-4 text-center relative z-10">
        <div className="w-16 h-16 bg-primary-accent rounded-square flex items-center justify-center mx-auto mb-8 animate-fade-up">
          <Target className="w-8 h-8 text-white" />
        </div>
        
        <h1 className="font-rajdhani font-bold text-6xl md:text-8xl uppercase tracking-wide text-white mb-6 animate-fade-up">
          8 Week Sales
          <br />
          <span className="text-gradient">Management Training</span>
        </h1>
        
        <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto mb-12 animate-fade-up" style={{ animationDelay: '0.2s' }}>
          Build effective sales management systems with precision training. Work one-on-one with Justin to transform your team's sales management approach.
        </p>

        <div className="relative max-w-4xl mx-auto mb-12 animate-fade-up" style={{ animationDelay: '0.4s' }}>
          <div className="video-glow absolute -inset-4"></div>
          <div className="relative aspect-video bg-dark-card rounded-lg overflow-hidden">
            <VideoPlayer 
              videoId="kJWh8cVHoFs"
              title="8-Week Sales Management Training Overview"
              className="w-full h-full rounded-lg"
            />
          </div>
        </div>

        <div className="animate-fade-up" style={{ animationDelay: '0.6s' }}>
          <Button 
            onClick={onScrollToPayment}
            className="btn-primary text-lg px-8 py-4"
          >
            Get Started Now
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </div>
      </div>
    </section>
  );
};

export default SalesHero;
