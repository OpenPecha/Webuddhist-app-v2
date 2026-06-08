export interface ImageSizes {
  thumbnail: string;
  medium: string;
  original: string;
}

export function imageUrl(
  image: ImageSizes | string | null | undefined,
  size: keyof ImageSizes = 'medium',
): string {
  if (!image) return '';
  if (typeof image === 'string') return image;
  return image[size] ?? image.medium ?? image.thumbnail ?? image.original ?? '';
}
