import { ENDPOINTS } from '@/lib/api-config';
import { http } from '@/lib/http';
import type { RecitationsListResponse } from '@/types/recitations';

export async function fetchRecitations(language = 'en'): Promise<RecitationsListResponse> {
  const { data } = await http.get<RecitationsListResponse>(ENDPOINTS.recitations.list, {
    params: { language },
  });
  return data;
}
