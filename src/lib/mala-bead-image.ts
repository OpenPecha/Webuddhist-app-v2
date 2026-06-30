/**
 * Normalize a bead image URL for expo-image / useImage.
 *
 * Accepts `unknown` because accumulator and API DTO fields may arrive as
 * `null`, `undefined`, empty strings, or non-string values before normalization.
 *
 * @returns Trimmed URI string when loadable, otherwise `null`.
 */
export function normalizeBeadImageUrl(url: unknown): string | null {
  if (typeof url !== 'string') return null;
  const trimmed = url.trim();
  if (!trimmed) return null;
  return trimmed;
}
