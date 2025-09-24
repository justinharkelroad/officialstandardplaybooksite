import VideoPlayer from '@/components/VideoPlayer';

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
    <section className="pt-8 pb-20 relative">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="space-y-32">
            {videos.map((video) => (
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
                  <div className="relative aspect-video overflow-hidden rounded-lg bg-black">
                    <VideoPlayer
                      videoId={video.id}
                      title={video.title}
                      className="absolute inset-0 w-full h-full"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default VideoFlowSection;