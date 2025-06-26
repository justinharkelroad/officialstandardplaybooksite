
import { Card, CardContent } from '@/components/ui/card';

interface TimelineStep {
  step: number;
  title: string;
  description: string;
}

interface ChallengeTimelineProps {
  title: string;
  steps: TimelineStep[];
}

const ChallengeTimeline = ({ title, steps }: ChallengeTimelineProps) => {
  return (
    <section className="py-20 relative">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto text-center mb-16">
          <h2 className="font-rajdhani font-bold text-4xl md:text-5xl uppercase tracking-wide text-white mb-8">
            {title}
          </h2>
        </div>

        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {steps.map((step, index) => (
              <Card key={index} className="bg-dark-card border-primary/20 hover:shadow-xl transition-shadow duration-300">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-white font-bold">{step.step}</span>
                  </div>
                  <h3 className="font-rajdhani font-bold text-lg text-white mb-2 uppercase">
                    {step.title}
                  </h3>
                  <p className="text-gray-300 text-sm">{step.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ChallengeTimeline;
