import { cn } from '@/lib/utils';
import { ReactNode } from 'react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { SanitizedRichText } from '@/app/components/flows/SanitizedRichText';

export { isHtmlContent } from '@/app/lib/savedRichText';

interface ChatBubbleProps {
  children: ReactNode;
  variant: 'incoming' | 'outgoing';
  className?: string;
  animate?: boolean;
  icon?: ReactNode;
  avatarUrl?: string | null;
  avatarFallback?: string;
  onClick?: () => void;
  /** When provided, renders sanitized HTML instead of children text. */
  html?: string;
  contentClassName?: string;
}

export function ChatBubble({
  children,
  variant,
  className,
  animate = false,
  icon,
  avatarUrl,
  avatarFallback,
  onClick,
  html,
  contentClassName,
}: ChatBubbleProps) {
  const isIncoming = variant === 'incoming';

  return (
    <div
      className={cn(
        'flex items-end gap-2 max-w-[85%]',
        isIncoming ? 'justify-start' : 'ml-auto justify-end',
        animate && 'animate-chat-message-in',
        onClick && 'cursor-pointer',
        className
      )}
      onClick={onClick}
    >
      {isIncoming && icon && (
        <span className="text-lg flex-shrink-0 mb-1">{icon}</span>
      )}
      <div
        className={cn(
          'px-4 py-3 text-base leading-relaxed',
          html ? '' : 'whitespace-pre-wrap',
          isIncoming
            ? 'bg-muted/50 text-foreground rounded-2xl rounded-tl-md'
            : 'bg-primary text-primary-foreground rounded-2xl rounded-tr-md',
          contentClassName
        )}
      >
        {html ? (
          <SanitizedRichText
            value={html}
            className={isIncoming
              ? 'prose-headings:text-inherit prose-p:text-inherit prose-li:text-inherit prose-strong:text-inherit'
              : 'text-inherit'}
          />
        ) : (
          children
        )}
      </div>
      {!isIncoming && (avatarUrl || avatarFallback) && (
        <Avatar className="h-8 w-8 flex-shrink-0 mb-1">
          {avatarUrl && <AvatarImage src={avatarUrl} alt="You" />}
          <AvatarFallback className="bg-primary/20 text-primary text-xs">
            {avatarFallback || '??'}
          </AvatarFallback>
        </Avatar>
      )}
    </div>
  );
}
