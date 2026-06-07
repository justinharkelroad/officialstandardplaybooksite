import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import BookingOnboardingForm from './BookingOnboardingForm';

interface StandardFitModalProps {
  defaultOpen?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  source?: string;
  /** Acuity scheduler to send the applicant to after onboarding.
   *  Defaults to the shared standardfit link; pass a different one for
   *  program-specific booking flows (e.g. the /standard90 page). */
  bookingBaseUrl?: string;
}

const ACUITY_BASE_URL = 'https://AGENCYCOACHING.as.me/standardfit';

const StandardFitModal = ({
  defaultOpen = false,
  open,
  onOpenChange,
  source = 'standard-fit',
  bookingBaseUrl = ACUITY_BASE_URL,
}: StandardFitModalProps) => {
  const isControlled = open !== undefined;
  const redirectUrl = `${bookingBaseUrl}?utm_source=${encodeURIComponent(source)}`;

  return (
    <Dialog
      open={isControlled ? open : defaultOpen}
      onOpenChange={isControlled ? onOpenChange : undefined}
    >
      <DialogContent
        className="sm:max-w-[520px] max-h-[92vh] overflow-y-auto p-0"
        style={{
          background: '#F4F2EE',
          color: '#0A0A0B',
          borderRadius: 0,
          border: '1.5px solid #0A0A0B',
          boxShadow: '0 30px 80px -10px rgba(0,0,0,0.5)',
          fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Helvetica Neue", Arial, sans-serif',
          gap: 0,
        }}
      >
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
