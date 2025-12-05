
import { Button } from '@/components/ui/button';
import VideoPlayer from '@/components/VideoPlayer';

const BoardroomHero = () => {
  const handleJoinNow = () => {
    window.open('https://link.fastpaydirect.com/payment-link/68371b280a5741f8835218c8', '_blank');
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      <div className="absolute inset-0 bg-gradient-to-b from-[hsl(220,30%,10%)] via-dark-bg to-dark-bg" />

      <div className="container mx-auto px-4 text-center relative z-10">
        <h1 className="font-rajdhani font-bold text-4xl md:text-6xl lg:text-7xl uppercase tracking-wide text-white mb-6 animate-fade-up">
          THE ELITE MASTERMIND FOR INSURANCE AGENCY OWNERS
        </h1>

        <p className="text-lg md:text-xl text-gray-400 max-w-3xl mx-auto mb-12 animate-fade-up" style={{ animationDelay: '0.2s' }}>
          Where Agency Owners Stop Guessing and Start Leading. $299/month for Direct Access to Proven Operators Who've Built What You're Trying to Build.
        </p>

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
          <Button onClick={handleJoinNow} className="btn-primary text-sm sm:text-lg px-4 sm:px-8 py-3 sm:py-4">
            <span className="hidden sm:inline">CLAIM YOUR SEAT AT THE TABLE →</span>
            <span className="sm:hidden">JOIN NOW →</span>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default BoardroomHero;
