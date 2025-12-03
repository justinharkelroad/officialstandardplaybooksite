import { Card, CardContent } from '@/components/ui/card';
import { Zap, Edit, Target, Settings, TrendingUp, Focus } from 'lucide-react';

const CallScoringFeatures = () => {
  const features = [
    {
      icon: Zap,
      title: "Evaluate Calls Today",
      description: "Quick, AI-powered call analysis that gives you instant insights into every conversation"
    },
    {
      icon: Edit,
      title: "Easy To Edit/Refine",
      description: "Customize scoring criteria to match your exact standards and process requirements"
    },
    {
      icon: Target,
      title: "Grade Consistently",
      description: "Eliminate subjective feedback with standardized evaluation across your entire team"
    },
    {
      icon: Settings,
      title: "Edit Criteria",
      description: "Adapt your scoring system as your process evolves and your standards elevate"
    },
    {
      icon: TrendingUp,
      title: "Evaluate Faster",
      description: "What took hours of manual review now takes minutes per call with automation"
    },
    {
      icon: Focus,
      title: "Focused Scoring",
      description: "Target specific skills for laser-focused improvement and measurable growth"
    }
  ];

  return (
    <section className="py-20 relative">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center mb-16">
          <h2 className="font-oswald font-bold text-4xl md:text-5xl uppercase tracking-tight text-white mb-6">
            Coaching & Scoring
            <br />
            <span className="text-gradient">Made Simple</span>
          </h2>
          <p className="text-xl text-gray-300">
            Everything you need to elevate your team's performance. Nothing you don't.
          </p>
        </div>

        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Card 
                key={index}
                className="bg-dark-card border-primary/20 hover:border-primary/40 transition-all duration-300 hover:shadow-xl hover:shadow-primary/10 group"
              >
                <CardContent className="p-6">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
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
    </section>
  );
};

export default CallScoringFeatures;
