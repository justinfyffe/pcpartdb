import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Post,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AccessToken, LoginRequest } from '@pcpartdb/shared';
import { Database } from '../database';
import { Context, Ctx } from '../shared/context';
import { ApiResponse } from '../shared/http/types';
import { validate } from '../shared/validation/validate';
import { AccessTokenService } from './access-token.service';
import { loginRequestValidator } from './access-token.validators';
import { GuestGuard } from './guest.guard';
import { UserGuard } from './user.guard';

@Controller('access-tokens')
export class AccessTokenController {
  constructor(
    private db: Database,
    private accessTokenService: AccessTokenService,
  ) {}

  @Get()
  async checkAuthentication(@Res() response: ApiResponse, @Ctx() ctx: Context) {
    if (ctx.token && ctx.user) {
      return response.status(HttpStatus.OK).send({
        token: ctx.token,
        user: ctx.user,
      } as AccessToken);
    } else {
      return response.status(HttpStatus.OK).send({});
    }
  }

  @Post()
  @UseGuards(GuestGuard)
  async login(@Body() body: LoginRequest, @Ctx() ctx: Context) {
    return this.db.transaction(
      async () => {
        validate(body, loginRequestValidator);
        await this.accessTokenService.login(body, ctx);
      },
      { ctx },
    );
  }

  @Delete()
  @UseGuards(UserGuard)
  async logout(@Ctx() ctx: Context) {
    return this.db.transaction(
      async () => {
        await this.accessTokenService.logout(ctx);
      },
      { ctx },
    );
  }
}
