import { BaseSocketMessage } from 'src/common/message/base.message';

export type ToPlayerBaseMessage<T = unknown> = BaseSocketMessage<T>;
export type FromPlayerBaseMessage<T = unknown> = BaseSocketMessage<T>;

export type ToPlayerGenericMessage = ToPlayerBaseMessage<string>;
export type ToPlayerServerStatus = FromPlayerBaseMessage<{
  status: boolean;
}>;

export type FromPlayerGenericMessage = FromPlayerBaseMessage<unknown>;
export type FromPlayerServerStatus = FromPlayerBaseMessage<undefined>;
