import { useQuery } from '@tanstack/react-query';

interface SeriesMetadata {
  id: string;
  title: string;
  description: string;
  language: string;
}

export interface Series {
  id: string;
  metadata: SeriesMetadata[];
  image: string;
  image_key: string;
  author_id: string;
  featured: boolean;
  status: string;
  plan_count: number;
  total_days: number;
}

interface SeriesResponse {
  series: Series[];
  skip: number;
  limit: number;
  total: number;
}

async function fetchSeries(language = 'en', skip = 0, limit = 10): Promise<SeriesResponse> {
  const response = await fetch(
    `https://api.webuddhist.com/api/v1/series?language=${language}&skip=${skip}&limit=${limit}`
  );
  
  if (!response.ok) {
    throw new Error('Failed to fetch series');
  }
  
  return response.json();
}

export function useSeries(language = 'en', skip = 0, limit = 10) {
  return useQuery({
    queryKey: ['series', language, skip, limit],
    queryFn: () => fetchSeries(language, skip, limit),
  });
}
