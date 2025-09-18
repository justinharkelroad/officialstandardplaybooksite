import React, { useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import SEOHead from '@/components/SEOHead';

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
    };
  }, []);

  return (
    <>
      <SEOHead config={{
        title: "The Challenge - Private Landing Page",
        description: "Private challenge page",
        keywords: [],
      }} />
      
      <div className="min-h-screen bg-background">
        {/* Hero Section with Video and Form */}
        <section className="py-12 md:py-20 relative">
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

        {/* Identity Transformation Section - Reused from ProducerPowerUp */}
        <section className="py-16 relative">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="font-rajdhani font-bold text-4xl md:text-5xl uppercase tracking-wide text-white mb-12">
                How This Transforms Your Team's Identity
              </h2>
              <div className="bg-dark-card border-primary/20 rounded-lg p-8">
                <ul className="space-y-4 text-left">
                  <li className="flex items-start">
                    <span className="text-primary mr-3 mt-1">•</span>
                    <span className="text-gray-300">Weekly Discovery Stacks that reinforce your team's identity as value-first professionals</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-primary mr-3 mt-1">•</span>
                    <span className="text-gray-300">Personal accountability mindset activation that transforms how team members see themselves</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-primary mr-3 mt-1">•</span>
                    <span className="text-gray-300">Activity-to-results understanding that builds confidence in their producer identity</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-primary mr-3 mt-1">•</span>
                    <span className="text-gray-300">Owner Fast Track Coaching PDF to accelerate leadership identity development</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-primary mr-3 mt-1">•</span>
                    <span className="text-gray-300">60 days of identity-reinforcing habit development through The Standard App</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-primary mr-3 mt-1">•</span>
                    <span className="text-gray-300">Cultural transformation that elevates everyone's professional identity</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-primary mr-3 mt-1">•</span>
                    <span className="text-gray-300">Continued growth through Standard Membership with 25% discount</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default TheChallenge;