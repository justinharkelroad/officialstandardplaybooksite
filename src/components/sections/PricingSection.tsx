
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, Crown } from 'lucide-react';

const PricingSection = () => {
  return (
    <section id="pricing" className="py-20 relative">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="font-rajdhani font-bold text-4xl md:text-6xl uppercase tracking-wide text-white mb-6">
            Investment Levels
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Choose the level of commitment that matches your ambition.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {/* Boardroom */}
          <Card className="bg-dark-card border-primary/20 card-hover">
            <CardHeader className="text-center">
              <CardTitle className="text-white font-rajdhani text-2xl uppercase tracking-wide mb-4">
                The Boardroom
              </CardTitle>
              <div className="mb-4">
                <span className="text-5xl font-bold text-white">$350</span>
                <span className="text-gray-400">/month</span>
              </div>
              <CardDescription className="text-gray-400">
                Elite community access and strategic resources
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center text-gray-300">
                  <Shield className="w-5 h-5 text-primary mr-3" />
                  Weekly group coaching calls
                </li>
                <li className="flex items-center text-gray-300">
                  <Shield className="w-5 h-5 text-primary mr-3" />
                  Private community access
                </li>
                <li className="flex items-center text-gray-300">
                  <Shield className="w-5 h-5 text-primary mr-3" />
                  Monthly strategy sessions
                </li>
                <li className="flex items-center text-gray-300">
                  <Shield className="w-5 h-5 text-primary mr-3" />
                  Resource library access
                </li>
              </ul>
              <Button className="btn-primary w-full">
                Join The Boardroom
              </Button>
            </CardContent>
          </Card>

          {/* Directive - Featured */}
          <Card className="bg-dark-card border-primary relative card-hover animate-pulse-neon">
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
              <span className="bg-primary text-white px-4 py-1 rounded-pill text-sm font-semibold uppercase tracking-wide">
                Most Popular
              </span>
            </div>
            <CardHeader className="text-center">
              <CardTitle className="text-white font-rajdhani text-2xl uppercase tracking-wide mb-4">
                The Directive
              </CardTitle>
              <div className="mb-4">
                <span className="text-5xl font-bold text-white">$750</span>
                <span className="text-gray-400">/month</span>
              </div>
              <CardDescription className="text-gray-400">
                Intensive coaching with direct implementation support
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center text-gray-300">
                  <Shield className="w-5 h-5 text-primary mr-3" />
                  Everything in Boardroom
                </li>
                <li className="flex items-center text-gray-300">
                  <Shield className="w-5 h-5 text-primary mr-3" />
                  Bi-weekly 1:1 coaching
                </li>
                <li className="flex items-center text-gray-300">
                  <Shield className="w-5 h-5 text-primary mr-3" />
                  Custom strategy development
                </li>
                <li className="flex items-center text-gray-300">
                  <Shield className="w-5 h-5 text-primary mr-3" />
                  Implementation tracking
                </li>
                <li className="flex items-center text-gray-300">
                  <Shield className="w-5 h-5 text-primary mr-3" />
                  Priority support
                </li>
              </ul>
              <Button className="btn-primary w-full bg-primary-accent hover:bg-primary-light">
                Join The Directive
              </Button>
            </CardContent>
          </Card>

          {/* Partnership */}
          <Card className="bg-dark-card border-primary/20 card-hover">
            <CardHeader className="text-center">
              <CardTitle className="text-white font-rajdhani text-2xl uppercase tracking-wide mb-4">
                The Partnership
              </CardTitle>
              <div className="mb-4">
                <span className="text-3xl font-bold text-white">Custom</span>
              </div>
              <CardDescription className="text-gray-400">
                White-glove service and true partnership
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center text-gray-300">
                  <Crown className="w-5 h-5 text-primary mr-3" />
                  Everything in Directive
                </li>
                <li className="flex items-center text-gray-300">
                  <Crown className="w-5 h-5 text-primary mr-3" />
                  Weekly 1:1 sessions
                </li>
                <li className="flex items-center text-gray-300">
                  <Crown className="w-5 h-5 text-primary mr-3" />
                  Direct phone access
                </li>
                <li className="flex items-center text-gray-300">
                  <Crown className="w-5 h-5 text-primary mr-3" />
                  Business partnership
                </li>
                <li className="flex items-center text-gray-300">
                  <Crown className="w-5 h-5 text-primary mr-3" />
                  Revenue sharing opportunities
                </li>
              </ul>
              <Button className="btn-ghost w-full">
                Apply Now
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
