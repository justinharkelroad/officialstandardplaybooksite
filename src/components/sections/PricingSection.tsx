
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield } from 'lucide-react';
import PackageComparison from '@/components/PackageComparison';

const PricingSection = () => {
  return (
    <section id="pricing" className="py-20 relative">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="font-rajdhani font-bold text-4xl md:text-6xl uppercase tracking-wide text-white mb-6">
            Investment Levels
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
            Choose the level of commitment that matches your ambition.
          </p>
          
          {/* Compare Packages Button */}
          <div className="mb-8">
            <PackageComparison />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Boardroom */}
          <Card className="bg-dark-card border-primary/20 card-hover">
            <CardHeader className="text-center">
              <CardTitle className="text-white font-rajdhani text-2xl uppercase tracking-wide mb-4">
                The Boardroom
              </CardTitle>
              <div className="mb-4">
                <span className="text-5xl font-bold text-white">$399</span>
                <span className="text-gray-400">/month</span>
              </div>
              <CardDescription className="text-gray-400">
                The Standard Membership. Weekly Monday live coaching, the 30-minute Domino accountability loop, The Mirror experience, and full Agency Brain Core access for you and your team.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center text-gray-300">
                  <Shield className="w-5 h-5 text-primary mr-3" />
                  Weekly Live Monday Boardroom Call (1:00 PM ET)
                </li>
                <li className="flex items-center text-gray-300">
                  <Shield className="w-5 h-5 text-primary mr-3" />
                  30-Minute Pre-Call Domino &amp; Mirror Loop
                </li>
                <li className="flex items-center text-gray-300">
                  <Shield className="w-5 h-5 text-primary mr-3" />
                  Full Agency Brain Core Access ($299/mo Value Included)
                </li>
                <li className="flex items-center text-gray-300">
                  <Shield className="w-5 h-5 text-primary mr-3" />
                  160-Point Agency Mirror + 8-Week Mirror Challenge
                </li>
                <li className="flex items-center text-gray-300">
                  <Shield className="w-5 h-5 text-primary mr-3" />
                  Daily Telegram Room + Direct Line to Justin
                </li>
              </ul>
              <a href="https://buy.stripe.com/cNi6oH2CGeP4aWcbC44Vy0z" target="_blank" rel="noopener noreferrer">
                <Button className="btn-primary w-full">
                  JOIN THE BOARDROOM
                </Button>
              </a>
            </CardContent>
          </Card>

          {/* Directive - Featured */}
          <Card className="bg-dark-card border-primary relative card-hover animate-pulse-neon">
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
              <span className="bg-primary text-white px-4 py-1 rounded-pill text-sm font-semibold uppercase tracking-wide">
                Waitlist
              </span>
            </div>
            <CardHeader className="text-center">
              <CardTitle className="text-white font-rajdhani text-2xl uppercase tracking-wide mb-4">
                The Directive
              </CardTitle>
              <div className="mb-4">
                <span className="text-5xl font-bold text-white">$1500</span>
                <span className="text-gray-400">/month · Waitlist</span>
              </div>
              <CardDescription className="text-gray-400">
                1 on 1 Coaching every single month. AI Training. Custom AgencyBrain buildouts. The highest level for the Agency Owners who are ready for their own accountability in their lives.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center text-gray-300">
                  <Shield className="w-5 h-5 text-primary mr-3" />
                  Everything In Boardroom
                </li>
                <li className="flex items-center text-gray-300">
                  <Shield className="w-5 h-5 text-primary mr-3" />
                  Full Access Inside The App
                </li>
                <li className="flex items-center text-gray-300">
                  <Shield className="w-5 h-5 text-primary mr-3" />
                  2 Hour 1 on 1 Coaching Call w/ Justin
                </li>
                <li className="flex items-center text-gray-300">
                  <Shield className="w-5 h-5 text-primary mr-3" />
                  100 AI Call Scoring Calls
                </li>
                <li className="flex items-center text-gray-300">
                  <Shield className="w-5 h-5 text-primary mr-3" />
                  + More
                </li>
              </ul>
              <a href="/directive">
                <Button className="btn-primary w-full bg-primary-accent hover:bg-primary-light">
                  JOIN THE WAITLIST
                </Button>
              </a>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
