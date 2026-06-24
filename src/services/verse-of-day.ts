import { ENDPOINTS } from '@/lib/api-config';
import { http } from '@/lib/http';
import type { VerseOfDay } from '@/types/verse-of-day';
import { parseVerseOfDayResponse } from '@/utils/verse-of-day-parse';

export async function fetchVerseOfDay(language = 'en'): Promise<VerseOfDay> {
  const { data } = await http.get<Record<string, unknown>>(ENDPOINTS.verseOfDay.today, {
    params: { lang: language },
  });
  return parseVerseOfDayResponse(data);
}
