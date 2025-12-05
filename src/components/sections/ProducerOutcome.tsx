import { Shield, Mountain, Heart } from 'lucide-react';

const ProducerOutcome = () => {
  const outcomes = [
    {
      icon: Shield,
      title: "INTEGRITY",
      description: "They learn to keep their word to themselves and to you."
    },
    {
      icon: Mountain,
      title: "RESILIENCE",
      description: "They learn to process challenges constructively rather than emotionally."
    },
    {
      icon: Heart,
      title: "LOYALTY",
      description: "They see an owner who invests in their total growth—leading to higher staff retention and a culture that attracts other top performers."
    }
  ];

  return (
    <section className="py-20 relative">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="font-oswald font-bold text-4xl md:text-5xl uppercase tracking-tight text-white text-center mb-4">
            The Ultimate Outcome
          </h2>
          <p className="text-xl text-gray-300 text-center mb-16 max-w-3xl mx-auto">
            The goal is not just a better producer. It's a transformed, more committed team member.
          </p>
          
          <div className="grid md:grid-cols-3 gap-8">
            {outcomes.map((item, index) => (
              <div key={index} className="text-center">
                <div className="w-24 h-24 bg-dark-card border-2 border-primary rounded-full flex items-center justify-center mx-auto mb-6">
                  <item.icon className="w-12 h-12 text-primary" />
                </div>
                <h3 className="font-oswald font-bold text-2xl text-primary uppercase mb-4">
                  {item.title}
                </h3>
                <p className="text-gray-300 leading-relaxed">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProducerOutcome;
