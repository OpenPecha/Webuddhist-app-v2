export interface SegmentRelatedTextInfo {
  commentaries: number;
  rootText: number;
}

export interface SegmentResourcesInfo {
  sheets: number;
}

export interface SegmentVideo {
  id: string;
  planId: string;
  url: string;
  videoId: string;
  title: string;
  displayOrder: number;
  thumbnailUrl: string;
}

export interface SegmentInfo {
  segmentId: string;
  textId: string;
  translations: number;
  relatedText: SegmentRelatedTextInfo;
  resources: SegmentResourcesInfo;
  videos: SegmentVideo[];
}

export function parseSegmentInfo(data: Record<string, unknown>): SegmentInfo {
  const root = (data.segment_info as Record<string, unknown> | undefined) ?? data;
  const related = (root.related_text as Record<string, unknown> | undefined) ?? {};
  const resources = (root.resources as Record<string, unknown> | undefined) ?? {};
  const rawVideos = (root.videos as unknown[]) ?? [];

  const videos: SegmentVideo[] = rawVideos
    .filter((v): v is Record<string, unknown> => !!v && typeof v === 'object')
    .map((v) => {
      const videoId = String(v.video_id ?? '');
      return {
        id: String(v.id ?? ''),
        planId: String(v.plan_id ?? ''),
        url: String(v.url ?? ''),
        videoId,
        title: String(v.title ?? ''),
        displayOrder: Number(v.display_order) || 0,
        thumbnailUrl: videoId
          ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`
          : '',
      };
    })
    .sort((a, b) => a.displayOrder - b.displayOrder);

  return {
    segmentId: String(root.segment_id ?? ''),
    textId: String(root.text_id ?? ''),
    translations: Number(root.translations) || 0,
    relatedText: {
      commentaries: Number(related.commentaries) || 0,
      rootText: Number(related.root_text) || 0,
    },
    resources: {
      sheets: Number(resources.sheets) || 0,
    },
    videos,
  };
}
