import { Socket } from 'socket.io';
import {
  ConnectedEntityData,
  ConnectedEntitySystemData,
  SocketConnection,
} from './connection.types';

export class ConnectionHandler<T> {
  private entitySocketConnections: Map<string, SocketConnection<T>>;
  private entities: Map<string, ConnectedEntitySystemData<T>> = new Map();

  constructor() {
    this.entitySocketConnections = new Map();
    this.entities = new Map();
  }

  private async addSocketConnection(
    socket: Socket,
    entityData: ConnectedEntitySystemData<T>,
  ) {
    const newSocketConnection = {
      socket,
      socketId: socket.id,
      entityData,
    };

    this.entitySocketConnections.set(socket.id, newSocketConnection);
    return newSocketConnection;
  }

  async getSocketConnection(socketId: string) {
    return this.entitySocketConnections.get(socketId);
  }
  async getEntityDataBySocketId(socketId: string) {
    const socket = await this.getSocketConnection(socketId);
    if (!socket) {
      return null;
    }
    return this.entities.get(socket.entityData.id);
  }
  async getEntityData(entityId: string) {
    return this.entities.get(entityId);
  }

  async addEntityDataToSocketConnection(
    socket: Socket,
    entityData: ConnectedEntityData<T>,
  ) {
    const existingEntity = await this.getEntityData(entityData.id);

    const newSocketConnection = await this.addSocketConnection(
      socket,
      existingEntity || { ...entityData, socketConnections: new Map() },
    );

    newSocketConnection.entityData.socketConnections.set(
      newSocketConnection.socketId,
      newSocketConnection,
    );

    this.entities.set(
      newSocketConnection.entityData.id,
      newSocketConnection.entityData,
    );
  }

  async getSocketConnectionsByEntityId(
    entityId: string,
  ): Promise<SocketConnection<T>[]> {
    const entityData = await this.getEntityData(entityId);
    return Array.from(entityData.socketConnections).map((data) => data[1]);
  }
  async getSocketConnectionsByEntityIds(
    entityIds: string[],
  ): Promise<SocketConnection<T>[]> {
    const connections: SocketConnection<T>[] = [];
    for (const entityId of entityIds) {
      const entityConnections =
        await this.getSocketConnectionsByEntityId(entityId);
      connections.push(...entityConnections);
    }
    return connections;
  }

  async removeSocketConnection(socketId: string) {
    const socketConnection = await this.getSocketConnection(socketId);
    if (!socketConnection) {
      return;
    }
    this.entitySocketConnections.delete(socketId);
    if (socketConnection.entityData) {
      socketConnection.entityData.socketConnections.delete(socketId);
    }
  }

  async disconnectEntity(entityId: string) {
    const socketConnection = await this.entities.delete(entityId);
    if (!socketConnection) {
      return;
    }
  }

  async getSocketCount() {
    return this.entitySocketConnections.size;
  }

  async getEntityCount() {
    return this.entities.size;
  }
}
