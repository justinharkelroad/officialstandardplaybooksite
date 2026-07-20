import { useState } from 'react';
import { Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { FlowShareModal } from '@/app/components/flows/FlowShareModal';
import { FlowAnalysis, FlowQuestion, FlowSession, FlowTemplate } from '@/app/types/flows';

interface FlowShareButtonProps {
  sessionId: string;
  session: FlowSession;
  template: FlowTemplate;
  questions: FlowQuestion[];
  analysis: FlowAnalysis | null;
  userName?: string;
  variant?: 'default' | 'outline' | 'secondary' | 'ghost';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  className?: string;
  label?: string;
}

export function FlowShareButton({
  sessionId,
  session,
  template,
  questions,
  analysis,
  userName,
  variant = 'outline',
  size = 'default',
  className,
  label = 'Share PDF link',
}: FlowShareButtonProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button
        type="button"
        variant={variant}
        size={size}
        className={className}
        onClick={() => setOpen(true)}
      >
        <Share2 className="mr-2 h-4 w-4" strokeWidth={1.5} />
        {label}
      </Button>
      <FlowShareModal
        open={open}
        onOpenChange={setOpen}
        sessionId={sessionId}
        session={session}
        template={template}
        questions={questions}
        analysis={analysis}
        userName={userName}
      />
    </>
  );
}
