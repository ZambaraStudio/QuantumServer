import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { ConnectionHandler } from 'src/common/connection-handler/connection-handler';
import {
  ToPlayerBaseMessage,
  ToPlayerGenericMessage,
  ToPlayerServerStatus,
} from 'src/common/message/player.message';
import { GameServerService } from 'src/modules/game-server/game-server.service';
import { GameServerStatus } from 'src/modules/game-server/game-server.types';
import {
  TO_PLAYER_EVENT_TYPES,
  ToPlayerEventType,
} from 'src/common/events/player.events';
import { PlayerData } from 'src/modules/player-gateway/types/player.types';

@Injectable()
export class PlayerGatewayService {
  public connectionHandler: ConnectionHandler<PlayerData>;

  constructor(
    @Inject(forwardRef(() => GameServerService))
    private readonly gameServerService: GameServerService,
  ) {
    this.connectionHandler = new ConnectionHandler<PlayerData>();
  }

  async handleGenericMessage(
    socketId: string,
    message: ToPlayerGenericMessage,
  ) {
    const playerData =
      await this.connectionHandler.getEntityDataBySocketId(socketId);
    if (!playerData) {
      return;
    }
    const gameServer = this.gameServerService.getUserServer(playerData.id);
    if (!gameServer) {
      return;
    }

    gameServer.sendPlayerGenericMessage(playerData.id, message);
  }

  async handleGetAuth(socketId: string): Promise<ToPlayerServerStatus> {
    const playerData =
      await this.connectionHandler.getEntityDataBySocketId(socketId);
    if (!playerData) {
      return;
    }
    const gameServer = this.gameServerService.getUserServer(playerData.id);

    if (!gameServer) {
      return {
        type: TO_PLAYER_EVENT_TYPES.GAME_SERVER_STATUS,
        data: {
          status: GameServerStatus.STARTING,
        },
      };
    }

    return {
      type: TO_PLAYER_EVENT_TYPES.GAME_SERVER_STATUS,
      data: {
        status: gameServer.status,
      },
    };
  }

  async sendMessageToPlayers(
    playerIds: string[],
    eventType: ToPlayerEventType,
    message: ToPlayerBaseMessage,
  ) {
    const connections =
      await this.connectionHandler.getSocketConnectionsByEntityIds(playerIds);

    connections.forEach((connection) => {
      connection.socket.emit(eventType, message);
    });
  }
  async sendGenericMessageToPlayers(
    playerIds: string[],
    message: ToPlayerBaseMessage,
  ) {
    const connections =
      await this.connectionHandler.getSocketConnectionsByEntityIds(playerIds);
    connections.forEach((connection) => {
      console.log(message.type);
      connection.socket.emit(TO_PLAYER_EVENT_TYPES.GENERIC_MESSAGE, {
        data: message.data,
        type: message.type,
      });
    });
  }

  async playerConnected(playerData: PlayerData) {
    this.gameServerService.sendPlayersConnected([playerData]);
  }
}
