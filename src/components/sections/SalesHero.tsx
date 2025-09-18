
import { Button } from '@/components/ui/button';
import { BookOpen } from 'lucide-react';

interface SalesHeroProps {
  onScrollToPayment: () => void;
}

const SalesHero = ({ onScrollToPayment }: SalesHeroProps) => {
  return (
    <section className="relative pt-32 pb-20 overflow-hidden">
      {/* Title Section Above Hero */}
      <div className="container mx-auto px-4 text-center relative z-10 mb-16">
        <h1 className="font-rajdhani font-bold text-5xl md:text-7xl uppercase tracking-wide text-white mb-6 animate-fade-up">
          Your Sales Team Is a Direct Reflection of Your Leadership
        </h1>
      </div>

      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/10 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-primary-accent/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '3s' }} />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start max-w-6xl mx-auto">
          {/* Left Column - Video */}
          <div className="order-1 lg:order-1">
            <div className="relative max-w-md mx-auto animate-fade-up">
              <div className="video-glow absolute -inset-4"></div>
              <div className="relative bg-dark-card rounded-lg overflow-hidden" style={{ aspectRatio: '9/16' }}>
                <iframe
                  src="https://fast.wistia.net/embed/iframe/cixz70ajf6?autoPlay=false&fullscreenButton=true&playButton=true&smallPlayButton=true&volumeControl=true&controlsVisibleOnLoad=true"
                  title="Sales Training Video"
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

          {/* Right Column - Hero Content */}
          <div className="order-2 lg:order-2 animate-fade-up text-center lg:text-left" style={{ animationDelay: '0.2s' }}>
            <h2 className="font-rajdhani font-bold text-4xl md:text-5xl lg:text-6xl uppercase tracking-wide text-white mb-6">
              GET COMPLETE CLARITY IN HOW TO HOLD YOUR TEAMS ACCOUNTABLE TO HOW THEY SELL AND WHAT THEY DO IN JUST 8 WEEKS. GUARANTEED
            </h2>
            <p className="text-xl text-gray-300 mb-8">
              You will get these 3 things immediately handed to you:
            </p>
            <div className="space-y-4 text-left">
              <div className="flex items-center space-x-3">
                <BookOpen className="w-5 h-5 text-primary flex-shrink-0" />
                <span className="text-primary font-medium text-lg">SALES PROCESS FRAMEWORK</span>
              </div>
              <div className="flex items-center space-x-3">
                <BookOpen className="w-5 h-5 text-primary flex-shrink-0" />
                <span className="text-primary font-medium text-lg">ACCOUNTABILITY SYSTEM</span>
              </div>
              <div className="flex items-center space-x-3">
                <BookOpen className="w-5 h-5 text-primary flex-shrink-0" />
                <span className="text-primary font-medium text-lg">CONSEQUENCE LADDER</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SalesHero;
