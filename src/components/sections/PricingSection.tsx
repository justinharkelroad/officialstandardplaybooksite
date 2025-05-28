
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
                <span className="text-5xl font-bold text-white">$299</span>
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
                  Monthly 2 Hour Group Zoom Call
                </li>
                <li className="flex items-center text-gray-300">
                  <Shield className="w-5 h-5 text-primary mr-3" />
                  Stack Level Access Inside The App
                </li>
                <li className="flex items-center text-gray-300">
                  <Shield className="w-5 h-5 text-primary mr-3" />
                  Standard Playbook Hardcover + Swag
                </li>
                <li className="flex items-center text-gray-300">
                  <Shield className="w-5 h-5 text-primary mr-3" />
                  24/7 1v1 Video Messaging w/ Justin
                </li>
                <li className="flex items-center text-gray-300">
                  <Shield className="w-5 h-5 text-primary mr-3" />
                  + More
                </li>
              </ul>
              <a href="https://link.fastpaydirect.com/payment-link/68371b280a5741f8835218c8" target="_blank" rel="noopener noreferrer">
                <Button className="btn-primary w-full">
                  Join The Boardroom
                </Button>
              </a>
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
                <span className="text-5xl font-bold text-white">$1500</span>
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
              <a href="https://link.fastpaydirect.com/payment-link/670ff5735146ea77a16c5106" target="_blank" rel="noopener noreferrer">
                <Button className="btn-primary w-full bg-primary-accent hover:bg-primary-light">
                  Join The Directive
                </Button>
              </a>
            </CardContent>
          </Card>

          {/* Partnership */}
          <Card className="bg-dark-card border-primary/20 card-hover">
            <CardHeader className="text-center">
              <CardTitle className="text-white font-rajdhani text-2xl uppercase tracking-wide mb-4">
                The Partnership
              </CardTitle>
              <div className="mb-4">
                <span className="text-5xl font-bold text-white">$2000</span>
                <span className="text-gray-400">/month</span>
              </div>
              <CardDescription className="text-gray-400">
                1v1 Coaching for yourself and your team.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center text-gray-300">
                  <Crown className="w-5 h-5 text-primary mr-3" />
                  Everything In Boardroom
                </li>
                <li className="flex items-center text-gray-300">
                  <Crown className="w-5 h-5 text-primary mr-3" />
                  Full Access Inside The App
                </li>
                <li className="flex items-center text-gray-300">
                  <Crown className="w-5 h-5 text-primary mr-3" />
                  2 Hour 1 on 1 Coaching Call w/ Justin
                </li>
                <li className="flex items-center text-gray-300">
                  <Crown className="w-5 h-5 text-primary mr-3" />
                  45 Min Team Coaching Call
                </li>
                <li className="flex items-center text-gray-300">
                  <Crown className="w-5 h-5 text-primary mr-3" />
                  100 AI Call Scoring Calls
                </li>
              </ul>
              <Button className="text-lg px-8 py-4 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-medium rounded-pill w-full cursor-not-allowed" disabled>
                SOLD OUT
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
