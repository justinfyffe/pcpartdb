import { ApiContext } from '@server/shared/api/context';
import { guestController, userController } from '@server/shared/api/controller';
import type { LoginRequest } from '@shared/auth';
import { accessTokenService } from './access-token-service';

export const login = guestController(async (ctx: ApiContext) => {
  const body: LoginRequest = ctx.req.body;
  await accessTokenService.login(body, ctx);
});

export const logout = userController(async (ctx: ApiContext) => {
  await accessTokenService.logout(ctx.user, ctx);
});
