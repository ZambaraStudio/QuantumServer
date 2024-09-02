import { Inject, Injectable, OnModuleInit, forwardRef } from '@nestjs/common';
import { GameServerConfig, GameServerStatus } from './game-server.types';
import { GameServer } from './game-server';
import { FROM_GS_EVENT_TYPES } from 'src/common/events/game-server.events';
import { PlayerData } from 'src/modules/player-gateway/types/player.types';
import { PlayerGatewayService } from 'src/modules/player-gateway/player-gateway.service';

const serverListConst: Map<string, GameServerConfig> = new Map([
  [
    'server-1-uuid',
    {
      playerList: new Map<string, PlayerData>([
        [
          '1111',
          {
            id: '1111',
            name: '1111 name',
          },
        ],
        [
          '2222',
          {
            id: '2222',
            name: '2222 name',
          },
        ],
      ]),
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
            id: '3333',
            name: '3333 name',
          },
        ],
        [
          '4444',
          {
            id: '4444',
            name: '4444 name',
          },
        ],
      ]),
      id: 'server-2-uuid',
      secret: 'server-2-secret',
    },
  ],
]);

@Injectable()
export class GameServerService implements OnModuleInit {
  public gameServerList: Map<string, GameServer> = new Map();
  public gameServerConfigList: Map<string, GameServerConfig> = serverListConst;

  constructor(
    @Inject(forwardRef(() => PlayerGatewayService))
    private readonly playerGatewayService: PlayerGatewayService,
  ) {}

  onModuleInit() {
    this.gameServerConfigList.forEach((gameServerConfig) => {
      const gameServer = new GameServer({
        config: gameServerConfig,
      });

      gameServer.fromGSEvents.on(
        FROM_GS_EVENT_TYPES.GENERIC_MESSAGE,
        (message) => {
          const sendToPlayerList = message.playerIds
            ? message.playerIds.filter((playerId) => {
                return gameServer.config.playerList.has(playerId);
              })
            : Array.from(gameServer.config.playerList).map((p) => {
                return p[1].id;
              });

          this.playerGatewayService.sendGenericMessageToPlayers(
            sendToPlayerList,
            message,
          );
        },
      );

      gameServer.fromGSEvents.on(GameServerStatus.STARTED_CONNECTED, () => {
        console.log(`Server ${gameServerConfig.id} Connected!`);
      });
      gameServer.fromGSEvents.on('SHUTDOWN', () => {
        this.gameServerList.delete(gameServerConfig.id);
      });

      this.gameServerList.set(gameServerConfig.id, gameServer);
      gameServer.startServer();
    });
  }

  sendPlayersConnected(players: PlayerData[]) {
    const servers: Map<
      string,
      {
        gameServer: GameServer;
        playerData: PlayerData[];
      }
    > = new Map();
    players.forEach((player) => {
      const server = this.getUserServer(player.id);
      if (!servers.has(server.config.id)) {
        servers.set(server.config.id, {
          gameServer: server,
          playerData: [],
        });
      }
      servers.get(server.config.id).playerData.push(player);
    });

    Array.from(servers).forEach((data) => {
      data[1].gameServer.sendPlayersConnected(data[1].playerData);
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

  getServer(serverId: string) {
    return this.gameServerList.get(serverId);
  }
}
