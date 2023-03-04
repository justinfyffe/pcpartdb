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
import { AccessToken, LoginRequest } from '@pcpartdb/shared';
import { ApiRequest, ApiResponse } from '../shared/http';
import { validate } from '../shared/types/validate';
import { AccessTokenService } from './access-token.service';
import { loginRequestValidator } from './access-token.validators';
import { GuestGuard } from './guest.guard';
import { UserGuard } from './user.guard';

@Controller('access-tokens')
export class AccessTokenController {
  constructor(private accessTokenService: AccessTokenService) {}

  @Get()
  async checkAuthentication(
    @Req() request: ApiRequest,
    @Res() response: ApiResponse,
  ) {
    const ctx = request.context;
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
  async login(@Body() body: LoginRequest, @Req() request: ApiRequest) {
    const ctx = request.context;
    validate(body, loginRequestValidator);
    await this.accessTokenService.login(body, ctx);
  }

  @Delete()
  @UseGuards(UserGuard)
  async logout(@Req() request: ApiRequest) {
    const ctx = request.context;
    await this.accessTokenService.logout(ctx);
  }
}
