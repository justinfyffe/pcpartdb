import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { AccessToken, LoginFormData, loginValidator } from '../../types/auth';
import { User } from '../../types/user';
import { CookieService } from '../shared/cookie/cookie.service';
import { SESSION_COOKIE } from '../shared/cookie/cookies';
import { generateToken, hashToken } from '../shared/crypto/crypto.utils';
import { forbiddenError, unauthorizedError } from '../shared/errors/errors';
import { ServiceContext } from '../shared/service/context';
import { validate } from '../shared/types/validate';
import { UserRepository } from '../user/user.repository';
import { AccessTokenRepository } from './access-token.repository';

const SESSION_EXPIRES = 1000 * 60 * 60 * 24; // 1 day
const COOKIE_EXPIRES = 1000 * 60 * 60 * 24 * 30; // 30 days

@Injectable()
export class AccessTokenService {
  constructor(
    private cookieService: CookieService,
    private accessTokenRepository: AccessTokenRepository,
    private userRepository: UserRepository,
  ) {}

  async login(formData: LoginFormData, ctx: ServiceContext) {
    validate(formData, loginValidator);

    const user = await this.userRepository.findByEmail(formData.email, ctx);
    if (
      !(user && (await bcrypt.compare(formData.password, user.passwordHash)))
    ) {
      throw forbiddenError();
    }

    const token = generateToken();
    const expiresAt = new Date(
      Date.now() + (formData.remember ? COOKIE_EXPIRES : SESSION_EXPIRES),
    );

    await this.accessTokenRepository.save(
      {
        userId: user.id,
        tokenHash: hashToken(token),
        expiresAt,
      },
      ctx,
    );
    this.cookieService.save(ctx.response, SESSION_COOKIE, token, {
      expires: formData.remember ? expiresAt.getTime() : undefined,
    });

    return { token, user: user.toDto() } as AccessToken;
  }

  async logout(user: User, ctx: ServiceContext) {
    const token = this.cookieService.get(ctx.request, SESSION_COOKIE);

    const hash = hashToken(token);
    const entity = await this.accessTokenRepository.findByTokenHash(hash, ctx);
    if (entity == null || entity.user.id !== user.id) {
      throw unauthorizedError();
    }

    await this.accessTokenRepository.delete(entity.id, ctx);
    this.cookieService.clear(ctx.response, SESSION_COOKIE);
  }
}
