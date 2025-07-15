
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
                The Decision That Separates Emperors from Employees
              </CardTitle>
              <div className="mb-4">
                <span className="text-6xl font-bold text-white">$299</span>
                <span className="text-gray-400 text-xl">/month</span>
              </div>
              <div className="text-gray-300 space-y-4 mb-6">
                <p>That's what you spend on:</p>
                <ul className="text-sm space-y-1 text-gray-400">
                  <li>- Coffee runs that don't wake you up</li>
                  <li>- Lunches with people who waste your time</li>
                  <li>- "Tools" that don't move the needle</li>
                  <li>- Courses you don't finish</li>
                </ul>
                <p className="text-primary font-medium">But when it comes to accessing the minds that built what you're trying to build?</p>
                <p className="text-white font-bold">"I can't afford it."</p>
                <p className="text-primary font-medium">Perfect. Your competitor just took your spot.</p>
              </div>
            </CardHeader>
            <CardContent>
              <div className="mb-8">
                <h4 className="text-white font-rajdhani text-xl uppercase tracking-wide mb-4 text-center">What You're Really Buying:</h4>
                
                <div className="space-y-4 text-lg text-gray-300">
                  <p><strong>Not community. Collision.</strong></p>
                  <p><strong>Not advice. Architecture.</strong></p>
                  <p><strong>Not support. Surgery.</strong></p>
                </div>
                
                <div className="mt-6 space-y-3 text-gray-300">
                  <p>You're buying access to the room where million-dollar mistakes become million-dollar lessons. Where your biggest competitor becomes your board of directors. Where your excuses go to die.</p>
                  
                  <p className="text-primary font-medium">One conversation pays for a lifetime.</p>
                  <p className="text-white font-bold">One blind spot costs you everything.</p>
                </div>
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
