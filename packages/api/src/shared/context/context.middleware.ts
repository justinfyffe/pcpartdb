import { Injectable, NestMiddleware } from '@nestjs/common';
import { mapToUserDto } from '@pcpartdb/database';
import { Config, User } from '@pcpartdb/shared';
import { NextFunction } from 'express';
import { AccessTokenRepository } from '../../auth/access-token.repository';
import { ApiKeyRepository } from '../../auth/api-key.repository';
import { CookieService } from '../cookie/cookie.service';
import { COOKIE_CONSENT_COOKIE, SESSION_COOKIE } from '../cookie/cookies';
import { hashToken } from '../crypto/utils';
import { ApiRequest, ApiResponse } from '../http/types';

@Injectable()
export class ContextMiddleware implements NestMiddleware {
  constructor(
    private apiKeyRepository: ApiKeyRepository,
    private accessTokenRepository: AccessTokenRepository,
    private cookies: CookieService,
  ) {}

  async use(req: ApiRequest, res: ApiResponse, next: NextFunction) {
    const { user, token } = await this.getUser(req);

    const config: Config = {
      bingAdsSiteId:
        process.env.ENABLE_ADS === 'true'
          ? process.env.BING_ADS_SITE_ID
          : undefined,
      bingAdsPublisherId:
        process.env.ENABLE_ADS === 'true'
          ? process.env.BING_ADS_PUBLISHER_ID
          : undefined,
      enableClarity: process.env.ENABLE_CLARITY === 'true',
      clarityId: process.env.CLARITY_ID,
      enableGoogleAnalytics: process.env.ENABLE_GOOGLE_ANALYTICS === 'true',
      googleAnalyticsId: process.env.GOOGLE_ANALYTICS_ID,
      isStaff: user?.isStaff ?? false,
      user,
      requireCookieConsent: this.getRequireCookieConsent(req),
      cookieConsent: this.getCookieConsent(req),
      userCountry: this.getUserCountry(req),
    };

    if (user?.isStaff || process.env.ENABLE_ADS !== 'true') {
      config.disableAds = true;
    }

    req.context = {
      req,
      res,
      user,
      token,
      config,
    };

    next();
  }

  private getCookieConsent(request: ApiRequest) {
    const consent = this.cookies.get(request, COOKIE_CONSENT_COOKIE);
    if (consent == null) {
      return undefined;
    }

    return consent === '1';
  }

  private getRequireCookieConsent(request: ApiRequest) {
    const country = this.getUserCountry(request);
    if (country == null) {
      return true;
    }

    return [
      'at', // Austria
      'be', // Belgium
      'bg', // Bulgaria
      'cy', // Cyprus
      'dk', // Denmark
      'ee', // Estonia
      'fi', // Finland
      'fr', // France
      'hu', // Hungary
      'ie', // Ireland
      'it', // Italy
      'lv', // Latvia
      'lt', // Lithuania
      'lu', // Luxembourg
      'mt', // Malta
      'nl', // Netherlands
      'pl', // Poland
      'pt', // Portugal
      'sk', // Slovakia
      'si', // Slovenia
      'es', // Spain
      'se', // Sweden
      'gb', // United Kingdom
    ].includes(country);
  }

  private getUserCountry(request: ApiRequest) {
    const headers = request.headers;
    const countryHeader = headers['cf-ipcountry'];
    if (countryHeader == null) {
      return undefined;
    }

    return Array.isArray(countryHeader)
      ? countryHeader.join(',').toLowerCase()
      : countryHeader.toLowerCase();
  }

  private async getUser(request: ApiRequest) {
    const cookieUser = await this.getUserFromCookie(request);
    if (cookieUser.user != null) {
      return cookieUser;
    }

    const apiUser = await this.getUserFromApiKey(request);
    if (apiUser.user != null) {
      return apiUser;
    }

    return { user: null, token: null };
  }

  private async getUserFromCookie(
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
      token,
    };
  }

  private async getUserFromApiKey(
    request: ApiRequest,
  ): Promise<{ user: User; token: string }> {
    const authHeader = request.header('authorization');
    if (!authHeader) {
      return { user: null, token: null };
    }

    const [type, key] = authHeader.split(' ');
    if (type.toLowerCase() !== 'bearer') {
      return { user: null, token: null };
    }

    const apiKey = await this.apiKeyRepository.findByKey(key);
    if (apiKey == null) {
      return { user: null, token: null };
    }

    return { user: mapToUserDto(apiKey.user), token: null };
  }
}
