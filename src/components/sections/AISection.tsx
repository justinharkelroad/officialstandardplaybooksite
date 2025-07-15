
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowRight, Brain } from 'lucide-react';

const AISection = () => {
  return (
    <section className="py-12 relative">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="font-rajdhani font-bold text-3xl md:text-4xl uppercase tracking-wide text-white mb-4">
            Your Sales Team Is Lying to You (And They Don't Even Know It)
          </h2>
          <p className="text-xl text-primary font-medium">Every "great call" that doesn't close is theft.</p>
          <div className="max-w-3xl mx-auto space-y-2 text-gray-300 mt-4">
            <p>Theft of time. Theft of opportunity. Theft of the life you promised your family.</p>
          </div>
        </div>

        <div className="max-w-4xl mx-auto card-hover">
          <Card className="bg-dark-card border-primary/20 group">
            <CardContent className="p-8">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-6">
                  <div className="w-16 h-16 bg-primary rounded-square flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Brain className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h3 className="text-white font-rajdhani text-3xl uppercase tracking-wide mb-2">
                      Standard Call Scoring
                    </h3>
                    <div className="space-y-2 text-lg text-gray-300">
                      <p>Standard Call Scoring doesn't catch liars. It reveals truth:</p>
                      <ul className="text-base space-y-1 text-gray-400">
                        <li>- That "top producer" who's actually burning leads</li>
                        <li>- That "perfect process" that's bleeding revenue</li>
                        <li>- That manager who's been guessing for 3 years</li>
                      </ul>
                      <p className="text-primary font-medium">Here's the knife twist: Your competitors already know this.</p>
                      <p className="text-sm">While you're doing ride-alongs and "trusting the process," they're using AI to turn every call into a weapon.</p>
                    </div>
                  </div>
                </div>
                <div>
                  <a href="https://standardcallscoring.com" target="_blank" rel="noopener noreferrer">
                    <Button className="btn-primary text-lg px-8 py-4 bg-gradient-to-r from-primary to-primary-accent hover:from-primary-light hover:to-primary">
                      EXPOSE THE TRUTH →
                    </Button>
                  </a>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default AISection;
