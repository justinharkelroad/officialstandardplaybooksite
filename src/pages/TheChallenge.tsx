import React, { useEffect } from 'react';
import SEOHead from '@/components/SEOHead';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import ProducerCorePromise from '@/components/sections/ProducerCorePromise';
import ProducerSystemNotCourse from '@/components/sections/ProducerSystemNotCourse';
import ProducerAccountability from '@/components/sections/ProducerAccountability';
import ProducerDailyRhythm from '@/components/sections/ProducerDailyRhythm';
import ProducerCurriculum from '@/components/sections/ProducerCurriculum';
import ProducerCulturalImpact from '@/components/sections/ProducerCulturalImpact';
import ProducerTechStack from '@/components/sections/ProducerTechStack';
import ProducerROI from '@/components/sections/ProducerROI';
import ProducerOutcome from '@/components/sections/ProducerOutcome';
import ProducerLogistics from '@/components/sections/ProducerLogistics';
import ChallengeFAQ from '@/components/sections/ChallengeFAQ';
import { Button } from '@/components/ui/button';
import VideoModal from '@/components/VideoModal';

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
  const faqs = [
    {
      question: "When does the challenge start?",
      answer: "The Producer Challenge runs on a rolling enrollment basis. Sign up any producer by Friday and they will automatically begin the following Monday. There are no fixed cohort dates—the system is always ready."
    },
    {
      question: "How much time does this require daily?",
      answer: "Each daily module takes approximately 3-5 minutes to watch. Including the action declaration and submission, expect 10-15 minutes per day. The weekly Discovery Stack takes about 20-30 minutes on Fridays."
    },
    {
      question: "What if my producer misses a day?",
      answer: "All content remains accessible throughout the 6-week period. While daily completion is encouraged for building the habit loop, producers can catch up if needed. You'll see exactly which modules they've completed through the daily reports."
    },
    {
      question: "What access do I get as the owner?",
      answer: "You receive every daily action report via email, plus the full PDF of each weekly Discovery Stack. This gives you unprecedented visibility into your producer's engagement, takeaways, and action commitments."
    },
    {
      question: "What's included in the app access?",
      answer: "Your producer gets 60 days of full access to The Standard App, including The Armory (30 training modules), Core 4 Tracker (habit gamification), and all 19 Stacking frameworks for emotional processing and reflection."
    },
    {
      question: "What is the \"Core 4\"?",
      answer: "The Core 4 tracks daily habits that drive performance: Body (health and energy), Being (mindset and spiritual alignment), Balance (relationships and gratitude), and Business (productivity and sales execution). Each checked box equals proof of daily integrity."
    },
    {
      question: "What is a \"Discovery Stack\"?",
      answer: "A guided reflection form completed each Friday. It helps participants process lessons, wins, and challenges for the week, then share the link with leadership for visibility."
    },
    {
      question: "What topics are covered in the 6 weeks?",
      answer: "Sales, communication, and leadership skills including: Consistency & Non-Negotiables, Follow-Up Systems, Speed to Contact, The Three-Bucket System, Referrals & Retention, Objection Handling, Closing Confidence, and Setting 90-Day Targets."
    },
    {
      question: "What happens after completion?",
      answer: "At the six-week mark, participants can continue using the app via monthly membership (Stack or Arsenal). Agency Owners can get access to 25% off a Membership Level in Standard for life."
    },
    {
      question: "What's the investment policy?",
      answer: "All enrollments are final. We provide immediate access to the full system and are confident in the transformation your producer will experience."
    }
  ];

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
        title: "The Producer Challenge - 6-Week Sales Transformation",
        description: "Transform your producer from reactive chaos to systematic execution in 42 days. Daily accountability, weekly reports, and full visibility into their growth.",
        keywords: ["producer challenge", "sales training", "insurance producer", "accountability", "team development"],
      }} />
      
      <div className="min-h-screen">
        <Navigation />
        
        {/* Hero Section */}
        <section className="pt-20 md:pt-32 pb-8 md:pb-12 relative">
          <div className="container mx-auto px-4 text-center relative z-10">
            <img 
              src="/lovable-uploads/ec2eda85-7cf5-4aa9-8997-cee842066d4b.png" 
              alt="The Producer Challenge" 
              className="mx-auto max-w-full h-auto max-h-48 object-contain mb-6 animate-fade-up"
            />
            
            <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto animate-fade-up" style={{ animationDelay: '0.2s' }}>
              Transform your producer from reactive chaos to systematic execution—in 42 days. You'll see every step.
            </p>
          </div>
        </section>

        {/* Video + CTA Section */}
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

              {/* Right Column */}
              <div className="flex flex-col gap-6">
                {/* Problem */}
                <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-6 lg:p-8">
                  <h3 className="font-oswald font-bold text-xl lg:text-3xl text-red-400 uppercase mb-4">
                    THE PROBLEM
                  </h3>
                  <p className="text-white text-lg lg:text-xl leading-relaxed">
                    Your producer relies on mood and motivation. Follow-up is emotional and chaotic. They operate without a documented system and communication with you is reactive.
                  </p>
                </div>

                {/* Possibility */}
                <div className="bg-green-900/20 border border-primary/30 rounded-lg p-6 lg:p-8">
                  <h3 className="font-oswald font-bold text-xl lg:text-3xl text-primary uppercase mb-4">
                    THE POSSIBILITY
                  </h3>
                  <p className="text-white text-lg lg:text-xl leading-relaxed">
                    After 6 weeks, they execute based on a daily system. Follow-up becomes predictable. They proactively communicate takeaways and action items—directly to you.
                  </p>
                </div>

                {/* Pricing Box */}
                <div className="bg-dark-card border border-primary/20 rounded-lg p-6 lg:p-8 text-center">
                  <h3 className="font-oswald font-bold text-2xl lg:text-4xl text-white uppercase">
                    6 WEEKS - 30 TRAININGS - $299
                  </h3>
                </div>

                {/* CTA Button */}
                <Button 
                  onClick={() => window.open('https://createthestandard.com/credit-card-page', '_blank')}
                  className="btn-primary text-lg lg:text-xl px-8 py-4 lg:py-6 w-full inline-flex items-center justify-center gap-2 animate-pulse hover:animate-none shadow-[0_0_20px_rgba(59,130,246,0.5)] hover:shadow-[0_0_30px_rgba(59,130,246,0.8)] transition-all duration-300"
                >
                  ENROLL MY PRODUCER NOW
                </Button>

                {/* Quick Explainer Button */}
                <VideoModal 
                  videoId="1NzNXlsGOQs"
                  title="Challenge Quick Explainer"
                  trigger={
                    <Button 
                      variant="outline"
                      className="text-base lg:text-lg px-8 py-4 lg:py-6 w-full inline-flex items-center justify-center gap-2 border-primary/50 hover:bg-primary/10"
                    >
                      Quick Explainer
                    </Button>
                  }
                />
                
                {/* Enrollment Info */}
                <p className="text-gray-300 text-center text-sm lg:text-base leading-relaxed mt-2">
                  Rolling enrollment—sign up by Friday, they start Monday. App access immediately upon checkout.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* New Sections */}
        <ProducerCorePromise />
        <ProducerSystemNotCourse />
        <ProducerAccountability />
        <ProducerDailyRhythm />
        <ProducerCurriculum />
        <ProducerCulturalImpact />
        <ProducerTechStack />
        <ProducerROI />
        <ProducerOutcome />
        <ProducerLogistics />

        {/* Final CTA Section */}
        <section className="py-20 relative">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="font-oswald font-bold text-4xl md:text-5xl uppercase tracking-tight text-white mb-6">
                Ready to Build Your Next Top Producer?
              </h2>
              <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
                Enroll your producer by Friday to secure their spot for Monday's kickoff.
              </p>
              
              <div className="bg-dark-card border border-primary/20 rounded-lg p-8 md:p-12">
                <div className="text-3xl md:text-4xl font-oswald font-bold text-white mb-6">
                  $299 <span className="text-gray-400 text-xl">/ per producer</span>
                </div>
                <Button 
                  onClick={() => window.open('https://createthestandard.com/credit-card-page', '_blank')}
                  className="btn-primary text-lg lg:text-xl px-8 py-4 lg:py-6 inline-flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(59,130,246,0.5)] hover:shadow-[0_0_30px_rgba(59,130,246,0.8)] transition-all duration-300"
                >
                  ENROLL MY PRODUCER NOW
                </Button>
                <p className="text-gray-400 text-sm mt-4">
                  30 daily reports + 6 weekly reflections sent directly to you
                </p>
              </div>

              <button 
                onClick={() => window.open('https://AGENCYCOACHING.as.me/standardfit', '_blank')}
                className="mt-8 text-primary hover:text-primary/80 font-medium text-lg transition-colors"
              >
                Have Questions? Book A Quick Call →
              </button>
            </div>
          </div>
        </section>

        <ChallengeFAQ 
          title="Producer Challenge — Frequently Asked Questions"
          faqs={faqs}
        />
        
        <Footer />
      </div>
    </>
  );
};

export default TheChallenge;
