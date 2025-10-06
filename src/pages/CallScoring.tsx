import React from 'react';
import SEOHead from '@/components/SEOHead';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import CallScoringHero from '@/components/sections/CallScoringHero';
import CallScoringFeatures from '@/components/sections/CallScoringFeatures';
import CallScoringDemo from '@/components/sections/CallScoringDemo';
import CallScoringTeam from '@/components/sections/CallScoringTeam';
import CallScoringTypes from '@/components/sections/CallScoringTypes';
import CallScoringSupport from '@/components/sections/CallScoringSupport';
import CallScoringPricing from '@/components/sections/CallScoringPricing';
import CallScoringFAQ from '@/components/sections/CallScoringFAQ';
import CallScoringCTA from '@/components/sections/CallScoringCTA';

const CallScoring = () => {
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
        <CallScoringDemo />
        <CallScoringTeam />
        <CallScoringTypes />
        <CallScoringSupport />
        <CallScoringPricing />
        <CallScoringFAQ />
        <CallScoringCTA />
        <Footer />
      </div>
    </>
  );
};

export default CallScoring;
