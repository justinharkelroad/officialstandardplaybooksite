import React from 'react';
import SEOHead from '@/components/SEOHead';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import CallScoringHero from '@/components/sections/CallScoringHero';
import CallScoringFeatures from '@/components/sections/CallScoringFeatures';
import CallScoringTeam from '@/components/sections/CallScoringTeam';
import CallScoringTypes from '@/components/sections/CallScoringTypes';
import CallScoringDemo from '@/components/sections/CallScoringDemo';
import CallScoringPricing from '@/components/sections/CallScoringPricing';

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
        <CallScoringTeam />
        <CallScoringTypes />
        <CallScoringDemo />
        
        <CallScoringPricing />
        <Footer />
      </div>
    </>
  );
};

export default CallScoring;
