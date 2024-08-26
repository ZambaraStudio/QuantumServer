import { Module } from '@nestjs/common';
import { GameServerService } from './game-server.service';
import { GameServerGateway } from 'src/modules/game-server/game-server.gateway';

@Module({
  imports: [],
  providers: [GameServerService, GameServerGateway],
  exports: [GameServerService],
  controllers: [],
})
export class GameServerModule {}
