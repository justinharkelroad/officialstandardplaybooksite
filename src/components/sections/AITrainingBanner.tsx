
import { Button } from '@/components/ui/button';
import { ExternalLink } from 'lucide-react';

const AITrainingBanner = () => {
  return (
    <section className="py-8 relative">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-6xl mx-auto items-center">
          
          {/* Left Side - AI Tips & Tricks */}
          <div className="bg-dark-card border border-primary/20 rounded-lg p-6 text-center">
            <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-white font-rajdhani font-bold text-xl">AI</span>
            </div>
            <h3 className="font-rajdhani font-bold text-2xl text-white uppercase mb-2">
              Tips &<br />Tricks
            </h3>
          </div>

          {/* Center - Main Content */}
          <div className="bg-dark-card border border-primary/20 rounded-lg p-6 text-center lg:col-span-1">
            <h2 className="font-rajdhani font-bold text-xl md:text-2xl text-white uppercase tracking-wide mb-4">
              Join the Free Zoom Training on Utilizing<br />
              <span className="text-gradient">Useful AI Apps in Your Business and Life</span><br />
              on 6/26 at 3PM EST.
            </h2>
          </div>

          {/* Right Side - Button */}
          <div className="bg-dark-card border border-primary/20 rounded-lg p-6 text-center">
            <a 
              href="https://us06web.zoom.us/meeting/register/BkNY4nBZSHelZBJy_guehA" 
              target="_blank" 
              rel="noopener noreferrer"
            >
              <Button className="btn-primary text-lg px-8 py-4 w-full">
                Register Now
                <ExternalLink className="w-5 h-5 ml-2" />
              </Button>
            </a>
          </div>

        </div>
      </div>
    </section>
  );
};

export default AITrainingBanner;
