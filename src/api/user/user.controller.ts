import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Res,
  UseGuards,
} from '@nestjs/common';
import type { Response } from 'express';
import type {
  RegisterRequest,
  RequestPasswordResetRequest,
  ResetPasswordRequest,
  UserRequest,
  UserResponse,
  UsersResponse,
} from '../../types/user';
import { StaffGuard } from '../auth/staff.guard';
import { transaction } from '../db/database';
import { normalize } from '../shared/types/normalize';
import { UserService } from './user.service';

@Controller('users')
export class UserController {
  constructor(private service: UserService) {}

  @Get()
  @UseGuards(StaffGuard)
  async list() {
    return normalize(
      await transaction((trx) => this.service.list({ trx })),
    ) as UsersResponse;
  }

  @Get(':id')
  @UseGuards(StaffGuard)
  async get(@Param('id') id: number) {
    return normalize(
      await transaction((trx) => this.service.get(id, { trx })),
    ) as UserResponse;
  }

  @Post()
  @UseGuards(StaffGuard)
  async create(@Body() body: UserRequest) {
    return normalize(
      await transaction((trx) => this.service.create(body, { trx })),
    ) as UserResponse;
  }

  @Put(':id')
  @UseGuards(StaffGuard)
  async update(@Param('id') id: number, @Body() body: UserRequest) {
    return normalize(
      await transaction((trx) => this.service.update(id, body, { trx })),
    ) as UserResponse;
  }

  @Post('register')
  async register(@Body() body: RegisterRequest) {
    return normalize(
      await transaction((trx) =>
        this.service.create({ ...body, isStaff: false }, { trx }),
      ),
    ) as UserResponse;
  }

  @Post('request-password-reset')
  async requestPasswordReset(
    @Body() body: RequestPasswordResetRequest,
    @Res() response: Response,
  ) {
    await transaction(async (trx) => {
      await this.service.requestPasswordReset(body, { trx });
    });

    response.status(204).send({});
  }

  @Post('reset-password')
  async resetPassword(
    @Body() body: ResetPasswordRequest,
    @Res() response: Response,
  ) {
    await transaction(async (trx) => {
      await this.service.resetPassword(body, { trx });

      response.status(204).send({});
    });
  }
}
