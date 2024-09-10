import { Module } from '@nestjs/common';
import { ConfigModule } from 'src/modules/config/config.module';
import { PlayerGatewayModule } from 'src/modules/player-gateway/player-gateway.module';

@Module({
  imports: [PlayerGatewayModule, ConfigModule],
})
export class MainModule {}
