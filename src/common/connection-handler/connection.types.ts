import { Socket } from 'socket.io';

export class ConnectedEntityData<Data = unknown> {
  id: string;
  data?: Data;
}

export class ConnectedEntitySystemData<
  Data = unknown,
> extends ConnectedEntityData<Data> {
  socketConnections: Map<string, SocketConnection<Data>>;
}

export class SocketConnection<Data = unknown> {
  socketId: string;
  socket: Socket;
  entityData: ConnectedEntitySystemData<Data>;
}
