import { NestFactory } from '@nestjs/core';
import { MainModule } from './main.module';
import { ConfigService } from 'src/modules/config/config.service';

async function bootstrap() {
  const app = await NestFactory.create(MainModule);
  const configService = app.get<ConfigService>(ConfigService);
  app.enableShutdownHooks();
  await app.listen(configService.config.apiPort);
}
bootstrap();
