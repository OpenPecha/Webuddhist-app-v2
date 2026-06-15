export const QUERY_KEYS = {
  series: {
    all: ['series'] as const,
    list: (language: string, skip: number, limit: number) =>
      ['series', 'list', language, skip, limit] as const,
    detail: (id: string) => ['series', 'detail', id] as const,
  },
  plans: {
    all: ['plans'] as const,
    list: () => ['plans', 'list'] as const,
    detail: (id: string) => ['plans', 'detail', id] as const,
    userPlans: (language: string, skip: number, limit: number) =>
      ['plans', 'user', language, skip, limit] as const,
    completionStatus: (planId: string) => ['plans', 'completion', planId] as const,
  },
  routine: {
    all: ['routine'] as const,
    user: (skip: number, limit: number) => ['routine', 'user', skip, limit] as const,
  },
  recitations: {
    all: ['recitations'] as const,
    list: () => ['recitations', 'list'] as const,
  },
} as const;
