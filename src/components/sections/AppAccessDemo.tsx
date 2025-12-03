
import VideoModal from '@/components/VideoModal';
import { Button } from '@/components/ui/button';
import { Play } from 'lucide-react';

const AppAccessDemo = () => {
  return (
    <section className="py-20 relative">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center mb-12">
          <h2 className="font-oswald font-bold text-4xl md:text-5xl uppercase tracking-tight text-white mb-8">
            See It In Action
          </h2>
          <p className="text-xl text-gray-300">
            Get a preview of what's inside App Access Only and how it can transform your approach to business.
          </p>
        </div>

        <div className="relative max-w-4xl mx-auto">
          <div className="relative aspect-video bg-dark-card rounded-lg overflow-hidden border border-primary/20">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-primary-accent/20 flex items-center justify-center">
              <VideoModal
                trigger={
                  <Button className="btn-primary text-lg px-8 py-4">
                    <Play className="w-6 h-6 mr-2" />
                    Watch Demo
                  </Button>
                }
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AppAccessDemo;
