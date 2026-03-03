import {
  Dialog,
  DialogContent,
  DialogTitle,
} from '@/components/ui/dialog';
import BookingOnboardingForm from './BookingOnboardingForm';

interface StandardFitModalProps {
  defaultOpen?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

const StandardFitModal = ({ defaultOpen = false, open, onOpenChange }: StandardFitModalProps) => {
  const isControlled = open !== undefined;

  return (
    <Dialog
      open={isControlled ? open : defaultOpen}
      onOpenChange={isControlled ? onOpenChange : undefined}
    >
      <DialogContent className="sm:max-w-[500px] bg-[#0a1628] border-slate-700 max-h-[90vh] overflow-y-auto">
        <DialogTitle className="sr-only">Standard Fit Application</DialogTitle>
        <BookingOnboardingForm
          onComplete={() => onOpenChange?.(false)}
          source="standard-fit"
          onCompleteRedirectUrl="https://AGENCYCOACHING.as.me/standardfit"
        />
      </DialogContent>
    </Dialog>
  );
};

export default StandardFitModal;
