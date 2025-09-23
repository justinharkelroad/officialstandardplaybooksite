import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';

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

      // Listen for booking completion (this is a common pattern for Acuity)
      const handleMessage = (event: MessageEvent) => {
        if (event.origin === 'https://app.acuityscheduling.com' && 
            (event.data === 'acuity-appointment-booked' || 
             event.data.type === 'acuity-appointment-booked')) {
          // Close modal and redirect to thank you page
          setIsOpen(false);
          window.location.href = '/thank-you';
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
      <DialogContent className="max-w-4xl w-full bg-dark-card border-primary/20 max-h-[90vh] overflow-hidden">
        <div className="w-full h-[800px]">
          <iframe 
            src="https://app.acuityscheduling.com/schedule.php?owner=27963178&appointmentType=77447936" 
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