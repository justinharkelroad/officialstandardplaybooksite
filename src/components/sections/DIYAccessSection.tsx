
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Link } from 'react-router-dom';
import { ArrowRight, Target } from 'lucide-react';

const DIYAccessSection = () => {
  return (
    <section className="py-12 relative">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="font-rajdhani font-bold text-3xl md:text-4xl uppercase tracking-wide text-white mb-4">
            Do It Yourself Access
          </h2>
        </div>

        <div className="max-w-4xl mx-auto card-hover">
          <Card className="bg-dark-card border-primary/20 group">
            <CardContent className="p-8">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-6">
                  <div className="w-16 h-16 bg-primary rounded-square flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Target className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h3 className="text-white font-rajdhani text-3xl uppercase tracking-wide mb-2">
                      App Access Only
                    </h3>
                    <p className="text-gray-300 text-lg">
                      Perfect for entrepreneurs just beginning their journey to excellence. Get started with our foundational tools and resources.
                    </p>
                  </div>
                </div>
                <div>
                  <Link to="/app">
                    <Button className="btn-primary text-lg px-8 py-4 bg-gradient-to-r from-primary to-primary-accent hover:from-primary-light hover:to-primary">
                      SEE OPTIONS
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default DIYAccessSection;
