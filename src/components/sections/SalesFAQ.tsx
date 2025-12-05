
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import BookingModal from '@/components/BookingModal';

const SalesFAQ = () => {
  return (
    <section className="py-20 relative">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-oswald font-bold text-4xl md:text-5xl uppercase tracking-tight text-white mb-6">
              The Only Guarantee That Matters
            </h2>
          </div>
          <div className="bg-dark-card border border-primary/20 rounded-lg p-8 md:p-12 text-center">
            <div className="text-gray-300 space-y-6 text-lg">
              <p>
                Our 1-on-1 work is focused on <span className="text-primary font-medium">implementation, not just theory</span>.
              </p>
              <p className="text-2xl md:text-3xl text-white font-oswald uppercase tracking-tight">
                If you don't have a clear path to achieving your goals, I'll give you your money back.
              </p>
              <p className="text-primary font-medium text-xl">
                And I'll work for free until you do.
              </p>
              <p className="text-gray-400">
                Because if it doesn't work for you, then it wasn't worth it.
              </p>
            </div>
            <div className="mt-10">
              <BookingModal
                trigger={
                  <Button className="btn-primary text-lg px-8 py-6">
                    BOOK YOUR STRATEGY CALL TO BUILD YOUR BLUEPRINT
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

export default SalesFAQ;
