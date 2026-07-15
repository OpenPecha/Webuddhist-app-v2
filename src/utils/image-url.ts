import type { ImageSizes } from '@/types/api';

export function imageUrl(
  image: ImageSizes | string | null | undefined,
  size: keyof ImageSizes = 'medium',
): string {
  if (!image) return '';
  if (typeof image === 'string') return image;
  return image[size] ?? image.medium ?? image.thumbnail ?? image.original ?? '';
}

/** Mirrors Flutter ImageModel.fromFields — object, string, or legacy image_url fallback. */
export function resolveCoverImage(
  image: ImageSizes | string | null | undefined,
  imageUrlLegacy?: string | null,
  size: keyof ImageSizes = 'medium',
): string {
  const fromImage = imageUrl(image, size);
  if (fromImage) return fromImage;
  if (imageUrlLegacy?.startsWith('http')) return imageUrlLegacy;
  return '';
}
