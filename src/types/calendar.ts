export interface CalendarDay {
  gregorianDate: string | null;
  lunarDay: number;
  lunarMonth: number;
  monthDesignation: string;
  yearDesignation: string;
}

export interface CalendarTodayResponse {
  day: CalendarDay;
}

export interface CalendarMonth {
  year: number;
  month: number;
  designation: string | null;
  days: CalendarDay[];
}
