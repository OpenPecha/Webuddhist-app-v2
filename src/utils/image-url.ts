import type { ImageSizes } from '@/types/api';

export function imageUrl(
  image: ImageSizes | string | null | undefined,
  size: keyof ImageSizes = 'medium',
): string {
  if (!image) return '';
  if (typeof image === 'string') return image;
  return image[size] ?? image.medium ?? image.thumbnail ?? image.original ?? '';
}
