import { Card, CardContent } from '@/components/ui/card';
import { Briefcase, User, Check } from 'lucide-react';

const ProducerROI = () => {
  const ownerBenefits = [
    "Full visibility through 30 daily reports",
    "Deeper insight from 6 weekly reflections",
    "A clear process for identifying and closing gaps in their skills and your systems",
    "A producer who takes ownership of their results"
  ];

  const producerBenefits = [
    "A repeatable system for daily execution",
    "Clarity on high-leverage sales activities",
    "Tools to manage the stress of a sales role",
    "A 90-day plan to continue their growth"
  ];

  return (
    <section className="py-20 relative">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="font-oswald font-bold text-4xl md:text-5xl uppercase tracking-tight text-white text-center mb-16">
            The Return on Investment
          </h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            {/* For Owner */}
            <Card className="bg-dark-card border-primary/20 hover:border-primary/40 transition-all duration-300">
              <CardContent className="p-8">
                <div className="flex items-center mb-6">
                  <div className="w-14 h-14 bg-primary/20 rounded-full flex items-center justify-center mr-4">
                    <Briefcase className="w-7 h-7 text-primary" />
                  </div>
                  <h3 className="font-oswald font-bold text-2xl text-white uppercase">
                    For You, The Owner
                  </h3>
                </div>
                <ul className="space-y-4">
                  {ownerBenefits.map((benefit, index) => (
                    <li key={index} className="flex items-start">
                      <Check className="w-5 h-5 text-primary mr-3 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-300">{benefit}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* For Producer */}
            <Card className="bg-dark-card border-primary/20 hover:border-primary/40 transition-all duration-300">
              <CardContent className="p-8">
                <div className="flex items-center mb-6">
                  <div className="w-14 h-14 bg-primary/20 rounded-full flex items-center justify-center mr-4">
                    <User className="w-7 h-7 text-primary" />
                  </div>
                  <h3 className="font-oswald font-bold text-2xl text-white uppercase">
                    For Your Producer
                  </h3>
                </div>
                <ul className="space-y-4">
                  {producerBenefits.map((benefit, index) => (
                    <li key={index} className="flex items-start">
                      <Check className="w-5 h-5 text-primary mr-3 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-300">{benefit}</span>
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

export default ProducerROI;
