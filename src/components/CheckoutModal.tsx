import { useState } from 'react';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface CheckoutModalProps {
  buttonText: string;
  buttonClassName?: string;
}

const CheckoutModal = ({ buttonText, buttonClassName }: CheckoutModalProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className={buttonClassName}>
          {buttonText}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl bg-dark-card border-primary/20 max-h-[90vh] overflow-y-auto">
        <iframe
          src="https://createthestandard.com/producer-power-up-checkout-page"
          style={{ border: 'none', width: '100%', minHeight: '800px' }}
          allowFullScreen
          title="Producer Power-Up Checkout"
        />
      </DialogContent>
    </Dialog>
  );
};

export default CheckoutModal;
