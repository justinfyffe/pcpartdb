import { ApiContext } from '@server/shared/api/context';
import {
  guestController,
  staffController,
} from '@server/shared/api/controller';
import { validate } from '@server/shared/types/validate';
import type {
  RegisterRequest,
  RequestPasswordResetRequest,
  ResetPasswordRequest,
  UserRequest,
} from '@shared/user';
import { userService } from './user-service';
import {
  createUserRequestValidator,
  registerRequestValidator,
  requestPasswordResetRequestValidator,
  resetPasswordRequestValidator,
  updateUserRequestValidator,
} from './user-validators';

export const createUser = staffController(async (ctx: ApiContext) => {
  const body = ctx.req.body as UserRequest;
  validate(body, createUserRequestValidator);
  return await userService.create(body, ctx);
});

export const updateUser = staffController(async (ctx: ApiContext) => {
  const id = Number(ctx.req.query['id'] as string);
  const body = ctx.req.body as UserRequest;
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
