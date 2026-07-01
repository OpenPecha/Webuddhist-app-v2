import { ENDPOINTS } from '@/lib/api-config';
import { http } from '@/lib/http';
import type { ImageSizes } from '@/types/api';
import type { SeriesDayCompleted, SeriesDayCompletedPage } from '@/types/series-day-completed';
import { imageUrl } from '@/utils/image-url';

interface SeriesDayCompletedJson {
  series_id?: string;
  series_title?: string;
  image?: ImageSizes | string | null;
  image_url?: string | null;
  days_completed?: number;
}

function parseSeriesDayCompleted(raw: SeriesDayCompletedJson): SeriesDayCompleted {
  const fromImage = imageUrl(raw.image as ImageSizes | string | null);
  const legacy =
    typeof raw.image_url === 'string' && raw.image_url.startsWith('http')
      ? raw.image_url
      : null;

  return {
    seriesId: raw.series_id ?? '',
    seriesTitle: raw.series_title ?? '',
    imageUrl: fromImage || legacy,
    daysCompleted: raw.days_completed ?? 0,
  };
}

export async function fetchSeriesDayCompleted(
  language: string,
  skip = 0,
  limit = 20,
): Promise<SeriesDayCompletedPage> {
  const { data } = await http.get<{
    series?: SeriesDayCompletedJson[];
    total?: number;
  }>(ENDPOINTS.users.seriesDayCompleted, {
    params: { language, skip, limit },
  });

  const series = (data.series ?? []).map(parseSeriesDayCompleted);
  return {
    series,
    total: data.total ?? series.length,
  };
}
