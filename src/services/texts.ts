import { ENDPOINTS } from '@/lib/api-config';
import { http } from '@/lib/http';
import type { TextDetail } from '@/types/texts';

export async function fetchTextDetail(textId: string): Promise<TextDetail> {
  const { data } = await http.get<TextDetail>(ENDPOINTS.texts.detail(textId));
  return data;
}
