import React, { useEffect } from 'react';
import SEOHead from '@/components/SEOHead';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import ChallengeCoreCards from '@/components/sections/ChallengeCoreCards';
import ChallengeProcessFlow from '@/components/sections/ChallengeProcessFlow';
import ChallengeWeeklyBreakdown from '@/components/sections/ChallengeWeeklyBreakdown';
import ChallengeTransformation from '@/components/sections/ChallengeTransformation';
import ChallengePainSolution from '@/components/sections/ChallengePainSolution';
import ChallengeFAQ from '@/components/sections/ChallengeFAQ';
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
  const faqs = [
    {
      question: "What is the Producer Challenge?",
      answer: "The Producer Challenge is a six-week accountability and training program for insurance producers, LSPs, and agency team members. Each weekday includes a short video lesson, a daily form submission, and clear action steps. Every Friday, participants complete a Discovery Stack reflection that summarizes their week and sends insights directly to leadership."
    },
    {
      question: "Who is the challenge designed for?",
      answer: "It's built for agency teams—producers, service staff, and sales leaders—who want daily structure, measurable results, and better communication inside the agency."
    },
    {
      question: "How does enrollment work?",
      answer: "Enrollment is continuous. Anyone who signs up Monday through Saturday will automatically receive their pre-launch message on Sunday at 9:00 AM, preparing them for the challenge kickoff the following day. If someone enrolls after 8:55 AM on Sunday, they'll start the next week's challenge instead."
    },
    {
      question: "What happens after I enroll a team member?",
      answer: "They will receive login credentials for the app, get an onboarding email and text Sunday morning with optional pre-work, and begin their first training Monday morning with an alert to complete Module 1. You will receive an emailed video and receipt outlining the structure of the challenge and what to expect."
    },
    {
      question: "What's the daily routine inside the Challenge?",
      answer: "Monday–Friday: Watch the training video, submit the daily form with your key takeaway and action step, and mark your Core 4 progress: Body, Being, Balance, Business. On Fridays they will complete a Discovery Stack and share with Agent. On Sunday they can optionally choose to do 'Sunday Service' work and declare 1 big action they will accomplish in each domain that week."
    },
    {
      question: "What is the \"Core 4\"?",
      answer: "The Core 4 tracks daily habits that drive performance: Body (health and energy), Being (mindset and spiritual alignment), Balance (relationships and gratitude), and Business (productivity and sales execution). Each checked box = proof of daily integrity."
    },
    {
      question: "What is a \"Discovery Stack\"?",
      answer: "A guided reflection form completed each Friday. It helps participants process lessons, wins, and challenges for the week, then share the link with leadership for visibility."
    },
    {
      question: "How is progress measured?",
      answer: "The game in the app will have each participant can earn up to 35 points per week: 28 points from Core 4 completions and 7 points from daily Stack reflections. Scores appear on the live dashboard for easy tracking. The real-time feedback for the Agency Owner per week includes daily takeaway + action item sent to Agency Owner email (30), Friday Discovery Stack Lessons shared with Agency Owner (6), and optional Sunday Service 'One Big Thing' declaration form for each domain (7) - 43 total possible feedback loops for Agency Owner within the 42 days!"
    },
    {
      question: "What topics are covered in the 6 weeks?",
      answer: "Sales, communication, and leadership skills including: Consistency & Non-Negotiables, Follow-Up Systems, Speed to Contact, The Three-Bucket System, Referrals & Retention, Objection Handling, Closing Confidence, and Setting 90-Day Targets."
    },
    {
      question: "How long do I have access to the app?",
      answer: "49 days from the enrollment date—enough to finish all modules and reflections. After 49 days, you can upgrade to full Arsenal-level access to keep your data, continue tracking, and unlock advanced modules."
    },
    {
      question: "What does the agency owner receive during the challenge?",
      answer: "Daily takeaway + action item sent to Agency Owner email (30), Friday Discovery Stack Lessons shared with Agency Owner (6), and optional Sunday Service 'One Big Thing' declaration form for each domain (7) - 43 total possible feedback loops for Agency Owner within the 42 days."
    },
    {
      question: "What is the main goal of the Challenge?",
      answer: "To build a culture of clarity, communication, and consistency. Producers learn to align their actions with agency expectations and develop daily proof of performance instead of relying on motivation."
    },
    {
      question: "Is there a refund policy?",
      answer: "No refunds. This mirrors The Standard Playbook's standard policy across all programs."
    },
    {
      question: "What happens after completion?",
      answer: "At the six-week mark, participants can continue using the app via monthly membership (Stack or Arsenal). Agency Owners can get access to 25% off a Membership Level in Standard for life."
    },
    {
      question: "How do agencies purchase seats?",
      answer: "Agency owners can buy individual seats on StandardPlaybook.com. Purchases trigger instant onboarding for each participant."
    },
    {
      question: "How much time does it take each day?",
      answer: "Modules average 8–10 minutes per day plus 5 minutes to complete the form—about 15 minutes total. Days where stacking is requested that would extend to about 30 mins (Fridays + 2 other modules)."
    },
    {
      question: "What if I miss a day?",
      answer: "You can catch up inside the app anytime, but missed forms reduce your weekly score. Consistency is the metric that matters most."
    },
    {
      question: "Who runs the program?",
      answer: "The Producer Challenge is produced by The Standard Playbook, founded by Justin E. Harkelroad, specializing in structured accountability systems for insurance agencies and business teams."
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
        
        {/* FAQ Section */}
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