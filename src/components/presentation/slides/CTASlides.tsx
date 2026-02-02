import { QRCodeSVG } from 'qrcode.react';
import { Shield, ExternalLink } from 'lucide-react';

// Slide 29: The Guarantee
export const GuaranteeSlide = () => (
  <div className="w-full h-full flex flex-col items-center justify-center px-8">
    <div className="text-center animate-fade-in max-w-5xl">
      <div className="p-4 bg-primary/20 rounded-full w-fit mx-auto mb-8">
        <Shield className="w-12 h-12 text-primary" />
      </div>
      <h2 className="font-oswald font-bold text-4xl md:text-5xl uppercase tracking-tight text-white mb-8">
        The Guarantee
      </h2>
      <div className="bg-dark-card border border-primary/30 rounded-lg p-8 md:p-12 max-w-3xl mx-auto">
        <p className="text-xl md:text-2xl text-gray-300 leading-relaxed">
          "If you don't have a <span className="text-primary font-semibold">clear path</span> to more efficient, profitable operations after our work together...
        </p>
        <p className="text-xl md:text-2xl text-primary font-semibold mt-6">
          I'll work for free until you do."
        </p>
      </div>
    </div>
  </div>
);

// Slide 30: CTA Slide
export const CTASlide = () => {
  const bookingUrl = "https://api.leadconnectorhq.com/widget/booking/kNoEGfGlVlBEn3Fvtqrz";

  return (
    <div className="w-full h-full flex flex-col items-center justify-center px-8">
      <div className="text-center animate-fade-in">
        <h2 className="font-oswald font-bold text-4xl md:text-5xl lg:text-6xl uppercase tracking-tight text-white mb-4">
          Ready To <span className="text-primary">Capture</span><br />Every Dollar?
        </h2>
        <p className="text-xl text-gray-400 mb-12">Book your strategy call today</p>
        
        <div className="bg-white p-6 rounded-2xl inline-block mb-8 animate-fade-in" style={{ animationDelay: '200ms' }}>
          <QRCodeSVG 
            value={bookingUrl}
            size={240}
            level="H"
            includeMargin={false}
            bgColor="#ffffff"
            fgColor="#0B0B0C"
          />
        </div>
        
        <p className="text-gray-400 text-lg mb-4">Scan the QR code or visit:</p>
        <a 
          href={bookingUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-primary hover:text-primary/80 transition-colors text-lg font-medium"
        >
          thestandardplaybook.com/book
          <ExternalLink className="w-5 h-5" />
        </a>
        
        <div className="mt-12 inline-block px-6 py-3 bg-primary/20 border border-primary/30 rounded-full">
          <span className="text-primary font-medium uppercase tracking-wider">The Standard Playbook</span>
        </div>
      </div>
    </div>
  );
};
