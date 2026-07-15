import { ENDPOINTS } from '@/lib/api-config';
import { http } from '@/lib/http';
import type { MantraCount, MantraCountPage } from '@/types/mantra-count';

interface MantraCountJson {
  mantra_id?: string;
  mantra_title?: string;
  mala_image_url?: string | null;
  total_count?: number;
}

function parseMantraCount(raw: MantraCountJson): MantraCount {
  return {
    mantraId: raw.mantra_id ?? '',
    mantraTitle: raw.mantra_title ?? '',
    malaImageUrl: raw.mala_image_url ?? null,
    totalCount: raw.total_count ?? 0,
  };
}

export async function fetchMantraCounts(
  language: string,
  skip = 0,
  limit = 20,
): Promise<MantraCountPage> {
  const { data } = await http.get<{ counts?: MantraCountJson[] }>(
    ENDPOINTS.users.mantraCounts,
    { params: { language, skip, limit } },
  );
  const counts = (data.counts ?? []).map(parseMantraCount);
  return { counts };
}
