export const QUERY_KEYS = {
  series: {
    all: ['series'] as const,
    list: (language: string, skip: number, limit: number) =>
      ['series', 'list', language, skip, limit] as const,
    featured: (language: string, limit: number) =>
      ['series', 'featured', language, limit] as const,
    detail: (id: string, language: string) => ['series', 'detail', id, language] as const,
    userEnrollments: (language: string) => ['series', 'userEnrollments', language] as const,
    userProgress: (seriesId: string, language: string) =>
      ['series', 'userProgress', seriesId, language] as const,
  },
  calendar: {
    today: () => ['calendar', 'today'] as const,
    month: (year: number, month: number) => ['calendar', 'month', year, month] as const,
  },
  verseOfDay: {
    today: (language: string) => ['verseOfDay', 'today', language] as const,
  },
  streak: {
    me: () => ['streak', 'me'] as const,
  },
  routineInfo: {
    me: () => ['routineInfo', 'me'] as const,
  },
  plans: {
    all: ['plans'] as const,
    list: () => ['plans', 'list'] as const,
    detail: (id: string) => ['plans', 'detail', id] as const,
    publicDetail: (id: string, language: string) =>
      ['plans', 'public', id, language] as const,
    publicDays: (id: string) => ['plans', 'publicDays', id] as const,
    publicDay: (id: string, day: number) => ['plans', 'publicDay', id, day] as const,
    userPlans: (language: string, skip: number, limit: number) =>
      ['plans', 'user', language, skip, limit] as const,
    userPlanProgress: (planId: string) => ['plans', 'user', 'progress', planId] as const,
    userPlanDay: (planId: string, day: number) =>
      ['plans', 'user', 'day', planId, day] as const,
    completionStatus: (planId: string) => ['plans', 'completion', planId] as const,
  },
  groups: {
    all: ['groups'] as const,
    discover: (language: string, search: string, skip: number, limit: number) =>
      ['groups', 'discover', language, search, skip, limit] as const,
    joined: (language: string, skip: number, limit: number) =>
      ['groups', 'joined', language, skip, limit] as const,
    detail: (id: string, language: string) => ['groups', 'detail', id, language] as const,
  },
  routine: {
    all: ['routine'] as const,
    user: (skip: number, limit: number) => ['routine', 'user', skip, limit] as const,
  },
  recitations: {
    all: ['recitations'] as const,
    list: (language: string) => ['recitations', 'list', language] as const,
  },
  texts: {
    detail: (id: string) => ['texts', 'detail', id] as const,
    readerDetails: (textId: string, segmentId: string) =>
      ['texts', 'readerDetails', textId, segmentId] as const,
  },
  profile: {
    all: ['profile'] as const,
    info: () => ['profile', 'info'] as const,
    stats: () => ['profile', 'stats'] as const,
    mantraCounts: (language: string, skip: number, limit: number) =>
      ['profile', 'mantraCounts', language, skip, limit] as const,
    seriesDayCompleted: (language: string, skip: number, limit: number) =>
      ['profile', 'seriesDayCompleted', language, skip, limit] as const,
  },
  timers: {
    list: (skip: number, limit: number) => ['timers', 'list', skip, limit] as const,
  },
  mala: {
    presets: (language: string) => ['mala', 'presets', language] as const,
  },
  events: {
    today: (language: string, limit: number) =>
      ['events', 'today', language, limit] as const,
  },
} as const;
