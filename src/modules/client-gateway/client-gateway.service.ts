import { Injectable } from '@nestjs/common';
import { ConnectionHandler } from 'src/common/connection-handler/connection-handler';
import { PlayerData } from 'aws-sdk/clients/gamelift';

@Injectable()
export class ClientGatewayService {
  public connectionHandler: ConnectionHandler<PlayerData>;

  constructor() {
    console.log('OPANAAAA');
    this.connectionHandler = new ConnectionHandler<PlayerData>();
  }
}
