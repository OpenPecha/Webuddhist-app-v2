import { ENDPOINTS } from '@/lib/api-config';
import { http } from '@/lib/http';
import type { EventsResponse } from '@/types/event';
import { deviceTimezone, parseEventsResponse } from '@/utils/event-parse';

export async function fetchEventsToday(
  language = 'en',
  limit = 20,
): Promise<EventsResponse> {
  const { data } = await http.get<Record<string, unknown>>(ENDPOINTS.events.today, {
    params: { language, limit },
    headers: { 'X-Timezone': deviceTimezone() },
  });
  return parseEventsResponse(data, language);
}
