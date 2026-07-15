export interface ImageSizes {
  thumbnail: string;
  medium: string;
  original: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  skip: number;
  limit: number;
  total: number;
}
