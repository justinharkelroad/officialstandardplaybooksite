
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield } from 'lucide-react';

const AppAccessPricing = () => {
  return (
    <section id="pricing" className="py-20 relative">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="font-rajdhani font-bold text-4xl md:text-6xl uppercase tracking-wide text-white mb-6">
            Choose Your Access Level
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Stack Level Access */}
          <Card className="bg-dark-card border-primary/20 card-hover">
            <CardHeader className="text-center">
              <CardTitle className="text-white font-rajdhani text-2xl uppercase tracking-wide mb-2">
                Stack Level Access: The First Two Pillars
              </CardTitle>
              <div className="mb-4">
                <span className="text-5xl font-bold text-white">$70</span>
                <span className="text-gray-400">/month</span>
              </div>
              <CardDescription className="text-gray-300 mb-4">
                ACCESS: Core frameworks and daily habit architecture
                <br />
                ASSOCIATION: Connect with others stacking their way up
              </CardDescription>
              <p className="text-primary italic font-medium">"Start here. But don't stay here."</p>
            </CardHeader>
            <CardContent>
              <div className="mb-6">
                <h4 className="text-white font-semibold mb-3">What Stack Level Includes:</h4>
                <ul className="space-y-2 text-gray-300 text-sm">
                  <li>• Core4 daily tracking that exposes your real priorities</li>
                  <li>• Notes that become blueprints, not just thoughts</li>
                  <li>• Assessments that reveal what you've been avoiding</li>
                  <li>• Tribe connection with people who get the grind</li>
                  <li>• Chat with others fighting the same fight</li>
                  <li>• Stack methodology that builds momentum</li>
                  <li>• Armory: The vault of proven systems and strategies</li>
                </ul>
              </div>
              <p className="text-gray-400 text-sm mb-6 italic">
                Perfect for those ready to face the mirror but not ready for the whole truth.
              </p>
              <Button 
                className="bg-white text-primary font-bold text-sm sm:text-base px-4 sm:px-6 py-3 hover:bg-gray-100 w-full truncate"
                onClick={() => window.open('https://AGENCYCOACHING.as.me/standardfit', '_blank')}
              >
                BOOK FREE CALL
                <Shield className="w-4 h-4 sm:w-5 sm:h-5 ml-1 sm:ml-2 flex-shrink-0" />
              </Button>
            </CardContent>
          </Card>

          {/* Arsenal Level Access */}
          <Card className="bg-dark-card border-primary relative card-hover">
            <CardHeader className="text-center">
              <CardTitle className="text-white font-rajdhani text-2xl uppercase tracking-wide mb-2">
                Arsenal Level Access: Four Pillars Activated
              </CardTitle>
              <div className="mb-4">
                <span className="text-5xl font-bold text-white">$125</span>
                <span className="text-gray-400">/month</span>
              </div>
              <CardDescription className="text-gray-300 mb-4">
                Everything in Stack PLUS:
                <br />
                ACCOUNTABILITY: Advanced tracking and consequence systems
                <br />
                ACCELERATION: The Armory vault of advanced frameworks + Monthly Mission Tracking
              </CardDescription>
              <p className="text-primary italic font-medium">"This is where transformation gets teeth."</p>
            </CardHeader>
            <CardContent>
              <div className="mb-6">
                <h4 className="text-white font-semibold mb-3">Additional Arsenal Features:</h4>
                <ul className="space-y-2 text-gray-300 text-sm">
                  <li>• Door: Access to frameworks that built empires</li>
                  <li>• Game: Competitive elements that make growth addictive</li>
                </ul>
              </div>
              <p className="text-gray-400 text-sm mb-4 italic">
                This is for operators ready to become owners.
              </p>
              <p className="text-primary text-sm mb-6 font-medium">
                Note: Full ASCENSION requires human collision. That happens in The Boardroom.
              </p>
              <Button 
                className="bg-white text-primary font-bold text-sm sm:text-base px-4 sm:px-6 py-3 hover:bg-gray-100 w-full truncate"
                onClick={() => window.open('https://AGENCYCOACHING.as.me/standardfit', '_blank')}
              >
                BOOK FREE CALL
                <Shield className="w-4 h-4 sm:w-5 sm:h-5 ml-1 sm:ml-2 flex-shrink-0" />
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default AppAccessPricing;
