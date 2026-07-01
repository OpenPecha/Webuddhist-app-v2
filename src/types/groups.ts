import type { ImageSizes } from '@/types/api';
import type { Plan, Series } from '@/types/series';

export interface GroupMetadata {
  id: string;
  title: string;
  sub_title?: string | null;
  description?: string | null;
  description_long?: string | null;
  language: string;
}

export interface AuthorGroupSummary {
  id: string;
  slug: string;
  group_type: 'PAGE' | 'COMMUNITY';
  is_public: boolean;
  avatar_key?: string | null;
  banner_key?: string | null;
  avatar_url?: string | null;
  banner_url?: string | null;
  metadata: GroupMetadata[] | GroupMetadata | null;
  tags?: { id: string; name: string }[] | string[];
  follower_count?: number;
  joiner_count?: number;
  member_count?: number;
}

export interface PublicGroupDetail extends AuthorGroupSummary {
  social_links?: { id: string; platform: string; url: string }[];
  series?: Series[];
  plans?: Plan[];
}

export interface GroupListResponse {
  groups: AuthorGroupSummary[];
  skip: number;
  limit: number;
  total: number;
}

export function pickGroupMetadata(
  metadata: GroupMetadata[] | GroupMetadata | null | undefined,
  language: string,
): GroupMetadata | undefined {
  if (!metadata) return undefined;
  const list = Array.isArray(metadata) ? metadata : [metadata];
  const lang = language.toLowerCase();
  return (
    list.find((m) => m.language.toLowerCase() === lang) ??
    list.find((m) => m.language.toUpperCase() === lang.toUpperCase()) ??
    list[0]
  );
}

export function groupCoverUri(group: AuthorGroupSummary): string | undefined {
  return group.avatar_url ?? undefined;
}
