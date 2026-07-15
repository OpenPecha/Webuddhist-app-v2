/** Soft-break sentinel emitted by the API (Flutter kSegmentSoftBreak). */
export const SEGMENT_SOFT_BREAK = '\u2937'; // ⤵

/** Convert the soft-break sentinel to <br> for HTML rendering (Flutter normalizeSegmentHtml). */
export function normalizeSegmentHtml(raw?: string | null): string {
  return (raw ?? '').split(SEGMENT_SOFT_BREAK).join('<br>');
}

/** Decode the common HTML entities that appear in segment content. */
export function decodeHtmlEntities(text: string): string {
  return text
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/&apos;/gi, "'")
    .replace(/&#(\d+);/g, (_, code: string) => String.fromCodePoint(Number(code)))
    .replace(/&#x([0-9a-f]+);/gi, (_, code: string) => String.fromCodePoint(parseInt(code, 16)));
}

/**
 * Strip HTML to plain text for segment copy (Flutter segement_action_bar parity).
 * Footnotes (sup.footnote-marker + i.footnote) are removed; ordinary text is kept.
 */
export function segmentPlainText(html: string): string {
  let cleaned = normalizeSegmentHtml(html);
  // Drop footnote markers and footnote bodies entirely (marker numbers + note text).
  cleaned = cleaned.replace(/<sup\b[^>]*>[\s\S]*?<\/sup>/gi, '');
  cleaned = cleaned.replace(/<i\b[^>]*class=["'][^"']*footnote[^"']*["'][^>]*>[\s\S]*?<\/i>/gi, '');
  // Convert line breaks and block boundaries to newlines.
  cleaned = cleaned.replace(/<br\s*\/?>/gi, '\n');
  cleaned = cleaned.replace(/<\/p>/gi, '\n');
  // Strip remaining tags, decode entities, normalize whitespace.
  cleaned = cleaned.replace(/<[^>]+>/g, '');
  cleaned = decodeHtmlEntities(cleaned);
  return cleaned.replace(/\n{3,}/g, '\n\n').trim();
}
