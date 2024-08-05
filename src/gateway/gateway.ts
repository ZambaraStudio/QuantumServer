import { Server, Socket } from 'socket.io';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { ConnectionService } from 'src/connection/connection.service';
import { PlayerData } from 'src/connection/connection.types';
import { SocketMessage } from 'src/gateway/types/message.types';
import { GameServerService } from 'src/game-server/game-server.service';
import { MESSAGE_TYPES } from 'src/const';

@WebSocketGateway({ namespace: 'gateway', cors: true })
export class Gateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  private server: Server;

  constructor(
    private connectionService: ConnectionService,
    private gameServerService: GameServerService,
  ) {}

  async handleDisconnect(socket: Socket) {
    await this.connectionService.removeSocketConnection(socket.id);
    this.emitThingToEveryone();
  }

  async handleConnection(socket: Socket) {
    const authentication = await this.verifyAuthToken(socket.handshake.auth);

    if (!authentication) {
      return socket.disconnect();
    }
    await this.connectionService.addPlayerDataToSocketConnection(
      socket,
      authentication,
    );

    this.emitThingToEveryone();
  }

  async emitThingToEveryone() {
    const playerCount = await this.connectionService.getPlayerCount();
    const socketCount = await this.connectionService.getSocketCount();
    this.server.emit('connected-players', {
      playerCount,
      socketCount,
    });
  }

  @SubscribeMessage('')
  private async onContainerRequest(
    socket: Socket,
    message: SocketMessage<string>,
  ) {
    console.log(1213213123);
    await this.connectionService.addPlayerDataToSocketConnection(socket, {
      playerId: message.data,
    });
    return 'Authorized';
  }

  @SubscribeMessage('get-auth')
  private async getAuthentication(socket: Socket, userAuthToken: string) {
    console.log('GET_AUTH');
    // const userData = await this.connectionService.getPlayerData(userAuthToken);
    // return "Not Authorized"
  }

  @SubscribeMessage(MESSAGE_TYPES.GENERIC_MESSAGE)
  private async onGenericMessage(
    socket: Socket,
    message: SocketMessage<string>,
  ) {
    const playerData = await this.connectionService.getPlayerDataBySocketId(
      socket.id,
    );
    if (!playerData) {
      return;
    }
    const gameServer = this.gameServerService.getUserServer(
      playerData.playerId,
    );

    if (!gameServer) {
      return;
    }
    gameServer.sendPlayerPacket(playerData.playerId, message);
  }

  public async verifyAuthToken(auth: unknown): Promise<PlayerData> {
    // THIS METHOD WILL CALL LAMBDA LATER
    const { authToken } = auth as any;
    if (authToken < 10) {
      return null;
    }

    return {
      playerId: authToken,
      data: {
        name: 'vandamme' + authToken,
      },
    };
  }
}
