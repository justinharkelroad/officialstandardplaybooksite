import { TrendingDown, Activity, Users, Clock } from 'lucide-react';

// Slide 1: Title Slide
export const TitleSlide = () => (
  <div className="w-full h-full flex flex-col items-center justify-center px-8">
    <div className="text-center animate-fade-in">
      <div className="inline-block px-6 py-2 bg-primary/20 border border-primary/30 rounded-full mb-8">
        <span className="text-primary font-medium uppercase tracking-widest text-lg">The Standard Playbook</span>
      </div>
      <h1 className="font-oswald font-bold text-6xl md:text-7xl lg:text-8xl uppercase tracking-tight text-white mb-6 leading-tight">
        The Profit Exists<br />
        <span className="text-primary">In The Disciplined Details</span>
      </h1>
      <p className="text-xl md:text-2xl text-gray-400 max-w-3xl mx-auto">
        How to build a sales team that operates with efficiency, accountability, and predictable profitability.
      </p>
    </div>
  </div>
);

// Slide 2: The Question
export const QuestionSlide = () => (
  <div className="w-full h-full flex flex-col items-center justify-center px-8">
    <div className="text-center animate-fade-in">
      <h2 className="font-oswald font-bold text-5xl md:text-6xl lg:text-7xl uppercase tracking-tight text-white mb-8">
        Where Is Your<br />
        <span className="text-primary">Profit Hiding?</span>
      </h2>
      <p className="text-xl md:text-2xl text-gray-400 max-w-2xl mx-auto">
        Most agency owners know they should be more profitable. But they can't pinpoint where the money is leaking.
      </p>
    </div>
  </div>
);

// Slide 3: Hidden Inefficiencies
export const InefficienciesSlide = () => (
  <div className="w-full h-full flex flex-col items-center justify-center px-8">
    <div className="text-center animate-fade-in">
      <h2 className="font-oswald font-bold text-4xl md:text-5xl lg:text-6xl uppercase tracking-tight text-white mb-8">
        Hidden Inefficiencies
      </h2>
      <div className="max-w-4xl mx-auto">
        <p className="text-2xl md:text-3xl text-gray-300 leading-relaxed">
          Every <span className="text-primary font-semibold">undisciplined detail</span> is profit walking out the door.
        </p>
        <div className="mt-12 h-1 w-32 bg-primary/50 mx-auto"></div>
        <p className="text-xl text-gray-400 mt-8">
          The problem isn't your people. It's the lack of systems that capture every opportunity.
        </p>
      </div>
    </div>
  </div>
);

// Slide 4: Four Profit Leaks Grid
export const ProfitLeaksSlide = () => {
  const leaks = [
    {
      icon: TrendingDown,
      title: "Unpredictable Revenue",
      subtitle: "Forecasting Failure",
      description: "Without consistent process, revenue swings wildly month to month."
    },
    {
      icon: Activity,
      title: "Inconsistent Activity",
      subtitle: "Wasted Capacity",
      description: "Your team's effort varies daily. Productive hours slip away unnoticed."
    },
    {
      icon: Users,
      title: "Zero Accountability",
      subtitle: "Standards That Slip",
      description: "Subjective expectations lead to subjective performance."
    },
    {
      icon: Clock,
      title: "Painful Onboarding",
      subtitle: "Slow Ramp = Lost Profit",
      description: "Every week a new hire isn't producing is money you're losing."
    }
  ];

  return (
    <div className="w-full h-full flex flex-col items-center justify-center px-8 py-12">
      <h2 className="font-oswald font-bold text-4xl md:text-5xl uppercase tracking-tight text-white mb-4 text-center">
        The Four <span className="text-primary">Profit Leaks</span>
      </h2>
      <p className="text-lg text-gray-400 mb-12 text-center">Where inefficiency bleeds your bottom line</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl w-full">
        {leaks.map((leak, index) => (
          <div 
            key={index}
            className="bg-dark-card border border-red-500/30 rounded-lg p-6 animate-fade-in"
            style={{ animationDelay: `${index * 150}ms` }}
          >
            <div className="flex items-start gap-4">
              <div className="p-3 bg-red-500/20 rounded-lg shrink-0">
                <leak.icon className="w-8 h-8 text-red-400" />
              </div>
              <div>
                <h3 className="font-oswald font-bold text-xl uppercase text-white mb-1">
                  {leak.title}
                </h3>
                <p className="text-red-400 text-sm font-medium mb-2">{leak.subtitle}</p>
                <p className="text-gray-400 text-sm">{leak.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
