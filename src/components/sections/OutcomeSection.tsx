import VideoPlayer from '@/components/VideoPlayer';
import { useScrollReveal } from '@/hooks/useScrollReveal';

const OutcomeSection = () => {
  const { ref, isVisible } = useScrollReveal();

  return (
    <section 
      ref={ref as React.RefObject<HTMLElement>}
      className={`py-32 relative transition-all duration-500 ${isVisible ? 'opacity-100' : 'opacity-0'}`}
    >
      {/* Calm gradient background */}
      <div className="absolute inset-0 bg-gradient-to-b from-dark-surface/50 to-dark-bg" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-5xl mx-auto text-center">
          {/* Centered Title */}
          <div className="space-y-6 mb-12">
            <h3 className="font-oswald font-bold text-4xl md:text-6xl uppercase tracking-tight text-white">
              <span className="text-primary drop-shadow-lg font-black">
                WHY
              </span>
              <span className="ml-2">
                DOES THIS MATTER?
              </span>
            </h3>
            <p className="text-xl text-gray-300 leading-relaxed max-w-3xl mx-auto">
              The deeper purpose behind everything we do
            </p>
          </div>

          {/* Centered Video with Accent Glow */}
          <div className="relative max-w-4xl mx-auto">
            <div className="absolute -inset-4 bg-primary/20 rounded-lg blur-2xl animate-accent-glow" />
            <div className="relative aspect-video overflow-hidden rounded-lg bg-black">
              <VideoPlayer
                videoId="nJXdk5ymg-I"
                title="WHY DOES THIS MATTER?"
                className="absolute inset-0 w-full h-full"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default OutcomeSection;
