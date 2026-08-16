import DOMPurify from 'dompurify';

const EDITOR_HTML_PATTERN = /^<(p|h[1-6]|ul|ol|li|div|blockquote|br|hr)([\s>])/i;

export function isHtmlContent(text: string): boolean {
  return EDITOR_HTML_PATTERN.test(text.trim());
}

export function sanitizeSavedRichText(html: string): string {
  return DOMPurify.sanitize(html, {
    USE_PROFILES: { html: true },
    ADD_ATTR: ['style', 'data-color'],
  });
}
