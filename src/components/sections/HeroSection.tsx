
import { Button } from '@/components/ui/button';
import { ArrowRight, Play } from 'lucide-react';
import VideoModal from '@/components/VideoModal';

interface HeroSectionProps {
  onScrollToSection?: (sectionId: string) => void;
}

const HeroSection = ({ onScrollToSection }: HeroSectionProps) => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-32">
      {/* Background with subtle overlay */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-primary-accent/10 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 text-center relative z-10">
        <h1 className="font-rajdhani font-bold text-4xl md:text-6xl lg:text-7xl uppercase tracking-wide text-white mb-6 animate-fade-up">
          <span className="text-purple-400">Live the Playbook</span>
          <br />
          <span className="text-gradient">Execute Daily</span>
        </h1>
        
        <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto mb-12 animate-fade-up" style={{ animationDelay: '0.2s' }}>
          Stop hoping for results. Start getting them with systems that work.
        </p>

        <div className="flex flex-col sm:flex-row gap-6 justify-center items-center animate-fade-up" style={{ animationDelay: '0.3s' }}>
          <Button className="btn-primary text-lg px-8 py-4">
            Get Started Today
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
          
          <VideoModal
            trigger={
              <Button variant="ghost" className="btn-ghost text-lg px-8 py-4">
                <Play className="mr-2 h-5 w-5" />
                Watch Demo
              </Button>
            }
            videoId="dQw4w9WgXcQ"
            title="Product Demo"
          />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
