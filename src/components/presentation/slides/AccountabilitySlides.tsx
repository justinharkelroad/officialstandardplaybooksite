import { Phone, Clock, Home, ShoppingCart, AlertTriangle, CheckCircle, ClipboardCheck } from 'lucide-react';

// Slide 13: Pillar 2 Title
export const Pillar2TitleSlide = () => (
  <div className="w-full h-full flex flex-col items-center justify-center px-8">
    <div className="text-center animate-fade-in">
      <div className="inline-block px-4 py-2 bg-primary/20 border border-primary/30 rounded-full mb-8">
        <span className="text-primary font-medium uppercase tracking-widest">Pillar 2</span>
      </div>
      <h2 className="font-oswald font-bold text-5xl md:text-6xl lg:text-7xl uppercase tracking-tight text-white mb-6">
        The Engine That<br />
        <span className="text-primary">Eliminates Waste</span>
      </h2>
      <p className="text-xl md:text-2xl text-gray-400 max-w-3xl mx-auto">
        Objective metrics and clear consequences that turn activity into results.
      </p>
    </div>
  </div>
);

// Slide 14: Hidden Cost of Inconsistency
export const InconsistencyCostSlide = () => (
  <div className="w-full h-full flex flex-col items-center justify-center px-8">
    <div className="text-center animate-fade-in max-w-5xl">
      <h2 className="font-oswald font-bold text-4xl md:text-5xl uppercase tracking-tight text-white mb-8">
        The Hidden Cost of <span className="text-red-400">Inconsistency</span>
      </h2>
      <div className="grid md:grid-cols-3 gap-6 mb-12">
        <div className="bg-dark-card border border-red-500/30 rounded-lg p-6 animate-fade-in">
          <AlertTriangle className="w-10 h-10 text-red-400 mx-auto mb-4" />
          <h3 className="font-oswald font-bold text-lg uppercase text-white mb-2">Wasted Payroll</h3>
          <p className="text-gray-400 text-sm">Paying for time that doesn't produce results</p>
        </div>
        <div className="bg-dark-card border border-red-500/30 rounded-lg p-6 animate-fade-in" style={{ animationDelay: '150ms' }}>
          <AlertTriangle className="w-10 h-10 text-red-400 mx-auto mb-4" />
          <h3 className="font-oswald font-bold text-lg uppercase text-white mb-2">Missed Targets</h3>
          <p className="text-gray-400 text-sm">Goals become suggestions instead of standards</p>
        </div>
        <div className="bg-dark-card border border-red-500/30 rounded-lg p-6 animate-fade-in" style={{ animationDelay: '300ms' }}>
          <AlertTriangle className="w-10 h-10 text-red-400 mx-auto mb-4" />
          <h3 className="font-oswald font-bold text-lg uppercase text-white mb-2">Profit Drain</h3>
          <p className="text-gray-400 text-sm">Every unproductive day costs you money</p>
        </div>
      </div>
      <p className="text-xl text-gray-300">
        Subjective standards lead to <span className="text-red-400 font-semibold">subjective performance</span>.
      </p>
    </div>
  </div>
);

// Slide 15: Quad Intro
export const QuadIntroSlide = () => (
  <div className="w-full h-full flex flex-col items-center justify-center px-8">
    <div className="text-center animate-fade-in">
      <h2 className="font-oswald font-bold text-4xl md:text-5xl lg:text-6xl uppercase tracking-tight text-white mb-8">
        The Quad
      </h2>
      <p className="text-2xl md:text-3xl text-gray-300 max-w-3xl mx-auto">
        Four metrics that define <span className="text-primary font-semibold">productive</span> versus <span className="text-red-400 font-semibold">wasteful</span> days.
      </p>
      <div className="mt-12 h-1 w-32 bg-primary/50 mx-auto"></div>
      <p className="text-xl text-gray-400 mt-8">
        When you measure what matters, you manage what matters.
      </p>
    </div>
  </div>
);

