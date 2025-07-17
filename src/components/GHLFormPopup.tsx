import React, { useEffect } from 'react';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface GHLFormPopupProps {
  buttonText: string;
  buttonClassName?: string;
}

const GHLFormPopup: React.FC<GHLFormPopupProps> = ({ buttonText, buttonClassName }) => {
  useEffect(() => {
    // Load the GHL form script
    const script = document.createElement('script');
    script.src = 'https://link.msgsndr.com/js/form_embed.js';
    script.async = true;
    document.body.appendChild(script);

    return () => {
      // Cleanup script when component unmounts
      const existingScript = document.querySelector('script[src="https://link.msgsndr.com/js/form_embed.js"]');
      if (existingScript) {
        document.body.removeChild(existingScript);
      }
    };
  }, []);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className={buttonClassName || "bg-primary text-primary-foreground hover:bg-primary/90 px-8 py-4 text-lg font-bold"}>
          {buttonText}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl w-full max-h-[90vh] overflow-hidden p-0 bg-black border-gray-800">
        <div className="w-full h-[700px]">
          <iframe
            src="https://api.leadconnectorhq.com/widget/form/BO7x3XIfcMhtVBymoEeI"
            style={{
              display: 'block',
              width: '100%',
              height: '100%',
              border: 'none',
              borderRadius: '4px'
            }}
            id="popup-BO7x3XIfcMhtVBymoEeI" 
            data-layout="{'id':'POPUP'}"
            data-trigger-type="alwaysShow"
            data-trigger-value=""
            data-activation-type="alwaysActivated"
            data-activation-value=""
            data-deactivation-type="neverDeactivate"
            data-deactivation-value=""
            data-form-name="LEAD CAPTURE FORM"
            data-height="661"
            data-layout-iframe-id="popup-BO7x3XIfcMhtVBymoEeI"
            data-form-id="BO7x3XIfcMhtVBymoEeI"
            title="LEAD CAPTURE FORM"
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default GHLFormPopup;