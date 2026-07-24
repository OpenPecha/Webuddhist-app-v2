import type { TranslateFn } from '@/lib/i18n';

export interface GroupSocialLink {
  id: string;
  platform: string;
  url: string;
}

export function orderGroupSocialLinks(links: GroupSocialLink[]): GroupSocialLink[] {
  const website = links.filter((l) => l.platform.toLowerCase() === 'website');
  const others = links.filter((l) => l.platform.toLowerCase() !== 'website');
  return [...website, ...others];
}

export function displayHostUrl(url: string): string {
  try {
    const parsed = new URL(url.startsWith('http') ? url : `https://${url}`);
    return parsed.host.replace(/^www\./, '');
  } catch {
    return url.replace(/^https?:\/\//, '').replace(/^www\./, '').replace(/\/$/, '');
  }
}

export function formatMemberCountNumber(count: number, locale?: string): string {
  return count.toLocaleString(locale);
}

export function getMemberCountLabel(
  count: number,
  isPage: boolean,
  t: TranslateFn,
): string {
  if (isPage) {
    return count === 1 ? t('group_follower') : t('group_followers');
  }
  return count === 1 ? t('group_member') : t('group_members');
}

export function getGroupMemberCount(group: {
  group_type: 'PAGE' | 'COMMUNITY';
  follower_count?: number;
  joiner_count?: number;
  member_count?: number;
}): number {
  if (group.group_type === 'PAGE') {
    return group.follower_count ?? 0;
  }
  return group.joiner_count ?? group.member_count ?? 0;
}

export function formatSeriesDateRange(
  start?: string | null,
  end?: string | null,
  locale?: string,
): string | undefined {
  if (!start && !end) return undefined;

  const format = (value: string) => {
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return value;
    return new Intl.DateTimeFormat(locale, { month: 'short', day: 'numeric' }).format(date);
  };

  if (start && end) return `${format(start)} - ${format(end)}`;
  if (start) return format(start);
  return end ? format(end) : undefined;
}
