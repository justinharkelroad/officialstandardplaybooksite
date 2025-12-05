import { Play, Zap, Send } from 'lucide-react';

const ProducerDailyRhythm = () => {
  const steps = [
    {
      icon: Play,
      step: "1",
      title: "WATCH",
      description: "They start each day with a short, focused training video (one of 30 modules) inside The Armory. Topics range from mindsets to advanced sales tactics."
    },
    {
      icon: Zap,
      step: "2",
      title: "ACT",
      description: "The training is followed by a prompt to declare a specific, measurable action they will take that day based on the lesson. The focus is on application, not just theory."
    },
    {
      icon: Send,
      step: "3",
      title: "REPORT",
      description: "They submit their daily form, which is instantly emailed to you. This closes the loop and hardwires accountability into their daily routine."
    }
  ];

  return (
    <section className="py-20 relative">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="font-oswald font-bold text-4xl md:text-5xl uppercase tracking-tight text-white text-center mb-4">
            The Producer's Daily Rhythm
          </h2>
          <p className="text-xl text-gray-300 text-center mb-16 max-w-3xl mx-auto">
            A simple, repeatable process designed to build momentum and turn learning into habit.
          </p>
          
          <div className="relative">
            {/* Connection Line */}
            <div className="hidden md:block absolute top-24 left-1/6 right-1/6 h-0.5 bg-gradient-to-r from-primary/20 via-primary to-primary/20" />
            
            <div className="grid md:grid-cols-3 gap-8">
              {steps.map((item, index) => (
                <div key={index} className="relative text-center">
                  {/* Step Circle */}
                  <div className="w-20 h-20 bg-dark-card border-2 border-primary rounded-full flex items-center justify-center mx-auto mb-6 relative z-10">
                    <item.icon className="w-10 h-10 text-primary" />
                  </div>
                  
                  {/* Step Number */}
                  <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-8 h-8 bg-primary rounded-full flex items-center justify-center z-20">
                    <span className="text-white font-bold text-sm">{item.step}</span>
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
      </div>
    </section>
  );
};

export default ProducerDailyRhythm;
