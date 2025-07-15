
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, MessageCircle, FileText } from 'lucide-react';

const BoardroomFeatures = () => {
  return (
    <section className="py-20 relative">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center mb-16">
          <h2 className="font-rajdhani font-bold text-4xl md:text-5xl uppercase tracking-wide text-white mb-8">
            What Really Happens in The Boardroom
          </h2>
          <div className="text-xl text-gray-300 leading-relaxed space-y-4">
            <p><strong>MONTH 1:</strong> You'll want to quit. Everyone here is bigger than you. Smarter than you. More successful than you. Your imposter syndrome will scream. Good. That means you're finally in the right room.</p>
            
            <p><strong>MONTH 3:</strong> You'll make your first real decision. The kind that changes trajectories. Because someone who lost $2M making the wrong choice just saved you from the same fate. Their scar. Your wisdom. Their pain. Your profit.</p>
            
            <p><strong>MONTH 6:</strong> You won't recognize your business. That problem that's tortured you for three years? Solved in 12 minutes by someone who's been there. That strategy you've been afraid to try? Validated by someone who 10x'd with it.</p>
            
            <p><strong>MONTH 12:</strong> You won't recognize yourself. The person who used to ask "how?" now knows. The person who used to hesitate? Executes. The person who used to hide? Leads.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <Card className="bg-dark-card border-primary/20 card-hover text-center">
            <CardHeader>
              <div className="w-16 h-16 bg-primary rounded-square flex items-center justify-center mx-auto mb-4">
                <Calendar className="w-8 h-8 text-white" />
              </div>
              <CardTitle className="text-white font-rajdhani text-xl uppercase tracking-wide">
                2 Hours That Hit Like 2 Years of MBA
              </CardTitle>
              <CardDescription className="text-gray-400">
                No theory. Just scars turned into strategy.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="text-gray-300 space-y-2 text-left">
                <li>• No theory. Just scars turned into strategy.</li>
                <li>• No slides. Just truth that cuts through BS.</li>
                <li>• No networking. Just operators building empires.</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="bg-dark-card border-primary/20 card-hover text-center">
            <CardHeader>
              <div className="w-16 h-16 bg-primary-accent rounded-square flex items-center justify-center mx-auto mb-4">
                <MessageCircle className="w-8 h-8 text-white" />
              </div>
              <CardTitle className="text-white font-rajdhani text-xl uppercase tracking-wide">
                Access to Agency Owners Just Like You
              </CardTitle>
              <CardDescription className="text-gray-400">
                Not Facebook group motivation. Direct access to people who sign your size of checks.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="text-gray-300 space-y-2 text-left">
                <li>• At 11 PM when the deal's falling apart.</li>
                <li>• At 6 AM when you need to fire someone.</li>
                <li>• Real-time crisis intervention</li>
                <li>• Direct access to proven operators</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="bg-dark-card border-primary/20 card-hover text-center">
            <CardHeader>
              <div className="w-16 h-16 bg-primary rounded-square flex items-center justify-center mx-auto mb-4">
                <FileText className="w-8 h-8 text-white" />
              </div>
              <CardTitle className="text-white font-rajdhani text-xl uppercase tracking-wide">
                The Playbook That Builds Producers of Life
              </CardTitle>
              <CardDescription className="text-gray-400">
                Not an ebook. The actual playbook. The one Justin used. The one that works.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="text-gray-300 space-y-2 text-left">
                <li>• Hardcover. Because PDFs are for people who don't implement.</li>
                <li>• Monthly Reality Checks from Justin</li>
                <li>• He's not your friend. He's your mirror.</li>
                <li>• You can't hide from exposing gamification numbers.</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default BoardroomFeatures;
