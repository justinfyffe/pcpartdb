import { Injectable, NestMiddleware } from '@nestjs/common';
import express from 'express';
import { AccessTokenRepository } from '../auth/access-token.repository';
import { CookieService } from '../shared/cookie/cookie.service';
import { SESSION_COOKIE } from '../shared/cookie/cookies';
import { hashToken } from '../shared/crypto/crypto.utils';
import { UserModel } from './user.model';

@Injectable()
export class UserMiddleware implements NestMiddleware {
  constructor(
    private cookies: CookieService,
    private accessTokenRepository: AccessTokenRepository,
  ) {}

  async use(
    request: express.Request & { token: string; user: UserModel },
    _response: express.Response,
    next: (error?: Error) => void,
  ) {
    await this.parseRequest(request);
    next();
  }

  private async parseRequest(
    request: express.Request & { token: string; user: UserModel },
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
