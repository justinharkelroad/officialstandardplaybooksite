const SalesSuccessStory = () => {
  return (
    <section className="py-20 relative">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
          {/* Left Column - Text */}
          <div className="order-2 lg:order-1 text-center lg:text-left">
            <h2 className="font-rajdhani font-bold text-4xl md:text-5xl uppercase tracking-wide text-white mb-6">
              Instead of taking our word for it, please listen to one of our success stories:
            </h2>
            <p className="text-2xl text-primary font-medium">
              I'm Dan Westrick, Allstate Agent.
            </p>
          </div>

          {/* Right Column - Video */}
          <div className="order-1 lg:order-2">
            <div className="relative max-w-md mx-auto">
              <div className="video-glow absolute -inset-4"></div>
              <div className="relative bg-dark-card rounded-lg overflow-hidden" style={{ aspectRatio: '9/16' }}>
                <script src="https://fast.wistia.com/player.js" async></script>
                <script src="https://fast.wistia.com/embed/p5r3aelfj0.js" async type="module"></script>
                <style dangerouslySetInnerHTML={{
                  __html: `
                    wistia-player[media-id='p5r3aelfj0']:not(:defined) {
                      background: center / contain no-repeat url('https://fast.wistia.com/embed/medias/p5r3aelfj0/swatch');
                      display: block; 
                      filter: blur(5px); 
                      padding-top:177.78%;
                    }
                  `
                }} />
                <wistia-player media-id="p5r3aelfj0" aspect="0.5625"></wistia-player>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SalesSuccessStory;