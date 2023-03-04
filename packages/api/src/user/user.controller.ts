import {
  Body,
  Controller,
  Param,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  CreateUserRequest,
  RegisterRequest,
  RequestPasswordResetRequest,
  ResetPasswordRequest,
} from '@pcpartdb/shared';
import { GuestGuard } from '../auth/guest.guard';
import { StaffGuard } from '../auth/staff.guard';
import { ApiRequest } from '../shared/http';
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
  constructor(private userService: UserService) {}

  @Post()
  @UseGuards(StaffGuard)
  async create(@Body() body: CreateUserRequest, @Req() req: ApiRequest) {
    const ctx = req.context;
    validate(body, createUserRequestValidator);
    return await this.userService.create(body, ctx);
  }

  @Put(':id')
  @UseGuards(StaffGuard)
  async update(
    @Param('id') idStr: string,
    @Body() body: CreateUserRequest,
    @Req() request: ApiRequest,
  ) {
    const id = Number(idStr);
    const ctx = request.context;

    validate(body, updateUserRequestValidator);
    return await this.userService.update(id, body, ctx);
  }

  @Post('register')
  @UseGuards(GuestGuard)
  async register(@Body() body: RegisterRequest, @Req() request: ApiRequest) {
    const ctx = request.context;
    validate(body, registerRequestValidator);
    return await this.userService.create({ ...body, isStaff: false }, ctx);
  }

  @Post('request-password-reset')
  @UseGuards(GuestGuard)
  async requestPasswordReset(
    @Body() body: RequestPasswordResetRequest,
    @Req() req: ApiRequest,
  ) {
    const ctx = req.context;
    validate(body, requestPasswordResetRequestValidator);
    return await this.userService.requestPasswordReset(body, ctx);
  }

  @Post('reset-password')
  @UseGuards(GuestGuard)
  async resetPassword(
    @Body() body: ResetPasswordRequest,
    @Req() req: ApiRequest,
  ) {
    const ctx = req.context;
    validate(body, resetPasswordRequestValidator);
    return await this.userService.resetPassword(body, ctx);
  }
}
