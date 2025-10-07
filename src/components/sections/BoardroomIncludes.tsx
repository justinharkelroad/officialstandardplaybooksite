import { Check } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const BoardroomIncludes = () => {
  const includedItems = [
    "2 Hour Group Boardroom Call",
    "Boardroom Level Access To Standard App",
    "AgencyBrain Access",
    "The Standard Playbook Hardcover",
    "I AM THE STANDARD T Shirt",
    "I AM THE STANDARD wristband",
    "Standard Playbook Pen",
    "1v1 Video Coaching 24/7 w/ Justin",
    "20 Ai Calls Scored Per Month In Standard Call Scoring"
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