import { forbiddenError, unauthorizedError } from '@server/shared/api/status';
import { Context } from '@server/shared/context';
import { cookieService } from '@server/shared/cookie/cookie-service';
import { SESSION_COOKIE } from '@server/shared/cookie/cookies';
import { generateToken, hashToken } from '@server/shared/crypto/crypto-utils';
import { UserModel } from '@server/user/user-model';
import { userRepository } from '@server/user/user-repository';
import { AccessToken, LoginRequest } from '@shared/auth';
import * as bcrypt from 'bcryptjs';
import { accessTokenRepository } from './access-token-repository';

const SESSION_EXPIRES = 1000 * 60 * 60 * 24; // 1 day
const COOKIE_EXPIRES = 1000 * 60 * 60 * 24 * 30; // 30 days

export class AccessTokenService {
  async login(data: LoginRequest, ctx: Context) {
    const user = await userRepository.findByEmail(data.email, ctx);
    if (!(user && (await bcrypt.compare(data.password, user.passwordHash)))) {
      throw forbiddenError();
    }

    const token = generateToken();
    const expiresAt = new Date(
      Date.now() + (data.remember ? COOKIE_EXPIRES : SESSION_EXPIRES),
    );

    await accessTokenRepository.save(
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
      {
        expires: data.remember ? expiresAt.getTime() : undefined,
      },
      ctx,
    );

    return { token, user: user.serialize() } as AccessToken;
  }

  async logout(user: UserModel, ctx: Context) {
    const hash = hashToken(ctx.token);
    const entity = await accessTokenRepository.findByTokenHash(hash, ctx);
    if (entity == null || entity.user.id !== user.id) {
      throw unauthorizedError();
    }

    await accessTokenRepository.delete(entity.id, ctx);
    cookieService.clear(SESSION_COOKIE, ctx);
  }
}

export const accessTokenService = new AccessTokenService();
