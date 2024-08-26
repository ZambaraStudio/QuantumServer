import { Module } from '@nestjs/common';
import { ClientGatewayService } from './client-gateway.service';
import { ClientGateway } from './client-gateway';
import { GameServerModule } from 'src/modules/game-server/game-server.module';

@Module({
  // imports: [forwardRef(() => GameServerModule)],
  imports: [GameServerModule],
  providers: [ClientGatewayService, ClientGateway],
  exports: [ClientGatewayService],
})
export class ClientGatewayModule {}
