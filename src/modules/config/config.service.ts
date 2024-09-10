import { Injectable } from '@nestjs/common';
import { AppConfig } from './config.schema';
import * as dotenv from 'dotenv';

@Injectable()
export class ConfigService {
  public readonly config: AppConfig;
  constructor() {
    dotenv.config();
    this.config = this.getConfig();
  }

  private getConfig(): AppConfig {
    return {
      apiPort: parseInt(process.env.API_PORT, 10) || 3000,
      redis: {
        redisHost: process.env.REDIS_HOST || 'localhost',
        redisPort: parseInt(process.env.REDIS_PORT) || 6379,
      },
    };
  }
}
