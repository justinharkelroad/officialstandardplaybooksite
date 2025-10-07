
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Check } from 'lucide-react';

const BoardroomPricing = () => {
  const handleJoinNow = () => {
    window.open('https://link.fastpaydirect.com/payment-link/68371b280a5741f8835218c8', '_blank');
  };

  const features = [
    "2 Hour Group Boardroom Call",
    "Boardroom Level Access To Standard App",
    "AgencyBrain Access"
  ];

  return (
    <section className="py-20 relative">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <Card className="bg-dark-card border-primary text-center card-hover">
            <CardHeader className="pb-4">
              <CardTitle className="text-white font-rajdhani text-3xl uppercase tracking-wide mb-4">
                The Decision That Separates Emperors from Employees
              </CardTitle>
              <div className="mb-4">
                <span className="text-6xl font-bold text-white">$299</span>
                <span className="text-gray-400 text-xl">/month</span>
              </div>
            </CardHeader>
            <CardContent>
              <div className="mb-8 space-y-4">
                {features.map((feature, index) => (
                  <div key={index} className="flex items-center gap-3 text-left">
                    <Check className="text-primary flex-shrink-0" size={24} />
                    <span className="text-gray-300 text-lg">{feature}</span>
                  </div>
                ))}
              </div>
              <Button onClick={handleJoinNow} className="btn-primary text-lg px-8 py-4">
                CLAIM YOUR SEAT AT THE TABLE →
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default BoardroomPricing;
