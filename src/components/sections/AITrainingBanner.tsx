
import { Button } from '@/components/ui/button';
import { ExternalLink } from 'lucide-react';

const AITrainingBanner = () => {
  return (
    <section className="py-6 relative">
      <div className="container mx-auto px-4">
        <div className="bg-dark-card border border-primary/20 rounded-lg p-6 max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            
            {/* Left Side - AI Icon and Tips & Tricks */}
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-white font-rajdhani font-bold text-xl">AI</span>
              </div>
              <div>
                <h3 className="font-rajdhani font-bold text-xl text-white uppercase">
                  Tips & Tricks
                </h3>
              </div>
            </div>

            {/* Center - Main Content */}
            <div className="flex-1 text-center">
              <h2 className="font-rajdhani font-bold text-lg md:text-xl text-white uppercase tracking-wide">
                Join the Free Zoom Training on Utilizing{' '}
                <span className="text-gradient">Useful AI Apps in Your Business and Life</span>{' '}
                on 6/26 at 3PM EST.
              </h2>
            </div>

            {/* Right Side - Button */}
            <div className="flex-shrink-0">
              <a 
                href="https://us06web.zoom.us/meeting/register/BkNY4nBZSHelZBJy_guehA" 
                target="_blank" 
                rel="noopener noreferrer"
              >
                <Button className="btn-primary text-base px-6 py-3">
                  Register Now
                  <ExternalLink className="w-4 h-4 ml-2" />
                </Button>
              </a>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
};

export default AITrainingBanner;
