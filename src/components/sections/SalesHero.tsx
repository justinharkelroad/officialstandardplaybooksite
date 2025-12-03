
import { Button } from '@/components/ui/button';
import { BookOpen } from 'lucide-react';

const SalesHero = () => {
  return (
    <section className="relative pt-32 pb-20 overflow-hidden">
      {/* Title Section Above Hero */}
      <div className="container mx-auto px-4 text-center relative z-10 mb-16">
        <h1 className="font-oswald font-bold text-5xl md:text-7xl uppercase tracking-tight text-white mb-6 animate-fade-up">
          Your Sales Team Is a Direct Reflection of Your Leadership
        </h1>
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

          {/* Content Section */}
          <div className="animate-fade-up text-center max-w-4xl mx-auto" style={{ animationDelay: '0.2s' }}>
            <h2 className="font-oswald font-bold text-4xl md:text-5xl lg:text-6xl uppercase tracking-tight text-white mb-6">
              GET COMPLETE CLARITY IN HOW TO HOLD YOUR TEAMS ACCOUNTABLE TO HOW THEY SELL AND WHAT THEY DO IN JUST 8 WEEKS. GUARANTEED
            </h2>
            <p className="text-xl text-gray-300 mb-8">
              You will get these 3 things immediately handed to you:
            </p>
            <div className="relative">
              <div className="absolute -inset-2 bg-gradient-to-r from-primary/20 to-primary-accent/20 rounded-lg blur-lg opacity-60"></div>
              <div className="relative bg-dark-card border border-primary/20 rounded-lg p-8">
                <div className="space-y-6">
                  <div className="flex items-center space-x-4">
                    <BookOpen className="w-8 h-8 text-primary flex-shrink-0" />
                    <span className="text-primary font-medium text-2xl">SALES PROCESS FRAMEWORK</span>
                  </div>
                  <div className="flex items-center space-x-4">
                    <BookOpen className="w-8 h-8 text-primary flex-shrink-0" />
                    <span className="text-primary font-medium text-2xl">ACCOUNTABILITY SYSTEM</span>
                  </div>
                  <div className="flex items-center space-x-4">
                    <BookOpen className="w-8 h-8 text-primary flex-shrink-0" />
                    <span className="text-primary font-medium text-2xl">CONSEQUENCE LADDER</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SalesHero;
