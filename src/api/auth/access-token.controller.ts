import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import express from 'express';
import * as auth from '../../types/auth';
import { User } from '../../types/user';
import { transaction } from '../db/database';
import { AccessTokenService } from './access-token.service';
import { UserGuard } from './user.guard';

@Controller('access-tokens')
export class AccessTokenController {
  constructor(private service: AccessTokenService) {}

  @Get()
  async checkAuthentication(
    @Req() request: express.Request & { token?: string; user: User },
    @Res() response: express.Response,
  ) {
    if (request.token && request.user) {
      response.status(HttpStatus.OK).send({
        token: request.token,
        user: request.user,
      } as auth.AccessToken);
    } else {
      response.status(HttpStatus.OK).send({});
    }
  }

  @Post()
  async login(
    @Body() body: auth.LoginFormData,
    @Res() response: express.Response,
  ) {
    await transaction(async (db) => {
      const token = await this.service.login(body, { db, response });
      response.status(HttpStatus.OK).send(token);
    });
  }

  @Delete()
  @UseGuards(UserGuard)
  async logout(
    @Req() request: express.Request & { user: User },
    @Res() response: express.Response,
  ) {
    await transaction((db) =>
      this.service.logout(request.user, { db, request, response }),
    );
    response.status(204).send({});
  }
}
