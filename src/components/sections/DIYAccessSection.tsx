
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
            The Lie You Tell Yourself Every Night
          </h2>
          <div className="max-w-3xl mx-auto space-y-2 text-gray-300">
            <p>"I just need the right system."</p>
            <p>"I just need more information."</p>
            <p>"I just need to get organized."</p>
            <p className="text-primary font-medium">No. You need to stop negotiating with your potential.</p>
          </div>
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
                      APP ACCESS ONLY: The Mirror You've Been Avoiding
                    </h3>
                    <div className="space-y-2 text-lg text-gray-300">
                      <p>The Stack shows you exactly who you are.</p>
                      <p className="text-primary font-medium">The question is: Can you handle it?</p>
                    </div>
                  </div>
                </div>
                <div>
                  <Link to="/app">
                    <Button className="btn-primary text-lg px-8 py-4 bg-gradient-to-r from-primary to-primary-accent hover:from-primary-light hover:to-primary">
                      LEARN MORE →
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
