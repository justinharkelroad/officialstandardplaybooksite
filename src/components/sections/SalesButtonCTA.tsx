import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

interface SalesButtonCTAProps {
  onScrollToPayment: () => void;
}

const SalesButtonCTA = ({ onScrollToPayment }: SalesButtonCTAProps) => {
  return (
    <section className="py-12 relative">
      <div className="container mx-auto px-4 text-center">
        <Button 
          onClick={onScrollToPayment}
          className="btn-primary text-lg px-8 py-4"
        >
          STOP MANAGING. START DOMINATING
          <ArrowRight className="w-5 h-5 ml-2" />
        </Button>
      </div>
    </section>
  );
};

export default SalesButtonCTA;