
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const BoardroomPricing = () => {
  const handleJoinNow = () => {
    window.open('https://link.fastpaydirect.com/payment-link/68371b280a5741f8835218c8', '_blank');
  };

  return (
    <section className="py-20 relative">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <Card className="bg-dark-card border-primary text-center card-hover">
            <CardHeader className="pb-4">
            <CardTitle className="text-white font-rajdhani text-3xl uppercase tracking-wide mb-4">
                JOIN THE BOARDROOM
              </CardTitle>
              <p className="text-gray-400 text-lg max-w-2xl mx-auto mb-6">
                Join fellow agency owners/principal agents. Make valuable face-to-face contacts. Build a mastermind so extreme no one else can.
              </p>
              <div className="mb-4">
                <span className="text-6xl font-bold text-white">$299</span>
                <span className="text-gray-400 text-xl">/month</span>
              </div>
            </CardHeader>
            <CardContent>
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
