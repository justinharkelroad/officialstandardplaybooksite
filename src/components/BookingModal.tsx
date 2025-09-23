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
        console.log('Received postMessage:', event.origin, event.data);
        
        // Check for various Acuity completion events
        if (event.origin === 'https://app.acuityscheduling.com') {
          const isBookingComplete = 
            event.data === 'acuity-appointment-booked' ||
            event.data?.type === 'acuity-appointment-booked' ||
            event.data === 'acuity.appointment.scheduled' ||
            event.data?.type === 'acuity.appointment.scheduled' ||
            (typeof event.data === 'string' && event.data.includes('booked')) ||
            (typeof event.data === 'string' && event.data.includes('scheduled'));
            
          if (isBookingComplete) {
            console.log('Booking completed, redirecting...');
            setIsOpen(false);
            setTimeout(() => {
              window.location.href = '/thank-you';
            }, 100);
          }
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
          <iframe 
            src="https://app.acuityscheduling.com/schedule.php?owner=27963178&appointmentType=73884639" 
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