
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

const BoardroomFAQ = () => {
  return (
    <section className="py-20 relative">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="font-rajdhani font-bold text-4xl md:text-5xl uppercase tracking-wide text-white mb-6">
            The Questions That Reveal Everything
          </h2>
        </div>

        <div className="max-w-4xl mx-auto">
          <Accordion type="single" collapsible className="space-y-4">
            <AccordionItem value="item-1" className="bg-dark-card border border-primary/20 rounded-lg px-6">
              <AccordionTrigger className="text-white font-rajdhani text-lg uppercase tracking-wide">
                "Is this right for someone at my level?"
              </AccordionTrigger>
              <AccordionContent className="text-gray-300">
                If you're asking, you already know. The question is: How much longer will you let "your level" be your ceiling?
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-2" className="bg-dark-card border border-primary/20 rounded-lg px-6">
              <AccordionTrigger className="text-white font-rajdhani text-lg uppercase tracking-wide">
                "What if I'm not ready?"
              </AccordionTrigger>
              <AccordionContent className="text-gray-300">
                Nobody's ready for chemotherapy either. But cancer doesn't care about your timeline.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-3" className="bg-dark-card border border-primary/20 rounded-lg px-6">
              <AccordionTrigger className="text-white font-rajdhani text-lg uppercase tracking-wide">
                "How fast will I see results?"
              </AccordionTrigger>
              <AccordionContent className="text-gray-300">
                Wrong question. Ask instead: "How much has playing small already cost me?"
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-4" className="bg-dark-card border border-primary/20 rounded-lg px-6">
              <AccordionTrigger className="text-white font-rajdhani text-lg uppercase tracking-wide">
                "What if I join and realize I'm the smallest one there?"
              </AccordionTrigger>
              <AccordionContent className="text-gray-300">
                Then you're finally in a room that can change your life. Being the smartest person in the room is expensive. Being the dumbest? That's profitable.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </div>
    </section>
  );
};

export default BoardroomFAQ;
