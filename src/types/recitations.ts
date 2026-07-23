export interface RecitationListItem {
  title: string;
  text_id: string;
  image_url?: string | null;
}

export interface RecitationsListResponse {
  recitations: RecitationListItem[];
}
