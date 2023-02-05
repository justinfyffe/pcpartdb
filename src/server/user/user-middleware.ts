import { accessTokenRepository } from '@server/auth/access-token-repository';
import { ApiContext } from '@server/shared/api/context';
import { cookieService } from '@server/shared/cookie/cookie-service';
import { SESSION_COOKIE } from '@server/shared/cookie/cookies';
import { hashToken } from '@server/shared/crypto/crypto-utils';
import { SsrContext } from '@server/shared/ssr/context';
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
  ctx.user = accessToken ? mapToUserDto(accessToken.users) : null;
}
