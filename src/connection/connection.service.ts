import { Socket } from 'socket.io';
import { Injectable } from '@nestjs/common';
import {
  PlayerData,
  PlayerSystemData,
  SocketConnection,
} from './connection.types';

@Injectable()
export class ConnectionService {
  private socketConnections: Map<string, SocketConnection> = new Map();
  private playersData: Map<string, PlayerSystemData> = new Map();

  constructor() {}

  private async addSocketConnection(
    socket: Socket,
    playerData: PlayerSystemData,
  ) {
    const newSocketConnection = {
      socket,
      socketId: socket.id,
      playerData,
    };

    this.socketConnections.set(socket.id, newSocketConnection);
    return newSocketConnection;
  }

  async getSocketConnection(socketId: string) {
    return this.socketConnections.get(socketId);
  }
  async getPlayerDataBySocketId(socketId: string) {
    const socket = await this.getSocketConnection(socketId);
    if (!socket) {
      return null;
    }
    return this.playersData.get(socket.playerData.playerId);
  }
  async getPlayerData(playerId: string) {
    return this.playersData.get(playerId);
  }

  async addPlayerDataToSocketConnection(
    socket: Socket,
    playerData: PlayerData,
  ) {
    const existingPlayer = await this.getPlayerData(playerData.playerId);

    const newSocketConnection = await this.addSocketConnection(
      socket,
      existingPlayer || { ...playerData, socketConnections: new Map() },
    );

    newSocketConnection.playerData.socketConnections.set(
      newSocketConnection.socketId,
      newSocketConnection,
    );

    this.playersData.set(
      newSocketConnection.playerData.playerId,
      newSocketConnection.playerData,
    );
  }

  async getSocketConnectionsByPlayerId(playerId: string) {
    const playerData = await this.getPlayerData(playerId);
    return playerData.socketConnections;
  }

  async removeSocketConnection(socketId: string) {
    const socketConnection = await this.getSocketConnection(socketId);
    if (!socketConnection) {
      return;
    }
    this.socketConnections.delete(socketId);
    if (socketConnection.playerData) {
      socketConnection.playerData.socketConnections.delete(socketId);
    }
  }

  async disconnectPlayer(playerId: string) {
    const socketConnection = await this.playersData.delete(playerId);
    if (!socketConnection) {
      return;
    }
  }

  async getSocketCount() {
    return this.socketConnections.size;
  }

  async getPlayerCount() {
    return this.playersData.size;
  }
}
