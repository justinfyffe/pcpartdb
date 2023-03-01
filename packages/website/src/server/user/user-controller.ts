import { ApiContext } from '@pcpartdb/website/server/shared/api/context';
import {
  guestController,
  staffController,
} from '@pcpartdb/website/server/shared/api/controller';
import { validate } from '@pcpartdb/website/server/shared/types/validate';
import type {
  CreateUserRequest,
  RegisterRequest,
  RequestPasswordResetRequest,
  ResetPasswordRequest,
  UpdateUserRequest,
} from '@pcpartdb/website/shared/user';
import { userService } from './user-service';
import {
  createUserRequestValidator,
  registerRequestValidator,
  requestPasswordResetRequestValidator,
  resetPasswordRequestValidator,
  updateUserRequestValidator,
} from './user-validators';

export const createUser = staffController(async (ctx: ApiContext) => {
  const body = ctx.req.body as CreateUserRequest;
  validate(body, createUserRequestValidator);
  return await userService.create(body, ctx);
});

export const updateUser = staffController(async (ctx: ApiContext) => {
  const id = Number(ctx.req.query['id'] as string);
  const body = ctx.req.body as UpdateUserRequest;
  validate(body, updateUserRequestValidator);
  return await userService.update(id, body, ctx);
});

export const registerUser = guestController(async (ctx: ApiContext) => {
  const body = ctx.req.body as RegisterRequest;
  validate(body, registerRequestValidator);
  return await userService.create({ ...body, isStaff: false }, ctx);
});

export const requestPasswordReset = guestController(async (ctx: ApiContext) => {
  const body = ctx.req.body as RequestPasswordResetRequest;
  validate(body, requestPasswordResetRequestValidator);
  await userService.requestPasswordReset(body, ctx);
});

export const resetPassword = guestController(async (ctx: ApiContext) => {
  const body = ctx.req.body as ResetPasswordRequest;
  validate(body, resetPasswordRequestValidator);
  await userService.resetPassword(body, ctx);
});
