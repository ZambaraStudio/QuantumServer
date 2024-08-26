import { Module } from '@nestjs/common';
import { ClientGatewayModule } from './modules/client-gateway/client-gateway.module';
import { GameServerModule } from 'src/modules/game-server/game-server.module';
import { ConnectionModule } from 'src/modules/connection/connection.module';

@Module({
  imports: [ClientGatewayModule, GameServerModule, ConnectionModule],
})
export class MainModule {}
