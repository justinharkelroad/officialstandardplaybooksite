import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogTrigger, DialogTitle, DialogDescription } from '@/components/ui/dialog';

interface BookingModalProps {
  trigger: React.ReactNode;
}

const BookingModal = ({ trigger }: BookingModalProps) => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Load Acuity script when modal opens
    if (isOpen) {
      const script = document.createElement('script');
      script.src = 'https://embed.acuityscheduling.com/js/embed.js';
      script.type = 'text/javascript';
      script.async = true;
      document.body.appendChild(script);

      // Listen for booking completion - only respond when this modal is open
      const handleMessage = (event: MessageEvent) => {
        try {
          // Only process messages when this specific modal instance is open
          if (!isOpen) return;

          console.log('BookingModal postMessage:', event.origin, event.data);
          
          const origin = event.origin || '';
          const isAcuityOrigin =
            typeof origin === 'string' &&
            (origin.includes('acuityscheduling.com') || origin.includes('as.me'));

          const data: any = event.data;
          
          // Ultra-specific: Only respond to our exact custom snippet message
          const isOurCustomSnippet =
            typeof data === 'object' && 
            data !== null && 
            data?.type === 'acuity-appointment-booked';

          // Security: Only accept from Acuity origins and our specific message
          if (isAcuityOrigin && isOurCustomSnippet) {
            console.log('Booking completed via custom snippet, redirecting...');
            setIsOpen(false);
            setTimeout(() => {
              window.location.href = '/thank-you';
            }, 50);
          }
        } catch (e) {
          console.warn('Error handling BookingModal postMessage', e);
        }
      };

      window.addEventListener('message', handleMessage);

      return () => {
        document.body.removeChild(script);
        window.removeEventListener('message', handleMessage);
      };
    }
  }, [isOpen]);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {trigger}
      </DialogTrigger>
      <DialogContent className="max-w-4xl w-full bg-dark-card border-primary/20 max-h-[90vh] overflow-y-auto p-0">
        <DialogTitle className="sr-only">Book Your Consultation</DialogTitle>
        <DialogDescription className="sr-only">Schedule your consultation appointment</DialogDescription>
        <div className="w-full h-[80vh]">
          <iframe title="Schedule your consultation" 
            src="https://app.acuityscheduling.com/schedule.php?owner=27963178&appointmentType=73884639&embed=1" 
            width="100%" 
            height="100%" 
            frameBorder="0" 
            allow="payment"
            className="rounded-lg"
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BookingModal;