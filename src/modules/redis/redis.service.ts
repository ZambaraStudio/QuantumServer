import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { createClient, RedisClientType } from 'redis';
import { getPlayerMessageChannelKey } from 'src/common/access-patterns/access-patterns';
import { ConfigService } from 'src/modules/config/config.service';

@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
  public client: RedisClientType;

  public playerConnections: Map<string, RedisClientType> = new Map();

  constructor(private readonly configService: ConfigService) {
    const redisConfig = configService.config.redis;
    const redisUrl =
      redisConfig.redisHost && redisConfig.redisPort
        ? `redis://${redisConfig.redisHost}:${redisConfig.redisPort}`
        : undefined;

    this.client = createClient({
      url: redisUrl || 'redis://localhost:6379',
    });
  }
  getClient = () => this.client;

  async addPlayerSubscriptionIfNotExists(
    playerId: string,
    callback: (message: string) => void,
  ) {
    if (!this.playerConnections.has(playerId)) {
      const newClient = this.client.duplicate();
      await newClient.connect();
      this.playerConnections.set(playerId, newClient);
      await newClient.subscribe(getPlayerMessageChannelKey(playerId), callback);
    }
    return this.playerConnections.get(playerId);
  }
  destroyPlayerSubscription(playerId: string) {
    const connection = this.playerConnections.get(playerId);
    connection.disconnect();
    this.playerConnections.delete(playerId);
  }

  async onModuleInit() {
    await this.client.connect();
  }

  async onModuleDestroy() {
    await this.client.disconnect();
  }
}
