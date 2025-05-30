
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpen, Video, Users } from 'lucide-react';

const AppAccessSolution = () => {
  return (
    <section className="py-20 relative">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center mb-16">
          <h2 className="font-rajdhani font-bold text-4xl md:text-5xl uppercase tracking-wide text-white mb-8">
            The Standard Solution
          </h2>
          <p className="text-xl text-gray-300 leading-relaxed">
            App Access Only gives you the essential tools and frameworks to build your entrepreneurial foundation. 
            Master the basics, develop the right habits, and create the mindset for long-term success.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <Card className="bg-dark-card border-primary/20 card-hover text-center">
            <CardHeader>
              <div className="w-16 h-16 bg-primary rounded-square flex items-center justify-center mx-auto mb-4">
                <BookOpen className="w-8 h-8 text-white" />
              </div>
              <CardTitle className="text-white font-rajdhani text-xl uppercase tracking-wide">
                Core Curriculum
              </CardTitle>
              <CardDescription className="text-gray-400">
                Essential training modules covering business fundamentals
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="text-gray-300 space-y-2 text-left">
                <li>• Mindset development frameworks</li>
                <li>• Goal setting and achievement systems</li>
                <li>• Time management strategies</li>
                <li>• Business planning fundamentals</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="bg-dark-card border-primary/20 card-hover text-center">
            <CardHeader>
              <div className="w-16 h-16 bg-primary-accent rounded-square flex items-center justify-center mx-auto mb-4">
                <Video className="w-8 h-8 text-white" />
              </div>
              <CardTitle className="text-white font-rajdhani text-xl uppercase tracking-wide">
                Video Library
              </CardTitle>
              <CardDescription className="text-gray-400">
                Comprehensive training videos and masterclasses
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="text-gray-300 space-y-2 text-left">
                <li>• Weekly masterclass sessions</li>
                <li>• Case study breakdowns</li>
                <li>• Implementation guides</li>
                <li>• Success story interviews</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="bg-dark-card border-primary/20 card-hover text-center">
            <CardHeader>
              <div className="w-16 h-16 bg-primary rounded-square flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-white" />
              </div>
              <CardTitle className="text-white font-rajdhani text-xl uppercase tracking-wide">
                Community Access
              </CardTitle>
              <CardDescription className="text-gray-400">
                Connect with like-minded entrepreneurs on the same journey
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="text-gray-300 space-y-2 text-left">
                <li>• Private community forum</li>
                <li>• Peer networking opportunities</li>
                <li>• Accountability partnerships</li>
                <li>• Monthly group challenges</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default AppAccessSolution;
