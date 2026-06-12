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
  },
  recitations: {
    all: ['recitations'] as const,
    list: () => ['recitations', 'list'] as const,
  },
} as const;
