
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
            Your Brain Is a Weapon. Most People Use It Against Themselves.
          </h2>
          <div className="max-w-4xl mx-auto space-y-4 text-xl text-gray-300">
            <p className="text-primary font-medium">Small wins are cocaine for your confidence.</p>
            
            <p>Every producer reading this has two choices:</p>
            <p>1. Keep lying to yourself about "tomorrow"</p>
            <p>2. Stack evidence that you're exactly who you claim to be</p>
            
            <p className="text-white font-medium">The Standard app doesn't motivate you. It exposes you.</p>
            
            <p><strong>Daily Habits?</strong> Your family sees who you really are at 5 AM.</p>
            <p><strong>Setting Goals?</strong> Your bank account already knows if you're serious.</p>
            <p><strong>The Stack?</strong> 47 other agents watched their excuses die here.</p>
            
            <p className="text-primary font-medium">Because accountability without consequences is just expensive friendship.</p>
          </div>
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
