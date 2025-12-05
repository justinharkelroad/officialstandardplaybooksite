import { Card, CardContent } from '@/components/ui/card';
import { FileText, Calendar } from 'lucide-react';

const ProducerAccountability = () => {
  return (
    <section className="py-20 relative">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="font-oswald font-bold text-4xl md:text-5xl uppercase tracking-tight text-white text-center mb-4">
            The Accountability Engine
          </h2>
          <p className="text-xl text-gray-300 text-center mb-16 max-w-3xl mx-auto">
            You will have visibility into your producer's daily effort and complete weekly progress.
          </p>
          
          <div className="grid md:grid-cols-2 gap-8">
            {/* Daily Reports */}
            <Card className="bg-dark-card border-primary/20 hover:border-primary/40 transition-all duration-300">
              <CardContent className="p-8">
                <div className="flex items-center mb-6">
                  <div className="w-14 h-14 bg-primary/20 rounded-full flex items-center justify-center mr-4">
                    <FileText className="w-7 h-7 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-oswald font-bold text-2xl text-white uppercase">
                      30 Daily Action Reports
                    </h3>
                  </div>
                </div>
                <p className="text-gray-300 mb-6">
                  The moment your producer completes a module, you receive an email with their answers to two exact questions:
                </p>
                <div className="space-y-4 pl-4 border-l-2 border-primary/30">
                  <p className="text-primary italic">
                    "What is your takeaway from today's topic?"
                  </p>
                  <p className="text-primary italic">
                    "What is one measurable item you can take action on today?"
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Weekly Stacks */}
            <Card className="bg-dark-card border-primary/20 hover:border-primary/40 transition-all duration-300">
              <CardContent className="p-8">
                <div className="flex items-center mb-6">
                  <div className="w-14 h-14 bg-primary/20 rounded-full flex items-center justify-center mr-4">
                    <Calendar className="w-7 h-7 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-oswald font-bold text-2xl text-white uppercase">
                      6 Weekly Discovery Stacks
                    </h3>
                  </div>
                </div>
                <p className="text-gray-300 mb-6">
                  Every Friday, your producer completes a "Discovery Stack"—a guided reflection on the week's lessons, challenges, and revelations.
                </p>
                <div className="bg-primary/10 rounded-lg p-4">
                  <p className="text-gray-300">
                    They share the full PDF report directly with you, giving you deep insight into their growth journey.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProducerAccountability;
