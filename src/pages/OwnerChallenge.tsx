
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import ChallengeHero from '@/components/sections/ChallengeHero';
import ChallengePainSolution from '@/components/sections/ChallengePainSolution';
import ChallengeFeatures from '@/components/sections/ChallengeFeatures';

import ChallengeTimeline from '@/components/sections/ChallengeTimeline';
import ChallengeFAQ from '@/components/sections/ChallengeFAQ';
import ChallengeNavigation from '@/components/sections/ChallengeNavigation';
import TeamPromotion from '@/components/sections/TeamPromotion';

const OwnerChallenge = () => {
  const painPoints = [
    "Groundhog-Day operations with no clear progress",
    "Eroding energy and strained relationships",
    "No playbook for systematic growth and accountability",
    "Constantly trying to re-discover your purpose"
  ];

  const solutions = [
    "Daily schedule OS that maximizes productivity",
    "Core 4 habits locked in for consistent performance",
    "Process-driven team with clear expectations",
    "Action maps for accountability and measurable results"
  ];

  const features = [
    {
      title: "30 WEEKDAY OWNER-LEVEL MICRO-LESSONS"
    },
    {
      title: "60-DAY APP ACCESS FOR CORE 4 TRACKING & STACKING"
    },
    {
      title: "CEO TEMPLATES & SOP SWIPE FILES"
    },
    {
      title: "FRIDAY DISCOVERY-STACKS & SUNDAY GENERAL'S TENT EMAILS"
    },
    {
      title: "LIFETIME REPLAY OF EMAILED RESOURCES"
    },
    {
      title: "CREDENTIALS DELIVERED WITHIN 48 H; START FIRST SUNDAY"
    }
  ];


  const timelineSteps = [
    {
      step: 1,
      title: "Checkout",
      description: "Complete your enrollment and payment"
    },
    {
      step: 2,
      title: "Confirmation",
      description: "Receive confirmation email with next steps"
    },
    {
      step: 3,
      title: "App Access",
      description: "Get credentials within 48 hours"
    },
    {
      step: 4,
      title: "Day-1 Sunday",
      description: "Begin your 42-day transformation"
    }
  ];

  const faqs = [
    {
      question: "When do challenges start?",
      answer: "Challenges begin every Sunday. You'll receive your app credentials within 48 hours of enrollment."
    },
    {
      question: "How much time is required daily?",
      answer: "Just 3 minutes for the daily micro-lesson, plus time to implement the strategies. Designed for busy agency owners."
    },
    {
      question: "How are metrics tracked?",
      answer: "The app includes Core 4 tracking, habit stacking features, and progress monitoring to keep you accountable."
    },
    {
      question: "What's the refund policy?",
      answer: "All sales are final. We provide immediate access to valuable content and are confident in the transformation you'll experience."
    }
  ];


  return (
    <div className="min-h-screen">
      <Navigation />
      <ChallengeHero
        title="/lovable-uploads/70586c79-98cd-42f1-8a44-5625af2a88f7.png"
        subtitle="6-Week Core 4 & Leadership Challenge."
        videoId="vPPKhd4B2Tk"
        showEnrollButton={false}
        onEnrollClick={() => {}}
      />
      <ChallengePainSolution
        painPoints={painPoints}
        solutions={solutions}
      />
      
      {/* App Demo Image Section */}
      <section className="py-16 relative">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto text-center">
            <img 
              src="/lovable-uploads/d9dddbd2-3799-4f48-9c81-3d75640ea134.png" 
              alt="App Demo - All Built on an App That Creates Power for Your Life" 
              className="w-full h-auto rounded-lg shadow-2xl"
            />
          </div>
        </div>
      </section>
      
      <TeamPromotion />
      <ChallengeFeatures
        title="Exactly What You Get"
        features={features}
        layout="list"
      />
      {/* Coming Soon Section */}
      <section className="py-20 relative">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="bg-dark-card border-primary/20 rounded-lg p-12">
              <h2 className="font-rajdhani font-bold text-4xl md:text-5xl uppercase tracking-wide text-red-500 mb-4">
                COMING IN FALL OF 2025
              </h2>
            </div>
          </div>
        </div>
      </section>
      <ChallengeTimeline
        title="How Enrollment Works"
        steps={timelineSteps}
      />
      <ChallengeFAQ faqs={faqs} />
      <ChallengeNavigation
        otherChallenge={{
          title: "Producer Power-Up Challenge",
          description: "Stack habits. Supercharge sales and life—in 42 days. Perfect for individual producers and sales teams.",
          link: "/producer-power-up"
        }}
      />
      <Footer />
    </div>
  );
};

export default OwnerChallenge;
