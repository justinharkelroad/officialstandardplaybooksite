import React from 'react';
import SEOHead from '@/components/SEOHead';
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
import { ArrowDown } from 'lucide-react';

const ProducerChallengeLanding = () => {
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

  return (
    <>
      <SEOHead config={{
        title: "Producer Power Up Challenge - 6-Week Sales Transformation",
        description: "Transform your producer from reactive chaos to systematic execution in 42 days. Daily accountability, weekly reports, and full visibility into their growth.",
        keywords: ["producer challenge", "sales training", "insurance producer", "accountability", "team development"],
      }} />
      
      <div className="min-h-screen bg-dark">
        {/* Hero Section - No Navigation, No Logo */}
        <section className="pt-12 md:pt-20 pb-8 md:pb-12 relative bg-dark">
          <div className="container mx-auto px-4 text-center relative z-10">
            <h1 className="font-oswald font-bold text-2xl md:text-4xl lg:text-5xl uppercase tracking-tight text-white max-w-4xl mx-auto mb-8 animate-fade-up">
              Transform your producer from reactive chaos to systematic execution—in 42 days. You'll see every step.
            </h1>
          </div>
        </section>

        {/* Full Width YouTube Video */}
        <section className="pb-12 md:pb-20 relative bg-dark">
          <div className="container mx-auto px-4 max-w-5xl">
            <div className="relative aspect-video rounded-xl overflow-hidden shadow-2xl shadow-primary/20">
              <iframe
                src="https://www.youtube.com/embed/2R8Q3PGA77I?rel=0&modestbranding=1"
                title="Producer Challenge Video"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="absolute inset-0 w-full h-full"
              />
            </div>
          </div>
        </section>

        {/* Problem → Possibility Section (Stacked with Arrow) */}
        <section className="py-12 md:py-20 relative bg-dark">
          <div className="container mx-auto px-4 max-w-3xl">
            <div className="flex flex-col items-center gap-6">
              {/* Problem */}
              <div className="w-full bg-red-900/20 border border-red-500/30 rounded-lg p-6 md:p-8 text-center">
                <h3 className="font-oswald font-bold text-xl md:text-3xl text-red-400 uppercase mb-4">
                  THE PROBLEM
                </h3>
                <p className="text-white text-lg md:text-xl leading-relaxed">
                  Your producer relies on mood and motivation. Follow-up is emotional and chaotic. They operate without a documented system and communication with you is reactive.
                </p>
              </div>

              {/* Arrow */}
              <div className="flex items-center justify-center">
                <div className="w-12 h-12 rounded-full bg-primary/20 border border-primary/40 flex items-center justify-center">
                  <ArrowDown className="w-6 h-6 text-primary" />
                </div>
              </div>

              {/* Possibility */}
              <div className="w-full bg-green-900/20 border border-primary/30 rounded-lg p-6 md:p-8 text-center">
                <h3 className="font-oswald font-bold text-xl md:text-3xl text-primary uppercase mb-4">
                  THE POSSIBILITY
                </h3>
                <p className="text-white text-lg md:text-xl leading-relaxed">
                  After 6 weeks, they execute based on a daily system. Follow-up becomes predictable. They proactively communicate takeaways and action items—directly to you.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Pricing + CTA Section */}
        <section className="py-12 md:py-16 relative bg-dark">
          <div className="container mx-auto px-4 max-w-2xl text-center">
            <div className="bg-dark-card border border-primary/20 rounded-lg p-8 md:p-12">
              <h3 className="font-oswald font-bold text-2xl md:text-4xl text-white uppercase mb-6">
                6 WEEKS - 30 TRAININGS - $299
              </h3>
              
              <Button 
                onClick={() => window.open('https://createthestandard.com/credit-card-page', '_blank')}
                className="btn-primary text-sm sm:text-lg md:text-xl px-6 sm:px-10 py-4 sm:py-6 w-full max-w-md inline-flex items-center justify-center gap-2 animate-pulse hover:animate-none shadow-[0_0_20px_rgba(59,130,246,0.5)] hover:shadow-[0_0_30px_rgba(59,130,246,0.8)] transition-all duration-300 mb-4"
              >
                ENROLL NOW
              </Button>
              
              <VideoModal 
                videoId="1NzNXlsGOQs"
                title="Challenge Quick Explainer"
                trigger={
                  <Button 
                    variant="outline"
                    className="text-sm sm:text-base px-6 py-3 w-full max-w-md inline-flex items-center justify-center gap-2 border-primary/50 hover:bg-primary/10"
                  >
                    Quick Explainer
                  </Button>
                }
              />
            </div>
            
            <p className="text-gray-300 text-sm md:text-base leading-relaxed mt-6">
              Rolling enrollment—sign up by Friday, they start Monday. App access immediately upon checkout.
            </p>
          </div>
        </section>

        {/* Curriculum Section */}
        <ProducerCurriculum />

        {/* Rest of sections from TheChallenge */}
        <ProducerCorePromise />
        <ProducerSystemNotCourse />
        <ProducerAccountability />
        <ProducerDailyRhythm />
        <ProducerCulturalImpact />
        <ProducerTechStack />
        <ProducerROI />
        <ProducerOutcome />
        <ProducerLogistics />

        {/* Final CTA Section */}
        <section className="py-20 relative bg-dark">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="font-oswald font-bold text-3xl md:text-5xl uppercase tracking-tight text-white mb-6">
                Ready to Build Your Next Top Producer?
              </h2>
              <p className="text-lg md:text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
                Enroll your producer by Friday to secure their spot for Monday's kickoff.
              </p>
              
              <div className="bg-dark-card border border-primary/20 rounded-lg p-8 md:p-12">
                <div className="text-2xl md:text-4xl font-oswald font-bold text-white mb-6">
                  $299 <span className="text-gray-400 text-lg md:text-xl">/ per producer</span>
                </div>
                <Button 
                  onClick={() => window.open('https://createthestandard.com/credit-card-page', '_blank')}
                  className="btn-primary text-sm sm:text-lg md:text-xl px-6 sm:px-10 py-4 sm:py-6 inline-flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(59,130,246,0.5)] hover:shadow-[0_0_30px_rgba(59,130,246,0.8)] transition-all duration-300"
                >
                  ENROLL NOW
                </Button>
                <p className="text-gray-400 text-sm mt-4">
                  30 daily reports + 6 weekly reflections sent directly to you
                </p>
              </div>

              <button 
                onClick={() => window.open('https://AGENCYCOACHING.as.me/standardfit', '_blank')}
                className="mt-8 text-primary hover:text-primary/80 font-medium text-base md:text-lg transition-colors"
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

export default ProducerChallengeLanding;
