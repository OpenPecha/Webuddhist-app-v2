import type { AppEvent, EventMetadata, EventsResponse } from '@/types/event';
import { imageUrl } from '@/utils/image-url';

type RawMetadata = EventMetadata | EventMetadata[] | null | undefined;

function pickMetadata(metadata: RawMetadata, language: string): EventMetadata | null {
  if (!metadata) return null;
  if (Array.isArray(metadata)) {
    if (metadata.length === 0) return null;
    return metadata.find((entry) => entry.language === language) ?? metadata[0];
  }
  return metadata;
}

function parseMetadata(raw: Record<string, unknown>): EventMetadata {
  return {
    id: String(raw.id),
    name: String(raw.name ?? ''),
    description: raw.description != null ? String(raw.description) : null,
    language: String(raw.language ?? 'en'),
  };
}

function parseEventJson(raw: Record<string, unknown>, language: string): AppEvent {
  const metadataRaw = raw.metadata as RawMetadata | Record<string, unknown> | Record<string, unknown>[] | null;
  let metadata: EventMetadata | null = null;

  if (Array.isArray(metadataRaw)) {
    metadata = pickMetadata(
      metadataRaw.map((entry) =>
        parseMetadata(entry as Record<string, unknown>),
      ),
      language,
    );
  } else if (metadataRaw && typeof metadataRaw === 'object' && 'name' in metadataRaw) {
    metadata = pickMetadata(
      parseMetadata(metadataRaw as Record<string, unknown>),
      language,
    );
  }

  const image = raw.image as AppEvent['image'];
  const imageFromField = imageUrl(image);
  const imageUrlValue =
    (typeof raw.image_url === 'string' ? raw.image_url : null) ||
    imageFromField ||
    null;

  return {
    id: String(raw.id),
    planId: raw.plan_id != null ? String(raw.plan_id) : null,
    groupId: String(raw.group_id),
    startDate: String(raw.start_date),
    endDate: String(raw.end_date),
    isOneDay: Boolean(raw.is_one_day),
    name: metadata?.name ?? '',
    description: metadata?.description ?? null,
    imageUrl: imageUrlValue,
    image: image ?? null,
  };
}

export function parseEventsResponse(
  data: Record<string, unknown>,
  language: string,
): EventsResponse {
  const eventsRaw = Array.isArray(data.events) ? data.events : [];

  return {
    events: eventsRaw.map((entry) => parseEventJson(entry as Record<string, unknown>, language)),
    total: Number(data.total ?? eventsRaw.length),
    skip: Number(data.skip ?? 0),
    limit: Number(data.limit ?? eventsRaw.length),
  };
}

export function deviceTimezone(): string {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC';
  } catch {
    return 'UTC';
  }
}

export function formatEventDateRange(event: AppEvent): string | null {
  const start = new Date(event.startDate);
  const end = new Date(event.endDate);
  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) return null;

  const formatter = new Intl.DateTimeFormat(undefined, { month: 'short', day: 'numeric' });
  if (event.isOneDay) return formatter.format(start);
  return `${formatter.format(start)} - ${formatter.format(end)}`;
}
