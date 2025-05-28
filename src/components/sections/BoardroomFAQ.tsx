
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

const BoardroomFAQ = () => {
  return (
    <section className="py-20 relative">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="font-rajdhani font-bold text-4xl md:text-5xl uppercase tracking-wide text-white mb-6">
            Boardroom FAQ
          </h2>
        </div>

        <div className="max-w-4xl mx-auto">
          <Accordion type="single" collapsible className="space-y-4">
            <AccordionItem value="item-1" className="bg-dark-card border border-primary/20 rounded-lg px-6">
              <AccordionTrigger className="text-white font-rajdhani text-lg uppercase tracking-wide">
                What type of agency owners are in The Boardroom?
              </AccordionTrigger>
              <AccordionContent className="text-gray-300">
                Our agency owners have one single thing in common: To expand their lives through the process of "Having It All". Any and all are fully accepted with open arms.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-2" className="bg-dark-card border border-primary/20 rounded-lg px-6">
              <AccordionTrigger className="text-white font-rajdhani text-lg uppercase tracking-wide">
                How often are the group coaching calls?
              </AccordionTrigger>
              <AccordionContent className="text-gray-300">
                We host monthly coaching calls on the second Tuesday of every month from 3pm-5pm EST. Each call is 2 hours and strategically planned out to allow breakout sessions and authentic conversations to happen. Every Boardroom call is recorded and posted inside of the Armory on the app.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-3" className="bg-dark-card border border-primary/20 rounded-lg px-6">
              <AccordionTrigger className="text-white font-rajdhani text-lg uppercase tracking-wide">
                Can I get individual attention in a group setting?
              </AccordionTrigger>
              <AccordionContent className="text-gray-300">
                Absolutely. Our hot seat format ensures every member gets individual coaching time during group calls. You can also request specific topics and get personalized feedback from both coaches and fellow members.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-4" className="bg-dark-card border border-primary/20 rounded-lg px-6">
              <AccordionTrigger className="text-white font-rajdhani text-lg uppercase tracking-wide">
                What if I want more intensive coaching?
              </AccordionTrigger>
              <AccordionContent className="text-gray-300">
                Boardroom members get priority access to upgrade to The Directive or Partnership programs, which include individual coaching and more intensive support. We can discuss upgrade options at any time.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </div>
    </section>
  );
};

export default BoardroomFAQ;
