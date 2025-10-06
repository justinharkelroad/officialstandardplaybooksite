import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

const CallScoringFAQ = () => {
  const faqs = [
    {
      question: "What is Standard Call Scoring and how does it work?",
      answer: "Standard Call Scoring is an AI-powered call evaluation system that analyzes your sales calls and provides instant, consistent feedback. Simply upload your call recordings, and our system evaluates them against your custom scoring criteria. You'll get detailed insights on what's working, what needs improvement, and specific coaching recommendations for each team member."
    },
    {
      question: "Can I cancel my subscription at any time?",
      answer: "Absolutely. There are no long-term contracts or cancellation fees. You can cancel your subscription at any time, and you'll retain access until the end of your current billing period. We're confident in the value we provide, so we don't believe in locking anyone into something that isn't working for them."
    },
    {
      question: "How long does it take to implement?",
      answer: "Most teams are up and running within 24-48 hours. We provide implementation support to help you set up your custom scoring criteria, train your team on the platform, and score your first calls. Our goal is to get you value immediately, not weeks from now."
    },
    {
      question: "Can I customize the scoring criteria?",
      answer: "Yes! This is one of our most important features. Every agency has a unique sales process, and your scoring criteria should reflect that. You can create unlimited custom templates for different call types (discovery, closing, follow-up, etc.) and modify them anytime as your process evolves."
    },
    {
      question: "Do you provide training and support?",
      answer: "Absolutely. Every plan includes implementation support and training. Professional and Enterprise plans include regular coaching calls with our team. We're not just handing you software – we're partnering with you to ensure your team gets maximum value from call scoring."
    },
    {
      question: "What types of calls can I score?",
      answer: "You can score any type of call – discovery calls, closing calls, objection handling, follow-ups, or any custom call type specific to your business. The system is flexible enough to handle any conversation type, and you can create unlimited scoring templates for different scenarios."
    },
    {
      question: "How many team members can I have?",
      answer: "It depends on your plan. Starter includes 1 team member, Professional includes up to 5, and Enterprise includes unlimited team members. If you need more than your plan allows, you can easily upgrade at any time."
    },
    {
      question: "Is there a limit on how many calls I can score?",
      answer: "Starter plans include up to 50 calls per month, Professional includes up to 200 calls per month, and Enterprise includes unlimited calls. If you consistently exceed your plan's limit, we'll reach out to discuss upgrading to a plan that better fits your volume."
    },
    {
      question: "What if I need help setting up my scoring criteria?",
      answer: "That's exactly what we're here for. All plans include implementation support, and we'll help you build your initial scoring criteria based on your sales process. Professional and Enterprise plans include ongoing optimization calls to refine your criteria as you learn what works best."
    }
  ];

  return (
    <section className="py-20 relative">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center mb-16">
          <h2 className="font-rajdhani font-bold text-4xl md:text-5xl uppercase tracking-wide text-white mb-8">
            Frequently Asked Questions
          </h2>
        </div>

        <div className="max-w-4xl mx-auto">
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem 
                key={index} 
                value={`item-${index}`}
                className="bg-dark-card border-primary/20 rounded-lg"
              >
                <AccordionTrigger className="px-6 py-4 text-white hover:text-primary">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-4 text-gray-300">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
};

export default CallScoringFAQ;
