import { NestFactory } from '@nestjs/core';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import * as dotenv from 'dotenv';
import { AppModule } from './app.module';
import { Database } from './database';
import { AllExceptionsFilter } from './shared/error';

dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(cookieParser());

  // Increase max payload size.
  app.use(bodyParser.json({ limit: '1mb' }));

  const database = app.get(Database);
  await database.enableShutdownHooks(app);

  app.useGlobalFilters(new AllExceptionsFilter());
  app.setGlobalPrefix('/api');

  await app.listen(process.env.API_PORT);
  console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
