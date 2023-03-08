import { Injectable } from '@nestjs/common';
import { LoginRequest } from '@pcpartdb/shared';
import * as bcrypt from 'bcryptjs';
import { Context } from '../shared/context';
import { CookieService, SESSION_COOKIE } from '../shared/cookie';
import { generateToken, hashToken } from '../shared/crypto';
import { forbiddenError, unauthorizedError } from '../shared/error';
import { UserRepository } from '../user/user.repository';
import { mapToAccessTokenDto } from './access-token.mapper';
import { AccessTokenRepository } from './access-token.repository';

const SESSION_EXPIRES = 1000 * 60 * 60 * 24; // 1 day
const COOKIE_EXPIRES = 1000 * 60 * 60 * 24 * 30; // 30 days

@Injectable()
export class AccessTokenService {
  constructor(
    private accessTokenRepository: AccessTokenRepository,
    private userRepository: UserRepository,
    private cookieService: CookieService,
  ) {}

  async login(data: LoginRequest, ctx: Context) {
    const user = await this.userRepository.findByEmail(data.email, ctx);
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

    await this.accessTokenRepository.create(
      {
        userId: user.id,
        tokenHash: hashToken(token),
        expiresAt,
      },
      ctx,
    );
    this.cookieService.save(
      SESSION_COOKIE,
      token,
      { expires: data.remember ? expiresAt.getTime() : undefined },
      ctx,
    );

    return mapToAccessTokenDto(token, user);
  }

  async logout(ctx: Context) {
    const hash = hashToken(ctx.token);
    const entity = await this.accessTokenRepository.findByTokenHash(hash, ctx);
    if (entity == null || entity.userId !== ctx.user?.id) {
      throw unauthorizedError();
    }

    await this.accessTokenRepository.delete(entity.id, ctx);
    this.cookieService.clear(SESSION_COOKIE, ctx);
  }
}
