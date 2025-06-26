
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface PricingOption {
  title: string;
  price: string;
  originalPrice?: string;
  features?: string[];
  badge?: string;
  highlighted?: boolean;
}

interface ChallengePricingProps {
  title: string;
  options: PricingOption[];
  onEnrollClick: (option: PricingOption) => void;
}

const ChallengePricing = ({ title, options, onEnrollClick }: ChallengePricingProps) => {
  return (
    <section className="py-20 relative">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto text-center mb-16">
          <h2 className="font-rajdhani font-bold text-4xl md:text-5xl uppercase tracking-wide text-white mb-8">
            {title}
          </h2>
        </div>

        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
          {options.map((option, index) => (
            <Card 
              key={index} 
              className="relative bg-dark-card border-primary/20 hover:shadow-xl transition-all duration-300"
            >
              {option.badge && (
                <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-primary text-white">
                  {option.badge}
                </Badge>
              )}
              
              <CardHeader className="text-center pb-4">
                <h3 className="font-rajdhani font-bold text-2xl text-white uppercase mb-4">
                  {option.title}
                </h3>
                <div className="flex items-center justify-center space-x-2">
                  {option.originalPrice && (
                    <span className="text-gray-500 line-through text-lg">
                      {option.originalPrice}
                    </span>
                  )}
                  <span className="font-rajdhani font-bold text-4xl text-primary">
                    {option.price}
                  </span>
                </div>
              </CardHeader>
              
              <CardContent className="pt-4">
                {option.features && (
                  <ul className="space-y-2 mb-6">
                    {option.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="text-gray-300 text-sm">
                        • {feature}
                      </li>
                    ))}
                  </ul>
                )}
                
                <Button 
                  onClick={() => onEnrollClick(option)}
                  className="btn-primary w-full"
                >
                  Enroll Now
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ChallengePricing;
