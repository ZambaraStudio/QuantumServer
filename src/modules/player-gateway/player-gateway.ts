import { Server, Socket } from 'socket.io';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { PlayerGatewayService } from './player-gateway.service';
import { ConnectedEntityData } from 'src/common/connection-handler/connection.types';

import {
  FROM_PLAYER_EVENT_TYPES,
  TO_PLAYER_EVENT_TYPES,
} from 'src/common/events/player.events';
import {
  ToPlayerGenericMessage,
  ToPlayerServerStatus,
} from 'src/common/message/player.message';
import { PlayerData } from 'src/modules/player-gateway/types/player.types';

@WebSocketGateway({ namespace: 'gateway', cors: true })
export class PlayerGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  private server: Server;

  constructor(private playerGatewayService: PlayerGatewayService) {}

  async handleDisconnect(socket: Socket) {
    await this.playerGatewayService.handlePlayerDisconnect(socket.id);
    // this.emitThingToEveryone();
  }

  async handleConnection(socket: Socket) {
    const authentication = await this.verifyAuthToken(socket.handshake.auth);

    if (!authentication) {
      return socket.disconnect();
    }
    await this.playerGatewayService.handlePlayerConnect(
      socket,
      authentication.data.id,
      authentication.data,
    );
  }

  // async emitThingToEveryone() {
  //   const playerCount =
  //     await this.playerGatewayService.connectionHandler.getEntityCount();
  //   const socketCount =
  //     await this.playerGatewayService.connectionHandler.getSocketCount();
  //   this.server.emit('connected-players', {
  //     playerCount,
  //     socketCount,
  //   });
  // }

  @SubscribeMessage(FROM_PLAYER_EVENT_TYPES.GENERIC_MESSAGE)
  private async onGenericMessage(
    socket: Socket,
    message: ToPlayerGenericMessage,
  ) {
    this.playerGatewayService.handleGenericMessage(socket.id, message);
  }

  @SubscribeMessage(FROM_PLAYER_EVENT_TYPES.GAME_SERVER_STATUS)
  private async onGetAuth(): Promise<ToPlayerServerStatus> {
    return Promise.resolve({
      type: TO_PLAYER_EVENT_TYPES.GAME_SERVER_STATUS,
      data: {
        status: true,
      },
    });
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
        gameInstance: {
          id: 'entry1',
        },
      },
    };
  }
}
