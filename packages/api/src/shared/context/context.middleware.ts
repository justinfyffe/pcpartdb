import { Injectable, NestMiddleware } from '@nestjs/common';
import { mapToUserDto } from '@pcpartdb/database';
import {
  BenchmarkKey,
  Config,
  PREFERRED_CPU_BENCHMARK_HTTP_HEADER,
  PREFERRED_GPU_BENCHMARK_HTTP_HEADER,
  preferredBenchmarkOrDefault,
  PreferredBenchmarks,
  ProductType,
  User,
  UserSettings,
} from '@pcpartdb/shared';
import { NextFunction } from 'express';
import * as uuid from 'uuid';
import { AccessTokenRepository } from '../../auth/access-token.repository';
import { ApiKeyRepository } from '../../auth/api-key.repository';
import { CookieService } from '../cookie/cookie.service';
import { SESSION_COOKIE, SETTINGS_COOKIE } from '../cookie/cookies';
import { hashToken } from '../crypto/utils';
import { ApiRequest, ApiResponse } from '../http/types';
import { Context } from './context';

@Injectable()
export class ContextMiddleware implements NestMiddleware {
  constructor(
    private apiKeyRepository: ApiKeyRepository,
    private accessTokenRepository: AccessTokenRepository,
    private cookies: CookieService,
  ) {}

  async use(req: ApiRequest, res: ApiResponse, next: NextFunction) {
    // TODO: move to separate middleware
    const { user, token } = await this.getUser(req);
    // TODO: move to separate middleware
    const userSettings = await this.getUserSettings(req);

    const config: Config = {
      env: process.env.NODE_ENV ?? 'dev',
      enableGtm: process.env.ENABLE_GTM === 'true',
      gtmId: process.env.GTM_ID,
      adsensePubId: process.env.ADSENSE_PUBLISHER_ID,
      isStaff: user?.isStaff ?? false,
      user,
      userSettings,
    };

    if (process.env.DISABLE_ADS === 'true' || user?.isStaff) {
      config.disableAds = true;
    }

    const context: Context = {
      req,
      res,
      user,
      token,
      config,
    };
    req.context = context;

    next();
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

  private async getUserSettings(request: ApiRequest): Promise<UserSettings> {
    const preferredBenchmarks = await this.getPreferredBenchmarks(request);

    return {
      preferredBenchmarks,
    };
  }

  private async getPreferredBenchmarks(
    request: ApiRequest,
  ): Promise<PreferredBenchmarks> {
    const headerBenchmarks = this.getPreferredBenchmarksFromHeader(request);
    const cookieBenchmarks = this.getPreferredBenchmarksFromCookie(request);

    // Priority: Header, Cookie, Default
    let cpuBenchmark =
      headerBenchmarks[ProductType.Cpu] || cookieBenchmarks[ProductType.Cpu];
    let gpuBenchmark =
      headerBenchmarks[ProductType.Gpu] || cookieBenchmarks[ProductType.Gpu];

    // Validate, use default if not valid.
    cpuBenchmark = preferredBenchmarkOrDefault(ProductType.Cpu, cpuBenchmark);
    gpuBenchmark = preferredBenchmarkOrDefault(ProductType.Gpu, gpuBenchmark);
    const result: PreferredBenchmarks = {
      [ProductType.Cpu]: cpuBenchmark,
      [ProductType.Gpu]: gpuBenchmark,
    };

    return result;
  }

  private getPreferredBenchmarksFromHeader(
    request: ApiRequest,
  ): PreferredBenchmarks {
    return {
      [ProductType.Cpu]:
        (request
          .header(PREFERRED_CPU_BENCHMARK_HTTP_HEADER)
          ?.toUpperCase() as BenchmarkKey) || null,
      [ProductType.Gpu]:
        (request
          .header(PREFERRED_GPU_BENCHMARK_HTTP_HEADER)
          ?.toUpperCase() as BenchmarkKey) || null,
    };
  }

  private getPreferredBenchmarksFromCookie(
    request: ApiRequest,
  ): PreferredBenchmarks {
    let cpuBenchmark: BenchmarkKey = null;
    let gpuBenchmark: BenchmarkKey = null;

    const base64Settings = this.cookies.get(request, SETTINGS_COOKIE);
    if (base64Settings != null) {
      try {
        const settings = JSON.parse(
          Buffer.from(base64Settings, 'base64').toString('utf-8'),
        ) as UserSettings;
        cpuBenchmark = settings.preferredBenchmarks[ProductType.Cpu] || null;
        gpuBenchmark = settings.preferredBenchmarks[ProductType.Gpu] || null;
      } catch (e) {
        console.warn('Invalid cookie benchmark. Will use default.');
      }
    }

    return {
      [ProductType.Cpu]: cpuBenchmark,
      [ProductType.Gpu]: gpuBenchmark,
    };
  }
}
