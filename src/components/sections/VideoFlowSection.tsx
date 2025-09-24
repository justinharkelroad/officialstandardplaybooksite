import VideoPlayer from '@/components/VideoPlayer';
import { ArrowDown } from 'lucide-react';

const VideoFlowSection = () => {
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
    },
    {
      id: 'nJXdk5ymg-I',
      title: 'WHY DOES THIS MATTER?',
      emphasis: 'WHY',
      description: 'The deeper purpose behind everything we do'
    }
  ];

  return (
    <section className="py-20 relative">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-rajdhani font-bold text-4xl md:text-5xl uppercase tracking-wide text-white mb-4">
              Your Journey Starts Here
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Follow the path from discovery to transformation
            </p>
          </div>

          <div className="space-y-32">
            {videos.map((video, index) => (
              <div key={video.id} className="relative text-center">
                {/* Centered Title */}
                <div className="space-y-6 mb-12">
                  <h3 className="font-rajdhani font-bold text-4xl md:text-6xl uppercase tracking-wide text-white">
                    <span className="text-primary-accent drop-shadow-lg font-black">
                      {video.emphasis}
                    </span>
                    <span className="ml-2">
                      {video.title.replace(video.emphasis, '').trim()}
                    </span>
                  </h3>
                  <p className="text-xl text-gray-300 leading-relaxed max-w-3xl mx-auto">
                    {video.description}
                  </p>
                </div>

                {/* Centered Full-Width Video */}
                <div className="relative max-w-5xl mx-auto">
                  <div className="relative aspect-video bg-dark-card rounded-lg overflow-hidden">
                    <div className="absolute -inset-2 bg-gradient-to-r from-primary/20 to-primary-accent/20 rounded-lg blur-sm"></div>
                    <div className="relative">
                      <VideoPlayer 
                        videoId={video.id}
                        title={video.title}
                        className="w-full h-full rounded-lg"
                      />
                    </div>
                  </div>
                </div>

                {/* Connection Arrow - except for last item */}
                {index < videos.length - 1 && (
                  <div className="flex justify-center my-12">
                    <div className="relative">
                      <div className="absolute inset-0 bg-gradient-to-b from-primary/30 to-primary-accent/30 rounded-full blur-lg scale-150"></div>
                      <div className="relative bg-dark-card border-2 border-primary/40 rounded-full p-4">
                        <ArrowDown className="w-8 h-8 text-primary-accent animate-bounce" />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Final CTA */}
          <div className="text-center mt-20">
            <div className="relative inline-block">
              <div className="absolute -inset-4 bg-gradient-to-r from-primary/20 to-primary-accent/20 rounded-lg blur-lg"></div>
              <div className="relative bg-dark-card border border-primary/30 rounded-lg p-8">
                <h3 className="font-rajdhani font-bold text-2xl md:text-3xl uppercase text-white mb-4">
                  Ready to Begin Your Transformation?
                </h3>
                <p className="text-gray-300 mb-6">
                  Every journey starts with a single step. Take yours today.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default VideoFlowSection;