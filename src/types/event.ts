import type { ImageSizes } from '@/types/api';

export interface EventMetadata {
  id: string;
  name: string;
  description?: string | null;
  language: string;
}

export interface AppEvent {
  id: string;
  planId?: string | null;
  groupId: string;
  startDate: string;
  endDate: string;
  isOneDay: boolean;
  name: string;
  description?: string | null;
  imageUrl?: string | null;
  image?: ImageSizes | null;
}

export interface EventsResponse {
  events: AppEvent[];
  total: number;
  skip: number;
  limit: number;
}
