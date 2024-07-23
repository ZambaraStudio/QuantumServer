import { Server, Socket } from 'socket.io';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,  
} from '@nestjs/websockets';



class ClientConnection {
  socketId: string;
  socket: Socket;
  playerId?: string;
}





@WebSocketGateway({ namespace: 'gateway', cors: true })
export class Gateway implements OnGatewayConnection, OnGatewayDisconnect {
  
  private clientConnections: Map<string, ClientConnection> = new Map();

  @WebSocketServer()
  private server: Server;


  constructor() {

  //   const a = this.server.sockets.sockets.get("asdasd")
  //   const b : ClientConnection = {
  //     socketConnection: a
  //   }
   }
  handleDisconnect(socket: Socket) {
    const cliuentConnection = this.clientConnections.get(socket.id)
    this.clientConnections.delete(cliuentConnection.socketId);
    this.emitThingToEveryone();
  }

  handleConnection(socket: Socket) {
    this.clientConnections.set(socket.id, {
      socket,
      socketId: socket.id
    });
    this.emitThingToEveryone();
  }

  emitThingToEveryone() {


    this.server.emit("connected-players", Array.from(this.clientConnections).length);
  }


  @SubscribeMessage('auth')
  private async onContainerRequest(socket: Socket, userAuthToken: string) {
    const existingClientConnection = this.clientConnections.get(socket.id);
    if(!existingClientConnection){
      return "Not Authorized"
    }


    const connectionsArray = Array.from(this.clientConnections);
    existingClientConnection.playerId = userAuthToken;
    connectionsArray.forEach(([id, clientConnection]) => {
      if(existingClientConnection.playerId == clientConnection.playerId && clientConnection.socketId!=existingClientConnection.socketId){
        clientConnection.socket.disconnect();
      }

    })

    return "Authorized"
  }

  @SubscribeMessage('get-auth')
  private async getAuthentication(socket: Socket, userAuthToken: string) {
    // const existingPlayerConnection1 = this.playerConnections.get(userAuthToken);
    const connectionsArray = Array.from(this.clientConnections);
    const existingPlayerConnection = connectionsArray.find(([id, clientConnection]) => {
      return clientConnection.playerId == userAuthToken
    })

    const existingClientConnection1 = this.clientConnections.get(userAuthToken);

    if(existingPlayerConnection){
      // connectionsArray.forEach(([id, clientConnection]) => {
      //   if(existingClientConnection1.playerId == clientConnection.playerId && clientConnection.socketId!=existingClientConnection1.socketId){
      //     clientConnection.socket.disconnect();
      //   }
  
      // })
      return "Authorized";

    }
    
    // return "Not Authorized"
  }


  @SubscribeMessage('super-message')
  private async onSuperMessage(client: any, message: string) {
    console.log(message)

    return "Jigari xar!";
    // this.logger.log(`Message received from client id: ${client.id}`);

    // return {
    //   event: 'container-deployed',
    //   data: containerTask,
    // };
  }
}