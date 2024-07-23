import { Server, Socket } from 'socket.io';
import {
  WebSocketServer,  
} from '@nestjs/websockets';
import { Injectable } from '@nestjs/common';



class SocketConnection {
    socketId: string;
    socket: Socket;
    playerId?: string;
  }
  




@Injectable()
export class ConnectionService {
  
  private socketConnections: Map<string, SocketConnection> = new Map();

  @WebSocketServer()
  private server: Server;


  constructor() {

   }


   connectUserToSocket(socket: Socket, userId: string){

    const cliuentConnection = this.socketConnections.get(socket.id)




   }


   countConnectedSockets() {

    this.server.emit("connected-sockets", Array.from(this.socketConnections).length);
  }


}