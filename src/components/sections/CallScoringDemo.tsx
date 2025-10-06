import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const CallScoringDemo = () => {
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
            {/* Left: Dashboard View */}
            <Card className="bg-dark-card border-primary/20 overflow-hidden relative group hover:border-primary/40 transition-all">
              <div className="absolute top-4 right-4 z-10">
                <Badge className="bg-primary text-white">
                  EDIT IS BUILT-IN
                </Badge>
              </div>
              <div className="aspect-[4/3] bg-gradient-to-br from-primary/5 to-primary-accent/5 p-8 flex items-center justify-center">
                <div className="w-full space-y-4">
                  <div className="bg-dark-card/80 rounded-lg p-4 border border-primary/20">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-gray-400 text-sm">Call Score</span>
                      <span className="text-primary font-bold text-2xl">8.5/10</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div className="bg-primary h-2 rounded-full" style={{ width: '85%' }}></div>
                    </div>
                  </div>
                  <div className="bg-dark-card/80 rounded-lg p-4 border border-primary/20 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Opening</span>
                      <span className="text-green-400">✓ Strong</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Discovery</span>
                      <span className="text-green-400">✓ Strong</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Objections</span>
                      <span className="text-yellow-400">⚠ Needs Work</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="p-6 border-t border-primary/20">
                <h3 className="font-rajdhani font-bold text-xl text-white mb-2 uppercase">
                  Call Scoring Dashboard
                </h3>
                <p className="text-gray-400 text-sm">
                  Quick overview of performance metrics with instant editing capabilities
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
