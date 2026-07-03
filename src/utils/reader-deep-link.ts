export function buildReaderSegmentShareUrl(
  textId: string,
  segmentId: string,
  language?: string,
): string {
  const params = new URLSearchParams({ segment: segmentId });
  if (language?.trim()) params.set('lang', language.trim());
  return `https://webuddhist.com/open/reader/${textId}?${params.toString()}`;
}
