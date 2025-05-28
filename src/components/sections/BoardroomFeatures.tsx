
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, MessageCircle, FileText } from 'lucide-react';

const BoardroomFeatures = () => {
  return (
    <section className="py-20 relative">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center mb-16">
          <h2 className="font-rajdhani font-bold text-4xl md:text-5xl uppercase tracking-wide text-white mb-8">
            Your Strategic Network
          </h2>
          <p className="text-xl text-gray-300 leading-relaxed">
            The Standard Boardroom connects you with ambitious agency owners at your level. Get strategic advice, 
            accountability, and the peer support that accelerates growth while avoiding common pitfalls.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <Card className="bg-dark-card border-primary/20 card-hover text-center">
            <CardHeader>
              <div className="w-16 h-16 bg-primary rounded-square flex items-center justify-center mx-auto mb-4">
                <Calendar className="w-8 h-8 text-white" />
              </div>
              <CardTitle className="text-white font-rajdhani text-xl uppercase tracking-wide">
                Monthly 2 Hour Call
              </CardTitle>
              <CardDescription className="text-gray-400">
                Strategic sessions with fellow agency owners and expert facilitators
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="text-gray-300 space-y-2 text-left">
                <li>• Hot seat coaching sessions</li>
                <li>• Group problem-solving</li>
                <li>• Strategic planning workshops</li>
                <li>• Guest expert presentations</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="bg-dark-card border-primary/20 card-hover text-center">
            <CardHeader>
              <div className="w-16 h-16 bg-primary-accent rounded-square flex items-center justify-center mx-auto mb-4">
                <MessageCircle className="w-8 h-8 text-white" />
              </div>
              <CardTitle className="text-white font-rajdhani text-xl uppercase tracking-wide">
                Private Chat App
              </CardTitle>
              <CardDescription className="text-gray-400">
                24/7 access to an exclusive network of high-performers
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="text-gray-300 space-y-2 text-left">
                <li>• Real-time discussion forums</li>
                <li>• Direct member connections</li>
                <li>• Resource sharing library</li>
                <li>• Accountability partnerships</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="bg-dark-card border-primary/20 card-hover text-center">
            <CardHeader>
              <div className="w-16 h-16 bg-primary rounded-square flex items-center justify-center mx-auto mb-4">
                <FileText className="w-8 h-8 text-white" />
              </div>
              <CardTitle className="text-white font-rajdhani text-xl uppercase tracking-wide">
                Strategy Resources
              </CardTitle>
              <CardDescription className="text-gray-400">
                Proven frameworks and tools for business optimization
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="text-gray-300 space-y-2 text-left">
                <li>• Strategic planning templates</li>
                <li>• 24/7 Justin Video Chat</li>
                <li>• Growth playbooks</li>
                <li>• AI Process Trainings</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default BoardroomFeatures;
