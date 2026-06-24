import type { FeaturedSeriesLayout } from '@/types/featured-series';
import type { Series } from '@/types/series';

/** Random hero pick — mirrors Flutter featuredSeriesFutureProvider. */
export function buildFeaturedSeriesLayout(seriesList: Series[]): FeaturedSeriesLayout | null {
  if (seriesList.length === 0) return null;

  const featuredIndex = Math.floor(Math.random() * seriesList.length);
  const featured = seriesList[featuredIndex];
  const others = seriesList.filter((_, i) => i !== featuredIndex);

  return { featured, others };
}
