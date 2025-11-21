import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

interface PartnershipSoldOutModalProps {
  trigger: React.ReactNode;
}

const PartnershipSoldOutModal = ({ trigger }: PartnershipSoldOutModalProps) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        {trigger}
      </DialogTrigger>
      <DialogContent className="max-w-md bg-background border-primary/20">
        <div className="text-center space-y-6 py-4">
          <h2 className="text-2xl font-bold text-foreground">
            Partnership Sold Out
          </h2>
          <p className="text-muted-foreground">
            The Partnership program is currently sold out. For future availability and other opportunities, please contact us.
          </p>
          <Button asChild className="w-full">
            <Link to="/contact">
              Contact Us
            </Link>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PartnershipSoldOutModal;
