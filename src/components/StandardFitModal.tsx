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
  source?: string;
}

const ACUITY_BASE_URL = 'https://AGENCYCOACHING.as.me/standardfit';

const StandardFitModal = ({
  defaultOpen = false,
  open,
  onOpenChange,
  source = 'standard-fit',
}: StandardFitModalProps) => {
  const isControlled = open !== undefined;
  const redirectUrl = `${ACUITY_BASE_URL}?utm_source=${encodeURIComponent(source)}`;

  return (
    <Dialog
      open={isControlled ? open : defaultOpen}
      onOpenChange={isControlled ? onOpenChange : undefined}
    >
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogTitle className="sr-only">Standard Fit Application</DialogTitle>
        <BookingOnboardingForm
          onComplete={() => onOpenChange?.(false)}
          source={source}
          onCompleteRedirectUrl={redirectUrl}
        />
      </DialogContent>
    </Dialog>
  );
};

export default StandardFitModal;
