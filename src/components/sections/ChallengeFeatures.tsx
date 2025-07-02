
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle, ZoomIn } from 'lucide-react';

interface ChallengeFeature {
  title: string;
  description?: string;
}

interface ChallengeFeaturesProps {
  title: string;
  features: ChallengeFeature[];
  layout?: 'grid' | 'list';
}

const ChallengeFeatures = ({ title, features, layout = 'grid' }: ChallengeFeaturesProps) => {
  return (
    <section className="py-20 relative">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto text-center mb-16">
          <h2 className="font-rajdhani font-bold text-4xl md:text-5xl uppercase tracking-wide text-white mb-8">
            {title}
          </h2>
        </div>

        <div className="max-w-6xl mx-auto">
          {layout === 'grid' ? (
            <div className="space-y-6">
              {/* Challenge Onboarding Call - Full Width Box */}
              <Card className="bg-dark-card border-primary/20 hover:shadow-xl transition-shadow duration-300">
                <CardContent className="p-8 text-center">
                  <ZoomIn className="w-12 h-12 text-primary mx-auto mb-6" />
                  <h3 className="font-rajdhani font-bold text-2xl text-white mb-4 uppercase">
                    Challenge On Boarding Call Before Launch
                  </h3>
                  <p className="text-gray-300 text-base max-w-4xl mx-auto">
                    You will book a 30 Minute Launch Call the week before your challenge will begin to understand every detail and ask all the clarifying questions
                  </p>
                </CardContent>
              </Card>
              
              {/* Original 4 Feature Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {features.map((feature, index) => (
                  <Card key={index} className="bg-dark-card border-primary/20 hover:shadow-xl transition-shadow duration-300">
                    <CardContent className="p-6 text-center">
                      <CheckCircle className="w-8 h-8 text-primary mx-auto mb-4" />
                      <h3 className="font-rajdhani font-bold text-lg text-white mb-2 uppercase">
                        {feature.title}
                      </h3>
                      {feature.description && (
                        <p className="text-gray-300 text-sm">{feature.description}</p>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          ) : (
            <Card className="bg-dark-card border-primary/20">
              <CardContent className="p-8">
                <ul className="space-y-6">
                  {features.map((feature, index) => (
                    <li key={index} className="flex items-start space-x-4">
                      <CheckCircle className="w-6 h-6 text-primary mt-1 flex-shrink-0" />
                      <div>
                        <h3 className="text-white font-medium">{feature.title}</h3>
                        {feature.description && (
                          <p className="text-gray-300 mt-1">{feature.description}</p>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </section>
  );
};

export default ChallengeFeatures;
