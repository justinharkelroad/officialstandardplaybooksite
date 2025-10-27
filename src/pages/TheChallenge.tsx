import React, { useEffect } from 'react';
import SEOHead from '@/components/SEOHead';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import ChallengeCoreCards from '@/components/sections/ChallengeCoreCards';
import ChallengeProcessFlow from '@/components/sections/ChallengeProcessFlow';
import ChallengeWeeklyBreakdown from '@/components/sections/ChallengeWeeklyBreakdown';
import ChallengeTransformation from '@/components/sections/ChallengeTransformation';
import ChallengePainSolution from '@/components/sections/ChallengePainSolution';
import CheckoutModal from '@/components/CheckoutModal';
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

        {/* Problem & Possibility Section */}
        <ChallengePainSolution 
          painPoints={[
            "Your team is yearning for a training course that creates actual takeaways and action items instead of boring quizzes at the end"
          ]}
          solutions={[
            "After 6 weeks your team member is showing up for themselves, their families and the agency in a way they never have before."
          ]}
        />

        {/* Pricing and CTA Section */}
        <section className="py-12 relative">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <div className="bg-dark-card border border-primary/20 rounded-lg p-8 md:p-12 shadow-2xl">
                <h3 className="font-rajdhani font-bold text-3xl md:text-4xl text-white mb-8 uppercase">
                  6 WEEKS - 30 TRAININGS - $299
                </h3>
                <CheckoutModal 
                  buttonText="ENROLL MY TEAM MEMBER"
                  buttonClassName="btn-primary text-lg px-12 py-6 w-full md:w-auto"
                />
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