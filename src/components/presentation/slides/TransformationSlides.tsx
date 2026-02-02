import { ArrowRight, TrendingUp, Settings, Rocket } from 'lucide-react';

// Slide 26: From Inefficiency to Profit
export const TransformationSlide = () => (
  <div className="w-full h-full flex flex-col items-center justify-center px-8">
    <div className="text-center animate-fade-in max-w-5xl">
      <h2 className="font-oswald font-bold text-4xl md:text-5xl lg:text-6xl uppercase tracking-tight text-white mb-12">
        The Transformation
      </h2>
      <div className="flex flex-col md:flex-row items-center justify-center gap-8">
        <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-8 w-64 animate-fade-in">
          <h3 className="font-oswald font-bold text-2xl uppercase text-red-400 mb-2">Before</h3>
          <p className="text-gray-400">Chaos. Inconsistency. Guesswork. Profit leaking from every undisciplined detail.</p>
        </div>
        <ArrowRight className="w-12 h-12 text-primary rotate-90 md:rotate-0 animate-fade-in" style={{ animationDelay: '200ms' }} />
        <div className="bg-primary/10 border border-primary/30 rounded-lg p-8 w-64 animate-fade-in" style={{ animationDelay: '400ms' }}>
          <h3 className="font-oswald font-bold text-2xl uppercase text-primary mb-2">After</h3>
          <p className="text-gray-400">Discipline. Clarity. Efficiency. Every detail optimized for maximum profit.</p>
        </div>
      </div>
    </div>
  </div>
);

// Slide 27: Three Outcomes Reframed
export const OutcomesSlide = () => {
  const outcomes = [
    {
      icon: TrendingUp,
      title: "Certainty",
      equals: "Predictable Profit",
      description: "Know what your team will produce every month."
    },
    {
      icon: Settings,
      title: "Accountability",
      equals: "Efficient Operations",
      description: "No wasted payroll. Every hour produces value."
    },
    {
      icon: Rocket,
      title: "Scalability",
      equals: "Profitable Growth",
      description: "Add producers confidently. Multiply what works."
    }
  ];

  return (
    <div className="w-full h-full flex flex-col items-center justify-center px-8 py-12">
      <h2 className="font-oswald font-bold text-4xl md:text-5xl uppercase tracking-tight text-white mb-4 text-center">
        Three <span className="text-primary">Outcomes</span>
      </h2>
      <p className="text-lg text-gray-400 mb-12 text-center">What disciplined details deliver</p>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl w-full">
        {outcomes.map((outcome, index) => (
          <div 
            key={index}
            className="bg-dark-card border border-primary/30 rounded-lg p-8 text-center animate-fade-in"
            style={{ animationDelay: `${index * 200}ms` }}
          >
            <div className="p-4 bg-primary/20 rounded-full w-fit mx-auto mb-6">
              <outcome.icon className="w-10 h-10 text-primary" />
            </div>
            <h3 className="font-oswald font-bold text-2xl uppercase text-white mb-2">
              {outcome.title}
            </h3>
            <p className="text-primary font-semibold text-lg mb-4">= {outcome.equals}</p>
            <p className="text-gray-400">{outcome.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

// Slide 28: The Promise
export const PromiseSlide = () => (
  <div className="w-full h-full flex flex-col items-center justify-center px-8">
    <div className="text-center animate-fade-in">
      <h2 className="font-oswald font-bold text-4xl md:text-5xl lg:text-6xl uppercase tracking-tight text-white mb-8">
        The Promise
      </h2>
      <p className="text-2xl md:text-3xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
        <span className="text-primary font-semibold">Profit</span> is not luck.<br /><br />
        It is the result of<br />
        <span className="text-primary font-semibold">disciplined attention to detail</span>.
      </p>
      <div className="mt-12 h-1 w-32 bg-primary/50 mx-auto"></div>
    </div>
  </div>
);
