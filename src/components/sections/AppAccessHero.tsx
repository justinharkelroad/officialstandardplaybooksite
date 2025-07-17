
import { Button } from '@/components/ui/button';
import { Target, ArrowRight } from 'lucide-react';

interface AppAccessHeroProps {
  onGetStartedClick: () => void;
}

const AppAccessHero = ({ onGetStartedClick }: AppAccessHeroProps) => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/10 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-primary-accent/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '3s' }} />
      </div>

      <div className="container mx-auto px-4 text-center relative z-10">
        <div className="w-16 h-16 bg-primary rounded-square flex items-center justify-center mx-auto mb-8 animate-fade-up">
          <Target className="w-8 h-8 text-white" />
        </div>
        
        <h1 className="font-rajdhani font-bold text-4xl md:text-6xl lg:text-7xl uppercase tracking-wide text-white mb-6 animate-fade-up leading-tight">
          The App That Knows You're Lying
          <br />
          <span className="text-gradient">Before You Do</span>
        </h1>
        
        <div className="max-w-4xl mx-auto space-y-6 animate-fade-up" style={{ animationDelay: '0.2s' }}>
          <p className="text-xl md:text-2xl text-gray-300">
            The Standard app doesn't motivate. It mirrors.
            <br />
            Every stack. Every skip. Every excuse.
            <br />
            All reflected back until you can't unsee who you really are.
          </p>
          
          <p className="text-lg md:text-xl text-gray-300">
            Most apps help you feel better.
            <br />
            This one helps you become better.
          </p>
          
          <p className="text-xl md:text-2xl text-primary font-medium">
            Violently. Honestly. Permanently.
          </p>
        </div>

        {/* Hero Image */}
        <div className="max-w-4xl mx-auto mb-12 animate-fade-up" style={{ animationDelay: '0.3s' }}>
          <img 
            src="/lovable-uploads/33c19236-cc4d-46b8-9b30-461dc652c7e7.png"
            alt="App Access Interface"
            className="w-full h-auto max-w-4xl mx-auto"
          />
        </div>

        <div className="flex justify-center animate-fade-up" style={{ animationDelay: '0.4s' }}>
          <Button 
            className="bg-white text-primary font-bold text-sm sm:text-lg px-6 sm:px-8 py-3 sm:py-4 hover:bg-gray-100 truncate max-w-[90%]"
            onClick={onGetStartedClick}
          >
            CHOOSE YOUR MIRROR
            <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 ml-2 flex-shrink-0" />
          </Button>
        </div>
      </div>
    </section>
  );
};

export default AppAccessHero;
