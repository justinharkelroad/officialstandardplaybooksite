import { Check } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const BoardroomIncludes = () => {
  const includedItems = [
    "Weekly Live Monday Boardroom Call (1:00 PM ET) with Justin & Corina",
    "30-Minute Pre-Call Domino & Mirror Accountability Loop",
    "Full Agency Brain Core Access ($299/mo Standalone Value Included)",
    "The 160-Point Agency Mirror & 8-Week Mirror Challenge",
    "Unlimited Staff Portal Logins + Standard Playbook Training",
    "20 AI Calls Scored Per Month in Standard Call Scoring",
    "Daily Active Telegram Room + Direct Voice/Video Line to Justin",
    "5 Agency HQs + 5 ROI Forecasters + All 7 Daily Flows",
    "Key Leader Boardroom Grants Inside Agency Brain"
  ];

  return (
    <section className="py-20 relative">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center mb-16">
          <h2 className="font-rajdhani font-bold text-4xl md:text-5xl uppercase tracking-wide text-white mb-8">
            Included In Boardroom Membership
          </h2>
        </div>

        <Card className="bg-dark-card border-primary/20 max-w-3xl mx-auto">
          <CardHeader>
            <CardTitle className="text-white font-rajdhani text-2xl uppercase tracking-wide text-center">
              Your Membership Includes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-4">
              {includedItems.map((item, index) => (
                <li key={index} className="flex items-center gap-3 text-xl text-gray-300 font-medium py-2 border-b border-gray-800">
                  <span className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                    <Check className="w-5 h-5 text-primary" />
                  </span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default BoardroomIncludes;