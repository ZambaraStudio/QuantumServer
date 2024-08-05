import { Injectable } from '@nestjs/common';
import { Interval } from '@nestjs/schedule';
import { DynamoDBService } from 'src/dynamodb/dynamodb.service';
import { Gateway } from './gateway';

@Injectable()
export class GatewayService {
  constructor(private gateway: Gateway) {}

  sendToeveryone(): void {
    this.gateway.emitThingToEveryone();
  }
}
