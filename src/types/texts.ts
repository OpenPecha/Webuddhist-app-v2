export interface TextDetail {
  id: string;
  title: string;
  language?: string;
  summary?: string | null;
  description?: string | null;
}

export interface TextDetailsRequest {
  content_id?: string | null;
  version_id?: string | null;
  segment_id?: string | null;
  section_id?: string | null;
  size?: number;
  direction?: 'NEXT' | 'PREVIOUS';
}

export interface DetailTextSegment {
  segment_id: string;
  segment_number?: number | null;
  content?: string | null;
}

export interface DetailSection {
  id: string;
  title?: string | null;
  section_number?: number;
  parent_id?: string | null;
  segments?: DetailTextSegment[];
  sections?: DetailSection[] | null;
}

export interface DetailTableOfContent {
  id: string;
  text_id: string;
  sections: DetailSection[];
}

export interface DetailTableOfContentResponse {
  text_detail: TextDetail;
  content: DetailTableOfContent;
  size: number;
  pagination_direction?: string;
  current_segment_position?: number;
  total_segments?: number;
}
