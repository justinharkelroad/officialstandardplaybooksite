
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

const FAQSection = () => {
  return (
    <section id="faq" className="py-20 relative">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="font-rajdhani font-bold text-4xl md:text-6xl uppercase tracking-wide text-white mb-6">
            Frequently Asked Questions
          </h2>
        </div>

        <div className="max-w-4xl mx-auto">
          <Accordion type="single" collapsible className="space-y-4">
            <AccordionItem value="item-1" className="bg-dark-card border border-primary/20 rounded-lg px-6">
              <AccordionTrigger className="text-white font-rajdhani text-lg uppercase tracking-wide">
                What makes The Standard Playbook different?
              </AccordionTrigger>
              <AccordionContent className="text-gray-300">
                We focus exclusively on high-performing entrepreneurs who are serious about scaling. Our proven systems, elite community, and hands-on approach deliver results that speak for themselves.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-2" className="bg-dark-card border border-primary/20 rounded-lg px-6">
              <AccordionTrigger className="text-white font-rajdhani text-lg uppercase tracking-wide">
                Can I switch between programs?
              </AccordionTrigger>
              <AccordionContent className="text-gray-300">
                Absolutely. We understand that your needs evolve as your business grows. You can upgrade or adjust your program at any time to match your current goals and requirements.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-3" className="bg-dark-card border border-primary/20 rounded-lg px-6">
              <AccordionTrigger className="text-white font-rajdhani text-lg uppercase tracking-wide">
                Is there a free trial available?
              </AccordionTrigger>
              <AccordionContent className="text-gray-300">
                Yes, we offer a 14-day free trial for new members to experience our platform and community. This gives you full access to see if we're the right fit for your goals.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-4" className="bg-dark-card border border-primary/20 rounded-lg px-6">
              <AccordionTrigger className="text-white font-rajdhani text-lg uppercase tracking-wide">
                What kind of results can I expect?
              </AccordionTrigger>
              <AccordionContent className="text-gray-300">
                Our members typically see significant improvements in revenue, operational efficiency, and leadership effectiveness within 90 days. However, results depend on your commitment to implementation.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-5" className="bg-dark-card border border-primary/20 rounded-lg px-6">
              <AccordionTrigger className="text-white font-rajdhani text-lg uppercase tracking-wide">
                Who is this program for?
              </AccordionTrigger>
              <AccordionContent className="text-gray-300">
                Our programs are designed for ambitious entrepreneurs, business owners, and executives who are already generating revenue and want to scale to the next level. We work with serious professionals who are committed to excellence.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
