import { PlayerData } from 'src/modules/player-gateway/types/player.types';

export type GameServerConfig = {
  id: string;
  secret: string;
  playerList: Map<string, PlayerData>;
};

export const GameServerStatus = {
  INITIALIZED: 'INITIALIZED',
  STARTING: 'STARTING',
  STARTED: 'STARTED',
  STARTED_CONNECTED: 'STARTED_CONNECTED',
  STARTED_DISCONNECTED: 'STARTED_DISCONNECTED',
  CRASHED: 'CRASHED',
  SHUTDOWN: 'SHUTDOWN',
} as const;

export type GameServerStatusType =
  (typeof GameServerStatus)[keyof typeof GameServerStatus];
