
import BookingModal from '@/components/BookingModal';
import { Button } from '@/components/ui/button';

const SalesHero = () => {
  return (
    <section className="relative pt-32 pb-20 overflow-hidden">
      {/* Title Section Above Hero */}
      <div className="container mx-auto px-4 text-center relative z-10 mb-16">
        <h1 className="font-oswald font-bold text-5xl md:text-7xl uppercase tracking-tight text-white mb-6 animate-fade-up">
          The Blueprint for a Scalable Sales Team
        </h1>
        <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto animate-fade-up" style={{ animationDelay: '0.1s' }}>
          A proven 8-week system to install certainty, accountability, and high performance in your agency.
        </p>
      </div>

      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/10 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-primary-accent/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '3s' }} />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-6xl mx-auto space-y-12">
          {/* Video Section */}
          <div className="animate-fade-up">
            <div className="relative max-w-4xl mx-auto">
              <div className="video-glow absolute -inset-4"></div>
              <div className="relative bg-dark-card rounded-lg overflow-hidden" style={{ aspectRatio: '16/9' }}>
                <iframe
                  src="https://www.youtube.com/embed/-VVRsXGZUaI?enablejsapi=1&controls=1&rel=0&modestbranding=1"
                  title="Sales Training Video"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="w-full h-full rounded-lg"
                />
              </div>
            </div>
          </div>

          {/* CTA Section */}
          <div className="animate-fade-up text-center max-w-4xl mx-auto" style={{ animationDelay: '0.2s' }}>
            <p className="text-xl text-gray-300 mb-8">
              In just 8 weeks, you'll have complete clarity on how to hold your team accountable—to how they sell and what they do. Guaranteed.
            </p>
            <BookingModal
              trigger={
                <Button className="btn-primary text-sm sm:text-lg px-4 sm:px-8 py-4 sm:py-6">
                  BOOK YOUR STRATEGY CALL
                </Button>
              }
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default SalesHero;
