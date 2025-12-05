import { Card, CardContent } from '@/components/ui/card';
import { X, Check } from 'lucide-react';

const ProducerCorePromise = () => {
  const before = [
    "Relies on mood and motivation",
    "Follow-up is emotional and chaotic",
    "Avoids uncomfortable conversations",
    "Operates without a documented system",
    "Communication with leadership is reactive"
  ];

  const after = [
    "Executes based on a daily system",
    "Follow-up is a documented, predictable cadence",
    "Asks bold questions to uncover truth",
    "Builds and refines a personal process",
    "Proactively communicates takeaways and action items"
  ];

  return (
    <section className="py-20 relative">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="font-oswald font-bold text-3xl md:text-4xl lg:text-5xl uppercase tracking-tight text-white text-center mb-6">
            This Isn't About Learning Information.
          </h2>
          <p className="text-xl md:text-2xl text-primary text-center mb-16">
            It's About Installing a New Operating System.
          </p>
          
          <div className="grid md:grid-cols-2 gap-8">
            {/* Before Column */}
            <Card className="bg-red-900/20 border-red-500/30 hover:shadow-xl transition-shadow duration-300">
              <CardContent className="p-8">
                <div className="flex items-center mb-6">
                  <X className="w-8 h-8 text-red-400 mr-3" />
                  <h3 className="font-oswald font-bold text-2xl text-red-400 uppercase">
                    The Unstructured Producer
                  </h3>
                </div>
                <ul className="space-y-4">
                  {before.map((point, index) => (
                    <li key={index} className="flex items-start">
                      <X className="w-5 h-5 text-red-400 mr-3 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-300">{point}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* After Column */}
            <Card className="bg-green-900/20 border-primary/30 hover:shadow-xl transition-shadow duration-300">
              <CardContent className="p-8">
                <div className="flex items-center mb-6">
                  <Check className="w-8 h-8 text-primary mr-3" />
                  <h3 className="font-oswald font-bold text-2xl text-primary uppercase">
                    The Systematic Producer
                  </h3>
                </div>
                <ul className="space-y-4">
                  {after.map((point, index) => (
                    <li key={index} className="flex items-start">
                      <Check className="w-5 h-5 text-primary mr-3 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-300">{point}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProducerCorePromise;
