
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

const AppAccessFAQ = () => {
  return (
    <section className="py-20 relative">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="font-oswald font-bold text-4xl md:text-5xl uppercase tracking-tight text-white mb-6">
            App Access FAQ
          </h2>
        </div>

        <div className="max-w-4xl mx-auto">
          <Accordion type="single" collapsible className="space-y-4">
            <AccordionItem value="item-1" className="bg-dark-card border border-primary/20 rounded-lg px-6">
              <AccordionTrigger className="text-white font-oswald text-lg uppercase tracking-tight">
                What's included in App Access Only?
              </AccordionTrigger>
              <AccordionContent className="text-gray-300">
                You get access to our complete training library, including video courses, downloadable resources, community forum, and monthly group sessions. Everything you need to build a strong entrepreneurial foundation.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-2" className="bg-dark-card border border-primary/20 rounded-lg px-6">
              <AccordionTrigger className="text-white font-oswald text-lg uppercase tracking-tight">
                Can I upgrade to higher programs later?
              </AccordionTrigger>
              <AccordionContent className="text-gray-300">
                Absolutely. App Access Only is designed as a stepping stone. Once you've mastered the fundamentals, you can upgrade to The Boardroom, Directive, or Partnership programs at any time.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-3" className="bg-dark-card border border-primary/20 rounded-lg px-6">
              <AccordionTrigger className="text-white font-oswald text-lg uppercase tracking-tight">
                How long does it take to see results?
              </AccordionTrigger>
              <AccordionContent className="text-gray-300">
                Most members start seeing mindset shifts and improved clarity within the first 30 days. Tangible business results typically follow within 60-90 days of consistent implementation.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-4" className="bg-dark-card border border-primary/20 rounded-lg px-6">
              <AccordionTrigger className="text-white font-oswald text-lg uppercase tracking-tight">
                Is this suitable for complete beginners?
              </AccordionTrigger>
              <AccordionContent className="text-gray-300">
                Yes, App Access Only is perfect for entrepreneurs at any stage who want to solidify their foundation. Whether you're just starting or have been in business for years, these fundamentals are crucial.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </div>
    </section>
  );
};

export default AppAccessFAQ;
