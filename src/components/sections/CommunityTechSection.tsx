import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Smartphone, Brain, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useScrollReveal } from '@/hooks/useScrollReveal';

const CommunityTechSection = () => {
  const { ref, isVisible } = useScrollReveal();

  const techCards = [
    {
      icon: Smartphone,
      title: 'STANDARD APP',
      description: 'Daily accountability and tracking system designed for agency owners who refuse to settle for mediocrity.',
      link: '/app',
    },
    {
      icon: Brain,
      title: 'Agency Brain',
      description: 'Your centralized command center. Every system, every process, every answer - organized and accessible.',
      link: '/app',
    },
    {
      icon: TrendingUp,
      title: 'Call Scoring',
      description: 'Real-time analytics and scoring of your sales calls. Know exactly what\'s working and what\'s not.',
      link: '/app',
    },
  ];

  return (
    <section 
      ref={ref as React.RefObject<HTMLElement>}
      className={`py-20 relative transition-all duration-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
    >
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-oswald font-bold text-4xl md:text-6xl uppercase tracking-tight text-white mb-6">
              <span className="text-primary">TECHNOLOGY</span> THAT SCALES WITH YOU
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              The tools that set elite agencies apart from everyone else
            </p>
          </div>

          {/* Three Interactive Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {techCards.map((card, index) => (
              <Link to={card.link} key={index}>
                <Card className="bg-dark-surface border-primary/20 h-full group card-hover cursor-pointer transition-all duration-300 hover:border-primary/50">
                  <CardHeader>
                    <div className="w-14 h-14 bg-primary/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-primary/20 group-hover:scale-110 transition-all duration-300 accent-glow">
                      <card.icon className="w-7 h-7 text-primary" />
                    </div>
                    <CardTitle className="text-white font-oswald text-2xl uppercase tracking-wide">
                      {card.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-300 leading-relaxed">
                      {card.description}
                    </p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default CommunityTechSection;
