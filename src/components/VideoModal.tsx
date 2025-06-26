
import { useState } from 'react';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface VideoModalProps {
  trigger?: React.ReactNode;
  videoId?: string;
  title?: string;
  isOpen?: boolean;
  onClose?: () => void;
}

const VideoModal = ({ trigger, videoId = "gy-8UNhToW8", title = "Demo Video", isOpen, onClose }: VideoModalProps) => {
  const [internalIsOpen, setInternalIsOpen] = useState(false);
  
  // Use external state if provided, otherwise use internal state
  const modalIsOpen = isOpen !== undefined ? isOpen : internalIsOpen;
  const handleOpenChange = (open: boolean) => {
    if (onClose && !open) {
      onClose();
    } else if (isOpen === undefined) {
      setInternalIsOpen(open);
    }
  };

  // If used with external state management (isOpen/onClose), don't render trigger
  if (isOpen !== undefined && onClose) {
    return (
      <Dialog open={modalIsOpen} onOpenChange={handleOpenChange}>
        <DialogContent className="max-w-4xl bg-dark-card border-primary/20">
          <div className="relative aspect-video">
            <iframe
              src={`https://www.youtube.com/embed/${videoId}?autoplay=1&mute=0`}
              title={title}
              className="w-full h-full rounded-lg"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  // Original trigger-based approach
  return (
    <Dialog open={modalIsOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        {trigger}
      </DialogTrigger>
      <DialogContent className="max-w-4xl bg-dark-card border-primary/20">
        <div className="relative aspect-video">
          <iframe
            src={`https://www.youtube.com/embed/${videoId}?autoplay=1&mute=0`}
            title={title}
            className="w-full h-full rounded-lg"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default VideoModal;
