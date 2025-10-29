import React, { useEffect } from 'react';
import SEOHead from '@/components/SEOHead';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import ChallengeCoreCards from '@/components/sections/ChallengeCoreCards';
import ChallengeProcessFlow from '@/components/sections/ChallengeProcessFlow';
import ChallengeWeeklyBreakdown from '@/components/sections/ChallengeWeeklyBreakdown';
import ChallengeTransformation from '@/components/sections/ChallengeTransformation';
import ChallengePainSolution from '@/components/sections/ChallengePainSolution';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

// Declare Wistia custom element for TypeScript
declare global {
  namespace JSX {
    interface IntrinsicElements {
      'wistia-player': any;
    }
  }
}

interface TheChallengeProps {
  formPosition?: 'left' | 'right';
}

const TheChallenge = ({ formPosition = 'right' }: TheChallengeProps) => {
  useEffect(() => {
    // Load the GHL form script
    const script = document.createElement('script');
    script.src = 'https://link.msgsndr.com/js/form_embed.js';
    script.async = true;
    document.body.appendChild(script);

    // Load Wistia scripts
    const wistiaPlayerScript = document.createElement('script');
    wistiaPlayerScript.src = 'https://fast.wistia.com/player.js';
    wistiaPlayerScript.async = true;
    document.body.appendChild(wistiaPlayerScript);

    const wistiaEmbedScript = document.createElement('script');
    wistiaEmbedScript.src = 'https://fast.wistia.com/embed/1bz6nrl5ip.js';
    wistiaEmbedScript.async = true;
    wistiaEmbedScript.type = 'module';
    document.body.appendChild(wistiaEmbedScript);

    // Facebook Pixel tracking script for form submission
    const fbPixelScript = document.createElement('script');
    fbPixelScript.innerHTML = `
      document.addEventListener('DOMContentLoaded', function() {
        const observer = new MutationObserver(() => {
          const modal = document.querySelector('div, p, span');
          if (modal && modal.innerText.toLowerCase().includes('thank you')) {
            fbq('track', 'Lead', {content_name: 'Producer Challenge Prelaunch'});
            observer.disconnect();
          }
        });
        observer.observe(document.body, {childList: true, subtree: true});
      });
    `;
    document.body.appendChild(fbPixelScript);

    return () => {
      // Cleanup scripts when component unmounts
      const existingGHLScript = document.querySelector('script[src="https://link.msgsndr.com/js/form_embed.js"]');
      if (existingGHLScript) {
        document.body.removeChild(existingGHLScript);
      }
      
      const existingWistiaPlayer = document.querySelector('script[src="https://fast.wistia.com/player.js"]');
      if (existingWistiaPlayer) {
        document.body.removeChild(existingWistiaPlayer);
      }
      
      const existingWistiaEmbed = document.querySelector('script[src="https://fast.wistia.com/embed/1bz6nrl5ip.js"]');
      if (existingWistiaEmbed) {
        document.body.removeChild(existingWistiaEmbed);
      }

      if (fbPixelScript && fbPixelScript.parentNode) {
        document.body.removeChild(fbPixelScript);
      }
    };
  }, []);

  return (
    <>
      <SEOHead config={{
        title: "The Challenge - Private Landing Page",
        description: "Private challenge page",
        keywords: [],
      }} />
      
      <div className="min-h-screen">
        <Navigation />
        {/* Title Section */}
        <section className="pt-20 md:pt-32 pb-8 md:pb-12 relative">
          <div className="container mx-auto px-4 text-center relative z-10">
            <h1 className="font-rajdhani font-bold text-5xl md:text-7xl uppercase tracking-wide text-white mb-6 animate-fade-up">
              CAN WE STOP LYING?
            </h1>
            
            <div className="text-xl md:text-2xl text-gray-300 max-w-4xl mx-auto animate-fade-up" style={{ animationDelay: '0.2s' }}>
              <p className="text-white font-medium">MOST TRAINING MODULES IN OUR SPACE MAKE OUR TEAMS DREAD THEIR MORNING REQUIREMENTS. WE'RE ON A MISSION TO CHANGE THAT.</p>
            </div>
          </div>
        </section>

        {/* Hero Section with Video */}
        <section className="pb-12 md:pb-20 relative">
          <div className="container mx-auto px-4 max-w-7xl">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
              
              {/* Video Column */}
              <div>
                <div className="w-full aspect-[9/16] rounded-lg overflow-hidden bg-black shadow-2xl">
                  <style dangerouslySetInnerHTML={{
                    __html: `
                      wistia-player[media-id='1bz6nrl5ip']:not(:defined) { 
                        background: center / contain no-repeat url('https://fast.wistia.com/embed/medias/1bz6nrl5ip/swatch'); 
                        display: block; 
                        filter: blur(5px); 
                        padding-top:177.78%; 
                      }
                      wistia-player[media-id='1bz6nrl5ip'] {
                        width: 100%;
                        height: 100%;
                      }
                    `
                  }} />
                  <wistia-player media-id="1bz6nrl5ip" aspect="0.5625"></wistia-player>
                </div>
              </div>

              {/* Right Column with Problem, Possibility, and CTA */}
              <div className="flex flex-col gap-6">
                {/* Problem */}
                <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-6 lg:p-8">
                  <h3 className="font-rajdhani font-bold text-xl lg:text-3xl text-red-400 uppercase mb-4">
                    PROBLEM
                  </h3>
                  <p className="text-white text-lg lg:text-2xl leading-relaxed">
                    YOUR TEAM IS YEARNING FOR A TRAINING COURSE THAT CREATES ACTUAL TAKEAWAYS AND ACTION ITEMS INSTEAD OF BORING QUIZZES AT THE END
                  </p>
                </div>

                {/* Possibility */}
                <div className="bg-green-900/20 border border-primary/30 rounded-lg p-6 lg:p-8">
                  <h3 className="font-rajdhani font-bold text-xl lg:text-3xl text-primary uppercase mb-4">
                    POSSIBILITY
                  </h3>
                  <p className="text-white text-lg lg:text-2xl leading-relaxed">
                    AFTER 6 WEEKS YOUR TEAM MEMBER IS SHOWING UP FOR THEMSELVES, THEIR FAMILIES AND THE AGENCY IN A WAY THEY NEVER HAVE BEFORE.
                  </p>
                </div>

                {/* Pricing Box */}
                <div className="bg-dark-card border border-primary/20 rounded-lg p-6 lg:p-8 text-center">
                  <h3 className="font-rajdhani font-bold text-2xl lg:text-4xl text-white uppercase">
                    6 WEEKS - 30 TRAININGS - $299
                  </h3>
                </div>

                {/* CTA Button */}
                <Button 
                  onClick={() => window.open('https://createthestandard.com/producer-power-up-checkout-page', '_blank')}
                  className="btn-primary text-lg lg:text-xl px-8 py-4 lg:py-6 w-full inline-flex items-center justify-center gap-2 animate-pulse hover:animate-none shadow-[0_0_20px_rgba(59,130,246,0.5)] hover:shadow-[0_0_30px_rgba(59,130,246,0.8)] transition-all duration-300"
                >
                  ENROLL MY TEAM MEMBER
                </Button>
                
                {/* Enrollment Info */}
                <p className="text-gray-300 text-center text-sm lg:text-base leading-relaxed mt-4">
                  ⭐️⭐️ The Challenge is always LIVE. Your LSP begins the first Monday after enrollment. They'll get app access immediately upon checkout and receive their Challenge introduction the Sunday before their start date. ⭐️⭐️
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Button Section */}
        <section className="pb-12 relative">
          <div className="container mx-auto px-4 text-center">
            <button 
              onClick={() => window.open('https://AGENCYCOACHING.as.me/standardfit', '_blank')}
              className="bg-primary text-white font-bold text-lg px-8 py-4 rounded-lg hover:bg-primary/90 transition-all duration-300 inline-flex items-center gap-2"
            >
              Have Questions? Book A Quick Call
              <span className="text-xl">&gt;</span>
            </button>
          </div>
        </section>

        {/* Identity Transformation Section with Video */}
        <ChallengeTransformation />

        {/* Weekly Breakdown Section */}
        <ChallengeWeeklyBreakdown />

        {/* Process Flow Section */}
        <ChallengeProcessFlow />

        {/* Core Cards Section */}
        <ChallengeCoreCards />
        
        <Footer />
      </div>
    </>
  );
};

export default TheChallenge;