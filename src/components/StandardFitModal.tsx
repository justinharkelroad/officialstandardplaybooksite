import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from '@/components/ui/dialog';
import BookingOnboardingForm from './BookingOnboardingForm';

interface StandardFitModalProps {
  defaultOpen?: boolean;
}

const StandardFitModal = ({ defaultOpen = true }: StandardFitModalProps) => {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[500px] bg-[#0a1628] border-slate-700 max-h-[90vh] overflow-y-auto">
        <DialogTitle className="sr-only">Standard Fit Application</DialogTitle>
        <BookingOnboardingForm
          onComplete={() => setOpen(false)}
          source="standard-fit"
          onCompleteRedirectUrl="https://AGENCYCOACHING.as.me/standardfit"
        />
      </DialogContent>
    </Dialog>
  );
};

export default StandardFitModal;
