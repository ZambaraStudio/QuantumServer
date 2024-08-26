import { Server, Socket } from 'socket.io';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { GameServerService } from 'src/modules/game-server/game-server.service';
import { ClientGatewayService } from './client-gateway.service';
import { ConnectedEntityData } from 'src/common/connection-handler/connection.types';
import { PlayerData } from 'src/modules/client-gateway/types/player.types';

import { GameServerStatus } from 'src/modules/game-server/game-server.types';
import {
  FROM_PLAYER_EVENT_TYPES,
  TO_PLAYER_EVENT_TYPES,
} from 'src/common/events/player.events';
import {
  ToPlayerGenericMessage,
  ToPlayerServerStatus,
} from 'src/common/message/player.message';

@WebSocketGateway({ namespace: 'gateway', cors: true })
export class ClientGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  private server: Server;

  constructor(
    private gameServerService: GameServerService,
    private clientGatewayService: ClientGatewayService,
  ) {}

  async handleDisconnect(socket: Socket) {
    await this.clientGatewayService.connectionHandler.removeSocketConnection(
      socket.id,
    );
    this.emitThingToEveryone();
  }

  async handleConnection(socket: Socket) {
    const authentication = await this.verifyAuthToken(socket.handshake.auth);

    if (!authentication) {
      return socket.disconnect();
    }
    await this.clientGatewayService.connectionHandler.addEntityDataToSocketConnection(
      socket,
      authentication.data,
    );

    this.emitThingToEveryone();
  }

  async emitThingToEveryone() {
    const playerCount =
      await this.clientGatewayService.connectionHandler.getEntityCount();
    const socketCount =
      await this.clientGatewayService.connectionHandler.getSocketCount();
    this.server.emit('connected-players', {
      playerCount,
      socketCount,
    });
  }

  @SubscribeMessage(FROM_PLAYER_EVENT_TYPES.GENERIC_MESSAGE)
  private async onGenericMessage(
    socket: Socket,
    message: ToPlayerGenericMessage,
  ) {
    const playerData =
      await this.clientGatewayService.connectionHandler.getEntityDataBySocketId(
        socket.id,
      );
    if (!playerData) {
      return;
    }
    const gameServer = this.gameServerService.getUserServer(playerData.id);
    if (!gameServer) {
      return;
    }

    gameServer.sendPlayerGenericMessage(playerData.id, message);
  }

  @SubscribeMessage(FROM_PLAYER_EVENT_TYPES.GAME_SERVER_STATUS)
  private async onGetAuth(socket: Socket): Promise<ToPlayerServerStatus> {
    const playerData =
      await this.clientGatewayService.connectionHandler.getEntityDataBySocketId(
        socket.id,
      );
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

  public async verifyAuthToken(
    auth: unknown,
  ): Promise<ConnectedEntityData<PlayerData>> {
    // THIS METHOD WILL CALL LAMBDA LATER
    const { authToken } = auth as any;
    if (authToken < 10) {
      return null;
    }

    return {
      id: authToken,
      data: {
        id: authToken,
        name: 'id' + authToken,
      },
    };
  }
}
