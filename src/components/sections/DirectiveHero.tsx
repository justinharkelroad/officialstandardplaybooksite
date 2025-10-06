
import { Button } from '@/components/ui/button';
import { Zap, ArrowRight } from 'lucide-react';

const DirectiveHero = () => {
  const handleBookCall = () => {
    window.open('https://AGENCYCOACHING.as.me/standardfit', '_blank');
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary-accent/10 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '3s' }} />
      </div>

      <div className="container mx-auto px-4 text-center relative z-10">
        <div className="w-16 h-16 bg-primary-accent rounded-square flex items-center justify-center mx-auto mb-8 animate-fade-up">
          <Zap className="w-8 h-8 text-white" />
        </div>
        
        <h1 className="font-rajdhani font-bold text-6xl md:text-8xl uppercase tracking-wide text-white mb-6 animate-fade-up">
          The
          <br />
          <span className="text-gradient">Directive</span>
        </h1>
        
        <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto mb-12 animate-fade-up" style={{ animationDelay: '0.2s' }}>
          Intensive coaching with direct implementation support. Get personalized strategies, 
          accountability, and hands-on guidance to accelerate your growth exponentially.
        </p>

        {/* Hero Image */}
        <div className="max-w-4xl mx-auto mb-12 animate-fade-up" style={{ animationDelay: '0.3s' }}>
          <div className="relative aspect-video bg-dark-card rounded-lg overflow-hidden">
            <img 
              src="/lovable-uploads/c046f138-ec79-47c2-8cee-9e5198756308.png"
              alt="1v1 Coaching Session"
              className="w-full h-full object-cover rounded-lg"
            />
          </div>
        </div>

        <div className="flex justify-center animate-fade-up" style={{ animationDelay: '0.4s' }}>
          <Button 
            className="bg-primary text-white font-bold text-lg px-8 py-4 hover:bg-primary/90"
            onClick={handleBookCall}
          >
            BOOK FREE CALL
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </div>
      </div>
    </section>
  );
};

export default DirectiveHero;
