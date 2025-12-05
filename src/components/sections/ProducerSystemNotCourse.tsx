import { Card, CardContent } from '@/components/ui/card';
import { RotateCw, Mail, Heart } from 'lucide-react';

const ProducerSystemNotCourse = () => {
  const differentiators = [
    {
      icon: RotateCw,
      title: "A DAILY ACTION LOOP",
      description: "Producers don't just consume content. They are required to declare a takeaway and a measurable action every single day, training them to deploy what they learn immediately."
    },
    {
      icon: Mail,
      title: "DIRECT FEEDBACK TO YOU",
      description: "You are not left in the dark. You receive daily and weekly reports directly from your producer, giving you an unprecedented view into their engagement and application."
    },
    {
      icon: Heart,
      title: "HOLISTIC DEVELOPMENT",
      description: "Performance isn't just about sales tactics. We build the whole producer through the Core 4: Body, Being, Balance, and Business—ensuring the rest of their life fuels their work, not drains it."
    }
  ];

  return (
    <section className="py-20 relative">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="font-oswald font-bold text-4xl md:text-5xl uppercase tracking-tight text-white text-center mb-4">
            A System, Not a Course
          </h2>
          <p className="text-xl text-gray-300 text-center mb-16 max-w-3xl mx-auto">
            Other programs provide content. We provide a mechanism for verifiable change.
          </p>
          
          <div className="grid md:grid-cols-3 gap-8">
            {differentiators.map((item, index) => (
              <Card key={index} className="bg-dark-card border-primary/20 hover:border-primary/40 transition-all duration-300 hover:-translate-y-1">
                <CardContent className="p-8 text-center">
                  <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-6">
                    <item.icon className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="font-oswald font-bold text-xl text-white uppercase mb-4">
                    {item.title}
                  </h3>
                  <p className="text-gray-300 leading-relaxed">
                    {item.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProducerSystemNotCourse;
