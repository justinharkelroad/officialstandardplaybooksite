import { Compass, Scale, TrendingUp } from 'lucide-react';

const SalesTransformation = () => {
  const outcomes = [
    {
      icon: Compass,
      title: "Certainty",
      description: "Your revenue becomes predictable because it's driven by a process, not by chance. You know exactly what levers to pull to generate results and can forecast with confidence."
    },
    {
      icon: Scale,
      title: "Accountability",
      description: "Underperformance is handled systematically and fairly. Your top performers thrive in a culture of high standards. The entire team operates at a new level of excellence."
    },
    {
      icon: TrendingUp,
      title: "Scalability",
      description: "You can finally hire new producers with confidence, plugging them into a proven system where they can ramp up and become productive in weeks, not months. Your growth is no longer capped."
    }
  ];

  return (
    <section className="py-20 relative bg-dark-card/50">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-primary font-medium text-lg mb-4 uppercase tracking-wider">The Outcome</p>
            <h2 className="font-oswald font-bold text-4xl md:text-5xl lg:text-6xl uppercase tracking-tight text-white mb-6">
              From Chaos to Certainty
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              In 8 weeks, you'll have a completely transformed sales operation. Here's what that looks like:
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {outcomes.map((outcome, index) => (
              <div 
                key={index}
                className="relative bg-background border border-primary/30 rounded-lg p-8 hover:border-primary/50 transition-all duration-300 group"
              >
                <div className="absolute -top-1 left-0 right-0 h-1 bg-gradient-to-r from-primary/0 via-primary to-primary/0 group-hover:via-primary-accent transition-colors" />
                <div className="text-center">
                  <div className="p-4 bg-primary/10 rounded-full w-fit mx-auto mb-6 group-hover:bg-primary/20 transition-colors">
                    <outcome.icon className="w-10 h-10 text-primary" />
                  </div>
                  <h3 className="font-oswald font-bold text-3xl uppercase tracking-tight text-white mb-4">
                    {outcome.title}
                  </h3>
                  <p className="text-gray-400 leading-relaxed">
                    {outcome.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default SalesTransformation;
