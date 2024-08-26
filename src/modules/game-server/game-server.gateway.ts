import { Server, Socket } from 'socket.io';
import {
  OnGatewayConnection,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { GameServerService } from 'src/modules/game-server/game-server.service';
import { GameServerAuth } from 'src/modules/game-server/types/game-server.auth';
import { GameServer } from 'src/modules/game-server/game-server';

@WebSocketGateway({ namespace: 'server', cors: true })
export class GameServerGateway implements OnGatewayConnection {
  @WebSocketServer()
  private server: Server;

  constructor(private gameServerService: GameServerService) {}

  async handleConnection(socket: Socket) {
    const auth: GameServerAuth = socket.handshake.auth as GameServerAuth;
    const gameServer = await this.verifyAuth(auth);

    if (!gameServer) {
      return socket.disconnect();
    }
    gameServer.serverConnected(socket);
  }

  public async verifyAuth({
    qsGSServerId,
    qsGSServerSecret,
  }: GameServerAuth): Promise<GameServer> {
    const gameServer =
      await this.gameServerService.gameServerList.get(qsGSServerId);
    if (!gameServer || gameServer.config.secret != qsGSServerSecret) {
      return undefined;
    }

    return gameServer;
  }
}
