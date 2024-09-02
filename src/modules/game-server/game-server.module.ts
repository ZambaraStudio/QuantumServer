import { Module, forwardRef } from '@nestjs/common';
import { GameServerService } from './game-server.service';
import { GameServerGateway } from 'src/modules/game-server/game-server.gateway';
import { PlayerGatewayModule } from 'src/modules/player-gateway/player-gateway.module';

@Module({
  imports: [forwardRef(() => PlayerGatewayModule)],
  providers: [GameServerService, GameServerGateway],
  exports: [GameServerService],
  controllers: [],
})
export class GameServerModule {}
