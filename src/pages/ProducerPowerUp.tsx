
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import ChallengeHero from '@/components/sections/ChallengeHero';
import ChallengePainSolution from '@/components/sections/ChallengePainSolution';
import ChallengeFeatures from '@/components/sections/ChallengeFeatures';
import ChallengePricing from '@/components/sections/ChallengePricing';
import ChallengeFAQ from '@/components/sections/ChallengeFAQ';
import ChallengeNavigation from '@/components/sections/ChallengeNavigation';

const ProducerPowerUp = () => {
  const painPoints = [
    "Call reluctance holding you back",
    "Price objections shutting down deals",
    "Personal burnout from inconsistent results"
  ];

  const solutions = [
    "Increased daily activity through systematic approach",
    "Fluent discovery conversations that uncover needs",
    "Objection-to-decision mastery that closes deals",
    "Core 4 power score habit stack for peak performance"
  ];

  const features = [
    {
      title: "Daily Micro-Videos",
      description: "30 weekday micro-videos delivered 7 AM"
    },
    {
      title: "60-Day App Access",
      description: "Private stacking, habit streaks, Core 4 tracker"
    },
    {
      title: "Assignments",
      description: "Friday Discovery-Stack + Sunday 'General's Tent' planning emails"
    },
    {
      title: "Lifetime Access",
      description: "Lifetime Access to emailed trainings"
    }
  ];

  const pricingOptions = [
    {
      title: "Single Seat",
      price: "$299",
      highlighted: false
    },
    {
      title: "Team Pack (5+)",
      price: "$249",
      badge: "Owner Seat FREE",
      features: ["Per seat pricing", "Free owner enrollment when you buy 5+"],
      highlighted: false
    }
  ];

  const faqs = [
    {
      question: "When does the challenge start?",
      answer: "Challenges start every Sunday. You'll receive your credentials within 48 hours of enrollment and begin the following Sunday."
    },
    {
      question: "How much time commitment is required?",
      answer: "Just 3 minutes per day for the micro-videos, plus optional time to implement the strategies. The content is designed to fit into your busy schedule."
    },
    {
      question: "What if I miss a day?",
      answer: "No problem! You have lifetime access to all content, so you can catch up anytime. The app tracks your progress and habit streaks."
    },
    {
      question: "Is there a refund policy?",
      answer: "Due to the nature of the digital content and immediate access provided, all sales are final. We're confident in the value you'll receive."
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
        title="Producer Power-Up"
        subtitle="Stack habits. Supercharge sales and life—in 42 days."
        videoId="placeholder-video-id"
        onEnrollClick={scrollToPricing}
      />
      <ChallengePainSolution
        painPoints={painPoints}
        solutions={solutions}
      />
      <ChallengeFeatures
        title="What You Get"
        features={features}
        layout="grid"
      />
      <div id="pricing">
        <ChallengePricing
          title="Pricing & Team Bonus"
          options={pricingOptions}
          onEnrollClick={handleEnrollClick}
        />
      </div>
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
