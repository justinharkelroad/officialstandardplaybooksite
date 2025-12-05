import { Card, CardContent } from '@/components/ui/card';
import { MessageCircle, Users } from 'lucide-react';

const ProducerCulturalImpact = () => {
  return (
    <section className="py-20 relative">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="font-oswald font-bold text-4xl md:text-5xl uppercase tracking-tight text-white text-center mb-4">
            Beyond Skills: The Cultural Impact
          </h2>
          <p className="text-xl text-gray-300 text-center mb-16 max-w-3xl mx-auto">
            The challenge is designed to build a culture of communication and clarity—not just a better salesperson.
          </p>
          
          <div className="grid md:grid-cols-2 gap-8">
            {/* Prompting Conversations */}
            <Card className="bg-dark-card border-primary/20 hover:border-primary/40 transition-all duration-300">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mb-6">
                  <MessageCircle className="w-8 h-8 text-primary" />
                </div>
                <h3 className="font-oswald font-bold text-2xl text-white uppercase mb-4">
                  Prompting Critical Conversations
                </h3>
                <p className="text-gray-300 leading-relaxed">
                  Modules on follow-up, referrals, and onboarding explicitly instruct the producer to get clarity from leadership on the agency's process. If they are unsure, you will see it in their daily report.
                </p>
              </CardContent>
            </Card>

            {/* Bridging the Gap */}
            <Card className="bg-dark-card border-primary/20 hover:border-primary/40 transition-all duration-300">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mb-6">
                  <Users className="w-8 h-8 text-primary" />
                </div>
                <h3 className="font-oswald font-bold text-2xl text-white uppercase mb-4">
                  Bridging the Leadership Gap
                </h3>
                <p className="text-gray-300 leading-relaxed">
                  The daily feedback loop opens a new channel of communication. You'll gain insight into their thinking, challenges, and wins—creating a stronger, more authentic connection than typical performance reviews.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProducerCulturalImpact;
