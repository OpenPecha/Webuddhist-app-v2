export interface MantraCount {
  mantraId: string;
  mantraTitle: string;
  malaImageUrl: string | null;
  totalCount: number;
}

export interface MantraCountPage {
  counts: MantraCount[];
}
