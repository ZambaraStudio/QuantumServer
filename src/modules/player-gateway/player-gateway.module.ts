import { Module } from '@nestjs/common';
import { PlayerGatewayService } from './player-gateway.service';
import { PlayerGateway } from './player-gateway';
import { RedisModule } from 'src/modules/redis/redis.module';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [RedisModule, ScheduleModule.forRoot()],
  providers: [PlayerGatewayService, PlayerGateway],
  exports: [PlayerGatewayService],
})
export class PlayerGatewayModule {}
