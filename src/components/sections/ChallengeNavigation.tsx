
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

interface ChallengeNavigationProps {
  otherChallenge: {
    title: string;
    description: string;
    link: string;
  };
}

const ChallengeNavigation = ({ otherChallenge }: ChallengeNavigationProps) => {
  return (
    <section className="py-12 relative">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <Card className="bg-dark-card border-primary/20 hover:shadow-xl transition-shadow duration-300">
            <CardContent className="p-8 text-center">
              <h3 className="font-rajdhani font-bold text-2xl text-white mb-4 uppercase">
                Also Available
              </h3>
              <h4 className="font-rajdhani font-bold text-xl text-primary mb-4">
                {otherChallenge.title}
              </h4>
              <p className="text-gray-300 mb-6">
                {otherChallenge.description}
              </p>
              <Link to={otherChallenge.link}>
                <Button className="btn-primary">
                  View Challenge
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default ChallengeNavigation;
