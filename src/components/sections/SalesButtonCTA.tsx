import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

const SalesButtonCTA = () => {
  return (
    <section className="py-12 relative">
      <div className="container mx-auto px-4 text-center">
        <a href="https://AGENCYCOACHING.as.me/8week" target="_blank" rel="noopener noreferrer">
          <Button 
            className="bg-red-600 hover:bg-red-700 text-white text-lg px-8 py-4"
          >
            Book A Call
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </a>
      </div>
    </section>
  );
};

export default SalesButtonCTA;