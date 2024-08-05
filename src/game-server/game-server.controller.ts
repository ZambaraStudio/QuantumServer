import { Controller, Param, Post } from '@nestjs/common';
import { GameServerService } from './game-server.service';

@Controller('/game-server')
export class GameServerController {
  constructor(private readonly gameServerService: GameServerService) {}

  @Post('/ready/:serverId/:serverSecret')
  heartbeat(
    @Param('serverId') serverId: string,
    @Param('serverSecret') serverSecret: string,
  ): void {
    return this.gameServerService.connectToGameServer(serverId, serverSecret);
  }
}
