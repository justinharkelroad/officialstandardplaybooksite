
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import ChallengeHero from '@/components/sections/ChallengeHero';
import ChallengePainSolution from '@/components/sections/ChallengePainSolution';
import ChallengeFeatures from '@/components/sections/ChallengeFeatures';
import ChallengePricing from '@/components/sections/ChallengePricing';
import ChallengeTimeline from '@/components/sections/ChallengeTimeline';
import ChallengeFAQ from '@/components/sections/ChallengeFAQ';
import ChallengeNavigation from '@/components/sections/ChallengeNavigation';

const OwnerChallenge = () => {
  const painPoints = [
    "Groundhog-Day operations with no clear progress",
    "Eroding energy and strained relationships",
    "No playbook for systematic growth and accountability"
  ];

  const solutions = [
    "Daily schedule OS that maximizes productivity",
    "Core 4 habits locked in for consistent performance",
    "Process-driven team with clear expectations",
    "Action maps for accountability and measurable results"
  ];

  const features = [
    {
      title: "30 weekday owner-level micro-lessons (≈3 min)"
    },
    {
      title: "60-day App Access for Core 4 tracking & stacking"
    },
    {
      title: "CEO templates & SOP swipe files"
    },
    {
      title: "Friday Discovery-Stacks & Sunday General's Tent emails"
    },
    {
      title: "Lifetime replay of emailed resources"
    },
    {
      title: "Credentials delivered within 48 h; start first Sunday"
    }
  ];

  const pricingOptions = [
    {
      title: "Owner Seat",
      price: "$399",
      highlighted: true
    },
    {
      title: "Owner + Debrief",
      price: "$499",
      originalPrice: "$898",
      features: ["Includes Week-7 1-hour debrief call"],
      badge: "Best Value"
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

  const scrollToPricing = () => {
    const element = document.getElementById('pricing');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleEnrollClick = (option: any) => {
    // Placeholder for Stripe payment link
    console.log('Enroll clicked for:', option.title);
    // You'll replace this with actual Stripe payment URLs
  };

  return (
    <div className="min-h-screen">
      <Navigation />
      <ChallengeHero
        title="Raise the Standard of Your Agency in 42 Days"
        subtitle="6-Week Core 4 & Leadership Challenge."
        backgroundImage="/lovable-uploads/c046f138-ec79-47c2-8cee-9e5198756308.png"
        onEnrollClick={scrollToPricing}
      />
      <ChallengePainSolution
        painPoints={painPoints}
        solutions={solutions}
      />
      <ChallengeFeatures
        title="Exactly What You Get"
        features={features}
        layout="list"
      />
      <div id="pricing">
        <ChallengePricing
          title="Investment & Options"
          options={pricingOptions}
          onEnrollClick={handleEnrollClick}
        />
      </div>
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
