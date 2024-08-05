import { Socket } from 'socket.io';

export class PlayerData {
  playerId: string;
  data?: unknown;
}

export class PlayerSystemData extends PlayerData {
  socketConnections: Map<string, SocketConnection>;
}

export class SocketConnection {
  socketId: string;
  socket: Socket;
  playerData: PlayerSystemData;
}
