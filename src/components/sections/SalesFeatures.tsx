
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
            8 Weeks to Sales Transformation: Access + Acceleration Architecture
          </h2>
          <div className="text-xl text-gray-300 leading-relaxed space-y-4">
            <p>Most sales training gives you scripts. We give you the first two pillars of transformation:</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
              <div className="bg-dark-card border border-primary/20 p-6 rounded-lg">
                <h3 className="font-rajdhani font-bold text-2xl uppercase tracking-wide text-primary mb-4">WEEKS 1-4: ACCESS PHASE</h3>
                <ul className="text-left space-y-2 text-gray-300">
                  <li>• The Proven Process Armory: Not theory, battle-tested systems</li>
                  <li>• Direct Weekly Access to Justin's mind</li>
                  <li>• Call Scoring Access: See truth, not hope</li>
                  <li>• Framework Access: The exact blueprints that built empires</li>
                </ul>
              </div>
              <div className="bg-dark-card border border-primary/20 p-6 rounded-lg">
                <h3 className="font-rajdhani font-bold text-2xl uppercase tracking-wide text-primary mb-4">WEEKS 5-8: ACCELERATION PHASE</h3>
                <ul className="text-left space-y-2 text-gray-300">
                  <li>• Compress 20 years of sales mistakes into 8 weeks</li>
                  <li>• Steal systems that took decades to perfect</li>
                  <li>• Skip the learning curve through structured implementation</li>
                  <li>• Your team inherits wisdom without the wounds</li>
                </ul>
              </div>
            </div>
            <p className="text-primary font-medium mt-8">"Why learn from your failures when you can download ours?"</p>
            <p className="text-sm text-gray-400">But here's the truth: This gives you ACCESS and ACCELERATION.<br />For full transformation, you need all five pillars.<br />That's why 73% of graduates step into The Boardroom or Directive.</p>
          </div>
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
