export const CACHE_TTL = {
  CONCERTS: 60,
  CONCERTS_WITH_STATUS: 30,
  HISTORY: 5 * 60,
  STATS: 30,
} as const;

export const CACHE_KEYS = {
  CONCERTS: 'concerts:all',
  CONCERTS_WITH_STATUS: 'concerts:with-status',
  HISTORY: 'reservations:history',
  HISTORY_USER: 'reservations:history:user',
  STATS: 'reservations:stats',
} as const;
