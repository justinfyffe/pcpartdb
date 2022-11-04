import { ApiContext } from '@server/shared/api/context';
import {
  guestController,
  staffController,
} from '@server/shared/api/controller';
import type {
  RegisterRequest,
  RequestPasswordResetRequest,
  ResetPasswordRequest,
  UserRequest,
} from '@shared/user';
import { userService } from './user-service';

export const listUsers = staffController(async (ctx: ApiContext) => {
  return await userService.list(ctx);
});

export const getUser = staffController(async (ctx: ApiContext) => {
  const id = Number(ctx.req.query['id'] as string);
  return await userService.get(id, ctx);
});

export const createUser = staffController(async (ctx: ApiContext) => {
  const body = ctx.req.body;
  return await userService.create(body, ctx);
});

export const updateUser = staffController(async (ctx: ApiContext) => {
  const id = Number(ctx.req.query['id'] as string);
  const body = ctx.req.body as UserRequest;
  return await userService.update(id, body, ctx);
});

export const registerUser = guestController(async (ctx: ApiContext) => {
  const body = ctx.req.body as RegisterRequest;
  return await userService.create({ ...body, isStaff: false }, ctx);
});

export const requestPasswordReset = guestController(async (ctx: ApiContext) => {
  const body = ctx.req.body as RequestPasswordResetRequest;
  await userService.requestPasswordReset(body, ctx);
});

export const resetPassword = guestController(async (ctx: ApiContext) => {
  const body = ctx.req.body as ResetPasswordRequest;
  await userService.resetPassword(body, ctx);
});
