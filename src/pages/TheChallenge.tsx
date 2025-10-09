import React, { useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import SEOHead from '@/components/SEOHead';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import ChallengeCoreCards from '@/components/sections/ChallengeCoreCards';
import ChallengeProcessFlow from '@/components/sections/ChallengeProcessFlow';
import ChallengeWeeklyBreakdown from '@/components/sections/ChallengeWeeklyBreakdown';
import ChallengeTransformation from '@/components/sections/ChallengeTransformation';

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
        const observer = new MutationObserver(function(mutations) {
          mutations.forEach(function(mutation) {
            if (mutation.type === 'childList') {
              const thankYouText = document.querySelector('div, p, span');
              if (thankYouText && thankYouText.innerText.includes('Thank you. We will be in contact')) {
                fbq('track', 'Lead', {
                  content_name: 'Producer Challenge Prelaunch',
                  status: 'ModalThankYou'
                });
                observer.disconnect();
              }
            }
          });
        });
        observer.observe(document.body, { childList: true, subtree: true });
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

        {/* Hero Section with Video and Form */}
        <section className="pb-12 md:pb-20 relative">
          <div className="container mx-auto px-4 max-w-7xl">
            <div className={`grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 ${formPosition === 'left' ? 'lg:grid-flow-col-dense' : ''}`}>
              
              {/* Video Column */}
              <div className={`${formPosition === 'left' ? 'lg:col-start-2' : ''}`}>
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

              {/* Form Column */}
              <div className={`${formPosition === 'left' ? 'lg:col-start-1' : ''} flex items-center`}>
                <Card className="w-full bg-dark-card border-primary/20 shadow-2xl min-h-[600px] lg:min-h-[700px]">
                  <CardContent className="p-0 h-full">
                    <div className="w-full h-full min-h-[600px] lg:min-h-[700px]">
                      <iframe 
                        src="https://api.leadconnectorhq.com/widget/form/kCpBJeUPD521D7yEnskY" 
                        style={{
                          width: '100%',
                          height: '100%',
                          border: 'none',
                          borderRadius: '3px',
                          minHeight: '600px'
                        }}
                        id="inline-kCpBJeUPD521D7yEnskY" 
                        data-layout="{'id':'INLINE'}" 
                        data-trigger-type="alwaysShow" 
                        data-trigger-value="" 
                        data-activation-type="alwaysActivated" 
                        data-activation-value="" 
                        data-deactivation-type="neverDeactivate" 
                        data-deactivation-value="" 
                        data-form-name="Form 6" 
                        data-height="902" 
                        data-layout-iframe-id="inline-kCpBJeUPD521D7yEnskY" 
                        data-form-id="kCpBJeUPD521D7yEnskY" 
                        title="Form 6"
                      />
                    </div>
                  </CardContent>
                </Card>
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