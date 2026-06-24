export interface VerseOfDayGroupInfo {
  id: string;
  title: string;
  subTitle: string;
  description: string;
  language: string;
}

export interface VerseOfDay {
  id: string;
  verse: string;
  imageUrl: string;
  refId: string;
  refType: string;
  date: string;
  groupInfo: VerseOfDayGroupInfo[];
}
