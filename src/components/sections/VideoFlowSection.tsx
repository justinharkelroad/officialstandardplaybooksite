import VideoPlayer from '@/components/VideoPlayer';
import { useScrollReveal } from '@/hooks/useScrollReveal';

const VideoFlowSection = () => {
  // Only the first 3 videos - 4th moved to OutcomeSection
  const videos = [
    {
      id: 'mnFNUSuJ4eA',
      title: 'WHO IS THIS FOR?',
      emphasis: 'WHO',
      description: 'Discover if you\'re ready to transform your agency and life'
    },
    {
      id: 'SY3rJs--TmM', 
      title: 'HOW DO WE DO THIS?',
      emphasis: 'HOW',
      description: 'Our proven system for creating lasting change'
    },
    {
      id: 'gVJiw_FX1Ps',
      title: 'WHAT DO YOU GET?',
      emphasis: 'WHAT', 
      description: 'The complete transformation package waiting for you'
    }
  ];

  return (
    <section className="pt-32 pb-20 relative">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Section Title */}
          <div className="text-center mb-20">
            <h1 className="font-oswald font-bold text-5xl md:text-7xl uppercase tracking-tight text-white mb-6">
              <span className="text-primary">FOR WHO?</span> THE COMMITTED
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Three pillars that define who we serve and how we serve them
            </p>
          </div>

          <div className="space-y-32">
            {videos.map((video, index) => {
              const { ref, isVisible } = useScrollReveal();
              
              return (
                <div 
                  key={video.id} 
                  ref={ref as React.RefObject<HTMLDivElement>}
                  className={`relative text-center transition-all duration-500 ${
                    isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                  }`}
                >
                  {/* Blue accent divider */}
                  {index > 0 && (
                    <div className="absolute -top-16 left-1/2 transform -translate-x-1/2 w-1 h-12 bg-gradient-to-b from-primary to-transparent" />
                  )}
                  
                  {/* Centered Title */}
                  <div className="space-y-4 mb-12">
                    <h3 className="font-oswald font-bold text-3xl md:text-5xl uppercase tracking-tight text-white">
                      <span className="text-primary drop-shadow-lg font-black">
                        {video.emphasis}
                      </span>
                      <span className="ml-2">
                        {video.title.replace(video.emphasis, '').trim()}
                      </span>
                    </h3>
                    <p className="text-lg text-gray-300 leading-relaxed max-w-3xl mx-auto">
                      {video.description}
                    </p>
                  </div>

                  {/* Interactive Card with Accent Glow */}
                  <div className="relative max-w-5xl mx-auto group">
                    <div className="absolute -inset-2 bg-primary/10 rounded-lg blur-xl group-hover:bg-primary/20 transition-all duration-300" />
                    <div className="relative aspect-video overflow-hidden rounded-lg bg-black border border-primary/20 group-hover:border-primary/40 transition-all duration-300">
                      <VideoPlayer
                        videoId={video.id}
                        title={video.title}
                        className="absolute inset-0 w-full h-full"
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default VideoFlowSection;