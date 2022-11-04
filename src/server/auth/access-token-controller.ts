import { ApiContext } from '@server/shared/api/context';
import {
  controller,
  guestController,
  userController,
} from '@server/shared/api/controller';
import { serialize } from '@server/shared/types/serialize';
import type { AccessToken, LoginRequest } from '@shared/auth';
import { accessTokenService } from './access-token-service';

export const checkAuthentication = controller((ctx: ApiContext) => {
  return ctx.user ? ({ user: serialize(ctx.user) } as AccessToken) : {};
});

export const login = guestController(async (ctx: ApiContext) => {
  const body: LoginRequest = ctx.req.body;
  await accessTokenService.login(body, ctx);
});

export const logout = userController(async (ctx: ApiContext) => {
  await accessTokenService.logout(ctx.user, ctx);
});
