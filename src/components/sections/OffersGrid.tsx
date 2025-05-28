
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Link } from 'react-router-dom';
import { ArrowRight, Users, Zap, Crown, Target } from 'lucide-react';

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
          {/* 8 Week Sales Experience */}
          <div className="card-hover">
            <Card className="bg-dark-card border-primary/20 h-full group">
              <CardHeader>
                <div className="w-12 h-12 bg-primary-accent rounded-square flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Target className="w-6 h-6 text-white" />
                </div>
                <CardTitle className="text-white font-rajdhani text-2xl uppercase tracking-wide">
                  8 Week Sales Experience
                </CardTitle>
                <CardDescription className="text-gray-400">
                  Build a Sales Process, Accountability Frame and Consequence Ladder with precision
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300 mb-4">
                  Your or your manager work one on one with Justin to build out your agency sales process.
                </p>
                <Link to="/sales-experience">
                  <Button className="btn-primary text-lg px-8 py-4 bg-gradient-to-r from-primary to-primary-accent hover:from-primary-light hover:to-primary w-full">
                    Learn More
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </Link>
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
                <p className="text-gray-300 mb-6">
                  Join a group of agents who understand your stress every single month for 2 hours.
                </p>
                <a href="https://link.fastpaydirect.com/payment-link/68371b280a5741f8835218c8" target="_blank" rel="noopener noreferrer">
                  <Button className="btn-primary text-lg px-8 py-4 bg-gradient-to-r from-primary to-primary-accent hover:from-primary-light hover:to-primary w-full">
                    Learn More
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </a>
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
                <p className="text-gray-300 mb-6">
                  Get everything in Boardroom + a one on one 2 hour coaching call with Justin.
                </p>
                <a href="https://link.fastpaydirect.com/payment-link/670ff5735146ea77a16c5106" target="_blank" rel="noopener noreferrer">
                  <Button className="btn-primary text-lg px-8 py-4 bg-gradient-to-r from-primary to-primary-accent hover:from-primary-light hover:to-primary w-full">
                    Learn More
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </a>
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
                  The Partnership
                </CardTitle>
                <CardDescription className="text-gray-400">
                  1v1 Coaching for yourself and your team.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300 mb-6">
                  The highest level of engagement for serious agency owners.
                </p>
                <div className="text-center">
                  <Button className="text-lg px-8 py-4 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-medium rounded-pill w-full">
                    Apply Now
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
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
