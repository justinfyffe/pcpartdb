import Joi from '@hapi/joi';
import { cookieService } from '@server/shared/cookie/cookie-service';
import { SESSION_COOKIE } from '@server/shared/cookie/cookies';
import { generateToken, hashToken } from '@server/shared/crypto/crypto-utils';
import { ServiceContext } from '@server/shared/service/context';
import { validate } from '@server/shared/types/validate';
import { userRepository } from '@server/user/user-repository';
import { AccessToken, LoginRequest } from '@shared/auth';
import { EMAIL_MAX_LENGTH, PASSWORD_MAX_LENGTH, User } from '@shared/user';
import * as bcrypt from 'bcryptjs';
import { forbiddenError, unauthorizedError } from '../shared/errors/errors';
import { accessTokenRepository } from './access-token-repository';

const SESSION_EXPIRES = 1000 * 60 * 60 * 24; // 1 day
const COOKIE_EXPIRES = 1000 * 60 * 60 * 24 * 30; // 30 days

const loginRequestValidator = Joi.object({
  email: Joi.string()
    .email({ tlds: { allow: false } })
    .max(EMAIL_MAX_LENGTH)
    .required(),
  password: Joi.string().max(PASSWORD_MAX_LENGTH).required(),
  remember: Joi.boolean(),
}).options({ abortEarly: false });

export class AccessTokenService {
  async login(data: LoginRequest, ctx: ServiceContext) {
    validate(data, loginRequestValidator);

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

  async logout(user: User, ctx: ServiceContext) {
    const token = cookieService.get(SESSION_COOKIE, ctx) as string;

    const hash = hashToken(token);
    const entity = await accessTokenRepository.findByTokenHash(hash, ctx);
    if (entity == null || entity.user.id !== user.id) {
      throw unauthorizedError();
    }

    await accessTokenRepository.delete(entity.id, ctx);
    cookieService.clear(SESSION_COOKIE, ctx);
  }
}

export const accessTokenService = new AccessTokenService();
