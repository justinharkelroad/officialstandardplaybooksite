import { BarChart3, AlertTriangle, ClipboardCheck, Phone, Clock, Users, ShoppingCart } from 'lucide-react';

const SalesPillarTwo = () => {
  const quadMetrics = [
    { icon: Phone, label: "Outbound Calls" },
    { icon: Clock, label: "Talk Time" },
    { icon: Users, label: "Quoted Households" },
    { icon: ShoppingCart, label: "Items Sold" }
  ];

  const consequenceSteps = [
    { range: "Steps 1-2", label: "Verbal & Written Warnings", color: "text-yellow-500" },
    { range: "Steps 3-6", label: "Financial Stakes", color: "text-orange-500" },
    { range: "Steps 7-8", label: "Jeopardy & Termination", color: "text-destructive" }
  ];

  return (
    <section className="py-20 relative bg-dark-card/50">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-block px-4 py-2 bg-primary/10 border border-primary/20 rounded-full mb-6">
              <span className="text-primary font-medium uppercase tracking-wider">Pillar 2</span>
            </div>
            <h2 className="font-oswald font-bold text-4xl md:text-5xl lg:text-6xl uppercase tracking-tight text-white mb-6">
              The Accountability Engine
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Performance is no longer subjective. We install clear, non-negotiable standards for both activity (quantity) and salesmanship (quality).
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* The Quad */}
            <div className="bg-dark-card border border-primary/20 rounded-lg p-8">
              <div className="flex items-center gap-4 mb-6">
                <div className="p-3 bg-primary/10 rounded-lg">
                  <BarChart3 className="w-8 h-8 text-primary" />
                </div>
                <h3 className="font-oswald font-bold text-xl uppercase tracking-tight text-white">
                  Daily Performance Metrics
                </h3>
              </div>
              <p className="text-gray-400 mb-6 text-sm leading-relaxed">
                A simple "Quad" of four core metrics that define a successful day. Producers know the target and are required to hit two of the four every single day. No exceptions.
              </p>
              <div className="grid grid-cols-2 gap-4">
                {quadMetrics.map((metric, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 bg-dark-card rounded-lg">
                    <metric.icon className="w-5 h-5 text-primary" />
                    <span className="text-gray-300 text-sm">{metric.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Consequence Ladder */}
            <div className="bg-dark-card border border-primary/20 rounded-lg p-8">
              <div className="flex items-center gap-4 mb-6">
                <div className="p-3 bg-primary/10 rounded-lg">
                  <AlertTriangle className="w-8 h-8 text-primary" />
                </div>
                <h3 className="font-oswald font-bold text-xl uppercase tracking-tight text-white">
                  The Consequence Ladder
                </h3>
              </div>
              <p className="text-gray-400 mb-6 text-sm leading-relaxed">
                A fair, transparent, and escalating 8-step process for managing underperformance. It removes ambiguity and ensures standards are upheld by everyone.
              </p>
              <div className="space-y-4">
                {consequenceSteps.map((step, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-dark-card rounded-lg">
                    <span className="text-gray-300 text-sm font-medium">{step.range}</span>
                    <span className={`text-sm ${step.color}`}>{step.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Call Scoring */}
            <div className="bg-dark-card border border-primary/20 rounded-lg p-8">
              <div className="flex items-center gap-4 mb-6">
                <div className="p-3 bg-primary/10 rounded-lg">
                  <ClipboardCheck className="w-8 h-8 text-primary" />
                </div>
                <h3 className="font-oswald font-bold text-xl uppercase tracking-tight text-white">
                  Call Scoring & QA
                </h3>
              </div>
              <p className="text-gray-400 mb-6 text-sm leading-relaxed">
                A detailed 8-category scorecard to grade calls against the sales process. This framework ensures the process is being executed flawlessly and provides data for targeted coaching.
              </p>
              <div className="p-4 bg-dark-card rounded-lg">
                <p className="text-primary font-medium text-center">8 Categories</p>
                <p className="text-gray-400 text-sm text-center mt-2">Objective scoring eliminates guesswork</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SalesPillarTwo;
