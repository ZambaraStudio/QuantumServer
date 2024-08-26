import {
  FROM_PLAYER_EVENT_TYPES,
  FromPlayerEventType,
  TO_PLAYER_EVENT_TYPES,
  ToPlayerEventType,
} from 'src/common/events/player.events';
import { BaseSocketMessage } from 'src/common/message/base.message';
import { GameServerStatusType } from 'src/modules/game-server/game-server.types';

export type ToPlayerBaseMessage<T = unknown> = BaseSocketMessage<T>;
export type FromPlayerBaseMessage<T = unknown> = BaseSocketMessage<T>;

export type ToPlayerGenericMessage = ToPlayerBaseMessage<string>;
export type ToPlayerServerStatus = FromPlayerBaseMessage<{
  status: GameServerStatusType;
}>;
export type FromPlayerGenericMessage = FromPlayerBaseMessage<string>;
export type FromPlayerServerStatus = FromPlayerBaseMessage<undefined>;

export type ToPlayerEventMessageMappingType = {
  [K in ToPlayerEventType]: ToPlayerBaseMessage;
} & {
  [TO_PLAYER_EVENT_TYPES.GENERIC_MESSAGE]: ToPlayerGenericMessage;
  [TO_PLAYER_EVENT_TYPES.GAME_SERVER_STATUS]: ToPlayerServerStatus;
};

export type FromPlayerEventMessageMappingType = {
  [K in FromPlayerEventType]: FromPlayerBaseMessage;
} & {
  [FROM_PLAYER_EVENT_TYPES.GENERIC_MESSAGE]: FromPlayerGenericMessage;
  [FROM_PLAYER_EVENT_TYPES.GAME_SERVER_STATUS]: FromPlayerServerStatus;
};
