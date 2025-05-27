
import { Card, CardContent } from '@/components/ui/card';
import { Diamond, TrendingUp, BookOpen } from 'lucide-react';

const SoftwareSection = () => {
  const softwareFeatures = [
    {
      icon: <Diamond className="w-12 h-12 text-primary mb-4" />,
      image: "/lovable-uploads/c3d40ca0-ec94-4c01-af93-49868153b917.png",
      title: "DAILY HABITS",
      description: "Build daily habits that are trackable, measurable, and designed to bring clarity and peace as you follow through"
    },
    {
      icon: <TrendingUp className="w-12 h-12 text-primary mb-4" />,
      image: "/lovable-uploads/2b29455c-b05c-404c-be6e-72207bf1fa04.png",
      title: "SETTING GOALS",
      description: "Set annual goals, then break them down into quarterly targets. Become even more clear in your monthly missions and weekly strikes."
    },
    {
      icon: <BookOpen className="w-12 h-12 text-primary mb-4" />,
      image: "/lovable-uploads/d4f5f630-fa1b-4042-b55c-e9f612ef369e.png",
      title: "THE STACK",
      description: "Attack with The Stack. Start bring full clarity to your thoughts & feelings to generate actionable solutions."
    }
  ];

  return (
    <section className="py-20 relative">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="font-rajdhani font-bold text-4xl md:text-6xl uppercase tracking-wide text-white mb-6">
            The Software
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            The #1 Productivity, Accountability and Growth Program in the World.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {softwareFeatures.map((feature, index) => (
            <Card key={index} className="bg-dark-card border-primary/20 card-hover overflow-hidden">
              <div className="relative">
                <img 
                  src={feature.image} 
                  alt={feature.title}
                  className="w-full h-48 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-dark-card/80 to-transparent" />
              </div>
              <CardContent className="p-6 text-center">
                <div className="flex justify-center mb-4">
                  {feature.icon}
                </div>
                <h3 className="font-rajdhani font-bold text-xl uppercase tracking-wide text-white mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-300 leading-relaxed">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SoftwareSection;
