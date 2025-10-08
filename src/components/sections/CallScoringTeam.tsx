import { Button } from '@/components/ui/button';
import { CheckCircle } from 'lucide-react';

const CallScoringTeam = () => {
  const benefits = [
    "Point out specific wins they might have missed",
    "Build confidence through data-backed performance insights",
    "Create coaching moments instantly without waiting for reviews",
    "Track improvement over time with measurable metrics",
    "Celebrate wins publicly to reinforce positive behaviors",
    "Identify patterns across your entire team's performance"
  ];

  const handleCTA = () => {
    const pricingSection = document.getElementById('pricing');
    if (pricingSection) {
      pricingSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="py-20 relative">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left: Benefits */}
            <div>
              <h2 className="font-rajdhani font-bold text-4xl md:text-5xl uppercase tracking-wide text-white mb-6">
                Level Up Your Team By
                <br />
                <span className="text-gradient">Confirming Their Strengths</span>
              </h2>
              <p className="text-xl text-gray-300 mb-8">
                Great coaching isn't just about fixing problems. It's about recognizing excellence and building on it.
              </p>
              
              <div className="space-y-4 mb-8">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <CheckCircle className="w-6 h-6 text-primary mt-1 flex-shrink-0" />
                    <span className="text-gray-300">{benefit}</span>
                  </div>
                ))}
              </div>

              <Button 
                className="bg-primary text-white font-bold text-lg px-8 py-4 hover:bg-primary/90"
                onClick={handleCTA}
              >
                START SCORING
              </Button>
            </div>

            {/* Right: Visual Element */}
            <div className="relative">
              <div className="aspect-square bg-gradient-to-br from-primary/10 to-primary-accent/10 rounded-lg border border-primary/20 p-8 flex items-center justify-center">
                <div className="text-center space-y-6">
                  <div className="w-24 h-24 bg-primary/20 rounded-full flex items-center justify-center mx-auto">
                    <CheckCircle className="w-12 h-12 text-primary" />
                  </div>
                  <div>
                    <p className="text-5xl font-rajdhani font-bold text-white mb-2">100%</p>
                    <p className="text-gray-300 text-lg">Of calls scored</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4 pt-4">
                    <div className="bg-dark-card/50 rounded-lg p-4 border border-primary/10">
                      <p className="text-3xl font-rajdhani font-bold text-primary">4.8</p>
                      <p className="text-gray-400 text-sm">Avg Score</p>
                    </div>
                    <div className="bg-dark-card/50 rounded-lg p-4 border border-primary/10">
                      <p className="text-3xl font-rajdhani font-bold text-primary-accent">↑32%</p>
                      <p className="text-gray-400 text-sm">Improvement</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CallScoringTeam;
