export interface RecitationFirstSegment {
  content?: string | null;
}

export interface RecitationListItem {
  title: string;
  text_id: string;
  image_url?: string | null;
  first_segment?: RecitationFirstSegment | null;
}

export interface RecitationsListResponse {
  recitations: RecitationListItem[];
}
