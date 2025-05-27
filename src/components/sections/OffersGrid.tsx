
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Link } from 'react-router-dom';
import { ArrowRight, Users, Zap, Crown, TrendingUp } from 'lucide-react';

const OffersGrid = () => {
  return (
    <section id="offers" className="py-20 relative">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="font-rajdhani font-bold text-4xl md:text-6xl uppercase tracking-wide text-white mb-6">
            Choose Your Path
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Whether you are just looking for technology to hold your teams accountable, group coaching or 1 on 1 exclusive coaching with Justin. We got you.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Call Scoring */}
          <div className="card-hover">
            <Card className="bg-dark-card border-primary/20 h-full group">
              <CardHeader>
                <div className="w-12 h-12 bg-primary-accent rounded-square flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
                <CardTitle className="text-white font-rajdhani text-2xl uppercase tracking-wide">
                  Call Scoring
                </CardTitle>
                <CardDescription className="text-gray-400">
                  Download Call. Drop Call. You're Done.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300 mb-4">
                  Detailed call analysis and scoring to improve your sales and service teams.
                </p>
                <a href="https://standardcallscoring.io" target="_blank" rel="noopener noreferrer">
                  <Button className="btn-primary text-lg px-8 py-4 bg-gradient-to-r from-primary to-primary-accent hover:from-primary-light hover:to-primary">
                    Learn More
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </a>
              </CardContent>
            </Card>
          </div>

          {/* The Boardroom */}
          <div className="card-hover">
            <Card className="bg-dark-card border-primary/20 h-full group">
              <CardHeader>
                <div className="w-12 h-12 bg-primary rounded-square flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <CardTitle className="text-white font-rajdhani text-2xl uppercase tracking-wide">
                  Boardroom
                </CardTitle>
                <CardDescription className="text-gray-400">
                  Elite community and strategic guidance.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300 mb-4">
                  Join a group of agents who understand your stress every single month for 2 hours.
                </p>
                <Link to="/boardroom">
                  <Button className="btn-primary text-lg px-8 py-4 bg-gradient-to-r from-primary to-primary-accent hover:from-primary-light hover:to-primary">
                    Learn More
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>

          {/* The Directive */}
          <div className="card-hover">
            <Card className="bg-dark-card border-primary/20 h-full group">
              <CardHeader>
                <div className="w-12 h-12 bg-primary-accent rounded-square flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Zap className="w-6 h-6 text-white" />
                </div>
                <CardTitle className="text-white font-rajdhani text-2xl uppercase tracking-wide">
                  The Directive
                </CardTitle>
                <CardDescription className="text-gray-400">
                  Intensive coaching and implementation.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300 mb-4">
                  Get everything in Boardroom + a one on one 2 hour coaching call with Justin.
                </p>
                <Link to="/directive">
                  <Button className="btn-primary text-lg px-8 py-4 bg-gradient-to-r from-primary to-primary-accent hover:from-primary-light hover:to-primary">
                    Learn More
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>

          {/* The Partnership */}
          <div className="card-hover">
            <Card className="bg-dark-card border-primary/20 h-full group">
              <CardHeader>
                <div className="w-12 h-12 bg-primary rounded-square flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Crown className="w-6 h-6 text-white" />
                </div>
                <CardTitle className="text-white font-rajdhani text-2xl uppercase tracking-wide">
                  1v1 Coaching for yourself and your team.
                </CardTitle>
                <CardDescription className="text-gray-400">
                  Ultimate white-glove service and partnership.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300 mb-4">
                  The highest level of engagement for serious entrepreneurs.
                </p>
                <div className="text-center">
                  <span className="text-2xl font-bold text-red-400">SOLD OUT</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default OffersGrid;
