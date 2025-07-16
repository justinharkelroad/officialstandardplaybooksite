
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';

const SalesFAQ = () => {
  return (
    <section className="py-20 relative">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="font-rajdhani font-bold text-4xl md:text-5xl uppercase tracking-wide text-white mb-6">
            Sales Management Training FAQ
          </h2>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="bg-dark-card border border-primary/20 rounded-lg p-8 mb-8">
            <h3 className="font-rajdhani font-bold text-2xl uppercase tracking-wide text-white mb-4">
              The Only Guarantee That Matters
            </h3>
            <div className="text-gray-300 space-y-4">
              <p>If you don't see value after 8 weeks, I'll give you your money back...</p>
              <p className="text-primary font-medium text-xl">STRAIGHT UP.</p>
              <p>Not because the system doesn't work.<br />Because if it doesn't work for you, you weren't working.</p>
              <p className="text-primary font-medium">And I only want money from people who implement.</p>
              <p>Fair?</p>
            </div>
            <div className="mt-8">
              <a href="https://AGENCYCOACHING.as.me/standardfit" target="_blank" rel="noopener noreferrer">
                <Button className="btn-primary">
                  BOOK YOUR TRANSFORMATION CALL →
                </Button>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SalesFAQ;
