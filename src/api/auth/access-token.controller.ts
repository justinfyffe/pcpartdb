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
import type { Request, Response } from 'express';
import type { AccessToken, LoginRequest } from '../../types/auth';
import { User } from '../../types/user';
import { transaction } from '../db/database';
import { AccessTokenService } from './access-token.service';
import { UserGuard } from './user.guard';

@Controller('access-tokens')
export class AccessTokenController {
  constructor(private service: AccessTokenService) {}

  @Get()
  async checkAuthentication(
    @Req() request: Request & { token?: string; user: User },
    @Res() response: Response,
  ) {
    if (request.token && request.user) {
      response.status(HttpStatus.OK).send({
        token: request.token,
        user: request.user,
      } as AccessToken);
    } else {
      response.status(HttpStatus.OK).send({});
    }
  }

  @Post()
  async login(@Body() body: LoginRequest, @Res() response: Response) {
    await transaction(async (trx) => {
      const token = await this.service.login(body, { trx, response });

      response.status(HttpStatus.OK).send(token);
    });
  }

  @Delete()
  @UseGuards(UserGuard)
  async logout(
    @Req() request: Request & { user: User },
    @Res() response: Response,
  ) {
    await transaction(async (trx) => {
      await this.service.logout(request.user, {
        trx,
        request,
        response,
      });

      response.status(204).send({});
    });
  }
}
