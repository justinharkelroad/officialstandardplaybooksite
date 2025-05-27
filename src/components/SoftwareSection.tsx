
import { Card, CardContent } from '@/components/ui/card';
import { Code, Database, Monitor } from 'lucide-react';

const SoftwareSection = () => {
  const softwareFeatures = [
    {
      icon: <Monitor className="w-12 h-12 text-primary mb-4" />,
      image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=400&h=250&fit=crop",
      title: "Dashboard Analytics",
      description: "Real-time performance tracking and business intelligence tools to monitor your growth and identify optimization opportunities."
    },
    {
      icon: <Code className="w-12 h-12 text-primary-accent mb-4" />,
      image: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=400&h=250&fit=crop",
      title: "Automation Tools",
      description: "Streamline your workflow with powerful automation features that handle repetitive tasks and free up your time for strategic work."
    },
    {
      icon: <Database className="w-12 h-12 text-primary mb-4" />,
      image: "https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7?w=400&h=250&fit=crop",
      title: "Data Management",
      description: "Centralized data platform that integrates all your business metrics and provides actionable insights for better decision making."
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
            Cutting-edge technology platform designed to accelerate your business growth and optimize performance.
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
