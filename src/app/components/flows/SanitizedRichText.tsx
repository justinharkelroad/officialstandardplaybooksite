import { cn } from '@/lib/utils';
import { isHtmlContent, sanitizeSavedRichText } from '@/app/lib/savedRichText';

interface SanitizedRichTextProps {
  value: string;
  className?: string;
  plainTextClassName?: string;
}

export function SanitizedRichText({
  value,
  className,
  plainTextClassName,
}: SanitizedRichTextProps) {
  if (!isHtmlContent(value)) {
    return <div className={cn('whitespace-pre-wrap', plainTextClassName, className)}>{value}</div>;
  }

  return (
    <div
      className={cn(
        'max-w-none prose prose-sm dark:prose-invert',
        '[&_p]:my-1 [&_h2]:my-2 [&_h3]:my-2 [&_ul]:my-1 [&_ol]:my-1',
        '[&_ul]:list-disc [&_ol]:list-decimal [&_ul]:pl-5 [&_ol]:pl-5',
        '[&_h2]:text-lg [&_h2]:font-semibold [&_h3]:text-base [&_h3]:font-semibold',
        '[&_a]:underline [&_blockquote]:border-l-2 [&_blockquote]:pl-3 [&_blockquote]:italic',
        className,
      )}
      dangerouslySetInnerHTML={{ __html: sanitizeSavedRichText(value) }}
    />
  );
}
