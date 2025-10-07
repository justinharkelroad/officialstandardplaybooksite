import { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface JotFormModalProps {
  buttonText: string;
  buttonClassName?: string;
}

const JotFormModal = ({ buttonText, buttonClassName }: JotFormModalProps) => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (isOpen) {
      const script = document.createElement('script');
      script.src = 'https://cdn.jotfor.ms/s/umd/latest/for-form-embed-handler.js';
      script.async = true;
      document.body.appendChild(script);

      script.onload = () => {
        if (window.jotformEmbedHandler) {
          window.jotformEmbedHandler("iframe[id='JotFormIFrame-252793557059066']", "https://form.jotform.com/");
        }
      };

      return () => {
        if (document.body.contains(script)) {
          document.body.removeChild(script);
        }
      };
    }
  }, [isOpen]);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className={buttonClassName}>
          {buttonText}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl bg-dark-card border-primary/20 max-h-[90vh] overflow-y-auto">
        <iframe
          id="JotFormIFrame-252793557059066"
          title="Standard Call Scoring Sample"
          allowTransparency={true}
          allow="geolocation; microphone; camera; fullscreen; payment"
          src="https://form.jotform.com/252793557059066"
          style={{ minWidth: '100%', maxWidth: '100%', height: '539px', border: 'none' }}
          scrolling="no"
        />
      </DialogContent>
    </Dialog>
  );
};

declare global {
  interface Window {
    jotformEmbedHandler: (selector: string, baseUrl: string) => void;
  }
}

export default JotFormModal;
