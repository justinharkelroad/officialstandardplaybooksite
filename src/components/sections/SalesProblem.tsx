import { TrendingDown, Activity, UserX, Clock } from 'lucide-react';

const SalesProblem = () => {
  const painPoints = [
    {
      icon: TrendingDown,
      title: "Unpredictable Revenue",
      description: "Monthly results feel like a rollercoaster, tied to individual heroics rather than a predictable process. Your pipeline is a mystery from one month to the next."
    },
    {
      icon: Activity,
      title: "Inconsistent Activity",
      description: "Some producers make 100+ calls, others barely hit 30. There's no clear, enforced standard for the daily effort required to win."
    },
    {
      icon: UserX,
      title: "Zero Accountability",
      description: "Underperformance is addressed with conversations that lead nowhere. There are no real consequences for missing targets, so standards continually slip."
    },
    {
      icon: Clock,
      title: "Painful Onboarding",
      description: "Hiring new producers is a gamble. Without a structured playbook for them to follow, they take months to ramp up—if they succeed at all."
    }
  ];

  return (
    <section className="py-20 relative">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-primary font-medium text-lg mb-4 uppercase tracking-wider">The Reality You're Living</p>
            <h2 className="font-oswald font-bold text-4xl md:text-5xl lg:text-6xl uppercase tracking-tight text-white mb-6">
              The Chaos of Inconsistency
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Every agency owner knows this pain. You've built something real, but your sales team operates like a black box—unpredictable, unaccountable, and impossible to scale.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {painPoints.map((point, index) => (
              <div 
                key={index}
                className="bg-dark-card border border-destructive/30 rounded-lg p-8 hover:border-destructive/50 transition-all duration-300"
              >
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-destructive/10 rounded-lg">
                    <point.icon className="w-8 h-8 text-destructive" />
                  </div>
                  <div>
                    <h3 className="font-oswald font-bold text-2xl uppercase tracking-tight text-white mb-3">
                      {point.title}
                    </h3>
                    <p className="text-gray-400 leading-relaxed">
                      {point.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <p className="text-xl text-gray-300">
              Sound familiar? <span className="text-primary font-medium">There's a better way.</span>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SalesProblem;
