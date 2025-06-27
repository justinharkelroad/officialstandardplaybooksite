
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
    if (option.title === "Single Seat") {
      window.open("https://buy.stripe.com/9B6bJ11yCcGW9S8gWo4Vy05", "_blank");
    } else if (option.title === "Team Pack (5+)") {
      window.open("https://buy.stripe.com/cNidR9b9cgXc4xO21u4Vy06", "_blank");
    }
  };

  return (
    <div className="min-h-screen">
      <Navigation />
      <ChallengeHero
        title="/lovable-uploads/ec2eda85-7cf5-4aa9-8997-cee842066d4b.png"
        subtitle="Stack habits. Supercharge sales and life—in 42 days."
        videoId="1UhWckfDqDw"
        onEnrollClick={scrollToPricing}
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
              src="/lovable-uploads/862c875f-96ae-42fe-b043-eec8370ea39e.png" 
              alt="App Demo - Track Daily Habits and Build Culture" 
              className="w-full h-auto rounded-lg shadow-2xl"
            />
          </div>
        </div>
      </section>
      
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
