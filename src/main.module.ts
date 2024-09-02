import { Module } from '@nestjs/common';
import { GameServerModule } from 'src/modules/game-server/game-server.module';
import { ConnectionModule } from 'src/modules/connection/connection.module';
import { PlayerGatewayModule } from 'src/modules/player-gateway/player-gateway.module';

@Module({
  imports: [PlayerGatewayModule, GameServerModule, ConnectionModule],
})
export class MainModule {}
