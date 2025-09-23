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

      // Listen for booking completion
      const handleMessage = (event: MessageEvent) => {
        try {
          console.log('Acuity postMessage:', event.origin, event.data);
          const origin = event.origin || '';
          const isAcuityOrigin =
            typeof origin === 'string' &&
            (origin.includes('acuityscheduling.com') || origin.includes('as.me'));

          const data: any = event.data;
          const type =
            (typeof data === 'string' ? data : data?.type || data?.event || data?.name || '').toString().toLowerCase();

          const isBookingComplete =
            type.includes('acuity-appointment-booked') ||
            type.includes('acuity.appointment.scheduled') ||
            type.includes('appointment-booked') ||
            type.includes('appointment.scheduled') ||
            type.includes('booked') ||
            type.includes('scheduled');

          // If user added the custom snippet, accept it regardless of origin
          const explicitSnippet =
            typeof data === 'object' && data?.type === 'acuity-appointment-booked';

          if ((isAcuityOrigin && isBookingComplete) || explicitSnippet) {
            console.log('Booking completed, redirecting...');
            setIsOpen(false);
            setTimeout(() => {
              window.location.href = '/thank-you';
            }, 50);
          }
        } catch (e) {
          console.warn('Error handling Acuity postMessage', e);
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