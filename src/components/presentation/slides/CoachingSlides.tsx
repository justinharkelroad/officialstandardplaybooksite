import { Target, Headphones, Users, Award, CheckCircle } from 'lucide-react';

// Slide 22: Pillar 3 Title
export const Pillar3TitleSlide = () => (
  <div className="w-full h-full flex flex-col items-center justify-center px-8">
    <div className="text-center animate-fade-in">
      <div className="inline-block px-4 py-2 bg-primary/20 border border-primary/30 rounded-full mb-8">
        <span className="text-primary font-medium uppercase tracking-widest">Pillar 3</span>
      </div>
      <h2 className="font-oswald font-bold text-5xl md:text-6xl lg:text-7xl uppercase tracking-tight text-white mb-6">
        The Rhythm That<br />
        <span className="text-primary">Compounds Efficiency</span>
      </h2>
      <p className="text-xl md:text-2xl text-gray-400 max-w-3xl mx-auto">
        A weekly coaching cadence that reinforces skills and prevents profit leaks.
      </p>
    </div>
  </div>
);

// Slide 23: Weekly Rhythm Visual
export const WeeklyRhythmSlide = () => {
  const rhythm = [
    {
      day: "Monday",
      icon: Target,
      title: "Target Setting",
      detail: "Set weekly targets and align focus",
      prevention: "Prevents aimless weeks"
    },
    {
      day: "Tues / Thurs",
      icon: Headphones,
      title: "1-on-1 Call Reviews",
      detail: "What's working and what's not working",
      prevention: "Catches issues before they compound"
    },
    {
      day: "Wednesday",
      icon: Users,
      title: "Learning Cycle",
      detail: "Live practice on weak areas",
      prevention: "Skills reinforced through repetition"
    },
    {
      day: "Friday",
      icon: Award,
      title: "Return and Report",
      detail: "Assess results, celebrate wins, reset",
      prevention: "No week ends without accountability"
    }
  ];

  return (
    <div className="w-full h-full flex flex-col items-center justify-center px-8 py-12">
      <h2 className="font-oswald font-bold text-4xl md:text-5xl uppercase tracking-tight text-white mb-4 text-center">
        The Weekly <span className="text-primary">Rhythm</span>
      </h2>
      <p className="text-lg text-gray-400 mb-10 text-center">Each touchpoint prevents profit leaks</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl w-full">
        {rhythm.map((item, index) => (
          <div 
            key={index}
            className="bg-dark-card border border-primary/30 rounded-lg p-6 animate-fade-in"
            style={{ animationDelay: `${index * 150}ms` }}
          >
            <div className="text-center mb-4">
              <span className="inline-block px-3 py-1 bg-primary/20 rounded-full text-primary text-sm font-medium">
                {item.day}
              </span>
            </div>
            <div className="p-3 bg-primary/10 rounded-lg w-fit mx-auto mb-4">
              <item.icon className="w-8 h-8 text-primary" />
            </div>
            <h3 className="font-oswald font-bold text-lg uppercase text-white text-center mb-2">
              {item.title}
            </h3>
            <p className="text-gray-400 text-sm text-center mb-3">{item.detail}</p>
            <div className="border-t border-primary/20 pt-3">
              <p className="text-primary text-xs text-center font-medium">{item.prevention}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Slide 20: Why Rhythm Matters
export const RhythmMattersSlide = () => (
  <div className="w-full h-full flex flex-col items-center justify-center px-8">
    <div className="text-center animate-fade-in max-w-5xl">
      <h2 className="font-oswald font-bold text-4xl md:text-5xl uppercase tracking-tight text-white mb-8">
        Why Rhythm Matters
      </h2>
      <p className="text-2xl md:text-3xl text-gray-300 leading-relaxed mb-12">
        Consistent attention to detail prevents<br />
        <span className="text-primary font-semibold">small problems</span> from becoming<br />
        <span className="text-red-400 font-semibold">expensive ones</span>.
      </p>
      <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-10">
        <div className="bg-dark-card border border-primary/20 rounded-lg p-6 animate-fade-in">
          <CheckCircle className="w-8 h-8 text-primary mx-auto mb-3" />
          <p className="text-gray-300 text-sm">Weekly touchpoints catch skill gaps early</p>
        </div>
        <div className="bg-dark-card border border-primary/20 rounded-lg p-6 animate-fade-in" style={{ animationDelay: '150ms' }}>
          <CheckCircle className="w-8 h-8 text-primary mx-auto mb-3" />
          <p className="text-gray-300 text-sm">Regular practice compounds improvement</p>
        </div>
        <div className="bg-dark-card border border-primary/20 rounded-lg p-6 animate-fade-in" style={{ animationDelay: '300ms' }}>
          <CheckCircle className="w-8 h-8 text-primary mx-auto mb-3" />
          <p className="text-gray-300 text-sm">Accountability becomes cultural, not confrontational</p>
        </div>
      </div>
      <h3 className="font-oswald font-bold text-2xl md:text-3xl uppercase tracking-tight text-white animate-fade-in" style={{ animationDelay: '450ms' }}>
        Someone in your agency must <span className="text-red-400 font-bold">own</span> this process.
      </h3>
    </div>
  </div>
);

// Slide 25: The Result
export const CoachingResultSlide = () => (
  <div className="w-full h-full flex flex-col items-center justify-center px-8">
    <div className="text-center animate-fade-in">
      <h2 className="font-oswald font-bold text-4xl md:text-5xl lg:text-6xl uppercase tracking-tight text-white mb-8">
        The Result
      </h2>
      <p className="text-2xl md:text-3xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
        A team that operates <span className="text-primary font-semibold">efficiently</span><br />
        because the details are <span className="text-primary font-semibold">non-negotiable</span>.
      </p>
      <div className="mt-12 h-1 w-32 bg-primary/50 mx-auto"></div>
      <p className="text-xl text-gray-400 mt-8 max-w-2xl mx-auto">
        Skills reinforced weekly. Accountability built into the culture. Improvement that never stops.
      </p>
    </div>
  </div>
);
