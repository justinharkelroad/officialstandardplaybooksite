const SalesSuccessStory = () => {
  return (
    <section className="py-20 relative">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
          {/* Left Column - Text */}
          <div className="order-1 lg:order-1 text-center lg:text-left">
            <p className="text-primary font-medium text-lg mb-4 uppercase tracking-wider">Success Story</p>
            <h2 className="font-oswald font-bold text-4xl md:text-5xl uppercase tracking-tight text-white mb-6">
              He Paid Attention to My Culture First
            </h2>
            <p className="text-2xl text-primary font-medium">
              Dan Westrick - Allstate Agency Owner
            </p>
          </div>

          {/* Right Column - Video */}
          <div className="order-2 lg:order-2">
            <div className="relative max-w-md mx-auto">
              <div className="video-glow absolute -inset-4"></div>
              <div className="relative bg-dark-card rounded-lg overflow-hidden" style={{ aspectRatio: '9/16' }}>
                <iframe
                  src="https://fast.wistia.net/embed/iframe/p5r3aelfj0?autoPlay=false&fullscreenButton=true&playButton=true&smallPlayButton=true&volumeControl=true&controlsVisibleOnLoad=true"
                  title="Dan Westrick Success Story"
                  allow="autoplay; fullscreen"
                  allowFullScreen
                  frameBorder="0"
                  scrolling="no"
                  className="w-full h-full rounded-lg"
                  style={{ aspectRatio: '9/16' }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SalesSuccessStory;