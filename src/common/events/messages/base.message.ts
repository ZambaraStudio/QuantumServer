export type BaseSocketMessage<T = unknown> = {
  type: string;
  data?: T;
};
