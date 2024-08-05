import { Module } from '@nestjs/common';
import { ProcessModule } from './process/process.module';
import { GatewayModule } from './gateway/gateway.module';
import { ConnectionModule } from './connection/connection.module';
import { GameServerModule } from 'src/game-server/game-server.module';

@Module({
  imports: [GatewayModule, ProcessModule, ConnectionModule, GameServerModule],
})
export class MainModule {}
