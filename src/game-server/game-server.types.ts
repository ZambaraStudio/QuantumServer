import { PlayerData } from 'src/connection/connection.types';

export type GameServerConfig = {
  id: string;
  port: number;
  secret: string;
  playerList: Map<string, PlayerData>;
};

export enum GameServerStatus {
  INITIALIZED = 'INITIALIZED',
  STARTING = 'STARTING',
  STARTED = 'STARTED',
  STARTED_CONNECTED = 'STARTED_CONNECTED',
  STARTED_DISCONNECTED = 'STARTED_DISCONNECTED',
  CRASHED = 'CRASHED',
  SHUTDOWN = 'SHUTDOWN',
}
