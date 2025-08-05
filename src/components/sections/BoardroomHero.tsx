
import { Button } from '@/components/ui/button';
import VideoPlayer from '@/components/VideoPlayer';
import { Users, ArrowRight } from 'lucide-react';

const BoardroomHero = () => {
  const handleJoinNow = () => {
    window.open('https://link.fastpaydirect.com/payment-link/68371b280a5741f8835218c8', '_blank');
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/10 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-primary-accent/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '3s' }} />
      </div>

      <div className="container mx-auto px-4 text-center relative z-10">
        <div className="w-16 h-16 bg-primary rounded-square flex items-center justify-center mx-auto mb-12 animate-fade-up">
          <Users className="w-8 h-8 text-white" />
        </div>
        
        <h1 className="font-rajdhani font-bold text-4xl md:text-6xl lg:text-7xl uppercase tracking-wide text-white mb-6 animate-fade-up">
          WELCOME TO THE BOARDROOM
        </h1>

        <div className="relative max-w-4xl mx-auto mb-12 animate-fade-up" style={{ animationDelay: '0.4s' }}>
          <div className="video-glow absolute -inset-4"></div>
          <div className="relative aspect-video bg-dark-card rounded-lg overflow-hidden">
            <VideoPlayer 
              videoId="36Ns-DrlHEA"
              title="Boardroom Demo Video"
              className="w-full h-full rounded-lg"
            />
          </div>
        </div>

        <div className="animate-fade-up" style={{ animationDelay: '0.6s' }}>
          <Button onClick={handleJoinNow} className="btn-primary text-lg px-8 py-4">
            CLAIM YOUR SEAT AT THE TABLE →
          </Button>
        </div>
      </div>
    </section>
  );
};

export default BoardroomHero;
