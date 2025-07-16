
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import ChallengeHero from '@/components/sections/ChallengeHero';
import ChallengePainSolution from '@/components/sections/ChallengePainSolution';
import ChallengeFeatures from '@/components/sections/ChallengeFeatures';

import ChallengeFAQ from '@/components/sections/ChallengeFAQ';
import ChallengeNavigation from '@/components/sections/ChallengeNavigation';

const ProducerPowerUp = () => {
  const painPoints = [
    "You know you're capable of more, but fear holds you back from making the calls",
    "Price objections defeat you because you don't believe in your own value",
    "Inconsistent results drain your energy and erode your identity as a high performer",
    "You're stuck in cycles that don't match who you're meant to become"
  ];

  const solutions = [
    "Daily activity becomes natural when aligned with your identity as a high performer",
    "Discovery conversations flow effortlessly from a place of genuine service and value",
    "Objection handling transforms into confident value presentation from someone who knows their worth",
    "Core 4 habits create the foundation for sustained excellence and personal transformation"
  ];

  const features = [
    {
      title: "IDENTITY-DRIVEN MICRO-LESSONS",
      description: "30 weekday micro-videos that rewire your identity as a high-performing producer"
    },
    {
      title: "CORE 4 TRANSFORMATION TRACKER",
      description: "60-day app access to build the habits that define excellence in your field"
    },
    {
      title: "WEEKLY IDENTITY REINFORCEMENT",
      description: "Friday Discovery-Stacks and Sunday General's Tent emails that strengthen your producer identity"
    },
    {
      title: "LIFETIME TRANSFORMATION ACCESS",
      description: "Permanent access to all training materials for ongoing identity development"
    }
  ];


  const faqs = [
    {
      question: "When does my identity transformation begin?",
      answer: "Your producer identity transformation starts every Sunday. You'll receive your credentials within 48 hours of enrollment to begin building your new identity immediately."
    },
    {
      question: "How much time is required for this identity shift?",
      answer: "Just 3 minutes daily for the micro-videos, plus time to implement the identity-reinforcing strategies. Designed to fit into your schedule while maximizing identity development."
    },
    {
      question: "What if I miss a day during my transformation?",
      answer: "No problem! You have lifetime access to all content for ongoing identity development. The app tracks your progress and habit streaks to maintain your producer identity growth."
    },
    {
      question: "What's the investment policy?",
      answer: "All investments are final. We provide immediate access to identity-transforming content and are confident in the producer transformation you'll experience."
    }
  ];


  return (
    <div className="min-h-screen">
      <Navigation />
      <ChallengeHero
        title="/lovable-uploads/ec2eda85-7cf5-4aa9-8997-cee842066d4b.png"
        subtitle="Stack habits. Supercharge sales and life—in 42 days."
        videoId="1UhWckfDqDw"
        showEnrollButton={false}
        onEnrollClick={() => {}}
      />
      <ChallengePainSolution
        painPoints={painPoints}
        solutions={solutions}
      />
      
      {/* Identity Transformation for Teams Section */}
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
      
      {/* App Demo Image Section */}
      <section className="py-16 relative">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto text-center">
            <img 
              src="/lovable-uploads/862c875f-96ae-42fe-b043-eec8370ea39e.png" 
              alt="App Demo - Track Daily Habits and Build Culture" 
              className="w-full h-auto rounded-lg shadow-2xl"
            />
          </div>
        </div>
      </section>
      
      <ChallengeFeatures
        title="Your Complete Identity Transformation Package"
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
              This challenge transforms your producer identity through our proven framework for excellence
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="bg-dark-card border-primary/20 rounded-lg p-6 text-center">
              <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-primary font-bold text-xl">1</span>
              </div>
              <h3 className="font-rajdhani font-bold text-xl text-white mb-2">IDENTITY</h3>
              <p className="text-gray-300 text-sm">Transform how you see yourself as a producer</p>
            </div>
            
            <div className="bg-dark-card border-primary/20 rounded-lg p-6 text-center">
              <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-primary font-bold text-xl">2</span>
              </div>
              <h3 className="font-rajdhani font-bold text-xl text-white mb-2">HABITS</h3>
              <p className="text-gray-300 text-sm">Build the Core 4 habits that sustain excellence</p>
            </div>
            
            <div className="bg-dark-card border-primary/20 rounded-lg p-6 text-center">
              <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-primary font-bold text-xl">3</span>
              </div>
              <h3 className="font-rajdhani font-bold text-xl text-white mb-2">SYSTEMS</h3>
              <p className="text-gray-300 text-sm">Implement systematic approaches to sales success</p>
            </div>
            
            <div className="bg-dark-card border-primary/20 rounded-lg p-6 text-center">
              <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-primary font-bold text-xl">4</span>
              </div>
              <h3 className="font-rajdhani font-bold text-xl text-white mb-2">ACCOUNTABILITY</h3>
              <p className="text-gray-300 text-sm">Create personal responsibility for results</p>
            </div>
            
            <div className="bg-dark-card border-primary/20 rounded-lg p-6 text-center">
              <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-primary font-bold text-xl">5</span>
              </div>
              <h3 className="font-rajdhani font-bold text-xl text-white mb-2">RESULTS</h3>
              <p className="text-gray-300 text-sm">Achieve measurable transformation in 42 days</p>
            </div>
          </div>
        </div>
      </section>
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
      <ChallengeFAQ faqs={faqs} />
      <ChallengeNavigation
        otherChallenge={{
          title: "Agency Owner Core 4 & Leadership Challenge",
          description: "6-Week Core 4 & Leadership Challenge designed specifically for agency owners ready to raise their standard.",
          link: "/owner-challenge"
        }}
      />
      <Footer />
    </div>
  );
};

export default ProducerPowerUp;
