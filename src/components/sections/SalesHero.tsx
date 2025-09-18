
import { Button } from '@/components/ui/button';
import VideoPlayer from '@/components/VideoPlayer';
import { Target, ArrowRight } from 'lucide-react';

interface SalesHeroProps {
  onScrollToPayment: () => void;
}

const SalesHero = ({ onScrollToPayment }: SalesHeroProps) => {
  return (
    <section className="relative py-20 overflow-hidden">
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/10 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-primary-accent/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '3s' }} />
      </div>

      {/* Title Section */}
      <div className="container mx-auto px-4 text-center relative z-10 mb-16">
        <h1 className="font-rajdhani font-bold text-5xl md:text-7xl uppercase tracking-wide text-white mb-6 animate-fade-up">
          Your Sales Team Is a Direct Reflection of Your Leadership
        </h1>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start max-w-6xl mx-auto">
          {/* Left Column - Video */}
          <div className="order-1 lg:order-1">
            <div className="relative max-w-md mx-auto animate-fade-up">
              <div className="video-glow absolute -inset-4"></div>
              <div className="relative bg-dark-card rounded-lg overflow-hidden" style={{ aspectRatio: '9/16' }}>
                <script src="https://fast.wistia.com/player.js" async></script>
                <script src="https://fast.wistia.com/embed/cixz70ajf6.js" async type="module"></script>
                <style dangerouslySetInnerHTML={{
                  __html: `
                    wistia-player[media-id='cixz70ajf6']:not(:defined) {
                      background: center / contain no-repeat url('https://fast.wistia.com/embed/medias/cixz70ajf6/swatch');
                      display: block; 
                      filter: blur(5px); 
                      padding-top:177.78%;
                    }
                  `
                }} />
                <wistia-player media-id="cixz70ajf6" aspect="0.5625"></wistia-player>
              </div>
            </div>
          </div>

          {/* Right Column - Transformation Content */}
          <div className="order-2 lg:order-2 animate-fade-up" style={{ animationDelay: '0.2s' }}>
            <h2 className="font-rajdhani font-bold text-3xl md:text-4xl uppercase tracking-wide text-white mb-6">
              8 Weeks to Sales Transformation: Access + Acceleration Architecture
            </h2>
            <div className="text-lg text-gray-300 leading-relaxed space-y-6">
              <p>Most sales training gives you scripts. We give you the first two pillars of transformation:</p>
              <div className="space-y-6">
                <div className="bg-dark-card border border-primary/20 p-6 rounded-lg">
                  <h3 className="font-rajdhani font-bold text-xl uppercase tracking-wide text-primary mb-4">WEEKS 1-4: ACCESS PHASE</h3>
                  <ul className="space-y-2 text-gray-300">
                    <li>• The Proven Process Armory: Not theory, battle-tested systems</li>
                    <li>• Direct Weekly Access to Justin's mind</li>
                    <li>• Call Scoring Access: See truth, not hope</li>
                    <li>• Framework Access: The exact blueprints that built empires</li>
                  </ul>
                </div>
                <div className="bg-dark-card border border-primary/20 p-6 rounded-lg">
                  <h3 className="font-rajdhani font-bold text-xl uppercase tracking-wide text-primary mb-4">WEEKS 5-8: ACCELERATION PHASE</h3>
                  <ul className="space-y-2 text-gray-300">
                    <li>• Compress 20 years of sales mistakes into 8 weeks</li>
                    <li>• Steal systems that took decades to perfect</li>
                    <li>• Skip the learning curve through structured implementation</li>
                    <li>• Your team inherits wisdom without the wounds</li>
                  </ul>
                </div>
              </div>
              <p className="text-primary font-medium">"Why learn from your failures when you can download ours?"</p>
              <p className="text-sm text-gray-400">But here's the truth: This gives you ACCESS and ACCELERATION.<br />For full transformation, you need all five pillars.<br />That's why 73% of graduates step into The Boardroom or Directive.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SalesHero;
