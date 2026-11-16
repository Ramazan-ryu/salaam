import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import type { INestApplication } from '@nestjs/common';
import { AppModule } from './app.module';
import { loadConfig } from './config';
import { loadDotEnv } from './env';

export async function createApp(): Promise<INestApplication> {
  const config = loadConfig();
  // logger: no request logging middleware — headers/queries may carry approximate location.
  const app = await NestFactory.create(AppModule, { logger: ['error', 'warn', 'log'] });
  app.enableCors({ origin: config.CORS_ORIGIN.split(','), credentials: false });
  app.enableShutdownHooks();
  return app;
}

async function bootstrap() {
  loadDotEnv();
  const config = loadConfig();
  const app = await createApp();
  await app.listen(config.API_PORT);
  console.log(`Salaam API listening on :${config.API_PORT}${config.DEV_AUTH ? ' (DEV_AUTH enabled — not for production)' : ''}`);
}

if (require.main === module) {
  bootstrap().catch((err) => {
    console.error(err);
    process.exit(1);
  });
}
