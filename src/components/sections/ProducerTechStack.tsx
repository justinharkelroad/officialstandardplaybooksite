import { Card, CardContent } from '@/components/ui/card';
import { BookOpen, Target, Layers } from 'lucide-react';

const ProducerTechStack = () => {
  const tools = [
    {
      icon: BookOpen,
      title: "THE ARMORY",
      description: "The central hub for all 30 video training modules. Content is released daily to prevent binging and ensure paced, deliberate learning."
    },
    {
      icon: Target,
      title: "CORE 4 TRACKER",
      description: "Producers gamify their progress with daily habit-tracking across Body, Being, Balance, and Business—building the foundation for sustained sales success."
    },
    {
      icon: Layers,
      title: "STACKING",
      description: "A guided reflection tool with 19 different frameworks (e.g., Gratitude, Irritation). It teaches producers how to process emotions, separate feelings from facts, and find the lesson in any situation."
    }
  ];

  return (
    <section className="py-20 relative">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="font-oswald font-bold text-4xl md:text-5xl uppercase tracking-tight text-white text-center mb-4">
            The Technology Stack
          </h2>
          <p className="text-xl text-gray-300 text-center mb-16 max-w-3xl mx-auto">
            Your producer gets full access to a professional-grade platform for training and personal development. Accessible via desktop or mobile app (iOS & Android).
          </p>
          
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Tools List */}
            <div className="space-y-6">
              {tools.map((tool, index) => (
                <Card key={index} className="bg-dark-card border-primary/20 hover:border-primary/40 transition-all duration-300">
                  <CardContent className="p-6">
                    <div className="flex items-start">
                      <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
                        <tool.icon className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-oswald font-bold text-xl text-white uppercase mb-2">
                          {tool.title}
                        </h3>
                        <p className="text-gray-300 text-sm leading-relaxed">
                          {tool.description}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* App Demo Image */}
            <div className="relative">
              <div className="video-glow absolute -inset-4"></div>
              <img 
                src="/lovable-uploads/862c875f-96ae-42fe-b043-eec8370ea39e.png" 
                alt="The Standard App - Track Daily Habits and Build Culture" 
                className="relative w-full h-auto rounded-lg shadow-2xl"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProducerTechStack;
