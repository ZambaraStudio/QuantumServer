import { NestFactory } from '@nestjs/core';
import { MainModule } from './main.module';
import { QS_PORT } from './const';

async function bootstrap() {
  const app = await NestFactory.create(MainModule);
  app.enableShutdownHooks();
  await app.listen(QS_PORT);
}
bootstrap();
