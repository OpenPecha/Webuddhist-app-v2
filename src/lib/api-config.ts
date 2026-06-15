export const ENDPOINTS = {
  series: {
    list: '/series',
    detail: (id: string) => `/series/${id}`,
    enroll: (id: string) => `/series/${id}/enroll`,
  },
  plans: {
    list: '/plans',
    detail: (id: string) => `/plans/${id}`,
    userPlans: '/users/me/plans',
    completionStatus: (planId: string) =>
      `/users/me/plans/${planId}/days/completion_status`,
  },
  routine: {
    user: '/users/me/routine',
  },
  recitations: {
    list: '/recitations',
    detail: (id: string) => `/recitations/${id}`,
  },
  texts: {
    list: '/texts',
    detail: (id: string) => `/texts/${id}`,
    chapters: (textId: string) => `/texts/${textId}/chapters`,
    versions: (textId: string) => `/texts/${textId}/versions`,
  },
  auth: {
    me: '/auth/me',
  },
} as const;
