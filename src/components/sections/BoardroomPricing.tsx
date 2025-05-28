
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

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
                Boardroom Membership
              </CardTitle>
              <div className="mb-4">
                <span className="text-6xl font-bold text-white">$299</span>
                <span className="text-gray-400 text-xl">/month</span>
              </div>
              <CardDescription className="text-gray-400 text-lg">
                Everything you need to connect, learn, and grow with like-minded agency owners
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="text-left">
                  <h4 className="text-white font-rajdhani text-lg uppercase tracking-wide mb-3">Community Access</h4>
                  <ul className="space-y-2 text-gray-300">
                    <li>• Monthly 2 Hour Group Calls</li>
                    <li>• Private member community</li>
                    <li>• Monthly strategy sessions</li>
                    <li>• Peer accountability system</li>
                  </ul>
                </div>
                <div className="text-left">
                  <h4 className="text-white font-rajdhani text-lg uppercase tracking-wide mb-3">Resources & Tools</h4>
                  <ul className="space-y-2 text-gray-300">
                    <li>• Strategic planning frameworks</li>
                    <li>• Growth optimization tools</li>
                    <li>• Industry insight reports</li>
                    <li>• Resource sharing library</li>
                  </ul>
                </div>
              </div>
              <Button onClick={handleJoinNow} className="btn-primary text-lg px-8 py-4">
                Join The Boardroom Now
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default BoardroomPricing;
