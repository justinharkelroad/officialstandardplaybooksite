import { FileText, Target, Calendar } from 'lucide-react';

const SalesThreePillars = () => {
  const pillars = [
    {
      icon: FileText,
      number: "01",
      title: "The Sales Process Framework",
      description: "A step-by-step methodology every producer uses on every call to control the conversation, build massive value, and assume the close."
    },
    {
      icon: Target,
      number: "02",
      title: "The Accountability Engine",
      description: "A data-driven system of non-negotiable daily metrics, quality control scorecards, and a consequence ladder that eliminates subjectivity."
    },
    {
      icon: Calendar,
      number: "03",
      title: "The Coaching Cadence",
      description: "A predictable weekly rhythm of targeted coaching, role-playing, and skill development that ensures the system is adopted, optimized, and hardwired into your culture."
    }
  ];

  return (
    <section className="py-20 relative bg-dark-card/50">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-primary font-medium text-lg mb-4 uppercase tracking-wider">The 8-Week Operating System</p>
            <h2 className="font-oswald font-bold text-4xl md:text-5xl lg:text-6xl uppercase tracking-tight text-white mb-6">
              Three Core Systems That Create a Self-Managing, High-Performance Sales Engine
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {pillars.map((pillar, index) => (
              <div 
                key={index}
                className="relative bg-background border border-primary/20 rounded-lg p-8 hover:border-primary/40 transition-all duration-300 group"
              >
                <div className="absolute -top-4 -left-4 w-12 h-12 bg-primary rounded-lg flex items-center justify-center">
                  <span className="font-oswald font-bold text-lg text-primary-foreground">{pillar.number}</span>
                </div>
                <div className="pt-4">
                  <div className="p-4 bg-primary/10 rounded-lg w-fit mb-6 group-hover:bg-primary/20 transition-colors">
                    <pillar.icon className="w-10 h-10 text-primary" />
                  </div>
                  <h3 className="font-oswald font-bold text-2xl uppercase tracking-tight text-white mb-4">
                    {pillar.title}
                  </h3>
                  <p className="text-gray-400 leading-relaxed">
                    {pillar.description}
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

export default SalesThreePillars;
