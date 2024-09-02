import {
  FromGSEventType,
  ToGSEventType,
} from 'src/common/events/game-server.events';
import { BaseSocketMessage } from 'src/common/message/base.message';
import { GameServerStatusType } from 'src/modules/game-server/game-server.types';

export type ToGSBaseMessage<T = unknown> = BaseSocketMessage<T>;
export type FromGSBaseMessage<T = unknown> = BaseSocketMessage<T> & {
  playerIds?: string[];
  serverId: string;
};

export type ToGSEventMessageMappingType = {
  [K in ToGSEventType]: ToGSBaseMessage;
};

export type FromGSEventMessageMappingType = {
  [K in FromGSEventType]: FromGSBaseMessage;
} & {
  [K in GameServerStatusType]: FromGSBaseMessage;
};
