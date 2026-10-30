import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import SEOHead from '@/components/SEOHead';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import CallScoringHero from '@/components/sections/CallScoringHero';
import CallScoringFeatures from '@/components/sections/CallScoringFeatures';
import CallScoringTeam from '@/components/sections/CallScoringTeam';
import CallScoringTypes from '@/components/sections/CallScoringTypes';
import { Button } from '@/components/ui/button';
import { Check, Download } from 'lucide-react';

const AGENCY_BRAIN_PRICING_URL = 'https://myagencybrain.com/info#pricing';

const includedPlans = [
  { name: 'Core', price: '$299/mo', calls: '20 AI-scored calls a month' },
  { name: 'Plus', price: '$449/mo', calls: '50 AI-scored calls a month' },
  { name: 'Pro', price: '$599/mo', calls: '100 AI-scored calls a month' },
];

const downloadExample = () => {
  const link = document.createElement('a');
  link.href = '/Example_Sales_Call_Result.pdf';
  link.download = 'Example_Sales_Call_Result.pdf';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

// Call scoring is no longer sold as its own plan; it ships inside every Agency Brain tier.
const IncludedInAgencyBrain = () => (
  <section id="pricing" className="py-20 relative bg-dark-card/30">
    <div className="container mx-auto px-4">
      <div className="max-w-4xl mx-auto text-center">
        <Button
          className="bg-primary text-white font-bold text-lg px-8 py-6 hover:bg-primary/90 mb-16"
          onClick={downloadExample}
        >
          <Download className="w-5 h-5 mr-2" />
          See Example Call Score Result
        </Button>

        <h2 className="font-oswald font-bold text-4xl md:text-5xl uppercase tracking-tight text-white mb-6">
          Included In Every
          <br />
          <span className="text-gradient">Agency Brain Plan</span>
        </h2>
        <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-12">
          Call scoring isn't a separate subscription anymore. Pick the Agency Brain plan with the call volume you need.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {includedPlans.map((plan) => (
            <div key={plan.name} className="bg-dark-card/50 border border-primary/20 rounded-lg p-6">
              <p className="font-oswald font-bold text-2xl text-white uppercase">{plan.name}</p>
              <p className="font-rajdhani font-bold text-4xl text-primary my-3">{plan.price}</p>
              <p className="flex items-center justify-center gap-2 text-gray-300">
                <Check className="w-5 h-5 text-primary flex-shrink-0" />
                {plan.calls}
              </p>
            </div>
          ))}
        </div>

        <p className="text-gray-400 mb-8">
          Add Live Call Coach for $129 per rep a month on any tier.
        </p>

        <Button
          className="bg-primary text-white hover:bg-primary/90 font-bold text-xl px-10 py-8"
          onClick={() => window.open(AGENCY_BRAIN_PRICING_URL, '_blank', 'noopener,noreferrer')}
        >
          SEE AGENCY BRAIN PLANS
        </Button>
      </div>
    </div>
  </section>
);

const CallScoring = () => {
  const location = useLocation();

  useEffect(() => {
    // Check if we need to scroll to pricing section after navigation
    if (location.state?.scrollToPricing) {
      const timer = setTimeout(() => {
        const element = document.getElementById('pricing');
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [location.state]);

  return (
    <>
      <SEOHead config={{
        title: "Standard Call Scoring - AI-Powered Call Evaluation | The Standard Playbook",
        description: "Transform your sales coaching in minutes. AI-powered call scoring that gives instant insights, consistent feedback, and accelerates team performance.",
        keywords: ['call scoring', 'sales coaching', 'AI call analysis', 'sales training', 'call evaluation', 'team coaching'],
      }} />
      
      <div className="min-h-screen">
        <Navigation />
        <CallScoringHero />
        <CallScoringFeatures />
        <CallScoringTeam />
        <CallScoringTypes />
        <IncludedInAgencyBrain />
        <Footer />
      </div>
    </>
  );
};

export default CallScoring;
