import { HelpCircle } from 'lucide-react';

// Final Slide: Questions to Ponder
export const CTASlide = () => {
  const questions = [
    "Can I explain my sales process with clarity to my team members?",
    "Do my team members know what the requirements are on a daily basis inside of my agency?",
    "Have I been clear with my team on what happens if they do not deliver the requirements?",
    "Do I have all of this organized in a clear document that makes it easy to onboard new team members and scale?"
  ];

  return (
    <div className="w-full h-full flex flex-col items-center justify-center px-8">
      <div className="text-center animate-fade-in max-w-5xl">
        <div className="p-4 bg-primary/20 rounded-full w-fit mx-auto mb-8">
          <HelpCircle className="w-12 h-12 text-primary" />
        </div>
        <h2 className="font-oswald font-bold text-3xl md:text-4xl lg:text-5xl uppercase tracking-tight text-white mb-12">
          Questions For You To<br /><span className="text-primary">Ponder & Discuss</span>
        </h2>
        
        <div className="space-y-6 max-w-3xl mx-auto text-left">
          {questions.map((question, index) => (
            <div 
              key={index}
              className="flex items-start gap-4 bg-dark-card border border-primary/30 rounded-lg p-5 animate-fade-in"
              style={{ animationDelay: `${(index + 1) * 150}ms` }}
            >
              <span className="text-primary font-oswald font-bold text-2xl">{index + 1}.</span>
              <p className="text-gray-300 text-lg leading-relaxed">{question}</p>
            </div>
          ))}
        </div>
        
        <div className="mt-12 inline-block px-6 py-3 bg-primary/20 border border-primary/30 rounded-full">
          <span className="text-primary font-medium uppercase tracking-wider">The Standard Playbook</span>
        </div>
      </div>
    </div>
  );
};
