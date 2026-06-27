/** Ensure bead image URL is a loadable string (expo-image requires string uri). */
export function normalizeBeadImageUrl(url: unknown): string | null {
  if (typeof url !== 'string') return null;
  const trimmed = url.trim();
  if (!trimmed) return null;
  return trimmed;
}
