import { MessageSquare, Shield, Trophy } from 'lucide-react';

const SalesPillarOne = () => {
  const parts = [
    {
      icon: MessageSquare,
      part: "Part 1",
      title: "Rapport & Discovery",
      description: "Master the first seconds to build trust and control the frame. Use a laid-back, conversational approach to extract the information necessary and inquire about all lines of business.",
      details: [
        "Establish immediate credibility",
        "Control the conversation frame",
        "Uncover all potential opportunities"
      ]
    },
    {
      icon: Shield,
      part: "Part 2",
      title: "The Liability Conversation",
      description: "Shift from quoting price to consulting on coverage. Create massive value by uncovering critical protection gaps the prospect didn't even know they had.",
      details: [
        "Position yourself as a trusted advisor",
        "Identify coverage gaps others miss",
        "Build undeniable value before price"
      ]
    },
    {
      icon: Trophy,
      part: "Part 3",
      title: "The Assumptive Close",
      description: "Confidently ask for the business twice. Handle objections by uncovering the root cause with the 'Why?' technique, and secure commitment on the first call.",
      details: [
        "Ask for the business with confidence",
        "Handle objections systematically",
        "Close on the first call"
      ]
    }
  ];

  return (
    <section className="py-20 relative">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-block px-4 py-2 bg-primary/10 border border-primary/20 rounded-full mb-6">
              <span className="text-primary font-medium uppercase tracking-wider">Pillar 1</span>
            </div>
            <h2 className="font-oswald font-bold text-4xl md:text-5xl lg:text-6xl uppercase tracking-tight text-white mb-6">
              A Proven Process For Every Call
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              We replace inconsistent sales conversations with a structured 3-part framework designed to build value and assume the close.
            </p>
          </div>

          <div className="space-y-8">
            {parts.map((part, index) => (
              <div 
                key={index}
                className="bg-dark-card border border-primary/20 rounded-lg p-8 hover:border-primary/40 transition-all duration-300"
              >
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                  <div className="lg:col-span-1">
                    <div className="p-4 bg-primary/10 rounded-lg w-fit">
                      <part.icon className="w-8 h-8 text-primary" />
                    </div>
                  </div>
                  <div className="lg:col-span-7">
                    <p className="text-primary font-medium text-sm uppercase tracking-wider mb-2">{part.part}</p>
                    <h3 className="font-oswald font-bold text-2xl md:text-3xl uppercase tracking-tight text-white mb-3">
                      {part.title}
                    </h3>
                    <p className="text-gray-400 leading-relaxed">
                      {part.description}
                    </p>
                  </div>
                  <div className="lg:col-span-4">
                    <div className="space-y-3">
                      {part.details.map((detail, detailIndex) => (
                        <div key={detailIndex} className="flex items-center gap-3">
                          <div className="w-2 h-2 bg-primary rounded-full" />
                          <span className="text-gray-300 text-sm">{detail}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default SalesPillarOne;
