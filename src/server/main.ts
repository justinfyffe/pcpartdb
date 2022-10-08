import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import * as dotenv from 'dotenv';
import * as http from 'http';
import { NextApiHandler } from 'next';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from './shared/errors/error.filter';

dotenv.config();

export class Api {
  static listener: NextApiHandler;

  static async getListener() {
    if (Api.listener == null) {
      const app = await NestFactory.create(AppModule);
      app.setGlobalPrefix('api');
      app.useGlobalFilters(new AllExceptionsFilter());

      await app.init();

      const server: http.Server = app.getHttpServer();
      Api.listener = server.listeners('request')[0] as NextApiHandler;
    }

    return Api.listener;
  }
}
