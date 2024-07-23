import { Module } from '@nestjs/common';
// import { DynamoDBModule } from './dynamodb/dynamodb.module';
import { ProcessModule } from './process/process.module';
import { GatewayModule } from './gateway/gateway.module';
import { ConnectionModule } from './connection/connection.module';

@Module({
  imports: [
    GatewayModule,
    ProcessModule,
    ConnectionModule
  ],
})
export class MainModule {}
