import { PlayerData } from 'aws-sdk/clients/gamelift';
import {
  TO_GS_EVENT_TYPES,
  ToGSEventType,
} from 'src/common/events/game-server.events';
import { BaseSocketMessage } from 'src/common/message/base.message';

export type ToGSBaseMessage<T = unknown> = BaseSocketMessage<T>;

export type ToGSGenericMessage<T = unknown> = BaseSocketMessage<T> & {
  playerId?: string;
};

export type ToGSPlayersConnected<T = unknown> = BaseSocketMessage<T> & {
  players: PlayerData[];
};
export type ToGSPlayersDisconnected<T = unknown> = BaseSocketMessage<T> & {
  players: PlayerData[];
};

type Modify<T, R> = Omit<T, keyof R> & R;

export type ToGSEventMessageMappingType = Modify<
  {
    [K in ToGSEventType]: ToGSBaseMessage;
  },
  {
    [TO_GS_EVENT_TYPES.GENERIC_MESSAGE]: ToGSGenericMessage;
    [TO_GS_EVENT_TYPES.PLAYERS_CONNECTED]: ToGSPlayersDisconnected;
    [TO_GS_EVENT_TYPES.PLAYERS_DISCONNECTED]: ToGSPlayersConnected;
  }
>;
