import { Card, CardContent } from '@/components/ui/card';
import { Phone, UserCheck, MessageSquare, ShieldCheck, Plus } from 'lucide-react';

const CallScoringTypes = () => {
  const callTypes = [
    {
      icon: Phone,
      title: "Discovery Calls",
      description: "Evaluate how well your team uncovers needs and builds rapport"
    },
    {
      icon: UserCheck,
      title: "Closing Calls",
      description: "Score closing techniques, objection handling, and deal advancement"
    },
    {
      icon: MessageSquare,
      title: "Follow-Up Calls",
      description: "Measure consistency in follow-through and relationship building"
    },
    {
      icon: ShieldCheck,
      title: "Objection Handling",
      description: "Track how effectively agents address concerns and move forward"
    },
    {
      icon: Plus,
      title: "Custom Call Types",
      description: "Create unlimited custom scoring criteria for any call scenario"
    }
  ];

  return (
    <section className="py-20 relative bg-dark-card/30">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-rajdhani font-bold text-4xl md:text-5xl uppercase tracking-wide text-white mb-6">
              One System.
              <br />
              <span className="text-gradient">Every Call Type.</span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              One license to score any type of call. Zero limitations.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {callTypes.map((type, index) => {
              const Icon = type.icon;
              return (
                <Card 
                  key={index}
                  className="bg-dark-card border-primary/20 hover:border-primary/40 transition-all duration-300 hover:shadow-xl hover:shadow-primary/10 group"
                >
                  <CardContent className="p-6 text-center">
                    <div className="w-16 h-16 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/20 transition-colors">
                      <Icon className="w-8 h-8 text-primary" />
                    </div>
                    <h3 className="font-rajdhani font-bold text-xl text-white mb-3 uppercase">
                      {type.title}
                    </h3>
                    <p className="text-gray-400 leading-relaxed">
                      {type.description}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          <div className="mt-12 text-center">
            <p className="text-gray-300 text-lg">
              Your process is unique. Your scoring system should be too.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CallScoringTypes;
