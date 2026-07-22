import { ReactNode, useEffect, useMemo, useState } from 'react';
import { ChatBubble, isHtmlContent } from '@/app/components/flows/ChatBubble';
import { cn } from '@/lib/utils';

interface StreamingChatBubbleProps {
  text: string;
  variant: 'incoming' | 'outgoing';
  streaming?: boolean;
  className?: string;
  icon?: string;
  avatarUrl?: string | null;
  avatarFallback?: string;
  onContentChange?: () => void;
  onStreamingComplete?: () => void;
}

function renderInlineEmphasis(text: string): ReactNode[] {
  const nodes: ReactNode[] = [];
  const pattern = /(\*\*([^*]+)\*\*|_([^_]+)_)/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = pattern.exec(text)) !== null) {
    if (match.index > lastIndex) {
      nodes.push(text.slice(lastIndex, match.index));
    }

    const boldText = match[2];
    const italicText = match[3];

    if (boldText) {
      const isStressToken = /^[A-Z0-9\s]{2,}$/.test(boldText.trim());
      nodes.push(
        <strong
          key={`bold-${match.index}`}
          className={cn('font-semibold', isStressToken && 'uppercase')}
        >
          {boldText}
        </strong>,
      );
    } else if (italicText) {
      nodes.push(
        <em key={`italic-${match.index}`} className="italic">
          {italicText}
        </em>,
      );
    }

    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < text.length) {
    nodes.push(text.slice(lastIndex));
  }

  return nodes.length > 0 ? nodes : [text];
}

export function StreamingChatBubble({
  text,
  variant,
  streaming = false,
  className,
  icon,
  avatarUrl,
  avatarFallback,
  onContentChange,
  onStreamingComplete,
}: StreamingChatBubbleProps) {
  const [visibleCharacters, setVisibleCharacters] = useState(streaming ? 0 : text.length);

  useEffect(() => {
    if (!streaming) {
      setVisibleCharacters(text.length);
      return;
    }

    setVisibleCharacters(0);
    const intervalId = window.setInterval(() => {
      setVisibleCharacters((current) => {
        if (current >= text.length) {
          window.clearInterval(intervalId);
          return current;
        }
        return Math.min(text.length, current + 3);
      });
    }, 18);

    return () => window.clearInterval(intervalId);
  }, [streaming, text]);

  useEffect(() => {
    onContentChange?.();
  }, [onContentChange, visibleCharacters]);

  useEffect(() => {
    if (streaming && visibleCharacters >= text.length) {
      onStreamingComplete?.();
    }
  }, [onStreamingComplete, streaming, text.length, visibleCharacters]);

  const shouldRenderHtml = !streaming && isHtmlContent(text);
  const visibleText = shouldRenderHtml ? '' : text.slice(0, visibleCharacters);
  const content = useMemo(
    () => (shouldRenderHtml ? null : renderInlineEmphasis(visibleText)),
    [shouldRenderHtml, visibleText],
  );

  return (
    <ChatBubble
      variant={variant}
      icon={icon}
      avatarUrl={avatarUrl}
      avatarFallback={avatarFallback}
      className={className}
      html={shouldRenderHtml ? text : undefined}
    >
      {!shouldRenderHtml && content}
      {!shouldRenderHtml && streaming && visibleCharacters < text.length && (
        <span className="ml-0.5 inline-block h-4 w-1 animate-pulse rounded-full bg-current align-middle" />
      )}
    </ChatBubble>
  );
}
