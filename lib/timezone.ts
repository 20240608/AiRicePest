export const DEFAULT_TIMEZONE = 'UTC';

const LOCAL_FALLBACK = 'UTC';

export const getClientTimezone = (): string => {
  if (typeof window === 'undefined' || typeof Intl === 'undefined') {
    return DEFAULT_TIMEZONE;
  }
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone || LOCAL_FALLBACK;
  } catch (error) {
    console.error('Failed to resolve client timezone:', error);
    return LOCAL_FALLBACK;
  }
};
