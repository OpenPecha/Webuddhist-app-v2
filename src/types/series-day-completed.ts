export interface SeriesDayCompleted {
  seriesId: string;
  seriesTitle: string;
  imageUrl: string | null;
  daysCompleted: number;
}

export interface SeriesDayCompletedPage {
  series: SeriesDayCompleted[];
  total: number;
}
