
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Users, Zap, Crown, Briefcase, Shield } from 'lucide-react';
import { useScrollReveal } from '@/hooks/useScrollReveal';
import { useParallax } from '@/hooks/useParallax';

const OffersGrid = () => {
  const { ref: sectionRef, isVisible } = useScrollReveal();
  const navigate = useNavigate();

  const programs = [
    {
      title: 'THE BOARDROOM',
      description: 'Isolation is where good agencies go to die.',
      copy: 'Every month, you sit across from owners who\'ve already been where you\'re trying to go. They see through your excuses. They call out your blind spots. They refuse to let you hide.',
      emphasis: 'This isn\'t networking. It\'s chemotherapy for your comfort zone.',
      italic: 'Your competition hopes you\'ll stay comfortable.',
      icon: Users,
      link: '/boardroom',
      color: 'primary',
    },
    {
      title: 'THE DIRECTIVE',
      description: 'When good enough isn\'t good enough anymore.',
      copy: '2 hours. You and Justin. No hiding. He\'s built what you\'re trying to build. Sold what you\'re trying to sell. Failed where you\'re about to fail.',
      emphasis: 'The only question: Are you coachable or just curious?',
      italic: 'Curious people take notes. Coachable people take action.',
      icon: Zap,
      link: '/directive',
      color: 'primary-accent',
    },
    {
      title: 'THE PARTNERSHIP',
      description: 'Exclusive 1-on-1 coaching with Justin.',
      copy: 'Full partnership with direct access, custom strategy, and accountability at the highest level. Limited availability.',
      emphasis: 'This is the inner circle.',
      italic: 'Not for everyone. Reserved for the serious.',
      icon: Shield,
      link: '/partnership',
      color: 'primary',
      soldOut: true
    },
    {
      title: '8-WEEK SALES MANAGEMENT',
      description: 'Master the art of building a sales machine.',
      copy: 'Transform your sales team with our proven 8-week training system. Stop hoping for results and start systematizing success.',
      emphasis: 'Sales isn\'t luck. It\'s a system.',
      italic: 'Your best salespeople aren\'t born. They\'re built.',
      icon: Briefcase,
      link: '/sales-experience',
      color: 'primary',
    },
    {
      title: 'PRODUCER CHALLENGE',
      description: 'For managers and agents ready to dominate.',
      copy: 'A 6-week intensive that transforms average producers into elite performers. Your agency deserves better than mediocrity.',
      emphasis: 'Average is the enemy of excellence.',
      italic: 'Stop accepting excuses. Start demanding results.',
      icon: Crown,
      link: '/thechallenge',
      color: 'primary-accent',
    },
    {
      title: 'CALL SCORING',
      description: 'Real-time analytics and scoring of your sales calls.',
      copy: 'Know exactly what\'s working and what\'s not. Transform your sales coaching in minutes with AI-powered call scoring.',
      emphasis: 'Stop guessing. Start knowing.',
      italic: 'Your competition is already using data. Are you?',
      icon: Zap,
      link: '/callscoring',
      color: 'primary',
    },
  ];

  return (
    <section 
      ref={sectionRef as React.RefObject<HTMLElement>}
      id="offers" 
      className={`py-20 relative transition-all duration-500 ${isVisible ? 'opacity-100' : 'opacity-0'}`}
    >
      <div className="container mx-auto px-4">
        <div className="text-center mb-24">
          <h2 className="font-oswald font-bold text-4xl md:text-6xl uppercase tracking-tight text-white mb-6">
            CHOOSE YOUR PATH
          </h2>
          <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto mb-8 leading-relaxed">
            Whether you are just looking for technology to hold your teams accountable, group coaching or 1 on 1 exclusive coaching.
          </p>
          
          {/* Compare Options Box */}
          <div className="max-w-2xl mx-auto mb-16">
            <Card className="bg-dark-surface border-primary/30 hover:border-primary/60 transition-all duration-300">
              <CardContent className="p-8 text-center">
                <p className="text-gray-300 mb-6 text-lg">
                  Not sure which path is right for you?
                </p>
                <Button 
                  onClick={() => navigate('/decision')}
                  className="btn-primary text-lg px-8 py-4 button-press"
                >
                  COMPARE ALL OPTIONS FOR MY AGENCY
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-7xl mx-auto">
          {programs.map((program, index) => {
            // Removed parallax to prevent overlap issues
            const { ref: cardRef } = useScrollReveal();
            
            return (
              <div 
                key={program.title}
                ref={cardRef as React.RefObject<HTMLDivElement>}
                className="transition-all duration-300"
              >
                <Card className="bg-dark-surface border-primary/20 h-full group hover:border-primary/50 transition-all duration-300">
                  <CardHeader>
                    <div className={`w-12 h-12 bg-${program.color}/10 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform accent-glow`}>
                      <program.icon className={`w-6 h-6 text-${program.color}`} />
                    </div>
                    <CardTitle className="text-white font-oswald text-2xl md:text-3xl uppercase tracking-wide">
                      {program.title}
                    </CardTitle>
                    <CardDescription className="text-dark-muted">
                      {program.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3 mb-6">
                      <p className="text-gray-300">{program.copy}</p>
                      
                      <p className="text-primary font-medium">{program.emphasis}</p>
                      
                      <p className="text-gray-300 italic">{program.italic}</p>
                    </div>
                    {program.soldOut ? (
                      <Button disabled className="bg-stroke/50 text-muted font-bold text-lg px-8 py-4 w-full cursor-not-allowed">
                        SOLD OUT
                      </Button>
                    ) : (
                      <Button 
                        onClick={() => navigate(program.link)}
                        className="btn-primary text-lg px-8 py-4 w-full button-press"
                      >
                        LEARN MORE
                        <ArrowRight className="w-5 h-5 ml-2" />
                      </Button>
                    )}
                  </CardContent>
                </Card>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default OffersGrid;
