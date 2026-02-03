import { HelpCircle } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';

// Final Slide: Questions to Ponder
export const CTASlide = () => {
  const bookingUrl = "https://AGENCYCOACHING.as.me/standardfit";
  
  const questions = [
    "Can I explain my sales process with clarity to my team members?",
    "Do my team members know what the requirements are on a daily basis inside of my agency?",
    "Have I been clear with my team on what happens if they do not deliver the requirements?",
    "Do I have all of this organized in a clear document that makes it easy to onboard new team members and scale?"
  ];

  return (
    <div className="w-full h-full flex flex-col items-center justify-center px-6 py-4">
      <div className="text-center animate-fade-in max-w-5xl w-full">
        <div className="p-3 bg-primary/20 rounded-full w-fit mx-auto mb-4">
          <HelpCircle className="w-8 h-8 text-primary" />
        </div>
        <h2 className="font-oswald font-bold text-2xl md:text-3xl lg:text-4xl uppercase tracking-tight text-white mb-6">
          Questions For You To <span className="text-primary">Ponder & Discuss</span>
        </h2>
        
        <div className="space-y-3 max-w-3xl mx-auto text-left mb-6">
          {questions.map((question, index) => (
            <div 
              key={index}
              className="flex items-start gap-3 bg-dark-card border border-primary/30 rounded-lg p-3 animate-fade-in"
              style={{ animationDelay: `${(index + 1) * 100}ms` }}
            >
              <span className="text-primary font-oswald font-bold text-xl">{index + 1}.</span>
              <p className="text-gray-300 text-base leading-relaxed">{question}</p>
            </div>
          ))}
        </div>
        
        <div className="flex items-center justify-center gap-6">
          <div className="flex flex-col items-center">
            <div className="bg-white p-2 rounded-lg mb-1">
              <QRCodeSVG 
                value={bookingUrl}
                size={80}
                level="H"
                includeMargin={false}
                bgColor="#ffffff"
                fgColor="#0B0B0C"
              />
            </div>
            <span className="text-gray-400 text-xs">Book a Call</span>
          </div>
          <a 
            href="https://standardplaybook.com" 
            target="_blank" 
            rel="noopener noreferrer"
            className="px-6 py-3 bg-primary/20 border border-primary/30 rounded-full hover:bg-primary/30 transition-colors"
          >
            <span className="text-primary font-medium uppercase tracking-wider">standardplaybook.com</span>
          </a>
        </div>
      </div>
    </div>
  );
};
