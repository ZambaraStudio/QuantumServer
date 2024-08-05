import { ChildProcessByStdio } from 'child_process';
import { GameServerConfig, GameServerStatus } from './game-server.types';
import { foregroundChild } from 'foreground-child';
import { SocketMessage } from 'src/gateway/types/message.types';
import { Socket, io } from 'socket.io-client';
import { MESSAGE_TYPES, QS_PORT } from 'src/const';

type GameServerProp = {
  config: GameServerConfig;
  onServerStart: () => void;
  onServerDown: () => void;
  onServerConnected: () => void;
  onServerDisconnected: () => void;
  onServerCrash: () => void;
  onSystemMessage: <T = unknown>(
    systemMessageType: string,
    message: SocketMessage<T>,
  ) => void;
  onGenericMessage: <T = unknown>(message: SocketMessage<T>) => void;
};

export class GameServer {
  private socket: Socket;
  config: GameServerConfig;
  process: ChildProcessByStdio<null, null, null>;
  status: GameServerStatus = GameServerStatus.INITIALIZED;
  onServerStart: () => void;
  onServerDown: () => void;
  onServerConnected: () => void;
  onServerDisconnected: () => void;
  onServerCrash: () => void;
  onSystemMessage: <T = unknown>(
    systemMessageType: string,
    message: SocketMessage<T>,
  ) => void;
  onGenericMessage: <T = unknown>(message: SocketMessage<T>) => void;

  startServer() {
    this.status = GameServerStatus.STARTING;

    const child = foregroundChild(
      'npm start --prefix /Users/levan/work/zambara/quantum-ecosystem/quantum-game-server-test',
      {
        shell: true,
        env: {
          ...process.env,
          QS_PORT: QS_PORT.toString(),
          QS_GS_PORT: this.config.port.toString(),
          QS_GS_SERVER_ID: this.config.id.toString(),
          QS_GS_SERVER_SECRET: this.config.secret.toString(),
        },
      },
      async () => {
        this.status = GameServerStatus.CRASHED;
        this.onServerCrash();
        //this.gameServerList.delete(gameServerConfig.id);
      },
    );

    child.addListener('exit', () => {
      this.status = GameServerStatus.SHUTDOWN;
      this.onServerDown();
    });
  }

  connectToServer() {
    const connection = io(`http://localhost:${this.config.port}`, {
      transports: ['websocket'],
      autoConnect: true,
    });

    connection.on('connect', () => {
      this.status = GameServerStatus.STARTED_CONNECTED;
      console.log(this.config.port);
      this.onServerConnected();
    });

    connection.on('disconnect', () => {
      this.status = GameServerStatus.STARTED_DISCONNECTED;
      this.onServerDisconnected();
    });

    connection.onAny((eventName: string, message: SocketMessage<unknown>) => {
      if (eventName == 'generic-message') {
        return this.onGenericMessage(message);
      }
      this.onSystemMessage(eventName, message);
    });

    this.socket = connection;
  }

  sendPlayerPacket(playerId: string, message: SocketMessage) {
    console.log(Date.now());
    this.socket.emit(MESSAGE_TYPES.GENERIC_MESSAGE, {
      playerId,
      ...message,
    });
  }

  constructor({
    config,
    onServerDown,
    onGenericMessage,
    onSystemMessage,
    onServerStart,
    onServerConnected,
    onServerDisconnected,
    onServerCrash,
  }: GameServerProp) {
    this.config = config;
    this.onServerDown = onServerDown;
    this.onServerStart = onServerStart;
    this.onServerConnected = onServerConnected;
    this.onServerDisconnected = onServerDisconnected;
    this.onGenericMessage = onGenericMessage;
    this.onSystemMessage = onSystemMessage;
    this.onServerCrash = onServerCrash;
  }
}