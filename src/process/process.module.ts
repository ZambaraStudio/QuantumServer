import { Module } from '@nestjs/common';
import { ProcessController } from './process.controller';
import { ProcessService } from './process.service';
import { ScheduleModule } from '@nestjs/schedule';
// import { DynamoDBModule } from 'src/dynamodb/dynamodb.module';
import { GatewayModule } from 'src/gateway/gateway.module';
import { ConnectionService } from 'src/connection/connection.service';
import { ConnectionModule } from 'src/connection/connection.module';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    // DynamoDBModule,
    GatewayModule,
    ConnectionModule

  ],
  controllers: [ProcessController],
  providers: [ProcessService],
})
export class ProcessModule {}
