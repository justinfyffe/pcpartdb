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
import { StaffGuard } from '@server/auth/staff-guard';
import { transaction } from '@server/db/database';
import { serializeAsync } from '@server/shared/types/serialize';
import type {
  RegisterRequest,
  RequestPasswordResetRequest,
  ResetPasswordRequest,
  UserRequest,
} from '@shared/user';
import type { Response } from 'express';
import { UserService } from './user-service';

@Controller('users')
export class UserController {
  constructor(private service: UserService) {}

  @Get()
  @UseGuards(StaffGuard)
  list() {
    return transaction((trx) => serializeAsync(this.service.list({ trx })));
  }

  @Get(':id')
  @UseGuards(StaffGuard)
  get(@Param('id') id: number) {
    return transaction((trx) => serializeAsync(this.service.get(id, { trx })));
  }

  @Post()
  @UseGuards(StaffGuard)
  create(@Body() body: UserRequest) {
    return transaction((trx) =>
      serializeAsync(this.service.create(body, { trx })),
    );
  }

  @Put(':id')
  @UseGuards(StaffGuard)
  update(@Param('id') id: number, @Body() body: UserRequest) {
    return transaction((trx) =>
      serializeAsync(this.service.update(id, body, { trx })),
    );
  }

  @Post('register')
  register(@Body() body: RegisterRequest) {
    return transaction((trx) =>
      serializeAsync(this.service.create({ ...body, isStaff: false }, { trx })),
    );
  }

  @Post('request-password-reset')
  requestPasswordReset(
    @Body() body: RequestPasswordResetRequest,
    @Res() response: Response,
  ) {
    return transaction(async (trx) => {
      await this.service.requestPasswordReset(body, { trx });
      response.status(204).send({});
    });
  }

  @Post('reset-password')
  resetPassword(@Body() body: ResetPasswordRequest, @Res() response: Response) {
    return transaction(async (trx) => {
      await this.service.resetPassword(body, { trx });
      response.status(204).send({});
    });
  }
}
