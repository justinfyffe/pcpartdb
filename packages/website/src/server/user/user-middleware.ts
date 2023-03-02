import { accessTokenRepository } from '@pcpartdb/database';
import { ApiContext } from '@pcpartdb/website/server/shared/api/context';
import { cookieService } from '@pcpartdb/website/server/shared/cookie/cookie-service';
import { SESSION_COOKIE } from '@pcpartdb/website/server/shared/cookie/cookies';
import { hashToken } from '@pcpartdb/website/server/shared/crypto/crypto-utils';
import { SsrContext } from '@pcpartdb/website/server/shared/ssr/context';
import { mapToUserDto } from './user-mappers';

export async function userMiddleware(ctx: ApiContext | SsrContext) {
  const token = cookieService.get(SESSION_COOKIE, ctx) as string;
  if (token == null) {
    ctx.token = null;
    ctx.user = null;
    return;
  }

  const accessToken = await accessTokenRepository.findByTokenHash(
    hashToken(token),
  );

  ctx.token = accessToken ? token : null;
  ctx.user = accessToken ? mapToUserDto(accessToken.user) : null;
}
