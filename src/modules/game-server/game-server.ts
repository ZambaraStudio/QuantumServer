import { ChildProcessByStdio } from 'child_process';
import { foregroundChild } from 'foreground-child';
import { QS_PORT } from 'src/const';
import { Socket } from 'socket.io';
import { BaseSocketMessage } from 'src/common/message/base.message';
import {
  TO_GS_EVENT_TYPES,
  isFromGSEventType,
} from 'src/common/events/game-server.events';
import { EventSystem } from 'src/lib/event-system';

import {
  GameServerConfig,
  GameServerStatus,
  GameServerStatusType,
} from 'src/modules/game-server/game-server.types';
import {
  FromGSBaseMessage,
  FromGSEventMessageMappingType,
} from 'src/common/message/game-server.message';
import { PlayerData } from 'src/modules/player-gateway/types/player.types';

type GameServerProp = {
  config: GameServerConfig;
};

export class GameServer {
  private socket: Socket;
  config: GameServerConfig;
  process: ChildProcessByStdio<null, null, null>;
  status: GameServerStatusType = GameServerStatus.INITIALIZED;
  public readonly fromGSEvents: EventSystem<FromGSEventMessageMappingType>;

  startServer() {
    this.status = GameServerStatus.STARTING;

    const child = foregroundChild(
      'npm start --prefix /Users/levan/work/zambara/quantum-ecosystem/quantum-game-server-test',
      {
        shell: true,
        env: {
          ...process.env,
          QS_PORT: QS_PORT.toString(),
          QS_GS_SERVER_ID: this.config.id.toString(),
          QS_GS_SERVER_SECRET: this.config.secret.toString(),
        },
      },
      async () => {
        this.status = GameServerStatus.CRASHED;
        this.fromGSEvents.emit(GameServerStatus.CRASHED, {
          serverId: this.config.id,
          type: GameServerStatus.CRASHED,
        });
      },
    );

    child.addListener('exit', () => {
      this.status = GameServerStatus.SHUTDOWN;
      this.fromGSEvents.emit(GameServerStatus.SHUTDOWN, {
        serverId: this.config.id,
        type: GameServerStatus.SHUTDOWN,
      });
    });
  }

  serverConnected(socket: Socket) {
    this.socket = socket;
    this.status = GameServerStatus.STARTED_CONNECTED;
    this.fromGSEvents.emit(GameServerStatus.STARTED_CONNECTED, {
      serverId: this.config.id,
      type: GameServerStatus.STARTED_CONNECTED,
    });

    socket.onAny((eventName: string, message: FromGSBaseMessage) => {
      if (isFromGSEventType(eventName)) {
        return this.fromGSEvents.emit(eventName, {
          ...message,
          serverId: this.config.id,
        });
      }
    });
  }

  async sendPlayerPacket(playerId: string, message: BaseSocketMessage) {
    if (this.status == GameServerStatus.STARTED_CONNECTED) {
      return await this.socket.emit(message.type, {
        playerId,
        ...message,
      });
    }
  }

  async sendPlayerGenericMessage(playerId: string, message: BaseSocketMessage) {
    if (this.status == GameServerStatus.STARTED_CONNECTED) {
      return await this.socket.emit(TO_GS_EVENT_TYPES.GENERIC_MESSAGE, {
        playerId,
        ...message,
      });
    }
  }
  async sendPlayersConnected(playerData: PlayerData[]) {
    if (this.status == GameServerStatus.STARTED_CONNECTED) {
      return await this.socket.emit(TO_GS_EVENT_TYPES.PLAYERS_CONNECTED, {
        players: playerData,
      });
    }
  }

  constructor({ config }: GameServerProp) {
    this.config = config;
    this.fromGSEvents = new EventSystem<FromGSEventMessageMappingType>();
  }
}
