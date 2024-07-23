import { Injectable } from '@nestjs/common';
import { Interval } from '@nestjs/schedule';
import { ConnectionService } from 'src/connection/connection.service';
// import { DynamoDBService } from 'src/dynamodb/dynamodb.service';
import { GatewayService } from 'src/gateway/gateway.service';

@Injectable()
export class ProcessService {

  constructor(
    // private readonly dynamoDBService: DynamoDBService,
    private readonly gatewayService: GatewayService,
    private readonly connectionService: ConnectionService,
    ){
  }
  
  heartbeat(): string {
    return 'alive!';
  }

  @Interval(5000)
  doStuff(): void {
    //console.log(Date.now(), new Date());
    console.log(this.gatewayService.sendToeveryone(),"LA KUKARACHAAAA");
    // console.log(1111,66611223122);
    //this.dynamoDBService.insertTest();
    

  }

  @Interval(5000)
  testovka(): void {
   
    // console.log(this.connectionService.countConnectedSockets(),"HELLOOO NIKUSHAAA")
    
  }
}
