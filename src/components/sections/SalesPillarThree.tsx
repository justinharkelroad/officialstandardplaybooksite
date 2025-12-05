import { Target, Headphones, Users, Award } from 'lucide-react';

const SalesPillarThree = () => {
  const weeklyRhythm = [
    {
      day: "Monday",
      icon: Target,
      title: "Goal Setting",
      description: "Team huddle to review sales targets, call volume, and pipeline goals for the week ahead."
    },
    {
      day: "Tuesday / Thursday",
      icon: Headphones,
      title: "1-on-1 Call Reviews",
      description: "Individual coaching sessions using the call scorecard to identify specific improvement areas."
    },
    {
      day: "Wednesday",
      icon: Users,
      title: "Role-Playing",
      description: "Live practice sessions on difficult parts of the process—objection handling, closing, liability conversations."
    },
    {
      day: "Friday",
      icon: Award,
      title: "Performance Review",
      description: "Assess weekly performance, troubleshoot roadblocks, celebrate wins, and set up for next week."
    }
  ];

  return (
    <section className="py-20 relative">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-block px-4 py-2 bg-primary/10 border border-primary/20 rounded-full mb-6">
              <span className="text-primary font-medium uppercase tracking-wider">Pillar 3</span>
            </div>
            <h2 className="font-oswald font-bold text-4xl md:text-5xl lg:text-6xl uppercase tracking-tight text-white mb-6">
              The Coaching Cadence
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              We install a predictable weekly rhythm of coaching and development that hardwires the sales process and accountability engine into your culture.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {weeklyRhythm.map((item, index) => (
              <div 
                key={index}
                className="bg-dark-card border border-primary/20 rounded-lg p-6 hover:border-primary/40 transition-all duration-300 group"
              >
                <div className="text-center">
                  <div className="inline-block px-3 py-1 bg-primary/20 rounded-full mb-4">
                    <span className="text-primary font-medium text-sm">{item.day}</span>
                  </div>
                  <div className="p-4 bg-primary/10 rounded-lg w-fit mx-auto mb-4 group-hover:bg-primary/20 transition-colors">
                    <item.icon className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="font-oswald font-bold text-xl uppercase tracking-tight text-white mb-3">
                    {item.title}
                  </h3>
                  <p className="text-gray-400 text-sm leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <div className="inline-block bg-dark-card border border-primary/20 rounded-lg p-6 max-w-2xl">
              <p className="text-gray-300">
                <span className="text-primary font-medium">The result?</span> A team that doesn't just know the process—they live it. 
                Skills are reinforced weekly, accountability is built into the culture, and improvement is constant.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SalesPillarThree;
