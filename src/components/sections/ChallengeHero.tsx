
import { Button } from '@/components/ui/button';
import VideoPlayer from '@/components/VideoPlayer';

interface ChallengeHeroProps {
  title: string;
  subtitle: string;
  backgroundImage?: string;
  videoId?: string;
  onEnrollClick: () => void;
  showEnrollButton?: boolean;
}

const ChallengeHero = ({ 
  title, 
  subtitle, 
  backgroundImage, 
  videoId,
  onEnrollClick, 
  showEnrollButton = true 
}: ChallengeHeroProps) => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-32">
      {/* Background with subtle overlay */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-primary-accent/10 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 text-center relative z-10">
        <h1 className="font-rajdhani font-bold text-4xl md:text-6xl lg:text-7xl uppercase tracking-wide text-white mb-6 animate-fade-up">
          {title}
        </h1>
        
        <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto mb-12 animate-fade-up" style={{ animationDelay: '0.2s' }}>
          {subtitle}
        </p>

        {/* Video Frame */}
        {videoId && (
          <div className="relative max-w-4xl mx-auto mb-12 animate-fade-up" style={{ animationDelay: '0.3s' }}>
            <div className="video-glow absolute -inset-4"></div>
            <div className="relative aspect-video bg-dark-card rounded-lg overflow-hidden">
              <VideoPlayer 
                videoId={videoId}
                title="Challenge Video"
                className="w-full h-full rounded-lg"
              />
            </div>
          </div>
        )}

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
