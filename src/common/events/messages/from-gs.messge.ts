import { FromGSEventType } from "../game-server.events";
import { BaseSocketMessage } from "./base.message";

export type FromGSBaseMessage<T = unknown> = BaseSocketMessage<T> & {
  playerIds?: string[];
};


export type FromGSNewMessageType<T = unknown> = BaseSocketMessage<T> & {
  newField?: number;
};


export type FromGSEventMessageMappingType = {
  [K in FromGSEventType]: FromGSBaseMessage;
} & {
  'NEW_MESSAGE_TYPE': FromGSNewMessageType
};
