import { useEffect, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/app/components/ui/dialog';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Check, Copy, Loader2, Share2 } from 'lucide-react';
import { useFlowShare } from '@/app/hooks/useFlowShare';
import { spScopeClass } from '@/app/lib/theme';
import { FlowAnalysis, FlowQuestion, FlowSession, FlowTemplate } from '@/app/types/flows';
import { cn } from '@/lib/utils';

export interface FlowShareModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  sessionId: string;
  session: FlowSession;
  template: FlowTemplate;
  questions: FlowQuestion[];
  analysis: FlowAnalysis | null;
  userName?: string;
}

export function FlowShareModal({
  open,
  onOpenChange,
  sessionId,
  session,
  template,
  questions,
  analysis,
  userName,
}: FlowShareModalProps) {
  const {
    creating,
    revoking,
    shareUrl,
    token,
    error,
    createShare,
    revokeShare,
  } = useFlowShare();
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setCopied(false);
  }, [shareUrl]);

  const isShared = Boolean(shareUrl);
  const busy = creating || revoking;

  const handleToggle = async (next: boolean) => {
    try {
      if (next) {
        await createShare({
          sessionId,
          session,
          template,
          questions,
          analysis,
          userName,
        });
      } else if (token) {
        await revokeShare(token);
      }
    } catch {
      // The hook exposes the actionable Edge-function error below.
    }
  };

  const handleCopy = async () => {
    if (!shareUrl) return;

    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      // The read-only field remains selectable when clipboard access is unavailable.
    }
  };

  const canNativeShare = typeof navigator !== 'undefined' && typeof navigator.share === 'function';

  const handleNativeShare = async () => {
    if (!shareUrl) return;

    try {
      await navigator.share({ title: `${template.name} Flow PDF`, url: shareUrl });
    } catch {
      // Native share cancellation is not an error state.
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className={cn(
          spScopeClass(),
          'w-[calc(100vw-2rem)] border-[1.5px] border-foreground/30 bg-background text-foreground sm:max-w-md',
        )}
      >
        <DialogHeader>
          <DialogTitle className="pr-12 text-2xl text-foreground">Share this Flow PDF</DialogTitle>
          <DialogDescription className="max-w-[42rem] pr-8 leading-6 text-muted-foreground">
            Create a public PDF link that works without a Standard Playbook login. Turn sharing off to
            revoke the link.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div className="flex items-center justify-between gap-4 border border-foreground/25 bg-card/40 p-4">
            <div className="min-w-0 space-y-1">
              <Label htmlFor="flow-share-enabled" className="text-sm font-medium">
                Public PDF link
              </Label>
              <p className="text-sm leading-5 text-muted-foreground">
                {isShared ? 'Anyone with this link can download the PDF.' : 'Off — no public link exists.'}
              </p>
            </div>
            <div className="flex shrink-0 items-center gap-2">
              {busy && <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />}
              <Switch
                id="flow-share-enabled"
                checked={isShared}
                disabled={busy}
                onCheckedChange={handleToggle}
                className="data-[state=checked]:bg-[#2997FF] data-[state=unchecked]:bg-foreground/25 [&>span]:bg-white [&>span]:shadow-sm"
              />
            </div>
          </div>

          {isShared && shareUrl && (
            <div className="space-y-2">
              <Label htmlFor="flow-share-link" className="text-xs text-muted-foreground">
                PDF download link
              </Label>
              <div className="flex items-center gap-2">
                <Input
                  id="flow-share-link"
                  readOnly
                  value={shareUrl}
                  onFocus={(event) => event.currentTarget.select()}
                  className="border-foreground/30 bg-background text-xs text-foreground selection:bg-[#2997FF] selection:text-white"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={handleCopy}
                  aria-label="Copy PDF link"
                  className="shrink-0 border-foreground/30 bg-background text-foreground hover:bg-foreground hover:text-background"
                >
                  {copied ? <Check className="h-4 w-4 text-[#2997FF]" /> : <Copy className="h-4 w-4" />}
                </Button>
              </div>
              <div className="flex items-center gap-2 pt-1">
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  onClick={handleCopy}
                  className="flex-1 border border-foreground/25 bg-secondary text-secondary-foreground hover:bg-foreground hover:text-background"
                >
                  {copied ? 'Copied!' : 'Copy Link'}
                </Button>
                {canNativeShare && (
                  <Button
                    type="button"
                    size="sm"
                    onClick={handleNativeShare}
                    className="flex-1 bg-[#2997FF] text-white hover:bg-[#1687ed]"
                  >
                    <Share2 className="mr-2 h-4 w-4" />
                    Share
                  </Button>
                )}
              </div>
            </div>
          )}

          {error && <p className="text-sm text-destructive">{error}</p>}
        </div>
      </DialogContent>
    </Dialog>
  );
}
