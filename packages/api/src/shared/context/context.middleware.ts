import { Injectable, NestMiddleware } from '@nestjs/common';
import { Config, User } from '@pcpartdb/shared';
import { NextFunction } from 'express';
import { AccessTokenRepository } from '../../auth/access-token.repository';
import { mapToUserDto } from '../../user/user.mapper';
import { CookieService, SESSION_COOKIE } from '../cookie';
import { hashToken } from '../crypto';
import { ApiRequest, ApiResponse } from '../http';

@Injectable()
export class ContextMiddleware implements NestMiddleware {
  constructor(
    private accessTokenRepository: AccessTokenRepository,
    private cookies: CookieService,
  ) {}

  async use(req: ApiRequest, res: ApiResponse, next: NextFunction) {
    const { user, token } = await this.getUser(req);

    const config: Config = {
      enableGoogleAnalytics: process.env.ENABLE_GOOGLE_ANALYTICS === 'true',
      googleAnalyticsId: process.env.GOOGLE_ANALYTICS_ID,
      isStaff: user?.isStaff ?? false,
      user,
    };

    req.context = {
      req,
      res,
      user,
      token,
      config,
    };

    next();
  }

  private async getUser(
    request: ApiRequest,
  ): Promise<{ user: User; token: string }> {
    const token = this.cookies.get(request, SESSION_COOKIE);
    if (token == null) {
      return { user: null, token: null };
    }

    const accessToken = await this.accessTokenRepository.findByTokenHash(
      hashToken(token),
    );

    return {
      user: accessToken ? mapToUserDto(accessToken.user) : null,
      token: null,
    };
  }
}
