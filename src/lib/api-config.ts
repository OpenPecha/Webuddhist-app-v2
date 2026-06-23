export const ENDPOINTS = {
  series: {
    list: '/series',
    featured: '/series/featured',
    detail: (id: string) => `/series/${id}`,
    enroll: (id: string) => `/series/${id}/enroll`,
  },
  calendar: {
    today: '/calendar/today',
    month: (year: number, month: number) => `/calendar/${year}/${month}`,
  },
  verseOfDay: {
    today: '/verse-of-day/today',
  },
  plans: {
    list: '/plans',
    detail: (id: string) => `/plans/${id}`,
    userPlans: '/users/me/plans',
    userPlanProgress: (id: string) => `/users/me/plans/${id}`,
    userPlanDay: (planId: string, day: number) =>
      `/users/me/plan/${planId}/days/${day}`,
    completionStatus: (planId: string) =>
      `/users/me/plans/${planId}/days/completion_status`,
  },
  routine: {
    user: '/users/me/routine',
    create: '/routines',
    timeBlocks: (routineId: string) => `/routines/${routineId}/time-blocks`,
    timeBlock: (routineId: string, blockId: string) =>
      `/routines/${routineId}/time-blocks/${blockId}`,
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
  users: {
    info: '/users/info',
    upload: '/users/upload',
    username: '/users/username',
    stats: '/users/me/stats',
    streak: '/users/me/streak',
    routineInfo: '/users/me/routine/info',
  },
  timers: {
    list: '/timers',
    stop: '/timers/user/timer_stop',
  },
  accumulators: {
    presets: '/accumulators/presets',
    detail: (parentId: string) => `/accumulators/${parentId}`,
    createUser: '/accumulators/user',
    updateUser: (id: string) => `/accumulators/user/${id}`,
    deleteUser: (id: string) => `/accumulators/user/${id}`,
  },
} as const;
