
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle } from 'lucide-react';

const SalesFeatures = () => {
  const features = [
    "HARD COPY BOOK MAILED FOR YOU/YOUR MANAGER",
    "4 GRADED CALLS PER SALES TEAM MEMBER PER WEEK",
    "WEEKLY MONDAY SALES QUICK HIT TRAINING VIDEO EMAILED TO TEAM",
    "WEEKLY WEDNESDAY TRAINING DOCUMENT EMAILED TO TEAM",
    "30 MINUTE ZOOMS WEEKLY (8X) w/ AGENT or MANAGER",
    "1 ON 1 VIDEO COACHING ANYTIME VIA MARCO POLO APP FOR YOU OR MANAGER",
    "FULLY BUILT OUT SALES PROCESS DOCUMENTED BY END OF EXPERIENCE",
    "FULLY BUILT OUT ACCOUNTABILITY PROCESS DEPLOYED BY END OF EXPERIENCE",
    "FULLY BUILT OUT CONSEQUENCE LADDER DEPLOYED BY END OF EXPERIENCE"
  ];

  return (
    <section className="py-20 relative">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center mb-16">
          <h2 className="font-rajdhani font-bold text-4xl md:text-5xl uppercase tracking-wide text-white mb-8">
            Here's What You Get
          </h2>
          <p className="text-xl text-gray-300 leading-relaxed">
            Everything you need to build world-class sales management systems in just 8 weeks.
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <Card className="bg-dark-card border-primary/20">
            <CardContent className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {features.map((feature, index) => (
                  <div key={index} className={`flex items-start space-x-3 ${index === features.length - 1 ? 'md:col-span-2 md:justify-center' : ''}`}>
                    <CheckCircle className="w-6 h-6 text-primary mt-1 flex-shrink-0" />
                    <span className="text-gray-300">{feature}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default SalesFeatures;
