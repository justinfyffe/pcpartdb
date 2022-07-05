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
import express from 'express';
import type {
  RequestPasswordResetFormData,
  ResetPasswordFormData,
  UserFormData,
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
  async create(@Body() body: UserFormData) {
    return normalize(
      await transaction((trx) => this.service.create(body, { trx })),
    ) as UserResponse;
  }

  @Put(':id')
  @UseGuards(StaffGuard)
  async update(@Param('id') id: number, @Body() body: UserFormData) {
    return normalize(
      await transaction((trx) => this.service.update(id, body, { trx })),
    ) as UserResponse;
  }

  @Post('request-password-reset')
  async requestPasswordReset(
    @Body() body: RequestPasswordResetFormData,
    @Res() response: express.Response,
  ) {
    await transaction((trx) =>
      this.service.requestPasswordReset(body, { trx }),
    );
    response.status(204).send({});
  }

  @Post('reset-password')
  async resetPassword(
    @Body() body: ResetPasswordFormData,
    @Res() response: express.Response,
  ) {
    await transaction((trx) => this.service.resetPassword(body, { trx }));
    response.status(204).send({});
  }
}
