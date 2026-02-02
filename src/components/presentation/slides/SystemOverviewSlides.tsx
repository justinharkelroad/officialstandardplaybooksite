import { FileText, BarChart3, Calendar } from 'lucide-react';

// Slide 5: The Solution
export const SolutionSlide = () => (
  <div className="w-full h-full flex flex-col items-center justify-center px-8">
    <div className="text-center animate-fade-in max-w-5xl">
      <h2 className="font-oswald font-bold text-4xl md:text-5xl lg:text-6xl uppercase tracking-tight text-white mb-8">
        The Solution
      </h2>
      <div className="space-y-4">
        <p className="text-2xl md:text-3xl text-gray-300">
          <span className="text-primary font-semibold">Profit</span> is the result of efficiency.
        </p>
        <p className="text-2xl md:text-3xl text-gray-300">
          <span className="text-primary font-semibold">Efficiency</span> is the result of discipline.
        </p>
      </div>
      <div className="mt-12 h-1 w-32 bg-primary/50 mx-auto"></div>
      <p className="text-xl text-gray-400 mt-8 max-w-3xl mx-auto">
        Install systems that turn disciplined attention to detail into predictable, scalable profit.
      </p>
    </div>
  </div>
);

// Slide 6: Three Pillars as Profit Drivers
export const ThreePillarsSlide = () => {
  const pillars = [
    {
      icon: FileText,
      title: "The Sales Process",
      subtitle: "Captures Every Opportunity",
      description: "A disciplined call structure that ensures no premium is left on the table."
    },
    {
      icon: BarChart3,
      title: "The Accountability Engine",
      subtitle: "Eliminates Waste",
      description: "Objective metrics and clear consequences that turn activity into results."
    },
    {
      icon: Calendar,
      title: "The Coaching Cadence",
      subtitle: "Compounds Efficiency",
      description: "A weekly rhythm that reinforces skills and prevents small problems from becoming expensive ones."
    }
  ];

  return (
    <div className="w-full h-full flex flex-col items-center justify-center px-8 py-12">
      <h2 className="font-oswald font-bold text-4xl md:text-5xl uppercase tracking-tight text-white mb-4 text-center">
        Three Pillars of <span className="text-primary">Profit</span>
      </h2>
      <p className="text-lg text-gray-400 mb-12 text-center">The system that turns detail into dollars</p>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl w-full">
        {pillars.map((pillar, index) => (
          <div 
            key={index}
            className="bg-dark-card border border-primary/30 rounded-lg p-8 text-center animate-fade-in hover:border-primary/50 transition-all"
            style={{ animationDelay: `${index * 200}ms` }}
          >
            <div className="p-4 bg-primary/20 rounded-full w-fit mx-auto mb-6">
              <pillar.icon className="w-10 h-10 text-primary" />
            </div>
            <h3 className="font-oswald font-bold text-2xl uppercase text-white mb-2">
              {pillar.title}
            </h3>
            <p className="text-primary font-medium mb-4">{pillar.subtitle}</p>
            <p className="text-gray-400">{pillar.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
