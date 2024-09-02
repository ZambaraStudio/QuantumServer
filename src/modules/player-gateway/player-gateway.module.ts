import { Module, forwardRef } from '@nestjs/common';
import { PlayerGatewayService } from './player-gateway.service';
import { PlayerGateway } from './player-gateway';
import { GameServerModule } from 'src/modules/game-server/game-server.module';

@Module({
  imports: [forwardRef(() => GameServerModule)],
  providers: [PlayerGatewayService, PlayerGateway],
  exports: [PlayerGatewayService],
})
export class PlayerGatewayModule {}
