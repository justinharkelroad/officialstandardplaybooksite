
import { Card, CardContent } from '@/components/ui/card';
import { X, ArrowRight } from 'lucide-react';

interface ChallengePainSolutionProps {
  painPoints: string[];
  solutions: string[];
}

const ChallengePainSolution = ({ painPoints, solutions }: ChallengePainSolutionProps) => {
  return (
    <section className="py-20 relative">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="font-rajdhani font-bold text-4xl md:text-5xl uppercase tracking-wide text-white text-center mb-16">
            Pain → Possibility
          </h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            {/* Pain Column */}
            <Card className="bg-red-900/20 border-red-500/30 hover:shadow-xl transition-shadow duration-300">
              <CardContent className="p-8">
                <div className="flex items-center mb-6">
                  <X className="w-8 h-8 text-red-400 mr-3" />
                  <h3 className="font-rajdhani font-bold text-2xl text-red-400 uppercase">
                    Current Pain
                  </h3>
                </div>
                <ul className="space-y-4">
                  {painPoints.map((point, index) => (
                    <li key={index} className="flex items-start">
                      <span className="text-red-400 mr-3">•</span>
                      <span className="text-gray-300">{point}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Solution Column */}
            <Card className="bg-green-900/20 border-primary/30 hover:shadow-xl transition-shadow duration-300">
              <CardContent className="p-8">
                <div className="flex items-center mb-6">
                  <ArrowRight className="w-8 h-8 text-primary mr-3" />
                  <h3 className="font-rajdhani font-bold text-2xl text-primary uppercase">
                    Future Possibility
                  </h3>
                </div>
                <ul className="space-y-4">
                  {solutions.map((solution, index) => (
                    <li key={index} className="flex items-start">
                      <span className="text-primary mr-3">•</span>
                      <span className="text-gray-300">{solution}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ChallengePainSolution;
