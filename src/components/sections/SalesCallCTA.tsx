
import { Button } from '@/components/ui/button';
import { Phone } from 'lucide-react';

const SalesCallCTA = () => {
  return (
    <section className="py-12 relative">
      <div className="container mx-auto px-4 text-center">
        <a href="https://AGENCYCOACHING.as.me/8week" target="_blank" rel="noopener noreferrer">
          <Button className="bg-red-600 hover:bg-red-700 text-white text-lg px-8 py-4 transition-all duration-300 transform hover:scale-105">
            <Phone className="w-5 h-5 mr-2" />
            Book a FREE 15m Call
          </Button>
        </a>
      </div>
    </section>
  );
};

export default SalesCallCTA;
