export type SocketMessage<T = unknown> = {
  type: string;
  data: T;
};

export type SocketMessageToGameServer<T = unknown> = SocketMessage<T> & {
  playerId: string;
};
