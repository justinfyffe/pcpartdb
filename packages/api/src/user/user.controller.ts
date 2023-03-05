import { Body, Controller, Param, Post, Put, UseGuards } from '@nestjs/common';
import {
  CreateUserRequest,
  RegisterRequest,
  RequestPasswordResetRequest,
  ResetPasswordRequest,
} from '@pcpartdb/shared';
import { GuestGuard } from '../auth/guest.guard';
import { StaffGuard } from '../auth/staff.guard';
import { Database } from '../database';
import { Context, Ctx } from '../shared/context';
import { validate } from '../shared/types/validate';
import { UserService } from './user.service';
import {
  createUserRequestValidator,
  registerRequestValidator,
  requestPasswordResetRequestValidator,
  resetPasswordRequestValidator,
  updateUserRequestValidator,
} from './user.validators';

@Controller('users')
export class UserController {
  constructor(private db: Database, private userService: UserService) {}

  @Post()
  @UseGuards(StaffGuard)
  async create(@Body() body: CreateUserRequest, @Ctx() ctx: Context) {
    return await this.db.transaction(
      async () => {
        validate(body, createUserRequestValidator);
        return await this.userService.create(body, ctx);
      },
      { ctx },
    );
  }

  @Put(':id')
  @UseGuards(StaffGuard)
  async update(
    @Param('id') idStr: string,
    @Body() body: CreateUserRequest,
    @Ctx() ctx: Context,
  ) {
    return await this.db.transaction(
      async () => {
        const id = Number(idStr);

        validate(body, updateUserRequestValidator);
        return await this.userService.update(id, body, ctx);
      },
      { ctx },
    );
  }

  @Post('register')
  @UseGuards(GuestGuard)
  async register(@Body() body: RegisterRequest, @Ctx() ctx: Context) {
    return await this.db.transaction(
      async () => {
        validate(body, registerRequestValidator);
        return await this.userService.create({ ...body, isStaff: false }, ctx);
      },
      { ctx },
    );
  }

  @Post('request-password-reset')
  @UseGuards(GuestGuard)
  async requestPasswordReset(
    @Body() body: RequestPasswordResetRequest,
    @Ctx() ctx: Context,
  ) {
    return await this.db.transaction(
      async () => {
        validate(body, requestPasswordResetRequestValidator);
        return await this.userService.requestPasswordReset(body, ctx);
      },
      { ctx },
    );
  }

  @Post('reset-password')
  @UseGuards(GuestGuard)
  async resetPassword(@Body() body: ResetPasswordRequest, @Ctx() ctx: Context) {
    return await this.db.transaction(
      async () => {
        validate(body, resetPasswordRequestValidator);
        return await this.userService.resetPassword(body, ctx);
      },
      { ctx },
    );
  }
}
