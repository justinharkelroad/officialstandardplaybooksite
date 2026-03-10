
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import ContentMeta from '@/components/ContentMeta';
import ChallengeHero from '@/components/sections/ChallengeHero';
import ChallengePainSolution from '@/components/sections/ChallengePainSolution';
import ChallengeFeatures from '@/components/sections/ChallengeFeatures';

import ChallengeTimeline from '@/components/sections/ChallengeTimeline';
import ChallengeFAQ from '@/components/sections/ChallengeFAQ';
import ChallengeNavigation from '@/components/sections/ChallengeNavigation';
import TeamPromotion from '@/components/sections/TeamPromotion';
import GHLFormPopup from '@/components/GHLFormPopup';

const OwnerChallenge = () => {
  const painPoints = [
    "You're trapped in repetitive operations that don't reflect your vision as a leader",
    "Your energy is depleted because your actions don't align with your identity as an owner",
    "You lack the systematic approach that matches your ambition for growth and impact",
    "You're constantly searching for purpose because you've lost connection to your core identity"
  ];

  const solutions = [
    "Operating system that reflects your identity as a visionary leader who maximizes impact",
    "Core 4 habits that reinforce your identity as a consistent, high-performing owner",
    "Process-driven team culture that mirrors your leadership identity and clear vision",
    "Accountability systems that ensure your actions match your identity as a results-driven leader"
  ];

  const features = [
    {
      title: "IDENTITY-DRIVEN OWNER MICRO-LESSONS",
      description: "30 weekday lessons that transform how you see yourself as a leader"
    },
    {
      title: "CORE 4 LEADERSHIP HABIT SYSTEM",
      description: "60-day app access to build the habits that define exceptional ownership"
    },
    {
      title: "EXECUTIVE IDENTITY TEMPLATES",
      description: "CEO templates and SOPs that reinforce your leadership identity"
    },
    {
      title: "WEEKLY LEADERSHIP REINFORCEMENT",
      description: "Friday Discovery-Stacks and Sunday Sunday Service emails for identity development"
    },
    {
      title: "LIFETIME TRANSFORMATION ACCESS",
      description: "Permanent access to all resources for ongoing leadership identity growth"
    },
    {
      title: "IMMEDIATE IDENTITY ACTIVATION",
      description: "Credentials delivered within 48 hours; begin your transformation first Sunday"
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
      question: "When does my identity transformation begin?",
      answer: "Your leadership identity transformation begins every Sunday. You'll receive your app credentials within 48 hours of enrollment to start building your new identity immediately."
    },
    {
      question: "How much time is required for this identity shift?",
      answer: "Just 3 minutes daily for the micro-lessons, plus time to implement the identity-reinforcing strategies. Designed specifically for busy agency owners ready to transform their leadership identity."
    },
    {
      question: "How do I track my identity development?",
      answer: "The app includes Core 4 tracking, habit stacking features, and progress monitoring specifically designed to reinforce your evolving leadership identity and measure your transformation."
    },
    {
      question: "What's the investment policy?",
      answer: "All investments are final. We provide immediate access to identity-transforming content and are confident in the leadership transformation you'll experience through this proven framework."
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
        title="Your Complete Leadership Identity Transformation"
        features={features}
        layout="grid"
      />
      
      {/* Five Pillars Integration */}
      <section className="py-20 relative">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto text-center mb-16">
            <h2 className="font-rajdhani font-bold text-4xl md:text-5xl uppercase tracking-wide text-white mb-8">
              Built on The Standard's Five Pillars
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              This challenge transforms your leadership identity through our proven framework for ownership excellence
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="bg-dark-card border-primary/20 rounded-lg p-6 text-center">
              <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-primary font-bold text-xl">1</span>
              </div>
              <h3 className="font-rajdhani font-bold text-xl text-white mb-2">IDENTITY</h3>
              <p className="text-gray-300 text-sm">Transform how you see yourself as a leader and owner</p>
            </div>
            
            <div className="bg-dark-card border-primary/20 rounded-lg p-6 text-center">
              <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-primary font-bold text-xl">2</span>
              </div>
              <h3 className="font-rajdhani font-bold text-xl text-white mb-2">HABITS</h3>
              <p className="text-gray-300 text-sm">Build the Core 4 habits that sustain leadership excellence</p>
            </div>
            
            <div className="bg-dark-card border-primary/20 rounded-lg p-6 text-center">
              <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-primary font-bold text-xl">3</span>
              </div>
              <h3 className="font-rajdhani font-bold text-xl text-white mb-2">SYSTEMS</h3>
              <p className="text-gray-300 text-sm">Implement systematic approaches to business leadership</p>
            </div>
            
            <div className="bg-dark-card border-primary/20 rounded-lg p-6 text-center">
              <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-primary font-bold text-xl">4</span>
              </div>
              <h3 className="font-rajdhani font-bold text-xl text-white mb-2">ACCOUNTABILITY</h3>
              <p className="text-gray-300 text-sm">Create ownership responsibility for team and results</p>
            </div>
            
            <div className="bg-dark-card border-primary/20 rounded-lg p-6 text-center">
              <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-primary font-bold text-xl">5</span>
              </div>
              <h3 className="font-rajdhani font-bold text-xl text-white mb-2">RESULTS</h3>
              <p className="text-gray-300 text-sm">Achieve measurable leadership transformation in 42 days</p>
            </div>
          </div>
        </div>
      </section>
      {/* Coming Soon Section */}
      <section className="py-20 relative">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="mb-8">
              <GHLFormPopup 
                buttonText="GET NOTIFIED WHEN AVAILABLE"
                buttonClassName="bg-primary text-primary-foreground hover:bg-primary/90 px-8 py-4 text-lg font-bold rounded-lg"
              />
            </div>
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
      <ContentMeta lastUpdated="March 2026" />
      <Footer />
    </div>
  );
};

export default OwnerChallenge;
