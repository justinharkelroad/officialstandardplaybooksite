import { Button } from '@/components/ui/button';
import { CheckCircle } from 'lucide-react';
import { useEffect } from 'react';

const CallScoringTeam = () => {
  useEffect(() => {
    // Load Wistia player scripts
    const script1 = document.createElement('script');
    script1.src = 'https://fast.wistia.com/player.js';
    script1.async = true;
    document.body.appendChild(script1);

    const script2 = document.createElement('script');
    script2.src = 'https://fast.wistia.com/embed/t8m2sv6yma.js';
    script2.async = true;
    script2.type = 'module';
    document.body.appendChild(script2);

    return () => {
      document.body.removeChild(script1);
      document.body.removeChild(script2);
    };
  }, []);
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

            {/* Right: Video */}
            <div className="relative">
              <div className="aspect-square rounded-lg overflow-hidden border border-primary/20">
                <wistia-player media-id="t8m2sv6yma" aspect="1.0"></wistia-player>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CallScoringTeam;
