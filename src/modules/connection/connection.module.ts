import { Module } from '@nestjs/common';
import { ConnectionService } from 'src/modules/connection/connection.service';

@Module({
  imports: [],
  providers: [ConnectionService],
  exports: [ConnectionService],
})
export class ConnectionModule {}
