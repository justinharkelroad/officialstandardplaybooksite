
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Link } from 'react-router-dom';
import { ArrowRight, Users, Zap, Crown } from 'lucide-react';
import PackageComparison from '@/components/PackageComparison';

const OffersGrid = () => {
  return (
    <section id="offers" className="py-20 relative">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="font-rajdhani font-bold text-4xl md:text-6xl uppercase tracking-wide text-white mb-6">
            Choose Your Path
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
            Whether you are just looking for technology to hold your teams accountable, group coaching or 1 on 1 exclusive coaching with Justin. We got you.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {/* The Boardroom */}
          <div className="card-hover">
            <Card className="bg-dark-card border-primary/20 h-full group">
              <CardHeader>
                <div className="w-12 h-12 bg-primary rounded-square flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <CardTitle className="text-white font-rajdhani text-xl md:text-2xl uppercase tracking-wide">
                  THE BOARDROOM
                </CardTitle>
                <CardDescription className="text-gray-400">
                  Isolation is where good agencies go to die.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 mb-6">
                  <p className="text-gray-300">Every month, you sit across from owners who've already been where you're trying to go. They see through your excuses. They call out your blind spots. They refuse to let you hide.</p>
                  
                  <p className="text-primary font-medium">This isn't networking. It's chemotherapy for your comfort zone.</p>
                  
                  <p className="text-gray-300 italic">Your competition hopes you'll stay comfortable.</p>
                </div>
                <Link to="/boardroom">
                  <Button className="btn-primary text-sm sm:text-lg px-4 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-primary to-primary-accent hover:from-primary-light hover:to-primary w-full truncate">
                    LEARN MORE
                    <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 ml-1 sm:ml-2 flex-shrink-0" />
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
                <CardTitle className="text-white font-rajdhani text-xl md:text-2xl uppercase tracking-wide">
                  THE DIRECTIVE
                </CardTitle>
                <CardDescription className="text-gray-400">
                  When good enough isn't good enough anymore.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 mb-6">
                  <p className="text-gray-300">2 hours. You and Justin. No hiding.</p>
                  
                  <p className="text-gray-300">He's built what you're trying to build. Sold what you're trying to sell. Failed where you're about to fail.</p>
                  
                  <p className="text-primary font-medium">The only question: Are you coachable or just curious?</p>
                  
                  <p className="text-gray-300 italic">Curious people take notes. Coachable people take action.</p>
                </div>
                <a href="https://agencycoaching.as.me/schedule/4db44546/appointment/77447936/calendar/7710787?appointmentTypeIds[]=77447936" target="_blank" rel="noopener noreferrer">
                  <Button className="btn-primary text-sm sm:text-lg px-4 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-primary to-primary-accent hover:from-primary-light hover:to-primary w-full truncate">
                    LEARN MORE
                    <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 ml-1 sm:ml-2 flex-shrink-0" />
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
                <CardTitle className="text-white font-rajdhani text-xl md:text-2xl uppercase tracking-wide">
                  THE PARTNERSHIP
                </CardTitle>
                <CardDescription className="text-gray-400">
                  Your agency is a direct reflection of your leadership.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 mb-6">
                  <p className="text-gray-300">You get The Directive. Your team gets transformation.</p>
                  
                  <p className="text-gray-300">Because the gap between your vision and their execution? That's on you.</p>
                  
                  <p className="text-primary font-medium">Stop hoping they'll figure it out. Start showing them how.</p>
                  
                  <p className="text-gray-300 italic">Hope is not a strategy. But neither is hiding.</p>
                </div>
                <div className="text-center">
                  <Button className="text-sm sm:text-lg px-4 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-medium rounded-pill w-full cursor-not-allowed" disabled>
                    SOLD OUT
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
