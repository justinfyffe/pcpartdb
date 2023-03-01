import { ApiContext } from '@pcpartdb/website/server/shared/api/context';
import {
  guestController,
  userController,
} from '@pcpartdb/website/server/shared/api/controller';
import { validate } from '@pcpartdb/website/server/shared/types/validate';
import type { LoginRequest } from '@pcpartdb/website/shared/auth';
import { accessTokenService } from './access-token-service';
import { loginRequestValidator } from './access-token-validators';

export const login = guestController(async (ctx: ApiContext) => {
  const body: LoginRequest = ctx.req.body;
  validate(body, loginRequestValidator);
  await accessTokenService.login(body, ctx);
});

export const logout = userController(async (ctx: ApiContext) => {
  await accessTokenService.logout(ctx);
});
