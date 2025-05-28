
import VideoPlayer from '@/components/VideoPlayer';

const BoardroomBusiness = () => {
  return (
    <section className="py-20 relative">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="font-rajdhani font-bold text-4xl md:text-5xl uppercase tracking-wide text-white mb-8">
            ITS NOT JUST BUSINESS...
          </h2>
        </div>

        <div className="max-w-6xl mx-auto space-y-16">
          {/* First Video - BEING */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div className="relative aspect-video bg-dark-card rounded-lg overflow-hidden">
              <VideoPlayer 
                videoId="jFDqWyLuwHI"
                title="Being - Your Connection To God"
                className="w-full h-full rounded-lg"
              />
            </div>
            <div className="text-center lg:text-left">
              <h3 className="font-rajdhani font-bold text-3xl md:text-4xl uppercase tracking-wide text-white mb-4">
                BEING
              </h3>
              <p className="text-xl text-gray-300">
                Your Connection To God
              </p>
            </div>
          </div>

          {/* Second Video - BODY */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div className="text-center lg:text-left lg:order-1">
              <h3 className="font-rajdhani font-bold text-3xl md:text-4xl uppercase tracking-wide text-white mb-4">
                BODY
              </h3>
              <p className="text-xl text-gray-300">
                Weaponize Your Health
              </p>
            </div>
            <div className="relative aspect-video bg-dark-card rounded-lg overflow-hidden lg:order-2">
              <VideoPlayer 
                videoId="qUWOzQF1Xrg"
                title="Body - Weaponize Your Health"
                className="w-full h-full rounded-lg"
              />
            </div>
          </div>

          {/* Third Video - BALANCE */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div className="relative aspect-video bg-dark-card rounded-lg overflow-hidden">
              <VideoPlayer 
                videoId="RMsIHtsv2ak"
                title="Balance - Your Relationships Matter"
                className="w-full h-full rounded-lg"
              />
            </div>
            <div className="text-center lg:text-left">
              <h3 className="font-rajdhani font-bold text-3xl md:text-4xl uppercase tracking-wide text-white mb-4">
                BALANCE
              </h3>
              <p className="text-xl text-gray-300">
                Your Relationships Matter
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BoardroomBusiness;
