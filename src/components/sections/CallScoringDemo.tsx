import { useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

// Declare the custom element type for TypeScript
declare global {
  namespace JSX {
    interface IntrinsicElements {
      'wistia-player': any;
    }
  }
}

const CallScoringDemo = () => {
  useEffect(() => {
    const script1 = document.createElement('script');
    script1.src = 'https://fast.wistia.com/player.js';
    script1.async = true;

    const script2 = document.createElement('script');
    script2.src = 'https://fast.wistia.com/embed/t8m2sv6yma.js';
    script2.async = true;
    script2.type = 'module';

    document.body.appendChild(script1);
    document.body.appendChild(script2);

    return () => {
      if (script1.parentNode) script1.parentNode.removeChild(script1);
      if (script2.parentNode) script2.parentNode.removeChild(script2);
    };
  }, []);
  return (
    <section className="py-20 relative bg-dark-card/30">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-rajdhani font-bold text-4xl md:text-5xl uppercase tracking-wide text-white mb-6">
              See It In Action
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              One dashboard. Two views. Complete visibility into your team's performance.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left: Video */}
            <Card className="bg-dark-card border-primary/20 overflow-hidden relative group hover:border-primary/40 transition-all">
              <div className="absolute top-4 right-4 z-10">
                <Badge className="bg-primary text-white">
                  REAL RESULTS
                </Badge>
              </div>
              <div className="aspect-square bg-gradient-to-br from-primary/5 to-primary-accent/5 p-4 flex items-center justify-center">
                <div className="w-full h-full">
                  <wistia-player 
                    media-id="t8m2sv6yma" 
                    aspect="1.0"
                    className="w-full h-full"
                  />
                </div>
              </div>
              <div className="p-6 border-t border-primary/20">
                <h3 className="font-rajdhani font-bold text-xl text-white mb-2 uppercase">
                  See The Impact
                </h3>
                <p className="text-gray-400 text-sm">
                  Watch how Standard Call Scoring transforms team performance in real-time
                </p>
              </div>
            </Card>

            {/* Right: Feedback View */}
            <Card className="bg-dark-card border-primary/20 overflow-hidden relative group hover:border-primary/40 transition-all">
              <div className="absolute top-4 right-4 z-10">
                <Badge className="bg-primary-accent text-white">
                  SPOT STRENGTHS
                </Badge>
              </div>
              <div className="aspect-[4/3] bg-gradient-to-br from-primary-accent/5 to-primary/5 p-8 flex items-center justify-center">
                <div className="w-full space-y-4">
                  <div className="bg-dark-card/80 rounded-lg p-4 border border-primary-accent/20">
                    <div className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-green-400 rounded-full mt-2"></div>
                      <div>
                        <p className="text-white font-semibold text-sm mb-1">Excellent Rapport Building</p>
                        <p className="text-gray-400 text-xs">Great job establishing trust early in the conversation</p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-dark-card/80 rounded-lg p-4 border border-primary-accent/20">
                    <div className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-yellow-400 rounded-full mt-2"></div>
                      <div>
                        <p className="text-white font-semibold text-sm mb-1">Opportunity: Objection Handling</p>
                        <p className="text-gray-400 text-xs">Consider using the "Feel, Felt, Found" framework</p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-dark-card/80 rounded-lg p-4 border border-primary-accent/20">
                    <div className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-green-400 rounded-full mt-2"></div>
                      <div>
                        <p className="text-white font-semibold text-sm mb-1">Strong Closing Technique</p>
                        <p className="text-gray-400 text-xs">Clear next steps and assumptive close executed well</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="p-6 border-t border-primary-accent/20">
                <h3 className="font-rajdhani font-bold text-xl text-white mb-2 uppercase">
                  Detailed Feedback Interface
                </h3>
                <p className="text-gray-400 text-sm">
                  Specific, actionable insights that identify strengths and growth opportunities
                </p>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CallScoringDemo;
