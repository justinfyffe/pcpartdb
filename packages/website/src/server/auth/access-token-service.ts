import {
  forbiddenError,
  unauthorizedError,
} from '@pcpartdb/website/server/shared/api/status';
import { Context } from '@pcpartdb/website/server/shared/context';
import { cookieService } from '@pcpartdb/website/server/shared/cookie/cookie-service';
import { SESSION_COOKIE } from '@pcpartdb/website/server/shared/cookie/cookies';
import {
  generateToken,
  hashToken,
} from '@pcpartdb/website/server/shared/crypto/crypto-utils';
import { userRepository } from '@pcpartdb/website/server/user/user-repository';
import { LoginRequest } from '@pcpartdb/website/shared/auth';
import * as bcrypt from 'bcryptjs';
import { mapToAccessTokenDto } from './access-token-mappers';
import { accessTokenRepository } from './access-token-repository';

const SESSION_EXPIRES = 1000 * 60 * 60 * 24; // 1 day
const COOKIE_EXPIRES = 1000 * 60 * 60 * 24 * 30; // 30 days

export class AccessTokenService {
  async login(data: LoginRequest, ctx: Context) {
    const user = await userRepository.findByEmail(data.email, ctx);
    if (
      !(
        user != null && (await bcrypt.compare(data.password, user.passwordHash))
      )
    ) {
      throw forbiddenError();
    }

    const token = generateToken();
    const expiresAt = new Date(
      Date.now() + (data.remember ? COOKIE_EXPIRES : SESSION_EXPIRES),
    );

    await accessTokenRepository.create(
      {
        userId: user.id,
        tokenHash: hashToken(token),
        expiresAt,
      },
      ctx,
    );
    cookieService.save(
      SESSION_COOKIE,
      token,
      { expires: data.remember ? expiresAt.getTime() : undefined },
      ctx,
    );

    return mapToAccessTokenDto(token, user);
  }

  async logout(ctx: Context) {
    const hash = hashToken(ctx.token);
    const entity = await accessTokenRepository.findByTokenHash(hash, ctx);
    if (entity == null || entity.userId !== ctx.user?.id) {
      throw unauthorizedError();
    }

    await accessTokenRepository.delete(entity.id, ctx);
    cookieService.clear(SESSION_COOKIE, ctx);
  }
}

export const accessTokenService = new AccessTokenService();
