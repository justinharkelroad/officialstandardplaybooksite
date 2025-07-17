
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { User, Target, BarChart } from 'lucide-react';

const DirectiveSolution = () => {
  return (
    <section className="py-20 relative">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center mb-16">
          <h2 className="font-rajdhani font-bold text-4xl md:text-5xl uppercase tracking-wide text-white mb-8">
            Intensive Implementation
          </h2>
          <p className="text-xl text-gray-300 leading-relaxed">
            The Directive provides personalized coaching and implementation support. Work directly with Justin 
            to develop custom strategies, execute systematically, and achieve breakthrough results.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <Card className="bg-dark-card border-primary-accent/20 card-hover text-center">
            <CardHeader>
              <div className="w-16 h-16 bg-primary-accent rounded-square flex items-center justify-center mx-auto mb-4">
                <User className="w-8 h-8 text-white" />
              </div>
              <CardTitle className="text-white font-rajdhani text-xl uppercase tracking-wide">
                PRIVATE 1:1 COACHING
              </CardTitle>
              <CardDescription className="text-gray-400">
                Direct access to Justin for personalized guidance
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="text-gray-300 space-y-2 text-left">
                <li>• One 2 Hour Call Per Month</li>
                <li>• Custom strategy development and deployment</li>
                <li>• Real-time problem solving</li>
                <li>• Performance optimization</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="bg-dark-card border-primary-accent/20 card-hover text-center">
            <CardHeader>
              <div className="w-16 h-16 bg-primary rounded-square flex items-center justify-center mx-auto mb-4">
                <Target className="w-8 h-8 text-white" />
              </div>
              <CardTitle className="text-white font-rajdhani text-xl uppercase tracking-wide">
                AUTHENTIC ACCOUNTABILITY
              </CardTitle>
              <CardDescription className="text-gray-400">
                Systematic execution with accountability and progress monitoring
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="text-gray-300 space-y-2 text-left">
                <li>• Weekly Check In Protocols</li>
                <li>• Custom strategy development and deployment</li>
                <li>• Monthly Mission Check In's</li>
                <li>• Course Correction Strategies</li>
                <li>• One 2 Hour Group Boardroom Call</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="bg-dark-card border-primary-accent/20 card-hover text-center">
            <CardHeader>
              <div className="w-16 h-16 bg-primary-accent rounded-square flex items-center justify-center mx-auto mb-4">
                <BarChart className="w-8 h-8 text-white" />
              </div>
              <CardTitle className="text-white font-rajdhani text-xl uppercase tracking-wide">
                TECHNOLOGY & AI STRATEGIES
              </CardTitle>
              <CardDescription className="text-gray-400">
                Work 1 on 1 w/ Justin to implement and deploy the latest tech and AI solutions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="text-gray-300 space-y-2 text-left">
                <li>• 100 Calls Graded Per Month Included</li>
                <li>• Custom AI Agent Buildouts on calls</li>
                <li>• Custom Reporting Build outs for your agency</li>
                <li>• Process Optimization</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default DirectiveSolution;