// Slide 16: Quad Metrics
export const QuadMetricsSlide = () => {
  const metrics = [
    {
      icon: Phone,
      title: "Outbound Calls",
      description: "Activity creates opportunity. No calls = no chances."
    },
    {
      icon: Clock,
      title: "Talk Time",
      description: "Time on the phone with prospects. Quality conversations."
    },
    {
      icon: Home,
      title: "Quoted Households",
      description: "Opportunities presented. The pipeline of potential profit."
    },
    {
      icon: ShoppingCart,
      title: "Items Sold",
      description: "Policies written. The ultimate measure of production."
    }
  ];

  return (
    <div className="w-full h-full flex flex-col items-center justify-center px-8 py-12">
      <h2 className="font-oswald font-bold text-4xl md:text-5xl uppercase tracking-tight text-white mb-4 text-center">
        The <span className="text-primary">Four Metrics</span>
      </h2>
      <p className="text-lg text-gray-400 mb-12 text-center">Each one a detail that compounds into profit</p>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-5xl w-full">
        {metrics.map((metric, index) => (
          <div 
            key={index}
            className="bg-dark-card border border-primary/30 rounded-lg p-6 text-center animate-fade-in"
            style={{ animationDelay: `${index * 150}ms` }}
          >
            <div className="p-4 bg-primary/20 rounded-full w-fit mx-auto mb-4">
              <metric.icon className="w-8 h-8 text-primary" />
            </div>
            <h3 className="font-oswald font-bold text-lg uppercase text-white mb-2">
              {metric.title}
            </h3>
            <p className="text-gray-400 text-sm">{metric.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

// Slide 17: Quad Rule
export const QuadRuleSlide = () => (
  <div className="w-full h-full flex flex-col items-center justify-center px-8">
    <div className="text-center animate-fade-in">
      <h2 className="font-oswald font-bold text-5xl md:text-6xl lg:text-7xl uppercase tracking-tight text-white mb-8">
        Hit <span className="text-primary">2 of 4</span><br />Every Day
      </h2>
      <p className="text-2xl md:text-3xl text-gray-300 max-w-3xl mx-auto mb-8">
        Discipline in the details. No exceptions.
      </p>
      <div className="bg-dark-card border border-primary/30 rounded-lg p-8 max-w-2xl mx-auto">
        <p className="text-gray-300 leading-relaxed">
          The rule is simple: hit at least <span className="text-primary font-semibold">two of the four metrics</span> every single day. 
          This ensures consistent activity even when results vary.
        </p>
      </div>
    </div>
  </div>
);

// Slide: Accountability Core
export const AccountabilityCoreSlide = () => (
  <div className="w-full h-full flex flex-col items-center justify-center px-8">
    <div className="text-center">
      <h2 className="font-oswald font-bold text-4xl md:text-5xl lg:text-6xl uppercase tracking-tight text-gray-300 mb-8 animate-fade-in">
        Accountability at its core is
      </h2>
      <h1 
        className="font-oswald font-bold text-6xl md:text-7xl lg:text-8xl uppercase tracking-tight text-primary animate-scale-in"
        style={{ animationDelay: '800ms', animationFillMode: 'both' }}
      >
        Consequences
      </h1>
    </div>
  </div>
);

// Slide 18: Consequence Ladder Title
export const ConsequenceTitleSlide = () => (
  <div className="w-full h-full flex flex-col items-center justify-center px-8">
    <div className="text-center animate-fade-in">
      <h2 className="font-oswald font-bold text-4xl md:text-5xl lg:text-6xl uppercase tracking-tight text-white mb-8">
        Protecting Your Profit With<br />
        <span className="text-primary">Clear Standards</span>
      </h2>
      <p className="text-xl md:text-2xl text-gray-400 max-w-3xl mx-auto">
        Fair. Transparent. Non-negotiable.
      </p>
    </div>
  </div>
);

// Slide 19: Consequence Ladder Visual
export const ConsequenceLadderSlide = () => {
  const steps = [
    { step: 1, action: "Verbal Warning", color: "bg-green-500/20 border-green-500/40 text-green-400" },
    { step: 2, action: "Second Verbal Warning", color: "bg-green-500/20 border-green-500/40 text-green-400" },
    { step: 3, action: "Written Warning", color: "bg-yellow-500/20 border-yellow-500/40 text-yellow-400" },
    { step: 4, action: "Second Written Warning", color: "bg-yellow-500/20 border-yellow-500/40 text-yellow-400" },
    { step: 5, action: "Financial Consequence", color: "bg-orange-500/20 border-orange-500/40 text-orange-400" },
    { step: 6, action: "Second Financial Consequence", color: "bg-orange-500/20 border-orange-500/40 text-orange-400" },
    { step: 7, action: "Job in Jeopardy", color: "bg-red-500/20 border-red-500/40 text-red-400" },
    { step: 8, action: "Termination", color: "bg-red-600/30 border-red-600/50 text-red-500" }
  ];

  return (
    <div className="w-full h-full flex flex-col items-center justify-center px-8 py-8">
      <h2 className="font-oswald font-bold text-3xl md:text-4xl uppercase tracking-tight text-white mb-2 text-center">
        The Consequence Ladder
      </h2>
      <p className="text-gray-400 mb-8 text-center">Underperformance unchecked bleeds profit</p>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 max-w-5xl w-full">
        {steps.map((item, index) => (
          <div 
            key={index}
            className={`${item.color} border rounded-lg p-4 text-center animate-fade-in`}
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div className="text-2xl font-oswald font-bold mb-1">{item.step}</div>
            <p className="text-sm font-medium">{item.action}</p>
          </div>
        ))}
      </div>
      
      <div className="mt-8 bg-dark-card border border-primary/30 rounded-lg p-6 max-w-3xl text-center">
        <p className="text-gray-300">
          <span className="text-primary font-semibold">The Why:</span> Every step of leniency has a cost. Clear escalation protects your profit by ensuring standards are maintained—or people exit before they drain your resources.
        </p>
      </div>
    </div>
  );
};

// Slide 20: Call Scoring
export const CallScoringSlide = () => (
  <div className="w-full h-full flex flex-col items-center justify-center px-8">
    <div className="text-center animate-fade-in max-w-5xl">
      <div className="p-4 bg-primary/20 rounded-full w-fit mx-auto mb-8">
        <ClipboardCheck className="w-12 h-12 text-primary" />
      </div>
      <h2 className="font-oswald font-bold text-4xl md:text-5xl uppercase tracking-tight text-white mb-8">
        Call Scoring
      </h2>
      <p className="text-2xl md:text-3xl text-gray-300 mb-12">
        Objective measurement.<br />
        <span className="text-primary font-semibold">Every detail scored.</span><br />
        No guesswork.
      </p>
      <div className="bg-dark-card border border-primary/30 rounded-lg p-8 max-w-2xl mx-auto">
        <p className="text-gray-300 leading-relaxed">
          Eight categories. Clear criteria. Targeted coaching based on real data—not opinions.
        </p>
      </div>
    </div>
  </div>
);

// Slide 21: Why It Works
export const WhyItWorksSlide = () => (
  <div className="w-full h-full flex flex-col items-center justify-center px-8">
    <div className="text-center animate-fade-in">
      <h2 className="font-oswald font-bold text-5xl md:text-6xl lg:text-7xl uppercase tracking-tight text-white mb-8">
        <span className="text-red-400">Ambiguity</span> Is Expensive
      </h2>
      <h2 className="font-oswald font-bold text-5xl md:text-6xl lg:text-7xl uppercase tracking-tight text-white">
        <span className="text-primary">Clarity</span> Is Profitable
      </h2>
      <div className="mt-12 h-1 w-32 bg-primary/50 mx-auto"></div>
      <p className="text-xl text-gray-400 mt-8 max-w-2xl mx-auto">
        When everyone knows exactly where they stand, performance becomes predictable. And predictable performance means predictable profit.
      </p>
    </div>
  </div>
);
