
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

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
          <Accordion type="single" collapsible className="space-y-4">
            <AccordionItem value="item-1" className="bg-dark-card border border-primary/20 rounded-lg px-6">
              <AccordionTrigger className="text-white font-rajdhani text-lg uppercase tracking-wide">
                What's included in the 8-week training program?
              </AccordionTrigger>
              <AccordionContent className="text-gray-300">
                You get 8 weeks of direct one-on-one coaching with Justin, custom sales management process development, accountability framework creation, consequence ladder implementation, and ongoing support throughout the transformation.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-2" className="bg-dark-card border border-primary/20 rounded-lg px-6">
              <AccordionTrigger className="text-white font-rajdhani text-lg uppercase tracking-wide">
                Who participates in the sessions?
              </AccordionTrigger>
              <AccordionContent className="text-gray-300">
                Either you as the agency owner or your sales manager can participate in the one-on-one sessions with Justin. We recommend whoever will be directly implementing and overseeing the sales management processes on a daily basis.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-3" className="bg-dark-card border border-primary/20 rounded-lg px-6">
              <AccordionTrigger className="text-white font-rajdhani text-lg uppercase tracking-wide">
                How quickly will we see results?
              </AccordionTrigger>
              <AccordionContent className="text-gray-300">
                Most agencies start seeing improvements in sales management effectiveness and team accountability within the first 2-3 weeks. Full transformation and consistent results typically manifest by week 6-8 and continue growing from there.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-4" className="bg-dark-card border border-primary/20 rounded-lg px-6">
              <AccordionTrigger className="text-white font-rajdhani text-lg uppercase tracking-wide">
                What if our current sales management process is already established?
              </AccordionTrigger>
              <AccordionContent className="text-gray-300">
                We'll audit your existing management processes and identify gaps or inefficiencies. The program focuses on optimization and enhancement, building on what works while fixing what doesn't to create a more effective management system.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </div>
    </section>
  );
};

export default SalesFAQ;
