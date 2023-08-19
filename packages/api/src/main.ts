import * as dotenv from 'dotenv';
dotenv.config();

import { NestFactory } from '@nestjs/core';
import bodyParser from 'body-parser';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import { AppModule } from './app.module';
import { Database } from './database';
import { AllExceptionsFilter } from './shared/error';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(cookieParser());
  app.use(compression());

  app.use(bodyParser.json({ limit: '1mb' }));

  const database = app.get(Database);
  await database.enableShutdownHooks(app);

  app.useGlobalFilters(new AllExceptionsFilter());
  app.setGlobalPrefix('/api');

  await app.listen(process.env.API_PORT);
  console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
