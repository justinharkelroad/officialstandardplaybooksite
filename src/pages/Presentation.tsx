import { useEffect } from 'react';
import SlideContainer from '@/components/presentation/SlideContainer';
import { 
  TitleSlide, 
  QuestionSlide, 
  InefficienciesSlide, 
  ProfitLeaksSlide 
} from '@/components/presentation/slides/OpeningSlides';
import { 
  SolutionSlide, 
  ThreePillarsSlide 
} from '@/components/presentation/slides/SystemOverviewSlides';
import {
  Pillar1TitleSlide,
  WhyItMattersSlide,
  ThreePartProcessSlide,
  ProcessFlowSlide
} from '@/components/presentation/slides/SalesProcessSlides';
import {
  Pillar2TitleSlide,
  InconsistencyCostSlide,
  QuadIntroSlide,
  QuadMetricsSlide,
  QuadRuleSlide,
  ConsequenceTitleSlide,
  ConsequenceLadderSlide,
  CallScoringSlide,
  WhyItWorksSlide
} from '@/components/presentation/slides/AccountabilitySlides';
import {
  Pillar3TitleSlide,
  WeeklyRhythmSlide,
  RhythmMattersSlide,
  CoachingResultSlide
} from '@/components/presentation/slides/CoachingSlides';
import {
  TransformationSlide,
  OutcomesSlide,
  PromiseSlide
} from '@/components/presentation/slides/TransformationSlides';
import {
  GuaranteeSlide,
  CTASlide
} from '@/components/presentation/slides/CTASlides';

const Presentation = () => {
  // Set noindex for this private page
  useEffect(() => {
    const metaRobots = document.createElement('meta');
    metaRobots.name = 'robots';
    metaRobots.content = 'noindex, nofollow';
    document.head.appendChild(metaRobots);

    return () => {
      document.head.removeChild(metaRobots);
    };
  }, []);

  return (
    <SlideContainer>
      {/* Opening Hook (Slides 1-4) */}
      <TitleSlide />
      <QuestionSlide />
      <InefficienciesSlide />
      <ProfitLeaksSlide />
      
      {/* System Overview (Slides 5-6) */}
      <SolutionSlide />
      <ThreePillarsSlide />
      
      {/* Pillar 1: Sales Process (Slides 7-12) */}
      <Pillar1TitleSlide />
      <WhyItMattersSlide />
      <ThreePartProcessSlide />
      <ProcessFlowSlide />
      
      {/* Pillar 2: Accountability Engine (Slides 13-21) */}
      <Pillar2TitleSlide />
      <InconsistencyCostSlide />
      <QuadIntroSlide />
      <QuadMetricsSlide />
      <QuadRuleSlide />
      <ConsequenceTitleSlide />
      <ConsequenceLadderSlide />
      <CallScoringSlide />
      <WhyItWorksSlide />
      
      {/* Pillar 3: Coaching Cadence (Slides 22-25) */}
      <Pillar3TitleSlide />
      <WeeklyRhythmSlide />
      <RhythmMattersSlide />
      <CoachingResultSlide />
      
      {/* Transformation (Slides 26-28) */}
      <TransformationSlide />
      <OutcomesSlide />
      <PromiseSlide />
      
      {/* Close (Slides 29-30) */}
      <GuaranteeSlide />
      <CTASlide />
    </SlideContainer>
  );
};

export default Presentation;
