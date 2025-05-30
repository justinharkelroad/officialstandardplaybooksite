
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
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Select the level that matches your commitment to transformation.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Stack Level Access */}
          <Card className="bg-dark-card border-primary/20 card-hover">
            <CardHeader className="text-center">
              <CardTitle className="text-white font-rajdhani text-2xl uppercase tracking-wide mb-2">
                Stack Level Access
              </CardTitle>
              <p className="text-primary text-sm font-medium mb-4">Included in Boardroom</p>
              <div className="mb-4">
                <span className="text-5xl font-bold text-white">$70</span>
                <span className="text-gray-400">/month</span>
              </div>
              <CardDescription className="text-gray-400">
                Essential tools to start your transformation
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center text-gray-300">
                  <Shield className="w-5 h-5 text-primary mr-3" />
                  Core4
                </li>
                <li className="flex items-center text-gray-300">
                  <Shield className="w-5 h-5 text-primary mr-3" />
                  Notes
                </li>
                <li className="flex items-center text-gray-300">
                  <Shield className="w-5 h-5 text-primary mr-3" />
                  Assessments
                </li>
                <li className="flex items-center text-gray-300">
                  <Shield className="w-5 h-5 text-primary mr-3" />
                  Tribe
                </li>
                <li className="flex items-center text-gray-300">
                  <Shield className="w-5 h-5 text-primary mr-3" />
                  Chat
                </li>
              </ul>
              <Button className="btn-primary w-full">
                Get Stack Access
              </Button>
            </CardContent>
          </Card>

          {/* Arsenal Level Access */}
          <Card className="bg-dark-card border-primary relative card-hover">
            <CardHeader className="text-center">
              <CardTitle className="text-white font-rajdhani text-2xl uppercase tracking-wide mb-2">
                Arsenal Level Access
              </CardTitle>
              <p className="text-primary text-sm font-medium mb-4">Included in Directive and Partnership</p>
              <div className="mb-4">
                <span className="text-5xl font-bold text-white">$125</span>
                <span className="text-gray-400">/month</span>
              </div>
              <CardDescription className="text-gray-400">
                Complete access to all transformation tools
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center text-gray-300">
                  <Shield className="w-5 h-5 text-primary mr-3" />
                  Core4
                </li>
                <li className="flex items-center text-gray-300">
                  <Shield className="w-5 h-5 text-primary mr-3" />
                  Notes
                </li>
                <li className="flex items-center text-gray-300">
                  <Shield className="w-5 h-5 text-primary mr-3" />
                  Assessments
                </li>
                <li className="flex items-center text-gray-300">
                  <Shield className="w-5 h-5 text-primary mr-3" />
                  Tribe
                </li>
                <li className="flex items-center text-gray-300">
                  <Shield className="w-5 h-5 text-primary mr-3" />
                  Chat
                </li>
                <li className="flex items-center text-gray-300">
                  <Shield className="w-5 h-5 text-primary mr-3" />
                  Stack
                </li>
                <li className="flex items-center text-gray-300">
                  <Shield className="w-5 h-5 text-primary mr-3" />
                  Door
                </li>
                <li className="flex items-center text-gray-300">
                  <Shield className="w-5 h-5 text-primary mr-3" />
                  Game
                </li>
                <li className="flex items-center text-gray-300">
                  <Shield className="w-5 h-5 text-primary mr-3" />
                  Armory
                </li>
              </ul>
              <Button className="btn-primary w-full bg-primary-accent hover:bg-primary-light">
                Get Arsenal Access
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default AppAccessPricing;
