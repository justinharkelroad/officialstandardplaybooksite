import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Play } from 'lucide-react';

// Declare Wistia custom element for TypeScript
declare global {
  namespace JSX {
    interface IntrinsicElements {
      'wistia-player': any;
    }
  }
}

const CallScoringHero = () => {
  useEffect(() => {
    // Load Wistia scripts
    const wistiaPlayerScript = document.createElement('script');
    wistiaPlayerScript.src = 'https://fast.wistia.com/player.js';
    wistiaPlayerScript.async = true;
    document.body.appendChild(wistiaPlayerScript);

    const wistiaEmbedScript = document.createElement('script');
    wistiaEmbedScript.src = 'https://fast.wistia.com/embed/2up9n0g3tz.js';
    wistiaEmbedScript.async = true;
    wistiaEmbedScript.type = 'module';
    document.body.appendChild(wistiaEmbedScript);

    return () => {
      const existingWistiaPlayer = document.querySelector('script[src="https://fast.wistia.com/player.js"]');
      if (existingWistiaPlayer) {
        document.body.removeChild(existingWistiaPlayer);
      }
      
      const existingWistiaEmbed = document.querySelector('script[src="https://fast.wistia.com/embed/2up9n0g3tz.js"]');
      if (existingWistiaEmbed) {
        document.body.removeChild(existingWistiaEmbed);
      }
    };
  }, []);

  const handleCTA = () => {
    // Scroll to pricing section
    const pricingSection = document.getElementById('pricing');
    if (pricingSection) {
      pricingSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary-accent/10 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '3s' }} />
      </div>

      <div className="container mx-auto px-4 text-center relative z-10 py-20">
        <h1 className="font-rajdhani font-bold text-5xl md:text-7xl uppercase tracking-wide text-white mb-6 animate-fade-up">
          Stop Spending Hours
          <br />
          <span className="text-gradient">Reviewing Calls</span>
        </h1>
        
        <p className="text-2xl md:text-3xl text-gray-300 max-w-4xl mx-auto mb-4 animate-fade-up font-bold" style={{ animationDelay: '0.1s' }}>
          Start Spending Minutes Transforming Teams
        </p>

        <p className="text-lg md:text-xl text-gray-400 max-w-3xl mx-auto mb-12 animate-fade-up" style={{ animationDelay: '0.2s' }}>
          Every call scored. Every agent better. Every day.
        </p>

        {/* Wistia Video */}
        <div className="max-w-4xl mx-auto mb-8 animate-fade-up" style={{ animationDelay: '0.3s' }}>
          <div className="w-full aspect-video rounded-lg overflow-hidden bg-black shadow-2xl">
            <style dangerouslySetInnerHTML={{
              __html: `
                wistia-player[media-id='2up9n0g3tz']:not(:defined) { 
                  background: center / contain no-repeat url('https://fast.wistia.com/embed/medias/2up9n0g3tz/swatch'); 
                  display: block; 
                  filter: blur(5px); 
                  padding-top:56.25%; 
                }
                wistia-player[media-id='2up9n0g3tz'] {
                  width: 100%;
                  height: 100%;
                }
              `
            }} />
            <wistia-player media-id="2up9n0g3tz" aspect="1.7778"></wistia-player>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-up" style={{ animationDelay: '0.4s' }}>
          <Button 
            className="bg-primary text-white font-bold text-lg px-8 py-4 hover:bg-primary/90"
            onClick={handleCTA}
          >
            <Play className="w-5 h-5 mr-2" />
            START SCORING
          </Button>
          <Button 
            variant="outline"
            className="border-primary/50 text-white font-bold text-lg px-8 py-4 hover:bg-primary/10"
            onClick={() => window.open('https://AGENCYCOACHING.as.me/standardfit', '_blank')}
          >
            BOOK A DEMO
          </Button>
        </div>
      </div>
    </section>
  );
};

export default CallScoringHero;
