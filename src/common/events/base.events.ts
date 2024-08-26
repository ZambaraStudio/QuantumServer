export const BASE_EVENT_TYPES = {
  GENERIC_MESSAGE: 'generic-message',
} as const;

export type BaseEventType =
  (typeof BASE_EVENT_TYPES)[keyof typeof BASE_EVENT_TYPES];
