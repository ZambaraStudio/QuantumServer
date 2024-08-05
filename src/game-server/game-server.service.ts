import { Injectable, OnModuleInit } from '@nestjs/common';
import { GameServerConfig, GameServerStatus } from './game-server.types';
import { GameServer } from './game-server';
import { PlayerData } from 'src/connection/connection.types';
import { ConnectionService } from 'src/connection/connection.service';

const serverListConst: Map<string, GameServerConfig> = new Map([
  [
    'server-1-uuid',
    {
      playerList: new Map<string, PlayerData>([
        [
          '1111',
          {
            playerId: '1111',
          },
        ],
        [
          '2222',
          {
            playerId: '2222',
          },
        ],
      ]),
      port: 3010,
      id: 'server-1-uuid',
      secret: 'server-1-secret',
    },
  ],
  [
    'server-2-uuid',
    {
      playerList: new Map<string, PlayerData>([
        [
          '3333',
          {
            playerId: '3333',
          },
        ],
        [
          '4444',
          {
            playerId: '4444',
          },
        ],
      ]),
      port: 3011,
      id: 'server-2-uuid',
      secret: 'server-2-secret',
    },
  ],
]);

@Injectable()
export class GameServerService implements OnModuleInit {
  public gameServerList: Map<string, GameServer> = new Map();
  public gameServerConfigList: Map<string, GameServerConfig> = serverListConst;

  constructor(private connectionService: ConnectionService) {}

  onModuleInit() {
    this.gameServerConfigList.forEach((gameServerConfig) => {
      const gameServer = new GameServer({
        config: gameServerConfig,
        onGenericMessage: (asd) => {
          console.log(asd, 111111);
        },
        onServerConnected: () => {
          console.log('CONNECTED!');
        },
        onServerCrash: () => {},
        onServerDisconnected: () => {},
        onServerDown: () => {
          this.gameServerList.delete(gameServerConfig.id);
        },
        onServerStart: () => {},
        onSystemMessage: (asd) => {
          console.log(asd);
        },
      });

      this.gameServerList.set(gameServerConfig.id, gameServer);
      gameServer.startServer();
      gameServer.connectToServer();
    });
  }

  getUserServerConfig(userId: string) {
    return Array.from(this.gameServerConfigList).find(([, config]) => {
      return config.playerList.has(userId);
    });
  }
  getUserServer(userId: string) {
    return Array.from(this.gameServerList).find(([, gameServer]) => {
      return gameServer.config.playerList.has(userId);
    })?.[1];
  }


  //TODO: remove if not needed.
  // when removing this also need to remove the controller completely
  // and the call from the sdk
  connectToGameServer(gameServerId: string, gameServerSecret: string) {
    const gameServer = this.gameServerList.get(gameServerId);
    console.log(
      gameServerId,
      gameServer?.status,
      'STATUUUS',
      gameServerSecret,
      gameServer.config.secret,
      gameServer?.status === GameServerStatus.STARTING &&
        gameServerSecret == gameServer.config.secret,
    );
    if (
      gameServer?.status === GameServerStatus.STARTING &&
      gameServerSecret == gameServer.config.secret
    ) {
      // gameServer.connectToServer();
    }
  }
}
