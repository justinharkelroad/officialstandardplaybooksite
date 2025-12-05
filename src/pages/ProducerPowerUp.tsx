import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import ChallengeHero from '@/components/sections/ChallengeHero';
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
import ProducerFinalCTA from '@/components/sections/ProducerFinalCTA';
import ChallengeFAQ from '@/components/sections/ChallengeFAQ';
import ChallengeNavigation from '@/components/sections/ChallengeNavigation';

const ProducerPowerUp = () => {
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
      question: "What's the investment policy?",
      answer: "All enrollments are final. We provide immediate access to the full system and are confident in the transformation your producer will experience. After completion, producers can continue with Standard programs at a 25% lifetime discount."
    }
  ];

  return (
    <div className="min-h-screen">
      <Navigation />
      <ChallengeHero
        title="/lovable-uploads/ec2eda85-7cf5-4aa9-8997-cee842066d4b.png"
        subtitle="Transform your producer from reactive chaos to systematic execution—in 42 days. You'll see every step."
        videoId="1UhWckfDqDw"
        showEnrollButton={false}
        onEnrollClick={() => {}}
      />
      <ProducerCorePromise />
      <ProducerSystemNotCourse />
      <ProducerAccountability />
      <ProducerDailyRhythm />
      <ProducerCurriculum />
      <ProducerCulturalImpact />
      <ProducerTechStack />
      <ProducerROI />
      <ProducerOutcome />
      <ProducerLogistics />
      <ProducerFinalCTA />
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
