import { Module, forwardRef } from '@nestjs/common';
import { GameServerService } from './game-server.service';
import { ConnectionModule } from 'src/connection/connection.module';
import { GameServerController } from 'src/game-server/game-server.controller';

@Module({
  imports: [forwardRef(() => ConnectionModule)],
  providers: [GameServerService],
  exports: [GameServerService],
  controllers: [GameServerController],
})
export class GameServerModule {}
