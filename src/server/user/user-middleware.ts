import { Injectable, NestMiddleware } from '@nestjs/common';
import { AccessTokenRepository } from '@server/auth/access-token-repository';
import { CookieService } from '@server/shared/cookie/cookie-service';
import { SESSION_COOKIE } from '@server/shared/cookie/cookies';
import { hashToken } from '@server/shared/crypto/crypto-utils';
import type { Request, Response } from 'express';
import { UserModel } from './user-model';

@Injectable()
export class UserMiddleware implements NestMiddleware {
  constructor(
    private cookies: CookieService,
    private accessTokenRepository: AccessTokenRepository,
  ) {}

  async use(
    request: Request & { token: string; user: UserModel },
    _response: Response,
    next: (error?: Error) => void,
  ) {
    await this.parseRequest(request);
    next();
  }

  private async parseRequest(
    request: Request & { token: string; user: UserModel },
  ) {
    const token = this.cookies.get(request, SESSION_COOKIE);
    if (!token) {
      return;
    }

    const accessToken = await this.accessTokenRepository.findByTokenHash(
      hashToken(token),
    );

    request.token = accessToken ? token : null;
    request.user = accessToken ? accessToken.user : null;
  }
}
