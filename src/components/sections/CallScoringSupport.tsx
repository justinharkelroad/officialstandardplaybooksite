import { Card, CardContent } from '@/components/ui/card';
import { Users, Rocket, Settings, GraduationCap, RefreshCw } from 'lucide-react';

const CallScoringSupport = () => {
  const supportFeatures = [
    {
      icon: Users,
      title: "1-on-1 Coaching Access",
      description: "Direct line to coaching experts who understand your business"
    },
    {
      icon: Rocket,
      title: "Implementation Support",
      description: "We'll help you get up and running fast with proven strategies"
    },
    {
      icon: Settings,
      title: "Custom Scoring Setup",
      description: "We'll build your scoring criteria to match your exact process"
    },
    {
      icon: GraduationCap,
      title: "Team Training Included",
      description: "We'll train your team on how to use the system effectively"
    },
    {
      icon: RefreshCw,
      title: "Ongoing Refinement",
      description: "Continuous support to optimize your scoring as you evolve"
    }
  ];

  return (
    <section className="py-20 relative">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-rajdhani font-bold text-4xl md:text-5xl uppercase tracking-wide text-white mb-6">
              You Don't Have To
              <br />
              <span className="text-gradient">Do This Alone</span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              We're not just handing you software. We're building your success with you.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {supportFeatures.slice(0, 3).map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card 
                  key={index}
                  className="bg-dark-card border-primary/20 hover:border-primary/40 transition-all duration-300 hover:shadow-xl hover:shadow-primary/10"
                >
                  <CardContent className="p-6">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                      <Icon className="w-6 h-6 text-primary" />
                    </div>
                    <h3 className="font-rajdhani font-bold text-xl text-white mb-3 uppercase">
                      {feature.title}
                    </h3>
                    <p className="text-gray-400 leading-relaxed">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8 max-w-4xl mx-auto">
            {supportFeatures.slice(3).map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card 
                  key={index}
                  className="bg-dark-card border-primary/20 hover:border-primary/40 transition-all duration-300 hover:shadow-xl hover:shadow-primary/10"
                >
                  <CardContent className="p-6">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                      <Icon className="w-6 h-6 text-primary" />
                    </div>
                    <h3 className="font-rajdhani font-bold text-xl text-white mb-3 uppercase">
                      {feature.title}
                    </h3>
                    <p className="text-gray-400 leading-relaxed">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default CallScoringSupport;
