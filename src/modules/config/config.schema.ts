export interface AppConfig {
  apiPort: number;
  redis: {
    redisHost: string;
    redisPort: number;
  };
}
