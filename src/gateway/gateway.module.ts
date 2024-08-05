import { Module, forwardRef } from '@nestjs/common';
import { GatewayService } from './gateway.service';
import { Gateway } from './gateway';
import { ConnectionModule } from 'src/connection/connection.module';
import { GameServerModule } from 'src/game-server/game-server.module';

@Module({
  imports: [ConnectionModule, forwardRef(() => GameServerModule)],
  providers: [GatewayService, Gateway],
  exports: [GatewayService],
})
export class GatewayModule {}
